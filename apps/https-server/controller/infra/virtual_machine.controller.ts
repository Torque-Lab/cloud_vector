import { pushVmToQueueToCreate, pushVmToQueueToDelete, vmQueue} from "@cloud/backend-common"
import { prismaClient } from "@cloud/db"
import type { Request, Response } from "express"
import { generateCuid } from "../../utils/random"
import { vmSchema } from "@cloud/backend-common/types"
import { 
  resourceProvisionedTotal, 
  resourceDeletedTotal, 
  userActivityTotal 
} from '../../moinitoring/promotheous';
import { logBusinessOperation ,logError,logAudit} from '../../moinitoring/Log-collection/winston';

export const createVm=async(req:Request,res:Response)=>{
    try {
        const userId=req.userId
        const parsedData= vmSchema.safeParse(req.body)
        if(!parsedData.success){
            return res.status(400).json({message:"All fields are required",success:false})
        }
        const user=await prismaClient.subscription.findUnique({
            where:{
                userBaseAdminId:userId
            },
            include:{
                tierRule:true
            }
        })
        const vm=parsedData.data
        const vmId=generateCuid()
        const subscriptionPlan=user?.tierRule?.tier
        const success=await pushVmToQueueToCreate(vmQueue.CREATE,{...vm,vmId:vmId,subscriptionPlan:subscriptionPlan ?subscriptionPlan :"FREE"})
        if(!success){
            return res.status(500).json({message:"Failed to push vm to queue",success:false})
        }
        const vmCreated=await prismaClient.virtualMachine.create({
            data:{
                projectId:vm.projectId,
                vm_name:vm.name,
                id:vmId,
                public_key:vm.publicKey,
                host:"",
                is_active:true,
                is_provisioned:false,
                memory:vm.memory,
                cpu:vm.vCpu,
                storage:vm.storage,
                region:vm.region,
                
               
            }
        })
        
        //start metric
        {
          userActivityTotal.inc({ 
            activity_type: 'create_vm', 
            user_tier: user?.tierRule?.tier || 'unknown'
          });
          logBusinessOperation("create_vm","vm",{
            vmId,
            userId,
            tier:user?.tierRule?.tier || 'unknown'
          })
        }
        
        return res.status(201).json({message:"Vm created successfully",success:true})

       
    } catch (error) {
        logError(error instanceof Error ? error : new Error("Failed to create vm"));
        return res.status(500).json({message:"Failed to create vm",success:false})
    }
    
}
export const updateVm=async(req:Request,res:Response)=>{  
}
export const deleteVm=async(req:Request,res:Response)=>{
    try {
        const vmId=req.params.vmId as string
        const userId=req.userId
        if(!vmId){
            return res.status(400).json({message:"Vm id is required",success:false})
        }
        const success=await pushVmToQueueToDelete(vmQueue.DELETE,vmId)
        if(!success){
            return res.status(500).json({message:"Failed to push vm to queue",success:false})
        }
     const [vm,subscription]=await Promise.all([
        prismaClient.virtualMachine.update({
            where:{
                id:vmId
            },
            data:{
                is_active:false
            }
        }),
        prismaClient.subscription.findUnique({
            where:{
                userBaseAdminId:userId
            },
            include:{
                tierRule:true
            }
        })
     ])
        
       {
         resourceDeletedTotal.inc({ 
          resource_type: 'vm', 
          tier: subscription?.tierRule?.tier || 'unknown'
        });
        userActivityTotal.inc({ 
          activity_type: 'delete_vm', 
          user_tier: subscription?.tierRule?.tier || 'unknown'
        });
       }
        
        return res.status(200).json({message:"Vm deleted successfully",success:true})
    } catch (error) {
        logError(error instanceof Error ? error : new Error("Failed to delete vm"));
        return res.status(500).json({message:"Failed to delete vm",success:false})
    }
    
}
export const getAllVm=async(req:Request,res:Response)=>{
    console.log("getAllVm",req.userId)
    try {
        const userId=req.userId as string
        const projectAll=await prismaClient.project.findMany({
            where:{
                userBaseAdminId:userId
            }
        })
        const projectIds=projectAll.map((project)=>project.id)
        if(projectIds.length===0){
            return res.status(200).json({message:"No project found",success:true,data:[]})
        }

        const vms=await prismaClient.virtualMachine.findMany({
            where:{
                projectId:{
                    in:projectIds
                }
            }
        })

        const vmData=vms.map((vm)=>{
            return {
                ...vm,
                projectName:projectAll.find((project)=>project.id===vm.projectId)?.name,
                projectId:vm.projectId,
                ipAdress:vm.host,
                region:"",
                status:vm.is_active,
                createdAt:vm.createdAt,
                updatedAt:vm.updatedAt,
                description:"",
                
            }
        })

        {
          userActivityTotal.inc({ 
            activity_type: 'get_vm', 
            user_tier: "unknown"
          });
          logBusinessOperation("get_vm","vm",{
            AllVm:vms.map((vm)=>vm.id),
            userId,
            tier:"unknown"
          })
        }
        return res.status(200).json({message:"Vm fetched successfully",success:true,vms:vmData})
    } catch (error) {
        logError(error instanceof Error ? error : new Error("Failed to fetch vm"));
            return res.status(500).json({message:"Failed to fetch vm",success:false})
    }
    
}

export const getVm=async(req:Request,res:Response)=>{
    try {
        const vmId=req.params.vmId as string
        if(!vmId){
            return res.status(400).json({message:"Vm id is required",success:false})
        }
        const vm=await prismaClient.virtualMachine.findUnique({
            where:{
                id:vmId
            }
        })
        const vmData={
            ...vm,
               projectId:vm?.projectId,
                ipAdress:vm?.host,
                region:vm?.region,
                status:vm?.is_active,
                createdAt:vm?.createdAt,
                updatedAt:vm?.updatedAt,
                description:"",
                vCpu:vm?.cpu,
              

        }


        {
            userActivityTotal.inc({ 
                activity_type: 'get_vm', 
                user_tier: "unknown"
              });

                logBusinessOperation("get_vm","vm",{
                    vmId,
                    userId:"anonymous",
                    tier:"unknown"
                })
        }
        return res.status(200).json({message:"Vm fetched successfully",success:true,vm:vmData})
    } catch (error) {
        logError(error instanceof Error ? error : new Error("Failed to fetch vm"));
        return res.status(500).json({message:"Failed to fetch vm",success:false})
    }
    
}
import { pushVmToQueueToCreate, pushVmToQueueToDelete, vmQueue, vmSchema } from "@cloud/backend-common"
import { prismaClient } from "@cloud/db"
import type { Request, Response } from "express"
import { generateCuid } from "../../utils/random"

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
        const subscriptionPlan=user?.tierRule.tier
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
                is_provisioned:false
                
               
            }
        })
        return res.status(201).json({message:"Vm created successfully",success:true})


    } catch (error) {
      
        return res.status(500).json({message:"Failed to create vm",success:false})
    }
    
}
export const updateVm=async(req:Request,res:Response)=>{  
}
export const deleteVm=async(req:Request,res:Response)=>{
    try {
        const vmId=req.params.vmId as string
        if(!vmId){
            return res.status(400).json({message:"Vm id is required",success:false})
        }
        const success=await pushVmToQueueToDelete(vmQueue.DELETE,vmId)
        if(!success){
            return res.status(500).json({message:"Failed to push vm to queue",success:false})
        }
        const vmDeleted=await prismaClient.virtualMachine.update({
            where:{
                id:vmId
            },
            data:{
                is_active:false
            }
        })
        return res.status(200).json({message:"Vm deleted successfully",success:true})
    } catch (error) {
        return res.status(500).json({message:"Failed to delete vm",success:false})
    }
    
}
export const getAllVm=async(req:Request,res:Response)=>{
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
        return res.status(200).json({message:"Vm fetched successfully",success:true,vms:vmData})
    } catch (error) {
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
                region:"",
                status:vm?.is_active,
                createdAt:vm?.createdAt,
                updatedAt:vm?.updatedAt,
                description:"",

        }
        return res.status(200).json({message:"Vm fetched successfully",success:true,vm:vmData})
    } catch (error) {
        return res.status(500).json({message:"Failed to fetch vm",success:false})
    }
    
}
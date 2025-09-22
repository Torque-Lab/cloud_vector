import axios from "axios";
import type { Request, Response } from "express";
import { PermissionList, prismaClient, ProvisioningFlowStatus } from "@cloud/db";
import { postgresqlSchema, projectSchema} from "@cloud/backend-common";
import { pushInfraConfigToQueueToCreate,pushInfraConfigToQueueToDelete } from "@cloud/backend-common";
import { encrypt, generateUsername } from "../../utils/encrypt-decrypt";
import { generateRandomString } from "../auth/auth.controller";

function generateCuid(){
    return Bun.randomUUIDv7()
}
export const createProject=async(req:Request,res:Response)=>{
    try {
        const { name, description } = projectSchema.parse(req.body);
       const project=prismaClient.project.create({
        data:{
            name,
            description,
            userBaseAdmin:{
                connect:{
                    id:req.userId
                }
            }
        }
       })
       if(!project){
           res.status(500).json({ message: "Failed to create project",success:false });
       }
       res.status(200).json({ message: "Project created successfully",success:true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create project", error });
    }
}
export const getProject=async (req:Request,res:Response)=>{
    try {
        const data=await prismaClient.project.findMany({
            where:{
                userBaseAdmin:{
                    id:req.userId
                }
            }
        })
        if(!data){
            res.status(404).json({ message: "Projects not found",success:false });
            return;
        }
        res.status(200).json({ projects:data,success:true });
    } catch (error) {
        
        res.status(500).json({ message: "Failed to get projects",success:false });
    }
}
export const createPostgresInstance=async(req:Request,res:Response)=>{

    try {
        const parsedData=postgresqlSchema.safeParse(req.body);
        let namespace=""
        if(!parsedData.success){
            res.status(400).json({ message: "Invalid data",success:false });
            return;
        }
        const user=await prismaClient.userBaseAdmin.findUnique({
            where:{
                id:req.userId
            },
        })
        if(!user){
            const isHasCreatePermission = await prismaClient.permission.findFirst({
                where: {
                  id: req.userId,
                },
                include: {
                  permissionItems: {
                    where: {
                      permission: PermissionList.CREATE_POSTGRES,
                    },
                  },
                },
              });
              
              if(isHasCreatePermission?.permissionItems.length===0){
                res.status(403).json({ message: "You don't have permission to create postgres",success:false });
                return;
              }
              const subscription=await prismaClient.subscription.findUnique({
                where:{
                    userBaseAdminId:req.userId
                },
                include:{
                    tierRule:true
                }
              })
             if(subscription?.tier==="FREE"){
                const postgresDBCount=await prismaClient.postgresDB.count({
                    where:{
                        projectId:parsedData.data.projectId
                    }
                })
                if(postgresDBCount>=subscription?.tierRule.Max_Databases){
                    res.status(403).json({ message: "You don't have enough databases",success:false });
                    return;
                }

                if(parseMemory(parsedData.data.initialMemory)>parseMemory(subscription?.tierRule.initialMemory) || parseMemory(parsedData.data.maxMemory)>parseMemory(subscription?.tierRule.maxMemory) || parseMemory(parsedData.data.initialStorage)>parseMemory(subscription?.tierRule.initialStorage) || parseMemory(parsedData.data.maxStorage)>parseMemory(subscription?.tierRule.maxStorage) || parseMemory(parsedData.data.initialVCpu)>parseMemory(subscription?.tierRule.initialVCpu) || parseMemory(parsedData.data.maxVCpu)>parseMemory(subscription?.tierRule.maxVCpu)){
                    res.status(403).json({ message: "You don't have enough resources",success:false });
                    return;
                }
                namespace="free-user-ns"
             }
             if(subscription?.tier==="BASE"){
                const postgresDBCount=await prismaClient.postgresDB.count({
                    where:{
                        projectId:parsedData.data.projectId
                    }
                })
                if(postgresDBCount>=subscription?.tierRule.Max_Databases){
                    res.status(403).json({ message: "You don't have enough databases",success:false });
                    return;
                }
                if(parseMemory(parsedData.data.initialMemory)>parseMemory(subscription?.tierRule.initialMemory) || parseMemory(parsedData.data.maxMemory)>parseMemory(subscription?.tierRule.maxMemory) || parseMemory(parsedData.data.initialStorage)>parseMemory(subscription?.tierRule.initialStorage) || parseMemory(parsedData.data.maxStorage)>parseMemory(subscription?.tierRule.maxStorage) || parseMemory(parsedData.data.initialVCpu)>parseMemory(subscription?.tierRule.initialVCpu) || parseMemory(parsedData.data.maxVCpu)>parseMemory(subscription?.tierRule.maxVCpu)){
                    res.status(403).json({ message: "You don't have enough resources",success:false });
                    return;
                }
                namespace="base-user-ns"
             }
             if(subscription?.tier==="PRO"){
                const postgresDBCount=await prismaClient.postgresDB.count({
                    where:{
                        projectId:parsedData.data.projectId
                    }
                })
                if(postgresDBCount>=subscription?.tierRule.Max_Databases){
                    res.status(403).json({ message: "You don't have enough databases",success:false });
                    return;
                }
                if(parseMemory(parsedData.data.initialMemory)>parseMemory(subscription?.tierRule.initialMemory) || parseMemory(parsedData.data.maxMemory)>parseMemory(subscription?.tierRule.maxMemory) || parseMemory(parsedData.data.initialStorage)>parseMemory(subscription?.tierRule.initialStorage) || parseMemory(parsedData.data.maxStorage)>parseMemory(subscription?.tierRule.maxStorage) || parseMemory(parsedData.data.initialVCpu)>parseMemory(subscription?.tierRule.initialVCpu) || parseMemory(parsedData.data.maxVCpu)>parseMemory(subscription?.tierRule.maxVCpu)){
                    res.status(403).json({ message: "You don't have enough resources",success:false });
                    return;
                }
                namespace="pro-user-ns"+generateCuid()
             }
              const db_id=generateCuid();

        const success=await pushInfraConfigToQueueToCreate("postgres_create_queue",{...parsedData.data,resource_id:db_id,namespace})
        if(!success){
            res.status(500).json({ message: "Failed to add task to queue",success:false });
            return;
        }

        const postgresDB=await prismaClient.postgresDB.create({
            data:{
                id:db_id,
                projectId:parsedData.data.projectId,
                database_name:parsedData.data.name,
                username:generateUsername(),
                password:await encrypt(generateRandomString(),process.env.ENCRYPT_SECRET || "BHggjvTfPlIYmIOjbbut"),
                port:"5672",
                

                
            }
        })
        res.status(200).json({ message: "Task added to Queue to provisioned",success:true });
    } }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add task to queue", error });
    }
}
export const deletePostgres = async (req: Request, res: Response) => {
    try {
      const { db_id } = req.body as { db_id: string };
      const response = await pushInfraConfigToQueueToDelete("postgres_delete_queue",db_id)
  
      if (!response) {
        res.status(500).json({ message: "Failed to add task to queue", success: false });
        return;
      }
  
      res.status(200).json({ message: "Task added to Queue for destructon", success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to add task to queue", error });
    }
  };
export const postgresStatusWebhook=async(req:Request,res:Response)=>{
    try {
        const {projectId,status}=req.body as {projectId:string,status:string};
        let statusEnum:ProvisioningFlowStatus;
        if(status==="Pushed to ArgoCD"){
            statusEnum=ProvisioningFlowStatus.PUSHED_TO_ARGOCD;
        }else if(status==="Synced to ArgoCD"){
            statusEnum=ProvisioningFlowStatus.SYNCED_TO_ARGOCD;
        }else if(status==="Completed"){
            statusEnum=ProvisioningFlowStatus.COMPLETED;
        }else{
            statusEnum=ProvisioningFlowStatus.FAILED;
        }
        const response=await prismaClient.postgresDB.update({
            data:{
                provisioning_flow_status:statusEnum
            },
            where:{
                projectId:projectId
            }
        })
        res.status(200).json({ message: statusEnum,success:true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update postgresDB status", error });
    }
}
export const getPostgresStatus=async(req:Request,res:Response)=>{
    try {
        const {projectId}=req.body as {projectId:string};
        const response=await prismaClient.postgresDB.findUnique({
            where:{
                projectId:projectId
            }
        })
        res.status(200).json({ postgresDB:response,success:true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get postgresDB status", error });
    }
}
export const updatePostgres=async(req:Request,res:Response)=>{
    try {
        const {projectId}=req.body as {projectId:string};
        const response=await prismaClient.postgresDB.update({
            data:{
                username:generateUsername(),
                password:await encrypt(generateRandomString(),process.env.ENCRYPT_SECRET || "BHggjvTfPlIYmIOjbbut"),
            },
            where:{
                projectId:projectId
            }
        })
        res.status(200).json({ postgresDB:response,success:true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update postgresDB status", error });
    }
}

function parseMemory(str:string) {
    if (!str) return 0;
    const num = parseInt(str, 10);
    if (str.endsWith("Mi")) return num * 1024 * 1024;
    if (str.endsWith("Gi")) return num * 1024 * 1024 * 1024;
    return num;
  }
  
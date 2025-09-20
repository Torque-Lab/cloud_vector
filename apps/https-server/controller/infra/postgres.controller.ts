import axios from "axios";
import type { Request, Response } from "express";
import { PermissionList, prismaClient, ProvisioningFlowStatus } from "@cloud/db";
import { postgresqlSchema, projectSchema} from "@cloud/backend-common";
import { pushInfraConfigToQueueToCreate,pushInfraConfigToQueueToDelete } from "@cloud/backend-common";
import { encrypt, generateUsername } from "../../utils/encrypt-decrypt";
import { generateRandomString } from "../auth/auth.controller";


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

        const success=await pushInfraConfigToQueueToCreate("postgres_create_queue",parsedData.data)
        if(!success){
            res.status(500).json({ message: "Failed to add task to queue",success:false });
            return;
        }

        const postgresDB=await prismaClient.postgresDB.create({
            data:{
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
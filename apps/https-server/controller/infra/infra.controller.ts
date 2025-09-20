import axios from "axios";
import type { Request, Response } from "express";
import { PermissionList, prismaClient } from "@cloud/db";
import { postgresqlSchema, projectSchema} from "@cloud/backend-common";
import { pushInfraConfigToQueueToCreate,pushInfraConfigToQueueToDelete } from "@cloud/backend-common";
import { encrypt, generateUsername } from "../../utils/encrypt-decrypt";
import { generateRandomString } from "../auth/auth.controller";
const infraUrl= process.env.INFRA_URL || "http://localhost:3000/provisioner";


export const infraCreation = async (req: Request, res: Response) => {
    try {
        const { db_id } = req.body;
        const {database_config}=req.body;
        const userId=req.userId;
        const user = await prismaClient.userBaseAdmin.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                createdAt: true,
            },
        });
        if (!user) {
            res.status(401).json({ error: "User not found",success:false });
            return;
        }

  const response = await axios.post(`${infraUrl}/vectordb`, { db_id,database_config });
    if(!response.data.success){
        res.status(500).json({ message: "Failed to provision DB app",success:false });
        return;
    }
    res.status(200).json({ message: "DB app provisioned successfully",success:true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to provision DB app", error });
    }
};

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

export const createCustomInfra=async(req:Request,res:Response)=>{
    try {
        const resourceConfig=req.body;
        const response=await axios.post(`${infraUrl}/custom`, { resourceConfig });
        if(!response.data.success){
            res.status(500).json({ message: "Failed to provision resource",success:false });
            return;
        }
        res.status(200).json({ message: "Your resource provisioned successfully",success:true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to provision resource", error });
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
                  permissionItems: {
                    some: {
                      permission: PermissionList.CREATE_POSTGRES,
                    },
                  },
                },
              });
              if(!isHasCreatePermission){
                res.status(403).json({ message: "You don't have permission to create postgres",success:false });
                return;
              }

        const success=await pushInfraConfigToQueueToCreate  ("postgres_create_queue",parsedData.data)
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
  

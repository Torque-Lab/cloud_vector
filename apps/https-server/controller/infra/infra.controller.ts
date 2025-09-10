import axios from "axios";
import type { Request, Response } from "express";
import { prismaClient } from "@cloud/db";
import { postgresqlSchema} from "@cloud/backend-common";
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
                name: true,
                createdAt: true,
            },
        });
        if (!user) {
            res.status(401).json({ error: "User not found",success:false });
            return;
        }

        const database=prismaClient.database.create({
            data: {
                    id: db_id,
                    name: db_id,
                    projectId: user.id,
                    is_active: true,
                    is_provisioned: false,
                    api_key: "",
                    db_url: "",
          
            },  
          });

  const response = await axios.post(`${infraUrl}/vectordb`, { db_id,database_config });
    if(response.data.success){
        res.status(200).json({ message: "DB app provisioned successfully",success:true });
    }else{
        res.status(500).json({ message: "Failed to provision DB app",success:false });
    }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to provision DB app", error });
    }
};

export const createCustomInfra=async(req:Request,res:Response)=>{
    try {
        const resourceConfig=req.body;
        const response=await axios.post(`${infraUrl}/custom`, { resourceConfig });
        if(response.data.success){
            res.status(200).json({ message: "Your resource provisioned successfully",success:true });
        }else{
            res.status(500).json({ message: "Failed to provision resource",success:false });
        }
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
        const response=await axios.post(`${infraUrl}/postgres-create`, { database_config:parsedData.data });
        if(response.data.success){
            res.status(200).json({ message: "Task added to Queue",success:true });
        }else{
            res.status(500).json({ message: "Failed to add task to queue",success:false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add task to queue", error });
    }
}
export const deletePostgres=async(req:Request,res:Response)=>{
    try {
        const {db_id}=req.body;
        const response=await axios.post(`${infraUrl}/postgres-delete`, { db_id });
        if(response.data.success){
            res.status(200).json({ message: "Task added to Queue",success:true });
        }else{
            res.status(500).json({ message: "Failed to add task to queue",success:false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add task to queue", error });
    }
}

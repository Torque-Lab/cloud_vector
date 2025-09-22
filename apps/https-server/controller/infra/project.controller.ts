import type { Request, Response } from "express";
import { projectSchema } from "@cloud/backend-common";
import { prismaClient } from "@cloud/db";



export const createProject=async(req:Request,res:Response)=>{
    try {
        const { name, description } = projectSchema.parse(req.body);
        const countProject=await prismaClient.project.count({
            where:{
                userBaseAdmin:{
                    id:req.userId
                }
            }
        })
        const subscription=await prismaClient.subscription.findUnique({
            where:{
                userBaseAdminId:req.userId
            },
            include:{
                tierRule:true
            }
        })
        if(countProject>=subscription?.tierRule?.Max_Projects!){
            res.status(403).json({ message: "You don't have enough projects",success:false });
            return;
        }
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
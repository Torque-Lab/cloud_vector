import type { Request, Response } from "express";
import { projectSchema } from "@cloud/backend-common";
import { prismaClient } from "@cloud/db";
import type {ProjectData} from "@cloud/shared_types"

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
export const getProjects=async (req:Request,res:Response)=>{
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

export const getProjectDetails=async (req:Request,res:Response)=>{
    const userId=req.userId

    try{
    const projects=await prismaClient.project.findMany({
        where:{
            userBaseAdminId:userId
        },
        select:{
            id:true,
            description:true,
            name:true,
            status:true,
            cost:true,
            createdAt:true,
            
        }
    })

    const projectId=projects?.map((project)=>project.id)
    const [postgresCount,redisCount,rabbitmqCount,vmCoun]=await Promise.all([
        prismaClient.postgresDB.count({
            where:{
                projectId:{
                    in:projectId
                }
            }
        }),
        prismaClient.redis.count({
            where:{
                projectId:{
                    in:projectId
                }
            }
        }),
        prismaClient.rabbitMQ.count({
            where:{
                projectId:{
                    in:projectId
                }
            }
        }),
        prismaClient.virtualMachine.count({
            where:{
                projectId:{
                    in:projectId
                }
            }
        })
    ])

    const finalProjectData=projects?.map((project)=>({
        id:project.id,
        description:project.description,
        name:project.name,
        status:project.status,
        cost:project.cost,
        createdAt:project.createdAt,
        postgres:postgresCount,
        redis:redisCount,
        rabbitMQ:rabbitmqCount,
        vm:vmCoun
    }))
    if(!projects){
        res.status(404).json({ ProjectData:[],message: "Projects not found",success:false });
        return;
    }

 res.status(200).json({ ProjectData:finalProjectData,message: "All project details",success:true });

    }catch(e){
        res.status(500).json({ ProjectData:[],message: "Failed to get project details",success:false });
    }
}
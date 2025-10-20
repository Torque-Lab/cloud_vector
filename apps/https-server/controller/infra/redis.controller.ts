
import type { Request, Response } from "express";
import { PermissionList, prismaClient, } from "@cloud/db";
import { redisSchema, decrypt} from "@cloud/backend-common";
import { pushInfraConfigToQueueToCreate,pushInfraConfigToQueueToDelete } from "@cloud/backend-common";
import { encrypt, generateUsername } from "@cloud/backend-common";
import { generateRandomString } from "../auth/auth.controller";
import { parseMemory } from "../../utils/parser";
import { generateCuid } from "../../utils/random";
import { redisQueue } from "@cloud/backend-common";
import {CONTROL_PLANE_URL, CUSTOMER_REDIS_HOST} from "../config/config"
import axios from "axios";


const REDIS_ENCRYPT_SALT=process.env.REDIS_ENCRYPT_SALT!
const REDIS_ENCRYPT_SECRET=process.env.REDIS_ENCRYPT_SECRET!

export const createRedisInstance=async(req:Request,res:Response)=>{

    try {
        const parsedData=redisSchema.safeParse(req.body);
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
                      permission: PermissionList.CREATE_REDIS,
                    },
                  },
                },
              });
              
              if(isHasCreatePermission?.permissionItems.length===0){
                res.status(403).json({ message: "You don't have permission to create redis",success:false });
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

              let totalResources = 0;
              let projects = await prismaClient.project.findMany({
                where: { userBaseAdminId: req.userId },
                select: { id: true },
              });
              if(!projects){
                projects=await prismaClient.project.findMany({
                  where: { userId: req.userId },
                  select: { id: true },
                });
              }
            
              const projectIds = projects.map(p => p.id);
              if(projectIds.length===0){
                res.status(403).json({ message: "You don't have any project",success:false });
                return;
              }
            
            
                const [rabbitmqCount, postgresDBCount, redisCount, vectorDBCount, virtualMachinesCount] = await Promise.all([
                  prismaClient.rabbitMQ.count({ where: { projectId: { in: projectIds } } }),
                  prismaClient.postgresDB.count({ where: { projectId: { in: projectIds } } }),
                  prismaClient.redis.count({ where: { projectId: { in: projectIds } } }),
                  prismaClient.vectorDB.count({ where: { projectId: { in: projectIds } } }),
                  prismaClient.virtualMachine.count({ where: { projectId: { in: projectIds } } }),
                ]);
            
                totalResources =
                  rabbitmqCount +
                  postgresDBCount +
                  redisCount +
                  vectorDBCount +
                  virtualMachinesCount 
              

              if (subscription?.tier === "FREE") {
                if(totalResources>=subscription?.tierRule.Max_Resources!){
                    res.status(403).json({ message: "You don't have enough resources",success:false });
                    return;
                }

                if(parseMemory(parsedData.data.initialMemory)>parseMemory(subscription?.tierRule.initialMemory!) || parseMemory(parsedData.data.maxMemory)>parseMemory(subscription?.tierRule.maxMemory!) || parseMemory(parsedData.data.initialStorage)>parseMemory(subscription?.tierRule.initialStorage!) || parseMemory(parsedData.data.maxStorage)>parseMemory(subscription?.tierRule.maxStorage!) || parseMemory(parsedData.data.initialVCpu)>parseMemory(subscription?.tierRule.initialVCpu!) || parseMemory(parsedData.data.maxVCpu)>parseMemory(subscription?.tierRule.maxVCpu!)){
                    res.status(403).json({ message: "You don't have enough resources",success:false });
                    return;
                }
                namespace="free-user-ns"
             
            

              }
              

             if(subscription?.tier==="BASE"){
              
                if(totalResources>=subscription?.tierRule.Max_Resources){
                    res.status(403).json({ message: "You don't have enough resources",success:false });
                    return;
                }
                if(parseMemory(parsedData.data.initialMemory)>parseMemory(subscription?.tierRule.initialMemory) || parseMemory(parsedData.data.maxMemory)>parseMemory(subscription?.tierRule.maxMemory) || parseMemory(parsedData.data.initialStorage)>parseMemory(subscription?.tierRule.initialStorage) || parseMemory(parsedData.data.maxStorage)>parseMemory(subscription?.tierRule.maxStorage) || parseMemory(parsedData.data.initialVCpu)>parseMemory(subscription?.tierRule.initialVCpu) || parseMemory(parsedData.data.maxVCpu)>parseMemory(subscription?.tierRule.maxVCpu)){
                    res.status(403).json({ message: "You don't have enough resources",success:false });
                    return;
                }
                namespace="base-user-ns"
             }
             if(subscription?.tier==="PRO"){
                if(totalResources>=subscription?.tierRule.Max_Resources){
                    res.status(403).json({ message: "You don't have enough resources",success:false });
                    return;
                }
                if(parseMemory(parsedData.data.initialMemory)>parseMemory(subscription?.tierRule.initialMemory) || parseMemory(parsedData.data.maxMemory)>parseMemory(subscription?.tierRule.maxMemory) || parseMemory(parsedData.data.initialStorage)>parseMemory(subscription?.tierRule.initialStorage) || parseMemory(parsedData.data.maxStorage)>parseMemory(subscription?.tierRule.maxStorage) || parseMemory(parsedData.data.initialVCpu)>parseMemory(subscription?.tierRule.initialVCpu) || parseMemory(parsedData.data.maxVCpu)>parseMemory(subscription?.tierRule.maxVCpu)){
                    res.status(403).json({ message: "You don't have enough resources",success:false });
                    return;
                }
                namespace="pro-user-ns"+generateCuid()
             }
              const redisId=generateCuid();

        const success=await pushInfraConfigToQueueToCreate(redisQueue.CREATE,{...parsedData.data,resource_id:redisId,namespace})
        if(!success){
            res.status(500).json({ message: "Failed to add task to queue",success:false });
            return;
        }

        await prismaClient.redis.create({
            data:{
                id: redisId,
                projectId:parsedData.data.projectId,
                redis_name:parsedData.data.name,
                username:generateUsername(),
                password: encrypt(generateRandomString(),REDIS_ENCRYPT_SECRET,REDIS_ENCRYPT_SALT),
                port:"6379",
                namespace:namespace,
                initialMemory:parsedData.data.initialMemory,
                maxMemory:parsedData.data.maxMemory,
                initialVCpu:parsedData.data.initialVCpu,
                maxVCpu:parsedData.data.maxVCpu,
                initialStorage:parsedData.data.initialStorage,
                maxStorage:parsedData.data.maxStorage,
                autoScale:parsedData.data.autoScale==="true",
                
                
            }
        })
        res.status(200).json({ message: "Task added to Queue to provisioned",success:true });
    } }catch (error) {
       
        res.status(500).json({ message: "Failed to add task to queue", success:false });
    }
}
export const deleteRedisInstance= async (req: Request, res: Response) => {
    try {
      const  redisId  = req.params.id;
      if(!redisId){
        res.status(400).json({ message: "Invalid redisId", success: false });
        return;
      }
      const response = await pushInfraConfigToQueueToDelete(redisQueue.DELETE,redisId)
  
      if (!response) {
        res.status(500).json({ message: "Failed to add task to queue", success: false });
        return;
      }
  await prismaClient.redis.update({
    where:{
      id:redisId
    },
    data:{
      is_active:false
    }
  })
      res.status(200).json({ message: "Task added to Queue for destructon", success: true });
    } catch (error) {
      
      res.status(500).json({ message: "Failed to add task to queue", success:false });
    }
  };
export const getRedisStatus=async(req:Request,res:Response)=>{
    try {
        const redisId=req.params.id ;
        if(!redisId){
            res.status(400).json({ message: "Invalid redisId", success: false });
            return;
        }
        const redisStatus=await prismaClient.redis.findUnique({
            where:{
                id:redisId
            }
        })
        res.status(200).json({ redisStatus:redisStatus?.provisioning_flow_status,success:true });
    } catch (e) {
      
        res.status(500).json({ message: "Failed to get redis status", success:false });
    }
}
export const resetRedisInstance=async(req:Request,res:Response)=>{
    try {
        const redisId=req.params.id;
        if(!redisId){
            res.status(400).json({ message: "Invalid redisId", success: false });
            return;
        }
        const password=generateRandomString()
        const encryptedPassword=encrypt(password,REDIS_ENCRYPT_SECRET,REDIS_ENCRYPT_SALT);
        const response=await prismaClient.redis.update({
            data:{
                username:generateUsername(),
                password:encryptedPassword,
            },
            where:{
                id:redisId
            }
        })
        const updateProxyPlane= await axios.post(CONTROL_PLANE_URL+"/api/redis/routetable",{
            resource_id:redisId,
            username:response?.username,
            password:response?.password,
            
        })
        const connectionString=`amqp://${response?.username}:${password}@${CUSTOMER_REDIS_HOST}:${response?.port}/`
        res.status(200).json({ message:"Redis updated successfully",success:true ,connectionString:connectionString});
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Failed to update redis status",success:false });
    }
}
export const getAllRedisInstance = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const allProjects = await prismaClient.project.findMany({
      where: { userBaseAdminId: userId },
      select: { id: true, name: true }
    });

    const projectIds = allProjects.map((p) => p.id);

    if (projectIds.length === 0) {
      return res.status(200).json({ redis: [], success: true });
    }

    const allRedis = await prismaClient.redis.findMany({
      where: { projectId: { in: projectIds } },
      select: {
        projectId: true,
        id: true,
        redis_name: true,
        is_provisioned: true,
        initialMemory: true,
        region: true,
        createdAt: true,
        updatedAt: true,
        autoScale: true,
        initialStorage: true,
        maxStorage: true,
        initialVCpu: true,
        maxVCpu: true,
        backUpFrequency: true,
        maxMemory: true,
      }
    });

  const projectMap = new Map(allProjects.map(p => [p.id, p.name]));
const finalRedis = allRedis.map(q => ({
  ...q,
  name:q.redis_name,
  projectName: projectMap.get(q.projectId)
}));

    res.status(200).json({ redis: finalRedis,message:"Redis list", success: true });
  } catch (_) {
    res.status(500).json({ redis:[],message: "Failed to get redis status", success: false });
  }
};
export const getOneRedisInstance = async (req: Request, res: Response) => {
    try {
        const redisId=req.params.id;
        if(!redisId){
            res.status(400).json({ message: "Invalid redisId", success: false });
            return;
        }
        const redis=await prismaClient.redis.findUnique({
            where:{
                id:redisId
            },
         select:{
            projectId:true,
            id:true,
            redis_name:true,
            is_provisioned:true,
            initialMemory:true,
            region:true,
            createdAt:true,
            updatedAt:true,
            autoScale:true,
            initialStorage:true,
            maxStorage:true,
            initialVCpu:true,
            maxVCpu:true,
            backUpFrequency:true,
            maxMemory:true,
         }
            
        })
        if(!redis){
            res.status(404).json({redis:{}, message: "Redis not found", success: false });
            return;
        }    
        res.status(200).json({ redis:redis,success:true });
    } catch (_) {
        res.status(500).json({ message: "Failed to get redis status" ,success:false});
    }
}
export const getRedisConnectionString = async (req: Request, res: Response) => {

    try { 
        const redisId=req.params.id;
        if(!redisId){
            res.status(400).json({ message: "Invalid redisId", success: false });
            return;
        }
        const redis=await prismaClient.redis.findUnique({
            where:{
                id:redisId
            },
         select:{
            id:true,
            username:true,
            password:true,
            port:true,
         
         }
            
        })
        if(!redis){
            res.status(404).json({ message: "Redis not found",connectionString:"",success:false });
            return;
        }
        const connectionString=`amqp://${redis.username}:${decrypt(redis.password,REDIS_ENCRYPT_SECRET,REDIS_ENCRYPT_SALT)}@${CUSTOMER_REDIS_HOST}:${redis.port}`
        res.status(200).json({message:"Redis connection string", connectionString:connectionString,success:true });
    } catch (e) {
        res.status(500).json({ message: "Failed to get redis connection string" ,success:false});
    }
}

  
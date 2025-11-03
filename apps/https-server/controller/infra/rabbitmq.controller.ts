
import type { Request, Response } from "express";
import { PermissionList, prismaClient } from "@cloud/db";
import { rabbitmqSchema, decrypt} from "@cloud/backend-common/types";
import { pushInfraConfigToQueueToCreate,pushInfraConfigToQueueToDelete } from "@cloud/backend-common";
import { encrypt, generateUsername } from "@cloud/backend-common";
import { generateRandomString } from "../auth/auth.controller";
import { parseMemory } from "../../utils/parser";
import { generateCuid } from "../../utils/random";
import { rabbitmqQueue } from "@cloud/backend-common";
import {CUSTOMER_RABBIT_HOST} from "../config/config"
import axios from "axios";
import { 
  resourceProvisionedTotal, 
  resourceDeletedTotal, 
  userActivityTotal 
} from '../../moinitoring/promotheous';
import { logBusinessOperation, logAudit,logError } from '../../moinitoring/Log-collection/winston';

const RABBITMQ_ENCRYPT_SALT=process.env.RABBITMQ_ENCRYPT_SALT!
const RABBITMQ_ENCRYPT_SECRET=process.env.RABBITMQ_ENCRYPT_SECRET!
const CONTROL_PLANE_URL = process.env.CONTROL_PLANE_URL!;
export const createRabbitInstance=async(req:Request,res:Response)=>{

    try {
        const parsedData=rabbitmqSchema.safeParse(req.body);
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
                      permission: PermissionList.CREATE_RABBITMQ,
                    },
                  },
                },
              });
              
              if(isHasCreatePermission?.permissionItems.length===0){
                res.status(403).json({ message: "You don't have permission to create rabbitmq",success:false });
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
              

              if (subscription?.tierRule?.tier === "FREE") {
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
              

             if(subscription?.tierRule?.tier==="BASE"){
              
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
             if(subscription?.tierRule?.tier==="PRO"){
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
              const rabbitmqId=generateCuid();

        const success=await pushInfraConfigToQueueToCreate(rabbitmqQueue.CREATE,{...parsedData.data,resource_id:rabbitmqId,namespace,autoScale:parsedData.data.autoScale.toString()})
        if(!success){
            res.status(500).json({ message: "Failed to add task to queue",success:false });
            return;
        }

        await prismaClient.rabbitMQ.create({
            data:{
                id: rabbitmqId,
                projectId:parsedData.data.projectId,
                queue_name:parsedData.data.name,
                username:generateUsername(),
                password: encrypt(generateRandomString(),RABBITMQ_ENCRYPT_SECRET,RABBITMQ_ENCRYPT_SALT),
                port:"5672",
                namespace:namespace,
                initialMemory:parsedData.data.initialMemory,
                maxMemory:parsedData.data.maxMemory,
                initialStorage:parsedData.data.initialStorage,
                maxStorage:parsedData.data.maxStorage,
                initialVCpu:parsedData.data.initialVCpu,
                maxVCpu:parsedData.data.maxVCpu,
                autoScale:parsedData.data.autoScale === "true",
                
                
            }
        })
        
      
         //start metric
      {
        resourceProvisionedTotal.inc({ 
          resource_type: 'rabbitmq', 
          tier: subscription?.tierRule?.tier || 'unknown',
          status: 'queued'
        });
        userActivityTotal.inc({ 
          activity_type: 'create_rabbitmq', 
          user_tier: subscription?.tierRule?.tier || 'unknown'
        });
        
        logBusinessOperation('create_rabbitmq', 'rabbitmq', {
          rabbitmqId,
          userId: "anonymous",
          tier: subscription?.tierRule?.tier || 'unknown',
          projectId: parsedData.data.projectId,
          config: {
            initialMemory: parsedData.data.initialMemory,
            maxMemory: parsedData.data.maxMemory,
            autoScale: parsedData.data.autoScale
          }
        });
        
        logAudit('CREATE_RABBITMQ_INSTANCE', "anonymous", {
          resourceId: rabbitmqId,
          resourceType: 'rabbitmq',
          tier: subscription?.tierRule?.tier || 'unknown'
        });
      }



        res.status(200).json({ message: "Task added to Queue to provisioned",success:true });
    } }catch (error) {
      logError(error instanceof Error ? error : new Error("Failed to add task to queue"));
        res.status(500).json({ message: "Failed to add task to queue",success:false });
    }
}

export const deleteRabbitMQInstance= async (req: Request, res: Response) => {
    try {
      const  rabbitmqId  = req.params.id;
      const userId=req.userId
      if(!rabbitmqId){
        res.status(400).json({ message: "Invalid rabbitmqId", success: false });
        return;
      }
      const response = await pushInfraConfigToQueueToDelete("rabbitmq_delete_queue",rabbitmqId)
  
      if (!response) {
        res.status(500).json({ message: "Failed to add task to queue", success: false });
        return;
      }
 
      const[rabbitmq,subscription]=await Promise.all([
        prismaClient.rabbitMQ.update({
          where:{
            id:rabbitmqId
          },
          data:{
            is_active:false,
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


       //start metric
   {
        resourceDeletedTotal.inc({ 
        resource_type: 'rabbitmq', 
        tier:  subscription?.tierRule?.tier || 'unknown'
      });
      userActivityTotal.inc({ 
        activity_type: 'delete_rabbitmq', 
        user_tier: subscription?.tierRule?.tier || 'unknown'
      });
      logBusinessOperation('delete_rabbitmq', 'rabbitmq', {
        rabbitmqId,
        userId: "anonymous",
        tier: subscription?.tierRule?.tier || 'unknown'
      });
      
      logAudit('DELETE_RABBITMQ_INSTANCE', "anonymous", {
        resourceId: rabbitmqId,
        resourceType: 'rabbitmq'
      });
   }
      
      res.status(200).json({ message: "Task added to Queue for destructon", success: true });
    } catch (error) {
      logError(error instanceof Error ? error : new Error("Failed to add task to queue"));
      res.status(500).json({ message: "Failed to add task to queue",success:false });
    }
  };
export const getRabbitMQStatus=async(req:Request,res:Response)=>{
    try {
        const rabbitmqId=req.params.id ;
        if(!rabbitmqId){
            res.status(400).json({ message: "Invalid rabbitmqId", success: false });
            return;
        }
        const rabbitmqStatus=await prismaClient.rabbitMQ.findUnique({
            where:{
                id:rabbitmqId
            }
        })
         //start metric
        {
        userActivityTotal.inc({ 
          activity_type: 'sent_rabbitmq_status', 
          user_tier: "unknown"
        });
        logBusinessOperation("sent_rabbitmq_status","rabbitmq",{
          rabbitmqId,
          userId:"anonymous",
          tier:"unknown"
        })
        }
          
        res.status(200).json({ rabbitmqStatus:rabbitmqStatus?.provisioning_flow_status,success:true });
    } catch (error) {
      logError(error instanceof Error ? error : new Error("Failed to get rabbitmq status"));
        res.status(500).json({ message: "Failed to get rabbitmq status",success:false });
    }
}
export const resetRabbitInstance=async(req:Request,res:Response)=>{
    try {
        const rabbitmqId=req.params.id;
        if(!rabbitmqId){
            res.status(400).json({ message: "Invalid rabbitmqId", success: false });
            return;
        }
        const password=generateRandomString()
        const oldCred=await prismaClient.rabbitMQ.findUnique({
            where:{
                id:rabbitmqId
            }
        })
        const encryptedPassword=encrypt(password,RABBITMQ_ENCRYPT_SECRET,RABBITMQ_ENCRYPT_SALT);
        const response=await prismaClient.rabbitMQ.update({
            data:{
                username:generateUsername(),
                password:encryptedPassword,
            },
            where:{
                id:rabbitmqId
            }
        })
        const updateProxyPlane= await axios.post<{message:string,backend_url:string,success:boolean}>(CONTROL_PLANE_URL+"/api/v1/infra/rabbit/route-table-update",{
            resource_id:rabbitmqId,
            old_key:oldCred?.username+":"+oldCred?.password+":"+oldCred?.queue_name,
            new_key:response?.username+":"+response?.password+":"+response?.queue_name,
            namespace:oldCred?.namespace,
        })
        if(updateProxyPlane.status!=200){
            res.status(500).json({ message: "Failed to update rabbitmq status",success:false });
            return;
        }
           //start metric
       {
        userActivityTotal.inc({ 
          activity_type: 'reset_rabbitmq_instance', 
          user_tier: "unknown"
        });
        logBusinessOperation("reset_rabbitmq_instance","rabbitmq",{
          rabbitmqId,
          userId:"anonymous",
          tier:"unknown"
        })
       }


        const connectionString=`amqp://${response?.username}:${password}@${CUSTOMER_RABBIT_HOST}`
        res.status(200).json({ message:"RabbitMQ updated successfully",success:true ,connectionString:connectionString});
    } catch (e) {
        logError(e instanceof Error ? e : new Error("Failed to update rabbitmq status"));
        res.status(500).json({ message: "Failed to update rabbitmq status",success:false });
    }
}
export const getAllRabbitMQInstance = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const allProjects = await prismaClient.project.findMany({
      where: { userBaseAdminId: userId },
      select: { id: true, name: true }
    });

    const projectIds = allProjects.map((p) => p.id);

    if (projectIds.length === 0) {
      return res.status(200).json({ rabbitmqDB: [], success: true });
    }

    const allRabbitMQ = await prismaClient.rabbitMQ.findMany({
      where: { projectId: { in: projectIds },is_active:true },
      select: {
        projectId: true,
        id: true,
        queue_name: true,
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
const finalRabbitMQ = allRabbitMQ.map(q => ({
  ...q,
  name:q.queue_name,
  projectName: projectMap.get(q.projectId)
}));


//start metric
{
  userActivityTotal.inc({ 
    activity_type: 'sent_all_rabbitmq_instance', 
    user_tier: "unknown"
  });
  logBusinessOperation("sent_all_rabbitmq_instance","rabbitmq",{
    AllRabbitMQIds:allRabbitMQ.map((p) => p.id),
    userId:"anonymous",
    tier:"unknown"
  })
}

    res.status(200).json({ rabbitmq: finalRabbitMQ,message:"RabbitMQ list", success: true });
  } catch (error) {
    logError(error instanceof Error ? error : new Error("Failed to get rabbitmq status"));
    res.status(500).json({ rabbitmq:[],message: "Failed to get rabbitmq status", success: false });
  }
};
export const getOneRabbitMQInstance = async (req: Request, res: Response) => {
    try {
        const rabbitmqId=req.params.id;
        if(!rabbitmqId){
            res.status(400).json({ message: "Invalid rabbitmqId", success: false });
            return;
        }
        const rabbitmq=await prismaClient.rabbitMQ.findUnique({
            where:{
                id:rabbitmqId,
                is_active:true
            },
         select:{
            projectId:true,
            id:true,
            queue_name:true,
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
        if(!rabbitmq){
            res.status(404).json({rabbitmq:{}, message: "RabbitMQ not found", success: false });
            return;
        }    
        //start metric
        {
          userActivityTotal.inc({ 
            activity_type: 'sent_one_rabbitmq_instance', 
            user_tier: "unknown"
          });
          logBusinessOperation("sent_one_rabbitmq_instance","rabbitmq",{
            rabbitmqId,
            userId:"anonymous",
            tier:"unknown"
          })
        }
        res.status(200).json({ rabbitmq:rabbitmq,success:true });
    } catch (error) {
        logError(error instanceof Error ? error : new Error("Failed to get rabbitmq status"));
        res.status(500).json({ message: "Failed to get rabbitmq status",success:false });
    }
}
export const getRabbitMQConnectionString = async (req: Request, res: Response) => {

    try { 
        const rabbitmqId=req.params.id;
        if(!rabbitmqId){
            res.status(400).json({ message: "Invalid rabbitmqId", success: false });
            return;
        }
        const rabbit=await prismaClient.rabbitMQ.findUnique({
            where:{
                id:rabbitmqId
            },
         select:{
            id:true,
            username:true,
            password:true,
            port:true,
         
         }
            
        })
        if(!rabbit){
            res.status(404).json({ message: "RabbitMQ not found",connectionString:"",success:false });
            return;
        }
        //start metric
        {
          userActivityTotal.inc({ 
            activity_type: 'sent_rabbitmq_instance_connection_string', 
            user_tier: "unknown"
          });
          logBusinessOperation("sent_rabbitmq_instance_connection_string","rabbitmq",{
            rabbitmqId,
            userId:"anonymous",
            tier:"unknown"
          })
        }
        const connectionString=`amqps://${rabbit.username}:${decrypt(rabbit.password,RABBITMQ_ENCRYPT_SECRET,RABBITMQ_ENCRYPT_SALT)}@${CUSTOMER_RABBIT_HOST}:${5671}`
        res.status(200).json({message:"RabbitMQ connection string", connectionString:connectionString,success:true });
    } catch (error) {
        logError(error instanceof Error ? error : new Error("Failed to get rabbitmq status"));
        res.status(500).json({ message: "Failed to get rabbitmq status",success:false });
    }
}

  

import type { Request, Response } from "express";
import { PermissionList, prismaClient,  } from "@cloud/db";
import { decrypt } from "@cloud/backend-common";
import { pushInfraConfigToQueueToCreate,pushInfraConfigToQueueToDelete } from "@cloud/backend-common";
import { encrypt,generateUsername } from "@cloud/backend-common"
import { generateRandomString } from "../auth/auth.controller";
import { parseMemory } from "../../utils/parser";
import { generateCuid } from "../../utils/random";
import { postgresQueue } from "@cloud/backend-common";
import { postgresqlSchema } from "@cloud/backend-common/types";
import { CUSTOMER_POSTGRES_HOST,CONTROL_PLANE_URL } from "../config/config";
import axios from "axios";
import { 
  resourceProvisionedTotal, 
  resourceDeletedTotal, 
  userActivityTotal 
} from '../../moinitoring/promotheous';
import { logBusinessOperation, logAudit,logError, } from '../../moinitoring/Log-collection/winston';

const PG_ENCRYPT_SECRET = process.env.PG_ENCRYPT_SECRET!;
const PG_ENCRYPT_SALT = process.env.PG_ENCRYPT_SALT!;

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
                  userId: req.userId,
                  projectId:parsedData.data.projectId
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
              const postgresId=generateCuid();
           

        const success=await pushInfraConfigToQueueToCreate(postgresQueue.CREATE,{...parsedData.data,resource_id:postgresId,namespace})
        if(!success){
          
            res.status(500).json({ message: "Failed to add task to queue",success:false });
            return;
        }
        await prismaClient.postgresDB.create({
            data:{
                id:postgresId,
                projectId:parsedData.data.projectId,
                database_name:parsedData.data.name,
                username:generateUsername(),
                password:encrypt(generateRandomString(),PG_ENCRYPT_SECRET!,PG_ENCRYPT_SALT!),
                port:"5672",
                namespace:namespace,
                initialMemory:parsedData.data.initialMemory,
                maxMemory:parsedData.data.maxMemory,
                initialStorage:parsedData.data.initialStorage,
                maxStorage:parsedData.data.maxStorage,
                initialVCpu:parsedData.data.initialVCpu,
                maxVCpu:parsedData.data.maxVCpu,
                autoScale: parsedData.data.autoScale === "true" ? true : false,
                backUpFrequency:parsedData.data.backUpFrequency,
                
                
            }
        })


        //start metric
      {
        resourceProvisionedTotal.inc({ 
          resource_type: 'postgres', 
          tier: subscription?.tierRule?.tier || 'unknown',
          status: 'queued'
        });
        userActivityTotal.inc({ 
          activity_type: 'create_postgres', 
          user_tier: subscription?.tierRule?.tier || 'unknown'
        });
        
        logBusinessOperation('create_postgres', 'postgres', {
          postgresId,
          userId: "anonymous",
          tier: subscription?.tierRule?.tier || 'unknown',
          projectId: parsedData.data.projectId,
          config: {
            initialMemory: parsedData.data.initialMemory,
            maxMemory: parsedData.data.maxMemory,
            autoScale: parsedData.data.autoScale
          }
        });
        
        logAudit('CREATE_POSTGRES_INSTANCE', "anonymous", {
          resourceId: postgresId,
          resourceType: 'postgres',
          tier: subscription?.tierRule?.tier || 'unknown'
        });
      }
        
        res.status(200).json({ message: "Task added to Queue to provisioned",database:{id:postgresId},success:true });
     }catch (error) {
   logError(error instanceof Error ? error : new Error("Failed to add task to queue"));
  
        res.status(500).json({ message: "Failed to add task to queue",success:false });
    }
}
export const deletePostgresInstance = async (req: Request, res: Response) => {
    try {
      const  postgresId  = req.params.id;
      const userId=req.userId
      if(!postgresId){
        res.status(400).json({ message: "Invalid postgresId", success: false });
        return;
      }
      const response = await pushInfraConfigToQueueToDelete(postgresQueue.DELETE,postgresId)

  
      if (!response) {
        res.status(500).json({ message: "Failed to add task to queue", success: false });
        return;
      }
   
       const[postgres,subscription]=await Promise.all([
        prismaClient.postgresDB.update({
          where:{
            id:postgresId
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
        resource_type: 'postgres', 
        tier:  subscription?.tierRule?.tier || 'unknown'
      });
      userActivityTotal.inc({ 
        activity_type: 'delete_postgres', 
        user_tier: subscription?.tierRule?.tier || 'unknown'
      });
      logBusinessOperation('delete_postgres', 'postgres', {
        postgresId,
        userId: "anonymous",
        tier: subscription?.tierRule?.tier
      });
      
      logAudit('DELETE_POSTGRES_INSTANCE', "anonymous", {
        resourceId: postgresId,
        resourceType: 'postgres'
      });
   }
      
      res.status(200).json({ message: "Task added to Queue for destructon", success: true });
    } catch (error) {
      logError(error instanceof Error ? error : new Error("Failed to add task to queue for postgres Destruction"));

      res.status(500).json({ message: "Failed to add task to queue",success:false });
    }
  };
export const getPostgresStatus=async(req:Request,res:Response)=>{
    try {
        const postgresId=req.params.id
        if(!postgresId){
            res.status(400).json({ message: "Invalid postgresId", success: false });
            return;
        }
        const postgresStatus=await prismaClient.postgresDB.findUnique({
            where:{
                id:postgresId
            }
        })

        //start metric
        {
        userActivityTotal.inc({ 
          activity_type: 'sent_postgres_status', 
          user_tier: "unknown"
        });
        logBusinessOperation("sent_postgres_status","postgres",{
          postgresId,
          userId:"anonymous",
          tier:"unknown"
        })
        }
        //end metric
        res.status(200).json({ postgresDB:postgresStatus?.provisioning_flow_status,success:true });
    } catch (error) {
      logError(error instanceof Error ? error : new Error("Failed to response postgresDB status")); 
        res.status(500).json({ message: "Failed to get postgresDB status",success:false });
    }
}
export const resetPostgresInstance=async(req:Request,res:Response)=>{
    try {
        const postgresId=req.params.id;
        if(!postgresId){
            res.status(400).json({ message: "Invalid postgresId", success: false });
            return;
        }
        const password=generateRandomString()
        const oldcred=await prismaClient.postgresDB.findUnique({
            where:{
                id:postgresId
            }
        })
        const encryptedPassword=encrypt(password,PG_ENCRYPT_SECRET!,PG_ENCRYPT_SALT!);
        const response=await prismaClient.postgresDB.update({
            data:{
                username:generateUsername(),
                password:encryptedPassword,
            },
            where:{
                id:postgresId
            }
        })
        const updateProxyPlane= await axios.post(CONTROL_PLANE_URL+"/api/v1/infra/postgres/route-table-update",{
            resource_id:postgresId,
            username:response?.username,
            password:response?.password,
            old_key:oldcred?.username+":"+oldcred?.database_name,
            new_key:response?.username+":"+response?.database_name,
            namespace:oldcred?.namespace,
        })

        //start metric
       {
        userActivityTotal.inc({ 
          activity_type: 'reset_postgres_instance', 
          user_tier: "unknown"
        });
        logBusinessOperation("reset_postgres_instance","postgres",{
          postgresId,
          userId:"anonymous",
          tier:"unknown"
        })
       }



        const connectionString=`postgresql://${response?.username}:${password}@${CUSTOMER_POSTGRES_HOST}/${response?.database_name}?pgbouncer=true`
        res.status(200).json({ message:"PostgresDB updated successfully",success:true ,connectionString:connectionString});
    } catch (error) {
        logError(error instanceof Error ? error : new Error("Failed to update postgresDB status")); 
        res.status(500).json({ message: "Failed to update postgresDB status",success:false });
    }
}
export const getAllPostgresInstance = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const allProjects = await prismaClient.project.findMany({
      where: { userBaseAdminId: userId },
      select: { id: true, name: true }
    });

    const projectIds = allProjects.map((p) => p.id);

    if (projectIds.length === 0) {
      return res.status(200).json({ postgresDB: [], success: true });
    }

    const allPostgres = await prismaClient.postgresDB.findMany({
      where: { projectId: { in: projectIds },is_active:true },
      select: {
        projectId: true,
        id: true,
        database_name: true,
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
const finalPostgres = allPostgres.map(db => ({
  ...db,
  projectName: projectMap.get(db.projectId)
}));


//start metric
{
  userActivityTotal.inc({ 
    activity_type: 'sent_all_postgres_instance', 
    user_tier: "unknown"
  });
  logBusinessOperation("sent_all_postgres_instance","postgres",{
    AllPostgresIds:allPostgres.map((p) => p.id),
    userId:"anonymous",
    tier:"unknown"
  })
}


    res.status(200).json({ databases: finalPostgres, success: true });
  } catch (error) {
      logError(error instanceof Error ? error : new Error("Failed to send all postgresDB status")); 
    res.status(500).json({ message: "Failed to get postgresDB status",success:false });
  }
};
export const getOnePostgresInstance = async (req: Request, res: Response) => {
    try {
        const postgresId=req.params.id
        if(!postgresId){
            res.status(400).json({ message: "Invalid postgresId", success: false });
            return;
        }
        const postgres=await prismaClient.postgresDB.findUnique({
            where:{
                id:postgresId,
                is_active:true
            },
         select:{
            projectId:true,
            id:true,
            database_name:true,
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

        //start metric
        {
          userActivityTotal.inc({ 
            activity_type: 'sent_one_postgres_instance', 
            user_tier: "unknown"
          });
          logBusinessOperation("sent_one_postgres_instance","postgres",{
            postgresId,
            userId:"anonymous",
            tier:"unknown"
          })
        }
    
        res.status(200).json({ database:postgres,success:true });
    } catch (error) {
        logError(error instanceof Error ? error : new Error("Failed to send one postgresDB status")); 
        res.status(500).json({ message: "Failed to get postgresDB status",success:false });
    }
}
export const getPostgresConnectionString = async (req: Request, res: Response) => {

    try { 
        const postgresId=req.params.id
        if(!postgresId){
            res.status(400).json({ message: "Invalid postgresId", success: false });
            return;
        }
        const postgres=await prismaClient.postgresDB.findUnique({
            where:{
                id:postgresId
            },
         select:{
            id:true,
            username:true,
            password:true,
            port:true,
            database_name:true,
         
         }
            
        })

        //start metric
        {
          userActivityTotal.inc({ 
            activity_type: 'send_postgres_connection_string', 
            user_tier: "unknown"
          });
          logBusinessOperation("send_postgres_connection_string","postgres",{
            postgresId,
            userId:"anonymous",
            tier:"unknown"
          })

        }
      

        const connectionString=`postgresql://${postgres!.username}:${  decrypt(postgres!.password,PG_ENCRYPT_SECRET,PG_ENCRYPT_SALT)}@${CUSTOMER_POSTGRES_HOST}/${postgres!.database_name}?sslmode=require`
        res.status(200).json({ connectionString:connectionString,success:true });
    } catch (error) {
        logError(error instanceof Error ? error : new Error("Failed to send postgresDB connection string")); 
        res.status(500).json({ message: "Failed to get postgresDB status",success:false });
    }
}
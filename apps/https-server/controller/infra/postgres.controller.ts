
import type { Request, Response } from "express";
import { PermissionList, prismaClient, ProvisioningFlowStatus } from "@cloud/db";
import { postgresqlSchema, projectSchema} from "@cloud/backend-common";
import { pushInfraConfigToQueueToCreate,pushInfraConfigToQueueToDelete } from "@cloud/backend-common";
import { encrypt, generateUsername } from "@cloud/backend-common"
import { generateRandomString } from "../auth/auth.controller";
import { parseMemory } from "../../utils/parser";
import { generateCuid } from "../../utils/random";

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
              const postgresId=generateCuid();

        const success=await pushInfraConfigToQueueToCreate("postgres_create_queue",{...parsedData.data,resource_id:postgresId,namespace})
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
                password:await encrypt(generateRandomString(),process.env.ENCRYPT_SECRET || "BHggjvTfPlIYmIOjbbut"),
                port:"5672",
                namespace:namespace,
                

                
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
      const { postgresId } = req.body as { postgresId: string };
      const response = await pushInfraConfigToQueueToDelete("postgres_delete_queue",postgresId)
  
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
export const getPostgresStatus=async(req:Request,res:Response)=>{
    try {
        const {postgresId}=req.body as {postgresId:string};
        const postgresStatus=await prismaClient.postgresDB.findUnique({
            where:{
                id:postgresId
            }
        })
        res.status(200).json({ postgresDB:postgresStatus?.provisioning_flow_status,success:true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get postgresDB status", error });
    }
}
export const updatePostgres=async(req:Request,res:Response)=>{
    try {
        const {postgresId}=req.body as {postgresId:string};
        const response=await prismaClient.postgresDB.update({
            data:{
                username:generateUsername(),
                password:await encrypt(generateRandomString(),process.env.ENCRYPT_SECRET || "BHggjvTfPlIYmIOjbbut"),
            },
            where:{
                id:postgresId
            }
        })
        res.status(200).json({ postgresDB:response,success:true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update postgresDB status", error });
    }
}

  
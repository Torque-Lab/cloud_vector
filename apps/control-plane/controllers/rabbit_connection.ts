import { encrypt } from "@cloud/backend-common";
import { prismaClient } from "@cloud/db";
import type { Request, Response } from "express";

const addressTable = new Map<string, string>();
export const getRabbitInstance = async (req: Request, res: Response) => {
    try {
        const username = req.query.username as string
        const password = req.query.password as string
        const token = req.query.token as string
        if(token !== process.env.AUTH_TOKEN_RABBITMQ_PROXY!){
         res.status(401).json({ error: "Unauthorized" });
         return
        }
        const encyrptedPassword= await encrypt(password,process.env.ENCRYPT_SECRET!)
        const key = `${username}:${encyrptedPassword}`;
        if(addressTable.has(key)){
            res.status(200).json({
                backend_url:addressTable.get(key)!
            })
            return
        }
       const rabbitInstance = await  prismaClient.rabbitMQ.findFirst({
        where:{
            username:username,
            password:encyrptedPassword
        }
       })
       if(!rabbitInstance){
      res.status(404).json({ error: "Rabbit instance not found" });
      return
       }
       const url=`amqp://${rabbitInstance.queue_name}-${rabbitInstance.id}-service.${rabbitInstance.namespace}.svc.cluster.local:5672`
       addressTable.set(key,url)
       res.status(200).json({
        backend_url:url,
       })
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
}

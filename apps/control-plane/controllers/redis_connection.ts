import { prismaClient } from "@cloud/db";
import type { Request, Response } from "express";

const addressTable = new Map<string, string>();
export const getRedisInstance = async (req: Request, res: Response) => {
    try {
        const username = req.query.username as string
        const password = req.query.password as string
        const token = req.query.token as string
        if(token !== process.env.AUTH_TOKEN_REDIS_PROXY!){
            return res.status(401).json({ error: "Unauthorized" });
        }
        const key = `${username}:${password}`;
        if(addressTable.has(key)){
            res.status(200).json({
                backend_url:addressTable.get(key)!
            })
            return
        }
       const redisInstance = await  prismaClient.redis.findFirst({
        where:{
            username:username,
            password:password
        }
       })
       if(!redisInstance){
      res.status(404).json({ error: "Redis instance not found" });
      return
       }
       const url=`redis://${redisInstance.redis_name}-${redisInstance.id}-service.${redisInstance.namespace}.svc.cluster.local:6379`
       addressTable.set(key,url)
       res.status(200).json({
        backend_url:url,
       })
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
}

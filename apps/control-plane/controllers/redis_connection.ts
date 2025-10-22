import { decrypt, updateInfraConfigSchema } from "@cloud/backend-common";
import { prismaClient } from "@cloud/db";
import type { Request, Response } from "express";
import axios from "axios";
import { PROXY_REDIS_URL } from "../config/config";
export const getRedisInstance = async (req: Request, res: Response) => {
    try {
        const username = req.query.username as string;
        const password = req.query.password as string;
        const auth_token = req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : req.query.auth_token as string;
        if (auth_token !== process.env.AUTH_TOKEN_CONTROL_PLANE!) {
            return res
                .status(401)
                .json({ message: "Unauthorized", backend_url: "", success: false });
        }
        const redisInstance = await prismaClient.redis.findFirst({
            where: {
                username: username,
                password: password,
            },
        });
        if (!redisInstance) {
            res
                .status(404)
                .json({
                    message: "Redis instance not found",
                    backend_url: "",
                    success: false,
                });
            return;
        }
        const url = `redis://${redisInstance.redis_name}-${redisInstance.id}-service.${redisInstance.namespace}.svc.cluster.local:6379`;
        res.status(200).json({
            backend_url: url,
            success: true,
        });
    } catch (e) {
        res
            .status(500)
            .json({
                message: "Internal server error",
                backend_url: "",
                success: false,
            });
    }
};

export const updateRedisRouteTable = async (req: Request, res: Response) => {
    try {
        const auth_token = req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : req.query.auth_token as string;
        if (auth_token !== process.env.AUTH_TOKEN_CONTROL_PLANE!) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { old_key, new_key, namespace, password, resource_id } =
            updateInfraConfigSchema.parse(req.body)

        const url = `redis://${old_key.split(":")[2]}-${resource_id}-service.${namespace}.svc.cluster.local:6379`;
        const decodedOldKey =
            old_key.split(":")[0]! +
            ":" +
            decrypt(
                old_key.split(":")[1]!,
                process.env.ENCRYPT_SECRET!,
                process.env.ENCRYPT_SALT!
            );
        const decodedNewKey =
            new_key.split(":")[0]! +
            ":" +
            decrypt(
                new_key.split(":")[1]!,
                process.env.ENCRYPT_SECRET!,
                process.env.ENCRYPT_SALT!
            );

        const updateProxyPlane = await axios.post(
            PROXY_REDIS_URL + "/api/v1/redis/update-table",
            {
                message: "Route table updated successfully",
                auth_token: process.env.AUTH_TOKEN_REDIS_PROXY!,
                old_key: decodedOldKey,
                new_key: decodedNewKey,
                backend_url: url,
                success: true,
            }
        );
        if (updateProxyPlane.status === 200) {
            res
                .status(200)
                .json({
                    message: "Route table updated successfully",
                    backend_url: "",
                    success: true,
                });
        }
    } catch (e) {
        res
            .status(500)
            .json({
                message: "Internal server error",
                backend_url: "",
                success: false,
            });
    }
};

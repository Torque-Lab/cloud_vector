import {
  decrypt,
  encrypt,
} from "@cloud/backend-common";
import { updateInfraConfigSchema } from "@cloud/backend-common/types";
import { prismaClient } from "@cloud/db";
import type { Request, Response } from "express";
import axios from "axios";
import { PROXY_RABBITMQ_URL } from "../config/config";


export const getRabbitInstance = async (req: Request, res: Response) => {
  try {
    const username = req.query.username as string;
    const password = req.query.password as string;
    const auth_token = req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : req.query.auth_token as string;
    if (auth_token !== process.env.AUTH_TOKEN_CONTROL_PLANE!) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const encyrptedPassword = encrypt(
      password,
      process.env.RABBITMQ_ENCRYPT_SECRET!,
      process.env.RABBITMQ_ENCRYPT_SALT!
    );

    const rabbitInstance = await prismaClient.rabbitMQ.findFirst({
      where: {
        username: username,
        password: encyrptedPassword,
      },
    });
    if (!rabbitInstance) {
      res.status(404).json({ error: "Rabbit instance not found" });
      return;
    }
    const url = `amqp://${rabbitInstance.queue_name}-${rabbitInstance.id}-service.${rabbitInstance.namespace}.svc.cluster.local`;
    res.status(200).json({
      backend_url: url,
    });
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateRabbitMQRouteTable = async (req: Request, res: Response) => {
  try {
    const auth_token = req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : req.query.auth_token as string;
    if (auth_token !== process.env.AUTH_TOKEN_CONTROL_PLANE!) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { old_key, new_key, namespace, password, resource_id } =
      updateInfraConfigSchema.parse(req.body);

    const url = `amqp://${old_key.split(":")[2]}-${resource_id}-service.${namespace}.svc.cluster.local`;
    const decodedOldKey =
      old_key.split(":")[0]! +
      ":" +
      decrypt(
        old_key.split(":")[1]!,
        process.env.RABBITMQ_ENCRYPT_SECRET!,
        process.env.RABBITMQ_ENCRYPT_SALT!
      );
    const decodedNewKey =
      new_key.split(":")[0]! +
      ":" +
      decrypt(
        new_key.split(":")[1]!,
        process.env.RABBITMQ_ENCRYPT_SECRET!,
        process.env.RABBITMQ_ENCRYPT_SALT!
      );

    const updateProxyPlane = await axios.post(
      PROXY_RABBITMQ_URL + "/api/v1/infra/rabbit/update-table",
      {
        message: "Route table updated successfully",
        auth_token: process.env.AUTH_TOKEN_RABBITMQ_PROXY!,
        old_key: decodedOldKey,
        new_key: decodedNewKey,
        backend_url: url,
        success: true,
      }
    );
    if (updateProxyPlane.status === 200) {
      res.status(200).json({
        message: "Route table updated successfully",
        backend_url: "",
        success: true,
      });
    }
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
      backend_url: "",
      success: false,
    });
  }
};

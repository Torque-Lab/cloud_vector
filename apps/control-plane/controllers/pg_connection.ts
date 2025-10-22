import { prismaClient } from "@cloud/db";
import type { Request, Response } from "express";
import crypto from "crypto";
import { decrypt } from "@cloud/backend-common";
import { updateInfraConfigSchema } from "@cloud/backend-common";
import { PROXY_POSTGRES_URL } from "../config/config";
import axios from "axios"

export const getPostgresInstance = async (req: Request, res: Response) => {
  try {
    const key = req.query.key as string
    const keyArray = key.split(":");
    const auth_token = req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : req.query.auth_token as string;
    if (auth_token !== process.env.AUTH_TOKEN_CONTROL_PLANE!) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const postgresInstance = await prismaClient.postgresDB.findFirst({
      where: {
        username: keyArray[0],

      }
    })
    //  name: {{ .Values.postgres.name }}-pgbouncer-{{ .Values.postgres.db_id }}
    //postgresql://<pgbouncer-service-name>.<namespace>.svc.cluster.local:5432/<database>

    if (!postgresInstance) {
      res.status(404).json({ error: "Postgres instance not found" });
      return
    }
    const decodedPassword = decrypt(postgresInstance.password, process.env.ENCRYPT_SECRET!, process.env.ENCRYPT_SALT!)
    const url = `postgresql://$postgres-pgbouncer-${postgresInstance.id}.${postgresInstance.namespace}.svc.cluster.local:5432/${postgresInstance.database_name}`
    const authCredential = generateScramCredential(decodedPassword)
    res.status(200).json({
      backend_url: url,
      user_cred: {
        salt: authCredential.salt,
        iterations: authCredential.iterations,
        stored_key: authCredential.storedKey,
        server_key: authCredential.serverKey
      },
      success: true
    })
  } catch (error) {

    res.status(500).json({ message: "Internal server error", success: false });
  }
}
export const updatePostgresRouteTable = async (req: Request, res: Response) => {
  try {
    const auth_token = req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : undefined;
    if (auth_token !== process.env.AUTH_TOKEN_CONTROL_PLANE!) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const parsedData = updateInfraConfigSchema.safeParse(req.body)
    if (!parsedData.success) {
      res.status(400).json({ message: "Invalid data", success: false });
      return;
    }
    const { old_key, new_key, namespace, password, resource_id } = parsedData.data
    const decodedPassword = decrypt(password, process.env.ENCRYPT_SECRET!, process.env.ENCRYPT_SALT!)
    const url = `postgresql://$postgres-pgbouncer-${resource_id}.${namespace}.svc.cluster.local:5432/${old_key.split(":")[1]}`
    const authCredential = generateScramCredential(decodedPassword)

    const updateProxyPlane = await axios.post(PROXY_POSTGRES_URL + "/api/v1/infra/postgres/update-table", {
      backend_url: url,
      old_key: old_key,
      new_key: new_key,
      auth_token: process.env.AUTH_TOKEN_POSTGRES_PROXY!,
      user_cred: {
        salt: authCredential.salt,
        iterations: authCredential.iterations,
        stored_key: authCredential.storedKey,
        server_key: authCredential.serverKey
      },
      success: true,
      message:"updated postgres credentials"

    })
    if(updateProxyPlane.status!==200){
      res.status(500).json({ message: "Internal server error", success: false });
      return;
    }
    res.status(200).json({ message: "updated postgres credentials", success: true });


  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
}


/* do this in control plane
SaltedPassword = PBKDF2(password, salt, iterations)
ClientKey = HMAC(SaltedPassword, "Client Key")
StoredKey = HASH(ClientKey)
ServerKey = HMAC(SaltedPassword, "Server Key")
The server stores StoredKey, ServerKey, salt, and iteration count.

// --- User credential storage ---
type SCRAMCredential struct {
  Salt       string `json:"salt"`       // base64 encoded
  Iterations int    `json:"iterations"` // iterations count
  StoredKey  string `json:"stored_key"` // base64 encoded
  ServerKey  string `json:"server_key"` // base64 encoded
}
  */
type SCRAMCredential = {
  salt: string;       // base64-encoded salt
  iterations: number;
  storedKey: string;  // base64
  serverKey: string;  // base64
};





function generateScramCredential(password: string): SCRAMCredential {
  const saltBytes = crypto.randomBytes(16);
  const iterations = 4096;
  const saltedPassword = PBKDF2SYNC(password, saltBytes, iterations);
  const clientKey = HMAC(saltedPassword, "Client Key");
  const storedKey = HASH(clientKey);
  const serverKey = HMAC(saltedPassword, "Server Key");

  return {
    salt: Buffer.from(saltBytes).toString("base64"),
    iterations,
    storedKey: Buffer.from(storedKey).toString("base64"),
    serverKey: Buffer.from(serverKey).toString("base64"),
  };
}

function PBKDF2SYNC(password: string, salt: Uint8Array, iterations: number): Uint8Array {
  return crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256");
}

function HMAC(key: Uint8Array, data: string): Uint8Array {
  return crypto.createHmac("sha256", key).update(data).digest();
}

function HASH(data: Uint8Array): Uint8Array {
  return crypto.createHash("sha256").update(data).digest();
}

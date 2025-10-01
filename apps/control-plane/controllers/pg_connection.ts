import { prismaClient } from "@cloud/db";
import type { Request, Response } from "express";
import crypto from "crypto";
import { decrypt } from "@cloud/backend-common";

const  addressTable = new Map<string, string>();
export const getPostgresInstance = async (req: Request, res: Response) => {
    try {
        const key = req.query.key as string
        const keyArray = key.split(":");
        const token = req.query.token as string
        if(token !== process.env.AUTH_TOKEN_POSTGRES_PROXY!){
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (addressTable.has(key)) {
            res.status(200).json({
                backend_url:addressTable.get(key)!
            })
            return
        }
       const postgresInstance = await  prismaClient.postgresDB.findFirst({
        where:{
            username:keyArray[0],
            database_name:keyArray[1]
        }
       })
 //  name: {{ .Values.postgres.name }}-pgbouncer-{{ .Values.postgres.db_id }}
      //postgresql://<pgbouncer-service-name>.<namespace>.svc.cluster.local:5432/<database>

       if(!postgresInstance){
         res.status(404).json({ error: "Postgres instance not found" });
         return
       }
       const decodedPassword= await decrypt(postgresInstance.password,process.env.ENCRYPT_SECRET!)
       const url=`postgresql://$postgres-pgbouncer-${postgresInstance.id}.${postgresInstance.namespace}.svc.cluster.local:5432/${postgresInstance.database_name}`
       addressTable.set(key,url)
       const authCredential = generateScramCredential(decodedPassword)
       res.status(200).json({
        backend_url:url,
        auth_credential:authCredential
       })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
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
      salt:Buffer.from(saltBytes).toString("base64"),
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
  
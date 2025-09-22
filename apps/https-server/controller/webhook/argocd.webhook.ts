
import type { Request, Response } from "express";

export const argocdWebhook = async (req: Request, res: Response) => {
    const db_id = req.body.application.metadata.name;
    const status = req.body.application.status.sync.status;
    let database;
    if (status == "Synced") {
      console.log(
        ` ${req.body.application.metadata.name} is deployed and healthy`
      );
  
    }
  
    res.status(200).json({ message: "PostgresDB app deployed and healthy", database });
  };
  
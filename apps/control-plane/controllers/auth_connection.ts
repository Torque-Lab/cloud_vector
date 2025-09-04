import type { Request, Response } from "express";
import { prismaClient } from "db";

export const authConnection = async (req: Request, res: Response) => {
    try {
        const { api_key } = req.body as { api_key: string };
        const db = await prismaClient.database.findUnique({
            where: {
                api_key: api_key,
            },
        });
        if (!db) {
            res.status(404).json({ error: "Database not found" });
            return;
        }
        res.status(200).json({ db:db?.db_url });        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
}

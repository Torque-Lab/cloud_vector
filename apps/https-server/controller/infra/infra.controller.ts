import axios from "axios";
import type { Request, Response } from "express";
import { prismaClient } from "db";
const infraUrl= process.env.INFRA_URL || "http://localhost:3000/provisioner";
export const infraCreation = async (req: Request, res: Response) => {
    try {
        const { db_id } = req.body;
        const {database_config}=req.body;
        const userId=req.userId;
        const user = await prismaClient.userBaseAdmin.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });
        if (!user) {
            res.status(401).json({ error: "User not found",success:false });
            return;
        }

        const database=prismaClient.database.create({
            data: {
                    id: db_id,
                    name: db_id,
                    projectId: user.id,
                    is_active: true,
                    is_provisioned: false,
                    api_key: "",
                    db_url: "",
          
            },  
          });

  const response = await axios.post(`${infraUrl}`, { db_id,database_config });
    if(response.data.success){
        res.status(200).json({ message: "DB app provisioned successfully",success:true });
    }else{
        res.status(500).json({ message: "Failed to provision DB app",success:false });
    }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to provision DB app", error });
    }
};

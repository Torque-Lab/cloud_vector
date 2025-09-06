import type { Request, Response } from "express";
import {primary_base_backend} from "../config/config";
import axios from "axios";
export const authConnection = async (req: Request, res: Response) => {
    try {
        const { api_key } = req.body as { api_key: string };
      
        const response=await axios.post(`${primary_base_backend}/vectordb`, { api_key });
        if(response.data.success){
            res.status(200).json({ db:response.data.database });
        }else{
            res.status(500).json({ error: "Database not found" });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
}

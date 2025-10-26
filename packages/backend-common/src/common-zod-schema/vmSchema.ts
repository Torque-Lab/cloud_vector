import {z} from "zod";
export const vmSchema=z.object({
   name: z.string().min(3).max(96),
   projectId: z.string().min(3).max(96),
   region: z.string().min(3).max(96),
   memory: z.string().min(1).max(8),
   storage: z.string().min(1).max(16),
   vCpu: z.string().min(1).max(8),
   publicKey: z.string().min(3).max(1024),
})


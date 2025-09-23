
import { z } from "zod";
export const redisSchema=z.object({
    name: z.string().min(3).max(96),
   projectId: z.string().min(3).max(96),
   region: z.string().min(3).max(96),
   initialMemory: z.string().min(1).max(8),
   maxMemory: z.string().min(1).max(8),
   initialStorage: z.string().min(1).max(16),
   maxStorage: z.string().min(1).max(16),
   initialVCpu: z.string().min(1).max(8),
   maxVCpu: z.string().min(1).max(8),
   autoScale: z.boolean(),
   backFrequency: z.enum(["daily", "weekly", "monthly"]).optional(),
})

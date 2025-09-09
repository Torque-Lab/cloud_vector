import {z} from "zod";
export const postgresqlSchema=z.object({
    name: z.string().min(3).max(96),
   projectId: z.string().min(3).max(96),
   region: z.string().min(3).max(96),
   initialMemory: z.string().min(3).max(96),
   maxMemory: z.string().min(3).max(96),
   initialStorage: z.string().min(3).max(96),
   maxStorage: z.string().min(3).max(96),
   initialVCpu: z.string().min(3).max(96),
   maxVCpu: z.string().min(3).max(96),
   autoScale: z.enum(["true", "false"]).optional(),
   backFrequency: z.enum(["daily", "weekly", "monthly"]).optional(),
})
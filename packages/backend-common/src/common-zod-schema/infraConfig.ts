import z from "zod";

export const InfraConfigSchema = z.object({
    name: z.string(),
    projectId: z.string(),
    region: z.string(),
    initialMemory: z.string(),
    maxMemory: z.string(),
    initialStorage: z.string(),
    maxStorage: z.string(),
    initialVCpu: z.string(),
    maxVCpu: z.string(),
    autoScale: z.string().min(1).max(5),
    backFrequency: z.enum(["daily", "weekly", "monthly"]).optional(),
    resource_id: z.string(),
    namespace: z.string(),
    postgres_user:z.string().optional(),
    postgres_db:z.string().optional(),
    
 
});

export const updateInfraConfigSchema=z.object({
    resource_id:z.string(),
    username:z.string(),
    password:z.string(),
    old_key:z.string(),
    new_key:z.string(),
    namespace:z.string(),
})

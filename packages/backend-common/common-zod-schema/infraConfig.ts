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
    autoScale: z.boolean(),
    backFrequency: z.enum(["daily", "weekly", "monthly"]).optional(),
    resource_id: z.string(),
    namespace: z.string(),
});
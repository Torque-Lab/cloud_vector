import {postgresqlSchema,projectSchema,rabbitmqSchema,redisSchema,SignUpSchema,SignInSchema,ForgotSchema,ResetSchema,VerifySchema} from "@cloud/backend-common/types";
import { z } from "zod";
import type { InfraConfigSchema, vmSchema } from "@cloud/backend-common/types"
export type {DashboardDataType,teamMember,projectDataDetails,ProjectData} from "./dashboardData"
export type {Metric,RecentActivity,TopDatabase,StorageBreakdown} from "./dashboardData"
export type { PermissionList } from "@cloud/db/db-types";
export type postgresqlSchema = z.infer<typeof postgresqlSchema>;
export type projectSchema = z.infer<typeof projectSchema>;
export type rabbitmqSchema = z.infer<typeof rabbitmqSchema>;
export type redisSchema = z.infer<typeof redisSchema>;
export type SignUpSchema = z.infer<typeof SignUpSchema>;
export type SignInSchema = z.infer<typeof SignInSchema>;
export type ForgotSchema = z.infer<typeof ForgotSchema>;
export type ResetSchema = z.infer<typeof ResetSchema>;
export type VerifySchema = z.infer<typeof VerifySchema>;
export type InfraConfig = z.infer<typeof InfraConfigSchema>;
export type vmSchema = z.infer<typeof vmSchema>;


import { prismaClient } from "@cloud/db";
import type { Request, Response } from "express";
import type { DashboardDataType,Metric,RecentActivity,TopDatabase,StorageBreakdown, projectDataDetails } from "@cloud/shared_types"

export const getDashboardData = async (req: Request, res: Response) => {
    const userId = req.userId; 
    try {
      const projects = await prismaClient.project.findMany({ where: { userBaseAdminId: userId } });
      const projectIds = projects.map((p) => p.id);
      const [postgresCount, redisCount, rabbitmqCount, vmCount] = await Promise.all([
        prismaClient.postgresDB.count({ where: { projectId: { in: projectIds } } }),
        prismaClient.redis.count({ where: { projectId: { in: projectIds } } }),
        prismaClient.rabbitMQ.count({ where: { projectId: { in: projectIds } } }),
        prismaClient.virtualMachine.count({ where: { projectId: { in: projectIds } } }),
      ]);
    
      const [postgresList, redisList, rabbitList] = await Promise.all([
        prismaClient.postgresDB.findMany({ where: { projectId: { in: projectIds } }, select: { initialStorage: true, projectId: true } }),
        prismaClient.redis.findMany({ where: { projectId: { in: projectIds } }, select: { initialStorage: true, projectId: true } }),
        prismaClient.rabbitMQ.findMany({ where: { projectId: { in: projectIds } }, select: { initialStorage: true, projectId: true } }),
      ]);
  
      const buildMetrics = (postgres: number, redis: number, rabbit: number, vm: number): Metric[] => [
        { title: "Postgres", value: postgres.toString(), change: "0%", trend: "up" },
        { title: "Redis", value: redis.toString(), change: "0%", trend: "up" },
        { title: "RabbitMQ", value: rabbit.toString(), change: "0%", trend: "up" },
        { title: "VM", value: vm.toString(), change: "0%", trend: "up" },
      ];
  
      const buildStorageData = (list: { projectId: string; initialStorage: string }[]): StorageBreakdown[] => {
        return list.map((item) => ({
          project: item.projectId,
          storage: item.initialStorage,
          percentage: 0,
        }));
      };
 
      const allStorageBreakdown: StorageBreakdown[] = [
        ...buildStorageData(postgresList),
        ...buildStorageData(redisList),
        ...buildStorageData(rabbitList),
      ];
  
      const allMetrics = buildMetrics(postgresCount, redisCount, rabbitmqCount, vmCount);

      const allData = {
        all: {
          metrics: allMetrics,
          recentActivity: [
            {
              id: 1,
              action: "No recent activity",
              database: "-",
              project: "-",
              timestamp: new Date().toISOString(),
              status: "success",
            },
          ],
          topDatabases: [
            {
              name: "Postgres",
              project: "All Projects",
              queries: "12k",
              size: "2 GB",
              status: "healthy",
            },
          ],
          storageBreakdown: allStorageBreakdown,
        },
      } as DashboardDataType["allData"];
      for (const project of projects) {
        const [postgresCount, redisCount, rabbitmqCount, vmCount] = await Promise.all([
          prismaClient.postgresDB.count({ where: { projectId: project.id } }),
          prismaClient.redis.count({ where: { projectId: project.id } }),
          prismaClient.rabbitMQ.count({ where: { projectId: project.id } }),
          prismaClient.virtualMachine.count({ where: { projectId: project.id } }),
        ]);
  
        const [postgresList, redisList, rabbitList] = await Promise.all([
          prismaClient.postgresDB.findMany({ where: { projectId: project.id }, select: { initialStorage: true, projectId: true } }),
          prismaClient.redis.findMany({ where: { projectId: project.id }, select: { initialStorage: true, projectId: true } }),
          prismaClient.rabbitMQ.findMany({ where: { projectId: project.id }, select: { initialStorage: true, projectId: true } }),
        ]);
  
        const storageBreakdown = [
          ...buildStorageData(postgresList),
          ...buildStorageData(redisList),
          ...buildStorageData(rabbitList),
        ];
  
        allData[project.id] = {
          metrics: buildMetrics(postgresCount, redisCount, rabbitmqCount, vmCount),
          recentActivity: [
            {
              id: 1,
              action: "No recent activity",
              database: "-",
              project: project.name,
              timestamp: new Date().toISOString(),
              status: "success",
            },
          ],
          topDatabases: [
            {
              name: "Postgres",
              project: project.name,
              queries: "0",
              size: "0 GB",
              status: "healthy",
            },
          ],
          storageBreakdown,
        };
      }
  
      const DashboardData: DashboardDataType = { allData };
      res.status(200).json({
        DashboardData,
        message: "User dashboard data loaded",
        success: true,
      });
    } catch (e) {
      res.status(500).json({ message: "Internal Server Error",success:false });
    }
  };

  export const getProjectDetailsDepth = async (req: Request, res: Response) => {
    const projectId = req.params.projectId as string;
    if(!projectId){
        return res.status(400).json({ message: "Project ID is required",success:false });
    } 
    try {
      const project = await prismaClient.project.findUnique({ where: { id: projectId } });
      if (!project) {
        return res.status(404).json({ message: "Project not found",success:false });
      }
      const [userBaseAdmin, associatedUsers] = await Promise.all([
        prismaClient.userBaseAdmin.findUnique({ where: { id: project.userBaseAdminId } }),
        prismaClient.permission.findMany({ where: { projectId: project.id } }),
      ]);
      const userId = associatedUsers.map((user) => user.userId);
      const user = await prismaClient.user.findMany({ where: { id: { in: userId } } });

      const projectDetails: projectDataDetails = {
        id: project.id,
        name: project.name,
        description: project.description!=undefined?project.description:"",
        status: project.status,
        admin: userBaseAdmin!.email,
        created: project.createdAt.toISOString(),
        team: user.map((user) => ({
          id: user.id,
          name: user?.first_name + " " + user?.last_name,
          email: user.email,
          role: user.role,
         
        })),
      };
      return res.status(200).json({ projectDetails, message: "Project details loaded", success: true });
    } catch (e) {
      return res.status(500).json({ message: "Internal Server Error",success:false });
    }
  };
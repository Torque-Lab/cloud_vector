import type { Request, Response } from "express";
import { projectSchema } from "@cloud/backend-common/types";
import { prismaClient } from "@cloud/db";
import type { ProjectData, projectDataDetails } from "@cloud/shared_types"
import { userActivityTotal } from "../../moinitoring/promotheous";
import { logBusinessOperation, logError } from "../../moinitoring/Log-collection/winston";

export const createProject = async (req: Request, res: Response) => {
    try {
        const { name, description } = projectSchema.parse(req.body);
        const countProject = await prismaClient.project.count({
            where: {
                userBaseAdmin: {
                    id: req.userId
                }
            }
        })
        const subscription = await prismaClient.subscription.findUnique({
            where: {
                userBaseAdminId: req.userId
            },
            include: {
                tierRule: true
            }
        })
        if (countProject >= subscription?.tierRule?.Max_Projects!) {
            res.status(403).json({ message: "You don't have enough projects", success: false });
            return;
        }
        const project = await prismaClient.project.create({
            data: {
                name,
                description,
                userBaseAdmin: {
                    connect: {
                        id: req.userId
                    }
                }
            }
        })
        if (!project) {
            res.status(500).json({ message: "Failed to create project", success: false });
        }
        res.status(200).json({ message: "Project created successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create project", error });
    }
}
export const getProjects = async (req: Request, res: Response) => {
    try {
        const data = await prismaClient.project.findMany({
            where: {
                userBaseAdmin: {
                    id: req.userId
                }
            }
        })
        if (!data) {
            res.status(404).json({ message: "Projects not found", success: false });
            return;
        }

        res.status(200).json({ projects: data, success: true });
    } catch (error) {

        res.status(500).json({ message: "Failed to get projects", success: false });
    }
}

export const getProjectDetails = async (req: Request, res: Response) => {
    const userId = req.userId

    try {
        const projects = await prismaClient.project.findMany({
            where: {
                userBaseAdminId: userId
            },
            select: {
                id: true,
                description: true,
                name: true,
                status: true,
                cost: true,
                createdAt: true,

            }
        })

        const projectIds = projects.map((project) => project.id);

        const [postgresCounts, redisCounts, rabbitmqCounts, vmCounts] = await Promise.all([
            prismaClient.postgresDB.groupBy({
                by: ['projectId'],
                where: { projectId: { in: projectIds } },
                _count: { projectId: true },
            }),
            prismaClient.redis.groupBy({
                by: ['projectId'],
                where: { projectId: { in: projectIds } },
                _count: { projectId: true },
            }),
            prismaClient.rabbitMQ.groupBy({
                by: ['projectId'],
                where: { projectId: { in: projectIds } },
                _count: { projectId: true },
            }),
            prismaClient.virtualMachine.groupBy({
                by: ['projectId'],
                where: { projectId: { in: projectIds } },
                _count: { projectId: true },
            }),
        ]);

        const findCount = (arr: { projectId: string; _count: { projectId: number } }[], id: string) =>
            arr.find((a) => a.projectId === id)?._count.projectId || 0;

        const finalProjectData = projects.map((project) => ({
            id: project.id,
            name: project.name,
            description: project.description,
            status: project.status,
            cost: project.cost,
            createdAt: project.createdAt,
            postgres: findCount(postgresCounts, project.id),
            redis: findCount(redisCounts, project.id),
            rabbitMQ: findCount(rabbitmqCounts, project.id),
            vm: findCount(vmCounts, project.id),
        }));

        if (!projects) {
            res.status(404).json({ ProjectData: [], message: "Projects not found", success: false });
            return;
        }

        res.status(200).json({ ProjectData: finalProjectData, message: "All project details", success: true });

    } catch (e) {
        res.status(500).json({ ProjectData: [], message: "Failed to get project details", success: false });
    }
}


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
      //start metric
      {
      userActivityTotal.inc({ 
        activity_type: 'get_project_details', 
        user_tier: "unknown"
      });
      logBusinessOperation("get_project_details","dashboard",{
        userId:"anonymous",
        tier:"unknown"
      })


      }
      return res.status(200).json({ projectDetails, message: "Project details loaded", success: true });
    } catch (e) {
      logError(e instanceof Error ? e : new Error("Failed to fetch project details"));
      return res.status(500).json({ message: "Internal Server Error",success:false });
    }
  };


  export const pauseProject = async (req: Request, res: Response) => {
    const projectId = req.params.projectId as string;
    if(!projectId){
        return res.status(400).json({ message: "Project ID is required",success:false });
    } 
    try {
      const project = await prismaClient.project.findUnique({
        where: { id: projectId },
        include:{
          virtualMachines:true,
          postgresDB:true,
          rabbitmq:true,
          redis:true,
          vectorDB:true,
         
        }
       
      });
      if (!project) {
        return res.status(404).json({ message: "Project not found",success:false });
      }
      if(project.virtualMachines.find((vm)=>vm.is_active==true)||project.postgresDB.find((db)=>db.is_active==true)||project.rabbitmq.find((rmq)=>rmq.is_active==true)||project.redis.find((redis)=>redis.is_active==true)||project.vectorDB.find((vdb)=>vdb.is_active==true)){
        //metric
          {
          userActivityTotal.inc({ 
            activity_type: 'pause_project_failed', 
            user_tier: "unknown"
            
          });
          logBusinessOperation("pause_project_failed","dashboard",{
            userId:"anonymous",
            tier:"unknown",
            error_type:"project_is_active and has associated resources"
          })


          }

        return res.status(400).json({ message: "Project is can't be paused due to active resources",success:false });
      }

      const updatedProject = await prismaClient.project.update({
        where: { id: projectId },
        data: { status: "paused" },
      });

      //start metric
      {
      userActivityTotal.inc({ 
        activity_type: 'pause_project', 
        user_tier: "unknown"
      });
      logBusinessOperation("pause_project","dashboard",{
        userId:"anonymous",
        tier:"unknown"
      })


      }
      return res.status(200).json({ updatedProject, message: "Project paused successfully", success: true });
    } catch (e) {
      logError(e instanceof Error ? e : new Error("Failed to fetch project details"));
      return res.status(500).json({ message: "Internal Server Error",success:false });
    }
  };  


  export const deleteProject = async (req: Request, res: Response) => {



    const projectId = req.params.projectId as string;
    if(!projectId){
        return res.status(400).json({ message: "Project ID is required",success:false });
    } 
    try {
      const project = await prismaClient.project.findUnique({
        where: { id: projectId },
        include:{
          virtualMachines:true,
          postgresDB:true,
          rabbitmq:true,
          redis:true,
          vectorDB:true,
         
        }
       
      });
      if (!project) {
        return res.status(404).json({ message: "Project not found",success:false });
      }
      if(project.virtualMachines.find((vm)=>vm.is_active==true)||project.postgresDB.find((db)=>db.is_active==true)||project.rabbitmq.find((rmq)=>rmq.is_active==true)||project.redis.find((redis)=>redis.is_active==true)||project.vectorDB.find((vdb)=>vdb.is_active==true)){
        //metric
          {
          userActivityTotal.inc({ 
            activity_type: 'delete_project_failed', 
            user_tier: "unknown"
            
          });
          logBusinessOperation("delete_project_failed","dashboard",{
            userId:"anonymous",
            tier:"unknown",
            error_type:"project_is_active and has associated resources"
          })


          }

        return res.status(403).json({ message: "Project  can't be deleted due to active resources",success:false });
      }

      const updatedProject = await prismaClient.project.update({
        where: { id: projectId },
        data: { status: "deleted" },
      });

      //start metric
      {
      userActivityTotal.inc({ 
        activity_type: 'delete_project', 
        user_tier: "unknown"
      });
      logBusinessOperation("delete_project","dashboard",{
        userId:"anonymous",
        tier:"unknown"
      })


      }
      return res.status(200).json({ updatedProject, message: "Project deleted successfully", success: true });
    } catch (e) {
      logError(e instanceof Error ? e : new Error("Failed to delete project details"));
      return res.status(500).json({ message: "Internal Server Error",success:false });
    }
  };  
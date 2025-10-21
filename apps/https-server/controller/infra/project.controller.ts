import type { Request, Response } from "express";
import { projectSchema } from "@cloud/backend-common";
import { prismaClient } from "@cloud/db";
import type { ProjectData } from "@cloud/shared_types"

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
import axios from 'axios';
import {  redisSchema } from '@cloud/shared_types';
const API_BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export interface redisData extends redisSchema {
  id: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  status: string;
  size: string;
  region: string;
  projectName: string;
}
export interface Project {
  id: string;
  name: string;
}
export const RedisApi = {
  getAllRedis: async (token:string): Promise<Pick<redisData, "projectId" | "projectName" | "id" | "name" | "description" | "status" | "size" | "region" | "createdAt" | "autoScale" | "backFrequency" | "maxMemory" | "maxVCpu">[]> => {
    const response = await axios.get<{redis:Pick<redisData, "projectId" | "projectName" | "id" | "name" | "description" | "status" | "size" | "region" | "createdAt" | "autoScale" | "backFrequency" | "maxMemory" | "maxVCpu">[],success:boolean}>(`${API_BASE_URL}/api/all-redis`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.redis;
  },

  getRedis: async (token:string,id: string): Promise<Pick<redisData, "projectId" | "projectName" | "id" | "name" | "description" | "status" | "size" | "region" | "createdAt" | "autoScale" | "backFrequency" | "maxMemory" | "maxVCpu">> => {
    const response = await axios.get<{redis:Pick<redisData, "projectId" | "projectName" | "id" | "name" | "description" | "status" | "size" | "region" | "createdAt" | "autoScale" | "backFrequency" | "maxMemory" | "maxVCpu">,success:boolean}>(`${API_BASE_URL}/api/redis-get/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.redis;
  },
  createRedis: async (token:string,data: redisSchema ): Promise<redisData> => {
    const response = await axios.post<{redis:redisData,success:boolean}>(`${API_BASE_URL}/api/redis-create`, data,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.redis;
  },

  updateRedis: async (token:string,id: string, data: Partial<redisData>): Promise<redisData> => {
    const response = await axios.patch<{redis:redisData,success:boolean}>(`${API_BASE_URL}/api/redis-update/${id}`, data,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.redis;
  },
  getProjects: async (token:string): Promise<Project[]> => {
    const response = await axios.get<{projects:Project[],success:boolean}>(`${API_BASE_URL}/api/projects`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.projects;
  },

  deleteRedis: async (id: string, token?:string): Promise<{message:string,success:boolean}> => {
    const response=await axios.delete<{message:string,success:boolean}>(`${API_BASE_URL}/api/redis-delete/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data
  },
};

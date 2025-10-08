import axios from 'axios';
import {  redisSchema } from '@cloud/shared_types';
const API_BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export interface redisData extends redisSchema {
  id: string;
  createdAt: string;
  updatedAt: string;
  region: string;
  projectName: string;
  is_provisioned: boolean;
}
export interface Project {
  id: string;
  name: string;
}
export const RedisApi = {
  getAllRedis: async (token?:string): Promise<redisData[]> => {
    const response = await axios.get<{redis:redisData[],success:boolean}>(`${API_BASE_URL}/api/infra/all-redis`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.redis;
  },

  getRedis: async (id: string,token?:string): Promise<redisData> => {
    const response = await axios.get<{redis:redisData,success:boolean}>(`${API_BASE_URL}/api/infra/redis-get/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.redis;
  },
  createRedis: async (data: redisSchema, token?:string  ): Promise<redisData> => {
    const response = await axios.post<{redis:redisData,success:boolean}>(`${API_BASE_URL}/api/infra/redis-create`, data,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.redis;
  },

  resetConnection: async (id: string, token?:string): Promise<{message:string,success:boolean,connectionString:string}> => {
    const response = await axios.patch<{message:string,success:boolean,connectionString:string}>(`${API_BASE_URL}/api/infra/redis-reset/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data
  },
  getConnection: async (id: string,token?:string): Promise<{connectionString:string,message:string,success:boolean}> => {
    const response = await axios.get<{connectionString:string,message:string,success:boolean}>(`${API_BASE_URL}/api/infra/redis-connection/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
  getProjects: async (token?:string): Promise<Project[]> => {
    const response = await axios.get<{projects:Project[],success:boolean}>(`${API_BASE_URL}/api/infra/projects`,
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
    const response=await axios.delete<{message:string,success:boolean}>(`${API_BASE_URL}/api/infra/redis-delete/${id}`,
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

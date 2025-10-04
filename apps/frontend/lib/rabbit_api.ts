import axios from 'axios';
import { rabbitmqSchema } from '@cloud/shared_types';
const API_BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export interface rabbitData extends rabbitmqSchema {
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
export const RabbitApi = {
  getAllRabbitmq: async (token:string): Promise<Pick<rabbitData, "projectId" | "projectName" | "id" | "name" | "description" | "status" | "size" | "region" | "createdAt" | "autoScale" | "backFrequency" | "maxMemory" | "maxVCpu">[]> => {
    const response = await axios.get<{rabbitmqS:Pick<rabbitData, "projectId" | "projectName" | "id" | "name" | "description" | "status" | "size" | "region" | "createdAt" | "autoScale" | "backFrequency" | "maxMemory" | "maxVCpu">[],success:boolean}>(`${API_BASE_URL}/api/all-rabbitmq`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.rabbitmqS;
  },

  getRabbitmq: async (token:string,id: string): Promise<Pick<rabbitData, 'id' | 'name' | 'description' | 'status' | 'size' | 'region' | 'createdAt' | 'autoScale' | "backFrequency"| 'maxMemory'|'maxVCpu'>> => {
    const response = await axios.get<{rabbitmq:Pick<rabbitData, 'id' | 'name' | 'description' | 'status' | 'size' | 'region' | 'createdAt' | 'autoScale' | "backFrequency" | 'maxMemory'|'maxVCpu'>,success:boolean}>(`${API_BASE_URL}/api/rabbitmq-get/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.rabbitmq;
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

  createRabbitmq: async (token:string,data: rabbitmqSchema ): Promise<rabbitData> => {
    const response = await axios.post<{rabbitmq:rabbitData,success:boolean}>(`${API_BASE_URL}/api/rabbitmq-create`, data,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.rabbitmq;
  },

  updateRabbitmq: async (token:string,id: string, data: Partial<rabbitData>): Promise<rabbitData> => {
    const response = await axios.patch<{rabbitmq:rabbitData,success:boolean}>(`${API_BASE_URL}/api/rabbitmq-update/${id}`, data,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.rabbitmq;
  },

  deleteRabbitmq: async (token:string,id: string): Promise<{message:string,success:boolean}> => {
    const response=await axios.delete<{message:string,success:boolean}>(`${API_BASE_URL}/api/rabbitmq-delete/${id}`,
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

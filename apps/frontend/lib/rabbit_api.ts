import axios from 'axios';
import { rabbitmqSchema } from '@cloud/shared_types';
const API_BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export interface rabbitData extends rabbitmqSchema {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  region: string;
  projectName: string;
  queue_name:string,
  is_provisioned: boolean;
}
export interface Project {
  id: string;
  name: string;
}
export const RabbitApi = {
  getAllRabbitmq: async (token?:string): Promise<rabbitData[]> => {
    const response = await axios.get<{rabbitmq:rabbitData[],message:string,success:boolean}>(`${API_BASE_URL}/api/v1/infra/all-rabbitmq`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.rabbitmq;
  },

  getRabbitmq: async (id: string,token?:string): Promise<rabbitData> => {
    console.log(id,token,"check")
    const response = await axios.get<{rabbitmq:rabbitData,success:boolean}>(`${API_BASE_URL}/api/v1/infra/rabbitmq-get/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response)
    return response.data.rabbitmq;
  },

  getProjects: async (token?:string): Promise<Project[]> => {
    const response = await axios.get<{projects:Project[],success:boolean}>(`${API_BASE_URL}/api/v1/infra/projects`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.projects;
  },

  createRabbitmq: async (data: rabbitmqSchema ,token?:string): Promise<rabbitData> => {
    const response = await axios.post<{rabbitmq:rabbitData,success:boolean}>(`${API_BASE_URL}/api/v1/infra/rabbitmq-create`, data,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.rabbitmq;
  },

  resetConnection: async (id: string, token?:string): Promise<{connectionString:string,message:string,success:boolean}> => {
    const response = await axios.patch<{connectionString:string,message:string,success:boolean}>(`${API_BASE_URL}/api/v1/infra/rabbitmq-reset/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data
  },

  getConnection: async (id: string, token?:string): Promise<{connectionString:string,message:string,success:boolean}> => {
    const response = await axios.get<{connectionString:string,message:string,success:boolean}>(`${API_BASE_URL}/api/v1/infra/rabbitmq-connection/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data
  },

  deleteRabbitmq: async (id: string,token?:string): Promise<{message:string,success:boolean}> => {
    const response=await axios.delete<{message:string,success:boolean}>(`${API_BASE_URL}/api/v1/infra/rabbitmq-delete/${id}`,
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

import axios from 'axios';
import { vmSchema } from '@cloud/shared_types';
const API_BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export interface vmData extends vmSchema {
  id: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  status: string;
  region: string;
  is_active: boolean;
  is_provisioned: boolean;
  vm_name: string;
  projectName: string;
  projectId: string;
  ipAdress: string;
}
export interface Project {
  id: string;
  name: string;
}
export const vmApi = {
  getAllVm: async (token?:string): Promise<vmData[]> => {
    const response = await axios.get<{vms:vmData[],success:boolean}>(`${API_BASE_URL}/api/v1/infra/all-vm`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.vms;
  },

  getVm: async (id: string,token?:string): Promise<vmData> => {
    const response = await axios.get<{vm:vmData,success:boolean}>(`${API_BASE_URL}/api/v1/infra/vm-get/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.vm;
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

  createVm: async (data: vmSchema ,token?:string): Promise<vmData> => {
    const response = await axios.post<{vm:vmData,success:boolean}>(`${API_BASE_URL}/api/v1/infra/vm-create`, data,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.vm;
  },

  updateVm: async (id: string, token?:string): Promise<vmData> => {
    const response = await axios.patch<{vm:vmData,success:boolean}>(`${API_BASE_URL}/api/v1/infra/vm-update/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.vm;
  },

  deleteVm: async (id: string,token?:string): Promise<{message:string,success:boolean}> => {
    const response=await axios.delete<{message:string,success:boolean}>(`${API_BASE_URL}/api/v1/infra/vm-delete/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data
  },
  getConnection: async (id: string,token?:string): Promise<{ success: boolean; message:string,connectionString: string }> => {
    const response = await axios.get<{success:boolean,message:string,connectionString:string}>(`${API_BASE_URL}/api/v1/infra/vm-get-connection/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data  
  },
  resetConnection: async (id: string,token?:string): Promise<{ success: boolean; message:string,connectionString: string }> => {
    const response = await axios.patch<{success:boolean,message:string,connectionString:string}>(`${API_BASE_URL}/api/v1/infra/vm-reset-connection/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data  
  }
}

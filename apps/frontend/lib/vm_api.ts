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
  projectName: string;
  ipAdress: string;
}
export interface Project {
  id: string;
  name: string;
}
export const vmApi = {
  getAllVm: async (): Promise<Pick<vmData, 'id' | 'name' | 'description' | 'status' | 'region' | 'createdAt' | 'projectName' | 'projectId' | 'ipAdress'>[]> => {
    const response = await axios.get<{vm:Pick<vmData, 'id' | 'name' | 'description' | 'status' | 'region' | 'createdAt' | 'projectName' | 'projectId' | 'ipAdress'>[],success:boolean}>(`${API_BASE_URL}/api/all-vm`,
      {
        withCredentials: true
      }
    );
    return response.data.vm;
  },

  getVm: async (id: string): Promise<Pick<vmData, 'id' | 'name' | 'description' | 'status' | 'region' | 'createdAt' | 'projectName' | 'projectId' | 'ipAdress'>> => {
    const response = await axios.get<{vm:Pick<vmData, 'id' | 'name' | 'description' | 'status' | 'region' | 'createdAt' | 'projectName' | 'projectId' | 'ipAdress'>,success:boolean}>(`${API_BASE_URL}/api/vm-get/${id}`,
      {
        withCredentials: true
      }
    );
    return response.data.vm;
  },

  getProjects: async (): Promise<Project[]> => {
    const response = await axios.get<{projects:Project[],success:boolean}>(`${API_BASE_URL}/api/projects`,
      {
        withCredentials: true
      }
    );
    return response.data.projects;
  },

  createVm: async (data: vmSchema ): Promise<vmData> => {
    const response = await axios.post<{vm:vmData,success:boolean}>(`${API_BASE_URL}/api/vm-create`, data,
      {
        withCredentials: true
      }
    );
    return response.data.vm;
  },

  updateVm: async (id: string, data: Partial<vmData>): Promise<vmData> => {
    const response = await axios.patch<{vm:vmData,success:boolean}>(`${API_BASE_URL}/api/vm-update/${id}`, data,
      {
        withCredentials: true
      }
    );
    return response.data.vm;
  },

  deleteVm: async (id: string): Promise<{message:string,success:boolean}> => {
    const response=await axios.delete<{message:string,success:boolean}>(`${API_BASE_URL}/api/vm-delete/${id}`,
      {
        withCredentials: true
      }
    );
    return response.data
  },
};

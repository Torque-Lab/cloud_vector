import axios from 'axios';
import { postgresqlSchema } from '@cloud/shared_types';
const API_BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export interface pgData extends postgresqlSchema {
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
export const PostgresApi = {
  getDatabases: async (): Promise<Pick<pgData, 'id' | 'name' | 'description' | 'status' | 'size' | 'region' | 'createdAt' | 'projectName' | 'projectId'>[]> => {
    const response = await axios.get<{databases:Pick<pgData, 'id' | 'name' | 'description' | 'status' | 'size' | 'region' | 'createdAt' | 'projectName' | 'projectId'>[],success:boolean}>(`${API_BASE_URL}/api/all-postgresql`,
      {
        withCredentials: true
      }
    );
    return response.data.databases;
  },

  getDatabase: async (id: string): Promise<Pick<pgData, 'id' | 'name' | 'description' | 'status' | 'size' | 'region' | 'createdAt' | 'autoScale' | "backFrequency"| 'maxMemory'|'maxVCpu'>> => {
    const response = await axios.get<{database:Pick<pgData, 'id' | 'name' | 'description' | 'status' | 'size' | 'region' | 'createdAt' | 'autoScale' | "backFrequency" | 'maxMemory'|'maxVCpu'>,success:boolean}>(`${API_BASE_URL}/api/postgresql-get/${id}`,
      {
        withCredentials: true
      }
    );
    return response.data.database;
  },

  getProjects: async (): Promise<Project[]> => {
    const response = await axios.get<{projects:Project[],success:boolean}>(`${API_BASE_URL}/api/projects`,
      {
        withCredentials: true
      }
    );
    return response.data.projects;
  },

  createDatabase: async (data: postgresqlSchema ): Promise<pgData> => {
    const response = await axios.post<{database:pgData,success:boolean}>(`${API_BASE_URL}/api/postgresql-create`, data,
      {
        withCredentials: true
      }
    );
    return response.data.database;
  },

  updateDatabase: async (id: string, data: Partial<pgData>): Promise<pgData> => {
    const response = await axios.patch<{database:pgData,success:boolean}>(`${API_BASE_URL}/api/postgresql-update/${id}`, data,
      {
        withCredentials: true
      }
    );
    return response.data.database;
  },

  deleteDatabase: async (id: string): Promise<{message:string,success:boolean}> => {
    const response=await axios.delete<{message:string,success:boolean}>(`${API_BASE_URL}/api/postgresql-delete/${id}`,
      {
        withCredentials: true
      }
    );
    return response.data
  },
};

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export interface Database {
  id: string;
  name: string;
  description?: string;
  region: string;
  projectId: string;
  initialMemory: number;
  maxMemory: number;
  initialStorage: number;
  maxStorage: number;
  initialVCpu: number;
  maxVCpu: number;
  autoScale: string;
  backFrequency: 'daily' | 'weekly' | 'monthly';
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  name: string;
}

interface GetDatabasesParams {
  projectId?: string;
  search?: string;
}

export const databaseApi = {
  getDatabases: async (params?: GetDatabasesParams): Promise<Database[]> => {
    const response = await axios.get<{databases:Database[],success:boolean}>(`${API_BASE_URL}/postgresql`, {
      params,
    });
    return response.data.databases;
  },

  getDatabase: async (id: string): Promise<Database> => {
    const response = await axios.get<{database:Database,success:boolean}>(`${API_BASE_URL}/postgresql-get/${id}`);
    return response.data.database;
  },

  getProjects: async (): Promise<Project[]> => {
    const response = await axios.get<{projects:Project[],success:boolean}>(`${API_BASE_URL}/projects`);
    return response.data.projects;
  },

  createDatabase: async (data: Omit<Database, 'id' | 'createdAt' | 'updatedAt'>): Promise<Database> => {
    const response = await axios.post<{database:Database,success:boolean}>(`${API_BASE_URL}/postgresql-create`, data);
    return response.data.database;
  },

  updateDatabase: async (id: string, data: Partial<Database>): Promise<Database> => {
    const response = await axios.patch<{database:Database,success:boolean}>(`${API_BASE_URL}/postgresql-update/${id}`, data);
    return response.data.database;
  },

  deleteDatabase: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/postgresql-delete/${id}`);
  },
};

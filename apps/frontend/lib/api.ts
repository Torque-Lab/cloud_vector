import axios from 'axios';

const API_BASE_URL = '/api';

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
    const response = await axios.get<Database[]>(`${API_BASE_URL}/databases`, {
      params,
    });
    return response.data;
  },

  getDatabase: async (id: string): Promise<Database> => {
    const response = await axios.get<Database>(`${API_BASE_URL}/databases/${id}`);
    return response.data;
  },

  getProjects: async (): Promise<Project[]> => {
    const response = await axios.get<Project[]>(`${API_BASE_URL}/projects`);
    return response.data;
  },

  createDatabase: async (data: Omit<Database, 'id'>): Promise<Database> => {
    const response = await axios.post<Database>(`${API_BASE_URL}/databases`, data);
    return response.data;
  },

  updateDatabase: async (id: string, data: Partial<Database>): Promise<Database> => {
    const response = await axios.patch<Database>(`${API_BASE_URL}/databases/${id}`, data);
    return response.data;
  },

  deleteDatabase: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/databases/${id}`);
  },
};

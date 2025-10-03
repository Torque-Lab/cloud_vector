import axios from 'axios';
import { postgresqlSchema } from '@cloud/shared_types';
const API_BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export interface Database extends postgresqlSchema {
  id: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  status: string;
}

export interface Project {
  id: string;
  name: string;
}
export const PostgresApi = {
  getDatabases: async (): Promise<Database[]> => {
    const response = await axios.get<{databases:Database[],success:boolean}>(`${API_BASE_URL}/api/postgresql`,
      {
        withCredentials: true
      }
    );
    return response.data.databases;
  },

  getDatabase: async (id: string): Promise<Database> => {
    const response = await axios.get<{database:Database,success:boolean}>(`${API_BASE_URL}/api/postgresql-get/${id}`,
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

  createDatabase: async (data: Omit<Database, 'id' | 'createdAt' | 'updatedAt' | 'description' | 'status'>): Promise<Database> => {
    const response = await axios.post<{database:Database,success:boolean}>(`${API_BASE_URL}/api/postgresql-create`, data,
      {
        withCredentials: true
      }
    );
    return response.data.database;
  },

  updateDatabase: async (id: string, data: Partial<Database>): Promise<Database> => {
    const response = await axios.patch<{database:Database,success:boolean}>(`${API_BASE_URL}/api/postgresql-update/${id}`, data,
      {
        withCredentials: true
      }
    );
    return response.data.database;
  },

  deleteDatabase: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/api/postgresql-delete/${id}`,
      {
        withCredentials: true
      }
    );
  },
};

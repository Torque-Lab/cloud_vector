import axios from 'axios';
import { postgresqlSchema } from '@cloud/shared_types';
const API_BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export interface pgData extends postgresqlSchema {
  id: string;
  region: string;
  projectName: string;
  is_provisioned: boolean,
  database_name: string,
  createdAt: string,
  updatedAt: string,
}
export interface Project {
  id: string;
  name: string;
}
export const PostgresApi = {
  getDatabases: async (token: string): Promise<pgData[]> => {
    const response = await axios.get<{databases:pgData[],success:boolean}>(`${API_BASE_URL}/api/v1/infra/all-postgresql`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.databases;
  },

  getDatabase: async (id: string,token?:string): Promise<pgData> => {
    const response = await axios.get<{database:pgData,success:boolean}>(`${API_BASE_URL}/api/v1/infra/postgresql-get/?postgresId=${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.database;
  },

  getProjects: async (token?: string): Promise<Project[]> => {
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

  createDatabase: async (data: postgresqlSchema,token?:string ): Promise<pgData> => {
    const response = await axios.post<{database:pgData,success:boolean}>(`${API_BASE_URL}/api/v1/infra/postgresql-create`, data,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.database;
  },
  getConnection:async(id:string,token?:string): Promise<{message:string,success:boolean,connectionString:string}> => {
    const response = await axios.get<{message:string,success:boolean,connectionString:string}>(`${API_BASE_URL}/api/v1/infra/postgresql-connection/?postgresId=${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data
  },

  resetConnection: async (id: string,token?:string): Promise<{message:string,success:boolean,connectionString:string}> => {
    const response = await axios.patch<{message:string,success:boolean,connectionString:string}>(`${API_BASE_URL}/api/v1/infra/postgresql-reset/?postgresId=${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data
  },

  deleteDatabase: async (id: string,token?:string): Promise<{message:string,success:boolean}> => {
    const response=await axios.delete<{message:string,success:boolean}>(`${API_BASE_URL}/api/v1/infra/postgresql-delete/?postgresId=${id}`,
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

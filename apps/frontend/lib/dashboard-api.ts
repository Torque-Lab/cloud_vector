import axios from "axios";
import { API_BASE_URL } from "./pg_api";
import {projectDataDetails} from "@cloud/shared_types"


export const dashboardApi={
    getProjectsDetails: async (token: string,projectId:string): Promise<{projectDetails:projectDataDetails,message:string,success:boolean}> => {
        const response = await axios.get<{projectDetails:projectDataDetails,message:string,success:boolean}>(`${API_BASE_URL}/api/v1/infra/project-details-depth/${projectId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      },  
}

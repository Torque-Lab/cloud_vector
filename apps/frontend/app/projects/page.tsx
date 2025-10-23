export const dynamic = 'force-dynamic';

import axios from "axios";
import ProjectsPage from "./_ignoreClient/page";
import { ProjectData } from "@cloud/shared_types";
import getSessionInServer from "@/provider/server-session";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "@/lib/pg_api";

export default async function ProjectServerWrapper() {
    const token=await getSessionInServer()
    if(!token || token==="" || token===null){
        redirect("/signin")
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
    try{
        const projectData = await axios.get<{ProjectData: ProjectData[],message:string,success:boolean}>(`${API_BASE_URL}/api/v1/infra/project-details`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return <ProjectsPage projectData={projectData.data.ProjectData} />
    }
    catch(_){
        return <ProjectsPage projectData={[{id:"",name:"",description:"No Projects Found",status:"",postgres:0,redis:0,rabbitMQ:0,vm:0,cost:"",createdAt:""}]} />
    }
    
}
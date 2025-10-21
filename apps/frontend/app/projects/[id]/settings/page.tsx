import ProjectSettingsDetailsPage from "../../_ignoreClient/project-depth";
import getSessionInServer from "@/provider/server-session";
import { redirect } from "next/navigation";
import { dashboardApi } from "@/lib/dashboard-api";

export default async function ProjectSettingsPageServerWrapper({params}: {params: Promise<{id: string}>}) {
    const token=await getSessionInServer()
    if(!token || token==="" || token===null){
        redirect("/signin")
    }

    const projectId = (await params).id as string
    try{
        const projectData = await dashboardApi.getProjectsDetails(token,projectId)
        return <ProjectSettingsDetailsPage projectDataDetails={projectData.projectDetails} />
    }
    catch(_){
        return <ProjectSettingsDetailsPage projectDataDetails={{id:"",name:"",description:"",status:"",admin:"",created:"",team:[]}} />
    }
    
}
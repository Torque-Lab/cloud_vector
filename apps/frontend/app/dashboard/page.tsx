import getSessionInServer from "@/provider/server-session";
import DashboardClientPage from "./_ignoreClient/page";
import { redirect } from "next/navigation";
import { PostgresApi } from "@/lib/pg_api";
import axios from "axios";
import { DashboardDataProps } from "./_ignoreClient/page";

export default async function DashboardServerPage() {
    const token =await getSessionInServer()
    if(!token || token===""){
        redirect("/signin") 
    }
    try{
        const projects=await PostgresApi.getProjects(token)
        const dashboardData=await axios.get<{DashboardData:DashboardDataProps,message:string,success:boolean}>("/api/infra/v1/dashboard",{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return <DashboardClientPage data={dashboardData.data.DashboardData} projects={projects}/>

    }catch(e){
        return <DashboardClientPage data={{allData:{metrics:[],recentActivity:[],topDatabases:[],storageBreakdown:[]}}} projects={[]}/>
    }
    
}
import getSessionInServer from "@/provider/server-session";
import DashboardClientPage from "./_ignoreClient/page";
import { redirect } from "next/navigation";
import { PostgresApi } from "@/lib/pg_api";
import axios from "axios";
import {DashboardDataType} from "@cloud/shared_types"
import { API_BASE_URL } from "@/lib/pg_api";
export default async function DashboardServerPage() {
    const token =await getSessionInServer()
    if(!token || token===""){
        redirect("/signin") 
    }
    try{
        const projects=await PostgresApi.getProjects(token)
        const dashboardData=await axios.get<{DashboardData:DashboardDataType,message:string,success:boolean}>(`${API_BASE_URL}/api/v1/infra/dashboard`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return <DashboardClientPage data={dashboardData.data.DashboardData} projects={projects}/>

    }catch(_){
        
        return <DashboardClientPage data={{allData:{all:{metrics:[],recentActivity:[],topDatabases:[],storageBreakdown:[]}}}} projects={[]}/>
    }
    
}
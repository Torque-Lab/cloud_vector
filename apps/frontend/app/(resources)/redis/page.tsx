import { RedisApi } from "@/lib/redis_api";
import ErrorPage from "./_ignoreClient/error_page";
import getSessionInServer from "@/provider/server-session";
import AllDatabasesPage from "./_ignoreClient/client_page_main";
import { redirect } from "next/navigation";
export default async function AllDatabaseDetailPageServerWrapper() {
   const token = await getSessionInServer()
   if (!token || token === null || token === undefined) {
     redirect("/signin")
  }
   try{
    const [redis,projects] = await Promise.all([RedisApi.getAllRedis(token),RedisApi.getProjects(token)])
    return <AllDatabasesPage redis={redis} projects={projects}/>
   }catch(e){
    return  <ErrorPage cardTitle="Databases Not Found" paragraph="  We couldn’t load the requested database details. The databases
    may not exist, or there was a problem fetching its information."/>
   }
}
    

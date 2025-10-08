
import { RedisApi } from "@/lib/redis_api";
import ErrorPage from "./_ignoreClient/error_page";
import getSessionInServer from "@/provider/server-session";
import AllRedisPage from "./_ignoreClient/client_page_main";
import { redirect } from "next/navigation";
export default async function AllRedisDetailPageServerWrapper() {
   const token = await getSessionInServer()
   if (!token || token === null || token === undefined) {
     redirect("/signin")
  }
   try{
    const [redis,projects] = await Promise.all([RedisApi.getAllRedis(token),RedisApi.getProjects(token)])
    return <AllRedisPage redis={redis} projects={projects}/>
   }catch(_){
    return  <ErrorPage cardTitle="Redis Not Found" paragraph="  We couldn’t load the requested redis details. The redis
    may not exist, or there was a problem fetching its information."/>
   }
}
    

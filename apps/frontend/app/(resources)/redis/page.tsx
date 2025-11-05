export const dynamic = 'force-dynamic';
import { RedisApi } from "@/lib/redis_api";
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
    return <AllRedisPage redis={[]} projects={[]}/>
   }
}
    

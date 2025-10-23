export const dynamic = 'force-dynamic';
import { RedisApi } from "@/lib/redis_api";
import ErrorPage from "../_ignoreClient/error_page";
import getSessionInServer from "@/provider/server-session";
import { redirect } from "next/navigation";
import RedisDetailPage from "../_ignoreClient/client_page";
export default async function RedisDetailPageServerWrapper({params}: {params: Promise<{id: string}>}) {
     const token = await getSessionInServer()
     if (!token || token === null || token === undefined) {
       redirect("/signin")
    }
const id =  (await params).id
   try{
    const redis = await RedisApi.getRedis(id,token)
    return <RedisDetailPage redis={redis}/>
   }catch(_){
    return  <ErrorPage cardTitle="Redis Not Found" paragraph="  We couldn’t load the requested Redis details. The Redis
    may not exist, or there was a problem fetching its information."/>
   }
}
    

import DatabaseDetailPage from "../_ignoreClient/client_page";
import { RedisApi } from "@/lib/redis_api";
import ErrorPage from "../_ignoreClient/error_page";
import getSessionInServer from "@/provider/server-session";
import { redirect } from "next/navigation";

export default async function DatabaseDetailPageServerWrapper({params}: {params: Promise<{id: string}>}) {
     const token = await getSessionInServer()
     if (!token || token === null || token === undefined) {
       redirect("/signin")
    }
const id =  (await params).id
   try{
    const redis = await RedisApi.getRedis(token,id)
    return <DatabaseDetailPage redis={redis}/>
   }catch(e){
    return  <ErrorPage cardTitle="Database Not Found" paragraph="  We couldn’t load the requested database details. The database
    may not exist, or there was a problem fetching its information."/>
   }
}
    

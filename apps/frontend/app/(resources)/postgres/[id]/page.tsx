import DatabaseDetailPage from "./_ignoreClient/client_page";
import { PostgresApi } from "@/lib/pg_api";
import ErrorPage from "./_ignoreClient/error_page";
import getSessionInServer from "@/provider/server-session";

export default async function DatabaseDetailPageServerWrapper({params}: {params: Promise<{id: string}>}) {
   const token = await getSessionInServer()
   if(!token){
    return <ErrorPage/>
   }
const id =  (await params).id
   try{
    const database = await PostgresApi.getDatabase(id)
    return <DatabaseDetailPage database={database}/>
   }catch(e){
    return <ErrorPage/>
   }
}
    

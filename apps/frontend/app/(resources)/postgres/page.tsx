
export const dynamic = 'force-dynamic';
import { PostgresApi } from "@/lib/pg_api";
import getSessionInServer from "@/provider/server-session";
import AllDatabasesPage from "./_ignoreClient/client_page_main";
import { redirect } from "next/navigation";
export default async function AllDatabaseDetailPageServerWrapper() {
   const token = await getSessionInServer()
   if (!token || token === null || token === undefined) {
     redirect("/signin")
  }
  
   try{
    const [database,projects] = await Promise.all([PostgresApi.getDatabases(token),PostgresApi.getProjects(token)])
    return <AllDatabasesPage databases={database} projects={projects}/>
   }catch(e){
   return  <AllDatabasesPage databases={[]} projects={[]}/>
   }
}
    

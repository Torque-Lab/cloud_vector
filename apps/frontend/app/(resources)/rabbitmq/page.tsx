export const dynamic = 'force-dynamic';
import { RabbitApi } from "@/lib/rabbit_api";
import getSessionInServer from "@/provider/server-session";
import AllRabbitmqPage from "./_ignoreClient/client_page_main";
import { redirect } from "next/navigation";
export default async function AllRabbitmqDetailPageServerWrapper() {
   const token = await getSessionInServer()
   if (!token || token === null || token === undefined) {
     redirect("/signin")
  }
   try{
    const [rabbitmq,projects] = await Promise.all([RabbitApi.getAllRabbitmq(token),RabbitApi.getProjects(token)])
    return <AllRabbitmqPage rabbitmq={rabbitmq} projects={projects}/>
   }catch(e){
    return <AllRabbitmqPage rabbitmq={[]} projects={[]}/>
   }
}
    

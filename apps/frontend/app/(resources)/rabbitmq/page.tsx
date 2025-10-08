
import { RabbitApi } from "@/lib/rabbit_api";
import ErrorPage from "./_ignoreClient/error_page";
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
console.log(e)
    return  <ErrorPage cardTitle="RabbitMQ Not Found" paragraph="  We couldn’t load the requested RabbitMQ details. The RabbitMQ
    may not exist, or there was a problem fetching its information."/>
   }
}
    

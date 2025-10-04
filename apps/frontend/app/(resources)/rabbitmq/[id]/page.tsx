import DatabaseDetailPage from "../_ignoreClient/client_page";
import { RabbitApi } from "@/lib/rabbit_api";
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
    const rabbitmq = await RabbitApi.getRabbitmq(id)
    return <DatabaseDetailPage rabbitmq={rabbitmq}/>
   }catch(e){
    return  <ErrorPage cardTitle="RabbitMQ Not Found" paragraph="  We couldn’t load the requested RabbitMQ details. The RabbitMQ
    may not exist, or there was a problem fetching its information."/>
   }
}
    

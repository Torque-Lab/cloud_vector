import VmDetailPage from "../_ignoreClient/client_page";
import { vmApi } from "@/lib/vm_api";
import ErrorPage from "../_ignoreClient/error_page";
import getSessionInServer from "@/provider/server-session";
import { redirect } from "next/navigation";

export default async function VmDetailPageServerWrapper({params}: {params: Promise<{id: string}>}) {
     const token = await getSessionInServer()
     if (!token || token === null || token === undefined) {
       redirect("/signin") 
    }
const id =  (await params).id
   try{
    const vm = await vmApi.getVm(id,token)
    return <VmDetailPage vm={vm}/>
   }catch(_){
    return  <ErrorPage cardTitle="Virtual Machine Not Found" paragraph="  We couldn’t load the requested virtual machine details. The virtual machine
    may not exist, or there was a problem fetching its information."/>
   }
}
    

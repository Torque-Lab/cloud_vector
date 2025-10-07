import { vmApi, vmData ,Project} from "@/lib/vm_api";
import ErrorPage from "./_ignoreClient/error_page";
import getSessionInServer from "@/provider/server-session";
import AllVmPage from "./_ignoreClient/client_page_main";
import { redirect } from "next/navigation";
export default async function AllVmDetailPageServerWrapper() {
   const token = await getSessionInServer()
   if (!token || token === null || token === undefined) {
     redirect("/signin")
  }
   try{
   //  const [vms,projects] = await Promise.all([vmApi.getAllVm(token),vmApi.getProjects(token)])
   const vms:vmData[]=[];
   const projects:Project[]=[];
    return <AllVmPage vms={vms} projects={projects}/>
   }catch(e){
      console.log(e)
    return  <ErrorPage cardTitle="Virtual Machines Not Found" paragraph="  We couldn’t load the requested virtual machine details. The virtual machines
    may not exist, or there was a problem fetching its information."/>
   }
}
    

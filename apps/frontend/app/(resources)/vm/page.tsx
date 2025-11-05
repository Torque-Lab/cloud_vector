export const dynamic = 'force-dynamic';
import { vmApi} from "@/lib/vm_api";
import getSessionInServer from "@/provider/server-session";
import AllVmPage from "./_ignoreClient/client_page_main";
import { redirect } from "next/navigation";
export default async function AllVmDetailPageServerWrapper() {
   const token = await getSessionInServer()
   if (!token || token === null || token === undefined) {
     redirect("/signin")
  }
   try{
    const [vms,projects] = await Promise.all([vmApi.getAllVm(token),vmApi.getProjects(token)])
    return <AllVmPage vms={vms} projects={projects}/>
   }catch(e){
    return <AllVmPage vms={[]} projects={[]}/>
   }
}
    

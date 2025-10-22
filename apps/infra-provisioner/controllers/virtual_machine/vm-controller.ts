import type { vmSchemaDetails } from "@cloud/backend-common";










export function vmProvisioner(vmData:vmSchemaDetails):Promise<{message:string,success:boolean,host:string}>{
    const {vmId,subscriptionPlan,...vm}=vmData
    
    
}










export function vmDestroyer(vmData:string):Promise<boolean>{
    
}
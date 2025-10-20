import { prismaClient, ProvisioningFlowStatus } from '@cloud/db';
import { KubeConfig, Watch } from '@kubernetes/client-node';
const kc = new KubeConfig();

kc.loadFromDefault();

const watch = new Watch(kc);

interface ArgoCDApplication {
  apiVersion: string;
  kind: "Application";
  metadata: {
    name: string;
    namespace: string;
  };
  status?: {
    sync?: {
      status?: string; // "Synced" | "OutOfSync"
    };
    operationState?: {
      phase?: string; // "Running" | "Succeeded" | "Failed"
    };
  };
}
 //"ADDED" | "MODIFIED" | "DELETED" | "BOOKMARK";

async function startListener() {
  const queue = new Queue(); 

  watch.watch(
    '/apis/argoproj.io/v1alpha1/namespaces/argocd/applications',
    {},
    (type, obj: ArgoCDApplication) => {
      console.log(`Event: ${type}`);
      console.log(`App: ${obj.metadata.name}`);
      console.log(`Phase: ${obj?.status?.operationState?.phase}`);
      queue.enqueue({ type, obj }); 
    },
    err => {
      if (err) console.error(err);
    }
  );
  await queue.processQueue().catch(err => {
    console.log(err);
  });
}


startListener();

class Queue {
  queue: {type: string, obj: ArgoCDApplication}[];
  constructor() {
    this.queue = [];
  }
  enqueue(item: {type: string, obj: ArgoCDApplication}) {
    if (this.queue.length > 1000000) {
        console.log("Queue overflow —> dropping event");
      return;
}
    this.queue.push(item);
  }
  dequeue() {
    return this.queue.shift();
  }
  isEmpty() {
    return this.queue.length === 0;
  }
  public async processQueue() {
    while (!this.isEmpty()) {
      const item = this.dequeue();
      switch (item?.type) {
        case "ADDED":
            switch(this.parseApp(item?.obj)){
                case "postgres":
                    await this.handlePostgresAdd(item?.obj);
                    break;
                case "redis":
                    await this.handleRedisAdd(item?.obj);
                    break;
                case "rabbitmq":
                    await this.handleRabbitmqAdd(item?.obj);
                    break;
                default:
                    console.log(`Service type not found in app name: ${item?.obj.metadata.name}`);
                    break;
            }
          break;
        case "MODIFIED":
            switch(this.parseApp(item?.obj)){
                case "postgres":
                    await this.handlePostgresUpdate(item?.obj);
                    break;
                case "redis":
                    await this.handleRedisUpdate(item?.obj);
                    break;
                case "rabbitmq":
                    await this.handleRabbitmqUpdate(item?.obj);
                    break;
                default:
                    console.log(`Service type not found in app name: ${item?.obj.metadata.name}`);
                    break;
            }
          break;
        case "DELETED":
            switch(this.parseApp(item?.obj)){
                case "postgres":
                    await this.handlePostgresDelete(item?.obj);
                    break;
                case "redis":
                    await this.handleRedisDelete(item?.obj);
                    break;
                case "rabbitmq":
                    await this.handleRabbitmqDelete(item?.obj);
                    break;
                default:
                    console.log(`Service type not found in app name: ${item?.obj.metadata.name}`);
                    break;
            }
          break;
        case "BOOKMARK":
             console.log(`Bookmark event: ${item?.obj.metadata.name}`);
          break;
      }

    }
 
   

    }
    private extractId(value: string): string {
  if (!value) return "";
  const parts = value.split("-");
  if (parts.length > 5) {
    return parts.slice(0, -1).join("-");
  }
  return value;
}

private parseApp(app: ArgoCDApplication) {
  const name = app.metadata.name;
  const match = name.match(/-(postgres|redis|rabbitmq)-/);

  if (!match) {
    console.log(`Service type not found in app name: ${name}`);
    return "unknown";
  }
  const service = match[1];
  return service;
}
   private async  handlePostgresAdd(app: ArgoCDApplication) {
    const name = app.metadata.name;
    try{
    const response=await prismaClient.postgresDB.update({
        where:{
            id:this.extractId(name)
        },
        data:{
            provisioning_flow_status:ProvisioningFlowStatus.PUSHED_TO_ARGOCD
        }
    })
    console.log("postgresDB updated",response)
    }catch(err){
        console.log(err)
    }        
    }
    private  async handlePostgresUpdate(app: ArgoCDApplication) {
        const name = app.metadata.name;
        const status=this.parseStatus(app.status?.sync?.status,app.status?.operationState?.phase);
        try{
            const response=await prismaClient.postgresDB.update({
                where:{
                    id:this.extractId(name)
                },
                data:{
                    is_provisioned:status==ProvisioningFlowStatus.COMPLETED,
                    provisioning_flow_status: status
                }
            })
            console.log("postgresDB updated",response)
            }catch(err){
                console.log(err)
            }        
        
    }
    private  async handlePostgresDelete(app: ArgoCDApplication) {
        const name = app.metadata.name;
        try{
            const response=await prismaClient.postgresDB.update({
                where:{
                    id:this.extractId(name)
                },
                data:{
                    is_active:false
                }
            })
            console.log("postgresDB updated",response)
            }catch(err){
                console.log(err)
            }        
        
    }
    private async handleRedisAdd(app: ArgoCDApplication) {
        const name = app.metadata.name;
        const status=this.parseStatus(app.status?.sync?.status,app.status?.operationState?.phase);
        try{
            const response=await prismaClient.redis.update({
                where:{
                    id:this.extractId(name)
                },
                data:{
                  
                    provisioning_flow_status:status
                }
            })
            console.log("redis updated",response)
            }catch(err){
                console.log(err)
            }        
        
    }
    private async handleRedisUpdate(app: ArgoCDApplication) {
        const name = app.metadata.name;
        const status=this.parseStatus(app.status?.sync?.status,app.status?.operationState?.phase);
        try{
            const response=await prismaClient.redis.update({
                where:{
                    id:this.extractId(name)
                },
                data:{
                    is_provisioned:status==ProvisioningFlowStatus.COMPLETED,
                    provisioning_flow_status: status
                }
            })
            console.log("redis updated",response)
            }catch(err){
                console.log(err)
            }        
        
    }
    private async handleRedisDelete(app: ArgoCDApplication) {
        const name = app.metadata.name;
        try{
            const response=await prismaClient.redis.update({
                where:{
                    id:this.extractId(name)
                },
                data:{
                    is_active:false
                }
            })
            console.log("redis updated",response)
            }catch(err){
                console.log(err)
            }        
        
    }
    private async handleRabbitmqAdd(app: ArgoCDApplication) {
        const name = app.metadata.name;
        const status=this.parseStatus(app.status?.sync?.status,app.status?.operationState?.phase);
        try{
            const response=await prismaClient.rabbitMQ.update({
                where:{
                    id:this.extractId(name)
                },
                data:{
                            provisioning_flow_status:status
                }
            })
            console.log("rabbitmq updated",response)
            }catch(err){
                console.log(err)
            }        
        
    }
    private async handleRabbitmqUpdate(app: ArgoCDApplication) {
        const name = app.metadata.name;
        const status=this.parseStatus(app.status?.sync?.status,app.status?.operationState?.phase);
        try{
            const response=await prismaClient.rabbitMQ.update({
                where:{
                    id:this.extractId(name) 
                },
                data:{
                    is_provisioned: status==ProvisioningFlowStatus.COMPLETED,
                    provisioning_flow_status: status
                }
            })
            console.log("rabbitmq updated",response)
            }catch(err){
                console.log(err)
            }        
        
    }
    private async handleRabbitmqDelete(app: ArgoCDApplication) {
        const name = app.metadata.name;
        try{
            const response=await prismaClient.rabbitMQ.update({
                where:{
                    id:this.extractId(name)
                },
                data:{
                    is_active:false
                }
            })
            console.log("rabbitmq updated",response)
            }catch(err){
                console.log(err)
            }        
        
    }
    private parseStatus(status:string|undefined,phase:string|undefined){
        if(status=="Synced" || phase=="Succeeded" || phase=="Running" ||status=="Healthy"){
            return ProvisioningFlowStatus.COMPLETED
        }else if(status=="OutOfSync" && phase=="Failed" || status=="Unhealthy"){
            return ProvisioningFlowStatus.FAILED
        }else{
            return ProvisioningFlowStatus.PUSHED_TO_ARGOCD
        }
    }
}
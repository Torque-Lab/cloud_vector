import { acquireGitPushLock, releaseGitPushLock, type vmSchemaDetails } from "@cloud/backend-common";
import { runCommand } from "../../git/runCommand";
import { repoUrlVmWithPAT,branch, vmRepoPath } from "../../config/config";
import path from "path";
import fs from "fs";
import { prismaClient } from "@cloud/db";
export async function vmProvisioner(vmData:vmSchemaDetails):Promise<{message:string,success:boolean,host:string}>{
    const {vmId,subscriptionPlan,...vm}=vmData
    try{
            await runCommand(["git", "clone", repoUrlVmWithPAT], { cwd: vmRepoPath() });
            await runCommand(["git", "checkout", branch], { cwd: vmRepoPath()+"/vm-tf" });
         const subscriptionPlanPath=subscriptionPlan=="FREE"?"free":subscriptionPlan=="BASE"?"base":subscriptionPlan=="PRO"?"pro":"enterprise"

            const baseConfigPath = path.join(
              vmRepoPath(),
              "vm-tf",
              "node",
              `base_config_${subscriptionPlanPath}`
            );
            const newVmPath = path.join(
              vmRepoPath(),
              "vm-tf",
              "node",
              vmId
            );
          
        
            if (!fs.existsSync(baseConfigPath)) {
              return {success:false,message:"Base config not found",host:""};
            }
            if (fs.existsSync(newVmPath)) {
              return {success:false,message:"VM already exists",host:""};
            }
            
          
            fs.mkdirSync(newVmPath, { recursive: true });
            fs.cpSync(baseConfigPath, newVmPath, { recursive: true });
            
            const mainTfPath = path.join(newVmPath, "main.tf");
            let mainTfContent = fs.readFileSync(mainTfPath, "utf-8");
            
            const machineType = getMachineType(vm.vCpu, vm.memory);
            
            mainTfContent = mainTfContent.replace(/instance_name\s*=\s*"[^"]*"/, `instance_name  = "${vm.name}"`);
            mainTfContent = mainTfContent.replace(/machine_type\s*=\s*"[^"]*"/, `machine_type   = "${machineType}"`);
            mainTfContent = mainTfContent.replace(/disk_size_gb\s*=\s*\d+/, `disk_size_gb   = ${vm.storage}`);
            mainTfContent = mainTfContent.replace(/ssh_public_key\s*=\s*"[^"]*"/, `ssh_public_key = "${vm.publicKey}"`);
            mainTfContent = mainTfContent.replace(/region\s*=\s*"[^"]*"/, `region         = "${vm.region}"`);
            mainTfContent = mainTfContent.replace(/zone\s*=\s*"[^"]*"/, `zone           = "${vm.region}-a"`);
            
            fs.writeFileSync(mainTfPath, mainTfContent);
            

            const backendTfPath = path.join(newVmPath, "backend.tf");
            let backendTfContent = fs.readFileSync(backendTfPath, "utf-8");
            backendTfContent = backendTfContent.replace(/prefix\s*=\s*"[^"]*"/, `prefix  = "prod/vm/${vmId}/terraform.tfstate"`);
            fs.writeFileSync(backendTfPath, backendTfContent);
            
            const outputsTfPath = path.join(newVmPath, "outputs.tf");
            const outputsContent = `output "public_ip" {
  description = "Public IP address of the VM"
  value       = module.${subscriptionPlanPath}.public_ip
}
`;
            fs.writeFileSync(outputsTfPath, outputsContent);
            await runCommand(["ln", "-sf", "../../providers.tf", "./providers.tf"], { cwd: newVmPath });
            await runCommand(["terraform", "init"], { cwd: newVmPath });
            await runCommand(["terraform", "apply", "-auto-approve"], { cwd: newVmPath });
            
            const outputResult = await runCommand(["terraform", "output", "-json"], { cwd: newVmPath });
            const outputs = JSON.parse(outputResult.stdout);
            const publicIp = outputs.public_ip?.value || "";
            
            await runCommand(["git", "add", "-A"], { cwd: vmRepoPath()+"/vm-tf" });
            await safeGitCommitVm("Added new vm ", vmId);
            await triggerGitPushVm();

                await prismaClient.virtualMachine.update({
                    where:{
                        id:vmId
                    },
                    data:{
                        is_provisioned:true,
                        host:publicIp
                       
                    }
                })
            
            return {
              success: true,
              message: `VM ${vmId} created and pushed successfully`,
              host: publicIp
            };
          } catch (error) {
            console.log("VM provisioning error:", error);
            return {
              success: false,
              message: `Failed to provision vm: ${error instanceof Error ? error.message : 'Unknown error'}`,
              host: ""
            };
          }
    

    
}
export async function vmDestroyer(vmId:string):Promise<boolean>{
    try{
        await runCommand(["git", "clone", repoUrlVmWithPAT], { cwd: vmRepoPath() });
        await runCommand(["git", "checkout", branch], { cwd: vmRepoPath()+"/vm-tf" });
        
        const vmPath = path.join(
          vmRepoPath(),
          "vm-tf",
          "node",
          vmId
        );
        
        if (!fs.existsSync(vmPath)) {
          console.log(`VM ${vmId} not found`);
          return false;
        }
        
        await runCommand(["terraform", "destroy", "-auto-approve"], { cwd: vmPath });
        
        fs.rmSync(vmPath, { recursive: true, force: true });
        
        await runCommand(["git", "add", "-A"], { cwd: vmRepoPath()+"/vm-tf" });
        await safeGitCommitVm("Removed vm ", vmId);
        await triggerGitPushVm();
        
        return true;
    } catch (error) {

        console.log("VM destruction error:", error);
        return false;
    }
}
function getMachineType(vCpu: string, memory: string): string {
    const cpu = parseInt(vCpu);
    const mem = parseInt(memory);
    
    if (cpu === 2 && mem <= 8) return "e2-medium";
    if (cpu === 2 && mem <= 16) return "e2-standard-2";
    if (cpu === 4 && mem <= 16) return "e2-standard-4";
    if (cpu === 8 && mem <= 32) return "e2-standard-8";
    
    
    if (cpu === 2 && mem <= 16) return "n2-standard-2";
    if (cpu === 4 && mem <= 16) return "n2-standard-4";
    if (cpu === 8 && mem <= 32) return "n2-standard-8";
    if (cpu === 16 && mem <= 64) return "n2-standard-16";
    
    return "e2-medium";
}

let pauseCommitVm = false;
let pushInProgressVm = false;
let pushScheduledVm: NodeJS.Timeout | null = null;
export async function waitForPauseToCommitVm(): Promise<void> {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            if (!pauseCommitVm) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 10000); 
    });
  }
  export async function waitForPauseGitPushVm(): Promise<void> {
    return new Promise((resolve) => {
        const checkInterval = setInterval(async () => {
            if (await acquireGitPushLock(120,"git-push-lock-vm")) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 10000); 
    });
  }
  export async function triggerGitPushVm() {
    if (pushScheduledVm) {
      clearTimeout(pushScheduledVm);
    }
    pushScheduledVm = setTimeout(async () => {
      if (pushInProgressVm) {
        triggerGitPushVm();
        return;
      }
  
      pushInProgressVm = true;
      pauseCommitVm = true;
      try {
        console.log("Starting git push...");
        await safeGitPushVm();
        console.log("Git push completed successfully.");
      } catch (err) {
        console.error("Git push failed:", err);
      } finally {
        pushInProgressVm = false;
        pushScheduledVm = null;
        pauseCommitVm = false;
      }
    }, 5000);
  }
  export async function safeGitCommitVm(commit_message: string,resources_id: string) {
    await waitForPauseToCommitVm();
    await runCommand(["git", "add", "-A"], { cwd: vmRepoPath() + "/vm-tf" });
    await runCommand(
        ["git", "commit", "-m", commit_message+" "+resources_id],
        { cwd: vmRepoPath() + "/vm-tf" }
    );
  }
  export async function safeGitPushVm() {
    await waitForPauseGitPushVm();
    await runCommand(
        ["git", "push", repoUrlVmWithPAT, branch],
        { cwd: vmRepoPath() + "/vm-tf" }
    );
    await releaseGitPushLock("git-push-lock-vm");
  }
  

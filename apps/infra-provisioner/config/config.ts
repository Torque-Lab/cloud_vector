import fs from "fs"
const OPS_PAT=process.env.OPS_PAT;
export const repoUrl = `https://${OPS_PAT}@github.com/Torque-Lab/cloud-infra-ops.git`; 
export const branch = "main";
export const primary_base_backend="http://localhost:3000";
export function repoPath(){
    if(!fs.existsSync(`${process.cwd()}/infra_provisioner_temp_dir`)){
        fs.mkdirSync(`${process.cwd()}/infra_provisioner_temp_dir`);
    }   
    return `${process.cwd()}/infra_provisioner_temp_dir`;
}
    
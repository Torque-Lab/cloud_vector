import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { repoUrlWithOutPAT,repoUrlWithPAT, repoPath, branch } from "../../config/config";
import { runCommand } from "../../git/runCommand";
import { safeGitCommit, triggerGitPush } from "../../git/git-tools";
import type { InfraConfig } from "@cloud/shared_types";

export const redisProvisioner = async(infraConfig:InfraConfig) => {
  try {
   const redis_id=infraConfig.resource_id;
   const namespace=infraConfig.namespace;
    await runCommand(["git", "clone", repoUrlWithPAT], { cwd: repoPath() });
    await runCommand(["git", "checkout", branch], { cwd: repoPath()+"/cloud-infra-ops" });

    const baseDbPath = path.join(
      repoPath(),
      "cloud-infra-ops",
      "apps",
      "baseconfig",
      "redis"
    );
    const newDbPath = path.join(
      repoPath(),
      "cloud-infra-ops",
      "apps",
      "external-charts",
       redis_id
    );
    const argocdPath = path.join(
      repoPath(),
      "cloud-infra-ops",
      "argocd",
      "external",
    );

    if (!fs.existsSync(baseDbPath)) {
      return {success:false,message:"Base DB app not found"};
    }
    if (!fs.existsSync(newDbPath)) {
      fs.mkdirSync(newDbPath, { recursive: true });
      fs.cpSync(baseDbPath, newDbPath, { recursive: true });
    }

    const valuesFile = path.join(baseDbPath, "values.yaml");
    const newValuesFile = path.join(newDbPath, "values.yaml");

    let valuesYaml: any = {};
    if (fs.existsSync(valuesFile)) {
      const fileContent = fs.readFileSync(valuesFile, "utf8");
      valuesYaml = yaml.load(fileContent) || {};
    }

    const mergedValues = {
      ...valuesYaml,
      ...{
        redis: {
          redis_id: redis_id,
          name: "redis",
          resources: {
            requests: {
              cpu: infraConfig.initialVCpu  ,
              memory: infraConfig.initialMemory,
            },
            limits: {
              cpu: infraConfig.maxVCpu,
              memory: infraConfig.maxMemory,
            },
          },
          autoscaling: {
            enabled: false,
            minReplicas: 1,
            maxReplicas: 1,
            targetCPUUtilizationPercentage: 80,
            targetMemoryUtilizationPercentage: 80,
          },
          service: {
            port: 6379,
            targetPort: 6379,
            type: "ClusterIP",
          },
          storage: infraConfig.initialStorage,
          backup: {
            enabled: true,
            schedule: "0 0 * * *",
          },
        },
      },
    };  
    fs.writeFileSync(newValuesFile, yaml.dump(mergedValues), "utf8");

    const argocdApp = {
      apiVersion: "argoproj.io/v1alpha1",
      kind: "Application",
      metadata: {
        name: redis_id+"-redis",
        namespace: "argocd",
        annotations: {
      "argocd.argoproj.io/sync-options": "CreateNamespace=true"
    }
      },
      spec: {
        project: "default",
        source: {
          repoURL: repoUrlWithOutPAT,
          targetRevision: branch,
          path: `gitops/apps/${redis_id}`,
        },
        destination: {
          server: "https://kubernetes.default.svc",
          namespace: namespace,
        },
        syncPolicy: {
          automated: {
            prune: true,
            selfHeal: true,
          },
        },
      },
    };
    if(!fs.existsSync(argocdPath)){
      fs.mkdirSync(argocdPath, { recursive: true });
    }
    const filepath = path.join(argocdPath, `${redis_id}.yaml`);
    fs.writeFileSync(filepath, yaml.dump(argocdApp), "utf8");

    await safeGitCommit("Added new redis app",redis_id);
    triggerGitPush();
    
    return {
      success:true,
      message: `Redis app ${redis_id} created and pushed successfully`,
    };
  } catch (error) {
    return {
      success:false,
      message: "Failed to provision Redis app",
    };
  }
};

export const redisDestroyer = async(resource_id:string):Promise<boolean> => {
  try {
    await runCommand(["git", "clone", repoUrlWithPAT], { cwd: repoPath() });
    await runCommand(["git", "checkout", branch], { cwd: repoPath()+"/cloud-infra-ops" });

    const redisPath = path.join(
      repoPath(),
      "cloud-infra-ops",
      "apps",
      "external-charts",
      resource_id
    );
    const argocdFilePath = path.join(
      repoPath(),
      "cloud-infra-ops",
      "argocd",
      "external",
      `${resource_id}.yaml`
    );

   
    if (fs.existsSync(redisPath)) {
      fs.rmSync(redisPath, { recursive: true, force: true });
    }
    if (fs.existsSync(argocdFilePath)) {
      fs.unlinkSync(argocdFilePath);
    }

    await safeGitCommit("Removed redis app", resource_id);
    triggerGitPush();
    
    return true;
  } catch (error) {
    console.error("Failed to destroy Redis app:", error);
    return false;
  }
};

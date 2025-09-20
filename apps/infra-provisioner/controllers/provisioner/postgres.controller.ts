import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { repoUrlWithOutPAT,repoUrlWithPAT, repoPath, branch } from "../../config/config";
import axios from "axios";
import { primary_base_backend } from "../../config/config";
import { runCommand } from "../../git/runCommand";
import { postgresqlSchema, type InfraConfig } from "@cloud/backend-common";
function generateRandomString() {
  return Math.floor(Math.random() * 1000000).toString();
}
export const PostgresProvisioner = async(infraConfig:InfraConfig) => {
  try {
   
    const db_id = generateRandomString() + "-" + infraConfig.projectId;
    await runCommand(["git", "clone", repoUrlWithPAT], { cwd: repoPath() });
    await runCommand(["git", "checkout", branch], { cwd: repoPath()+"/cloud-infra-ops" });

    const baseDbPath = path.join(
      repoPath(),
      "cloud-infra-ops",
      "apps",
      "baseconfig",
      "postgres"
    );
    const newDbPath = path.join(
      repoPath(),
      "cloud-infra-ops",
      "apps",
      "external-charts",
      db_id
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
        postgres: {
          db_id: db_id,
          name: "postgres",
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
            maxReplicas: 2,
            targetCPUUtilizationPercentage: 80,
            targetMemoryUtilizationPercentage: 80,
          },
          service: {
            port: 5432,
            targetPort: 5432,
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
        name: db_id,
        namespace: "argocd",
      },
      spec: {
        project: "default",
        source: {
          repoURL: repoUrlWithOutPAT,
          targetRevision: branch,
          path: `gitops/apps/${db_id}`,
        },
        destination: {
          server: "https://kubernetes.default.svc",
          namespace: "free",
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
    const filepath = path.join(argocdPath, `${db_id}.yaml`);
    fs.writeFileSync(filepath, yaml.dump(argocdApp), "utf8");

   await safeGitCommit(db_id);
    requireGitPush=true;
    return {
      success:true,
      message: `PostgresDB app ${db_id} created and pushed successfully`,
    };
  } catch (error) {
    return {
      success:false,
      message: "Failed to provision DB app",
    };
  }
};

async function waitForPauseToFinish(): Promise<void> {
  return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
          if (!pauseCommit) {
              clearInterval(checkInterval);
              resolve();
          }
      }, 100); 
  });
}

export async function safeGitCommit(db_id: string) {
  await waitForPauseToFinish();
  await runCommand(["git", "add", "-A"], { cwd: repoPath() + "/cloud-infra-ops" });
  await runCommand(
      ["git", "commit", "-m", `Added new postgresDB app ${db_id}`],
      { cwd: repoPath() + "/cloud-infra-ops" }
  );
}




let gitPushInterval: NodeJS.Timeout | null = null;
let requireGitPush = false;
let pauseCommit = false;

export function scheduleGitPush(repoUrlWithPAT: string, branch: string) {
    if (gitPushInterval) {
        clearInterval(gitPushInterval);
    }
    let  gitPushResult:{success:boolean,message:string}={success:false,message:""};

    gitPushInterval = setInterval(async () => {
        if (requireGitPush) {
            pauseCommit = true;

            try {
                console.log("Starting git push...");
                await runCommand(
                    ["git", "push", repoUrlWithPAT, branch],
                    { cwd: repoPath() + "/cloud-infra-ops" }
                );
                console.log("Git push completed successfully.");
                gitPushResult={success:true,message:"Git push completed successfully"}
            } catch (err) {
                console.error("Git push failed:", err);
                gitPushResult={success:false,message:"Git push failed"}
            } finally {
                requireGitPush = false;
                pauseCommit = false;
            }
        }
    }, 60000);
    return gitPushResult;
}

export const argocdWebhook = async (req: Request, res: Response) => {
  const db_id = req.body.application.metadata.name;
  const status = req.body.application.status.sync.status;
  let database;
  if (status == "Synced") {
    console.log(
      ` ${req.body.application.metadata.name} is deployed and healthy`
    );

    const response = await axios.post(`${primary_base_backend}/vectordb`, {
      db_id,
    });
    if (response.data.success) {
      database = response.data.database;
    }
  }

  res.status(200).json({ message: "PostgresDB app deployed and healthy", database });
};



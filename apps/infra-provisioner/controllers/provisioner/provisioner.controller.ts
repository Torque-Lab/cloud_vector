import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { repoUrl, repoPath, branch } from "../../config/config";
import axios from "axios";
import { primary_base_backend } from "../../config/config";
import { runCommand } from "../../git/runCommand";
import { postgresqlSchema } from "@cloud/backend-common";

function genrateID() {
  return Math.floor(Math.random() * 1000000).toString();
}
export const PostgresProvisioner = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const {
      projectId,
      region,
      initialMemory,
      maxMemory,
      initialStorage,
      maxStorage,
      initialVCpu,
      maxVCpu,
      autoScale,
      backFrequency,
    } = postgresqlSchema.parse(req.body);
    
    const db_id = genrateID() + "-" + projectId;
    await runCommand(["git", "clone", repoUrl], { cwd: repoPath() });
    await runCommand(["git", "checkout", branch], { cwd: repoPath() });

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
      return res.status(404).json({ message: "Base DB app not found" });
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
              cpu: initialVCpu,
              memory: initialMemory,
            },
            limits: {
              cpu: maxVCpu,
              memory: maxMemory,
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
          storage: initialStorage,
          backup: {
            enabled: true,
            schedule: "0 0 * * *",
          },
        },
      },
    };
    console.log(yaml.dump(mergedValues));
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
          repoURL: repoUrl,
          targetRevision: branch,
          path: `gitops/apps/${db_id}`,
        },
        destination: {
          server: "https://kubernetes.default.svc",
          namespace: db_id,
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

    await runCommand(["git", "add", "-A"], { cwd: repoPath() });
    await runCommand(["git", "commit", "-m", `Added new DB app ${db_id}`], {
      cwd: repoPath(),
    });
    await runCommand(["git", "push", "origin", branch], { cwd: repoPath() });

    res.status(200).json({
      message: `DB app ${db_id} created and pushed successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to provision DB app", error });
  }
};

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

  res.status(200).json({ message: "DB app deployed and healthy", database });
};

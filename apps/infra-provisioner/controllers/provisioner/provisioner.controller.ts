import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { repoUrl, repoPath, branch } from "../../config/config";
import axios from "axios";
import {primary_base_backend} from "../../config/config";
import { runCommand } from "../../git/runCommand";

export const provisioner = async (req: Request, res: Response) => {
  try {

    const { db_id, database_config } = req.body;
    await runCommand(["git", "clone", repoUrl, ],{cwd:repoPath});
    await runCommand(["git", "checkout", branch], { cwd: repoPath });

    const baseDbPath = path.join(repoPath, "gitops", "apps", "db");
    const newDbPath = path.join(repoPath, "gitops", "apps", db_id);
    const argocdPath = path.join(repoPath, "gitops", "argocd", `${db_id}.yaml`);

    if (!fs.existsSync(baseDbPath)) {
      return res.status(404).json({ message: "Base DB app not found" });
    }
if(!fs.existsSync(newDbPath)){
    fs.mkdirSync(newDbPath, { recursive: true });
    fs.cpSync(path.join(baseDbPath, "templates"), path.join(newDbPath, "templates"), { recursive: true });

}
  
    const valuesFile = path.join(baseDbPath, "values.yaml");
    const newValuesFile = path.join(newDbPath, "values.yaml");

    let valuesYaml: any = {};
    if (fs.existsSync(valuesFile)) {
      const fileContent = fs.readFileSync(valuesFile, "utf8");
      valuesYaml = yaml.load(fileContent) || {};
    }

    const mergedValues = { ...valuesYaml, ...database_config };
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

    fs.writeFileSync(argocdPath, yaml.dump(argocdApp), "utf8");

  
    await runCommand(["git", "add", "-A"], { cwd: repoPath });
    await runCommand(["git", "commit", "-m", `Add new DB app ${db_id}`], { cwd: repoPath });
    await runCommand(["git", "push", "origin", branch], { cwd: repoPath });

    res.status(200).json({
      message: `DB app ${db_id} created and pushed successfully`,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to provision DB app", error });
  }
};
export const argocdWebhook =async (req: Request, res: Response) => {
    const db_id=req.body.application.metadata.name;
    const status=req.body.application.status.sync.status;
    let database;
    if (status=="Synced") {

      console.log(` ${req.body.application.metadata.name} is deployed and healthy`);
      
      const response=await axios.post(`${primary_base_backend}/vectordb`, { db_id});
      if(response.data.success){
        database=response.data.database;
      }

    }
    
    res.status(200).json({ message: "DB app deployed and healthy",database });
  };
import { acquireGitPushLock, releaseGitPushLock } from "@cloud/backend-common";
import { branch, repoPath, repoUrlWithPAT } from "../config/config";
import { runCommand } from "./runCommand";

let pauseCommit = false;
let pushInProgress = false;
let pushScheduled: NodeJS.Timeout | null = null;


export async function waitForPauseToCommit(): Promise<void> {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            if (!pauseCommit) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 10000); 
    });
  }
  export async function waitForPauseGitPush(): Promise<void> {
    return new Promise((resolve) => {
        const checkInterval = setInterval(async () => {
            if (await acquireGitPushLock()) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 10000); 
    });
  }
  export async function triggerGitPush() {
    if (pushScheduled) {
      clearTimeout(pushScheduled);
    }
    pushScheduled = setTimeout(async () => {
      if (pushInProgress) {
        triggerGitPush();
        return;
      }
  
      pushInProgress = true;
      pauseCommit = true;
      try {
        console.log("Starting git push...");
        await safeGitPush();
        console.log("Git push completed successfully.");
      } catch (err) {
        console.error("Git push failed:", err);
      } finally {
        pushInProgress = false;
        pushScheduled = null;
        pauseCommit = false;
      }
    }, 5000);
  }
  export async function safeGitCommit(commit_message: string,resources_id: string) {
    await waitForPauseToCommit();
    await runCommand(["git", "add", "-A"], { cwd: repoPath() + "/cloud-infra-ops" });
    await runCommand(
        ["git", "commit", "-m", commit_message+" "+resources_id],
        { cwd: repoPath() + "/cloud-infra-ops" }
    );
  }
  export async function safeGitPush() {
    await waitForPauseGitPush();
    await runCommand(
        ["git", "push", repoUrlWithPAT, branch],
        { cwd: repoPath() + "/cloud-infra-ops" }
    );
    await releaseGitPushLock();
  }
  
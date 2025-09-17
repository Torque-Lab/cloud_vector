export interface RunCommandOptions {
  cwd?: string;
  env?: Record<string, string>;
  timeoutMs?: number;
}
export interface RunCommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  success: boolean;
}
export const runCommand = async (
  command: string[],
  options: RunCommandOptions
): Promise<RunCommandResult> => {
  const { cwd , env = process.env, timeoutMs = 100000 } = options;
  console.log(cwd, timeoutMs, command);

  const proc = Bun.spawn({
    cmd: command,
    cwd: cwd,
    stdout: "pipe",
    stderr: "pipe",
  });

  const timmeout = new Promise<RunCommandResult>((_, reject) => {
    const timeoutId = setTimeout(() => {
      proc.kill();
      reject({
        stdout: "",
        stderr: `Command timeout after ${timeoutMs}ms`,
        exitCode: -1,
        success: false,
      });
    }, timeoutMs);
  });

  const execution = (async () => {
    const stdout = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();
    const exitCode = proc.exitCode;
    return { stdout, stderr, exitCode: exitCode!, success: exitCode === 0 };
  })();

  return Promise.race([execution, timmeout]);
};

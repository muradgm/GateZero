import { spawn } from "node:child_process";
import process from "node:process";

const stages = [
  { label: "Repository checks", command: "check:repository" },
  { label: "Lint", command: "lint" },
  { label: "Formatting", command: "format:check" },
  { label: "Type checking", command: "typecheck" },
  { label: "Tests", command: "test:ci" }
] as const;

const startedAt = Date.now();
const supportsColor = Boolean(process.stdout.isTTY && !process.env.NO_COLOR);

function color(code: number, value: string): string {
  return supportsColor ? `\u001B[${code}m${value}\u001B[0m` : value;
}

function progressBar(completed: number, total: number): string {
  const width = 24;
  const filled = Math.round((completed / total) * width);
  const percentage = Math.round((completed / total) * 100);
  return `[${"█".repeat(filled)}${"░".repeat(width - filled)}] ${percentage.toString().padStart(3)}%`;
}

function formatDuration(milliseconds: number): string {
  return `${(milliseconds / 1000).toFixed(1)}s`;
}

function runPnpmScript(command: string): Promise<{ output: string; duration: number }> {
  const stageStartedAt = Date.now();

  return new Promise((resolve, reject) => {
    const child = spawn("pnpm", [command], {
      cwd: process.cwd(),
      env: process.env,
      shell: process.platform === "win32"
    });

    let output = "";
    child.stdout.on("data", (chunk: Buffer | string) => {
      output += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer | string) => {
      output += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      const result = { output, duration: Date.now() - stageStartedAt };
      if (code === 0) {
        resolve(result);
        return;
      }

      reject(Object.assign(new Error(`pnpm ${command} failed with exit code ${code ?? "unknown"}`), result));
    });
  });
}

console.log(color(36, "TraderFrame verification"));
console.log(progressBar(0, stages.length));
console.log();

for (const [index, stage] of stages.entries()) {
  process.stdout.write(`${String(index + 1).padStart(2)}/${stages.length}  ${stage.label.padEnd(22)} `);

  try {
    const result = await runPnpmScript(stage.command);
    console.log(`${color(32, "PASS")}  ${formatDuration(result.duration)}`);
    console.log(progressBar(index + 1, stages.length));
  } catch (error) {
    const failure = error as Error & { output?: string; duration?: number };
    console.log(`${color(31, "FAIL")}  ${formatDuration(failure.duration ?? 0)}`);
    console.log();
    console.error(color(31, failure.message));
    if (failure.output?.trim()) {
      console.error("\n--- Full failing output ---\n");
      console.error(failure.output.trimEnd());
    }
    process.exitCode = 1;
    break;
  }
}

if (!process.exitCode) {
  console.log();
  console.log(`${color(32, "Overall status: PASS")}  ${formatDuration(Date.now() - startedAt)}`);
}

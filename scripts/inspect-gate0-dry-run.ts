import { runInspectGate0DryRunCli } from "./inspect-gate0-dry-run-output.js";

const result = runInspectGate0DryRunCli(process.argv.slice(2));

if (result.stdout.length > 0) {
  console.log(result.stdout);
}

if (result.stderr.length > 0) {
  console.error(result.stderr);
}

process.exitCode = result.exitCode;

import { runInspectLocalCasesCli } from "./inspect-local-cases-output.js";

const result = runInspectLocalCasesCli(process.argv.slice(2));
if (result.stdout) console.log(result.stdout);
if (result.stderr) console.error(result.stderr);
process.exitCode = result.exitCode;

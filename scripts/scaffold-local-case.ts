import { runScaffoldLocalCaseCli } from "./scaffold-local-case-output.js";

const result = await runScaffoldLocalCaseCli(process.argv.slice(2));
if (result.stdout) console.log(result.stdout);
if (result.stderr) console.error(result.stderr);
process.exitCode = result.exitCode;

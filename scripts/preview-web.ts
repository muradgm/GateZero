import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";

const host = "127.0.0.1";
const port = readPort();
const webRoot = path.join(process.cwd(), "apps", "web");

const contentTypes: Readonly<Record<string, string>> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

const server = createServer(async (request, response) => {
  const requestPath = new URL(request.url ?? "/", `http://${host}:${port}`).pathname;
  const relativeRequestPath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
  const safePath = path
    .normalize(decodeURIComponent(relativeRequestPath))
    .replace(/^(\.\.(\/|\\|$))+/, "");
  const requestedFile = path.join(webRoot, safePath);
  const resolvedFile = path.resolve(requestedFile);

  if (!resolvedFile.startsWith(path.resolve(webRoot))) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const fileStat = await stat(resolvedFile);

    if (!fileStat.isFile()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": contentTypes[path.extname(resolvedFile)] ?? "text/plain; charset=utf-8"
    });
    createReadStream(resolvedFile).pipe(response);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

server.listen(port, host, () => {
  console.log(`GateZero command center preview: http://${host}:${port}/`);
});

if (process.argv[1] && import.meta.url !== pathToFileURL(process.argv[1]).href) {
  server.close();
}

function readPort(): number {
  const portArgIndex = process.argv.indexOf("--port");
  const portArg = portArgIndex === -1 ? undefined : process.argv[portArgIndex + 1];
  const parsedPort = Number(portArg ?? process.env.GATEZERO_WEB_PORT ?? 4173);

  if (!Number.isInteger(parsedPort) || parsedPort < 1024 || parsedPort > 65535) {
    throw new Error("Invalid preview port. Use --port with a value from 1024 to 65535.");
  }

  return parsedPort;
}

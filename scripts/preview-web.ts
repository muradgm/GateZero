import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const previewHost = "127.0.0.1";
export const defaultPreviewPort = 4173;
const webRoot = path.join(process.cwd(), "apps", "web");

const contentTypes: Readonly<Record<string, string>> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

export function createPreviewServer(rootDir = webRoot): Server {
  return createServer((request, response) => {
    void servePreviewRequest(request, response, rootDir);
  });
}

export async function servePreviewRequest(
  request: IncomingMessage,
  response: ServerResponse,
  rootDir = webRoot
): Promise<void> {
  const requestPath = new URL(request.url ?? "/", `http://${previewHost}:${defaultPreviewPort}`)
    .pathname;
  const resolvedFile = resolvePreviewFile(rootDir, requestPath);

  if (!resolvedFile) {
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
}

export function resolvePreviewFile(rootDir: string, requestPath: string): string | undefined {
  const relativeRequestPath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
  const decodedRequestPath = decodeURIComponent(relativeRequestPath);
  const safePath = path.normalize(decodedRequestPath);

  if (isTraversalPath(safePath)) {
    return undefined;
  }

  const resolvedRoot = path.resolve(rootDir);
  const requestedFile = path.join(resolvedRoot, safePath);
  const resolvedFile = path.resolve(requestedFile);

  if (!isInsideRoot(resolvedRoot, resolvedFile)) {
    return undefined;
  }

  return resolvedFile;
}

export function readPort(args = process.argv, env = process.env): number {
  const portArgIndex = args.indexOf("--port");
  const portArg = portArgIndex === -1 ? undefined : args[portArgIndex + 1];
  const parsedPort = Number(portArg ?? env.GATEZERO_WEB_PORT ?? defaultPreviewPort);

  if (!Number.isInteger(parsedPort) || parsedPort < 1024 || parsedPort > 65535) {
    throw new Error("Invalid preview port. Use --port with a value from 1024 to 65535.");
  }

  return parsedPort;
}

function isInsideRoot(rootDir: string, filePath: string): boolean {
  const relativePath = path.relative(rootDir, filePath);

  return relativePath === "" || (!relativePath.startsWith("..") && !path.isAbsolute(relativePath));
}

function isTraversalPath(filePath: string): boolean {
  return filePath === ".." || filePath.startsWith(`..${path.sep}`) || path.isAbsolute(filePath);
}

function main(): void {
  const port = readPort();
  const server = createPreviewServer();

  server.listen(port, previewHost, () => {
    console.log(`GateZero command center preview: http://${previewHost}:${port}/`);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

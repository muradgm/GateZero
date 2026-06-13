import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export interface ForbiddenPattern {
  readonly label: string;
  readonly pattern: RegExp;
}

export interface ForbiddenPatternFinding {
  readonly filePath: string;
  readonly label: string;
  readonly match: string;
}

export interface ScanOptions {
  readonly rootDir: string;
  readonly allowlistedPathPatterns?: readonly RegExp[];
}

export const FORBIDDEN_PATTERNS: readonly ForbiddenPattern[] = [
  { label: "order placement function", pattern: /\bplaceOrder\b/i },
  { label: "order submission function", pattern: /\bsubmitOrder\b/i },
  { label: "broker scope", pattern: /\bbroker\b/i },
  { label: "broker vendor reference", pattern: /\balpaca\b/i },
  { label: "broker vendor reference", pattern: /\binteractive brokers\b/i },
  { label: "live trading phrase", pattern: /\blive trade\b/i },
  { label: "simulated order phrase", pattern: /\bpaper order\b/i },
  { label: "buy recommendation phrase", pattern: /\bbuy signal\b/i },
  { label: "sell recommendation phrase", pattern: /\bsell signal\b/i },
  { label: "autonomy escalation phrase", pattern: /\bautonomous execution\b/i },
  { label: "blocked readiness state", pattern: /\blive_candidate\b/i },
  { label: "blocked readiness state", pattern: /\bsupervised_live_candidate\b/i },
  { label: "blocked readiness state", pattern: /\blimited_live_automation\b/i }
];

const DEFAULT_ALLOWLISTED_PATH_PATTERNS: readonly RegExp[] = [
  /^docs\//,
  /^ops\/agents\//,
  /^ops\/assignments\//,
  /^ops\/benchmarks\//,
  /^ops\/contracts\//,
  /^ops\/core\//,
  /^ops\/governance\//,
  /^ops\/learning\//,
  /^ops\/references\//,
  /^ops\/runtime\//,
  /^ops\/templates\//,
  /^ops\/truth\//,
  /^ops\/validation\//,
  /^packages\/.*\/tests\//,
  /^packages\/validation\/src\//,
  /^scripts\/validate-gate0\.ts$/,
  /(^|\/)README\.md$/
];

const SCANNED_EXTENSIONS = new Set([".js", ".json", ".md", ".ts", ".yaml", ".yml"]);

export function normalizeRelativePath(filePath: string): string {
  return filePath.replaceAll(path.sep, "/");
}

export function isAllowlistedPath(
  relativePath: string,
  allowlistedPathPatterns: readonly RegExp[] = DEFAULT_ALLOWLISTED_PATH_PATTERNS
): boolean {
  const normalizedPath = normalizeRelativePath(relativePath);
  return allowlistedPathPatterns.some((pattern) => pattern.test(normalizedPath));
}

export function scanTextForForbiddenPatterns(
  content: string,
  filePath: string
): readonly ForbiddenPatternFinding[] {
  return FORBIDDEN_PATTERNS.flatMap((forbiddenPattern) => {
    const match = content.match(forbiddenPattern.pattern);

    if (!match?.[0]) {
      return [];
    }

    return [
      {
        filePath,
        label: forbiddenPattern.label,
        match: match[0]
      }
    ];
  });
}

export async function scanRepositoryForForbiddenPatterns(
  options: ScanOptions
): Promise<readonly ForbiddenPatternFinding[]> {
  const allowlistedPathPatterns =
    options.allowlistedPathPatterns ?? DEFAULT_ALLOWLISTED_PATH_PATTERNS;
  const files = await listScannableFiles(options.rootDir);
  const findings: ForbiddenPatternFinding[] = [];

  for (const absoluteFilePath of files) {
    const relativePath = normalizeRelativePath(path.relative(options.rootDir, absoluteFilePath));

    if (isAllowlistedPath(relativePath, allowlistedPathPatterns)) {
      continue;
    }

    const content = await readFile(absoluteFilePath, "utf8");
    findings.push(...scanTextForForbiddenPatterns(content, relativePath));
  }

  return findings;
}

async function listScannableFiles(rootDir: string): Promise<readonly string[]> {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") {
      continue;
    }

    const absolutePath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listScannableFiles(absolutePath)));
      continue;
    }

    if (entry.isFile() && SCANNED_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(absolutePath);
    }
  }

  return files;
}

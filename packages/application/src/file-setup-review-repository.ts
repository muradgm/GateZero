import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { SetupReviewSchema, type SetupReview } from "@traderframe/contracts/setup-review";
import type { SetupReviewRepository } from "./setup-review-ports.js";

export class FileSetupReviewRepository implements SetupReviewRepository {
  constructor(private readonly rootDir: string) {}

  async save(review: SetupReview): Promise<void> {
    const parsed = SetupReviewSchema.parse(review);
    const reviewDir = this.reviewDir(parsed.setupReviewId);
    await mkdir(reviewDir, { recursive: true });

    const payload = `${JSON.stringify(parsed, null, 2)}\n`;
    const hash = createHash("sha256").update(payload).digest("hex").slice(0, 16);
    const timestamp = parsed.updatedAt.replaceAll(":", "-");
    const revisionPath = path.join(reviewDir, `${timestamp}-${hash}.json`);

    await writeFile(revisionPath, payload, { encoding: "utf8", flag: "wx" });
  }

  async findById(setupReviewId: string): Promise<SetupReview | undefined> {
    const revisions = await this.readRevisionNames(setupReviewId);
    const latest = revisions.at(-1);
    if (!latest) return undefined;

    const payload = await readFile(path.join(this.reviewDir(setupReviewId), latest), "utf8");
    return SetupReviewSchema.parse(JSON.parse(payload));
  }

  async list(): Promise<readonly SetupReview[]> {
    let ids: string[];
    try {
      ids = await readdir(this.rootDir);
    } catch {
      return [];
    }

    const reviews = await Promise.all(ids.map((id) => this.findById(id)));
    return reviews.filter((review): review is SetupReview => review !== undefined);
  }

  private reviewDir(setupReviewId: string): string {
    return path.join(this.rootDir, encodeURIComponent(setupReviewId));
  }

  private async readRevisionNames(setupReviewId: string): Promise<string[]> {
    try {
      return (await readdir(this.reviewDir(setupReviewId)))
        .filter((entry) => entry.endsWith(".json"))
        .sort();
    } catch {
      return [];
    }
  }
}

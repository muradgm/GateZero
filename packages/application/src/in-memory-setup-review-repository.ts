import type { SetupReview } from "../../contracts/src/setup-review.js";
import type { SetupReviewRepository } from "./setup-review-ports.js";

export class InMemorySetupReviewRepository implements SetupReviewRepository {
  readonly #reviews = new Map<string, SetupReview>();

  async save(review: SetupReview): Promise<void> {
    this.#reviews.set(review.setupReviewId, structuredClone(review));
  }

  async findById(setupReviewId: string): Promise<SetupReview | undefined> {
    const review = this.#reviews.get(setupReviewId);
    return review ? structuredClone(review) : undefined;
  }

  async list(): Promise<readonly SetupReview[]> {
    return [...this.#reviews.values()].map((review) => structuredClone(review));
  }
}

import {
  StrategyReviewBundleSchema,
  type StrategyReviewBundle
} from "../../contracts/src/index.js";
import { assertCanonicalStrategyDecisionTraceHashes } from "./trace-hashing.js";
import { type DeepReadonly } from "./strategy-decision-trace.js";

export function createImmutableStrategyReviewBundle(
  bundle: StrategyReviewBundle
): DeepReadonly<StrategyReviewBundle> {
  const parsedBundle = StrategyReviewBundleSchema.parse(bundle);
  assertCanonicalStrategyDecisionTraceHashes(parsedBundle.trace);

  return deepFreeze(parsedBundle);
}

function deepFreeze<T>(value: T): DeepReadonly<T> {
  if (typeof value !== "object" || value === null) {
    return value as DeepReadonly<T>;
  }

  for (const nestedValue of Object.values(value)) {
    deepFreeze(nestedValue);
  }

  return Object.freeze(value) as DeepReadonly<T>;
}

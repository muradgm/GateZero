import {
  StrategyDecisionTraceSchema,
  type StrategyDecisionTrace
} from "../../contracts/src/index.js";

export type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer Item)[]
    ? readonly DeepReadonly<Item>[]
    : T extends object
      ? { readonly [Key in keyof T]: DeepReadonly<T[Key]> }
      : T;

export function createImmutableStrategyDecisionTrace(
  trace: StrategyDecisionTrace
): DeepReadonly<StrategyDecisionTrace> {
  const parsedTrace = StrategyDecisionTraceSchema.parse(trace);
  return deepFreeze(parsedTrace);
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

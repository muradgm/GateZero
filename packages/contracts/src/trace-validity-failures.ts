import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";
import { TraceValidityAreaSchema } from "./validated-decision-trace.js";

export const TraceValidityFailureCodeSchema = z.enum([
  "DATA_GAP_UNCLASSIFIED",
  "DUPLICATE_TIMESTAMP",
  "INVALID_OHLC",
  "INCOMPLETE_CANDLE",
  "INSTRUMENT_MISMATCH",
  "TIMEFRAME_MISMATCH",
  "TIMEZONE_MISMATCH",
  "FUTURE_EVIDENCE",
  "UNCLOSED_HIGHER_TIMEFRAME_INPUT",
  "LOOKAHEAD_FEATURE",
  "STRATEGY_VERSION_MISSING",
  "STRATEGY_PARAMETER_DRIFT",
  "EVIDENCE_SOURCE_MISSING",
  "EVIDENCE_HASH_MISMATCH",
  "CALCULATION_MISMATCH",
  "RISK_CONVERSION_INVALID",
  "POSITION_SIZE_INVALID",
  "SIMULATION_POLICY_MISSING",
  "AMBIGUOUS_SAME_BAR_OUTCOME",
  "UNREALISTIC_FILL_ASSUMPTION",
  "REPRODUCTION_HASH_MISMATCH",
  "PROVENANCE_CHAIN_BROKEN",
  "VERSION_REFERENCE_MISSING"
]);

export const TraceValidityFailureSeveritySchema = z.enum(["WARNING", "ERROR", "BLOCKER"]);

export const TraceValidityFailureSchema = z
  .object({
    failureId: NonEmptyStringSchema,
    code: TraceValidityFailureCodeSchema,
    area: TraceValidityAreaSchema,
    severity: TraceValidityFailureSeveritySchema,
    message: NonEmptyStringSchema,
    evidenceIds: z.array(NonEmptyStringSchema),
    detectedAt: z.string().datetime(),
    ruleVersion: NonEmptyStringSchema,
    remediation: NonEmptyStringSchema.optional()
  })
  .strict();

export type TraceValidityFailureCode = z.infer<typeof TraceValidityFailureCodeSchema>;
export type TraceValidityFailure = z.infer<typeof TraceValidityFailureSchema>;

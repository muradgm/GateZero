import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

const CurrencyCodeSchema = z
  .string()
  .regex(/^[A-Z]{3}$/, "currency must use a three-letter code");
const Sha256HexSchema = z.string().regex(/^[a-f0-9]{64}$/);
const CanonicalSha256Schema = z.string().regex(/^sha256:[a-f0-9]{64}$/);

export const EurUsdPipValuePolicySchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("QUOTE_CURRENCY") }).strict(),
  z.object({ mode: z.literal("BASE_CURRENCY_AT_ENTRY") }).strict(),
  z
    .object({
      mode: z.literal("EXPLICIT_QUOTE_TO_ACCOUNT_RATE"),
      quoteToAccountRate: z.number().finite().positive()
    })
    .strict()
]);

export const EurUsdCommissionModelSchema = z.discriminatedUnion("mode", [
  z
    .object({
      mode: z.literal("FIXED_ACCOUNT_CURRENCY"),
      amount: z.number().finite().nonnegative()
    })
    .strict(),
  z
    .object({
      mode: z.literal("PER_MILLION_UNITS_ROUND_TURN"),
      amountPerMillion: z.number().finite().nonnegative()
    })
    .strict()
]);

export const EurUsdRiskPolicySchema = z
  .object({
    schemaVersion: z.literal(1),
    policyId: NonEmptyStringSchema,
    policyVersion: NonEmptyStringSchema,
    accountCurrency: CurrencyCodeSchema,
    accountEquity: z.number().finite().positive(),
    maximumRiskPct: z.number().finite().positive().max(100),
    maximumRiskAmount: z.number().finite().positive().optional(),
    pipSize: z.literal(0.0001),
    pipValuePolicy: EurUsdPipValuePolicySchema,
    spreadPips: z.number().finite().nonnegative(),
    entrySlippagePips: z.number().finite().nonnegative(),
    stopSlippagePips: z.number().finite().nonnegative(),
    commissionModel: EurUsdCommissionModelSchema,
    unitIncrement: z.number().int().positive(),
    minimumPositionUnits: z.number().int().nonnegative(),
    maximumPositionUnits: z.number().int().positive(),
    assumptions: z.array(NonEmptyStringSchema).min(1)
  })
  .strict()
  .superRefine((policy, context) => {
    if (policy.minimumPositionUnits > policy.maximumPositionUnits) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "minimum position units cannot exceed maximum position units",
        path: ["minimumPositionUnits"]
      });
    }

    if (
      policy.minimumPositionUnits % policy.unitIncrement !== 0 ||
      policy.maximumPositionUnits % policy.unitIncrement !== 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "position limits must align to the configured unit increment",
        path: ["unitIncrement"]
      });
    }

    if (
      policy.pipValuePolicy.mode === "QUOTE_CURRENCY" &&
      policy.accountCurrency !== "USD"
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "EURUSD quote-currency pip valuation requires a USD account",
        path: ["accountCurrency"]
      });
    }

    if (
      policy.pipValuePolicy.mode === "BASE_CURRENCY_AT_ENTRY" &&
      policy.accountCurrency !== "EUR"
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "EURUSD base-currency pip valuation requires a EUR account",
        path: ["accountCurrency"]
      });
    }
  });

export const HistoricalRiskSourceLineageSchema = z
  .object({
    historicalRunId: NonEmptyStringSchema,
    datasetId: NonEmptyStringSchema,
    rawDataHash: Sha256HexSchema,
    normalized15mHash: Sha256HexSchema,
    aggregated1HHash: Sha256HexSchema,
    aggregated4HHash: Sha256HexSchema,
    ingestionConfigurationHash: Sha256HexSchema
  })
  .strict();

export const EurUsdRiskCalculationSchema = z
  .object({
    schemaVersion: z.literal(1),
    riskCalculationId: z.string().regex(/^eurusd-risk-[a-f0-9]{24}$/),
    riskEngineVersion: NonEmptyStringSchema,
    policyId: NonEmptyStringSchema,
    policyVersion: NonEmptyStringSchema,
    policyHash: CanonicalSha256Schema,
    sourceLineage: HistoricalRiskSourceLineageSchema,
    candidateId: NonEmptyStringSchema,
    assessmentId: NonEmptyStringSchema,
    canonicalAssessmentHash: CanonicalSha256Schema,
    decisionTimestamp: z.string().datetime(),
    direction: z.enum(["LONG", "SHORT"]),
    accountCurrency: CurrencyCodeSchema,
    accountEquity: z.number().finite().positive(),
    maximumRiskPct: z.number().finite().positive().max(100),
    riskBudgetAmount: z.number().finite().positive(),
    entryPrice: z.number().finite().positive(),
    invalidationPrice: z.number().finite().positive(),
    pipSize: z.literal(0.0001),
    pipValuePerUnit: z.number().finite().positive(),
    stopDistancePips: z.number().finite().positive(),
    spreadPips: z.number().finite().nonnegative(),
    entrySlippagePips: z.number().finite().nonnegative(),
    stopSlippagePips: z.number().finite().nonnegative(),
    worstCaseExecutionPrice: z.number().finite().positive(),
    worstCaseStopPrice: z.number().finite().positive(),
    positionSizeUnits: z.number().int().nonnegative(),
    plannedGrossLoss: z.number().finite().nonnegative(),
    estimatedSpreadCost: z.number().finite().nonnegative(),
    estimatedSlippageCost: z.number().finite().nonnegative(),
    estimatedCommissionCost: z.number().finite().nonnegative(),
    estimatedCosts: z.number().finite().nonnegative(),
    totalWorstCasePlannedLoss: z.number().finite().nonnegative(),
    riskUtilizationPct: z.number().finite().nonnegative(),
    riskGate: z.enum(["WITHIN_LIMIT", "BLOCKED"]),
    blockers: z.array(NonEmptyStringSchema),
    assumptions: z.array(NonEmptyStringSchema).min(1),
    calculationHash: CanonicalSha256Schema,
    localSimulationOnly: z.literal(true),
    executionPath: z.literal(false),
    automatedAction: z.literal(false)
  })
  .strict()
  .superRefine((calculation, context) => {
    const expectedCosts =
      calculation.estimatedSpreadCost +
      calculation.estimatedSlippageCost +
      calculation.estimatedCommissionCost;
    if (Math.abs(expectedCosts - calculation.estimatedCosts) > 0.000001) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "estimated costs must equal spread, slippage, and commission costs",
        path: ["estimatedCosts"]
      });
    }

    const expectedTotal = calculation.plannedGrossLoss + calculation.estimatedCosts;
    if (Math.abs(expectedTotal - calculation.totalWorstCasePlannedLoss) > 0.000001) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "worst-case planned loss must equal gross loss plus estimated costs",
        path: ["totalWorstCasePlannedLoss"]
      });
    }

    if (calculation.riskGate === "WITHIN_LIMIT") {
      if (calculation.blockers.length > 0 || calculation.positionSizeUnits <= 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "within-limit risk calculations require a positive position without blockers",
          path: ["riskGate"]
        });
      }
      if (
        calculation.totalWorstCasePlannedLoss >
        calculation.riskBudgetAmount + 0.000001
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "within-limit planned loss cannot exceed the risk budget",
          path: ["totalWorstCasePlannedLoss"]
        });
      }
    }

    if (calculation.riskGate === "BLOCKED") {
      if (calculation.blockers.length === 0 || calculation.positionSizeUnits !== 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "blocked risk calculations require blockers and a zero position size",
          path: ["riskGate"]
        });
      }
    }
  });

export type EurUsdPipValuePolicy = z.infer<typeof EurUsdPipValuePolicySchema>;
export type EurUsdCommissionModel = z.infer<typeof EurUsdCommissionModelSchema>;
export type EurUsdRiskPolicy = z.infer<typeof EurUsdRiskPolicySchema>;
export type HistoricalRiskSourceLineage = z.infer<typeof HistoricalRiskSourceLineageSchema>;
export type EurUsdRiskCalculation = z.infer<typeof EurUsdRiskCalculationSchema>;

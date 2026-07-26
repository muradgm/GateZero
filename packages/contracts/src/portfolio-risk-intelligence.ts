import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

const CurrencyCodeSchema = z.string().regex(/^[A-Z]{3}$/, "currency must use a three-letter code");

export const PortfolioRiskPositionSchema = z
  .object({
    positionId: NonEmptyStringSchema,
    instrument: NonEmptyStringSchema,
    baseCurrency: CurrencyCodeSchema,
    quoteCurrency: CurrencyCodeSchema,
    side: z.enum(["LONG", "SHORT"]),
    notionalAmount: z.number().positive(),
    plannedRiskAmount: z.number().nonnegative(),
    correlationGroup: NonEmptyStringSchema,
    session: z.enum(["ASIA", "LONDON", "NEW_YORK", "OVERLAP", "CONTINUOUS"]),
    eventIds: z.array(NonEmptyStringSchema),
    evidenceVersionIds: z.array(NonEmptyStringSchema).min(1)
  })
  .strict()
  .superRefine((position, context) => {
    if (position.baseCurrency === position.quoteCurrency) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "position currencies must be different",
        path: ["quoteCurrency"]
      });
    }
  });

export const PortfolioRiskPolicySchema = z
  .object({
    policyId: NonEmptyStringSchema,
    policyVersion: NonEmptyStringSchema,
    accountCurrency: CurrencyCodeSchema,
    accountEquity: z.number().positive(),
    equityHighWaterMark: z.number().positive(),
    maximumInstrumentExposurePct: z.number().positive().max(100),
    maximumCurrencyExposurePct: z.number().positive().max(100),
    maximumCorrelationExposurePct: z.number().positive().max(100),
    maximumEventRiskPct: z.number().positive().max(100),
    maximumSessionRiskAmount: z.number().positive(),
    maximumDailyRiskAmount: z.number().positive(),
    maximumDrawdownPct: z.number().positive().max(100),
    warningUtilizationPct: z.number().positive().max(99)
  })
  .strict()
  .superRefine((policy, context) => {
    if (policy.equityHighWaterMark < policy.accountEquity) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "equity high-water mark cannot be below current equity",
        path: ["equityHighWaterMark"]
      });
    }
  });

export const PortfolioRiskContextSchema = z
  .object({
    schemaVersion: z.literal(1),
    contextId: NonEmptyStringSchema,
    policy: PortfolioRiskPolicySchema,
    existingPositions: z.array(PortfolioRiskPositionSchema),
    candidatePosition: PortfolioRiskPositionSchema,
    realizedSessionLossAmount: z.number().nonnegative(),
    realizedDailyLossAmount: z.number().nonnegative(),
    evidenceVersionIds: z.array(NonEmptyStringSchema).min(1),
    evaluatedAt: z.string().datetime(),
    localSimulationOnly: z.literal(true),
    executionPath: z.literal(false),
    automatedAction: z.literal(false)
  })
  .strict();

export const PortfolioRiskFindingSchema = z
  .object({
    code: z.enum([
      "INSTRUMENT_EXPOSURE",
      "CURRENCY_EXPOSURE",
      "CORRELATION_EXPOSURE",
      "EVENT_EXPOSURE",
      "SESSION_RISK_BUDGET",
      "DAILY_RISK_BUDGET",
      "DRAWDOWN_LIMIT"
    ]),
    severity: z.enum(["REVIEW", "BLOCKING"]),
    subject: NonEmptyStringSchema,
    measuredValue: z.number().nonnegative(),
    limitValue: z.number().positive(),
    detail: NonEmptyStringSchema,
    evidenceVersionIds: z.array(NonEmptyStringSchema).min(1)
  })
  .strict();

const ExposureMetricSchema = z
  .object({
    subject: NonEmptyStringSchema,
    currentPct: z.number().nonnegative(),
    afterCandidatePct: z.number().nonnegative(),
    limitPct: z.number().positive()
  })
  .strict();

const RiskBudgetMetricSchema = z
  .object({
    currentAmount: z.number().nonnegative(),
    afterCandidateAmount: z.number().nonnegative(),
    limitAmount: z.number().positive(),
    utilizationPct: z.number().nonnegative()
  })
  .strict();

export const PortfolioRiskAssessmentSchema = z
  .object({
    schemaVersion: z.literal(1),
    assessmentId: NonEmptyStringSchema,
    contextId: NonEmptyStringSchema,
    contextHash: NonEmptyStringSchema,
    policyId: NonEmptyStringSchema,
    policyVersion: NonEmptyStringSchema,
    candidatePositionId: NonEmptyStringSchema,
    status: z.enum(["CLEAR", "REVIEW_REQUIRED", "BLOCKED"]),
    instrumentExposures: z.array(ExposureMetricSchema),
    currencyExposures: z.array(ExposureMetricSchema),
    correlationExposures: z.array(ExposureMetricSchema),
    eventExposures: z.array(ExposureMetricSchema),
    sessionRiskBudget: RiskBudgetMetricSchema,
    dailyRiskBudget: RiskBudgetMetricSchema,
    drawdownPct: z.number().nonnegative(),
    maximumDrawdownPct: z.number().positive(),
    findings: z.array(PortfolioRiskFindingSchema),
    blockers: z.array(NonEmptyStringSchema),
    reviewReasons: z.array(NonEmptyStringSchema),
    limitations: z.array(NonEmptyStringSchema).min(1),
    evaluatedAt: z.string().datetime(),
    assessmentHash: NonEmptyStringSchema,
    riskApproval: z.literal(false),
    operatorReviewRequired: z.literal(true),
    localSimulationOnly: z.literal(true),
    executionPath: z.literal(false),
    automatedAction: z.literal(false)
  })
  .strict()
  .superRefine((assessment, context) => {
    const blockingFindings = assessment.findings.filter(
      (finding) => finding.severity === "BLOCKING"
    );
    if ((assessment.status === "BLOCKED") !== blockingFindings.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked status must match blocking findings",
        path: ["status"]
      });
    }
    if (assessment.blockers.length !== blockingFindings.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blockers must preserve every blocking finding",
        path: ["blockers"]
      });
    }
    if (assessment.status === "CLEAR" && assessment.findings.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "clear assessments cannot retain risk findings",
        path: ["findings"]
      });
    }
  });

export const PortfolioRiskCheckpointSchema = z
  .object({
    schemaVersion: z.literal(1),
    checkpointId: NonEmptyStringSchema,
    reviewAssessmentHash: NonEmptyStringSchema,
    blockedAssessmentHash: NonEmptyStringSchema,
    status: z.enum(["PASS", "FAIL"]),
    deterministic: z.boolean(),
    portfolioBlockersExercised: z.boolean(),
    operatorReviewRequired: z.literal(true),
    reasons: z.array(NonEmptyStringSchema).min(1),
    checkedAt: z.string().datetime(),
    checkpointHash: NonEmptyStringSchema,
    riskApproval: z.literal(false),
    executionPath: z.literal(false),
    automatedAction: z.literal(false)
  })
  .strict();

export type PortfolioRiskPosition = z.infer<typeof PortfolioRiskPositionSchema>;
export type PortfolioRiskPolicy = z.infer<typeof PortfolioRiskPolicySchema>;
export type PortfolioRiskContext = z.infer<typeof PortfolioRiskContextSchema>;
export type PortfolioRiskFinding = z.infer<typeof PortfolioRiskFindingSchema>;
export type PortfolioRiskAssessment = z.infer<typeof PortfolioRiskAssessmentSchema>;
export type PortfolioRiskCheckpoint = z.infer<typeof PortfolioRiskCheckpointSchema>;

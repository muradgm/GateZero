import { z } from "zod";
import {
  LocalGate0ReviewStateSnapshotComparisonSchema,
  compareLocalGate0ReviewStateSnapshots
} from "./local-gate0-review-state-snapshot-comparison.js";
import {
  LocalGate0ReviewStateSnapshotSchema,
  type LocalGate0ReviewStateSnapshot
} from "./local-gate0-review-state-snapshot.js";
import {
  LocalProtectedLoopEvidenceThresholdResultComparisonSchema,
  compareLocalProtectedLoopEvidenceThresholdResults
} from "./local-protected-loop-evidence-threshold-comparison.js";
import {
  LocalProtectedLoopEvidenceThresholdProfileSchema,
  LocalProtectedLoopEvidenceThresholdResultSchema,
  evaluateLocalProtectedLoopEvidenceThresholds,
  type LocalProtectedLoopEvidenceThresholdProfile
} from "./local-protected-loop-evidence-thresholds.js";
import {
  LocalProtectedLoopIssueRegisterComparisonSchema,
  compareLocalProtectedLoopIssueRegisters
} from "./local-protected-loop-issue-register-comparison.js";
import {
  LocalProtectedLoopIssueRegisterSchema,
  LocalProtectedLoopIssueRegisterStatusSchema,
  createLocalProtectedLoopIssueRegister
} from "./local-protected-loop-issue-register.js";

export const LocalGate0ReviewStateAssemblyComparisonsSchema = z
  .object({
    snapshot_comparison: LocalGate0ReviewStateSnapshotComparisonSchema,
    threshold_result_comparison: LocalProtectedLoopEvidenceThresholdResultComparisonSchema,
    issue_register_comparison: LocalProtectedLoopIssueRegisterComparisonSchema
  })
  .strict();

export const LocalGate0ReviewStateAssemblySchema = z
  .object({
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    assembly_status: LocalProtectedLoopIssueRegisterStatusSchema,
    generated_at: z.string().datetime({ offset: true }),
    snapshot: LocalGate0ReviewStateSnapshotSchema,
    threshold_result: LocalProtectedLoopEvidenceThresholdResultSchema,
    issue_register: LocalProtectedLoopIssueRegisterSchema,
    comparisons: LocalGate0ReviewStateAssemblyComparisonsSchema.optional()
  })
  .strict()
  .superRefine((assembly, context) => {
    if (assembly.assembly_status !== assembly.issue_register.register_status) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "assembly_status must match issue register status",
        path: ["assembly_status"]
      });
    }

    if (assembly.threshold_result.snapshot_generated_at !== assembly.snapshot.generated_at) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "threshold result must reference snapshot generation time",
        path: ["threshold_result", "snapshot_generated_at"]
      });
    }

    if (
      assembly.issue_register.threshold_result_generated_at !==
      assembly.threshold_result.generated_at
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "issue register must reference threshold result generation time",
        path: ["issue_register", "threshold_result_generated_at"]
      });
    }
  });

export type LocalGate0ReviewStateAssemblyComparisons = z.infer<
  typeof LocalGate0ReviewStateAssemblyComparisonsSchema
>;
export type LocalGate0ReviewStateAssembly = z.infer<typeof LocalGate0ReviewStateAssemblySchema>;

export interface CreateLocalGate0ReviewStateAssemblyInput {
  readonly snapshot: LocalGate0ReviewStateSnapshot;
  readonly thresholdProfile: LocalProtectedLoopEvidenceThresholdProfile;
  readonly generatedAt: string;
  readonly thresholdGeneratedAt: string;
  readonly issueRegisterGeneratedAt: string;
  readonly comparisonGeneratedAt?: string;
  readonly baselineAssembly?: LocalGate0ReviewStateAssembly;
}

export function createLocalGate0ReviewStateAssembly(
  input: CreateLocalGate0ReviewStateAssemblyInput
): LocalGate0ReviewStateAssembly {
  const snapshot = LocalGate0ReviewStateSnapshotSchema.parse(input.snapshot);
  const thresholdProfile = LocalProtectedLoopEvidenceThresholdProfileSchema.parse(
    input.thresholdProfile
  );
  const thresholdResult = evaluateLocalProtectedLoopEvidenceThresholds(
    snapshot,
    thresholdProfile,
    input.thresholdGeneratedAt
  );
  const issueRegister = createLocalProtectedLoopIssueRegister(
    thresholdResult,
    input.issueRegisterGeneratedAt
  );
  const baselineAssembly =
    input.baselineAssembly === undefined
      ? undefined
      : LocalGate0ReviewStateAssemblySchema.parse(input.baselineAssembly);

  return LocalGate0ReviewStateAssemblySchema.parse({
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    assembly_status: issueRegister.register_status,
    generated_at: input.generatedAt,
    snapshot,
    threshold_result: thresholdResult,
    issue_register: issueRegister,
    comparisons:
      baselineAssembly === undefined
        ? undefined
        : {
            snapshot_comparison: compareLocalGate0ReviewStateSnapshots(
              baselineAssembly.snapshot,
              snapshot,
              getComparisonGeneratedAt(input)
            ),
            threshold_result_comparison: compareLocalProtectedLoopEvidenceThresholdResults(
              baselineAssembly.threshold_result,
              thresholdResult,
              getComparisonGeneratedAt(input)
            ),
            issue_register_comparison: compareLocalProtectedLoopIssueRegisters(
              baselineAssembly.issue_register,
              issueRegister,
              getComparisonGeneratedAt(input)
            )
          }
  });
}

function getComparisonGeneratedAt(input: CreateLocalGate0ReviewStateAssemblyInput): string {
  return input.comparisonGeneratedAt ?? input.generatedAt;
}

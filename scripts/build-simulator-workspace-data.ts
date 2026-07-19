import {
  calculateGate2DeterministicFill,
  evaluateGate2PaperRiskLimits,
  evaluateGate2SimulationCandidateIntegrity,
  reduceGate2PaperAccountState,
  type Gate2PaperAccountReducerInput,
  type Gate2PaperAccountReducerResult
} from "../packages/core/src/index.js";
import {
  gate2DeterministicFillModelFixture,
  gate2LocalPaperSimulatorFixtureTimestamp,
  gate2PaperAccountFixture,
  gate2PaperRiskLimitPolicyFixture,
  gate2PaperRiskSnapshotFixture,
  gate2SimulatedOrderLifecycleEventFixture,
  gate2OperatorNoteModelFixture,
  gate2MultiCaseWorkspaceFixture,
  gate2ResearchCaseInventoryFixtures,
  gate2StrategySimulatorHandoffFixture
} from "../packages/fixtures/src/index.js";
import { buildCheckedInLocalCaseCatalog } from "./build-local-case-catalog.js";

type ScenarioKey = "recorded" | "risk_blocked" | "candidate_blocked" | "state_mismatch";

export function buildSimulatorWorkspaceData() {
  const caseCatalog = buildCheckedInLocalCaseCatalog();
  const baseInput = buildBaseReducerInput();
  const scenarios = [
    buildScenario("recorded", "Recorded", "A fully reconciled local evidence record.", baseInput),
    buildScenario(
      "risk_blocked",
      "Risk blocked",
      "A drawdown breach prevents local state mutation.",
      {
        ...baseInput,
        riskEvaluation: evaluateGate2PaperRiskLimits({
          policy: gate2PaperRiskLimitPolicyFixture,
          snapshot: { ...gate2PaperRiskSnapshotFixture, drawdown_fraction: 0.1 },
          simulatedOrderRecordId: baseInput.fill.simulated_order_record_id,
          evaluatedAt: gate2LocalPaperSimulatorFixtureTimestamp
        })
      }
    ),
    buildScenario(
      "candidate_blocked",
      "Candidate blocked",
      "A stale duplicate candidate is rejected before mutation.",
      {
        ...baseInput,
        candidateGuard: evaluateGate2SimulationCandidateIntegrity({
          candidateGuardId: "candidate-guard-blocked-fixture-001",
          simulatedOrderRecordId: baseInput.fill.simulated_order_record_id,
          candidateFingerprint: "sha256:candidate-a",
          observedAt: "2026-07-19T11:00:00.000Z",
          evaluatedAt: gate2LocalPaperSimulatorFixtureTimestamp,
          maxCandidateAgeSeconds: gate2PaperRiskLimitPolicyFixture.max_candidate_age_seconds,
          priorFingerprints: ["sha256:candidate-a"]
        })
      }
    ),
    buildScenario(
      "state_mismatch",
      "State mismatch",
      "Account drift forces a readonly emergency posture.",
      {
        ...baseInput,
        observedAccount: {
          ...baseInput.observedAccount,
          cash_balance: 89_000,
          equity: 99_000
        }
      }
    )
  ];
  const researchCases = gate2ResearchCaseInventoryFixtures.map((item) => {
    const isPrimary =
      item.linked_research_case_id === gate2StrategySimulatorHandoffFixture.linked_research_case_id;

    return {
      inventoryId: item.case_inventory_item_id,
      id: item.linked_research_case_id,
      label: isPrimary ? "Complete local case" : "Blocked stale case",
      handoffId: item.handoff_id,
      status: item.workspace_case_status,
      completeness: item.completeness_status,
      freshness: item.freshness_status,
      linkedScenarioKey: item.linked_scenario_key,
      evidenceRefs: item.evidence_refs,
      missingEvidence: item.missing_evidence,
      provenanceRefs: item.provenance_refs,
      operatorReviewStatus: item.operator_review_status,
      operatorRequired: item.operator_required,
      limitationNotes: item.limitation_notes,
      strategyIdeaId: isPrimary
        ? gate2StrategySimulatorHandoffFixture.strategy_idea_id
        : item.evidence_refs[0],
      simulationEvidenceDetailId: isPrimary
        ? gate2StrategySimulatorHandoffFixture.simulation_evidence_detail_id
        : null,
      simulatedOrderRecordId: isPrimary
        ? gate2StrategySimulatorHandoffFixture.simulated_order_record_id
        : null,
      riskReviewId: isPrimary
        ? gate2StrategySimulatorHandoffFixture.risk_review_id
        : item.evidence_refs[1],
      operatorChecklist: isPrimary
        ? gate2StrategySimulatorHandoffFixture.operator_review_checklist
        : [
            "Inspect stale provenance before any further review.",
            "Record the missing evidence without promoting case state."
          ],
      operatorNote: isPrimary
        ? {
            id: gate2OperatorNoteModelFixture.operator_note_id,
            type: gate2OperatorNoteModelFixture.note_type,
            body: gate2OperatorNoteModelFixture.note_body,
            sourceRefs: gate2OperatorNoteModelFixture.source_link_refs,
            limitationNotes: gate2OperatorNoteModelFixture.limitation_notes,
            manualEntry: gate2OperatorNoteModelFixture.manual_entry,
            decisionPerformed: gate2OperatorNoteModelFixture.decision_performed
          }
        : null,
      outcome: isPrimary
        ? {
            id: gate2StrategySimulatorHandoffFixture.outcome_log_id,
            status: "linked_local_record" as const,
            limitation: "Outcome linkage is local evidence and does not make a performance claim."
          }
        : null,
      learning: isPrimary
        ? {
            id: gate2StrategySimulatorHandoffFixture.learning_event_id,
            status: "linked_local_record" as const,
            limitation: "Learning linkage does not promote strategy or simulation state."
          }
        : null
    };
  });
  const defaultResearchCase = researchCases.find(
    (item) => item.inventoryId === gate2MultiCaseWorkspaceFixture.default_case_inventory_item_id
  );

  if (!defaultResearchCase) {
    throw new Error("Multi-case workspace requires a valid default research case.");
  }

  return {
    title: "Local Simulator Evidence",
    subtitle: "Deterministic paper-account records, inspected across clear and blocked states.",
    gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    defaultScenario: "recorded" as const,
    caseWorkspace: {
      id: gate2MultiCaseWorkspaceFixture.workspace_inventory_id,
      defaultCaseInventoryId: gate2MultiCaseWorkspaceFixture.default_case_inventory_item_id,
      localOnly: gate2MultiCaseWorkspaceFixture.local_only,
      readonly: gate2MultiCaseWorkspaceFixture.read_only,
      operatorRequired: gate2MultiCaseWorkspaceFixture.operator_required,
      actionRoutePresent: gate2MultiCaseWorkspaceFixture.action_route_created,
      limitationNotes: gate2MultiCaseWorkspaceFixture.limitation_notes
    },
    researchCase: defaultResearchCase,
    researchCases,
    caseCatalog,
    riskComparison: scenarios
      .filter((scenario) => scenario.key === "recorded" || scenario.key === "risk_blocked")
      .map((scenario) => ({
        scenarioKey: scenario.key,
        scenarioLabel: scenario.label,
        reducerStatus: scenario.status,
        riskStatus: scenario.risk.status,
        drawdownFraction: scenario.risk.drawdownFraction,
        maxDrawdownFraction: scenario.risk.maxDrawdownFraction,
        stateChanged: scenario.account.stateChanged,
        blockingReasons: scenario.blockingReasons
      })),
    scenarios,
    boundaries: [
      "Synthetic local data only",
      "No external account or credential surface",
      "No external market route",
      "No automated action",
      "No prediction or performance claim",
      "Operator review remains required"
    ]
  } as const;
}

export type SimulatorWorkspaceData = ReturnType<typeof buildSimulatorWorkspaceData>;

function buildBaseReducerInput(): Gate2PaperAccountReducerInput {
  const fill = calculateGate2DeterministicFill({
    model: gate2DeterministicFillModelFixture,
    simulatedOrderRecordId: gate2SimulatedOrderLifecycleEventFixture.simulated_order_record_id,
    side: "long",
    quantity: 10_000,
    calculatedAt: gate2LocalPaperSimulatorFixtureTimestamp
  });

  return {
    expectedAccount: gate2PaperAccountFixture,
    observedAccount: gate2PaperAccountFixture,
    fill,
    instrument: "EURUSD",
    markPrice: 1.1,
    lifecycleEvent: gate2SimulatedOrderLifecycleEventFixture,
    riskEvaluation: evaluateGate2PaperRiskLimits({
      policy: gate2PaperRiskLimitPolicyFixture,
      snapshot: gate2PaperRiskSnapshotFixture,
      simulatedOrderRecordId: fill.simulated_order_record_id,
      evaluatedAt: gate2LocalPaperSimulatorFixtureTimestamp
    }),
    candidateGuard: evaluateGate2SimulationCandidateIntegrity({
      candidateGuardId: "candidate-guard-fixture-001",
      simulatedOrderRecordId: fill.simulated_order_record_id,
      candidateFingerprint: "sha256:candidate-a",
      observedAt: gate2LocalPaperSimulatorFixtureTimestamp,
      evaluatedAt: gate2LocalPaperSimulatorFixtureTimestamp,
      maxCandidateAgeSeconds: gate2PaperRiskLimitPolicyFixture.max_candidate_age_seconds,
      priorFingerprints: []
    }),
    journal: [],
    reducedAt: gate2LocalPaperSimulatorFixtureTimestamp
  };
}

function buildScenario(
  key: ScenarioKey,
  label: string,
  summary: string,
  input: Gate2PaperAccountReducerInput
) {
  const result = reduceGate2PaperAccountState(input);
  const beforePosition = result.account_before.positions[0];
  const afterPosition = result.account_after.positions[0];

  if (!beforePosition || !afterPosition) {
    throw new Error("Simulator workspace scenario requires one before and after position.");
  }

  return {
    key,
    label,
    summary,
    status: result.reducer_status,
    reducedAt: result.reduced_at,
    blockingReasons: result.blocking_reasons,
    account: {
      id: result.account_after.paper_account_id,
      currency: result.account_after.base_currency,
      cashBefore: result.account_before.cash_balance,
      cashAfter: result.account_after.cash_balance,
      equityBefore: result.account_before.equity,
      equityAfter: result.account_after.equity,
      feeAdjustedPnl: result.account_after.realized_pnl,
      openPositions: result.account_after.open_position_count,
      stateChanged: hasAccountChanged(result)
    },
    position: {
      instrument: afterPosition.instrument,
      quantityBefore: beforePosition.quantity,
      quantityAfter: afterPosition.quantity,
      averagePriceBefore: beforePosition.average_price,
      averagePriceAfter: afterPosition.average_price,
      markPrice: afterPosition.mark_price,
      markedValue: afterPosition.market_value
    },
    lifecycle: {
      from: input.lifecycleEvent.from_state,
      to: input.lifecycleEvent.to_state,
      reason: input.lifecycleEvent.transition_reason,
      operatorRequired: input.lifecycleEvent.operator_required,
      automated: input.lifecycleEvent.automated_transition
    },
    risk: {
      status: input.riskEvaluation.evaluation_status,
      breaches: input.riskEvaluation.breaches,
      positionFraction: gate2PaperRiskSnapshotFixture.position_fraction,
      maxPositionFraction: gate2PaperRiskLimitPolicyFixture.max_position_fraction,
      drawdownFraction:
        key === "risk_blocked" ? 0.1 : gate2PaperRiskSnapshotFixture.drawdown_fraction,
      maxDrawdownFraction: gate2PaperRiskLimitPolicyFixture.max_drawdown_fraction,
      policyVersion: gate2PaperRiskLimitPolicyFixture.policy_version,
      policyLocked: gate2PaperRiskLimitPolicyFixture.version_locked
    },
    candidate: {
      status: input.candidateGuard.guard_status,
      reasons: input.candidateGuard.blocking_reasons,
      maxAgeSeconds: input.candidateGuard.max_candidate_age_seconds
    },
    fill: {
      side: input.fill.side,
      quantity: input.fill.quantity,
      price: input.fill.fill_price,
      notional: input.fill.notional,
      fee: input.fill.fee_amount,
      spreadBps: gate2DeterministicFillModelFixture.spread_bps,
      slippageBps: gate2DeterministicFillModelFixture.slippage_bps,
      latencyMs: gate2DeterministicFillModelFixture.latency_ms,
      limitation: gate2DeterministicFillModelFixture.limitation_notes[0]
    },
    journal: {
      eventCount: result.journal_after.length,
      tailHash: result.account_after.journal_tail_hash,
      immutable: result.journal_after.every((event) => event.immutable),
      events: result.journal_after.map((event) => ({
        sequence: event.sequence,
        type: event.event_type,
        eventHash: event.event_hash,
        previousHash: event.previous_event_hash
      }))
    },
    reconciliation: {
      status: result.input_reconciliation.reconciliation_status,
      mismatchReasons: result.input_reconciliation.mismatch_reasons,
      readonlyEmergency: result.input_reconciliation.readonly_emergency_required
    }
  } as const;
}

function hasAccountChanged(result: Gate2PaperAccountReducerResult): boolean {
  return JSON.stringify(result.account_before) !== JSON.stringify(result.account_after);
}

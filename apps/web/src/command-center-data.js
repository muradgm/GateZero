export const commandCenterData = {
  project: "TraderFrame",
  title: "TraderFrame Command Center",
  subtitle: "Research operating health, evidence freshness, and control-plane integrity.",
  gate: "G1_BACKTESTING",
  scope: "historical_backtesting_only",
  latestPacket: "TRD-322",
  localVerification: "71 files / 411 tests",
  ciRun: "27787807220",
  ciState: "success",
  lastVerifiedCommit: "6e6f513",
  navItems: ["Overview", "Loop", "Risk", "Evidence", "Actions", "Docs"],
  healthCards: [
    {
      label: "Gate Status",
      value: "G1_BACKTESTING",
      detail: "Control plane is historical-backtesting-only.",
      tone: "steady"
    },
    {
      label: "Local Verification",
      value: "Green",
      detail: "Latest suite: 71 files, 411 tests.",
      tone: "good"
    },
    {
      label: "Remote Evidence",
      value: "Fresh",
      detail: "Latest recorded run is linked to local history.",
      tone: "good"
    },
    {
      label: "Review Coverage",
      value: "322 / 322",
      detail: "Assignments, QA, risk, and acceptance align.",
      tone: "good"
    }
  ],
  loopSteps: [
    "Strategy Idea",
    "Data Snapshot",
    "Backtest",
    "Metric Report",
    "Risk Review",
    "Operator Decision",
    "Outcome Logged",
    "Learning Event"
  ],
  boundaryItems: [
    "External account connectors",
    "Real-money routes",
    "Unsupervised action paths",
    "Directional prediction prompts",
    "Readiness or promotion labels",
    "Performance claim language"
  ],
  evidenceRows: [
    {
      area: "Local verification",
      signal: "pnpm verify:gate0",
      state: "Passing",
      reference: "71 files / 411 tests"
    },
    {
      area: "Verified commit",
      signal: "6e6f513",
      state: "Recorded",
      reference: "Run 27787807220"
    },
    {
      area: "Remote CI",
      signal: "Run 27787807220",
      state: "Passing",
      reference: "Recorded passing run"
    },
    {
      area: "CI evidence",
      signal: "Freshness guard",
      state: "Passing",
      reference: "15 evidence records"
    },
    {
      area: "Agent registry",
      signal: "Manifest guard",
      state: "Passing",
      reference: "12 agents aligned"
    },
    {
      area: "Review coverage",
      signal: "Coverage guard",
      state: "Passing",
      reference: "322 accepted records"
    }
  ],
  nextActions: [
    "Proceed to TRD-323 Gate command naming migration plan.",
    "Record CI evidence only for concrete maintenance, audit, handoff, or incident needs.",
    "Use the command center for operating health, not strategy selection."
  ],
  docGroups: [
    {
      label: "Tracker",
      items: ["ops/runtime/tracklist.md", "ops/runtime/progress/GATE0_PROGRESS_SNAPSHOT.md"]
    },
    {
      label: "Command Center",
      items: [
        "docs/operations/GATE0_COMMAND_CENTER_VISUAL_QA_PASS.md",
        "docs/operations/GATE0_COMMAND_CENTER_MOBILE_EVIDENCE_TABLE_UX.md",
        "docs/operations/GATE0_COMMAND_CENTER_SOURCE_LINK_GROUPING.md",
        "docs/operations/GATE0_COMMAND_CENTER_OPERATOR_HANDOFF_NOTE.md",
        "docs/operations/GATE0_COMMAND_CENTER_HASH_NAVIGATION_STATE.md",
        "docs/operations/GATE0_COMMAND_CENTER_LAST_VERIFIED_COMMIT.md",
        "docs/operations/GATE0_COMMAND_CENTER_VISUAL_RECHECK_AFTER_TRD231.md",
        "docs/operations/GATE0_COMMAND_CENTER_LOCAL_RUNTIME_SNAPSHOT.md",
        "docs/operations/GATE0_COMMAND_CENTER_LOCAL_AUTO_REFRESH.md",
        "docs/operations/GATE0_COMMAND_CENTER_LOCAL_RUNTIME_SECURITY_BOUNDARY.md",
        "docs/operations/GATE0_CI_EVIDENCE_REFRESH_HELPER.md",
        "docs/operations/GATE0_CI_EVIDENCE_REFRESH_LOOP_PAUSE.md",
        "docs/operations/GATE0_TRADERFRAME_BRAND_ALIGNMENT.md",
        "docs/operations/GATE1_DEPENDENCY_UPGRADE_EXECUTION.md",
        "docs/operations/GATE1_DIRECTIONAL_PNL_CONTRACT.md",
        "docs/operations/GATE1_DIRECTIONAL_PNL_CONTRACT_TESTS.md",
        "docs/operations/GATE1_DIRECTIONAL_PNL_FIXTURES.md",
        "docs/operations/GATE1_BACKTEST_EVIDENCE_INTEGRITY_REVIEW.md",
        "docs/operations/GATE1_BACKTEST_ASSUMPTION_RISK_REGISTER.md",
        "docs/operations/GATE1_BACKTEST_ASSUMPTION_RISK_REGISTER_NEGATIVE_CASES.md",
        "docs/operations/GATE1_RISK_REGISTER_GUARD_INDEXING_HARDENING.md",
        "docs/operations/GATE1_BAD_ASSUMPTION_FIXTURE_CASES.md",
        "docs/operations/GATE1_BACKTEST_RUN_ASSEMBLY_CONTRACT.md",
        "docs/operations/GATE1_METRIC_REPORT_EVIDENCE_ONLY_CONTRACT.md",
        "docs/operations/GATE1_REPRODUCIBILITY_COMPARISON_HARDENING.md",
        "docs/operations/GATE1_OPERATOR_DECISION_EVENT_CONTRACT.md",
        "docs/operations/GATE1_COMPLETION_CRITERIA_DRAFT.md",
        "docs/operations/GATE2_BLOCKER_AUDIT.md",
        "docs/operations/GATE1_SOURCE_LINK_AND_GUARD_COVERAGE_RECHECK.md",
        "docs/operations/GATE1_BACKTEST_RUN_ASSEMBLY_NEGATIVE_CASES.md",
        "docs/operations/GATE1_METRIC_REPORT_EVIDENCE_NEGATIVE_CASES.md",
        "docs/operations/GATE1_OPERATOR_DECISION_EVENT_NEGATIVE_CASES.md",
        "docs/operations/GATE1_COMPLETION_CRITERIA_SOURCE_LINK_HARDENING.md",
        "docs/operations/GATE2_BLOCKER_GUARD_COVERAGE.md",
        "docs/operations/GATE1_MISSING_CANDLE_BAD_DATA_FIXTURE_PLAN.md",
        "docs/operations/GATE1_STALE_DATA_BLOCKER_CONTRACT_PLAN.md",
        "docs/operations/GATE1_DUPLICATE_SIGNAL_BLOCKER_PLANNING_RECORD.md",
        "docs/operations/GATE1_STRATEGY_PARAMETER_IMMUTABILITY_GUARD_PLAN.md",
        "docs/operations/GATE1_EVIDENCE_BUNDLE_ASSEMBLY_REVIEW.md",
        "docs/operations/GATE1_BACKTEST_ASSEMBLY_GUARD_INDEX_RECHECK.md",
        "docs/operations/GATE1_METRIC_REPORT_GUARD_INDEX_RECHECK.md",
        "docs/operations/GATE1_OPERATOR_DECISION_GUARD_INDEX_RECHECK.md",
        "docs/operations/GATE1_MISSING_CANDLE_FIXTURE_CONTRACT.md",
        "docs/operations/GATE1_STALE_DATA_BLOCKER_CONTRACT.md",
        "docs/operations/GATE1_DUPLICATE_SIGNAL_BLOCKER_CONTRACT.md",
        "docs/operations/GATE1_PARAMETER_IMMUTABILITY_GUARD_CONTRACT.md",
        "docs/operations/GATE1_EVIDENCE_BUNDLE_SUMMARY_CONTRACT.md",
        "docs/operations/GATE1_COMPLETION_BLOCKER_RECHECK.md",
        "docs/operations/GATE1_CONTROL_PLANE_CHECKPOINT.md",
        "docs/operations/GATE1_SKILL_DEFAULT_GATE_ALIGNMENT.md"
      ]
    },
    {
      label: "Evidence",
      items: [
        "docs/operations/GATE0_COMMAND_CENTER_CI_EVIDENCE_POST_GUARD_REFRESH.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_SKILL_INTAKE.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_RUN_RECORD_REFRESH_AFTER_SKILL_INTAKE.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_SKILL_ROUTING.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_RUN_RECORD_REFRESH_AFTER_SKILL_ROUTING.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_SKILL_LIBRARY_CLOSEOUT.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_RUN_RECORD_REFRESH_AFTER_SKILL_LIBRARY_CLOSEOUT.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_NODE24_ACTION_UPGRADE.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_RUN_RECORD_REFRESH_AFTER_NODE24_ACTION_UPGRADE.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_EVIDENCE_REFRESH_AFTER_TRD230_PUSH.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD240_PUSH.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD241.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD242_PUSH.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD243.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD246_PUSH.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD247.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD248_PUSH.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD249.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD250_PUSH.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD251.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD252_PUSH.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD257_PUSH.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD258_PUSH.md",
        "docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD259_PUSH.md",
        "docs/operations/GATE0_COMMAND_CENTER_CI_METADATA_REFRESH_AFTER_TRD253.md",
        "docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX_LATEST_PUSH_CONFIRMATION.md",
        "docs/operations/GATE0_CI_EVIDENCE_FRESHNESS_COUNT_EXPECTATIONS.md",
        "docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md",
        "docs/operations/GATE0_CI_FAILURE_TRIAGE_GUARDRAIL.md",
        "docs/operations/GATE0_GITHUB_ACTIONS_NODE24_ACTION_UPGRADE.md"
      ]
    },
    {
      label: "Guards",
      items: [
        "scripts/check-gate0-command-center-freshness.ts",
        "scripts/check-gate0-command-center-render-contract.ts",
        "scripts/check-gate0-skill-governance.ts",
        "scripts/check-gate0-skill-routing.ts",
        "scripts/check-gate0-github-actions-runtime.ts",
        "scripts/check-gate0-source-link-duplicates.ts",
        "scripts/check-gate0-tracklist-section-length.ts",
        "scripts/build-command-center-runtime-data.ts",
        "scripts/refresh-gate0-ci-evidence.ts",
        "packages/fixtures/tests/gate0-skill-routing.test.ts",
        "packages/fixtures/tests/gate0-github-actions-runtime.test.ts",
        "packages/fixtures/tests/gate0-source-link-duplicates.test.ts",
        "packages/fixtures/tests/gate0-tracklist-section-length.test.ts",
        "packages/fixtures/tests/gate0-command-center-runtime-data.test.ts",
        "packages/fixtures/tests/gate0-command-center-render-contract.test.ts",
        "packages/fixtures/tests/gate0-ci-evidence-refresh.test.ts"
      ]
    },
    {
      label: "Skills",
      items: [
        "skills/gatezero-docs-control-plane-reviewer/SKILL.md",
        "skills/gatezero-orchestrator-reviewer/SKILL.md",
        "skills/gatezero-product-strategy-reviewer/SKILL.md",
        "skills/gatezero-qa-security-reviewer/SKILL.md",
        "skills/gatezero-quant-backtest-reviewer/SKILL.md",
        "skills/gatezero-risk-governance-reviewer/SKILL.md",
        "skills/gatezero-ui-command-center-reviewer/SKILL.md",
        "skills/trader-product-reviewer/SKILL.md",
        "skills/trading-forex-domain-expert/SKILL.md",
        "docs/operations/GATE0_SKILL_ROUTING_MATRIX.md",
        "docs/operations/GATE0_SKILL_GOVERNANCE_REVIEW.md",
        "docs/operations/GATE0_SKILL_LIBRARY_INTAKE.md",
        "docs/operations/GATE0_SKILL_LIBRARY_CLOSEOUT_REVIEW.md",
        "docs/operations/GATE0_SKILL_USAGE_HANDOFF_NOTE.md",
        "docs/operations/GATE0_NEXT_SCOPE_RECOMMENDATION_AFTER_SKILL_LIBRARY.md",
        "docs/operations/GATE0_DOCS_CONTROL_PLANE_REVIEWER_SKILL_INTAKE.md",
        "docs/operations/GATE0_ORCHESTRATOR_REVIEWER_SKILL_INTAKE.md",
        "docs/operations/GATE0_PRODUCT_STRATEGY_REVIEWER_SKILL_INTAKE.md",
        "docs/operations/GATE0_QA_SECURITY_REVIEWER_SKILL_INTAKE.md",
        "docs/operations/GATE0_QUANT_BACKTEST_REVIEWER_SKILL_INTAKE.md",
        "docs/operations/GATE0_RISK_GOVERNANCE_REVIEWER_SKILL_INTAKE.md"
      ]
    },
    {
      label: "Preview",
      items: ["scripts/preview-web.ts", "apps/web/README.md"]
    }
  ]
};

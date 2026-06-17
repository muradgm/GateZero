export const commandCenterData = {
  project: "GateZero",
  title: "GateZero Command Center",
  subtitle: "Research operating health, evidence freshness, and control-plane integrity.",
  gate: "G0_RESEARCH",
  scope: "research_only",
  latestPacket: "TRD-230",
  localVerification: "66 files / 335 tests",
  ciRun: "27716026760",
  ciState: "success",
  navItems: ["Overview", "Loop", "Risk", "Evidence", "Actions", "Docs"],
  healthCards: [
    {
      label: "Gate Status",
      value: "G0_RESEARCH",
      detail: "Control plane remains research-only.",
      tone: "steady"
    },
    {
      label: "Local Verification",
      value: "Green",
      detail: "Latest suite: 66 files, 335 tests.",
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
      value: "230 / 230",
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
      reference: "66 files / 335 tests"
    },
    {
      area: "Remote CI",
      signal: "Run 27716026760",
      state: "Passing",
      reference: "Recorded passing run"
    },
    {
      area: "CI evidence",
      signal: "Freshness guard",
      state: "Passing",
      reference: "3 evidence records"
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
      reference: "230 accepted records"
    }
  ],
  nextActions: [
    "Keep the next queue paused until a real control gap appears.",
    "Refresh CI evidence after future pushed maintenance changes.",
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
        "docs/operations/GATE0_COMMAND_CENTER_HASH_NAVIGATION_STATE.md"
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
        "packages/fixtures/tests/gate0-skill-routing.test.ts",
        "packages/fixtures/tests/gate0-github-actions-runtime.test.ts",
        "packages/fixtures/tests/gate0-command-center-render-contract.test.ts"
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

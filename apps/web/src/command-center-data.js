export const commandCenterData = {
  project: "GateZero",
  title: "GateZero Command Center",
  subtitle: "Research operating health, evidence freshness, and control-plane integrity.",
  gate: "G0_RESEARCH",
  scope: "research_only",
  latestPacket: "TRD-202",
  localVerification: "62 files / 316 tests",
  ciRun: "27502152482",
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
      detail: "Latest suite: 62 files, 316 tests.",
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
      value: "202 / 202",
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
      reference: "62 files / 316 tests"
    },
    {
      area: "Remote CI",
      signal: "Run 27502152482",
      state: "Passing",
      reference: "Recorded passing run"
    },
    {
      area: "CI evidence",
      signal: "Freshness guard",
      state: "Passing",
      reference: "2 evidence records"
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
      reference: "202 accepted records"
    }
  ],
  nextActions: [
    "Keep the next queue paused until a real control gap appears.",
    "Refresh CI evidence after future pushed maintenance changes.",
    "Use the command center for operating health, not strategy selection."
  ],
  docs: [
    "ops/runtime/tracklist.md",
    "docs/operations/GATE0_COMMAND_CENTER_VISUAL_QA_PASS.md",
    "docs/operations/GATE0_COMMAND_CENTER_ACCESSIBILITY_BASELINE.md",
    "docs/operations/GATE0_COMMAND_CENTER_RUNTIME_DATA_SOURCE_PLAN.md",
    "docs/operations/GATE0_COMMAND_CENTER_LOCAL_PREVIEW_SCRIPT.md",
    "docs/operations/GATE0_COMMAND_CENTER_EVIDENCE_FRESHNESS_GUARD.md",
    "docs/operations/GATE0_COMMAND_CENTER_CI_EVIDENCE_REFRESH.md",
    "docs/operations/GATE0_COMMAND_CENTER_CI_RUN_FRESHNESS_GUARD.md",
    "docs/operations/GATE0_COMMAND_CENTER_NAVIGATION_CONTRACT_CHECK.md",
    "docs/operations/GATE0_COMMAND_CENTER_ACCESSIBILITY_CONTRACT_CHECK.md",
    "docs/operations/GATE0_COMMAND_CENTER_PREVIEW_SCRIPT_CONTRACT_CHECK.md",
    "docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md",
    "docs/operations/GATE0_CI_FAILURE_TRIAGE_GUARDRAIL.md"
  ]
};

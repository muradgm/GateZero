export const commandCenterData = {
  project: "GateZero",
  title: "GateZero Command Center",
  subtitle: "Research operating health, evidence freshness, and control-plane integrity.",
  gate: "G0_RESEARCH",
  scope: "research_only",
  latestPacket: "TRD-192",
  localVerification: "60 files / 305 tests",
  ciRun: "27491732789",
  ciState: "success",
  navItems: ["Overview", "Evidence", "Agents", "Risk", "CI", "Docs"],
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
      detail: "Latest suite: 60 files, 305 tests.",
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
      value: "192 / 192",
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
      reference: "60 files / 305 tests"
    },
    {
      area: "Remote CI",
      signal: "Run 27491732789",
      state: "Passing",
      reference: "Commit 459d37c"
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
      reference: "192 accepted records"
    }
  ],
  nextActions: [
    "Keep the next queue paused until a real control gap appears.",
    "Refresh CI evidence after future pushed maintenance changes.",
    "Use the command center for operating health, not strategy selection."
  ],
  docs: [
    "ops/runtime/tracklist.md",
    "docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md",
    "docs/operations/GATE0_CI_FAILURE_TRIAGE_GUARDRAIL.md",
    "docs/operations/GATE0_MAINTENANCE_PAUSE_RECONFIRMATION.md"
  ]
};

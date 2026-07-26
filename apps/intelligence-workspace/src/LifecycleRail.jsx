import React from "react";

const lifecycleStages = [
  { id: "research_case", label: "Case", description: "Candidate created" },
  { id: "market_context", label: "Context", description: "Market state reviewed" },
  { id: "evidence_assessment", label: "Evidence", description: "Support and contradiction checked" },
  { id: "setup_review", label: "Setup", description: "Strategy requirements reviewed" },
  { id: "intelligence_report", label: "Assessment", description: "System assessment produced" },
  { id: "risk_review", label: "Risk", description: "Capital impact reviewed" },
  { id: "operator_decision", label: "Decision", description: "Operator action required" },
  { id: "paper_simulation", label: "Simulation", description: "Paper case opened" },
  { id: "outcome", label: "Outcome", description: "Result recorded" },
  { id: "learning", label: "Learning", description: "Lesson captured" }
];

export function LifecycleRail({ pipeline, workflow }) {
  const currentStageIndex = lifecycleStages.findIndex((stage) => stage.id === pipeline.currentStage);
  const blocker = workflow?.blockingCondition && workflow.blockingCondition !== "None"
    ? workflow.blockingCondition
    : null;

  const stages = lifecycleStages.map((stage, index) => {
    const record = pipeline.stages.find((item) => item.stage === stage.id);
    let status = "locked";

    if (record?.status === "not_applicable") status = "skipped";
    else if (index < currentStageIndex) status = "complete";
    else if (index === currentStageIndex) status = blocker ? "blocked" : "current";

    return { ...stage, status, recordStatus: record?.status ?? "pending" };
  });

  const completedCount = stages.filter((stage) => stage.status === "complete").length;

  return (
    <section className="lifecycle-rail" aria-label="Decision lifecycle">
      <div className="lifecycle-rail__header">
        <div>
          <span className="lifecycle-rail__eyebrow">Decision lifecycle</span>
          <strong>{workflow?.currentStageLabel ?? pipeline.currentStage.replaceAll("_", " ")}</strong>
        </div>
        <div className="lifecycle-rail__summary">
          <span>{completedCount} complete</span>
          <span>{stages.length - completedCount - 1} downstream</span>
        </div>
      </div>

      <ol className="lifecycle-rail__stages">
        {stages.map((stage, index) => (
          <li
            key={stage.id}
            className={`lifecycle-stage lifecycle-stage--${stage.status}`}
            aria-current={stage.status === "current" || stage.status === "blocked" ? "step" : undefined}
          >
            <div className="lifecycle-stage__marker" aria-hidden="true">
              {stage.status === "complete" ? "✓" : stage.status === "blocked" ? "!" : index + 1}
            </div>
            <div className="lifecycle-stage__copy">
              <div className="lifecycle-stage__title-row">
                <strong>{stage.label}</strong>
                <span>{statusLabel(stage.status)}</span>
              </div>
              <small>{stage.status === "blocked" && blocker ? blocker : stage.description}</small>
            </div>
          </li>
        ))}
      </ol>

      <div className={`lifecycle-rail__next ${blocker ? "lifecycle-rail__next--blocked" : ""}`}>
        <span>{blocker ? "Blocking condition" : "Next required action"}</span>
        <strong>{blocker ?? workflow?.nextAction ?? "Continue the current review stage."}</strong>
      </div>
    </section>
  );
}

function statusLabel(status) {
  const labels = {
    complete: "Complete",
    current: "In progress",
    blocked: "Blocked",
    locked: "Locked",
    skipped: "Not applicable"
  };
  return labels[status] ?? status;
}

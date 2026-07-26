const stageLabels = {
  research_case: "Candidate intake",
  market_context: "Context review",
  evidence_assessment: "Evidence review",
  setup_review: "Setup review",
  intelligence_report: "Assessment review",
  risk_review: "Risk review",
  operator_decision: "Operator decision",
  paper_simulation: "Paper simulation",
  outcome: "Outcome review",
  learning: "Learning review"
};

export function deriveCandidateWorkflow(candidate, generatedAt) {
  if (candidate.workflow) return candidate.workflow;

  const recommendation = candidate.report.recommendation;
  const stage = candidate.pipeline.currentStage;
  const downgrade = candidate.report.downgradeReasons[0];
  const currentStageLabel = stageLabels[stage] ?? stage.replaceAll("_", " ");
  const lastEvent = candidate.report.timeline.at(-1)?.occurredAt ?? generatedAt;
  const detectedAt = candidate.report.timeline[0]?.occurredAt ?? generatedAt;
  const freshness = freshnessState(lastEvent, generatedAt);

  if (recommendation === "REJECT") {
    return {
      status: "CLOSED",
      statusLabel: "Rejected",
      currentStageLabel,
      blockingCondition: downgrade ?? candidate.report.bearCase.summary,
      nextAction: "Preserve the rejection rationale and close the review trace.",
      freshnessLabel: freshness.label,
      freshnessState: freshness.state,
      detectedAt,
      changedAt: lastEvent,
      reviewed: stage === "operator_decision" || stage === "paper_simulation",
      urgency: "CLOSED"
    };
  }

  if (recommendation === "PAPER_SIMULATE") {
    const ready = stage === "operator_decision";
    return {
      status: ready ? "READY" : "PENDING",
      statusLabel: ready ? "Ready for decision" : "Review in progress",
      currentStageLabel,
      blockingCondition: downgrade ?? "No unresolved assessment blocker recorded.",
      nextAction:
        stage === "risk_review"
          ? "Complete risk review before recording the operator decision."
          : "Review the evidence and record the bounded operator decision.",
      freshnessLabel: freshness.label,
      freshnessState: freshness.state,
      expiresAt: addMinutes(lastEvent, 60),
      detectedAt,
      changedAt: lastEvent,
      reviewed: false,
      urgency: ready ? "ACTION_REQUIRED" : "REVIEW"
    };
  }

  const contradiction = firstContradiction(candidate);
  return {
    status: "BLOCKED",
    statusLabel: "Watch",
    currentStageLabel,
    blockingCondition: downgrade ?? contradiction.rationale,
    nextAction: nextActionForWatch(contradiction),
    freshnessLabel: freshness.label,
    freshnessState: freshness.state,
    expiresAt: addMinutes(lastEvent, 120),
    detectedAt,
    changedAt: lastEvent,
    reviewed: false,
    urgency:
      contradiction.dimension === "macro" || contradiction.dimension === "event_risk"
        ? "TIME_SENSITIVE"
        : "WAITING"
  };
}

function firstContradiction(candidate) {
  return (
    candidate.report.contributions.find((item) => item.direction === "contradicting") ?? {
      dimension: "unknown",
      rationale: "A required condition remains unresolved."
    }
  );
}

function nextActionForWatch(contradiction) {
  if (contradiction.dimension === "macro" || contradiction.dimension === "event_risk") {
    return "Wait for the event-risk restriction to clear, then refresh the context.";
  }
  if (contradiction.dimension === "momentum") {
    return "Wait for momentum and location to improve before reassessment.";
  }
  return "Resolve the first contradictory condition and rerun the assessment.";
}

function freshnessState(observedAt, generatedAt) {
  const observed = Date.parse(observedAt);
  const generated = Date.parse(generatedAt);
  if (!Number.isFinite(observed) || !Number.isFinite(generated)) {
    return { label: "Unknown", state: "unknown" };
  }
  const ageMinutes = Math.max(0, Math.round((generated - observed) / 60000));
  if (ageMinutes <= 5) return { label: "Fresh", state: "fresh" };
  if (ageMinutes <= 30) return { label: `${ageMinutes}m old`, state: "aging" };
  return { label: `Stale · ${ageMinutes}m`, state: "stale" };
}

function addMinutes(value, minutes) {
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time + minutes * 60000).toISOString() : undefined;
}

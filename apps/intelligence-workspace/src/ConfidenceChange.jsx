import React, { useMemo } from "react";
import { Badge, Panel, PanelHeading } from "@traderframe/ui";

const BASELINE = 50;

export function ConfidenceChange({ candidate }) {
  const model = useMemo(() => buildConfidenceChange(candidate.report), [candidate]);

  return (
    <Panel className="confidence-change-panel">
      <PanelHeading
        eyebrow="Evidence index explanation"
        title="Why the evidence index changed"
        aside={
          <Badge tone={model.net >= 0 ? "success" : "warning"}>{formatDelta(model.net)} pts</Badge>
        }
      />

      <div className="confidence-change-summary">
        <div>
          <span>Neutral baseline</span>
          <strong>{BASELINE}</strong>
        </div>
        <div>
          <span>Current evidence score</span>
          <strong>{model.current}</strong>
        </div>
        <div>
          <span>Supporting pressure</span>
          <strong>+{model.supporting}</strong>
        </div>
        <div>
          <span>Contradicting pressure</span>
          <strong>-{model.contradicting}</strong>
        </div>
      </div>

      <div className="confidence-change-body">
        <div className="confidence-change-list">
          {model.steps.map((step) => (
            <details
              className={`confidence-change-step confidence-change-step--${step.delta >= 0 ? "up" : "down"}`}
              key={step.id}
            >
              <summary>
                <span className="confidence-change-step__delta">{formatDelta(step.delta)}</span>
                <div>
                  <strong>{step.label}</strong>
                  <small>{step.rationale}</small>
                </div>
                <span className="confidence-change-step__score">{step.after}</span>
              </summary>
              <p>{step.limitation}</p>
              <code>{step.evidenceIds.join(" · ") || "No direct evidence reference"}</code>
            </details>
          ))}
        </div>

        <div
          className="confidence-change-chart"
          aria-label="Cumulative evidence score construction"
        >
          <svg viewBox="0 0 420 190" role="img">
            <title>Cumulative evidence score from neutral baseline to current score</title>
            <g className="confidence-change-grid">
              {[25, 50, 75, 100].map((value) => {
                const y = scaleY(value);
                return (
                  <g key={value}>
                    <line x1="28" x2="402" y1={y} y2={y} />
                    <text x="4" y={y + 3}>
                      {value}
                    </text>
                  </g>
                );
              })}
            </g>
            <path className="confidence-change-area" d={areaPath(model.points)} />
            <path className="confidence-change-line" d={linePath(model.points)} />
            {model.points.map((point, index) => (
              <circle
                className={
                  index === model.points.length - 1
                    ? "confidence-change-point confidence-change-point--current"
                    : "confidence-change-point"
                }
                key={`${point.x}-${point.value}`}
                cx={point.x}
                cy={point.y}
                r={index === model.points.length - 1 ? 4.5 : 3}
              />
            ))}
          </svg>
          <p>
            This reconstructs score formation from the current evidence ledger. It is not a
            historical market snapshot series or a probability forecast.
          </p>
        </div>
      </div>
    </Panel>
  );
}

function buildConfidenceChange(report) {
  let score = BASELINE;
  const steps = report.contributions.map((contribution) => {
    const before = score;
    score = clamp(score + contribution.points, 0, 100);
    return {
      id: contribution.contributionId,
      label: contribution.label,
      delta: score - before,
      before,
      after: score,
      rationale: contribution.rationale,
      limitation: contribution.limitation,
      evidenceIds: contribution.evidenceIds
    };
  });

  const values = [BASELINE, ...steps.map((step) => step.after)];
  const width = 374;
  const stepX = values.length > 1 ? width / (values.length - 1) : width;
  const points = values.map((value, index) => ({
    value,
    x: 28 + stepX * index,
    y: scaleY(value)
  }));

  const supporting = report.contributions
    .filter((item) => item.points > 0)
    .reduce((sum, item) => sum + item.points, 0);
  const contradicting = Math.abs(
    report.contributions
      .filter((item) => item.points < 0)
      .reduce((sum, item) => sum + item.points, 0)
  );

  return {
    steps,
    points,
    supporting,
    contradicting,
    current: report.evidenceScore,
    net: report.evidenceScore - BASELINE
  };
}

function scaleY(value) {
  return 170 - (clamp(value, 0, 100) / 100) * 145;
}

function linePath(points) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function areaPath(points) {
  if (!points.length) return "";
  const line = linePath(points);
  const first = points[0];
  const last = points[points.length - 1];
  return `${line} L ${last.x} 170 L ${first.x} 170 Z`;
}

function formatDelta(value) {
  return `${value >= 0 ? "+" : ""}${value}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

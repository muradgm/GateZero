import React, { useMemo } from "react";
import { Badge, Panel, PanelHeading } from "@traderframe/ui";

const dimensionLabels = {
  trend: "Trend",
  market_structure: "Structure",
  momentum: "Momentum",
  liquidity: "Liquidity",
  order_flow: "Order flow",
  macro: "Macro",
  sentiment: "Sentiment",
  correlation: "Correlation",
  event_risk: "Event risk",
  risk: "Risk"
};

export function ConfidenceHeatmap({ candidate }) {
  const dimensions = useMemo(() => buildDimensions(candidate.report.contributions), [candidate]);
  const totals = useMemo(() => summarizeDimensions(dimensions), [dimensions]);

  return (
    <Panel className="confidence-heatmap-panel">
      <PanelHeading
        eyebrow="Confidence anatomy"
        title="Evidence pressure heatmap"
        aside={
          <Badge tone={totals.net >= 0 ? "success" : "warning"}>
            {candidate.report.confidence}
          </Badge>
        }
      />

      <div className="confidence-heatmap-summary">
        <div>
          <span>Supporting pressure</span>
          <strong>+{totals.supporting}</strong>
        </div>
        <div>
          <span>Contradicting pressure</span>
          <strong>−{totals.contradicting}</strong>
        </div>
        <div>
          <span>Net contribution</span>
          <strong>
            {totals.net > 0 ? "+" : ""}
            {totals.net}
          </strong>
        </div>
      </div>

      <div className="confidence-heatmap-grid">
        {dimensions.map((dimension) => (
          <details
            className={`confidence-dimension confidence-dimension--${dimension.tone}`}
            key={dimension.key}
          >
            <summary>
              <div>
                <span>{dimension.label}</span>
                <small>{dimension.status}</small>
              </div>
              <strong>
                {dimension.points > 0 ? "+" : ""}
                {dimension.points}
              </strong>
            </summary>
            <div
              className="confidence-track"
              aria-label={`${dimension.label} confidence ${dimension.strength}%`}
            >
              <span style={{ width: `${dimension.strength}%` }} />
            </div>
            <div className="confidence-dimension__detail">
              {dimension.reasons.map((reason) => (
                <p key={reason}>{reason}</p>
              ))}
              {dimension.limitations.map((limitation) => (
                <small key={limitation}>{limitation}</small>
              ))}
            </div>
          </details>
        ))}
      </div>

      <p className="confidence-heatmap-note">
        Confidence summarizes evidence quality and agreement. It is not a probability of profit and
        does not override risk review.
      </p>
    </Panel>
  );
}

function buildDimensions(contributions) {
  const grouped = new Map();

  for (const contribution of contributions) {
    const current = grouped.get(contribution.dimension) ?? {
      key: contribution.dimension,
      points: 0,
      reasons: [],
      limitations: []
    };
    current.points += contribution.points;
    current.reasons.push(contribution.rationale);
    current.limitations.push(contribution.limitation);
    grouped.set(contribution.dimension, current);
  }

  return [...grouped.values()]
    .map((dimension) => {
      const strength = Math.min(100, Math.round((Math.abs(dimension.points) / 25) * 100));
      const tone =
        dimension.points > 0 ? "positive" : dimension.points < 0 ? "negative" : "neutral";
      const status =
        dimension.points >= 12
          ? "Strong support"
          : dimension.points > 0
            ? "Moderate support"
            : dimension.points <= -12
              ? "Strong contradiction"
              : dimension.points < 0
                ? "Moderate contradiction"
                : "Neutral";
      return {
        ...dimension,
        label: dimensionLabels[dimension.key] ?? dimension.key.replaceAll("_", " "),
        strength,
        tone,
        status
      };
    })
    .sort((a, b) => Math.abs(b.points) - Math.abs(a.points));
}

function summarizeDimensions(dimensions) {
  const supporting = dimensions
    .filter((item) => item.points > 0)
    .reduce((sum, item) => sum + item.points, 0);
  const contradicting = Math.abs(
    dimensions.filter((item) => item.points < 0).reduce((sum, item) => sum + item.points, 0)
  );
  return { supporting, contradicting, net: supporting - contradicting };
}

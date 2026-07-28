import React from "react";
import { Badge, Panel, PanelHeading } from "@traderframe/ui";

export function SimilarSetups({ matches = [] }) {
  return (
    <Panel className="similar-setups-panel">
      <PanelHeading
        eyebrow="Historical analogs"
        title="Similar setups"
        aside={<Badge tone="neutral">{matches.length} local cases</Badge>}
      />
      <div className="similar-setups-list">
        {matches.map((match) => (
          <details className="similar-setup" key={match.caseId}>
            <summary>
              <div>
                <span>
                  {new Date(match.observedAt).toLocaleDateString([], {
                    year: "numeric",
                    month: "short",
                    day: "2-digit"
                  })}
                </span>
                <strong>{match.outcome}</strong>
              </div>
              <div className="similar-setup__score">
                <strong>{match.similarityScore}%</strong>
                <small>
                  {match.resultR === null
                    ? "No simulation"
                    : `${match.resultR > 0 ? "+" : ""}${match.resultR}R`}
                </small>
              </div>
            </summary>
            <div className="similar-setup__body">
              <section>
                <span>Matched</span>
                {match.matchedFeatures.map((feature) => (
                  <p key={feature}>{feature}</p>
                ))}
              </section>
              {match.differingFeatures.length > 0 ? (
                <section>
                  <span>Different</span>
                  {match.differingFeatures.map((feature) => (
                    <p key={feature}>{feature}</p>
                  ))}
                </section>
              ) : null}
              <section className="similar-setup__lesson">
                <span>Lesson</span>
                <p>{match.lesson}</p>
              </section>
              <code>{match.caseId}</code>
            </div>
          </details>
        ))}
      </div>
      <p className="similar-setups-note">
        Similarity is feature overlap, not a performance forecast. Historical outcomes do not
        authorize the current bounded disposition.
      </p>
    </Panel>
  );
}

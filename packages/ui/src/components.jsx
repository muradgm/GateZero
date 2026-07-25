import React from "react";

export function Panel({ as: Element = "section", className = "", children, ...props }) {
  return (
    <Element className={`tf-panel ${className}`.trim()} {...props}>
      {children}
    </Element>
  );
}

export function PanelHeading({ eyebrow, title, aside }) {
  return (
    <div className="tf-panel-heading">
      <div>
        {eyebrow ? <span className="tf-eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
      </div>
      {aside ? <div className="tf-panel-aside">{aside}</div> : null}
    </div>
  );
}

export function Badge({ tone = "neutral", children, className = "" }) {
  return <span className={`tf-badge tf-badge--${tone} ${className}`.trim()}>{children}</span>;
}

export function RecommendationBadge({ value }) {
  const tone = value === "PAPER_SIMULATE" ? "success" : value === "WATCH" ? "warning" : "danger";
  return <Badge tone={tone}>{value.replaceAll("_", " ")}</Badge>;
}

export function Metric({ label, value, emphasis = false }) {
  return (
    <div className={`tf-metric ${emphasis ? "tf-metric--emphasis" : ""}`.trim()}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function WatchlistCard({ candidate, active, onSelect }) {
  return (
    <button
      type="button"
      className={`tf-watchlist-card ${active ? "tf-watchlist-card--active" : ""}`.trim()}
      onClick={onSelect}
    >
      <div className="tf-watchlist-card__topline">
        <span className="tf-rank">#{candidate.rank}</span>
        <span className="tf-watchlist-card__updated">Local snapshot</span>
      </div>
      <div className="tf-watchlist-card__identity">
        <div>
          <strong>{candidate.instrument}</strong>
          <small>{candidate.market} · {candidate.context.session}</small>
        </div>
        <span className="tf-watchlist-card__score">{candidate.report.evidenceScore}</span>
      </div>
      <div className="tf-score-track" aria-label={`Evidence score ${candidate.report.evidenceScore}`}>
        <span style={{ width: `${candidate.report.evidenceScore}%` }} />
      </div>
      <div className="tf-watchlist-card__footer">
        <RecommendationBadge value={candidate.report.recommendation} />
        <span>{candidate.context.trend}</span>
      </div>
    </button>
  );
}

export function EvidenceRow({ contribution }) {
  const positive = contribution.points >= 0;
  const magnitude = Math.min(Math.abs(contribution.points) / 25, 1) * 100;
  return (
    <details className={`tf-evidence-row tf-evidence-row--${positive ? "positive" : "negative"}`}>
      <summary>
        <span>{contribution.label}</span>
        <strong>{positive ? "+" : ""}{contribution.points}</strong>
      </summary>
      <div className="tf-evidence-bar" aria-hidden="true"><span style={{ width: `${magnitude}%` }} /></div>
      <p>{contribution.rationale}</p>
      <small>{contribution.limitation}</small>
      <code>{contribution.evidenceIds.join(" · ")}</code>
    </details>
  );
}

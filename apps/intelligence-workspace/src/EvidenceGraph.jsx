import React, { useMemo, useState } from "react";
import { Badge, Panel, PanelHeading, RecommendationBadge } from "@traderframe/ui";

const positions = {
  context: { x: 8, y: 41 },
  trend: { x: 29, y: 10 },
  structure: { x: 29, y: 25 },
  momentum: { x: 29, y: 40 },
  liquidity: { x: 29, y: 55 },
  macro: { x: 29, y: 70 },
  evidence: { x: 55, y: 41 },
  risk: { x: 76, y: 23 },
  council: { x: 76, y: 58 },
  decision: { x: 94, y: 41 }
};

const edges = [
  ["context", "trend"],
  ["context", "structure"],
  ["context", "momentum"],
  ["context", "liquidity"],
  ["context", "macro"],
  ["trend", "evidence"],
  ["structure", "evidence"],
  ["momentum", "evidence"],
  ["liquidity", "evidence"],
  ["macro", "evidence"],
  ["evidence", "risk"],
  ["evidence", "council"],
  ["risk", "decision"],
  ["council", "decision"]
];

export function EvidenceGraph({ candidate }) {
  const graph = useMemo(() => buildGraph(candidate), [candidate]);
  const [activeId, setActiveId] = useState("decision");
  const active = graph.nodes.find((node) => node.id === activeId) ?? graph.nodes[0];
  const relatedIds = useMemo(() => findRelatedNodes(activeId), [activeId]);

  return (
    <Panel className="evidence-graph-panel">
      <PanelHeading
        eyebrow="Dependency view"
        title="Interactive evidence graph"
        aside={<RecommendationBadge value={candidate.report.recommendation} />}
      />

      <div className="evidence-graph-layout">
        <div className="evidence-graph-canvas" role="group" aria-label="Evidence dependency graph">
          <div className="evidence-graph-flow-label evidence-graph-flow-label--input">Context</div>
          <div className="evidence-graph-flow-label evidence-graph-flow-label--evidence">Evidence</div>
          <div className="evidence-graph-flow-label evidence-graph-flow-label--review">Review</div>
          <div className="evidence-graph-flow-label evidence-graph-flow-label--decision">Decision</div>

          <svg className="evidence-graph-edges" viewBox="0 0 100 82" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <marker id="evidence-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M 0 0 L 8 4 L 0 8 z" />
              </marker>
            </defs>
            {edges.map(([from, to]) => {
              const start = positions[from];
              const end = positions[to];
              const activeEdge = relatedIds.has(from) && relatedIds.has(to);
              const mutedEdge = !activeEdge;
              const midpoint = (start.x + end.x) / 2;
              const path = `M ${start.x} ${start.y} C ${midpoint} ${start.y}, ${midpoint} ${end.y}, ${end.x} ${end.y}`;
              return (
                <path
                  key={`${from}-${to}`}
                  className={`evidence-edge ${activeEdge ? "evidence-edge--active" : ""} ${mutedEdge ? "evidence-edge--muted" : ""}`}
                  d={path}
                  markerEnd="url(#evidence-arrow)"
                />
              );
            })}
          </svg>

          {graph.nodes.map((node) => {
            const position = positions[node.id];
            const isActive = activeId === node.id;
            const isRelated = relatedIds.has(node.id);
            return (
              <button
                type="button"
                key={node.id}
                className={`evidence-node evidence-node--${node.tone} evidence-node--${node.tier} ${isActive ? "evidence-node--active" : ""} ${!isRelated ? "evidence-node--muted" : ""}`}
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
                onClick={() => setActiveId(node.id)}
                aria-pressed={isActive}
              >
                <span>{node.kind}</span>
                <strong>{node.label}</strong>
                <small>{node.value}</small>
                <p>{node.shortSummary}</p>
              </button>
            );
          })}
        </div>

        <aside className="evidence-node-inspector">
          <div className="evidence-node-inspector__heading">
            <div>
              <span>{active.kind}</span>
              <h3>{active.label}</h3>
            </div>
            <Badge tone={active.tone}>{active.value}</Badge>
          </div>
          <p>{active.summary}</p>
          <div className="evidence-node-inspector__path">
            <span>Dependency path</span>
            <strong>{describePath(activeId)}</strong>
          </div>
          <div className="evidence-node-inspector__meta">
            <span>Evidence</span>
            <code>{active.evidence.join(" · ") || "No direct evidence reference"}</code>
          </div>
          <div className="evidence-node-inspector__meta">
            <span>Limitation</span>
            <p>{active.limitation}</p>
          </div>
        </aside>
      </div>

      <p className="evidence-graph-note">
        Select any node to isolate its upstream and downstream dependencies. The graph explains relationships; it does not create execution authority.
      </p>
    </Panel>
  );
}

function findRelatedNodes(activeId) {
  const related = new Set([activeId]);
  let changed = true;
  while (changed) {
    changed = false;
    edges.forEach(([from, to]) => {
      if (to === activeId || related.has(to)) {
        if (!related.has(from)) {
          related.add(from);
          changed = true;
        }
      }
      if (from === activeId || related.has(from)) {
        if (!related.has(to)) {
          related.add(to);
          changed = true;
        }
      }
    });
  }
  return related;
}

function describePath(activeId) {
  const paths = {
    context: "Market context → evidence dimensions → aggregate score → review → decision",
    trend: "Trend → evidence score → risk and council → bounded decision",
    structure: "Structure → evidence score → risk and council → bounded decision",
    momentum: "Momentum → evidence score → risk and council → bounded decision",
    liquidity: "Liquidity → evidence score → risk and council → bounded decision",
    macro: "Macro → evidence score → risk and council → bounded decision",
    evidence: "Evidence dimensions → aggregate score → risk and council → bounded decision",
    risk: "Evidence score → risk review → bounded decision",
    council: "Evidence score → council challenge → bounded decision",
    decision: "All reviewed inputs → bounded decision"
  };
  return paths[activeId] ?? "Reviewed dependency path";
}

function buildGraph(candidate) {
  const report = candidate.report;
  const byDimension = new Map(report.contributions.map((item) => [item.dimension, item]));
  const contribution = (dimension) => byDimension.get(dimension);
  const toneFor = (points = 0) => (points > 0 ? "success" : points < 0 ? "danger" : "neutral");
  const valueFor = (item, fallback) => (item ? `${item.points > 0 ? "+" : ""}${item.points}` : fallback);
  const evidenceFor = (item) => item?.evidenceIds ?? [];
  const nodeFor = (id, label, fallback, shortFallback) => {
    const item = contribution(id);
    return {
      id,
      kind: "Evidence",
      label,
      value: valueFor(item, fallback),
      tone: toneFor(item?.points),
      tier: "secondary",
      shortSummary: item?.rationale ?? shortFallback,
      summary: item?.rationale ?? shortFallback,
      evidence: evidenceFor(item),
      limitation: item?.limitation ?? `No independent ${label.toLowerCase()} contribution was recorded.`
    };
  };

  const risk = contribution("risk");

  return {
    nodes: [
      {
        id: "context",
        kind: "Input",
        label: "Market context",
        value: candidate.context.session,
        tone: "neutral",
        tier: "tertiary",
        shortSummary: `${candidate.context.trend} · ${candidate.context.volatility}`,
        summary: `${candidate.context.trend} trend, ${candidate.context.structure} structure, ${candidate.context.volatility} volatility.`,
        evidence: [],
        limitation: "Context is based on the generated local snapshot rather than a live market feed."
      },
      nodeFor("trend", "Trend", candidate.context.trend, `Trend is ${candidate.context.trend}.`),
      nodeFor("structure", "Structure", candidate.context.structure, `Structure is ${candidate.context.structure}.`),
      nodeFor("momentum", "Momentum", candidate.context.momentum ?? "Neutral", "No independent momentum contribution is present."),
      nodeFor("liquidity", "Liquidity", "Neutral", "No independent liquidity contribution is present."),
      nodeFor("macro", "Macro", "Neutral", "No direct macro contribution is present."),
      {
        id: "evidence",
        kind: "Aggregate",
        label: "Evidence score",
        value: String(report.evidenceScore),
        tone: report.evidenceScore >= 70 ? "success" : report.evidenceScore >= 45 ? "warning" : "danger",
        tier: "primary",
        shortSummary: `${report.contributions.length} traceable inputs`,
        summary: `${report.contributions.length} traceable contributions produce the current bounded score.`,
        evidence: report.contributions.flatMap((item) => item.evidenceIds),
        limitation: "The score is a structured assessment, not a probability of profit."
      },
      {
        id: "risk",
        kind: "Gate",
        label: "Risk review",
        value: valueFor(risk, candidate.risk.amount),
        tone: toneFor(risk?.points),
        tier: "primary",
        shortSummary: `${candidate.risk.amount} / ${candidate.risk.ceiling}`,
        summary: `${candidate.risk.amount} planned loss against a ${candidate.risk.ceiling} ceiling.`,
        evidence: evidenceFor(risk),
        limitation: candidate.invalidation
      },
      {
        id: "council",
        kind: "Challenge",
        label: "Evidence council",
        value: report.downgradeReasons.length ? `${report.downgradeReasons.length} challenge` : "Aligned",
        tone: report.downgradeReasons.length ? "warning" : "success",
        tier: "primary",
        shortSummary: report.downgradeReasons.length ? "Disagreement remains" : "Specialists aligned",
        summary: report.downgradeReasons[0] ?? report.bearCase.summary,
        evidence: report.contributions.flatMap((item) => item.evidenceIds).slice(0, 4),
        limitation: "Specialist perspectives are deterministic and derived from the same local evidence set."
      },
      {
        id: "decision",
        kind: "Output",
        label: "Bounded decision",
        value: report.recommendation.replaceAll("_", " "),
        tone: report.recommendation === "PAPER_SIMULATE" ? "success" : report.recommendation === "WATCH" ? "warning" : "danger",
        tier: "primary",
        shortSummary: "Operator-controlled",
        summary: report.neutralCase.summary,
        evidence: report.contributions.flatMap((item) => item.evidenceIds),
        limitation: "The recommendation is not execution authority and remains operator-controlled."
      }
    ]
  };
}

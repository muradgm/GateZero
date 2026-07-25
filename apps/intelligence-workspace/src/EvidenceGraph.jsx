import React, { useMemo, useState } from "react";
import { Badge, Panel, PanelHeading, RecommendationBadge } from "@traderframe/ui";

const positions = {
  context: { x: 10, y: 34 },
  trend: { x: 31, y: 12 },
  structure: { x: 31, y: 34 },
  macro: { x: 31, y: 56 },
  evidence: { x: 53, y: 34 },
  risk: { x: 73, y: 18 },
  council: { x: 73, y: 50 },
  decision: { x: 92, y: 34 }
};

const edges = [
  ["context", "trend"],
  ["context", "structure"],
  ["context", "macro"],
  ["trend", "evidence"],
  ["structure", "evidence"],
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

  return (
    <Panel className="evidence-graph-panel">
      <PanelHeading
        eyebrow="Dependency view"
        title="Interactive evidence graph"
        aside={<RecommendationBadge value={candidate.report.recommendation} />}
      />

      <div className="evidence-graph-layout">
        <div className="evidence-graph-canvas" role="group" aria-label="Evidence dependency graph">
          <svg className="evidence-graph-edges" viewBox="0 0 100 68" preserveAspectRatio="none" aria-hidden="true">
            {edges.map(([from, to]) => {
              const start = positions[from];
              const end = positions[to];
              const emphasized = from === activeId || to === activeId;
              return (
                <line
                  key={`${from}-${to}`}
                  className={emphasized ? "evidence-edge evidence-edge--active" : "evidence-edge"}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                />
              );
            })}
          </svg>

          {graph.nodes.map((node) => {
            const position = positions[node.id];
            return (
              <button
                type="button"
                key={node.id}
                className={`evidence-node evidence-node--${node.tone} ${activeId === node.id ? "evidence-node--active" : ""}`}
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
                onClick={() => setActiveId(node.id)}
                aria-pressed={activeId === node.id}
              >
                <span>{node.kind}</span>
                <strong>{node.label}</strong>
                <small>{node.value}</small>
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
        The graph visualizes dependencies and disagreement. It does not create execution authority or imply that connected evidence is correct.
      </p>
    </Panel>
  );
}

function buildGraph(candidate) {
  const report = candidate.report;
  const byDimension = new Map(report.contributions.map((item) => [item.dimension, item]));
  const contribution = (dimension) => byDimension.get(dimension);
  const toneFor = (points = 0) => (points > 0 ? "success" : points < 0 ? "danger" : "neutral");
  const valueFor = (item, fallback) => item ? `${item.points > 0 ? "+" : ""}${item.points}` : fallback;
  const evidenceFor = (item) => item?.evidenceIds ?? [];

  const trend = contribution("trend");
  const structure = contribution("structure");
  const macro = contribution("macro");
  const risk = contribution("risk");

  return {
    nodes: [
      {
        id: "context",
        kind: "Input",
        label: "Market context",
        value: candidate.context.session,
        tone: "neutral",
        summary: `${candidate.context.trend} trend, ${candidate.context.structure} structure, ${candidate.context.volatility} volatility.`,
        evidence: [],
        limitation: "Context is based on the generated local snapshot rather than a live market feed."
      },
      {
        id: "trend",
        kind: "Evidence",
        label: "Trend",
        value: valueFor(trend, candidate.context.trend),
        tone: toneFor(trend?.points),
        summary: trend?.rationale ?? `Trend is currently described as ${candidate.context.trend}.`,
        evidence: evidenceFor(trend),
        limitation: trend?.limitation ?? "No independent trend contribution was recorded."
      },
      {
        id: "structure",
        kind: "Evidence",
        label: "Structure",
        value: valueFor(structure, candidate.context.structure),
        tone: toneFor(structure?.points),
        summary: structure?.rationale ?? `Structure is currently described as ${candidate.context.structure}.`,
        evidence: evidenceFor(structure),
        limitation: structure?.limitation ?? "No independent structure contribution was recorded."
      },
      {
        id: "macro",
        kind: "Evidence",
        label: "Macro",
        value: valueFor(macro, "Neutral"),
        tone: toneFor(macro?.points),
        summary: macro?.rationale ?? "No direct macro contribution is present.",
        evidence: evidenceFor(macro),
        limitation: macro?.limitation ?? "Macro context may be incomplete."
      },
      {
        id: "evidence",
        kind: "Aggregate",
        label: "Evidence score",
        value: String(report.evidenceScore),
        tone: report.evidenceScore >= 70 ? "success" : report.evidenceScore >= 45 ? "warning" : "danger",
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
        summary: report.neutralCase.summary,
        evidence: report.contributions.flatMap((item) => item.evidenceIds),
        limitation: "The recommendation is not execution authority and remains operator-controlled."
      }
    ]
  };
}

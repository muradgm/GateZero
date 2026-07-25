import React from "react";
import { Badge, Panel, PanelHeading, RecommendationBadge } from "@traderframe/ui";

export function AIEvidenceCouncil({ candidate }) {
  if (!candidate) return null;

  const report = candidate.report;
  const members = buildCouncil(candidate);
  const disagreementCount = members.filter((member) => member.stance === "Caution" || member.stance === "Reject").length;

  return (
    <Panel className="ai-council-panel">
      <PanelHeading
        eyebrow="Multi-perspective review"
        title="AI Evidence Council"
        aside={<RecommendationBadge value={report.recommendation} />}
      />

      <div className="ai-council-summary">
        <div>
          <span>Evidence</span>
          <strong>{report.evidenceScore}</strong>
        </div>
        <div>
          <span>Confidence</span>
          <strong data-glossary="confidence">{report.confidence}</strong>
        </div>
        <div>
          <span>Challenges</span>
          <strong>{disagreementCount}</strong>
        </div>
      </div>

      <div className="ai-council-grid">
        {members.map((member) => (
          <article className={`ai-council-member ai-council-member--${member.tone}`} key={member.role}>
            <header>
              <div>
                <span>{member.role}</span>
                <strong data-glossary={member.stance}>{member.stance}</strong>
              </div>
              <Badge tone={member.tone}>{member.confidence}%</Badge>
            </header>
            <p>{member.reason}</p>
            <small>{member.limitation}</small>
            <code>{member.evidenceIds.join(" · ") || "No direct evidence reference"}</code>
          </article>
        ))}
      </div>

      <div className="ai-council-verdict">
        <div>
          <span>Consolidated council view</span>
          <strong>{report.recommendation.replaceAll("_", " ")}</strong>
        </div>
        <p>
          This panel exposes specialist disagreement and supporting evidence. It does not create execution authority or override the operator and risk-review gates.
        </p>
      </div>
    </Panel>
  );
}

function buildCouncil(candidate) {
  const report = candidate.report;
  const positive = report.contributions.filter((item) => item.points > 0);
  const negative = report.contributions.filter((item) => item.points < 0);
  const find = (dimension) => report.contributions.find((item) => item.dimension === dimension);
  const macro = find("macro") ?? find("event_risk");
  const risk = find("risk");
  const structure = find("market_structure") ?? find("trend");
  const momentum = find("momentum") ?? find("order_flow");
  const correlation = find("correlation");

  return [
    {
      role: "Market Structure Analyst",
      stance: structure?.points > 0 ? "Bullish" : structure?.points < 0 ? "Bearish" : "Neutral",
      tone: structure?.points > 0 ? "success" : structure?.points < 0 ? "danger" : "neutral",
      confidence: scoreConfidence(structure?.points),
      reason: structure?.rationale ?? report.neutralCase.summary,
      limitation: structure?.limitation ?? "No dedicated structure contribution was recorded.",
      evidenceIds: structure?.evidenceIds ?? []
    },
    {
      role: "Momentum & Flow Analyst",
      stance: momentum?.points > 0 ? "Bullish" : momentum?.points < 0 ? "Caution" : "Neutral",
      tone: momentum?.points > 0 ? "success" : momentum?.points < 0 ? "warning" : "neutral",
      confidence: scoreConfidence(momentum?.points),
      reason: momentum?.rationale ?? "No independent momentum or order-flow contribution was recorded.",
      limitation: momentum?.limitation ?? "Momentum remains inferred from the local evidence snapshot.",
      evidenceIds: momentum?.evidenceIds ?? []
    },
    {
      role: "Macro Analyst",
      stance: macro?.points < 0 ? "Caution" : macro?.points > 0 ? "Supportive" : "Neutral",
      tone: macro?.points < 0 ? "warning" : macro?.points > 0 ? "success" : "neutral",
      confidence: scoreConfidence(macro?.points),
      reason: macro?.rationale ?? "No material macro contribution was recorded.",
      limitation: macro?.limitation ?? "Macro conditions can change after the local snapshot.",
      evidenceIds: macro?.evidenceIds ?? []
    },
    {
      role: "Risk Officer",
      stance: risk?.points < 0 ? "Reject" : risk?.points > 0 ? "Within limit" : "Review",
      tone: risk?.points < 0 ? "danger" : risk?.points > 0 ? "success" : "warning",
      confidence: scoreConfidence(risk?.points),
      reason: risk?.rationale ?? `${candidate.risk.amount} planned loss against a ${candidate.risk.ceiling} ceiling.`,
      limitation: risk?.limitation ?? "Paper-simulation planning only.",
      evidenceIds: risk?.evidenceIds ?? []
    },
    {
      role: "Portfolio Manager",
      stance: correlation?.points < 0 || Number.parseInt(candidate.risk.exposure, 10) >= 18 ? "Caution" : "Acceptable",
      tone: correlation?.points < 0 || Number.parseInt(candidate.risk.exposure, 10) >= 18 ? "warning" : "success",
      confidence: scoreConfidence(correlation?.points ?? (Number.parseInt(candidate.risk.exposure, 10) >= 18 ? -7 : 7)),
      reason: correlation?.rationale ?? `${candidate.risk.exposure} projected post-setup exposure.`,
      limitation: correlation?.limitation ?? "Portfolio exposure is based on the generated local snapshot.",
      evidenceIds: correlation?.evidenceIds ?? []
    },
    {
      role: "Devil's Advocate",
      stance: negative.length ? "Challenge" : "Clear",
      tone: negative.length ? "warning" : "success",
      confidence: Math.min(95, 55 + negative.length * 9),
      reason: report.downgradeReasons[0] ?? report.bearCase.summary,
      limitation: report.bearCase.limitations[0] ?? "Contradicting evidence must remain visible.",
      evidenceIds: negative.flatMap((item) => item.evidenceIds).slice(0, 4)
    }
  ];
}

function scoreConfidence(points = 0) {
  return Math.max(35, Math.min(95, 55 + Math.round(Math.abs(points) * 1.8)));
}

import React, { useMemo } from "react";
import { Badge, Panel, PanelHeading } from "@traderframe/ui";

export function DecisionMemory({ candidate }) {
  const memory = useMemo(() => buildMemory(candidate), [candidate]);

  return (
    <Panel className="decision-memory-panel">
      <PanelHeading
        eyebrow="Learning loop"
        title="Decision memory"
        aside={<Badge tone="neutral">{memory.caseCount} local cases</Badge>}
      />

      <div className="decision-memory-summary">
        <div>
          <span>Positive paper outcomes</span>
          <strong>{memory.positiveCount}</strong>
        </div>
        <div>
          <span>Negative paper outcomes</span>
          <strong>{memory.negativeCount}</strong>
        </div>
        <div>
          <span>Average similarity</span>
          <strong>{memory.averageSimilarity}%</strong>
        </div>
        <div>
          <span>Recurring lessons</span>
          <strong>{memory.lessons.length}</strong>
        </div>
      </div>

      <div className="decision-memory-grid">
        <section>
          <span className="decision-memory-label">Recurring lessons</span>
          <div className="decision-memory-list">
            {memory.lessons.map((lesson) => (
              <article key={lesson.text}>
                <strong>{lesson.count}×</strong>
                <p>{lesson.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <span className="decision-memory-label">Repeated evidence patterns</span>
          <div className="decision-memory-patterns">
            {memory.patterns.map((pattern) => (
              <div key={pattern.label}>
                <span>{pattern.label}</span>
                <div>
                  <i style={{ width: `${pattern.share}%` }} />
                </div>
                <strong>
                  {pattern.count}/{memory.caseCount}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section className="decision-memory-warning">
          <span className="decision-memory-label">Current caution</span>
          <strong>{memory.caution}</strong>
          <p>
            Decision memory summarizes local paper-simulation records. It does not predict the next
            outcome or override current evidence, risk review, or operator judgment.
          </p>
        </section>
      </div>
    </Panel>
  );
}

function buildMemory(candidate) {
  const matches = candidate.similarSetups ?? [];
  const positiveCount = matches.filter(
    (match) => typeof match.resultR === "number" && match.resultR > 0
  ).length;
  const negativeCount = matches.filter(
    (match) => typeof match.resultR === "number" && match.resultR < 0
  ).length;
  const averageSimilarity = matches.length
    ? Math.round(matches.reduce((sum, match) => sum + match.similarityScore, 0) / matches.length)
    : 0;

  const lessonCounts = new Map();
  for (const match of matches) {
    const lesson = match.lesson?.trim();
    if (!lesson) continue;
    lessonCounts.set(lesson, (lessonCounts.get(lesson) ?? 0) + 1);
  }

  const lessons = [...lessonCounts.entries()]
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text))
    .slice(0, 4);

  const patternCounts = new Map();
  for (const match of matches) {
    for (const feature of match.matchedFeatures ?? []) {
      const label = normalizeFeature(feature);
      patternCounts.set(label, (patternCounts.get(label) ?? 0) + 1);
    }
  }

  const patterns = [...patternCounts.entries()]
    .map(([label, count]) => ({
      label,
      count,
      share: matches.length ? Math.round((count / matches.length) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 6);

  const caution =
    candidate.report.downgradeReasons?.[0] ??
    candidate.report.bearCase?.summary ??
    "No recurring caution was recorded.";

  return {
    caseCount: matches.length,
    positiveCount,
    negativeCount,
    averageSimilarity,
    lessons,
    patterns,
    caution
  };
}

function normalizeFeature(feature) {
  const [name] = String(feature).split(":");
  return name.trim().replaceAll("_", " ");
}

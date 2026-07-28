import React, { useEffect, useMemo, useState } from "react";
import { Badge, Panel, PanelHeading, RecommendationBadge } from "@traderframe/ui";

const statuses = [
  { value: "PLANNED", label: "Planned" },
  { value: "OBSERVING", label: "Observing" },
  { value: "INVALIDATED", label: "Invalidated" },
  { value: "COMPLETED", label: "Completed" },
  { value: "SKIPPED", label: "Skipped" }
];

const emptyDraft = {
  status: "PLANNED",
  resultR: "",
  triggerObserved: false,
  invalidationRespected: true,
  riskWithinPlan: true,
  observation: "",
  lesson: ""
};

export function OperatorJournal({ candidate }) {
  const storageKey = useMemo(() => `traderframe:operator-journal:${candidate.id}`, [candidate.id]);
  const [entries, setEntries] = useState([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    setDraft(emptyDraft);
    setSavedAt(null);
    try {
      const stored = window.localStorage.getItem(storageKey);
      setEntries(stored ? JSON.parse(stored) : []);
    } catch {
      setEntries([]);
    }
  }, [storageKey]);

  const instrument = candidate.instrument ?? candidate.report?.instrument ?? candidate.id;
  const completed = entries.filter((entry) => entry.status === "COMPLETED");
  const averageR = completed.length
    ? completed.reduce((sum, entry) => sum + (Number(entry.resultR) || 0), 0) / completed.length
    : null;

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function saveEntry(event) {
    event.preventDefault();
    const entry = {
      id: `${candidate.id}-${Date.now()}`,
      candidateId: candidate.id,
      instrument,
      recommendation: candidate.report.recommendation,
      evidenceScore: candidate.report.evidenceScore,
      status: draft.status,
      resultR: draft.resultR === "" ? null : Number(draft.resultR),
      triggerObserved: draft.triggerObserved,
      invalidationRespected: draft.invalidationRespected,
      riskWithinPlan: draft.riskWithinPlan,
      observation: draft.observation.trim(),
      lesson: draft.lesson.trim(),
      recordedAt: new Date().toISOString()
    };

    const nextEntries = [entry, ...entries].slice(0, 20);
    setEntries(nextEntries);
    setDraft(emptyDraft);
    setSavedAt(entry.recordedAt);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextEntries));
    } catch {
      // The journal remains usable for the current session if storage is unavailable.
    }
  }

  function clearHistory() {
    setEntries([]);
    setSavedAt(null);
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Ignore unavailable storage.
    }
  }

  return (
    <Panel className="operator-journal-panel">
      <PanelHeading
        eyebrow="Local review loop"
        title="Operator outcome journal"
        aside={<RecommendationBadge value={candidate.report.recommendation} />}
      />

      <div className="operator-journal-summary">
        <div>
          <span>Instrument</span>
          <strong>{instrument}</strong>
        </div>
        <div>
          <span>Recorded reviews</span>
          <strong>{entries.length}</strong>
        </div>
        <div>
          <span>Completed paper average</span>
          <strong>
            {averageR === null ? "—" : `${averageR >= 0 ? "+" : ""}${averageR.toFixed(2)}R`}
          </strong>
        </div>
        <div>
          <span>Current evidence index</span>
          <strong>{candidate.report.evidenceScore}</strong>
        </div>
      </div>

      <div className="operator-journal-layout">
        <form className="operator-journal-form" onSubmit={saveEntry}>
          <label>
            <span>Review status</span>
            <select
              value={draft.status}
              onChange={(event) => updateDraft("status", event.target.value)}
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Paper outcome in R</span>
            <input
              type="number"
              step="0.1"
              inputMode="decimal"
              value={draft.resultR}
              onChange={(event) => updateDraft("resultR", event.target.value)}
              placeholder="Example: 1.5 or -1"
            />
          </label>

          <div className="operator-journal-checks">
            <JournalCheck
              label="Trigger observed"
              checked={draft.triggerObserved}
              onChange={(checked) => updateDraft("triggerObserved", checked)}
            />
            <JournalCheck
              label="Invalidation respected"
              checked={draft.invalidationRespected}
              onChange={(checked) => updateDraft("invalidationRespected", checked)}
            />
            <JournalCheck
              label="Risk stayed within plan"
              checked={draft.riskWithinPlan}
              onChange={(checked) => updateDraft("riskWithinPlan", checked)}
            />
          </div>

          <label className="operator-journal-wide-field">
            <span>What happened?</span>
            <textarea
              rows="3"
              value={draft.observation}
              onChange={(event) => updateDraft("observation", event.target.value)}
              placeholder="Record the observed sequence, blocker, or reason the setup changed."
            />
          </label>

          <label className="operator-journal-wide-field">
            <span>Lesson to remember</span>
            <textarea
              rows="3"
              value={draft.lesson}
              onChange={(event) => updateDraft("lesson", event.target.value)}
              placeholder="Write a reusable lesson for future similar setups."
            />
          </label>

          <div className="operator-journal-actions">
            <button type="submit">Save local review</button>
            {savedAt ? <span>Saved {formatTimestamp(savedAt)}</span> : null}
          </div>
        </form>

        <section className="operator-journal-history" aria-label="Recent operator reviews">
          <div className="operator-journal-history__heading">
            <div>
              <span>Decision memory input</span>
              <h3>Recent reviews</h3>
            </div>
            {entries.length ? (
              <button type="button" onClick={clearHistory}>
                Clear
              </button>
            ) : null}
          </div>

          {entries.length ? (
            <div className="operator-journal-entry-list">
              {entries.map((entry) => (
                <article className="operator-journal-entry" key={entry.id}>
                  <div className="operator-journal-entry__heading">
                    <div>
                      <strong>{formatStatus(entry.status)}</strong>
                      <span>{formatTimestamp(entry.recordedAt)}</span>
                    </div>
                    <Badge tone={toneForEntry(entry)}>{formatResult(entry.resultR)}</Badge>
                  </div>
                  <div className="operator-journal-entry__checks">
                    <span>
                      {entry.triggerObserved ? "Trigger observed" : "Trigger not observed"}
                    </span>
                    <span>
                      {entry.invalidationRespected
                        ? "Invalidation respected"
                        : "Invalidation breached"}
                    </span>
                    <span>{entry.riskWithinPlan ? "Risk within plan" : "Risk outside plan"}</span>
                  </div>
                  {entry.observation ? <p>{entry.observation}</p> : null}
                  {entry.lesson ? (
                    <div className="operator-journal-entry__lesson">
                      <span>Lesson</span>
                      <p>{entry.lesson}</p>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="operator-journal-empty">
              <strong>No local reviews yet.</strong>
              <p>Record a paper-simulation observation to create operator-owned decision memory.</p>
            </div>
          )}
        </section>
      </div>

      <p className="operator-journal-note">
        Reviews are stored only in this browser. They do not place orders, modify repository
        evidence, or authorize execution.
      </p>
    </Panel>
  );
}

function JournalCheck({ label, checked, onChange }) {
  return (
    <label className="operator-journal-check">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

function formatStatus(value) {
  return statuses.find((status) => status.value === value)?.label ?? value;
}

function formatResult(value) {
  if (value === null || !Number.isFinite(Number(value))) return "No R result";
  const number = Number(value);
  return `${number >= 0 ? "+" : ""}${number.toFixed(2)}R`;
}

function toneForEntry(entry) {
  if (entry.status === "INVALIDATED" || Number(entry.resultR) < 0) return "danger";
  if (entry.status === "COMPLETED" && Number(entry.resultR) > 0) return "success";
  if (entry.status === "OBSERVING" || entry.status === "PLANNED") return "warning";
  return "neutral";
}

function formatTimestamp(value) {
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

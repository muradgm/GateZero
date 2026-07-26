import React, { useEffect, useMemo, useState } from "react";
import { AIEvidenceCouncil } from "./AIEvidenceCouncil.jsx";
import { ConfidenceChange } from "./ConfidenceChange.jsx";
import { ConfidenceHeatmap } from "./ConfidenceHeatmap.jsx";
import { DecisionMemory } from "./DecisionMemory.jsx";
import { DecisionReplay } from "./DecisionReplay.jsx";
import { EvidenceGraph } from "./EvidenceGraph.jsx";
import { OperatorJournal } from "./OperatorJournal.jsx";
import { SimilarSetups } from "./SimilarSetups.jsx";

const tools = [
  { id: "council", label: "Council" },
  { id: "replay", label: "Replay" },
  { id: "confidence", label: "Evidence map" },
  { id: "changes", label: "Evidence changes" },
  { id: "memory", label: "Decision memory" },
  { id: "journal", label: "Outcome journal" },
  { id: "similar", label: "Similar setups" },
  { id: "graph", label: "Evidence graph" }
];

const validToolIds = new Set(tools.map((tool) => tool.id));

export function IntelligenceTools({ candidate }) {
  const [open, setOpen] = useState(false);
  const [activeTool, setActiveTool] = useState("council");

  useEffect(() => {
    function handleOpenTool(event) {
      const requestedTool = event.detail?.tool;
      if (!validToolIds.has(requestedTool)) return;
      setActiveTool(requestedTool);
      setOpen(true);
    }

    window.addEventListener("traderframe:open-intelligence-tool", handleOpenTool);
    return () => window.removeEventListener("traderframe:open-intelligence-tool", handleOpenTool);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("intelligence-tools-open");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("intelligence-tools-open");
    };
  }, [open]);

  const activeLabel = useMemo(
    () => tools.find((tool) => tool.id === activeTool)?.label ?? "Council",
    [activeTool]
  );

  function renderTool() {
    switch (activeTool) {
      case "replay":
        return <DecisionReplay candidate={candidate} />;
      case "confidence":
        return <ConfidenceHeatmap candidate={candidate} />;
      case "changes":
        return <ConfidenceChange candidate={candidate} />;
      case "memory":
        return <DecisionMemory candidate={candidate} />;
      case "journal":
        return <OperatorJournal candidate={candidate} />;
      case "similar":
        return <SimilarSetups matches={candidate.similarSetups ?? []} />;
      case "graph":
        return <EvidenceGraph candidate={candidate} />;
      case "council":
      default:
        return <AIEvidenceCouncil candidate={candidate} />;
    }
  }

  return (
    <>
      <button
        type="button"
        className="intelligence-tools-launcher"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>Analysis workspace</span>
        <strong>Intelligence Tools</strong>
        <small>8 views</small>
      </button>

      {open ? (
        <div
          className="intelligence-tools-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Intelligence tools"
        >
          <button
            type="button"
            className="intelligence-tools-modal__backdrop"
            aria-label="Close intelligence tools"
            onClick={() => setOpen(false)}
          />

          <section className="intelligence-tools-modal__surface">
            <header className="intelligence-tools-header">
              <div>
                <span>TraderFrame analysis</span>
                <h2>{activeLabel}</h2>
              </div>
              <button
                type="button"
                className="intelligence-tools-close"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </header>

            <nav className="intelligence-tools-tabs" aria-label="Intelligence tool views">
              {tools.map((tool) => (
                <button
                  type="button"
                  key={tool.id}
                  className={
                    tool.id === activeTool
                      ? "intelligence-tool-tab intelligence-tool-tab--active"
                      : "intelligence-tool-tab"
                  }
                  onClick={() => setActiveTool(tool.id)}
                  aria-pressed={tool.id === activeTool}
                >
                  {tool.label}
                </button>
              ))}
            </nav>

            <div className="intelligence-tools-content">{renderTool()}</div>
          </section>
        </div>
      ) : null}
    </>
  );
}

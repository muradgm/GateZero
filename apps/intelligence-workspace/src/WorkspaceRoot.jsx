import React, { useEffect, useMemo, useState } from "react";
import { AIEvidenceCouncil } from "./AIEvidenceCouncil.jsx";
import { AppRuntime } from "./AppRuntime.jsx";
import { ConfidenceHeatmap } from "./ConfidenceHeatmap.jsx";
import { DecisionReplay } from "./DecisionReplay.jsx";
import { GlossaryLayer } from "./GlossaryLayer.jsx";
import { SimilarSetups } from "./SimilarSetups.jsx";

export function WorkspaceRoot() {
  const [workspace, setWorkspace] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let active = true;

    fetch("/runtime/workspace-data.json", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("workspace data unavailable");
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        setWorkspace(data);
        setSelectedId(data.candidates?.[0]?.id ?? null);
      })
      .catch(() => {
        if (active) setWorkspace(null);
      });

    function handleCandidateSelected(event) {
      setSelectedId(event.detail?.id ?? null);
    }

    window.addEventListener("traderframe:candidate-selected", handleCandidateSelected);
    return () => {
      active = false;
      window.removeEventListener("traderframe:candidate-selected", handleCandidateSelected);
    };
  }, []);

  const selected = useMemo(() => {
    if (!workspace) return null;
    return workspace.candidates.find((candidate) => candidate.id === selectedId) ?? workspace.candidates[0] ?? null;
  }, [workspace, selectedId]);

  return (
    <>
      <AppRuntime />
      {selected ? (
        <>
          <div className="workspace-confidence-dock">
            <ConfidenceHeatmap candidate={selected} />
          </div>
          <div className="workspace-replay-dock">
            <DecisionReplay candidate={selected} />
          </div>
          <div className="workspace-council-dock">
            <AIEvidenceCouncil candidate={selected} />
          </div>
          <div className="workspace-history-dock">
            <SimilarSetups matches={selected.similarSetups ?? []} />
          </div>
        </>
      ) : null}
      <GlossaryLayer />
    </>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { AppRuntime } from "./AppRuntime.jsx";
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
        <div className="workspace-history-dock">
          <SimilarSetups matches={selected.similarSetups ?? []} />
        </div>
      ) : null}
    </>
  );
}

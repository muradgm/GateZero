import React, { useEffect, useState } from "react";
import { EvidenceGraph } from "./EvidenceGraph.jsx";

export function EvidenceGraphLauncher({ candidate }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="evidence-graph-launcher"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>Dependency view</span>
        <strong>Evidence Graph</strong>
      </button>

      {open ? (
        <div className="evidence-graph-modal" role="dialog" aria-modal="true" aria-label="Interactive evidence graph">
          <button
            type="button"
            className="evidence-graph-modal__backdrop"
            aria-label="Close evidence graph"
            onClick={() => setOpen(false)}
          />
          <div className="evidence-graph-modal__surface">
            <button type="button" className="evidence-graph-modal__close" onClick={() => setOpen(false)}>
              Close
            </button>
            <EvidenceGraph candidate={candidate} />
          </div>
        </div>
      ) : null}
    </>
  );
}

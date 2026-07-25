import React, { useEffect, useState } from "react";

const glossary = [
  {
    term: "Paper Simulate",
    aliases: ["paper simulate", "paper_simulate"],
    definition:
      "The setup may proceed only to a local, non-executing simulation after evidence and risk review. It is not permission to place a live order."
  },
  {
    term: "Bullish",
    aliases: ["bullish"],
    definition:
      "The reviewed evidence currently favors upward price pressure or constructive market structure. It is a directional assessment, not a guaranteed outcome."
  },
  {
    term: "Bearish",
    aliases: ["bearish"],
    definition:
      "The reviewed evidence currently favors downward price pressure or weakening market structure. It is a directional assessment, not a guaranteed outcome."
  },
  {
    term: "Neutral",
    aliases: ["neutral"],
    definition:
      "The evidence does not support a strong directional conclusion, or important signals disagree. The default response is to wait for clearer evidence."
  },
  {
    term: "Pullback",
    aliases: ["pullback"],
    definition:
      "A temporary move against the prevailing trend. A pullback may create a review opportunity, but it can also develop into a full reversal."
  },
  {
    term: "Volatility",
    aliases: ["volatility", "elevated", "event risk"],
    definition:
      "The speed and magnitude of price movement. Higher volatility increases uncertainty, slippage risk, and the distance required for defensible invalidation."
  },
  {
    term: "Watch",
    aliases: ["watch"],
    definition:
      "The setup remains under observation because evidence, timing, or risk conditions are incomplete. No paper simulation or live action is authorized."
  },
  {
    term: "Reject",
    aliases: ["reject"],
    definition:
      "The current setup fails one or more required evidence, context, or risk conditions. It must be materially reassessed before it can re-enter review."
  },
  {
    term: "Confidence",
    aliases: ["confidence", "high", "medium", "low"],
    definition:
      "A bounded expression of evidence quality and agreement. It is not a probability of profit and does not override risk controls."
  },
  {
    term: "Evidence",
    aliases: ["evidence"],
    definition:
      "Traceable observations, records, or analyses used to support or contradict a setup. Evidence must remain inspectable and tied to limitations."
  },
  {
    term: "Risk Review",
    aliases: ["risk review"],
    definition:
      "A required check of planned loss, invalidation, exposure, and portfolio impact before a setup can progress toward paper simulation."
  },
  {
    term: "Invalidation",
    aliases: ["invalidation", "invalid"],
    definition:
      "The explicit condition that proves the setup thesis is no longer valid. A setup without defensible invalidation should not progress."
  }
];

const eligibleSelector = "[data-glossary], span, strong, small, p, h1, h2, h3, button, code";

export function GlossaryLayer() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    function resolveEntry(target) {
      const element = target.closest?.(eligibleSelector);
      if (!element) return null;

      const explicit = element.dataset?.glossary;
      const text = (explicit || element.textContent || "").trim().replaceAll("_", " ").toLowerCase();
      if (!text || text.length > 80) return null;

      return glossary.find((entry) =>
        entry.aliases.some((alias) => text === alias || text.includes(alias))
      );
    }

    function show(event) {
      const entry = resolveEntry(event.target);
      if (!entry) {
        setActive(null);
        return;
      }
      setActive({ entry, x: event.clientX, y: event.clientY });
    }

    function move(event) {
      setActive((current) => (current ? { ...current, x: event.clientX, y: event.clientY } : current));
    }

    function hide() {
      setActive(null);
    }

    document.addEventListener("mouseover", show);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseout", hide);
    document.addEventListener("focusin", show);
    document.addEventListener("focusout", hide);

    return () => {
      document.removeEventListener("mouseover", show);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseout", hide);
      document.removeEventListener("focusin", show);
      document.removeEventListener("focusout", hide);
    };
  }, []);

  if (!active) return null;

  const left = Math.min(active.x + 16, window.innerWidth - 340);
  const top = Math.min(active.y + 18, window.innerHeight - 170);

  return (
    <aside
      className="glossary-dialog"
      role="dialog"
      aria-label={`${active.entry.term} definition`}
      style={{ left: Math.max(12, left), top: Math.max(12, top) }}
    >
      <span>Trading glossary</span>
      <strong>{active.entry.term}</strong>
      <p>{active.entry.definition}</p>
    </aside>
  );
}

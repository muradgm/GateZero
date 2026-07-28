import React, { useEffect, useMemo, useRef, useState } from "react";

const toolCommands = [
  {
    id: "tool-council",
    label: "Open Evidence Council",
    detail: "Specialist disagreement and consolidated evidence challenge",
    tool: "council",
    shortcut: "C"
  },
  {
    id: "tool-replay",
    label: "Open Decision Replay",
    detail: "Reconstruct the reviewed decision path",
    tool: "replay",
    shortcut: "R"
  },
  {
    id: "tool-confidence",
    label: "Open Confidence Heatmap",
    detail: "Inspect support and contradiction by dimension",
    tool: "confidence",
    shortcut: "H"
  },
  {
    id: "tool-changes",
    label: "Open Evidence Index Changes",
    detail: "Explain how evidence constructed the evidence index",
    tool: "changes"
  },
  {
    id: "tool-memory",
    label: "Open Decision Memory",
    detail: "Review recurring lessons and failure patterns",
    tool: "memory",
    shortcut: "M"
  },
  {
    id: "tool-journal",
    label: "Open Outcome Journal",
    detail: "Record the paper-simulation outcome and lesson",
    tool: "journal",
    shortcut: "J"
  },
  {
    id: "tool-similar",
    label: "Open Similar Setups",
    detail: "Compare local historical analogs",
    tool: "similar",
    shortcut: "S"
  },
  {
    id: "tool-graph",
    label: "Open Evidence Graph",
    detail: "Explore dependencies between evidence and bounded disposition",
    tool: "graph",
    shortcut: "G"
  }
];

const shortcutMap = new Map(
  toolCommands
    .filter((command) => command.shortcut)
    .map((command) => [command.shortcut.toLowerCase(), command])
);

export function CommandPalette({ workspace, selectedId }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  const commands = useMemo(() => {
    const candidates = (workspace?.candidates ?? []).map((candidate, index) => ({
      id: `candidate-${candidate.id}`,
      label: `Select ${candidate.instrument}`,
      detail: `${candidate.market} · ${candidate.report.recommendation.replaceAll("_", " ")} · evidence index ${candidate.report.evidenceScore}`,
      candidateId: candidate.id,
      rank: index + 1,
      selected: candidate.id === selectedId
    }));

    const all = [...toolCommands, ...candidates];
    const normalized = query.trim().toLowerCase();
    if (!normalized) return all;
    return all.filter((command) =>
      `${command.label} ${command.detail}`.toLowerCase().includes(normalized)
    );
  }, [query, selectedId, workspace]);

  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target;
      const typing =
        target instanceof window.HTMLElement &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }

      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (!open && !typing && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const shortcut = shortcutMap.get(event.key.toLowerCase());
        if (shortcut) {
          event.preventDefault();
          execute(shortcut);
          return;
        }
        if (event.key === "?") {
          event.preventDefault();
          setOpen(true);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    setQuery("");
    setActiveIndex(0);
    document.body.classList.add("command-palette-open");
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.classList.remove("command-palette-open");
    };
  }, [open]);

  useEffect(() => {
    if (activeIndex >= commands.length) setActiveIndex(Math.max(0, commands.length - 1));
  }, [activeIndex, commands.length]);

  function execute(command) {
    if (command.tool) {
      window.dispatchEvent(
        new CustomEvent("traderframe:open-intelligence-tool", { detail: { tool: command.tool } })
      );
    }
    if (command.candidateId) {
      window.dispatchEvent(
        new CustomEvent("traderframe:candidate-selected", { detail: { id: command.candidateId } })
      );
    }
    setOpen(false);
  }

  function handleInputKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, commands.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && commands[activeIndex]) {
      event.preventDefault();
      execute(commands[activeIndex]);
    }
  }

  return (
    <>
      <button
        type="button"
        className="command-palette-launcher"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <span>Search or open a review view</span>
        <kbd>Ctrl K</kbd>
      </button>

      {open ? (
        <div
          className="command-palette"
          role="dialog"
          aria-modal="true"
          aria-label="TraderFrame command palette"
        >
          <button
            type="button"
            className="command-palette__backdrop"
            aria-label="Close command palette"
            onClick={() => setOpen(false)}
          />
          <section className="command-palette__surface">
            <header className="command-palette__search">
              <span aria-hidden="true">›</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Search instruments, views, evidence, risk…"
                aria-label="Search commands"
              />
              <kbd>Esc</kbd>
            </header>

            <div
              className="command-palette__results"
              role="listbox"
              aria-label="Available commands"
            >
              {commands.length ? (
                commands.map((command, index) => (
                  <button
                    type="button"
                    key={command.id}
                    className={
                      index === activeIndex
                        ? "command-palette__item command-palette__item--active"
                        : "command-palette__item"
                    }
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => execute(command)}
                    role="option"
                    aria-selected={index === activeIndex}
                  >
                    <span>
                      <strong>{command.label}</strong>
                      <small>{command.detail}</small>
                    </span>
                    <span className="command-palette__meta">
                      {command.selected ? <em>Selected</em> : null}
                      {command.shortcut ? <kbd>{command.shortcut}</kbd> : null}
                      {command.rank ? <kbd>#{command.rank}</kbd> : null}
                    </span>
                  </button>
                ))
              ) : (
                <div className="command-palette__empty">No matching command.</div>
              )}
            </div>

            <footer className="command-palette__footer">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> Navigate
              </span>
              <span>
                <kbd>Enter</kbd> Open
              </span>
              <span>
                <kbd>?</kbd> Open palette
              </span>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}

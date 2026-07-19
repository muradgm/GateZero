import { useMemo, useRef, useState } from "react";

type OperatorEvidenceControlProps = {
  active: boolean;
  resolved: boolean;
  onResolve: () => void;
};

type Point = { x: number; y: number };

const initialPosition: Point = { x: 34, y: 72 };

export function OperatorEvidenceControl({
  active,
  resolved,
  onResolve
}: OperatorEvidenceControlProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const fragmentRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<Point>(initialPosition);
  const [dragging, setDragging] = useState(false);
  const [nearTarget, setNearTarget] = useState(false);

  const hidden = !active || resolved;
  const status = useMemo(
    () => (nearTarget ? "Release to complete evidence" : "Drag missing evidence into operator review"),
    [nearTarget]
  );

  function updateFromPointer(clientX: number, clientY: number) {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const bounds = overlay.getBoundingClientRect();
    const x = Math.max(24, Math.min(bounds.width - 24, clientX - bounds.left));
    const y = Math.max(24, Math.min(bounds.height - 24, clientY - bounds.top));
    setPosition({ x, y });

    const targetX = bounds.width * 0.72;
    const targetY = bounds.height * 0.5;
    setNearTarget(Math.hypot(x - targetX, y - targetY) < 72);
  }

  function reset() {
    setPosition(initialPosition);
    setNearTarget(false);
    setDragging(false);
  }

  return (
    <div
      ref={overlayRef}
      className={`operator-evidence${hidden ? " is-hidden" : ""}`}
      aria-hidden={hidden}
    >
      <div className={`operator-target${nearTarget ? " is-ready" : ""}`}>
        <span>Operator review</span>
        <strong>Place evidence</strong>
      </div>

      <button
        ref={fragmentRef}
        type="button"
        className={`evidence-fragment${dragging ? " is-dragging" : ""}`}
        style={{ left: position.x, top: position.y }}
        aria-label="Missing market context. Drag into operator review or press Enter to place it."
        onPointerDown={(event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
          updateFromPointer(event.clientX, event.clientY);
        }}
        onPointerMove={(event) => {
          if (!dragging) return;
          updateFromPointer(event.clientX, event.clientY);
        }}
        onPointerUp={(event) => {
          if (!dragging) return;
          event.currentTarget.releasePointerCapture(event.pointerId);
          if (nearTarget) onResolve();
          else reset();
        }}
        onPointerCancel={reset}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onResolve();
          }
        }}
      >
        <span>Missing evidence</span>
        <strong>Market context</strong>
        <em>Operator supplied</em>
      </button>

      <p className="operator-instruction" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

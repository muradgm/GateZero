import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { productState } from "@gatezero/product-state";
import { useEffect, useMemo, useState } from "react";
import { experienceStages, type ExperienceStageId } from "./engine/stages";
import { IntelligencePlayground } from "./playground/IntelligencePlayground";
import { IntelligenceRendLab } from "./playground/IntelligenceRndLab";
import { LandscapePlayground } from "./playground/LandscapePlayground";
import { EvidenceMachine } from "./scenes/EvidenceMachine";
import { OperatorEvidenceControl } from "./ui/OperatorEvidenceControl";
import { ProductWorkspace } from "./ui/ProductWorkspace";

type ExperienceMode = "rnd" | "landscape" | "intelligence" | "legacy";

export default function App() {
  const [mode, setMode] = useState<ExperienceMode>("rnd");
  const [stage, setStage] = useState<ExperienceStageId>("signal");
  const [autoPlay, setAutoPlay] = useState(true);
  const [evidenceResolved, setEvidenceResolved] = useState(false);
  const reducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const stageIndex = experienceStages.findIndex((item) => item.id === stage);
  const operatorIndex = experienceStages.findIndex((item) => item.id === "operator");
  const current = experienceStages[stageIndex];
  const interfaceActive = stage === "interface";
  const operatorActive = stage === "operator";

  useEffect(() => {
    if (mode !== "legacy" || !autoPlay || reducedMotion) return;
    const timer = window.setInterval(() => {
      setStage((currentStage) => {
        const currentIndex = experienceStages.findIndex((item) => item.id === currentStage);
        if (currentStage === "operator" && !evidenceResolved) return currentStage;
        return experienceStages[(currentIndex + 1) % experienceStages.length].id;
      });
    }, 3200);
    return () => window.clearInterval(timer);
  }, [autoPlay, evidenceResolved, mode, reducedMotion]);

  useEffect(() => {
    if (operatorActive && !evidenceResolved) setAutoPlay(false);
  }, [operatorActive, evidenceResolved]);

  function resolveEvidence() {
    if (evidenceResolved) return;
    setEvidenceResolved(true);
    setAutoPlay(false);
    window.setTimeout(() => setStage("record"), reducedMotion ? 0 : 850);
  }

  return (
    <>
      <nav className="experience-mode-switch" aria-label="Experience development modes">
        <button type="button" className={mode === "rnd" ? "active" : ""} onClick={() => setMode("rnd")}>R&amp;D lab</button>
        <button type="button" className={mode === "landscape" ? "active" : ""} onClick={() => setMode("landscape")}>Landscape engine</button>
        <button type="button" className={mode === "intelligence" ? "active" : ""} onClick={() => setMode("intelligence")}>Intelligence engine</button>
        <button type="button" className={mode === "legacy" ? "active" : ""} onClick={() => setMode("legacy")}>Evidence Gate archive</button>
      </nav>

      {mode === "rnd" ? (
        <main><IntelligenceRendLab /></main>
      ) : mode === "landscape" ? (
        <main><LandscapePlayground /></main>
      ) : mode === "intelligence" ? (
        <main><IntelligencePlayground /></main>
      ) : (
        <main>
          <section className="hero">
            <div className="copy">
              <p className="eyebrow">TraderFrame / Evidence Gate</p>
              <h1>Frame the evidence. <span>Control the decision.</span></h1>
              <p className="lede">A real-time decision-governance experience where fragmented signals become a bounded, risk-gated, operator-owned record.</p>
              <div className="boundary">{productState.wedge}</div>
              <dl>
                <div><dt>Current gate</dt><dd>{productState.id}</dd></div>
                <div><dt>Mode</dt><dd>{productState.publicLabel}</dd></div>
                <div><dt>Execution</dt><dd>Locked</dd></div>
              </dl>
            </div>

            <div className={`experience-shell${interfaceActive ? " interface-active" : ""}`}>
              <div className="scene" aria-label="Interactive three-dimensional Evidence Gate prototype">
                <div className="scene-canvas">
                  <Canvas camera={{ position: [0.55, 0.25, 11.8], fov: 31 }} dpr={[1, 1.5]}>
                    <color attach="background" args={["#07090b"]} />
                    <fog attach="fog" args={["#07090b", 8, 20]} />
                    <ambientLight intensity={0.55} />
                    <spotLight position={[-5, 7, 6]} intensity={58} angle={0.36} penumbra={0.7} />
                    <pointLight position={[3.2, -0.7, 2.2]} color="#25d4ff" intensity={24} />
                    <pointLight position={[-3.1, -2.4, 2.4]} color="#ffb84d" intensity={7} />
                    <EvidenceMachine stage={stage} reducedMotion={reducedMotion} />
                    <Environment preset="warehouse" />
                  </Canvas>
                </div>

                <ProductWorkspace active={interfaceActive} />
                <OperatorEvidenceControl active={operatorActive} resolved={evidenceResolved} onResolve={resolveEvidence} />
                <div className="hud hud-left" aria-hidden="true">
                  <span>Evidence coverage</span>
                  <strong>{interfaceActive || evidenceResolved ? "100%" : stageIndex >= 2 ? "71.6%" : "—"}</strong>
                  <em>{interfaceActive ? "Record resolved into workspace" : evidenceResolved ? "Operator evidence accepted" : stageIndex >= 2 ? "Verified inputs stabilizing" : "Awaiting verification"}</em>
                </div>
                <div className="hud hud-right" aria-hidden="true">
                  <span>Risk review</span>
                  <strong>{stageIndex >= 3 ? "18.6%" : "—"}</strong>
                  <em>{interfaceActive ? "Approval recorded" : evidenceResolved ? "Boundary released" : stageIndex >= 4 ? "Operator responsibility active" : "Boundary pending"}</em>
                </div>
              </div>

              <div className="stage-panel" aria-live="polite">
                <div>
                  <span>{String(stageIndex + 1).padStart(2, "0")} / {String(experienceStages.length).padStart(2, "0")}</span>
                  <h2>{current.title}</h2>
                  <p>{operatorActive && !evidenceResolved ? "The system cannot approve itself. Place the missing market context into operator review to continue." : current.body}</p>
                </div>
                {operatorActive && !evidenceResolved ? (
                  <button type="button" className="resolve-action" onClick={resolveEvidence}>Place evidence</button>
                ) : (
                  <button type="button" onClick={() => setAutoPlay((value) => !value)}>{autoPlay ? "Pause sequence" : "Play sequence"}</button>
                )}
              </div>

              <nav className="stage-nav" aria-label="Evidence Gate stages">
                {experienceStages.map((item, index) => {
                  const locked = !evidenceResolved && index > operatorIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={item.id === stage ? "active" : ""}
                      disabled={locked}
                      aria-label={locked ? `${item.label} locked until operator evidence is supplied` : item.label}
                      onClick={() => { setStage(item.id); setAutoPlay(false); }}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </section>
        </main>
      )}
    </>
  );
}

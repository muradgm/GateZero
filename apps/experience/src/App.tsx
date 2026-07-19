import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { productState } from "@gatezero/product-state";
import { useEffect, useMemo, useState } from "react";
import { experienceStages, type ExperienceStageId } from "./engine/stages";
import { EvidenceMachine } from "./scenes/EvidenceMachine";

export default function App() {
  const [stage, setStage] = useState<ExperienceStageId>("signal");
  const [autoPlay, setAutoPlay] = useState(true);
  const reducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const stageIndex = experienceStages.findIndex((item) => item.id === stage);
  const current = experienceStages[stageIndex];

  useEffect(() => {
    if (!autoPlay || reducedMotion) return;
    const timer = window.setInterval(() => {
      setStage((currentStage) => {
        const currentIndex = experienceStages.findIndex((item) => item.id === currentStage);
        return experienceStages[(currentIndex + 1) % experienceStages.length].id;
      });
    }, 3200);
    return () => window.clearInterval(timer);
  }, [autoPlay, reducedMotion]);

  return (
    <main>
      <section className="hero">
        <div className="copy">
          <p className="eyebrow">TraderFrame / Evidence Gate</p>
          <h1>
            Frame the evidence. <span>Control the decision.</span>
          </h1>
          <p className="lede">
            A real-time decision-governance experience where fragmented signals become a bounded,
            risk-gated, operator-owned record.
          </p>
          <div className="boundary">{productState.wedge}</div>
          <dl>
            <div>
              <dt>Current gate</dt>
              <dd>{productState.id}</dd>
            </div>
            <div>
              <dt>Mode</dt>
              <dd>{productState.publicLabel}</dd>
            </div>
            <div>
              <dt>Execution</dt>
              <dd>Locked</dd>
            </div>
          </dl>
        </div>

        <div className="experience-shell">
          <div className="scene" aria-label="Interactive three-dimensional Evidence Gate prototype">
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
            <div className="hud hud-left" aria-hidden="true">
              <span>Evidence coverage</span>
              <strong>{stageIndex >= 2 ? "71.6%" : "—"}</strong>
              <em>{stageIndex >= 2 ? "Verified inputs stabilizing" : "Awaiting verification"}</em>
            </div>
            <div className="hud hud-right" aria-hidden="true">
              <span>Risk review</span>
              <strong>{stageIndex >= 3 ? "18.6%" : "—"}</strong>
              <em>{stageIndex >= 4 ? "Operator responsibility active" : "Boundary pending"}</em>
            </div>
          </div>

          <div className="stage-panel" aria-live="polite">
            <div>
              <span>{String(stageIndex + 1).padStart(2, "0")} / {String(experienceStages.length).padStart(2, "0")}</span>
              <h2>{current.title}</h2>
              <p>{current.body}</p>
            </div>
            <button type="button" onClick={() => setAutoPlay((value) => !value)}>
              {autoPlay ? "Pause sequence" : "Play sequence"}
            </button>
          </div>

          <nav className="stage-nav" aria-label="Evidence Gate stages">
            {experienceStages.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={item.id === stage ? "active" : ""}
                onClick={() => {
                  setStage(item.id);
                  setAutoPlay(false);
                }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </section>
    </main>
  );
}

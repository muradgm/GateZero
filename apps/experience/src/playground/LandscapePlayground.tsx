import { Environment, Grid } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo, useState } from "react";
import { buildLandscape } from "../engine/landscape";
import { evaluateIntelligence } from "../engine/intelligence";
import { ConvictionAtlasScene } from "../scenes/ConvictionAtlasScene";
import { baseTimestamp, sampleSignals } from "./sampleSignals";

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function LandscapePlayground() {
  const [hoursElapsed, setHoursElapsed] = useState(0);
  const [riskPressure, setRiskPressure] = useState(1);
  const [contradictionPressure, setContradictionPressure] = useState(1);
  const [routeCount, setRouteCount] = useState(96);

  const intelligence = useMemo(() => {
    const adjusted = sampleSignals.map((signal) => ({
      ...signal,
      contradiction: Math.min(1, signal.contradiction * contradictionPressure),
      riskImpact: Math.min(1, signal.riskImpact * riskPressure)
    }));
    return evaluateIntelligence(adjusted, baseTimestamp + hoursElapsed * 3_600_000);
  }, [contradictionPressure, hoursElapsed, riskPressure]);

  const landscape = useMemo(
    () => buildLandscape(intelligence, { resolution: 48, routeCount, size: 9, seed: 2407 }),
    [intelligence, routeCount]
  );

  const dominant = landscape.routes.find((route) => route.dominant);

  return (
    <section className="landscape-playground">
      <header className="landscape-header">
        <div>
          <p className="eyebrow">Conviction Atlas / Landscape Engine</p>
          <h1>Watch the market thesis become terrain.</h1>
          <p>
            Confidence raises the field, risk creates valleys, contradiction fractures the surface,
            and candidate routes compete until one conditional thesis becomes dominant.
          </p>
        </div>
        <div className="landscape-metrics" aria-live="polite">
          <div><span>Confidence</span><strong>{percent(intelligence.confidence)}</strong></div>
          <div><span>Risk</span><strong>{percent(intelligence.risk)}</strong></div>
          <div><span>Contradiction</span><strong>{percent(intelligence.contradiction)}</strong></div>
          <div><span>Dominant route</span><strong>{dominant ? percent(dominant.weight) : "—"}</strong></div>
        </div>
      </header>

      <div className="landscape-stage">
        <Canvas camera={{ position: [7.6, 6.2, 9.4], fov: 36 }} dpr={[1, 1.5]}>
          <color attach="background" args={["#050708"]} />
          <fog attach="fog" args={["#050708", 10, 24]} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[-5, 9, 6]} intensity={3.2} color="#d8f7ff" />
          <pointLight position={[4, 2, 1]} intensity={18} color="#6de7ff" distance={11} />
          <pointLight position={[-3, 1, -2]} intensity={8} color="#a77cff" distance={9} />
          <ConvictionAtlasScene landscape={landscape} />
          <Grid
            args={[18, 18]}
            position={[0, -1.14, 0]}
            cellSize={0.5}
            cellThickness={0.25}
            cellColor="#26323a"
            sectionSize={2}
            sectionThickness={0.6}
            sectionColor="#344550"
            fadeDistance={16}
            fadeStrength={2}
            infiniteGrid
          />
          <Environment preset="night" />
        </Canvas>
        <div className="landscape-legend" aria-hidden="true">
          <span><i className="cyan" /> Candidate thesis</span>
          <span><i className="violet" /> Dominant thesis</span>
          <span><i className="amber" /> Bearish / risk route</span>
        </div>
      </div>

      <aside className="landscape-controls" aria-label="Landscape development controls">
        <label>
          <span>Time elapsed <strong>{hoursElapsed}h</strong></span>
          <input type="range" min="0" max="36" step="1" value={hoursElapsed} onChange={(event) => setHoursElapsed(Number(event.target.value))} />
        </label>
        <label>
          <span>Risk pressure <strong>{riskPressure.toFixed(2)}×</strong></span>
          <input type="range" min="0.35" max="1.8" step="0.05" value={riskPressure} onChange={(event) => setRiskPressure(Number(event.target.value))} />
        </label>
        <label>
          <span>Contradiction <strong>{contradictionPressure.toFixed(2)}×</strong></span>
          <input type="range" min="0.35" max="1.8" step="0.05" value={contradictionPressure} onChange={(event) => setContradictionPressure(Number(event.target.value))} />
        </label>
        <label>
          <span>Candidate routes <strong>{routeCount}</strong></span>
          <input type="range" min="24" max="180" step="12" value={routeCount} onChange={(event) => setRouteCount(Number(event.target.value))} />
        </label>
      </aside>
    </section>
  );
}

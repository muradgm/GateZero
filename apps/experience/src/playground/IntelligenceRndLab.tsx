import { useMemo, useState } from "react";

const concepts = [
  {
    id: "fiber",
    label: "Fiber Intelligence",
    idea: "Signals become living optical strands that merge, split, and decay.",
    strengths: ["Immediate semantic readability", "Strong motion vocabulary", "Easy bridge into routes"],
    risk: "Can feel familiar within contemporary AI branding."
  },
  {
    id: "magnetic",
    label: "Magnetic Fields",
    idea: "Intelligence is invisible; only the deformation it causes is visible.",
    strengths: ["Distinctive and restrained", "Excellent fit with contour terrain", "Low visual clutter"],
    risk: "More abstract and requires careful explanation."
  },
  {
    id: "liquid",
    label: "Liquid Probability",
    idea: "Evidence changes viscosity, flow, ripples, and interference patterns.",
    strengths: ["Highly cinematic", "Natural probability metaphor", "Strong transition potential"],
    risk: "Fluid simulation can become expensive and decorative."
  },
  {
    id: "crystal",
    label: "Conviction Crystals",
    idea: "Compatible evidence crystallizes while contradiction fractures the structure.",
    strengths: ["Memorable and ownable", "Clear formation and invalidation", "Strong still imagery"],
    risk: "Less naturally connected to continuous market updating."
  },
  {
    id: "topology",
    label: "Topological Intelligence",
    idea: "Reasoning is a continuously deforming field with no visible data objects.",
    strengths: ["Most original", "Perfect fit with Conviction Atlas", "Scales from hero to product"],
    risk: "Hardest direction to art-direct and explain clearly."
  }
] as const;

type ConceptId = (typeof concepts)[number]["id"];

type ScoreSet = Record<"clarity" | "originality" | "scalability" | "performance" | "wedgeFit", number>;

const defaultScores: Record<ConceptId, ScoreSet> = {
  fiber: { clarity: 5, originality: 3, scalability: 5, performance: 4, wedgeFit: 4 },
  magnetic: { clarity: 3, originality: 5, scalability: 5, performance: 5, wedgeFit: 5 },
  liquid: { clarity: 4, originality: 4, scalability: 3, performance: 2, wedgeFit: 4 },
  crystal: { clarity: 5, originality: 5, scalability: 3, performance: 4, wedgeFit: 3 },
  topology: { clarity: 3, originality: 5, scalability: 5, performance: 4, wedgeFit: 5 }
};

function FiberPrototype() {
  return (
    <svg viewBox="0 0 900 460" role="img" aria-label="Fiber intelligence strands merging and splitting">
      <defs>
        <linearGradient id="fiber-cyan" x1="0" x2="1"><stop stopColor="#4de3ff" stopOpacity="0.08"/><stop offset="0.52" stopColor="#4de3ff"/><stop offset="1" stopColor="#a884ff"/></linearGradient>
      </defs>
      {Array.from({ length: 12 }, (_, index) => {
        const y = 68 + index * 27;
        const offset = (index % 4) * 11;
        return <path key={index} className="rnd-flow-line" style={{ animationDelay: `${index * -0.17}s` }} d={`M 12 ${y} C 190 ${y - offset}, 280 ${220 + (index % 3) * 10}, 445 220 C 605 220, 690 ${75 + index * 22}, 890 ${78 + index * 22}`} stroke="url(#fiber-cyan)"/>;
      })}
      <circle cx="445" cy="220" r="38" className="rnd-core-pulse" />
    </svg>
  );
}

function MagneticPrototype() {
  return (
    <svg viewBox="0 0 900 460" role="img" aria-label="Magnetic intelligence field bending around evidence forces">
      {Array.from({ length: 19 }, (_, index) => {
        const y = 28 + index * 23;
        const bend = 60 + Math.abs(index - 9) * 8;
        return <path key={index} className="rnd-field-line" d={`M 0 ${y} C 230 ${y}, 285 ${y - bend}, 450 ${230 + (index - 9) * 8} C 615 ${y + bend}, 690 ${y}, 900 ${y}`} />;
      })}
      <circle cx="350" cy="185" r="10" className="rnd-force cyan" />
      <circle cx="560" cy="278" r="13" className="rnd-force amber" />
      <circle cx="450" cy="230" r="30" className="rnd-force violet" />
    </svg>
  );
}

function LiquidPrototype() {
  return (
    <svg viewBox="0 0 900 460" role="img" aria-label="Liquid probability interference field">
      <defs>
        <radialGradient id="liquid-field"><stop stopColor="#7de9ff" stopOpacity="0.75"/><stop offset="0.5" stopColor="#765bff" stopOpacity="0.22"/><stop offset="1" stopColor="#071013" stopOpacity="0"/></radialGradient>
      </defs>
      {Array.from({ length: 9 }, (_, index) => <ellipse key={index} cx={250 + index * 54} cy={220 + Math.sin(index) * 40} rx={125 - index * 4} ry={46 + index * 3} className="rnd-liquid-ring" style={{ animationDelay: `${index * -0.24}s` }} />)}
      <rect width="900" height="460" fill="url(#liquid-field)" opacity="0.7" />
    </svg>
  );
}

function CrystalPrototype() {
  const pieces = useMemo(() => Array.from({ length: 28 }, (_, index) => ({
    x: 160 + (index % 7) * 86 + Math.sin(index * 2.1) * 18,
    y: 80 + Math.floor(index / 7) * 88 + Math.cos(index * 1.7) * 16,
    rotate: index * 23,
    scale: 0.55 + (index % 5) * 0.09
  })), []);
  return (
    <svg viewBox="0 0 900 460" role="img" aria-label="Conviction crystal growing from evidence fragments">
      <g className="rnd-crystal-cluster">
        {pieces.map((piece, index) => <polygon key={index} points="0,-26 22,-8 14,24 -15,22 -24,-6" transform={`translate(${piece.x} ${piece.y}) rotate(${piece.rotate}) scale(${piece.scale})`} className={index % 6 === 0 ? "rnd-crystal fracture" : "rnd-crystal"} style={{ animationDelay: `${index * -0.09}s` }} />)}
      </g>
      <polygon points="450,70 548,170 510,330 390,360 328,215" className="rnd-main-crystal" />
      <path d="M450 70 L430 220 L510 330 M328 215 L430 220 L548 170" className="rnd-crystal-facets" />
    </svg>
  );
}

function TopologyPrototype() {
  return (
    <svg viewBox="0 0 900 460" role="img" aria-label="Topological intelligence field deforming under evidence and risk">
      {Array.from({ length: 23 }, (_, index) => {
        const y = 16 + index * 20;
        return <path key={index} className="rnd-topology-line" style={{ animationDelay: `${index * -0.11}s` }} d={`M 0 ${y} C 170 ${y + Math.sin(index) * 18}, 270 ${180 - index * 3}, 430 ${215 + Math.cos(index * 0.7) * 56} C 600 ${265 - index * 4}, 710 ${y + Math.cos(index) * 21}, 900 ${y}`} />;
      })}
      <path className="rnd-topology-dominant" d="M 0 315 C 190 320, 300 250, 430 215 C 575 180, 710 145, 900 130" />
    </svg>
  );
}

const renderers: Record<ConceptId, () => JSX.Element> = {
  fiber: FiberPrototype,
  magnetic: MagneticPrototype,
  liquid: LiquidPrototype,
  crystal: CrystalPrototype,
  topology: TopologyPrototype
};

export function IntelligenceRendLab() {
  const [active, setActive] = useState<ConceptId>("topology");
  const [scores, setScores] = useState(defaultScores);
  const selected = concepts.find((concept) => concept.id === active)!;
  const Renderer = renderers[active];
  const score = scores[active];
  const total = Object.values(score).reduce((sum, value) => sum + value, 0);

  function updateScore(key: keyof ScoreSet, value: number) {
    setScores((current) => ({ ...current, [active]: { ...current[active], [key]: value } }));
  }

  return (
    <section className="rnd-lab">
      <header className="rnd-header">
        <div>
          <p className="eyebrow">Conviction Atlas / Intelligence R&amp;D</p>
          <h1>Five ways to visualize market reasoning.</h1>
          <p>Each prototype receives the same conceptual input. The comparison is about visual language—not feature count or polish.</p>
        </div>
        <div className="rnd-total"><span>Current score</span><strong>{total}/25</strong><em>{selected.label}</em></div>
      </header>

      <nav className="rnd-tabs" aria-label="Intelligence language prototypes">
        {concepts.map((concept, index) => <button key={concept.id} type="button" className={active === concept.id ? "active" : ""} onClick={() => setActive(concept.id)}><span>{String(index + 1).padStart(2, "0")}</span>{concept.label}</button>)}
      </nav>

      <div className={`rnd-stage rnd-${active}`}><Renderer /><div className="rnd-stage-caption"><span>{selected.label}</span><strong>{selected.idea}</strong></div></div>

      <div className="rnd-analysis-grid">
        <article>
          <h2>Why it could work</h2>
          <ul>{selected.strengths.map((strength) => <li key={strength}>{strength}</li>)}</ul>
          <p className="rnd-risk"><span>Primary risk</span>{selected.risk}</p>
        </article>
        <aside>
          <h2>Evaluation</h2>
          {(Object.keys(score) as (keyof ScoreSet)[]).map((key) => <label key={key}><span>{key.replace("wedgeFit", "wedge fit")}</span><input type="range" min="1" max="5" step="1" value={score[key]} onChange={(event) => updateScore(key, Number(event.target.value))}/><strong>{score[key]}</strong></label>)}
        </aside>
      </div>
    </section>
  );
}

/* global document */

const root = document.querySelector("#rnd-app");
if (!root) throw new Error("Missing Conviction Atlas R&D mount node.");

const prototypes = [
  {
    id: "P1",
    name: "Signal Rivers",
    thesis: "Evidence behaves like living streams that merge, split and lose force under contradiction.",
    strengths: ["Immediate directional reading", "Strong motion identity", "Clear evidence provenance"],
    risks: ["Can become visually noisy", "Needs disciplined color hierarchy"],
    scores: { clarity: 9, ownability: 8, scalability: 8, performance: 8, accessibility: 7 }
  },
  {
    id: "P2",
    name: "Conviction Topography",
    thesis: "Market states become a terrain whose elevation represents confidence and whose hazards expose risk.",
    strengths: ["Closest to final product target", "Strong spatial memory", "Supports scenario comparison"],
    risks: ["Harder mobile adaptation", "Requires careful depth cues"],
    scores: { clarity: 8, ownability: 10, scalability: 9, performance: 7, accessibility: 7 }
  },
  {
    id: "P3",
    name: "Evidence Constellation",
    thesis: "Signals form a navigable network where relationships, clusters and contradictions remain visible.",
    strengths: ["Excellent relationship view", "Flexible density", "Strong analytical credibility"],
    risks: ["Less emotional than topography", "Can resemble generic graph tooling"],
    scores: { clarity: 8, ownability: 7, scalability: 10, performance: 9, accessibility: 8 }
  },
  {
    id: "P4",
    name: "Decision Lenses",
    thesis: "Users inspect the same market through evidence, opportunity, risk and conviction lenses.",
    strengths: ["High user control", "Simple interaction model", "Good accessibility path"],
    risks: ["Weaker cinematic impact", "Less distinctive as a hero system"],
    scores: { clarity: 10, ownability: 7, scalability: 8, performance: 10, accessibility: 10 }
  },
  {
    id: "P5",
    name: "Scenario Braids",
    thesis: "Competing market futures are braided together until challenge and risk isolate the preferred route.",
    strengths: ["Strong narrative progression", "Makes alternatives explicit", "Excellent motion potential"],
    risks: ["Requires explanation at first use", "Dense braids may reduce legibility"],
    scores: { clarity: 8, ownability: 9, scalability: 8, performance: 8, accessibility: 7 }
  }
];

const criteria = ["clarity", "ownability", "scalability", "performance", "accessibility"];
const label = (value) => value.charAt(0).toUpperCase() + value.slice(1);
const total = (prototype) => criteria.reduce((sum, key) => sum + prototype.scores[key], 0);
const ranked = [...prototypes].sort((a, b) => total(b) - total(a));
let activeId = ranked[0].id;

root.innerHTML = `
  <main class="rnd-shell">
    <header class="rnd-header">
      <div>
        <a href="./traderframe.html" class="back-link">← Conviction Atlas</a>
        <p class="eyebrow">R&D milestone 3</p>
        <h1>Intelligence language laboratory</h1>
        <p class="lede">Five visual systems tested against one shared evaluation framework. This branch is exploratory and must not be merged until a direction is reviewed.</p>
      </div>
      <aside class="decision-note"><span>Current leader</span><strong id="leader-name">${ranked[0].name}</strong><b id="leader-score">${total(ranked[0])}/50</b></aside>
    </header>

    <section class="prototype-tabs" aria-label="Intelligence language prototypes">
      ${prototypes.map((item) => `<button type="button" data-id="${item.id}" class="prototype-tab${item.id === activeId ? " active" : ""}"><span>${item.id}</span>${item.name}</button>`).join("")}
    </section>

    <section class="prototype-stage" aria-live="polite">
      <div class="prototype-copy">
        <p class="eyebrow" id="prototype-id"></p>
        <h2 id="prototype-name"></h2>
        <p id="prototype-thesis"></p>
        <div class="pros-cons"><article><h3>Strengths</h3><ul id="strengths"></ul></article><article><h3>Risks</h3><ul id="risks"></ul></article></div>
      </div>
      <div class="prototype-visual" id="prototype-visual" aria-label="Prototype visualization"></div>
    </section>

    <section class="evaluation" aria-labelledby="evaluation-title">
      <div class="section-heading"><div><p class="eyebrow">Shared framework</p><h2 id="evaluation-title">Evaluation matrix</h2></div><p>Score every direction on the same five production criteria. Maximum score: 50.</p></div>
      <div class="matrix" role="table" aria-label="Prototype evaluation matrix">
        <div class="matrix-row matrix-head" role="row"><span role="columnheader">Prototype</span>${criteria.map((key) => `<span role="columnheader">${label(key)}</span>`).join("")}<span role="columnheader">Total</span></div>
        ${ranked.map((item) => `<button class="matrix-row" type="button" data-id="${item.id}" role="row"><strong role="cell">${item.id} · ${item.name}</strong>${criteria.map((key) => `<span role="cell"><i style="--score:${item.scores[key]}"></i>${item.scores[key]}</span>`).join("")}<b role="cell">${total(item)}</b></button>`).join("")}
      </div>
    </section>

    <section class="recommendation">
      <div><p class="eyebrow">R&D recommendation</p><h2>Use Conviction Topography as the core, then borrow interaction clarity from Decision Lenses and narrative motion from Scenario Braids.</h2></div>
      <ol><li>Keep topography as the ownable hero metaphor.</li><li>Use explicit lens controls to reduce cognitive load.</li><li>Use braid transitions only when comparing scenarios.</li><li>Retain static, semantic fallbacks for reduced motion and low-power devices.</li></ol>
    </section>
  </main>
`;

const visual = document.querySelector("#prototype-visual");
const idNode = document.querySelector("#prototype-id");
const nameNode = document.querySelector("#prototype-name");
const thesisNode = document.querySelector("#prototype-thesis");
const strengthsNode = document.querySelector("#strengths");
const risksNode = document.querySelector("#risks");

function renderPrototype(id) {
  const item = prototypes.find((prototype) => prototype.id === id);
  if (!item || !visual || !idNode || !nameNode || !thesisNode || !strengthsNode || !risksNode) return;
  activeId = id;
  document.querySelectorAll("[data-id]").forEach((node) => node.classList.toggle("active", node.getAttribute("data-id") === id));
  idNode.textContent = `${item.id} / exploratory system`;
  nameNode.textContent = item.name;
  thesisNode.textContent = item.thesis;
  strengthsNode.innerHTML = item.strengths.map((value) => `<li>${value}</li>`).join("");
  risksNode.innerHTML = item.risks.map((value) => `<li>${value}</li>`).join("");
  visual.className = `prototype-visual visual-${item.id.toLowerCase()}`;
  visual.innerHTML = prototypeMarkup(item.id);
}

function prototypeMarkup(id) {
  if (id === "P1") return `<div class="river-field">${Array.from({ length: 9 }, (_, index) => `<i style="--i:${index}"></i>`).join("")}<b>verified route</b></div>`;
  if (id === "P2") return `<div class="topography-field">${Array.from({ length: 14 }, (_, index) => `<i style="--i:${index}"></i>`).join("")}<span class="peak peak-a"></span><span class="peak peak-b"></span><b>62%</b></div>`;
  if (id === "P3") return `<div class="constellation-field">${Array.from({ length: 18 }, (_, index) => `<i style="--i:${index}"></i>`).join("")}<svg viewBox="0 0 600 360" aria-hidden="true"><path d="M70 230 L170 120 L280 205 L390 92 L515 180 M170 120 L390 92 M280 205 L515 180"/></svg></div>`;
  if (id === "P4") return `<div class="lens-field"><span>Evidence</span><span>Opportunity</span><span>Risk</span><span>Conviction</span><b>Market state</b></div>`;
  return `<div class="braid-field">${Array.from({ length: 4 }, (_, index) => `<i style="--i:${index}"></i>`).join("")}<b>preferred scenario</b></div>`;
}

document.querySelectorAll("button[data-id]").forEach((button) => button.addEventListener("click", () => renderPrototype(button.getAttribute("data-id"))));
renderPrototype(activeId);

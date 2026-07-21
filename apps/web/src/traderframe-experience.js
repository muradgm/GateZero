/* global document, matchMedia */

const app = document.querySelector("#traderframe-app");
if (!app) throw new Error("Missing TraderFrame mount node.");

const inputs = [
  ["Price action", "#3977ff"], ["News & events", "#8d55ff"], ["Sentiment", "#b667ff"],
  ["Macro data", "#1fd1d7"], ["Options flow", "#7adf70"], ["On-chain data", "#e6dc52"],
  ["Liquidity map", "#ff9b36"], ["Earnings", "#ff792f"], ["Social signals", "#ff3c34"]
];

const drivers = [
  ["Momentum building", "+20%", "good"], ["Macro tailwinds", "+18%", "good"],
  ["Volume support", "+12%", "good"], ["News sentiment", "+8%", "good"],
  ["Resistance cluster", "-16%", "bad"], ["Volatility risk", "-14%", "bad"],
  ["Liquidity thinning", "-8%", "bad"]
];

const journey = [
  ["01", "Observe", "Raw signals enter from everywhere.", "Chaos"],
  ["02", "Correlate", "Patterns form. Relationships begin to emerge.", "Clarity"],
  ["03", "Form thesis", "Multiple scenarios take shape. Probabilities are estimated.", "Structure"],
  ["04", "Challenge", "Contradictions and risks test the thesis. Weak paths fade.", "Pressure"],
  ["05", "Conviction", "One path remains with the highest risk-adjusted edge.", "Conviction"],
  ["06", "Execute", "The landscape folds into your workspace. You decide.", "Action"]
];

const systemCards = ["Intelligence language", "Geometry language", "Material language", "Color system", "Typography", "Icon language", "Motion language"];

app.innerHTML = `
  <main class="atlas" id="experience">
    <section class="atlas-top">
      <aside class="brand-rail">
        <a class="wordmark" href="./index.html" aria-label="TraderFrame command center">TRADER<span>FRAME</span></a>
        <p class="product-name">Conviction Atlas</p>
        <p class="product-tagline">Private trading decision intelligence</p>
        <p class="intro">We transform fragmented market evidence into one explainable, risk-aware decision.</p>
        <div class="principles">
          ${[
            ["Evidence first", "Every insight is backed by real market data."],
            ["Transparent reasoning", "We show why we believe, not just what we believe."],
            ["You stay in control", "Recommendations, not autopilot. You decide."],
            ["Risk aware", "No trade is good if the risk is wrong."]
          ].map(([title, copy], i) => `<article><span class="principle-icon">0${i + 1}</span><div><strong>${title}</strong><p>${copy}</p></div></article>`).join("")}
        </div>
      </aside>

      <section class="landscape" aria-labelledby="landscape-title">
        <div class="landscape-heading"><h1 id="landscape-title">The market landscape</h1><p>Multiple paths. Many possibilities.<br />We map the probabilities and reveal the best route.</p></div>
        <div class="input-stack" aria-label="Evidence streams">
          ${inputs.map(([label, color], index) => `<span style="--stream:${color};--row:${index}">${label}<i></i></span>`).join("")}
        </div>
        <svg class="terrain" viewBox="0 0 1000 600" role="img" aria-label="Abstract market terrain with scenario routes">
          <defs>
            <linearGradient id="terrainFade" x1="0" x2="1"><stop stop-color="#0b78ff"/><stop offset=".48" stop-color="#7b4cff"/><stop offset="1" stop-color="#ff8b34"/></linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <g class="contours">
            ${Array.from({length: 24}, (_, i) => `<path d="M40 ${120+i*15} C180 ${40+i*7}, 280 ${220-i*3}, 420 ${135+i*4} S680 ${70+i*8}, 960 ${145+i*9}"/>`).join("")}
            ${Array.from({length: 14}, (_, i) => `<ellipse cx="${360+i*34}" cy="${250+i*8}" rx="${110+i*20}" ry="${34+i*9}"/>`).join("")}
          </g>
          <g class="routes" filter="url(#glow)">
            <path class="route route-cyan" d="M30 220 C220 210, 270 280, 420 250 S650 155, 760 190"/>
            <path class="route route-blue" d="M35 278 C190 300, 260 215, 430 285 S620 350, 770 245"/>
            <path class="route route-orange" d="M30 335 C250 325, 330 245, 500 300 S700 240, 885 315"/>
            <path class="route route-main" d="M120 360 C300 340, 370 410, 515 355 S705 325, 925 430"/>
          </g>
          <g class="risk-zones"><circle cx="360" cy="440" r="48"/><circle cx="765" cy="470" r="52"/></g>
          <g class="scenario-nodes">
            <circle cx="390" cy="165" r="8"/><circle cx="545" cy="205" r="8"/><circle cx="705" cy="190" r="8"/><circle cx="865" cy="360" r="10"/>
          </g>
        </svg>
        <div class="scenario-label bull"><b>Bull case</b><span>28%</span></div>
        <div class="scenario-label side"><b>Sideways</b><span>18%</span></div>
        <div class="scenario-label bear"><b>Bear case</b><span>22%</span></div>
        <div class="scenario-label rec"><b>Recommended path</b><span>62%</span></div>
        <div class="risk-label risk-a">△ High risk zone</div><div class="risk-label risk-b">△ High risk zone</div>
      </section>

      <aside class="decision-rail">
        <article class="metric-card thesis"><span>Current thesis</span><div><strong>Moderately Bullish</strong><b>62%</b></div><small>Bias · Confidence</small></article>
        <article class="metric-card"><span>Key drivers</span><ul>${drivers.map(([label, value, tone]) => `<li><i></i><span>${label}</span><b class="${tone}">${value}</b></li>`).join("")}</ul></article>
        <article class="metric-card risk"><span>Risk overview</span><div class="gauge"><b>38</b><small>/100</small></div><strong>Moderate Risk</strong><p>Position sizing recommended<br />Small to Moderate</p></article>
        <article class="metric-card recommendation"><span>Recommendation</span><strong>Conditional long</strong><div><small>Timeframe<br /><b>1D – 1W</b></small><small>Invalidate if<br /><b>Below 1.2360</b></small></div></article>
      </aside>
    </section>

    <section class="decision-journey" aria-labelledby="journey-title">
      <h2 id="journey-title">The decision journey</h2>
      <div class="journey-grid">${journey.map(([n, title, copy, state], i) => `<article style="--step:${i}"><header><span>${n}</span><strong>${title}</strong></header><div class="mini-map"><i></i><i></i><i></i></div><p>${copy}</p><small>State: ${state}</small></article>`).join("")}</div>
    </section>

    <section class="language-system" aria-labelledby="language-title"><h2 id="language-title">Visual language system</h2><div>${systemCards.map((title, i) => `<article><h3>${title}</h3><p>${["Signals are living threads.","Contour fields driven by invisible forces.","Premium, minimal, timeless.","Purpose-driven palette.","Clean. Technical. Confident.","Minimal. Meaningful.","Meaningful. Directional. Fluid."][i]}</p><div class="system-demo system-${i}"></div></article>`).join("")}</div></section>

    <section class="pipeline"><h2>Creative & production pipeline</h2><div class="pipeline-track">${["Product strategy","Creative direction","Information architecture","Experience narrative","Art direction","Concept art","Storyboarding","Design system","3D & motion","Shaders & VFX","Implementation","QA & optimization","Deploy & monitor"].map((label, i) => `<span><b>${String(i+1).padStart(2,"0")}</b>${label}</span>`).join("")}</div></section>

    <footer><span>Concept 03 v2.1 · Conviction Atlas</span><span>TraderFrame — Private trading decision intelligence</span><span>Evidence. Reasoning. Conviction.</span></footer>
  </main>
`;

if (matchMedia("(prefers-reduced-motion: reduce)").matches) document.documentElement.classList.add("reduced-motion");

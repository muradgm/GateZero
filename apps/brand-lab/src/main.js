import './styles.css';

const fontOptions = {
  heading: ['Space Grotesk', 'Sora', 'Manrope', 'Plus Jakarta Sans', 'DM Sans'],
  body: ['Inter', 'Manrope', 'DM Sans', 'Source Sans 3', 'IBM Plex Sans'],
  data: ['IBM Plex Mono', 'JetBrains Mono', 'Roboto Mono', 'Space Mono']
};

const presets = [
  { name: 'Electric Indigo', value: '#583DF5' },
  { name: 'Deep Violet', value: '#6D35FF' },
  { name: 'Royal Purple', value: '#7C3AED' },
  { name: 'Blue Violet', value: '#4F46E5' },
  { name: 'Signal Cyan', value: '#00B8D9' },
  { name: 'Precision Blue', value: '#2563EB' }
];

const state = {
  primary: '#583DF5',
  headingFont: 'Space Grotesk',
  bodyFont: 'Inter',
  dataFont: 'IBM Plex Mono',
  radius: 12,
  density: 'comfortable',
  mode: 'dark'
};

const app = document.querySelector('#app');

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const value = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

function mix(a, b, amount) {
  const x = hexToRgb(a); const y = hexToRgb(b);
  return rgbToHex({ r: x.r + (y.r - x.r) * amount, g: x.g + (y.g - x.g) * amount, b: x.b + (y.b - x.b) * amount });
}

function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const channel = value => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a, b) {
  const [l1, l2] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return ((l1 + 0.05) / (l2 + 0.05)).toFixed(2);
}

function palette() {
  const primary = state.primary;
  const dark = '#050712';
  return {
    p50: mix(primary, '#FFFFFF', .9), p100: mix(primary, '#FFFFFF', .78), p200: mix(primary, '#FFFFFF', .62),
    p300: mix(primary, '#FFFFFF', .44), p400: mix(primary, '#FFFFFF', .22), p500: primary,
    p600: mix(primary, '#000000', .14), p700: mix(primary, '#000000', .28), p800: mix(primary, '#000000', .42), p900: mix(primary, '#000000', .58),
    canvas: dark, surface: '#0A1020', elevated: '#10182A', border: '#26324A', text: '#F7F8FC', muted: '#98A2B5',
    cyan: '#41DFF5', green: '#23C983', amber: '#F5A623', red: '#F45B69'
  };
}

function logoSvg(fill = 'currentColor', className = '') {
  return `<svg class="${className}" viewBox="0 0 140 130" role="img" aria-label="TraderFrame logo">
    <path fill="${fill}" d="M0 0h140l-9 12H9L0 0Z"/>
    <path fill="${fill}" d="M12 23h49v77L50 119V36H20l-8-13Z"/>
    <path fill="${fill}" d="M70 23h58l-8 13H83v94l-13-20V23Z"/>
    <path fill="${fill}" d="M91 46h34l-8 13h-14v20l-12 19V46Z"/>
  </svg>`;
}

function select(label, id, values, selected) {
  return `<label class="control"><span>${label}</span><select id="${id}">${values.map(v => `<option ${v === selected ? 'selected' : ''}>${v}</option>`).join('')}</select></label>`;
}

function swatch(name, color, usage) {
  return `<article class="swatch"><div class="swatch-color" style="background:${color}"></div><strong>${name}</strong><code>${color}</code><small>${usage}</small></article>`;
}

function render() {
  const p = palette();
  const modeLight = state.mode === 'light';
  document.documentElement.style.cssText = `
    --primary:${p.p500}; --primary-50:${p.p50}; --primary-100:${p.p100}; --primary-300:${p.p300}; --primary-600:${p.p600}; --primary-800:${p.p800};
    --canvas:${modeLight ? '#F4F6FA' : p.canvas}; --surface:${modeLight ? '#FFFFFF' : p.surface}; --elevated:${modeLight ? '#F8FAFD' : p.elevated};
    --border:${modeLight ? '#D9DFEA' : p.border}; --text:${modeLight ? '#090D18' : p.text}; --muted:${modeLight ? '#5B6678' : p.muted};
    --heading:'${state.headingFont}',sans-serif; --body:'${state.bodyFont}',sans-serif; --data:'${state.dataFont}',monospace; --radius:${state.radius}px;
    --section-pad:${state.density === 'compact' ? '44px' : '72px'}; --cyan:${p.cyan}; --green:${p.green}; --amber:${p.amber}; --red:${p.red};
  `;

  app.innerHTML = `
    <header class="topbar">
      <a class="brand" href="#top">${logoSvg('currentColor','brand-mark')}<span>TraderFrame <b>Brand Lab</b></span></a>
      <nav><a href="#foundation">Foundation</a><a href="#logo">Logo</a><a href="#color">Color</a><a href="#type">Type</a><a href="#components">Components</a><a href="#applications">Applications</a></nav>
      <button id="modeToggle" class="icon-button" aria-label="Toggle theme">${modeLight ? '◐' : '◑'}</button>
    </header>

    <aside class="config-panel">
      <div><span class="eyebrow">Live brand controls</span><h2>Configure the system</h2><p>Every section updates from the same token source.</p></div>
      <label class="control color-control"><span>Primary color</span><input id="primaryColor" type="color" value="${state.primary}"><code>${state.primary}</code></label>
      <div class="preset-row">${presets.map(x => `<button class="preset ${x.value === state.primary ? 'active' : ''}" data-color="${x.value}" title="${x.name}" style="--preset:${x.value}"></button>`).join('')}</div>
      ${select('Heading typeface','headingFont',fontOptions.heading,state.headingFont)}
      ${select('Body typeface','bodyFont',fontOptions.body,state.bodyFont)}
      ${select('Data / supporting typeface','dataFont',fontOptions.data,state.dataFont)}
      <label class="control"><span>Corner radius <b>${state.radius}px</b></span><input id="radius" type="range" min="0" max="28" step="2" value="${state.radius}"></label>
      ${select('Density','density',['compact','comfortable'],state.density)}
      <div class="token-preview"><span style="background:${p.p500}"></span><span style="background:${p.cyan}"></span><span style="background:${p.green}"></span><span style="background:${p.amber}"></span><span style="background:${p.red}"></span></div>
    </aside>

    <main id="top">
      <section class="hero" id="foundation">
        <div class="hero-copy"><span class="eyebrow">Evidence-gated trading intelligence</span><h1>Every trade begins<br>with <em>evidence.</em></h1><p>TraderFrame transforms market observations into traceable, reproducible and risk-bounded decisions—without replacing operator judgment.</p><div class="actions"><button class="button primary">Explore the system</button><button class="button secondary">View product principles</button></div></div>
        <div class="hero-symbol"><div class="glow"></div>${logoSvg('url(#brandGradient)','hero-logo').replace('<svg','<svg><defs><linearGradient id="brandGradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="var(--primary-300)"/><stop offset="1" stop-color="var(--primary-600)"/></linearGradient></defs>')}</div>
      </section>

      <section class="section foundation-grid"><div><span class="section-number">01</span><h2>Brand foundation</h2><p class="lead">A serious decision-support brand grounded in evidence, risk and human authority.</p></div>
        <div class="principle-grid">${[['Purpose','Disciplined market decisions'],['Vision','Evidence-backed reasoning as the standard'],['Mission','Transparent AI with operator authority'],['Core wedge','No trade without evidence'],['Personality','Precise, calm, analytical, disciplined'],['Bounded outcomes','Reject · Watch · Paper simulate']].map(([a,b]) => `<article class="principle"><small>${a}</small><h3>${b}</h3></article>`).join('')}</div>
      </section>

      <section class="section dark-section" id="logo"><div class="section-heading"><span class="section-number">02</span><div><h2>Logo system</h2><p>One geometry, purpose-built variants and strict production rules.</p></div></div>
        <div class="logo-stage"><div class="master-logo">${logoSvg('currentColor')}<div><h3>TraderFrame</h3><p>Evidence · Structure · Conviction</p></div></div><div class="construction">${logoSvg('currentColor')}<i></i><i></i><i></i></div></div>
        <div class="logo-variants"><article>${logoSvg('currentColor')}<span>Primary</span></article><article class="white-card">${logoSvg('#050712')}<span>On light</span></article><article>${logoSvg('#FFFFFF')}<span>White</span></article><article class="micro">${logoSvg('currentColor')}<span>Micro mark</span></article></div>
      </section>

      <section class="section" id="color"><div class="section-heading"><span class="section-number">03</span><div><h2>Color system</h2><p>Primary identity color generates the supporting scale. Semantic colors remain stable and meaningful.</p></div></div>
        <div class="scale">${[p.p50,p.p100,p.p200,p.p300,p.p400,p.p500,p.p600,p.p700,p.p800,p.p900].map((c,i)=>`<div style="background:${c}"><small>${[50,100,200,300,400,500,600,700,800,900][i]}</small><code>${c}</code></div>`).join('')}</div>
        <div class="swatches">${swatch('Primary',p.p500,'Brand actions')}${swatch('Evidence cyan',p.cyan,'Information and source links')}${swatch('Bull green',p.green,'Supporting evidence')}${swatch('Caution amber',p.amber,'Uncertainty and warnings')}${swatch('Bear red',p.red,'Contradiction and rejection')}</div>
        <div class="contrast-card"><div><span>Contrast on Midnight</span><strong>${contrast(p.p500,p.canvas)}:1</strong></div><div><span>White on Primary</span><strong>${contrast('#FFFFFF',p.p500)}:1</strong></div><div><span>Primary on Cloud</span><strong>${contrast(p.p500,'#F1F4F9')}:1</strong></div></div>
      </section>

      <section class="section type-section" id="type"><div class="section-heading"><span class="section-number">04</span><div><h2>Typography</h2><p>Authority for headings, readability for product, precision for evidence and data.</p></div></div>
        <div class="type-showcase"><div><small>Heading / ${state.headingFont}</small><h3>Reason clearly.<br>Decide deliberately.</h3></div><div><small>Body / ${state.bodyFont}</small><p>Every recommendation is presented alongside supporting evidence, contradicting evidence, invalidation conditions and explicit risk context.</p></div><div class="mono"><small>Data / ${state.dataFont}</small><code>BTCUSDT · CURRENT · RISK 0.50% · 12:45 UTC</code></div></div>
        <div class="type-scale">${[['Display','64 / 68'],['H1','48 / 54'],['H2','36 / 42'],['H3','28 / 34'],['Body','16 / 24'],['Caption','12 / 18'],['Data','14 / 20']].map(x=>`<div><span class="sample ${x[0].toLowerCase()}">${x[0]}</span><code>${x[1]}</code></div>`).join('')}</div>
      </section>

      <section class="section dark-section" id="components"><div class="section-heading"><span class="section-number">05</span><div><h2>Product components</h2><p>The brand becomes credible when the product behaves consistently.</p></div></div>
        <div class="component-grid"><article class="component-card"><small>Actions</small><button class="button primary">Paper simulate</button><button class="button secondary">Watch candidate</button><button class="button danger">Reject setup</button></article>
          <article class="component-card"><small>Evidence quality</small><div class="metric"><strong>Current</strong><span class="status success">Sufficient</span></div><div class="progress"><i style="width:78%"></i></div><p>Fresh, reproducible evidence with one non-critical warning.</p></article>
          <article class="component-card"><small>Market context</small><div class="kpis"><span><b>Trend</b><em class="success">Bullish</em></span><span><b>Volatility</b><em class="warning">Moderate</em></span><span><b>Session</b><em>London</em></span></div></article>
          <article class="component-card"><small>Decision record</small><div class="decision"><span>WATCH</span><time>12:45 UTC</time></div><p>Entry condition not yet observable. Event risk remains unresolved.</p></article></div>
      </section>

      <section class="section" id="applications"><div class="section-heading"><span class="section-number">06</span><div><h2>Applications</h2><p>One adaptable identity across product, mobile, editorial and partner contexts.</p></div></div>
        <div class="applications"><div class="dashboard-mock"><aside>${logoSvg('currentColor')}<span>Overview</span><span>Watchlist</span><span>Evidence</span><span>Risk</span></aside><div><div class="mock-header"><b>Setup Review</b><span>BTCUSDT</span></div><div class="chart"><i></i></div><div class="mock-cards"><span>Evidence<br><b>Current</b></span><span>Risk<br><b>0.50%</b></span><span>Decision<br><b>Watch</b></span></div></div></div>
          <div class="app-icon">${logoSvg('currentColor')}<strong>TraderFrame</strong></div><div class="campaign"><span>Every trade begins with</span><strong>evidence.</strong><small>Evidence-gated trading intelligence</small></div></div>
      </section>

      <section class="section tokens"><div><span class="section-number">07</span><h2>Developer tokens</h2><p>Copy the active configuration into implementation.</p></div><pre><code>${JSON.stringify({color:{primary:state.primary,canvas:p.canvas,surface:p.surface,evidence:p.cyan,supporting:p.green,caution:p.amber,contradicting:p.red},typography:{heading:state.headingFont,body:state.bodyFont,data:state.dataFont},radius:{base:`${state.radius}px`},density:state.density},null,2)}</code></pre></section>
    </main>
    <footer>${logoSvg('currentColor')}<span>TraderFrame Brand Lab</span><small>No trade without evidence. No execution without risk approval.</small></footer>
  `;
  bind();
}

function bind() {
  document.querySelector('#primaryColor').addEventListener('input', e => { state.primary = e.target.value.toUpperCase(); render(); });
  document.querySelectorAll('.preset').forEach(b => b.addEventListener('click', () => { state.primary = b.dataset.color; render(); }));
  ['headingFont','bodyFont','dataFont','density'].forEach(id => document.querySelector(`#${id}`).addEventListener('change', e => { state[id] = e.target.value; render(); }));
  document.querySelector('#radius').addEventListener('input', e => { state.radius = Number(e.target.value); render(); });
  document.querySelector('#modeToggle').addEventListener('click', () => { state.mode = state.mode === 'dark' ? 'light' : 'dark'; render(); });
}

render();

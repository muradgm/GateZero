import { useEffect, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Crosshair,
  Layers3,
  Menu,
  MoveRight,
  Orbit,
  ShieldCheck,
  X,
  Zap
} from "lucide-react";
import logo from "./assets/trader-frame-logo.svg";
import evidenceArchitecture from "./assets/evidence-architecture.webp";
import LandingPage from "./LandingPage";
import AnimatedFavicon from "./AnimatedFavicon";

const palette = [
  { name: "Void", hex: "#090B0D", role: "Primary canvas" },
  { name: "Graphite", hex: "#111418", role: "Elevated surfaces" },
  { name: "Steel", hex: "#59616B", role: "Secondary information" },
  { name: "Mist", hex: "#E8ECEF", role: "Primary text" },
  { name: "Signal Cyan", hex: "#25D4FF", role: "Focus and active states" },
  { name: "Market Green", hex: "#39E58C", role: "Positive market signal" },
  { name: "Amber", hex: "#FFB84D", role: "Warnings and thresholds" },
  { name: "Risk Red", hex: "#FF5364", role: "Critical and negative states" }
];

const nav = [
  ["overview", "Overview"],
  ["logo", "Logo"],
  ["color", "Color"],
  ["type", "Typography"],
  ["system", "System"],
  ["visuals", "Data Viz"],
  ["product", "Product UI"],
  ["voice", "Voice"]
];

function BrandSystem() {
  const [active, setActive] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowSequence, setWindowSequence] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: "-12% 0px -55% 0px" }
    );
    nav.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-animate]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => target.classList.add("in-view"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.22, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [windowSequence]);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="app">
      <a className="skip-link" href="#overview">
        Skip to content
      </a>
      <header className="topbar">
        <button
          className="brand-button"
          onClick={() => jump("overview")}
          aria-label="Go to overview"
        >
          <img src={logo} alt="Trader Frame" />
        </button>
        <nav className="desktop-nav">
          {nav.map(([id, label]) => (
            <button
              className={active === id ? "active" : ""}
              aria-current={active === id ? "location" : undefined}
              key={id}
              onClick={() => jump(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <button
          className="menu-button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {menuOpen && (
        <div className="mobile-nav" id="mobile-navigation">
          {nav.map(([id, label]) => (
            <button key={id} onClick={() => jump(id)}>
              {label}
            </button>
          ))}
        </div>
      )}

      <main>
        <section id="overview" className="hero section">
          <div className="eyebrow">Brand Identity System / 01</div>
          <div className="hero-grid">
            <div>
              <WordmarkAssembly />
              <h1>Precision before execution.</h1>
              <p className="lede">
                A disciplined visual system for evidence-led market decisions. Frame the facts,
                expose uncertainty, and make risk approval visible before action.
              </p>
              <div className="hero-actions">
                <button className="primary" onClick={() => jump("logo")}>
                  Explore the system <MoveRight size={18} />
                </button>
                <span className="status">
                  <i /> Dark-first · Data-native · Built to scale
                </span>
              </div>
            </div>
            <div className="signal-scene" aria-label="Abstract market system visualization">
              <div className="axis axis-x" />
              <div className="axis axis-y" />
              <div className="focus-frame">
                <span>TF / EVIDENCE</span>
              </div>
              <div className="signal-line">
                {[16, 32, 26, 44, 38, 62, 52, 76, 68, 89].map((h, i) => (
                  <i key={i} style={{ height: h }} />
                ))}
              </div>
              <div className="scene-meta">
                <span>Sources 06</span>
                <span>Confidence 0.72</span>
                <span>Risk review required</span>
              </div>
            </div>
          </div>
          <div className="principles">
            {(
              [
                [Crosshair, "Precision", "Every element earns its place."],
                [Layers3, "Structure", "Information is framed, not decorated."],
                [Zap, "Velocity", "Fast interaction without visual noise."],
                [ShieldCheck, "Trust", "Professional, calm, and evidence-led."]
              ] as [ComponentType<{ size?: number }>, string, string][]
            ).map(([Icon, title, body]) => (
              <article key={title}>
                <Icon size={22} />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="logo" className="section">
          <SectionHead
            index="02"
            kicker="Logo system"
            title="Distinctive at scale. Disciplined in use."
            body="The wordmark carries the name. The Gate Frame symbol carries the behavior: evidence held inside a visible decision boundary, before approval."
          />
          <div className="logo-grid">
            <LogoPanel title="Primary / Dark" className="dark-panel" />
            <LogoPanel title="Reversed / Light" className="light-panel" invert />
            <div className="logo-card monogram-card">
              <span>Gate Frame / Symbol</span>
              <div className="monogram">
                <GateFrameMark label="Trader Frame Gate Frame symbol" />
              </div>
              <div className="optical-sizes" aria-label="Gate Frame optical size tests">
                <span>
                  <GateFrameMark decorative />
                  <b>16</b>
                </span>
                <span>
                  <GateFrameMark decorative />
                  <b>24</b>
                </span>
                <span>
                  <GateFrameMark decorative />
                  <b>48</b>
                </span>
              </div>
              <small>Use the micro drawing at 16–24px. Never substitute initials.</small>
            </div>
            <div className="logo-card clearspace-card">
              <span>Clear space</span>
              <div className="clearspace">
                <b>x</b>
                <img src={logo} alt="" />
                <b>x</b>
              </div>
              <small>Minimum clear space equals the cap height of the “T”.</small>
            </div>
          </div>
          <div className="rule-strip">
            <Rule ok text="Preserve the original proportions" />
            <Rule ok text="Wordmark: 120px minimum" />
            <Rule text="Do not condense or skew" />
            <Rule text="Do not add glow or effects" />
          </div>
        </section>

        <section id="color" className="section">
          <SectionHead
            index="03"
            kicker="Color system"
            title="Neutral by default. Signal only with purpose."
            body="The core identity is monochrome. Accent colors are reserved for state, focus, and market meaning—not decoration."
          />
          <div className="palette">
            {palette.map((c) => (
              <ColorCard key={c.hex} {...c} />
            ))}
          </div>
          <div className="semantic-table" aria-label="Semantic color usage">
            <div>
              <span>Color</span>
              <span>Use</span>
              <span>Never use for</span>
            </div>
            <div>
              <b className="cyan-dot">Signal Cyan</b>
              <span>Focus, selection, evidence links</span>
              <em>Profit or approval</em>
            </div>
            <div>
              <b className="green-dot">Market Green</b>
              <span>Verified or completed states</span>
              <em>Predicted upside</em>
            </div>
            <div>
              <b className="amber-dot">Amber</b>
              <span>Missing evidence, pending review</span>
              <em>Decorative emphasis</em>
            </div>
            <div>
              <b className="red-dot">Risk Red</b>
              <span>Policy breach, critical failure</span>
              <em>Routine negative movement</em>
            </div>
          </div>
          <div className="gradient-demo">
            <div>
              <span>Signal field</span>
              <h3>Depth without distraction.</h3>
              <p>
                Use gradients sparingly as environmental light, never as the primary carrier of
                information.
              </p>
            </div>
            <div className="orb">
              <i />
              <i />
              <i />
            </div>
          </div>
        </section>

        <section id="type" className="section">
          <SectionHead
            index="04"
            kicker="Typography"
            title="A rational hierarchy with technical detail."
            body="Space Grotesk gives the brand its editorial voice. IBM Plex Mono handles numbers, code, timestamps, and market data."
          />
          <div className="type-grid">
            <div className="type-sample">
              <span>Display / Space Grotesk</span>
              <div className="mega">
                Frame the
                <br />
                market.
              </div>
              <div className="weights">
                <b>Regular</b>
                <b>Medium</b>
                <b>Semibold</b>
              </div>
            </div>
            <div className="mono-sample">
              <span>Data / IBM Plex Mono</span>
              <pre>FRAME ID TF-0248 EVIDENCE 6 / 8 FRESHNESS 14 MIN RISK GATE PENDING</pre>
              <p>
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
                <br />
                abcdefghijklmnopqrstuvwxyz
                <br />
                0123456789 +−×÷%
              </p>
            </div>
          </div>
          <div className="scale-table">
            {[
              ["Display XL", "64 / 64", "Hero statements"],
              ["Heading L", "40 / 44", "Section titles"],
              ["Heading M", "24 / 30", "Card titles"],
              ["Body", "16 / 26", "Long-form content"],
              ["Label", "12 / 16", "UI metadata"],
              ["Data", "13 / 20", "Tables and metrics"]
            ].map((row) => (
              <div key={row[0]}>
                <b>{row[0]}</b>
                <span>{row[1]}</span>
                <em>{row[2]}</em>
              </div>
            ))}
          </div>
        </section>

        <section id="system" className="section">
          <SectionHead
            index="05"
            kicker="Graphic system"
            title="The frame is the visual idea."
            body="A modular language of focus boxes, layered planes, coordinates, and measured spacing turns the brand name into a repeatable system."
          />
          <div className="system-grid">
            <SystemTile title="Focus frame">
              <div className="focus-demo">
                <i />
                <i />
                <i />
                <b />
              </div>
            </SystemTile>
            <SystemTile title="Layered intelligence">
              <div className="layers-demo">
                <i />
                <i />
                <i />
              </div>
            </SystemTile>
            <SystemTile title="Measured motion">
              <div className="motion-demo">
                <span />
                <span />
                <span />
                <span />
              </div>
            </SystemTile>
            <SystemTile title="Spatial logic">
              <div className="orbit-demo">
                <Orbit size={78} />
                <i />
              </div>
            </SystemTile>
          </div>
          <div className="frame-grammar">
            <div>
              <span>01 / Observe</span>
              <b>Frame the relevant facts.</b>
              <p>Define scope, sources, and freshness before interpretation.</p>
            </div>
            <MoveRight aria-hidden="true" />
            <div>
              <span>02 / Verify</span>
              <b>Expose evidence and uncertainty.</b>
              <p>Show what supports the view, what conflicts, and what is missing.</p>
            </div>
            <MoveRight aria-hidden="true" />
            <div>
              <span>03 / Decide</span>
              <b>Make the gate visible.</b>
              <p>Separate operator judgment from risk approval and execution.</p>
            </div>
          </div>
          <div className="spacing">
            <span>Spacing scale</span>
            {[4, 8, 12, 16, 24, 32, 48, 64].map((v) => (
              <div key={v}>
                <i style={{ width: v }} />
                {v}
              </div>
            ))}
          </div>
        </section>

        <section id="visuals" className="section">
          <SectionHead
            index="06"
            kicker="Data visualization"
            title="Show the evidence, not the drama."
            body="Charts explain confidence, provenance, and risk. They avoid decorative volatility, implied forecasts, and color-only meaning."
          />
          <div className="viz-grid">
            <VizPanel label="Uncertainty / Range" title="Confidence is a band, not a promise.">
              <ConfidenceChart />
            </VizPanel>
            <VizPanel label="Provenance / Flow" title="Every decision traces back to evidence.">
              <EvidenceFlow />
            </VizPanel>
            <VizPanel label="Risk / Matrix" title="Thresholds remain visible before approval.">
              <RiskMatrix />
            </VizPanel>
          </div>
          <div className="illustration-strip">
            <div>
              <span>Frame / Focus</span>
              <FrameIllustration mode="focus" />
              <p>Isolate the decision-relevant field.</p>
            </div>
            <div>
              <span>Frame / Compare</span>
              <FrameIllustration mode="compare" />
              <p>Place supporting and conflicting evidence together.</p>
            </div>
            <div>
              <span>Frame / Gate</span>
              <FrameIllustration mode="gate" />
              <p>Make the boundary between review and action explicit.</p>
            </div>
          </div>
          <figure className="brand-image-panel" data-animate>
            <img
              src={evidenceArchitecture}
              loading="lazy"
              decoding="async"
              alt="Abstract evidence architecture made from layered graphite and glass frames around a precise cyan point"
            />
            <figcaption>
              <span>Original brand image / Evidence Architecture</span>
              <b>Complexity held inside a visible decision boundary.</b>
            </figcaption>
          </figure>
          <div className="viz-rules">
            <Rule ok text="Label source, unit, and freshness" />
            <Rule ok text="Show uncertainty and thresholds" />
            <Rule text="Do not imply future performance" />
            <Rule text="Do not encode meaning with color alone" />
          </div>
        </section>

        <section id="product" className="section">
          <SectionHead
            index="07"
            kicker="Product expression"
            title="Evidence first. Risk approval second."
            body="The UI makes provenance, uncertainty, and control visible together. A frame cannot advance until its evidence is complete and its risk has been reviewed by an operator."
          />
          <div className="market-demo-head">
            <div>
              <span>Animated dummy environment</span>
              <h3>Market context, separated into reviewable windows.</h3>
            </div>
            <button onClick={() => setWindowSequence((v) => v + 1)}>Replay sequence</button>
          </div>
          <MarketWindowDemo key={windowSequence} />
          <div className="product-shell">
            <aside>
              <img src={logo} alt="" />
              {["Review queue", "Evidence", "Risk gate", "Decisions", "Audit log"].map((x, i) => (
                <button className={i === 0 ? "selected" : ""} key={x}>
                  {x}
                </button>
              ))}
            </aside>
            <div className="dashboard">
              <div className="dash-head">
                <div>
                  <span>Operator review / Frame 0248</span>
                  <h3>Decision context</h3>
                </div>
                <button>
                  Inspect evidence <ArrowUpRight size={15} />
                </button>
              </div>
              <div className="gate-banner">
                <ShieldCheck size={18} />
                <div>
                  <b>Execution locked</b>
                  <span>Risk approval is required before this frame can advance.</span>
                </div>
                <em>Gate 02 / Pending</em>
              </div>
              <div className="metric-row">
                <Metric
                  label="Evidence coverage"
                  value="6 / 8"
                  delta="2 items missing"
                  tone="warning"
                />
                <Metric label="Source freshness" value="14 min" delta="Within policy" />
                <Metric
                  label="Risk exposure"
                  value="18.6%"
                  delta="Review required"
                  tone="warning"
                />
              </div>
              <div className="evidence-card">
                <div className="evidence-head">
                  <div>
                    <span>Evidence register</span>
                    <strong>What supports this decision?</strong>
                  </div>
                  <b>6 verified</b>
                </div>
                <div className="evidence-list">
                  <EvidenceRow
                    label="Market structure"
                    source="Dataset / 14 min ago"
                    status="Verified"
                  />
                  <EvidenceRow
                    label="Liquidity conditions"
                    source="Dataset / 18 min ago"
                    status="Verified"
                  />
                  <EvidenceRow
                    label="Invalidation threshold"
                    source="Operator input required"
                    status="Missing"
                    warning
                  />
                  <EvidenceRow
                    label="Maximum loss boundary"
                    source="Risk policy / current"
                    status="Review"
                    warning
                  />
                </div>
                <div className="decision-rule">
                  <span>Decision rule</span>
                  <b>No trade without evidence. No execution without risk approval.</b>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="voice" className="section voice-section">
          <SectionHead
            index="08"
            kicker="Brand voice"
            title="Clear. Confident. Calculated."
            body="Trader Frame speaks like an expert partner: specific, calm, and useful. No hype, no promises of effortless success."
          />
          <div className="voice-grid">
            <div className="voice-card">
              <span>Core promise</span>
              <h3>
                Evidence in view.
                <br />
                Risk in control.
              </h3>
            </div>
            <div className="voice-card">
              <span>Product line</span>
              <h3>
                Frame the market.
                <br />
                Stay in control.
              </h3>
            </div>
            <div className="voice-card">
              <span>Principle</span>
              <h3>
                Precision before
                <br />
                execution.
              </h3>
            </div>
          </div>
          <div className="tone-table">
            <div>
              <b>Say</b>
              <span>Build a sharper view of market risk.</span>
            </div>
            <div>
              <b>Avoid</b>
              <span>Unlock your limitless trading potential.</span>
            </div>
            <div>
              <b>Say</b>
              <span>See what matters before you act.</span>
            </div>
            <div>
              <b>Avoid</b>
              <span>Trade smarter and win more.</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <img src={logo} alt="Trader Frame" />
        <span>Brand Identity System — Concept Edition</span>
        <span>Built for demonstration and refinement</span>
      </footer>
    </div>
  );
}

function App() {
  const isBrandSystem = new URLSearchParams(window.location.search).get("view") === "brand";
  return (
    <>
      <AnimatedFavicon />
      {isBrandSystem ? <BrandSystem /> : <LandingPage />}
    </>
  );
}

function SectionHead({
  index,
  kicker,
  title,
  body
}: {
  index: string;
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <div className="section-head">
      <div className="eyebrow">
        {kicker} / {index}
      </div>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}
function LogoPanel({
  title,
  className,
  invert = false
}: {
  title: string;
  className: string;
  invert?: boolean;
}) {
  return (
    <div className={`logo-card ${className}`}>
      <span>{title}</span>
      <img
        src={logo}
        alt="Trader Frame wordmark"
        style={invert ? { filter: "brightness(0)" } : {}}
      />
      <small>Preferred wordmark lockup</small>
    </div>
  );
}
function Rule({ ok = false, text }: { ok?: boolean; text: string }) {
  return (
    <div>
      <span className={ok ? "ok" : "no"}>{ok ? <Check size={14} /> : <X size={14} />}</span>
      {text}
    </div>
  );
}
function ColorCard({ name, hex, role }: { name: string; hex: string; role: string }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 1200);
  };
  const feedback =
    copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy failed" : <Copy size={14} />;
  return (
    <button className="color-card" onClick={copy} aria-label={`Copy ${name} color ${hex}`}>
      <i style={{ background: hex }} />
      <span>
        <b>{name}</b>
        <code>{hex}</code>
        <small>{role}</small>
      </span>
      <em aria-live="polite">{feedback}</em>
    </button>
  );
}
function SystemTile({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="system-tile">
      <span>{title}</span>
      {children}
    </div>
  );
}
function Metric({
  label,
  value,
  delta,
  tone = "positive"
}: {
  label: string;
  value: string;
  delta: string;
  tone?: "positive" | "warning";
}) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <b className={tone}>{delta}</b>
    </div>
  );
}
function EvidenceRow({
  label,
  source,
  status,
  warning = false
}: {
  label: string;
  source: string;
  status: string;
  warning?: boolean;
}) {
  return (
    <div className="evidence-row">
      <i className={warning ? "warning" : ""} />
      <div>
        <b>{label}</b>
        <span>{source}</span>
      </div>
      <em className={warning ? "warning" : ""}>{status}</em>
    </div>
  );
}
function GateFrameMark({ label, decorative = false }: { label?: string; decorative?: boolean }) {
  return (
    <svg
      className="gate-frame-mark"
      viewBox="0 0 120 120"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
    >
      <path d="M72 18H18V72" />
      <path d="M48 102H102V48" />
      <circle cx="60" cy="60" r="5" />
    </svg>
  );
}
function WordmarkAssembly() {
  return (
    <div className="wordmark-assembly" data-animate>
      <img className="wordmark-base" src={logo} alt="Trader Frame logo" />
      <div className="wordmark-slices" aria-hidden="true">
        <img className="wordmark-slice slice-a" src={logo} alt="" />
        <img className="wordmark-slice slice-b" src={logo} alt="" />
        <img className="wordmark-slice slice-c" src={logo} alt="" />
        <img className="wordmark-slice slice-d" src={logo} alt="" />
      </div>
      <i className="wordmark-calibration" aria-hidden="true" />
      <span className="wordmark-index" aria-hidden="true">
        OPTICAL LOCK / 01
      </span>
    </div>
  );
}
function VizPanel({
  label,
  title,
  children
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="viz-panel">
      <span>{label}</span>
      <h3>{title}</h3>
      {children}
    </article>
  );
}
function ConfidenceChart() {
  return (
    <svg
      className="brand-chart"
      viewBox="0 0 420 230"
      role="img"
      aria-labelledby="confidence-title confidence-desc"
    >
      <title id="confidence-title">Confidence range over six review intervals</title>
      <desc id="confidence-desc">
        Observed confidence remains below the approval threshold, with a visible uncertainty band.
      </desc>
      <g className="chart-grid">
        <path d="M42 30V190H397M42 70H397M42 110H397M42 150H397" />
      </g>
      <path
        className="range"
        d="M42 154L110 126L178 136L246 90L314 78L397 62L397 105L314 116L246 130L178 164L110 153L42 181Z"
      />
      <path className="observed" d="M42 168L110 140L178 149L246 111L314 97L397 83" />
      <path className="threshold" d="M42 58H397" />
      <g className="chart-labels">
        <text x="42" y="211">
          T−5
        </text>
        <text x="213" y="211">
          Review interval
        </text>
        <text x="375" y="211">
          Now
        </text>
        <text x="290" y="50">
          Approval threshold
        </text>
        <text x="304" y="137">
          Observed + range
        </text>
      </g>
    </svg>
  );
}
function EvidenceFlow() {
  return (
    <svg
      className="brand-diagram"
      viewBox="0 0 420 230"
      role="img"
      aria-labelledby="flow-title flow-desc"
    >
      <title id="flow-title">Evidence provenance flow</title>
      <desc id="flow-desc">
        Three sources feed a verified evidence frame, followed by operator review and a locked risk
        gate.
      </desc>
      <g className="flow-lines">
        <path d="M78 52H128M78 112H128M78 172H128M238 112H274M344 112H384" />
      </g>
      <g className="source-nodes">
        <rect x="20" y="31" width="58" height="42" />
        <rect x="20" y="91" width="58" height="42" />
        <rect x="20" y="151" width="58" height="42" />
      </g>
      <rect className="evidence-node" x="128" y="71" width="110" height="82" />
      <rect className="operator-node" x="274" y="78" width="70" height="68" />
      <path className="gate-node" d="M384 78H404V146H384" />
      <g className="diagram-labels">
        <text x="32" y="57">
          S-01
        </text>
        <text x="32" y="117">
          S-02
        </text>
        <text x="32" y="177">
          S-03
        </text>
        <text x="148" y="107">
          VERIFIED
        </text>
        <text x="148" y="125">
          EVIDENCE
        </text>
        <text x="285" y="107">
          OPERATOR
        </text>
        <text x="289" y="125">
          REVIEW
        </text>
        <text x="371" y="168">
          LOCKED
        </text>
      </g>
    </svg>
  );
}
function RiskMatrix() {
  const cells = Array.from({ length: 16 });
  return (
    <svg
      className="risk-matrix"
      viewBox="0 0 420 230"
      role="img"
      aria-labelledby="risk-title risk-desc"
    >
      <title id="risk-title">Four by four risk matrix</title>
      <desc id="risk-desc">
        The current review sits at likelihood level two and impact level three, below a visible
        approval boundary.
      </desc>
      <g className="matrix-cells">
        {cells.map((_, i) => (
          <rect
            key={i}
            className={i === 9 ? "current" : i === 11 || i === 14 || i === 15 ? "blocked" : ""}
            x={84 + (i % 4) * 59}
            y={30 + Math.floor(i / 4) * 42}
            width="50"
            height="33"
          />
        ))}
      </g>
      <path className="matrix-boundary" d="M84 72H202V30H320" />
      <circle className="matrix-marker" cx="172" cy="130" r="6" />
      <g className="chart-labels">
        <text x="158" y="218">
          Likelihood →
        </text>
        <text transform="translate(25 154) rotate(-90)">Impact →</text>
        <text x="250" y="22">
          Approval boundary
        </text>
        <text x="184" y="132">
          Current review
        </text>
      </g>
    </svg>
  );
}
function FrameIllustration({ mode }: { mode: "focus" | "compare" | "gate" }) {
  return (
    <svg className={`frame-illustration ${mode}`} viewBox="0 0 260 130" aria-hidden="true">
      <path
        className="illustration-grid"
        d="M0 32H260M0 65H260M0 98H260M65 0V130M130 0V130M195 0V130"
      />
      {mode === "focus" && (
        <>
          <rect x="82" y="29" width="96" height="72" />
          <circle cx="130" cy="65" r="5" />
        </>
      )}
      {mode === "compare" && (
        <>
          <rect x="34" y="27" width="80" height="76" />
          <rect x="146" y="27" width="80" height="76" />
          <path d="M114 65H146" />
          <circle cx="103" cy="48" r="4" />
          <path d="M158 84h38" />
        </>
      )}
      {mode === "gate" && (
        <>
          <rect x="28" y="32" width="74" height="66" />
          <path d="M102 65H160M160 25V105" />
          <rect className="gate-stop" x="181" y="45" width="48" height="40" />
        </>
      )}
    </svg>
  );
}
function MarketWindowDemo() {
  return (
    <div
      className="market-window-stage"
      data-animate
      aria-label="Animated dummy market analysis windows"
    >
      <article className="market-window context-window">
        <header>
          <span>Context / TF-0248</span>
          <em>Observed</em>
        </header>
        <div className="window-value">
          <b>Range structure</b>
          <small>Source age / 14 min</small>
        </div>
        <svg
          viewBox="0 0 360 120"
          role="img"
          aria-label="Observed market range with uncertainty envelope"
        >
          <path
            className="window-grid"
            d="M0 30H360M0 60H360M0 90H360M90 0V120M180 0V120M270 0V120"
          />
          <path
            className="window-band"
            d="M0 85L45 73L90 78L135 48L180 58L225 42L270 55L315 32L360 45V76L315 61L270 81L225 68L180 82L135 71L90 99L45 91L0 105Z"
          />
          <path
            className="window-line"
            d="M0 95L45 82L90 89L135 60L180 70L225 54L270 68L315 46L360 59"
          />
        </svg>
        <footer>
          <span>Uncertainty visible</span>
          <b>Evidence 04 / 05</b>
        </footer>
      </article>
      <article className="market-window liquidity-window">
        <header>
          <span>Liquidity / Depth</span>
          <em>Fresh</em>
        </header>
        <div className="depth-bars" aria-label="Liquidity depth distribution">
          {[38, 55, 76, 92, 68, 48, 31].map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
        <footer>
          <span>Asymmetry detected</span>
          <b>Review note</b>
        </footer>
      </article>
      <article className="market-window risk-window">
        <header>
          <span>Risk gate / 02</span>
          <em>Pending</em>
        </header>
        <div className="risk-dial">
          <i />
          <b>18.6%</b>
          <span>Exposure</span>
        </div>
        <div className="window-checks">
          <span>✓ Policy current</span>
          <span>! Boundary missing</span>
          <span>! Operator review</span>
        </div>
        <footer>
          <span>Execution locked</span>
          <b>2 requirements</b>
        </footer>
      </article>
    </div>
  );
}

export default App;

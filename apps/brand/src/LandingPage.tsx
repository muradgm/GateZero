import { lazy, Suspense, useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BatteryLow,
  Check,
  CircleDashed,
  Database,
  Eye,
  FileCheck2,
  LockKeyhole,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import logo from "./assets/trader-frame-logo.svg";
import { productGate } from "./productGate";

const EvidenceScene = lazy(() => import("./EvidenceScene"));
const gateStages = [
  ["observe", "Signal"],
  ["frame", "Scope"],
  ["verify", "Verify"],
  ["risk", "Risk"],
  ["review", "Review"],
  ["record", "Record"]
] as const;
type GateStage = (typeof gateStages)[number][0];
type WorkspaceView = "queue" | "evidence" | "risk" | "decisions" | "audit";
const workspaceViews: [WorkspaceView, string][] = [
  ["queue", "Review queue"],
  ["evidence", "Evidence"],
  ["risk", "Risk gate"],
  ["decisions", "Decisions"],
  ["audit", "Audit log"]
];
const stageNarrative: Record<GateStage, [string, string]> = {
  observe: [
    "Fragmented signal",
    "Inputs arrive with different quality, freshness, and provenance."
  ],
  frame: [
    "Scope established",
    "The frame defines what belongs to the decision and what remains outside."
  ],
  verify: [
    "Evidence inspected",
    "Verified inputs align while contradictions remain visibly unresolved."
  ],
  risk: [
    "Boundary engaged",
    "Incomplete or high-risk evidence cannot progress beyond the amber gate."
  ],
  review: [
    "Operator review",
    "A human examines the evidence and determines the next controlled state."
  ],
  record: [
    "Audit record",
    "The inspected configuration becomes a local, reviewable decision record."
  ]
};

export default function LandingPage() {
  const [gateStage, setGateStage] = useState<GateStage>("observe");
  const [manualStage, setManualStage] = useState(false);
  const [reducedEffects, setReducedEffects] = useState(
    () => window.matchMedia("(max-width: 680px), (prefers-reduced-motion: reduce)").matches
  );
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>("queue");

  useEffect(() => {
    if (
      manualStage ||
      reducedEffects ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = window.setInterval(() => {
      setGateStage(
        (current) =>
          gateStages[(gateStages.findIndex(([id]) => id === current) + 1) % gateStages.length][0]
      );
    }, 2800);
    return () => window.clearInterval(timer);
  }, [manualStage, reducedEffects]);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-landing-reveal]");
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
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <a href="#top" className="landing-brand" aria-label="Trader Frame home">
          <img src={logo} alt="Trader Frame" />
        </a>
        <nav aria-label="Landing page navigation">
          <a href="#method">Method</a>
          <a href="#product-preview">Product</a>
          <a href="#governance">Governance</a>
        </nav>
        <a className="nav-cta" href="#product-preview">
          Inspect a frame <ArrowRight size={15} />
        </a>
      </header>

      <main id="top">
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <div className="landing-kicker">
              <i /> Evidence-led decision support
            </div>
            <h1>
              Frame the evidence.
              <br />
              <span>Control the decision.</span>
            </h1>
            <p>
              Trader Frame turns fragmented market context into a reviewable decision record—making
              evidence, uncertainty, and risk approval visible before action.
            </p>
            <div className="landing-actions">
              <a className="landing-primary" href="#product-preview">
                Explore the workflow <ArrowRight size={17} />
              </a>
              <a className="landing-secondary" href="#method">
                See how it works <ArrowDown size={16} />
              </a>
            </div>
            <div className="landing-guardrail">
              <LockKeyhole size={16} />
              <span>No trade without evidence. No execution without risk approval.</span>
            </div>
          </div>
          <div className="landing-scene-wrap">
            <Suspense
              fallback={
                <div
                  className="scene-loading"
                  aria-label="Loading three-dimensional evidence architecture"
                >
                  <i />
                  <span>Resolving evidence field</span>
                </div>
              }
            >
              <EvidenceScene stage={gateStage} reducedEffects={reducedEffects} />
            </Suspense>
            <div className="scene-corner top-left" />
            <div className="scene-corner bottom-right" />
            <button
              className="effects-toggle"
              aria-pressed={reducedEffects}
              onClick={() => setReducedEffects((value) => !value)}
            >
              {reducedEffects ? <BatteryLow size={13} /> : <Sparkles size={13} />}
              <span>{reducedEffects ? "Reduced effects" : "Full effects"}</span>
            </button>
            <div className="scene-narrative" aria-live="polite">
              <span>{gateStages.findIndex(([id]) => id === gateStage) + 1} / 6</span>
              <b>{stageNarrative[gateStage][0]}</b>
              <p>{stageNarrative[gateStage][1]}</p>
              {gateStage === "record" && (
                <a href="#product-preview">
                  Inspect this record <ArrowRight size={13} />
                </a>
              )}
            </div>
            <div className="gate-stage-control" aria-label="Evidence Gate sequence">
              {gateStages.map(([id, label], index) => (
                <button
                  key={id}
                  className={gateStage === id ? "active" : ""}
                  aria-pressed={gateStage === id}
                  onClick={() => {
                    setGateStage(id);
                    setManualStage(true);
                  }}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-proof" aria-label="Product principles">
          <div>
            <span>01</span>
            <b>Evidence before interpretation</b>
          </div>
          <div>
            <span>02</span>
            <b>Risk before execution</b>
          </div>
          <div>
            <span>03</span>
            <b>Operator control throughout</b>
          </div>
        </section>

        <section
          className="landing-contrast"
          aria-label="Trader Frame positioning"
          data-landing-reveal
        >
          <span>Why Trader Frame</span>
          <p>Most trading tools help you act faster.</p>
          <h2>Trader Frame helps you decide whether you should act at all.</h2>
        </section>

        <section className="landing-outcomes" aria-labelledby="outcomes-title" data-landing-reveal>
          <div className="landing-section-copy">
            <span>Controlled outcomes / 01</span>
            <h2 id="outcomes-title">Stopping is a valid decision.</h2>
            <p>
              The system never converts uncertainty into false confidence. Every frame resolves into
              an explicit, reviewable condition.
            </p>
          </div>
          <div className="outcome-grid">
            <article className="needs">
              <CircleDashed size={22} />
              <span>01 / Needs evidence</span>
              <h3>Progression remains open.</h3>
              <p>Required inputs are missing, stale, or insufficiently supported.</p>
              <b>Return to evidence</b>
            </article>
            <article className="blocked">
              <AlertTriangle size={22} />
              <span>02 / Blocked by risk</span>
              <h3>The boundary refuses progression.</h3>
              <p>Evidence exists, but exposure or policy constraints remain unresolved.</p>
              <b>Review the violated rule</b>
            </article>
            <article className="cleared">
              <FileCheck2 size={22} />
              <span>03 / Cleared for local simulation</span>
              <h3>Inspection may continue.</h3>
              <p>The operator may proceed to controlled paper-simulation planning only.</p>
              <b>No broker execution</b>
            </article>
          </div>
        </section>

        <section className="landing-product" id="product-preview" data-landing-reveal>
          <div className="landing-section-copy">
            <span>Operating environment / 02</span>
            <h2>Evidence and limitations, side by side.</h2>
            <p>
              {productGate.publicLabel} for inspecting decision context—never a live execution
              surface.
            </p>
          </div>
          <div className="landing-product-shell">
            <aside>
              <img src={logo} alt="" />
              {workspaceViews.map(([id, label]) => (
                <button
                  key={id}
                  className={workspaceView === id ? "selected" : ""}
                  aria-pressed={workspaceView === id}
                  onClick={() => setWorkspaceView(id)}
                >
                  {label}
                </button>
              ))}
            </aside>
            <div className="landing-workspace">
              <header>
                <div>
                  <span>Frame / TF-0248</span>
                  <h3>{workspaceViews.find(([id]) => id === workspaceView)?.[1]}</h3>
                </div>
                <em>{productGate.id}</em>
              </header>
              <div className="landing-gate">
                <LockKeyhole size={18} />
                <div>
                  <b>Execution locked</b>
                  <span>Two requirements remain unresolved.</span>
                </div>
                <em>Gate 02 / Pending</em>
              </div>
              {(workspaceView === "queue" || workspaceView === "evidence") && (
                <>
                  <div className="landing-metrics">
                    <article>
                      <span>Evidence coverage</span>
                      <b>6 / 8</b>
                      <em>2 missing</em>
                    </article>
                    <article>
                      <span>Source freshness</span>
                      <b>14 min</b>
                      <em className="verified">Within policy</em>
                    </article>
                    <article>
                      <span>Risk exposure</span>
                      <b>18.6%</b>
                      <em>Review required</em>
                    </article>
                  </div>
                  <div className="landing-evidence-list">
                    <header>
                      <b>
                        {workspaceView === "queue"
                          ? "Evidence requiring attention"
                          : "Evidence register"}
                      </b>
                      <span>6 verified</span>
                    </header>
                    {[
                      ["Market structure", "Dataset / 14 min ago", "Verified", true],
                      ["Liquidity conditions", "Dataset / 18 min ago", "Verified", true],
                      ["Invalidation threshold", "Operator input required", "Missing", false],
                      ["Maximum loss boundary", "Risk policy / current", "Review", false]
                    ].map(([name, source, status, ok]) => (
                      <div key={name as string}>
                        <i className={ok ? "ok" : ""} />
                        <span>
                          <b>{name}</b>
                          <small>{source}</small>
                        </span>
                        <em className={ok ? "ok" : ""}>{status}</em>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {workspaceView === "risk" && (
                <div className="inspection-panel risk-inspection">
                  <header>
                    <span>Risk boundary / RB-02</span>
                    <b>Review required</b>
                  </header>
                  <div className="risk-scale">
                    <i />
                    <span>Observed exposure</span>
                    <strong>18.6%</strong>
                    <small>Policy threshold / 15.0%</small>
                  </div>
                  <dl>
                    <div>
                      <dt>Violated rule</dt>
                      <dd>Maximum planned loss exceeds bounded threshold.</dd>
                    </div>
                    <div>
                      <dt>Required reconsideration</dt>
                      <dd>Reduce exposure or document a narrower invalidation level.</dd>
                    </div>
                    <div>
                      <dt>Operator action</dt>
                      <dd>Inspect only. Progression remains blocked.</dd>
                    </div>
                  </dl>
                </div>
              )}
              {workspaceView === "decisions" && (
                <div className="inspection-panel decision-inspection">
                  <header>
                    <span>Decision trace / DT-0248</span>
                    <b>Needs evidence</b>
                  </header>
                  <div className="decision-timeline">
                    <div className="done">
                      <i />
                      Observed<span>Inputs framed</span>
                    </div>
                    <div className="done">
                      <i />
                      Verified<span>6 of 8 resolved</span>
                    </div>
                    <div className="current">
                      <i />
                      Risk review<span>Boundary exceeded</span>
                    </div>
                    <div>
                      <i />
                      Simulation plan<span>Unavailable</span>
                    </div>
                  </div>
                  <p>
                    No decision is promoted while required evidence and risk conditions remain
                    unresolved.
                  </p>
                </div>
              )}
              {workspaceView === "audit" && (
                <div className="inspection-panel audit-inspection">
                  <header>
                    <span>Immutable local trace</span>
                    <b>4 events</b>
                  </header>
                  {[
                    ["14:32:01", "Frame created", "Operator"],
                    ["14:32:08", "Market structure verified", "System check"],
                    ["14:32:11", "Invalidation threshold missing", "Gate rule"],
                    ["14:32:18", "Progression blocked", "Risk boundary"]
                  ].map(([time, event, source]) => (
                    <div className="audit-row" key={time}>
                      <time>{time}</time>
                      <b>{event}</b>
                      <span>{source}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="landing-method" id="method" data-landing-reveal>
          <div className="landing-section-copy">
            <span>Decision architecture / 03</span>
            <h2>From signal noise to an auditable frame.</h2>
            <p>Every step makes its inputs, limitations, and operator responsibility explicit.</p>
          </div>
          <div className="method-steps">
            <article>
              <div>
                <Eye size={22} />
                <span>Observe</span>
              </div>
              <h3>Frame what matters.</h3>
              <p>Bring sources, freshness, market structure, and scope into one bounded view.</p>
              <b>Sources / Context / Freshness</b>
            </article>
            <article>
              <div>
                <Database size={22} />
                <span>Verify</span>
              </div>
              <h3>Expose uncertainty.</h3>
              <p>
                See supporting evidence, contradictions, missing inputs, and invalidation conditions
                together.
              </p>
              <b>Coverage / Conflict / Confidence</b>
            </article>
            <article>
              <div>
                <ShieldCheck size={22} />
                <span>Decide</span>
              </div>
              <h3>Make the gate visible.</h3>
              <p>
                Separate operator judgment from risk approval. Incomplete frames cannot advance.
              </p>
              <b>Review / Boundary / Approval</b>
            </article>
          </div>
        </section>

        <section className="landing-governance" id="governance" data-landing-reveal>
          <div>
            <span>Governance / 04</span>
            <h2>Built to slow the wrong decision down.</h2>
          </div>
          <div className="governance-list">
            <p>
              <Check size={18} /> Evidence coverage stays visible.
            </p>
            <p>
              <Check size={18} /> Uncertainty is never hidden behind a score.
            </p>
            <p>
              <Check size={18} /> Risk approval remains an explicit operator gate.
            </p>
            <p>
              <Check size={18} /> Every decision leaves an auditable record.
            </p>
          </div>
        </section>

        <section className="landing-close">
          <span>Trader Frame / Decision intelligence</span>
          <h2>
            See what matters.
            <br />
            Know what is missing.
          </h2>
          <a href="#product-preview">
            Explore the product frame <ArrowRight size={18} />
          </a>
        </section>
      </main>
      <footer className="landing-footer">
        <img src={logo} alt="Trader Frame" />
        <span>Evidence-led operator decision support</span>
        <a href="?view=brand">View brand system</a>
      </footer>
    </div>
  );
}

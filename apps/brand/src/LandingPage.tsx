import { lazy, Suspense } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Database,
  Eye,
  LockKeyhole,
  ShieldCheck
} from "lucide-react";
import logo from "./assets/trader-frame-logo.svg";

const EvidenceScene = lazy(() => import("./EvidenceScene"));

export default function LandingPage() {
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
        <a className="nav-cta" href="?view=brand">
          Brand system <ArrowRight size={15} />
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
              <EvidenceScene />
            </Suspense>
            <div className="scene-corner top-left" />
            <div className="scene-corner bottom-right" />
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

        <section className="landing-method" id="method">
          <div className="landing-section-copy">
            <span>Decision architecture / 01</span>
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

        <section className="landing-product" id="product-preview">
          <div className="landing-section-copy">
            <span>Operating environment / 02</span>
            <h2>Evidence and limitations, side by side.</h2>
            <p>
              A local product preview for inspecting decision context—never a live execution
              surface.
            </p>
          </div>
          <div className="landing-product-shell">
            <aside>
              <img src={logo} alt="" />
              <button className="selected">Review queue</button>
              <button>Evidence</button>
              <button>Risk gate</button>
              <button>Decisions</button>
              <button>Audit log</button>
            </aside>
            <div className="landing-workspace">
              <header>
                <div>
                  <span>Frame / TF-0248</span>
                  <h3>Decision context</h3>
                </div>
                <em>Local inspection</em>
              </header>
              <div className="landing-gate">
                <LockKeyhole size={18} />
                <div>
                  <b>Execution locked</b>
                  <span>Two requirements remain unresolved.</span>
                </div>
                <em>Gate 02 / Pending</em>
              </div>
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
                  <b>Evidence register</b>
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
            </div>
          </div>
        </section>

        <section className="landing-governance" id="governance">
          <div>
            <span>Governance / 03</span>
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

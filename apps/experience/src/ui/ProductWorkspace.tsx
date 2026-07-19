type ProductWorkspaceProps = {
  active: boolean;
};

const evidenceRows = [
  ["Market structure", "Dataset / 14 min ago", "Verified", "ok"],
  ["Liquidity conditions", "Dataset / 18 min ago", "Verified", "ok"],
  ["Invalidation threshold", "Operator input", "Resolved", "ok"],
  ["Maximum loss boundary", "Risk policy / current", "Approved", "review"]
] as const;

export function ProductWorkspace({ active }: ProductWorkspaceProps) {
  return (
    <section className={`product-workspace${active ? " is-active" : ""}`} aria-hidden={!active}>
      <aside className="workspace-sidebar">
        <div className="workspace-mark">TF</div>
        <span className="workspace-brand">TraderFrame</span>
        {['Review queue', 'Evidence', 'Risk gate', 'Decisions', 'Audit log'].map((item, index) => (
          <button key={item} type="button" className={index === 0 ? "selected" : ""} tabIndex={active ? 0 : -1}>
            {item}
          </button>
        ))}
      </aside>

      <div className="workspace-main">
        <header className="workspace-header">
          <div>
            <span>Frame / TF-0248</span>
            <h3>Decision context</h3>
          </div>
          <em>Local inspection</em>
        </header>

        <div className="workspace-risk-banner">
          <span className="risk-icon">◇</span>
          <div>
            <strong>Risk review approved</strong>
            <small>Evidence requirements satisfied. Execution remains externally controlled.</small>
          </div>
          <em>Gate 02 / Approved</em>
        </div>

        <div className="workspace-metrics">
          <article><span>Evidence coverage</span><strong>8 / 8</strong><em className="ok">Complete</em></article>
          <article><span>Source freshness</span><strong>14 min</strong><em className="ok">Within policy</em></article>
          <article><span>Risk exposure</span><strong>18.6%</strong><em>Approved boundary</em></article>
        </div>

        <div className="workspace-register">
          <header><strong>Evidence register</strong><span>8 verified</span></header>
          {evidenceRows.map(([name, source, status, tone]) => (
            <div className="workspace-row" key={name}>
              <i className={tone} />
              <span><strong>{name}</strong><small>{source}</small></span>
              <em className={tone}>{status}</em>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

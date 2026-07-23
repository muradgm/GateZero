import { mountConvictionAtlasEngine } from "./conviction-atlas-engine.js";

export function mountConvictionAtlasRenderer(options) {
  const root = options.root;
  root?.setAttribute("data-renderer", "loading");

  let activeEngine = null;
  let destroyed = false;
  let queuedScenario = "rec";
  let queuedPaused = false;

  const fallback = (reason) => {
    if (destroyed || activeEngine) return;
    root?.setAttribute("data-renderer", "2d");
    root?.setAttribute("data-renderer-reason", reason);
    activeEngine = mountConvictionAtlasEngine(options);
    activeEngine.setScenario?.(queuedScenario);
    activeEngine.setPaused?.(queuedPaused);
    window.dispatchEvent(new CustomEvent("conviction-atlas-renderer", { detail: { mode: "2d", reason } }));
  };

  import("./conviction-atlas-3d-engine.js")
    .then(({ mountConvictionAtlas3D }) => {
      if (destroyed) return;
      activeEngine = mountConvictionAtlas3D(options);
      root?.setAttribute("data-renderer", "3d");
      root?.removeAttribute("data-renderer-reason");
      activeEngine.setScenario?.(queuedScenario);
      activeEngine.setPaused?.(queuedPaused);
      window.dispatchEvent(new CustomEvent("conviction-atlas-renderer", { detail: { mode: "3d" } }));
    })
    .catch((error) => {
      console.warn("Conviction Atlas 3D renderer unavailable; using 2D fallback.", error);
      fallback("WebGL or Three.js initialization failed.");
    });

  window.setTimeout(() => {
    if (!activeEngine) fallback("3D renderer exceeded the startup budget.");
  }, 5000);

  return {
    setScenario(id) {
      queuedScenario = id;
      activeEngine?.setScenario?.(id);
    },
    setPaused(paused) {
      queuedPaused = paused;
      activeEngine?.setPaused?.(paused);
    },
    destroy() {
      destroyed = true;
      activeEngine?.destroy?.();
    }
  };
}

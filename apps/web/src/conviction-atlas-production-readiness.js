/* global document, window, performance, matchMedia, requestAnimationFrame */

const root = document.querySelector(".atlas");
const landscape = document.querySelector(".landscape");
const canvas = document.querySelector(".atlas-canvas");

if (!root || !landscape) throw new Error("Missing Conviction Atlas production surface.");

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const lowPowerDevice = (navigator.hardwareConcurrency ?? 8) <= 4 || (navigator.deviceMemory ?? 8) <= 4;
const supportsCanvas = Boolean(canvas?.getContext?.("2d"));

const state = {
  quality: reducedMotion || lowPowerDevice ? "reduced" : "full",
  pausedByVisibility: false,
  frameSamples: [],
  lastFrame: performance.now()
};

const status = document.createElement("section");
status.className = "production-status";
status.setAttribute("aria-label", "Experience quality and fallback controls");
status.innerHTML = `
  <div class="production-status-copy" aria-live="polite">
    <span>Experience mode</span>
    <strong data-quality-label>${state.quality === "full" ? "Full fidelity" : "Reduced fidelity"}</strong>
    <small data-quality-reason>${qualityReason()}</small>
  </div>
  <div class="production-status-actions">
    <button type="button" data-quality="full" aria-pressed="${state.quality === "full"}">Full</button>
    <button type="button" data-quality="reduced" aria-pressed="${state.quality === "reduced"}">Reduced</button>
    <button type="button" data-quality="static" aria-pressed="false">Static</button>
  </div>
`;

root.prepend(status);

const qualityLabel = status.querySelector("[data-quality-label]");
const qualityReason = status.querySelector("[data-quality-reason]");
const qualityButtons = [...status.querySelectorAll("[data-quality]")];

qualityButtons.forEach((button) => {
  button.addEventListener("click", () => setQuality(button.dataset.quality, "Selected manually."));
});

if (!supportsCanvas) setQuality("static", "Canvas rendering is unavailable in this browser.");
else setQuality(state.quality, qualityReason());

window.addEventListener("error", (event) => {
  if (!String(event.filename || "").includes("conviction-atlas")) return;
  setQuality("static", "An interactive rendering error triggered the safe static fallback.");
});

window.addEventListener("unhandledrejection", () => {
  setQuality("static", "An interactive module failed and the safe static fallback was activated.");
});

document.addEventListener("visibilitychange", () => {
  const pauseButton = document.querySelector("[data-action=pause]");
  if (document.hidden && pauseButton?.getAttribute("aria-pressed") !== "true") {
    pauseButton?.click();
    state.pausedByVisibility = true;
  } else if (!document.hidden && state.pausedByVisibility) {
    pauseButton?.click();
    state.pausedByVisibility = false;
  }
});

function setQuality(mode, reason) {
  if (!mode) return;
  state.quality = mode;
  root.dataset.quality = mode;
  landscape.dataset.quality = mode;
  qualityButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.quality === mode)));
  if (qualityLabel) qualityLabel.textContent = mode === "full" ? "Full fidelity" : mode === "reduced" ? "Reduced fidelity" : "Static fallback";
  if (qualityReason) qualityReason.textContent = reason;

  const pauseButton = document.querySelector("[data-action=pause]");
  if (mode === "static" && pauseButton?.getAttribute("aria-pressed") !== "true") pauseButton?.click();
}

function qualityReason() {
  if (reducedMotion) return "System reduced-motion preference detected.";
  if (lowPowerDevice) return "Lower-power device profile detected.";
  return "Interactive rendering enabled.";
}

function monitorFrames(now) {
  const delta = now - state.lastFrame;
  state.lastFrame = now;
  if (!document.hidden && state.quality === "full" && delta > 0) {
    state.frameSamples.push(1000 / delta);
    if (state.frameSamples.length > 120) state.frameSamples.shift();
    if (state.frameSamples.length === 120) {
      const average = state.frameSamples.reduce((sum, value) => sum + value, 0) / state.frameSamples.length;
      if (average < 38) setQuality("reduced", `Average frame rate fell to ${Math.round(average)} FPS.`);
    }
  }
  requestAnimationFrame(monitorFrames);
}

requestAnimationFrame(monitorFrames);

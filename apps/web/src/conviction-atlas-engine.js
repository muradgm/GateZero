/* global cancelAnimationFrame, devicePixelRatio, matchMedia, requestAnimationFrame, ResizeObserver */

const scenarios = {
  bull: { label: "Bull case", probability: 28, color: "#20d5ea", risk: 24, bias: "Bullish" },
  side: { label: "Sideways", probability: 18, color: "#2787ff", risk: 31, bias: "Neutral" },
  bear: { label: "Bear case", probability: 22, color: "#ff8b35", risk: 67, bias: "Bearish" },
  rec: { label: "Recommended path", probability: 62, color: "#c4a5ff", risk: 38, bias: "Moderately Bullish" }
};

export function mountConvictionAtlasEngine({ canvas, root, onScenarioChange }) {
  if (!(canvas instanceof HTMLCanvasElement)) return () => {};

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return () => {};

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    frame: 0,
    activeScenario: "rec",
    pointerX: 0.5,
    pointerY: 0.5,
    running: !reducedMotion,
    raf: 0
  };

  const streams = Array.from({ length: 72 }, (_, index) => ({
    lane: index % 9,
    progress: ((index * 37) % 100) / 100,
    speed: 0.0008 + (index % 7) * 0.00013,
    size: 0.7 + (index % 4) * 0.35
  }));

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    state.dpr = Math.min(devicePixelRatio || 1, 2);
    state.width = Math.max(1, Math.floor(bounds.width));
    state.height = Math.max(1, Math.floor(bounds.height));
    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    draw();
  };

  const draw = () => {
    const { width, height } = state;
    context.clearRect(0, 0, width, height);
    drawAtmosphere(context, width, height, state);
    drawContourField(context, width, height, state);
    drawRoutes(context, width, height, state);
    drawStreams(context, width, height, state, streams);
    drawRiskZones(context, width, height, state);
  };

  const tick = () => {
    state.frame += 1;
    streams.forEach((particle) => {
      particle.progress = (particle.progress + particle.speed) % 1;
    });
    draw();
    if (state.running) state.raf = requestAnimationFrame(tick);
  };

  const setScenario = (scenarioId) => {
    if (!scenarios[scenarioId]) return;
    state.activeScenario = scenarioId;
    root?.setAttribute("data-active-scenario", scenarioId);
    onScenarioChange?.({ id: scenarioId, ...scenarios[scenarioId] });
    draw();
  };

  const handlePointer = (event) => {
    const bounds = canvas.getBoundingClientRect();
    state.pointerX = (event.clientX - bounds.left) / Math.max(bounds.width, 1);
    state.pointerY = (event.clientY - bounds.top) / Math.max(bounds.height, 1);
  };

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  canvas.addEventListener("pointermove", handlePointer);
  canvas.addEventListener("pointerleave", () => {
    state.pointerX = 0.5;
    state.pointerY = 0.5;
  });

  resize();
  setScenario("rec");
  if (state.running) state.raf = requestAnimationFrame(tick);

  return {
    setScenario,
    setPaused(paused) {
      state.running = !paused && !reducedMotion;
      cancelAnimationFrame(state.raf);
      if (state.running) state.raf = requestAnimationFrame(tick);
      else draw();
    },
    destroy() {
      cancelAnimationFrame(state.raf);
      observer.disconnect();
      canvas.removeEventListener("pointermove", handlePointer);
    }
  };
}

function drawAtmosphere(ctx, width, height, state) {
  const gradient = ctx.createRadialGradient(
    width * (0.55 + (state.pointerX - 0.5) * 0.06),
    height * (0.46 + (state.pointerY - 0.5) * 0.04),
    10,
    width * 0.55,
    height * 0.48,
    width * 0.55
  );
  gradient.addColorStop(0, "rgba(35, 113, 174, 0.18)");
  gradient.addColorStop(0.45, "rgba(66, 45, 144, 0.08)");
  gradient.addColorStop(1, "rgba(2, 6, 11, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawContourField(ctx, width, height, state) {
  ctx.save();
  ctx.translate(0, height * 0.08);
  ctx.lineWidth = 0.65;

  for (let ring = 0; ring < 36; ring += 1) {
    const yBase = height * (0.18 + ring * 0.018);
    ctx.beginPath();
    for (let step = 0; step <= 100; step += 1) {
      const x = (step / 100) * width;
      const ridge = Math.sin(step * 0.19 + ring * 0.5) * (10 + ring * 0.55);
      const basin = Math.sin(step * 0.055 - ring * 0.24) * 20;
      const perspective = Math.pow(Math.abs(step - 52) / 52, 1.6) * ring * 0.9;
      const y = yBase + ridge + basin + perspective;
      if (step === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = ring % 5 === 0 ? "rgba(55, 126, 166, 0.34)" : "rgba(38, 86, 116, 0.22)";
    ctx.stroke();
  }

  ctx.restore();
}

function drawRoutes(ctx, width, height, state) {
  const routeDefinitions = {
    bull: [0.05, 0.42, 0.32, 0.35, 0.52, 0.22, 0.76, 0.27],
    side: [0.05, 0.50, 0.28, 0.47, 0.51, 0.40, 0.76, 0.35],
    bear: [0.05, 0.60, 0.30, 0.55, 0.52, 0.48, 0.86, 0.58],
    rec: [0.10, 0.66, 0.34, 0.58, 0.55, 0.62, 0.93, 0.76]
  };

  Object.entries(routeDefinitions).forEach(([id, route]) => {
    const active = state.activeScenario === id;
    const scenario = scenarios[id];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(route[0] * width, route[1] * height);
    ctx.bezierCurveTo(route[2] * width, route[3] * height, route[4] * width, route[5] * height, route[6] * width, route[7] * height);
    ctx.strokeStyle = scenario.color;
    ctx.lineWidth = active ? 4.2 : 1.4;
    ctx.globalAlpha = active ? 0.98 : 0.3;
    ctx.shadowColor = scenario.color;
    ctx.shadowBlur = active ? 22 : 6;
    ctx.setLineDash(active ? [18, 8] : [7, 10]);
    ctx.lineDashOffset = -state.frame * (active ? 0.55 : 0.18);
    ctx.stroke();
    ctx.restore();
  });
}

function drawStreams(ctx, width, height, state, particles) {
  const palette = ["#3977ff", "#8d55ff", "#b667ff", "#1fd1d7", "#7adf70", "#e6dc52", "#ff9b36", "#ff792f", "#ff3c34"];
  particles.forEach((particle) => {
    const startY = height * (0.26 + particle.lane * 0.055);
    const progress = particle.progress;
    const x = width * (0.02 + progress * 0.52);
    const convergence = Math.pow(progress, 1.45);
    const targetY = height * 0.49;
    const y = startY + (targetY - startY) * convergence + Math.sin(progress * 12 + particle.lane) * 3;
    const color = palette[particle.lane];
    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.globalAlpha = Math.sin(progress * Math.PI) * 0.9;
    ctx.beginPath();
    ctx.arc(x, y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawRiskZones(ctx, width, height, state) {
  const pulse = 1 + Math.sin(state.frame * 0.035) * 0.08;
  [[0.36, 0.78, 42], [0.76, 0.83, 48]].forEach(([x, y, radius]) => {
    ctx.save();
    ctx.translate(width * x, height * y);
    ctx.scale(pulse, pulse * 0.55);
    const gradient = ctx.createRadialGradient(0, 0, 2, 0, 0, radius);
    gradient.addColorStop(0, "rgba(255, 59, 52, 0.18)");
    gradient.addColorStop(1, "rgba(255, 59, 52, 0)");
    ctx.fillStyle = gradient;
    ctx.strokeStyle = "rgba(255, 59, 52, 0.6)";
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
}

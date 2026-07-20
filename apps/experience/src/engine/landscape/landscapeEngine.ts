import type { DirectionalBias, IntelligenceState } from "../intelligence";
import type { CandidateRoute, LandscapeOptions, LandscapePoint, LandscapeState } from "./types";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function seeded(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function dominantBias(state: IntelligenceState): DirectionalBias {
  return (Object.entries(state.directionalBalance).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "neutral") as DirectionalBias;
}

function sampleField(
  x: number,
  z: number,
  state: IntelligenceState,
  size: number
): LandscapePoint {
  const nx = x / size;
  const nz = z / size;
  const directionalTilt =
    (state.directionalBalance.bullish - state.directionalBalance.bearish) * nx * 1.8;
  const confidencePeak =
    Math.exp(-((nx - 0.18) ** 2 + (nz + 0.06) ** 2) * 7) * state.confidence * 2.7;
  const secondaryPeak =
    Math.exp(-((nx + 0.34) ** 2 + (nz - 0.22) ** 2) * 10) *
    state.directionalBalance.neutral *
    1.8;
  const riskValley =
    Math.exp(-((nx + 0.05) ** 2 + (nz - 0.28) ** 2) * 12) * state.risk * 3.1;
  const contradictionFracture =
    Math.sin((nx * 5.2 + nz * 3.8) * Math.PI) * state.contradiction * 0.55;
  const lowFrequency = Math.sin(nx * Math.PI * 2.4) * Math.cos(nz * Math.PI * 2.1) * 0.22;
  const elevation =
    confidencePeak + secondaryPeak + directionalTilt + lowFrequency + contradictionFracture - riskValley;

  return {
    x,
    z,
    elevation,
    confidence: clamp01(state.confidence * (0.72 + confidencePeak * 0.12)),
    risk: clamp01(state.risk * (0.7 + riskValley * 0.18)),
    contradiction: clamp01(state.contradiction * (0.72 + Math.abs(contradictionFracture))),
    freshness: state.freshness
  };
}

function createRoute(
  index: number,
  count: number,
  state: IntelligenceState,
  size: number,
  random: () => number,
  dominant: DirectionalBias
): CandidateRoute {
  const bias: DirectionalBias = index % 5 === 0 ? "neutral" : index % 3 === 0 ? "bearish" : "bullish";
  const biasBalance = state.directionalBalance[bias];
  const startZ = (random() - 0.5) * size * 0.68;
  const amplitude = 0.35 + random() * 0.9;
  const phase = random() * Math.PI * 2;
  const points: [number, number, number][] = [];
  const steps = 28;

  for (let step = 0; step < steps; step += 1) {
    const t = step / (steps - 1);
    const x = -size * 0.5 + t * size;
    const curve = Math.sin(t * Math.PI * (1.1 + random() * 0.2) + phase) * amplitude;
    const direction = bias === "bullish" ? 1 : bias === "bearish" ? -1 : 0;
    const z = startZ + curve + direction * t * size * 0.14;
    const field = sampleField(x, z, state, size);
    points.push([x, field.elevation + 0.08 + index * 0.002, z]);
  }

  const confidence = clamp01(state.confidence * 0.62 + biasBalance * 0.38);
  const contradiction = clamp01(state.contradiction * (0.72 + random() * 0.4));
  const risk = clamp01(state.risk * (0.7 + random() * 0.45));
  const dominantBoost = bias === dominant ? 0.2 : 0;
  const weight = clamp01(confidence * 0.58 + biasBalance * 0.3 + dominantBoost - contradiction * 0.18 - risk * 0.22);

  return {
    id: `route:${index}`,
    bias,
    points,
    weight,
    confidence,
    contradiction,
    risk,
    visible: weight > 0.16,
    dominant: false
  };
}

export function buildLandscape(
  source: IntelligenceState,
  options: LandscapeOptions = {}
): LandscapeState {
  const resolution = Math.max(12, Math.floor(options.resolution ?? 48));
  const size = options.size ?? 9;
  const routeCount = Math.max(12, Math.floor(options.routeCount ?? 96));
  const random = seeded(options.seed ?? 2407);
  const points: LandscapePoint[] = [];

  for (let row = 0; row < resolution; row += 1) {
    for (let column = 0; column < resolution; column += 1) {
      const x = -size / 2 + (column / (resolution - 1)) * size;
      const z = -size / 2 + (row / (resolution - 1)) * size;
      points.push(sampleField(x, z, source, size));
    }
  }

  const thesisBias = dominantBias(source);
  const routes = Array.from({ length: routeCount }, (_, index) =>
    createRoute(index, routeCount, source, size, random, thesisBias)
  );
  const winner = routes.filter((route) => route.visible).sort((a, b) => b.weight - a.weight)[0];
  const resolvedRoutes = routes.map((route) => ({ ...route, dominant: route.id === winner?.id }));

  return {
    source,
    resolution,
    size,
    points,
    routes: resolvedRoutes,
    dominantRouteId: winner?.id ?? null,
    contourDensity: 0.35 + source.confidence * 0.65,
    fractureStrength: source.contradiction,
    valleyDepth: source.risk,
    surfaceEnergy: clamp01(source.confidence * 0.46 + source.freshness * 0.34 - source.risk * 0.2)
  };
}

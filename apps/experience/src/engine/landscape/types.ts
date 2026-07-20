import type { DirectionalBias, IntelligenceState } from "../intelligence";

export type LandscapePoint = {
  x: number;
  z: number;
  elevation: number;
  confidence: number;
  risk: number;
  contradiction: number;
  freshness: number;
};

export type CandidateRoute = {
  id: string;
  bias: DirectionalBias;
  points: readonly [number, number, number][];
  weight: number;
  confidence: number;
  contradiction: number;
  risk: number;
  visible: boolean;
  dominant: boolean;
};

export type LandscapeState = {
  source: IntelligenceState;
  resolution: number;
  size: number;
  points: readonly LandscapePoint[];
  routes: readonly CandidateRoute[];
  dominantRouteId: string | null;
  contourDensity: number;
  fractureStrength: number;
  valleyDepth: number;
  surfaceEnergy: number;
};

export type LandscapeOptions = {
  resolution?: number;
  size?: number;
  routeCount?: number;
  seed?: number;
};

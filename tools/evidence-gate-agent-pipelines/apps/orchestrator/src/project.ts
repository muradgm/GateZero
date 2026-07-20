import type { ProjectContext, ProjectManifest } from "@eg/core";
import { pipelineOrder } from "@eg/pipelines";

export const context: ProjectContext = {
  projectId: "traderframe-evidence-gate",
  productName: "TraderFrame — Evidence Gate",
  productDescription:
    "A private trading decision-intelligence experience that transforms fragmented market evidence into explainable, risk-aware decisions.",
  targetAudience: [
    "Independent traders",
    "Portfolio managers",
    "Research-led market participants"
  ],
  businessGoal:
    "Demonstrate TraderFrame's evidence-first decision process through a premium interactive 3D narrative.",
  coreMessage:
    "Market conviction becomes credible when evidence is filtered, challenged, approved and recorded transparently.",
  brandPrinciples: [
    "Evidence first",
    "Transparent reasoning",
    "User control",
    "Risk awareness",
    "Calm precision"
  ],
  visualReferences: [
    "Awwwards-level interactive storytelling",
    "Scientific visualization",
    "Premium financial interfaces",
    "Controlled cinematic lighting"
  ],
  technicalConstraints: {
    targetFpsDesktop: 60,
    targetFpsMobile: 30,
    maxInitialDownloadMb: 4,
    reducedMotionRequired: true,
    mobileFallbackRequired: true
  },
  accessibilityRequirements: [
    "Keyboard operability",
    "Reduced-motion mode",
    "Readable DOM alternative",
    "WCAG AA contrast",
    "Non-WebGL fallback"
  ]
};

export function createManifest(): ProjectManifest {
  const now = new Date().toISOString();

  const pipelines = {} as ProjectManifest["pipelines"];

  for (const id of pipelineOrder) {
    pipelines[id] = {
      status: "pending",
      artifacts: []
    };
  }

  return {
    project: {
      id: context.projectId,
      version: "0.2.0",
      status: "active",
      createdAt: now,
      updatedAt: now
    },
    pipelineOrder,
    pipelines,
    constraints: context.technicalConstraints
  };
}
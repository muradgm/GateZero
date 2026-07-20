export const traderFrameCreativeSystem = {
  product: {
    name: "TraderFrame",
    category: "Private trading decision intelligence",
    definition:
      "A private platform that interprets market structure, events, sentiment, flows, technical evidence, and risk context to form an explainable directional thesis.",
    wedge:
      "TraderFrame turns fragmented market evidence into one explainable, risk-aware trading decision.",
    actions: ["act", "wait", "reduce", "reject"] as const
  },
  concept: {
    id: "conviction-atlas",
    publicName: "Conviction Atlas",
    workingName: "Decision Landscape",
    metaphor:
      "A changing topographic map of possible market futures where evidence reshapes routes, risk closes unsafe paths, and one conditional recommendation emerges.",
    stages: ["ingest", "map", "weight", "filter-risk", "choose", "decide"] as const
  },
  semantics: {
    verifiedEvidence: "cyan",
    selectedThesis: "violet",
    uncertainty: "amber",
    invalidation: "red",
    context: "neutral"
  },
  principles: [
    "Reasoning before recommendation",
    "Probability, never certainty",
    "Contradiction remains visible",
    "Risk may override direction",
    "The user retains final control",
    "Motion must explain state change",
    "Private by design"
  ] as const,
  prohibitedClaims: [
    "guaranteed prediction",
    "certainty",
    "winning signal",
    "autonomous execution",
    "market-beating performance"
  ] as const,
  layers: {
    creativeThinking: [
      "product-strategy",
      "creative-direction",
      "information-architecture",
      "experience-narrative",
      "art-direction"
    ],
    production: [
      "concept-art",
      "storyboard-animatic",
      "design-system",
      "3d-assets",
      "motion-camera",
      "shader-vfx",
      "implementation",
      "qa-optimization",
      "deployment"
    ]
  }
} as const;

export type ConvictionAtlasStage =
  (typeof traderFrameCreativeSystem.concept.stages)[number];

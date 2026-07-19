export const experienceStages = [
  { id: "signal", label: "Signal", title: "Fragmented context enters the system.", body: "Sources arrive with different levels of freshness, confidence, and relevance." },
  { id: "frame", label: "Frame", title: "Scope becomes explicit.", body: "The decision frame bounds what belongs, what is missing, and what remains outside scope." },
  { id: "verify", label: "Verify", title: "Evidence resolves into states.", body: "Verified inputs stabilize. Contradictions split. Missing evidence remains visible." },
  { id: "risk", label: "Risk", title: "The boundary stops progression.", body: "The system slows the decision down until unresolved risk conditions are reviewed." },
  { id: "operator", label: "Operator", title: "Human judgment remains explicit.", body: "The operator completes the evidence and owns the approval decision." },
  { id: "record", label: "Record", title: "The decision becomes auditable.", body: "Evidence, limits, approval, and outcome compress into a durable record." },
  { id: "interface", label: "Interface", title: "The machine becomes the product.", body: "The spatial system resolves into the TraderFrame review workspace." }
] as const;

export type ExperienceStageId = (typeof experienceStages)[number]["id"];

export function getStageIndex(stage: ExperienceStageId) {
  return experienceStages.findIndex((item) => item.id === stage);
}

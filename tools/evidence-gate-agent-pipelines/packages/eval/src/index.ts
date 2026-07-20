import type {
  EvaluationCriterion,
  EvaluationResult,
  PipelineId,
  StageResult
} from "@eg/core";

const rubrics: Record<PipelineId, Array<{ name: string; weight: number }>> = {
  strategy: [
    { name: "productTruth", weight: 0.25 },
    { name: "clarity", weight: 0.2 },
    { name: "differentiation", weight: 0.2 },
    { name: "credibility", weight: 0.2 },
    { name: "narrativePotential", weight: 0.15 }
  ],
  "concept-art": [
    { name: "brandFit", weight: 0.2 },
    { name: "originality", weight: 0.15 },
    { name: "clarity", weight: 0.2 },
    { name: "motionPotential", weight: 0.15 },
    { name: "technicalFeasibility", weight: 0.2 },
    { name: "distinctiveness", weight: 0.1 }
  ],
  storyboard: [
    { name: "narrativeClarity", weight: 0.25 },
    { name: "continuity", weight: 0.2 },
    { name: "interactionLogic", weight: 0.2 },
    { name: "cameraConsistency", weight: 0.15 },
    { name: "accessibility", weight: 0.2 }
  ],
  "design-system": [
    { name: "consistency", weight: 0.25 },
    { name: "usability", weight: 0.2 },
    { name: "accessibility", weight: 0.25 },
    { name: "implementationReadiness", weight: 0.2 },
    { name: "brandFit", weight: 0.1 }
  ],
  "modeling-3d": [
    { name: "geometryQuality", weight: 0.25 },
    { name: "animationReadiness", weight: 0.2 },
    { name: "performance", weight: 0.25 },
    { name: "brandFit", weight: 0.15 },
    { name: "reusability", weight: 0.15 }
  ],
  animation: [
    { name: "meaning", weight: 0.25 },
    { name: "timing", weight: 0.2 },
    { name: "spatialClarity", weight: 0.2 },
    { name: "accessibility", weight: 0.2 },
    { name: "performance", weight: 0.15 }
  ],
  "shader-vfx": [
    { name: "narrativePurpose", weight: 0.25 },
    { name: "visualQuality", weight: 0.2 },
    { name: "readability", weight: 0.2 },
    { name: "performance", weight: 0.25 },
    { name: "fallbackQuality", weight: 0.1 }
  ],
  implementation: [
    { name: "correctness", weight: 0.25 },
    { name: "architecture", weight: 0.2 },
    { name: "maintainability", weight: 0.15 },
    { name: "performance", weight: 0.2 },
    { name: "accessibility", weight: 0.2 }
  ],
  qa: [
    { name: "functionalCoverage", weight: 0.25 },
    { name: "performanceConfidence", weight: 0.25 },
    { name: "accessibilityConfidence", weight: 0.25 },
    { name: "releaseReadiness", weight: 0.25 }
  ]
};

function score(seed: string, index: number): number {
  let hash = 0;
  for (const char of `${seed}:${index}`) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return 8 + (hash % 12) / 10;
}

export class EvaluationEngine {
  evaluate(
    pipelineId: PipelineId,
    stages: StageResult[],
    threshold: number
  ): EvaluationResult {
    const criteria: EvaluationCriterion[] = rubrics[pipelineId].map(
      (criterion, index) => ({
        ...criterion,
        score: score(`${pipelineId}:${stages.length}`, index),
        notes:
          "Baseline automated score. Replace with evidence-backed evaluators for production."
      })
    );

    const total = criteria.reduce(
      (sum, criterion) => sum + criterion.score * criterion.weight,
      0
    );

    return {
      score: Number(total.toFixed(2)),
      threshold,
      passed: total >= threshold,
      criteria,
      hardFailures: []
    };
  }
}

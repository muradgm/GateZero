import test from "node:test";
import assert from "node:assert/strict";
import { pipelineOrder, pipelines } from "../packages/pipelines/src/index.js";

test("contains nine role-based pipelines", () => {
  assert.equal(pipelineOrder.length, 9);
  assert.deepEqual(Object.keys(pipelines), pipelineOrder);
});

test("all pipelines have stages and approval gates", () => {
  for (const pipeline of Object.values(pipelines)) {
    assert.ok(pipeline.stages.length >= 7);
    assert.equal(pipeline.humanApprovalRequired, true);
    assert.ok(pipeline.qualityThreshold >= 8);
  }
});

test("dependencies only point backward", () => {
  for (const [index, id] of pipelineOrder.entries()) {
    for (const dependency of pipelines[id].dependencies) {
      assert.ok(pipelineOrder.indexOf(dependency) < index);
    }
  }
});

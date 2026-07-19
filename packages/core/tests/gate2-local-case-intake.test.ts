import { describe, expect, it } from "vitest";
import {
  assembleLocalCaseCatalogItem,
  buildLocalCaseCatalog,
  findLocalCase,
  Gate2CaseIntakeError,
  parseLocalResearchCaseDraft
} from "../src/index.js";

const valid = {
  case_id: "case-001",
  title: "Local case",
  strategy_idea_ref: "ops/truth/PROJECT_TRUTH.md",
  evidence_refs: ["docs/engineering/TESTING_STRATEGY.md"],
  risk_review_ref: "ops/truth/RISK_RULES.md",
  freshness_status: "fresh",
  provenance_refs: ["packages/fixtures/data/case.json"],
  limitation_notes: ["Local evidence only."],
  operator_review_required: true,
  local_only: true,
  read_only: true,
  action_route_created: false,
  created_at: "2026-07-20T00:00:00.000Z",
  verified_at: "2026-07-20T00:00:00.000Z"
};

describe("Gate 2 local case intake", () => {
  it("parses valid JSON without side effects", () => {
    expect(parseLocalResearchCaseDraft(JSON.stringify(valid)).case_id).toBe("case-001");
  });

  it("returns a neutral invalid JSON error", () => {
    expectCode(() => parseLocalResearchCaseDraft("{"), "invalid_json");
  });

  it.each(["api_key", "password", "token", "https://example.com"])(
    "rejects unsafe content %s",
    (unsafe) =>
      expectCode(
        () => parseLocalResearchCaseDraft(JSON.stringify({ ...valid, title: unsafe })),
        "unsafe_content"
      )
  );

  it("classifies missing risk review", () => {
    expectCode(
      () => parseLocalResearchCaseDraft(JSON.stringify({ ...valid, risk_review_ref: undefined })),
      "missing_risk_review"
    );
  });

  it("assembles a deterministic review-required item", () => {
    const item = assembleLocalCaseCatalogItem(parseLocalResearchCaseDraft(JSON.stringify(valid)));
    expect(item).toMatchObject({
      status: "review_required",
      local_only: true,
      read_only: true,
      action_route_created: false
    });
  });

  it("keeps stale evidence blocked", () => {
    const draft = parseLocalResearchCaseDraft(
      JSON.stringify({ ...valid, freshness_status: "stale" })
    );
    expect(assembleLocalCaseCatalogItem(draft).status).toBe("blocked");
  });

  it("rejects duplicate ids", () => {
    const draft = parseLocalResearchCaseDraft(JSON.stringify(valid));
    expectCode(() => buildLocalCaseCatalog([draft, draft]), "duplicate_case_id");
  });

  it("sorts catalog items deterministically", () => {
    const second = parseLocalResearchCaseDraft(JSON.stringify({ ...valid, case_id: "case-002" }));
    const first = parseLocalResearchCaseDraft(JSON.stringify(valid));
    expect(buildLocalCaseCatalog([second, first]).items.map((item) => item.case_id)).toEqual([
      "case-001",
      "case-002"
    ]);
  });

  it("finds a case or returns a bounded not-found error", () => {
    const catalog = buildLocalCaseCatalog([parseLocalResearchCaseDraft(JSON.stringify(valid))]);
    expect(findLocalCase(catalog, "case-001").case_id).toBe("case-001");
    expectCode(() => findLocalCase(catalog, "missing"), "case_not_found");
  });
});

function expectCode(run: () => unknown, code: string) {
  try {
    run();
    throw new Error("Expected intake operation to fail.");
  } catch (error) {
    expect(error).toBeInstanceOf(Gate2CaseIntakeError);
    expect((error as Gate2CaseIntakeError).code).toBe(code);
  }
}

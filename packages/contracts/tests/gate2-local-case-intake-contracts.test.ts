import { describe, expect, it } from "vitest";
import {
  Gate2LocalCaseCatalogSchema,
  Gate2LocalCaseRevisionSchema,
  Gate2LocalCaseRevisionTimelineSchema,
  Gate2LocalResearchCaseDraftSchema
} from "../src/index.js";

const draft = {
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
} as const;

describe("Gate 2 local case intake contracts", () => {
  it("accepts a bounded local draft", () => {
    expect(Gate2LocalResearchCaseDraftSchema.parse(draft)).toEqual(draft);
  });

  it.each(["https://example.com/case", "../outside.json", "C:\\case.json"])(
    "rejects nonlocal source %s",
    (source) => {
      expect(() =>
        Gate2LocalResearchCaseDraftSchema.parse({ ...draft, strategy_idea_ref: source })
      ).toThrow();
    }
  );

  it("rejects missing risk review", () => {
    expect(() =>
      Gate2LocalResearchCaseDraftSchema.parse({ ...draft, risk_review_ref: undefined })
    ).toThrow();
  });

  it("rejects action authority", () => {
    expect(() =>
      Gate2LocalResearchCaseDraftSchema.parse({ ...draft, action_route_created: true })
    ).toThrow();
  });

  it("requires verification semantics to match freshness", () => {
    expect(() =>
      Gate2LocalResearchCaseDraftSchema.parse({
        ...draft,
        freshness_status: "unverified",
        verified_at: draft.verified_at
      })
    ).toThrow();
    expect(() =>
      Gate2LocalResearchCaseDraftSchema.parse({
        ...draft,
        verified_at: null
      })
    ).toThrow();
  });

  it("accepts an immutable revision envelope", () => {
    const revisedDraft = {
      ...draft,
      title: "Revised local case",
      freshness_status: "unverified",
      verified_at: null
    } as const;
    expect(
      Gate2LocalCaseRevisionSchema.parse({
        revision_id: "case-001-r1",
        case_id: "case-001",
        revision_number: 1,
        parent_revision_id: null,
        base_content_hash: "a".repeat(64),
        revised_content_hash: "b".repeat(64),
        changed_fields: ["title"],
        revision_reason: "Clarify the operator case title.",
        created_at: "2026-07-23T00:00:00.000Z",
        revised_draft: revisedDraft,
        operator_review_required: true,
        local_only: true,
        read_only: true,
        action_route_created: false
      }).revision_id
    ).toBe("case-001-r1");
  });

  it("accepts a bounded blocked revision timeline", () => {
    const entry = {
      revision_id: "case-001-r1",
      revision_number: 1,
      parent_revision_id: null,
      changed_fields: ["title"],
      revision_reason: "Clarify the operator case title.",
      created_at: "2026-07-23T00:00:00.000Z",
      base_content_hash: "a".repeat(64),
      revised_content_hash: "b".repeat(64),
      evidence_refs: ["docs/engineering/TESTING_STRATEGY.md"],
      provenance_refs: ["ops/truth/PROJECT_TRUTH.md"],
      risk_review_ref: "ops/truth/RISK_RULES.md",
      limitation_notes: ["Local evidence only."],
      freshness_status: "unverified",
      status: "blocked",
      operator_review_required: true,
      local_only: true,
      read_only: true,
      action_route_created: false
    } as const;
    expect(
      Gate2LocalCaseRevisionTimelineSchema.parse({
        case_id: "case-001",
        status: "blocked_pending_review",
        revision_count: 1,
        entries: [entry],
        operator_review_required: true,
        local_only: true,
        read_only: true,
        action_route_created: false
      }).entries[0]
    ).toEqual(entry);
  });

  it("rejects inconsistent timeline counts and parent chains", () => {
    const empty = {
      case_id: "case-001",
      status: "no_revisions",
      revision_count: 0,
      entries: [],
      operator_review_required: true,
      local_only: true,
      read_only: true,
      action_route_created: false
    } as const;
    expect(() =>
      Gate2LocalCaseRevisionTimelineSchema.parse({ ...empty, revision_count: 1 })
    ).toThrow();
  });

  it("rejects duplicate catalog ids", () => {
    const item = {
      case_id: "case-001",
      title: "Local case",
      status: "review_required",
      freshness_status: "fresh",
      evidence_count: 1,
      source_refs: ["ops/truth/PROJECT_TRUTH.md"],
      risk_review_ref: "ops/truth/RISK_RULES.md",
      limitation_notes: ["Local only."],
      operator_review_required: true,
      local_only: true,
      read_only: true,
      action_route_created: false,
      verified_at: "2026-07-20T00:00:00.000Z",
      revision_id: null,
      revision_number: 0,
      revision_pending_review: false
    };
    expect(() =>
      Gate2LocalCaseCatalogSchema.parse({
        catalog_id: "catalog-001",
        generated_at: "2026-07-20T00:00:00.000Z",
        items: [item, item],
        local_only: true,
        read_only: true,
        operator_review_required: true,
        action_route_created: false
      })
    ).toThrow();
  });
});

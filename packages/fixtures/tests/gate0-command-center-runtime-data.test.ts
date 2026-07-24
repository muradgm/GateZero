import { describe, expect, it } from "vitest";
import { CommandCenterRuntimeDataSchema } from "../../../packages/contracts/src/index.js";
import { buildCommandCenterRuntimeData } from "../../../scripts/build-command-center-runtime-data.js";

describe("Gate 0 command center runtime data", () => {
  it("builds a local runtime snapshot from accepted operating records", async () => {
    const result = await buildCommandCenterRuntimeData();

    expect(result).toEqual({
      latestPacket: "TRD-768",
      localVerification: "106 files / 788 tests",
      ciRun: "27787807220",
      ciState: "success",
      lastVerifiedCommit: "6e6f513",
      acceptedRecords: 768,
      evidenceRecords: 18
    });
    expect(CommandCenterRuntimeDataSchema.parse(result)).toEqual(result);
  });
});

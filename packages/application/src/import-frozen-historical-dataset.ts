import type {
  FrozenHistoricalDatasetFailure,
  FrozenHistoricalDatasetImportResult,
  FrozenHistoricalDatasetManifest,
  HistoricalAdapterResult
} from "@traderframe/contracts";
import {
  FrozenHistoricalDatasetImportResultSchema,
  FrozenHistoricalDatasetManifestSchema
} from "@traderframe/contracts";
import { adaptDukascopyCsv } from "./adapt-dukascopy-csv.js";

export type ImportFrozenHistoricalDatasetInput = {
  manifest: FrozenHistoricalDatasetManifest;
  csv: string;
};

export type VerifiedFrozenHistoricalDataset = {
  manifest: FrozenHistoricalDatasetManifest;
  adapter: HistoricalAdapterResult;
  verification: FrozenHistoricalDatasetImportResult;
};

export function importFrozenHistoricalDataset(
  input: ImportFrozenHistoricalDatasetInput
): VerifiedFrozenHistoricalDataset {
  const manifest = FrozenHistoricalDatasetManifestSchema.parse(input.manifest);
  const adapter = adaptDukascopyCsv({
    sourceId: manifest.datasetId,
    csv: input.csv,
    rangeStart: manifest.rangeStart,
    rangeEnd: manifest.rangeEnd,
    licenseNote: manifest.licenseNote
  });

  const failures: FrozenHistoricalDatasetFailure[] = [];

  if (adapter.snapshot.provider !== manifest.provider) {
    failures.push({
      code: "MANIFEST_MISMATCH",
      message: `Adapter provider ${adapter.snapshot.provider} does not match ${manifest.provider}.`
    });
  }

  if (
    adapter.snapshot.instrument !== manifest.instrument ||
    adapter.snapshot.timeframe !== manifest.timeframe ||
    adapter.snapshot.timezone !== manifest.timezone
  ) {
    failures.push({
      code: "MANIFEST_MISMATCH",
      message: "Adapter instrument, timeframe, or timezone does not match the frozen manifest."
    });
  }

  if (adapter.snapshot.rawContentHash !== manifest.expectedSha256) {
    failures.push({
      code: "HASH_MISMATCH",
      message: `Source hash ${adapter.snapshot.rawContentHash} does not match manifest hash ${manifest.expectedSha256}.`
    });
  }

  if (adapter.rawRowCount !== manifest.expectedRowCount) {
    failures.push({
      code: "ROW_COUNT_MISMATCH",
      message: `Source contains ${adapter.rawRowCount} data rows; manifest requires ${manifest.expectedRowCount}.`
    });
  }

  if (adapter.failures.length > 0) {
    failures.push({
      code: "ADAPTER_FAILURE",
      message: `Provider adapter reported ${adapter.failures.length} failure(s).`
    });
  }

  const verification = FrozenHistoricalDatasetImportResultSchema.parse({
    datasetId: manifest.datasetId,
    ready: failures.length === 0,
    sourceHash: adapter.snapshot.rawContentHash,
    expectedHash: manifest.expectedSha256,
    rawRowCount: adapter.rawRowCount,
    acceptedRowCount: adapter.acceptedRowCount,
    failures,
    adapterFailureCount: adapter.failures.length
  });

  return { manifest, adapter, verification };
}

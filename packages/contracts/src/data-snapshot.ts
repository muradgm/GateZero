import { z } from "zod";
import {
  DateRangeSchema,
  IdentifierSchema,
  IsoDateTimeSchema,
  NonEmptyStringSchema
} from "./schemas.js";

export const DataSnapshotSchema = z
  .object({
    data_snapshot_id: IdentifierSchema,
    source_name: NonEmptyStringSchema,
    source_version: NonEmptyStringSchema,
    symbol_universe: z.array(NonEmptyStringSchema).min(1),
    date_range: DateRangeSchema,
    timeframe: NonEmptyStringSchema,
    timezone: NonEmptyStringSchema,
    missing_data_behavior: NonEmptyStringSchema,
    corporate_action_policy: NonEmptyStringSchema,
    data_adjustment_policy: z.enum(["raw", "adjusted", "not_applicable"]),
    captured_at: IsoDateTimeSchema,
    quality_warnings: z.array(NonEmptyStringSchema)
  })
  .strict();

export type DataSnapshot = z.infer<typeof DataSnapshotSchema>;

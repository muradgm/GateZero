import { readFileSync, writeFileSync } from "node:fs";

const replacements: Record<string, Array<[string, string]>> = {
  "packages/application/src/aggregate-market-candles.ts": [
    [
      "    const first = group[0];\n    const last = group[group.length - 1];",
      "    const first = group[0];\n    const last = group[group.length - 1];\n    if (!first || !last) {\n      throw new Error(\"complete aggregation window must contain first and last candles\");\n    }"
    ]
  ],
  "packages/application/src/derive-eurusd-overlap-observation.ts": [
    [
      "    const candidate = window[index];\n    const current = window[extremeIndex];\n    if (",
      "    const candidate = window[index];\n    const current = window[extremeIndex];\n    if (!candidate || !current) continue;\n    if ("
    ],
    [
      "  const extreme = window[extremeIndex];\n  const distance =",
      "  const extreme = window[extremeIndex];\n  if (!extreme) throw new Error(\"pullback window must contain an extreme candle\");\n  const distance ="
    ],
    [
      "    const sweepCandle = candles[sweepIndex];\n    const penetration =",
      "    const sweepCandle = candles[sweepIndex];\n    if (!sweepCandle) continue;\n    const penetration ="
    ],
    [
      "    for (let index = sweepIndex; index <= lastReclaimIndex; index += 1) {\n      const reclaimed =\n        direction === \"LONG\"\n          ? candles[index].close > swingLevel\n          : candles[index].close < swingLevel;",
      "    for (let index = sweepIndex; index <= lastReclaimIndex; index += 1) {\n      const candle = candles[index];\n      if (!candle) continue;\n      const reclaimed =\n        direction === \"LONG\" ? candle.close > swingLevel : candle.close < swingLevel;"
    ],
    [
      "    selected = {\n      sweepIndex,\n      reclaimIndex,\n      sweepCandle,\n      reclaimCandle: candles[reclaimIndex],",
      "    const reclaimCandle = candles[reclaimIndex];\n    if (!reclaimCandle) continue;\n\n    selected = {\n      sweepIndex,\n      reclaimIndex,\n      sweepCandle,\n      reclaimCandle,"
    ],
    [
      "  for (let index = sweep.reclaimIndex; index < candles.length; index += 1) {\n    const confirmed =\n      direction === \"LONG\"\n        ? candles[index].close > triggerLevel\n        : candles[index].close < triggerLevel;\n    if (confirmed) {\n      return {\n        candle: candles[index],",
      "  for (let index = sweep.reclaimIndex; index < candles.length; index += 1) {\n    const candle = candles[index];\n    if (!candle) continue;\n    const confirmed = direction === \"LONG\" ? candle.close > triggerLevel : candle.close < triggerLevel;\n    if (confirmed) {\n      return {\n        candle,"
    ],
    [
      "    const candle = candles[index];\n    const previousClose = candles[index - 1].close;",
      "    const candle = candles[index];\n    const previous = candles[index - 1];\n    if (!candle || !previous) {\n      throw new Error(\"ATR window must contain current and previous candles\");\n    }\n    const previousClose = previous.close;"
    ]
  ],
  "packages/application/src/evaluate-trace-quality.ts": [
    [
      "  const appliedCaps = applicable\n    .filter((item) => item.status !== \"COMPLETE\" && hardCaps[item.requirementId])\n    .map((item) => ({ requirementId: item.requirementId, ...hardCaps[item.requirementId] }))",
      "  const appliedCaps = applicable\n    .flatMap((item) => {\n      if (item.status === \"COMPLETE\") return [];\n      const cap = hardCaps[item.requirementId];\n      return cap ? [{ requirementId: item.requirementId, ...cap }] : [];\n    })"
    ]
  ],
  "packages/application/src/validate-market-candles.ts": [
    [
      "    const previous = normalized[index - 1];\n    const current = normalized[index];\n    const actualGap =",
      "    const previous = normalized[index - 1];\n    const current = normalized[index];\n    if (!previous || !current) continue;\n    const actualGap ="
    ]
  ],
  "packages/application/tests/aggregate-market-candles.test.ts": [
    ["result.candles[0]", "result.candles.at(0)!"],
    ["selection.failures[0]", "selection.failures.at(0)!"],
    ["result.failures[0]", "result.failures.at(0)!"]
  ],
  "packages/application/tests/validate-market-candles.test.ts": [
    ["result.normalizedCandles[0]", "result.normalizedCandles.at(0)!"],
    ["result.failures[0]", "result.failures.at(0)!"]
  ]
};

let changes = 0;
for (const [path, edits] of Object.entries(replacements)) {
  let content = readFileSync(path, "utf8");
  for (const [before, after] of edits) {
    if (!content.includes(before)) continue;
    content = content.replaceAll(before, after);
    changes += 1;
  }
  writeFileSync(path, content);
}

console.log(`Applied ${changes} strict-nullability repairs.`);
if (changes === 0) {
  console.log("No matching repairs were needed; files may already be fixed.");
}

import React, { useMemo } from "react";

const WIDTH = 900;
const HEIGHT = 280;
const PADDING = { top: 18, right: 76, bottom: 26, left: 14 };

function formatPrice(value, precision) {
  return Number(value).toFixed(precision);
}

export function PriceChart({ chart }) {
  const geometry = useMemo(() => buildGeometry(chart), [chart]);

  if (!chart?.candles?.length) {
    return <div className="chart-empty">No local price series is available.</div>;
  }

  return (
    <div className="price-chart" aria-label={`${chart.timeframe} local candlestick chart`}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img">
        <title>{chart.timeframe} local OHLC series with reviewed levels</title>
        <g className="chart-grid">
          {geometry.horizontalGrid.map((y) => (
            <line key={`h-${y}`} x1={PADDING.left} x2={WIDTH - PADDING.right} y1={y} y2={y} />
          ))}
          {geometry.verticalGrid.map((x) => (
            <line key={`v-${x}`} x1={x} x2={x} y1={PADDING.top} y2={HEIGHT - PADDING.bottom} />
          ))}
        </g>

        {geometry.candles.map((candle) => (
          <g key={candle.time} className={candle.up ? "candle candle--up" : "candle candle--down"}>
            <line x1={candle.x} x2={candle.x} y1={candle.highY} y2={candle.lowY} />
            <rect
              x={candle.x - candle.bodyWidth / 2}
              y={candle.bodyY}
              width={candle.bodyWidth}
              height={Math.max(candle.bodyHeight, 1.5)}
              rx="1"
            />
          </g>
        ))}

        {geometry.levels.map((level) => (
          <g key={level.kind} className={`price-level price-level--${level.kind}`}>
            <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={level.y} y2={level.y} />
            <rect x={WIDTH - PADDING.right + 4} y={level.y - 10} width="68" height="20" rx="4" />
            <text x={WIDTH - PADDING.right + 38} y={level.y + 3} textAnchor="middle">
              {level.label}
            </text>
          </g>
        ))}

        <g className="price-axis">
          {geometry.axisLabels.map((label) => (
            <text key={label.value} x={WIDTH - PADDING.right + 7} y={label.y + 3}>
              {formatPrice(label.value, chart.precision)}
            </text>
          ))}
        </g>
      </svg>
      <div className="chart-meta">
        <span>{chart.timeframe}</span>
        <span>{chart.candles.length} local candles</span>
        <span>Generated evidence snapshot</span>
      </div>
    </div>
  );
}

function buildGeometry(chart) {
  const values = chart.candles.flatMap((candle) => [candle.high, candle.low]);
  values.push(chart.levels.trigger, chart.levels.invalidation);
  if (chart.levels.target !== null) values.push(chart.levels.target);

  const min = Math.min(...values);
  const max = Math.max(...values);
  const margin = Math.max((max - min) * 0.08, Math.abs(max) * 0.0005);
  const domainMin = min - margin;
  const domainMax = max + margin;
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const step = plotWidth / chart.candles.length;
  const bodyWidth = Math.max(3, Math.min(12, step * 0.58));
  const scaleY = (value) => PADDING.top + ((domainMax - value) / (domainMax - domainMin)) * plotHeight;

  const candles = chart.candles.map((candle, index) => {
    const openY = scaleY(candle.open);
    const closeY = scaleY(candle.close);
    return {
      ...candle,
      x: PADDING.left + step * index + step / 2,
      highY: scaleY(candle.high),
      lowY: scaleY(candle.low),
      bodyY: Math.min(openY, closeY),
      bodyHeight: Math.abs(closeY - openY),
      bodyWidth,
      up: candle.close >= candle.open
    };
  });

  const levels = [
    { kind: "trigger", label: `Trigger ${formatPrice(chart.levels.trigger, chart.precision)}`, value: chart.levels.trigger },
    { kind: "invalidation", label: `Invalid ${formatPrice(chart.levels.invalidation, chart.precision)}`, value: chart.levels.invalidation }
  ];
  if (chart.levels.target !== null) {
    levels.push({ kind: "target", label: `Target ${formatPrice(chart.levels.target, chart.precision)}`, value: chart.levels.target });
  }

  return {
    candles,
    levels: levels.map((level) => ({ ...level, y: scaleY(level.value) })),
    horizontalGrid: Array.from({ length: 5 }, (_, index) => PADDING.top + (plotHeight / 4) * index),
    verticalGrid: Array.from({ length: 7 }, (_, index) => PADDING.left + (plotWidth / 6) * index),
    axisLabels: Array.from({ length: 5 }, (_, index) => {
      const value = domainMax - ((domainMax - domainMin) / 4) * index;
      return { value, y: scaleY(value) };
    })
  };
}

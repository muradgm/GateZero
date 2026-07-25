export interface WorkspaceCandle {
  readonly time: string;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
}

export interface WorkspaceChart {
  readonly timeframe: string;
  readonly precision: number;
  readonly candles: readonly WorkspaceCandle[];
  readonly levels: {
    readonly trigger: number;
    readonly invalidation: number;
    readonly target: number | null;
  };
}

function candles(base: number, precision: number, moves: readonly number[]): WorkspaceCandle[] {
  let previous = base;
  return moves.map((move, index) => {
    const open = previous;
    const close = Number((open + move).toFixed(precision));
    const wick = Math.max(Math.abs(move) * 0.55, 1 / 10 ** precision);
    const high = Number((Math.max(open, close) + wick).toFixed(precision));
    const low = Number((Math.min(open, close) - wick * 0.8).toFixed(precision));
    previous = close;
    return {
      time: `2026-07-24T${String(index + 1).padStart(2, "0")}:00:00.000Z`,
      open,
      high,
      low,
      close
    };
  });
}

export const workspaceCharts: Readonly<Record<string, WorkspaceChart>> = {
  eurusd: {
    timeframe: "1H",
    precision: 4,
    candles: candles(1.0818, 4, [0.0007, 0.0005, -0.0003, 0.0009, 0.0006, -0.0004, -0.0002, 0.0008, 0.0005, -0.0003, 0.0007, 0.0004, -0.0002, 0.0006, 0.0005, -0.0003, 0.0004, 0.0006]),
    levels: { trigger: 1.0868, invalidation: 1.08, target: 1.095 }
  },
  btcusd: {
    timeframe: "4H",
    precision: 0,
    candles: candles(112400, 0, [820, 610, -340, 1080, 760, -520, 410, 890, -680, 530, 420, -710, 360, -280, 490, -610, 240, -350]),
    levels: { trigger: 118200, invalidation: 112900, target: 124500 }
  },
  xauusd: {
    timeframe: "1H",
    precision: 2,
    candles: candles(3348, 2, [7.4, -4.8, 5.2, -6.1, 3.7, -2.9, 6.4, -7.2, 4.1, -3.8, 5.9, -5.4, 2.8, -4.6, 4.9, -6.3, 3.2, -2.7]),
    levels: { trigger: 3364, invalidation: 3328, target: null }
  }
};

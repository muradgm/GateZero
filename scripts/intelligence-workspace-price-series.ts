export interface WorkspaceCandle {
  readonly time: string;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
}

export interface WorkspaceChart {
  readonly timeframe: "1H" | "4H" | "1D";
  readonly precision: number;
  readonly candles: readonly WorkspaceCandle[];
  readonly levels: {
    readonly trigger: number;
    readonly invalidation: number;
    readonly target: number | null;
  };
}

export interface WorkspaceChartSet {
  readonly defaultTimeframe: "1H" | "4H" | "1D";
  readonly timeframes: Readonly<Partial<Record<"1H" | "4H" | "1D", WorkspaceChart>>>;
}

function candles(
  base: number,
  precision: number,
  moves: readonly number[],
  intervalHours: number
): WorkspaceCandle[] {
  let previous = base;
  const start = Date.parse("2026-07-20T00:00:00.000Z");
  return moves.map((move, index) => {
    const open = previous;
    const close = Number((open + move).toFixed(precision));
    const wick = Math.max(Math.abs(move) * 0.55, 1 / 10 ** precision);
    const high = Number((Math.max(open, close) + wick).toFixed(precision));
    const low = Number((Math.min(open, close) - wick * 0.8).toFixed(precision));
    previous = close;
    return {
      time: new Date(start + index * intervalHours * 60 * 60 * 1000).toISOString(),
      open,
      high,
      low,
      close
    };
  });
}

function chart(
  timeframe: "1H" | "4H" | "1D",
  base: number,
  precision: number,
  moves: readonly number[],
  levels: WorkspaceChart["levels"]
): WorkspaceChart {
  const intervalHours = timeframe === "1H" ? 1 : timeframe === "4H" ? 4 : 24;
  return { timeframe, precision, candles: candles(base, precision, moves, intervalHours), levels };
}

export const workspaceCharts: Readonly<Record<string, WorkspaceChartSet>> = {
  eurusd: {
    defaultTimeframe: "1H",
    timeframes: {
      "1H": chart("1H", 1.0818, 4, [0.0007,0.0005,-0.0003,0.0009,0.0006,-0.0004,-0.0002,0.0008,0.0005,-0.0003,0.0007,0.0004,-0.0002,0.0006,0.0005,-0.0003,0.0004,0.0006], { trigger: 1.0868, invalidation: 1.08, target: 1.095 }),
      "4H": chart("4H", 1.074, 4, [0.0016,0.0012,-0.0008,0.0021,0.0014,-0.0009,0.0017,0.0013,-0.0007,0.0019,0.0011,-0.0006,0.0015,0.0012], { trigger: 1.0868, invalidation: 1.0785, target: 1.098 }),
      "1D": chart("1D", 1.052, 4, [0.0042,0.0035,-0.0021,0.0051,0.0038,-0.0019,0.0046,0.0032,-0.0016,0.0041,0.0027,-0.0014], { trigger: 1.0868, invalidation: 1.071, target: 1.105 })
    }
  },
  btcusd: {
    defaultTimeframe: "4H",
    timeframes: {
      "1H": chart("1H", 114200, 0, [420,310,-180,540,380,-260,210,450,-340,270,220,-350,180,-140,250,-300,120,-170], { trigger: 118200, invalidation: 112900, target: 124500 }),
      "4H": chart("4H", 112400, 0, [820,610,-340,1080,760,-520,410,890,-680,530,420,-710,360,-280,490,-610,240,-350], { trigger: 118200, invalidation: 112900, target: 124500 }),
      "1D": chart("1D", 102800, 0, [2100,1800,-900,2600,1900,-1200,1700,2400,-1500,1600,1300,-1800], { trigger: 118200, invalidation: 108500, target: 128000 })
    }
  },
  xauusd: {
    defaultTimeframe: "1H",
    timeframes: {
      "1H": chart("1H", 3348, 2, [7.4,-4.8,5.2,-6.1,3.7,-2.9,6.4,-7.2,4.1,-3.8,5.9,-5.4,2.8,-4.6,4.9,-6.3,3.2,-2.7], { trigger: 3364, invalidation: 3328, target: null }),
      "4H": chart("4H", 3312, 2, [14.2,-8.4,11.6,-13.1,9.7,-7.2,12.8,-15.4,10.2,-9.1,13.5,-11.8,8.6,-10.4], { trigger: 3364, invalidation: 3318, target: null }),
      "1D": chart("1D", 3190, 2, [34,-18,27,-31,22,-16,29,-35,24,-21,31,-26], { trigger: 3364, invalidation: 3260, target: null })
    }
  }
};
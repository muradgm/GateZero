export const colors = {
  background: "#07090b",
  surface: "#0a0d10",
  text: "#e8ecef",
  muted: "#919aa2",
  verified: "#25d4ff",
  risk: "#ffb84d",
  approved: "#31e097",
  prohibited: "#ff5c5c"
} as const;

export const motion = {
  precise: "cubic-bezier(0.2, 0.75, 0.2, 1)",
  mechanical: "cubic-bezier(0.16, 0.8, 0.2, 1)",
  durations: {
    fast: 180,
    standard: 420,
    cinematic: 1200
  }
} as const;

export const experienceTokens = { colors, motion } as const;

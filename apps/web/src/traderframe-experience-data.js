export const traderFrameExperience = {
  eyebrow: "Decision intelligence / Evidence Gate",
  title: "Conviction should be earned.",
  lede:
    "TraderFrame turns fragmented market evidence into a transparent, challengeable decision record—before capital is put at risk.",
  thesis: "Selective risk-on",
  evidence: [
    {
      id: "E-01",
      label: "Market structure",
      state: "approved",
      score: 92,
      source: "Price structure and breadth composite",
      challenge: "No unresolved contradiction",
      riskWeight: "High"
    },
    {
      id: "E-02",
      label: "Liquidity regime",
      state: "approved",
      score: 86,
      source: "Funding and liquidity conditions",
      challenge: "Lag risk acknowledged",
      riskWeight: "High"
    },
    {
      id: "E-03",
      label: "Earnings quality",
      state: "challenged",
      score: 58,
      source: "Company reporting quality review",
      challenge: "Cash conversion remains inconsistent",
      riskWeight: "Medium"
    },
    {
      id: "E-04",
      label: "Positioning signal",
      state: "approved",
      score: 81,
      source: "Positioning and flow composite",
      challenge: "Crowding monitored",
      riskWeight: "Medium"
    },
    {
      id: "E-05",
      label: "Narrative momentum",
      state: "rejected",
      score: 34,
      source: "Narrative and attention indicators",
      challenge: "Source quality below threshold",
      riskWeight: "Excluded"
    }
  ]
};

export function summarizeEvidence(items = traderFrameExperience.evidence) {
  return items.reduce(
    (summary, item) => {
      summary.total += 1;
      summary[item.state] += 1;
      return summary;
    },
    { total: 0, approved: 0, challenged: 0, rejected: 0 }
  );
}

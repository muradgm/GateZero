import React from "react";
import { createRoot } from "react-dom/client";
import { WorkspaceRoot } from "./WorkspaceRoot.jsx";
import "./styles.css";
import "./price-chart.css";
import "./interaction.css";
import "./workspace-v2.css";
import "./similar-setups.css";
import "./ai-council.css";
import "./glossary.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WorkspaceRoot />
  </React.StrictMode>
);

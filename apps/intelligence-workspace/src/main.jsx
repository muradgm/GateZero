import React from "react";
import { createRoot } from "react-dom/client";
import { AppRuntime } from "./AppRuntime.jsx";
import "@traderframe/ui/tokens.css";
import "@traderframe/ui/components.css";
import "./styles.css";
import "./price-chart.css";
import "./interaction.css";
import "./workspace-v2.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRuntime />
  </React.StrictMode>
);

import React from "react";
import { createRoot } from "react-dom/client";
import { AppRuntime } from "./AppRuntime.jsx";
import "./styles.css";
import "./price-chart.css";
import "./interaction.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRuntime />
  </React.StrictMode>
);

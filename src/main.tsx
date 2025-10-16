// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import StartPage from "./pages/Start";
import "./styles.css";

// Minimal, dependency-free router:
// - If path starts with /start → render Region/KOE StartPage
// - Otherwise → render your existing App (archetype flow stays intact)
function SimpleRouter() {
  const path = window.location.pathname;
  if (path.startsWith("/start")) {
    return <StartPage />;
  }
  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SimpleRouter />
  </React.StrictMode>
);

import { createRoot } from "react-dom/client";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { initMonitoring } from "@/lib/monitoring";
import App from "./App.tsx";
import "./index.css";

initMonitoring();

createRoot(document.getElementById("root")!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
);

import React from "react";
import LiveOrdersDashboard from "./components/LiveOrdersDashboard";
import { StateEngineProvider } from "./contexts/StateEngineContext";

/**
 * TTGT Solutions - Live Orders Dashboard Application Entry Point
 * 
 * Scaled and modernized with StateEngineProvider to manage real-time streams
 * and roles dynamically across isolated enterprise modules.
 */
export default function App() {
  return (
    <StateEngineProvider>
      <LiveOrdersDashboard />
    </StateEngineProvider>
  );
}

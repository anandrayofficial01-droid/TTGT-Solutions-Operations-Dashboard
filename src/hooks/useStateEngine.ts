/**
 * TTGT Solutions Commerce Operations Platform
 * Central Hook to access the Live Operations State Engine
 */

import { useStateEngine as useGlobalStateEngine } from "../contexts/StateEngineContext";

export function useStateEngine() {
  return useGlobalStateEngine();
}

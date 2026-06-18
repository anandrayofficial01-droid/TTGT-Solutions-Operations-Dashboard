/**
 * TTGT Solutions Commerce Operations Platform
 * Enterprise Logging, Telemetry and Audit Monitoring Service Class
 */

import { BaseApiService } from "./BaseApiService";

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "SUCCESS" | "WARN" | "ERROR" | "SECURITY";
  category: "AUDIT" | "ACTIVITY" | "INTEGRATION" | "API" | "SECURITY" | "SESSION";
  message: string;
  operator: string;
  payload?: any;
}

export class LogService extends BaseApiService {
  private static mockLogs: SystemLogEntry[] = [
    {
      id: "LOG-01",
      timestamp: new Date().toLocaleTimeString(),
      level: "INFO",
      category: "SESSION",
      message: "Worker session token authenticated successfully. AWB validator loaded.",
      operator: "API Gateway Daemon"
    },
    {
      id: "LOG-02",
      timestamp: new Date().toLocaleTimeString(),
      level: "SUCCESS",
      category: "INTEGRATION",
      message: "Sync handshake with Shopify Plus Store #871 solved in 129ms.",
      operator: "Shopify SP-Connector"
    },
    {
      id: "LOG-03",
      timestamp: new Date().toLocaleTimeString(),
      level: "SECURITY",
      category: "SECURITY",
      message: "User session upgraded to Role: Super Administrator.",
      operator: "RBAC Manager"
    }
  ];

  /**
   * Fetch absolute audit logging trail
   */
  public static async querySystemLogs(filters?: { category?: string; level?: string }): Promise<SystemLogEntry[]> {
    try {
      const res = await this.get<SystemLogEntry[]>("/api/logs");
      return res;
    } catch {
      // Fallback local mock to prevent visual blank outage during initial load
      let filtered = [...this.mockLogs];
      if (filters?.category) {
        filtered = filtered.filter(l => l.category === filters.category);
      }
      if (filters?.level) {
        filtered = filtered.filter(l => l.level === filters.level);
      }
      return filtered;
    }
  }

  /**
   * Write custom operational event log entry directly to back-end collector
   */
  public static async stdout(entry: Omit<SystemLogEntry, "id" | "timestamp">): Promise<void> {
    try {
      await this.post("/api/logs", entry);
    } catch {
      // Passive logging print as fail-safe
      console.log(`[STDOUT - ${entry.category}] [${entry.level}] ${entry.message} (Operator: ${entry.operator})`);
    }
  }
}

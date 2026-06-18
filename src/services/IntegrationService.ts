/**
 * TTGT Solutions Commerce Operations Platform
 * Google Sheets, REST Webhooks, and Marketplace Integrations Service Class
 */

import { BaseApiService } from "./BaseApiService";
import { SyncLog } from "../types";

export interface GoogleSheetMapping {
  spreadsheetId: string;
  sheetName: string;
  fieldsMap: Record<string, string>; // Maps Column fields to Target platform fields
  syncIntervalMin: number;
}

export interface ConnectorPayload {
  id?: string;
  name: string;
  type: string;
  authType: "OAuth" | "APIKey" | "Token" | "Public";
  endpointUrl?: string;
  mappedColumns?: Record<string, string>;
}

export class IntegrationService extends BaseApiService {
  /**
   * Fetch historical sync run records
   */
  public static async getSynchronizationLogs(): Promise<SyncLog[]> {
    try {
      return await this.get<SyncLog[]>("/api/sync/logs");
    } catch {
      return [];
    }
  }

  /**
   * Run immediate custom data source sheet or endpoint extraction
   */
  public static async triggerConnectorSync(connectorId: string): Promise<{ success: boolean; rowsProcessed: number; logs: string[] }> {
    return this.post<{ success: boolean; rowsProcessed: number; logs: string[] }>("/api/sync/trigger", { connectorId });
  }

  /**
   * Save a verified Google Sheet operational field schema
   */
  public static async saveGoogleSheetMapping(mapping: GoogleSheetMapping): Promise<{ success: boolean; message: string }> {
    return this.post<{ success: boolean; message: string }>("/api/sync/sheets/config", mapping);
  }

  /**
   * Test direct integration endpoint credentials (REST, GraphQL, sheets metadata, database pool)
   */
  public static async testHandshakeConnection(payload: ConnectorPayload): Promise<{ status: "ONLINE" | "OFFLINE"; latencyMs: number; logs: string[] }> {
    return this.post<{ status: "ONLINE" | "OFFLINE"; latencyMs: number; logs: string[] }>("/api/sync/test-connection", payload);
  }
}

/**
 * TTGT Solutions Commerce Operations Platform
 * Enterprise Client Service Class (CRM Control Center)
 */

import { BaseApiService } from "./BaseApiService";
import { Client } from "../types";

export class ClientService extends BaseApiService {
  /**
   * Fetch absolute client ledger index
   */
  public static async getClients(): Promise<Client[]> {
    try {
      return await this.get<Client[]>("/api/clients");
    } catch {
      return [];
    }
  }

  /**
   * Insert new corporate entity or brand
   */
  public static async registerClient(clientData: Partial<Client>): Promise<Client> {
    return this.post<Client>("/api/clients", clientData);
  }

  /**
   * Adjust client status parameter (Active, Suspended, Inactive)
   */
  public static async updateClientStatus(clientId: string, status: string): Promise<Client> {
    return this.put<Client>(`/api/clients/${clientId}/status`, { status });
  }
}

/**
 * TTGT Solutions Commerce Operations Platform
 * Enterprise Store and Marketplace Registry Service Class
 */

import { BaseApiService } from "./BaseApiService";
import { Store, Marketplace } from "../types";

export class StoreRegistryService extends BaseApiService {
  /**
   * Fetch complete online multi-store indexes
   */
  public static async getStores(): Promise<Store[]> {
    try {
      return await this.get<Store[]>("/api/stores");
    } catch {
      return [];
    }
  }

  /**
   * Provision a brand-new digital storefront node
   */
  public static async configureNewStore(storeData: Partial<Store>): Promise<Store> {
    return this.post<Store>("/api/stores", storeData);
  }

  /**
   * Fetch underlying global marketplace statuses (Amazon SP-API, Shopify Plus, Flipkart etc)
   */
  public static async getMarketplaceConnections(): Promise<Marketplace[]> {
    try {
      return await this.get<Marketplace[]>("/api/marketplaces");
    } catch {
      return [];
    }
  }
}

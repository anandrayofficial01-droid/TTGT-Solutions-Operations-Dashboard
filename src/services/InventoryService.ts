/**
 * TTGT Solutions Commerce Operations Platform
 * Enterprise Inventory Management Service Class
 */

import { BaseApiService } from "./BaseApiService";
import { InventoryItem } from "../types";

export class InventoryService extends BaseApiService {
  /**
   * Fetch complete enterprise SKU ledger
   */
  public static async getInventory(): Promise<InventoryItem[]> {
    try {
      return await this.get<InventoryItem[]>("/api/inventory");
    } catch {
      return [];
    }
  }

  /**
   * Adjust active SKU warehouse count params
   */
  public static async adjustStockLevel(sku: string, reason: string, adjustment: number): Promise<InventoryItem> {
    return this.post<InventoryItem>(`/api/inventory/${sku}/adjust`, { reason, adjustment });
  }

  /**
   * Create new SKU registration entry
   */
  public static async createSku(skuData: Partial<InventoryItem>): Promise<InventoryItem> {
    return this.post<InventoryItem>("/api/inventory", skuData);
  }
}

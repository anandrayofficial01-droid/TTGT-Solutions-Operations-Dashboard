/**
 * TTGT Solutions Commerce Operations Platform
 * Enterprise Seller Service Class
 */

import { BaseApiService } from "./BaseApiService";
import { Seller } from "../types";

export class SellerService extends BaseApiService {
  /**
   * Fetch complete merchant registry
   */
  public static async getSellers(): Promise<Seller[]> {
    try {
      return await this.get<Seller[]>("/api/sellers");
    } catch {
      return [];
    }
  }

  /**
   * Onboard and register new 3P seller node
   */
  public static async onboardSeller(sellerData: Partial<Seller>): Promise<Seller> {
    return this.post<Seller>("/api/sellers", sellerData);
  }
}

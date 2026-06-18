/**
 * TTGT Solutions Commerce Operations Platform
 * Enterprise Order Service Class
 */

import { BaseApiService } from "./BaseApiService";
import { Order, OrderStatus } from "../types";

export class OrderService extends BaseApiService {
  /**
   * Fetch all orders from control tower
   */
  public static async getAllOrders(): Promise<Order[]> {
    try {
      return await this.get<Order[]>("/api/orders");
    } catch (e: any) {
      console.error("[OrderService.getAllOrders] Failover activated:", e);
      // Failover fallback array
      return [];
    }
  }

  /**
   * Fetch a single order package by unique ID
   */
  public static async getOrderById(orderId: string): Promise<Order> {
    return this.get<Order>(`/api/orders/${orderId}`);
  }

  /**
   * Update order parameters or status state transition triggers
   */
  public static async updateOrderStatus(orderId: string, status: OrderStatus, comments?: string): Promise<Order> {
    return this.post<Order>(`/api/orders/${orderId}/status`, { status, comments });
  }

  /**
   * Trigger the automated fulfillment workflow pipeline logic
   * Trigger picking, packing, generating labels, custom dispatches, alerts.
   */
  public static async triggerFulfillmentAutomation(orderId: string): Promise<{ success: boolean; workflowLogs: string[] }> {
    return this.post<{ success: boolean; workflowLogs: string[] }>(`/api/orders/${orderId}/fulfill-workflow`, {});
  }

  /**
   * Create an administrative manual single order
   */
  public static async createManualOrder(orderData: Partial<Order>): Promise<Order> {
    return this.post<Order>("/api/orders", orderData);
  }
}

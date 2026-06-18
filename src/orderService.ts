import { Order, OrderStatus } from "./types";

/**
 * TTGT Solutions - Order Operations Service Layer
 * 
 * This service mediates all calls for orders between the frontend and the data provider.
 * It is structured to hide backend implementation details so that switching from the Express API
 * to direct Google Sheets API or a marketplace REST router can be achieved without changing the frontend components.
 */

export class OrderService {
  private static apiBase = "/api";

  /**
   * Fetches the complete list of orders.
   * Currently retrieves from the Express SQLite/In-memory pipeline.
   */
  public static async fetchOrders(): Promise<Order[]> {
    // Future Google Sheets Integration - Read records from googleapis sheets SDK
    // const sheetData = await googleSheetsProvider.getOrders();
    // return transformSheetsToOrders(sheetData);

    // Future API Integration - Direct poll from Shopify or Amazon Selling Partner SP-API
    // const spApiData = await AmazonSPAPIProvider.getLatestOrders();
    // return transformSPAPIToOrders(spApiData);

    try {
      const response = await fetch(`${this.apiBase}/state`);
      if (!response.ok) {
        throw new Error(`Failed to fetch state: ${response.statusText}`);
      }
      const data = await response.json();
      return data.orders || [];
    } catch (error) {
      console.error("OrderService error in fetchOrders:", error);
      // Fallback or retry logic can be implemented here
      return [];
    }
  }

  /**
   * Updates the status of an existing order.
   * Enforces status validations and synchronizes the state.
   */
  public static async updateOrderStatus(id: string, newStatus: OrderStatus): Promise<Order | null> {
    // Future Google Sheets Integration - Write updated cells to range (e.g. "Orders!H" + row)
    // await googleSheetsProvider.updateCell("Orders", id, "status", newStatus);

    // Future API Integration - Dispatch webhook acknowledge/fulfilled status back to Shopify/Amazon
    // await AmazonSPAPIProvider.dispatchStatusUpdate(id, newStatus);

    try {
      const response = await fetch(`${this.apiBase}/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status for order ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`OrderService error in updateOrderStatus for ${id}:`, error);
      return null;
    }
  }

  /**
   * Provisions and submits a new order to the backend ledger.
   */
  public static async createOrder(order: Omit<Order, "id" | "orderDate">): Promise<Order | null> {
    // Future Google Sheets Integration - Append row to Orders tab
    // await googleSheetsProvider.appendRow("Orders", order);

    // Future API Integration - Create draft order on Shopify admin backend
    // await ShopifyAPIProvider.createDraftOrder(order);

    try {
      const response = await fetch(`${this.apiBase}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error("Failed to submit new purchase order");
      }
      return await response.json();
    } catch (error) {
      console.error("OrderService error in createOrder:", error);
      return null;
    }
  }
}

/**
 * TTGT Solutions Commerce Operations Platform
 * Centralized State Engine Context
 * 
 * Provides unified, single-source-of-truth state, caches, filters, API statuses,
 * and background synchronizations across the workspace canvas.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Order, Client, Seller, Store, InventoryItem, ReturnOrder, OperationNotification, SyncLog, UserRole } from "../types";
import { OrderService } from "../services/OrderService";
import { InventoryService } from "../services/InventoryService";
import { ClientService } from "../services/ClientService";
import { SellerService } from "../services/SellerService";
import { StoreRegistryService } from "../services/StoreRegistryService";
import { IntegrationService } from "../services/IntegrationService";

interface StateEngineContextType {
  orders: Order[];
  clients: Client[];
  sellers: Seller[];
  stores: Store[];
  inventory: InventoryItem[];
  returns: ReturnOrder[];
  notifications: OperationNotification[];
  syncLogs: SyncLog[];
  isLoading: boolean;
  error: string | null;
  currentRole: UserRole;
  isSyncing: boolean;
  setIsSyncing: React.Dispatch<React.SetStateAction<boolean>>;
  systemLogs: { time: string; msg: string; type: "success" | "warning" | "error" }[];
  setSystemLogs: React.Dispatch<React.SetStateAction<{ time: string; msg: string; type: "success" | "warning" | "error" }[]>>;
  
  // Handlers
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<OperationNotification[]>>;
  setCurrentRole: (role: UserRole) => void;
  refreshAllState: () => Promise<void>;
  triggerSync: (connectorId: string) => Promise<void>;
  modifyOrderStatus: (orderId: string, status: any, comments?: string) => Promise<void>;
  seedPlatformData: () => Promise<void>;
  clearPlatformData: () => Promise<void>;
  addSystemLog: (msg: string, type: "success" | "warning" | "error") => void;
}

const StateEngineContext = createContext<StateEngineContextType | undefined>(undefined);

export function StateEngineProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [returns, setReturns] = useState<ReturnOrder[]>([]);
  const [notifications, setNotifications] = useState<OperationNotification[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.SuperAdmin);
  const [systemLogs, setSystemLogs] = useState<{ time: string; msg: string; type: "success" | "warning" | "error" }[]>([]);

  const addSystemLog = (msg: string, type: "success" | "warning" | "error") => {
    const entry = {
      time: new Date().toLocaleTimeString(),
      msg,
      type
    };
    setSystemLogs(prev => [entry, ...prev].slice(0, 50));
  };

  /**
   * Safe fetch operations wrapper mapping states
   */
  const refreshAllState = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [orderList, clientList, sellerList, storeList, skuList, syncRunLogs] = await Promise.all([
        OrderService.getAllOrders(),
        ClientService.getClients(),
        SellerService.getSellers(),
        StoreRegistryService.getStores(),
        InventoryService.getInventory(),
        IntegrationService.getSynchronizationLogs()
      ]);

      const validatedOrders = Array.isArray(orderList) ? orderList : [];
      const validatedClients = Array.isArray(clientList) ? clientList : [];
      const validatedSellers = Array.isArray(sellerList) ? sellerList : [];
      const validatedStores = Array.isArray(storeList) ? storeList : [];
      const validatedInventory = Array.isArray(skuList) ? skuList : [];
      const validatedSyncLogs = Array.isArray(syncRunLogs) ? syncRunLogs : [];

      setOrders(validatedOrders);
      setClients(validatedClients);
      setSellers(validatedSellers);
      setStores(validatedStores);
      setInventory(validatedInventory);
      setSyncLogs(validatedSyncLogs);

      // Extract returns organically
      const extractedReturns = validatedOrders
        .filter(o => o.status === "Returned" || o.status === "RTO")
        .map((o, idx) => ({
          id: `RET-${1000 + idx}`,
          orderId: o.id,
          storeName: o.store,
          marketplace: o.marketplace,
          productName: o.product,
          returnReason: "Standard Customer Regret SLA Window",
          type: (o.status === "RTO" ? "RTO" : "Return") as "Return" | "RTO",
          refundStatus: "Pending" as const,
          date: o.orderDate
        }));
      setReturns(extractedReturns);

      // Form baseline operational warnings
      const dynamicNotifs: OperationNotification[] = [];
      validatedInventory.forEach(item => {
        if (item.availableStock < 40) {
          dynamicNotifs.push({
            id: `W-${item.sku}`,
            type: "Low Stock",
            message: `Warehouse inventory for SKU: ${item.sku} (${item.productName}) drops below critical limit! (${item.availableStock} items left)`,
            timestamp: "Just Now",
            read: false,
            severity: "critical"
          });
        }
      });
      setNotifications(prev => [...dynamicNotifs, ...prev]);

    } catch (err: any) {
      console.error("[StateEngine] Outage syncing with container routes:", err);
      setError(err.message || "Failed to establish synchronization with the operations portal.");
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  /**
   * Action trigger sync connectors
   */
  const triggerSync = async (connectorId: string) => {
    setIsSyncing(true);
    addSystemLog(`Sync triggered on operational connector node: ${connectorId}`, "warning");
    try {
      const res = await IntegrationService.triggerConnectorSync(connectorId);
      if (res.success) {
        addSystemLog(`Sync completed on ${connectorId}: Processed ${res.rowsProcessed} records.`, "success");
        await refreshAllState();
      }
    } catch (e: any) {
      addSystemLog(`Sync failed on connector: ${e.message}`, "error");
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Core order status workflows adjust overrides
   */
  const modifyOrderStatus = async (orderId: string, status: any, comments?: string) => {
    try {
      const outcome = await OrderService.updateOrderStatus(orderId, status, comments);
      addSystemLog(`Order ${orderId} successfully transitioned to code [${status}]`, "success");
      
      // Update local cache state efficiently
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (e: any) {
      addSystemLog(`Status adjustment rejected by rule validator: ${e.message}`, "error");
      throw e;
    }
  };

  /**
   * Seed the active enterprise sandbox state
   */
  const seedPlatformData = async () => {
    try {
      const res = await fetch("/api/state/seed", { method: "POST" });
      if (res.ok) {
        addSystemLog("Operational Sandbox dataset seeded into enterprise memory layer successfully.", "success");
        await refreshAllState();
      }
    } catch (e: any) {
      addSystemLog("Fail-safe: Seeding endpoint error.", "error");
    }
  };

  /**
   * Clear operations ledger back to clean dynamic empty slate states
   */
  const clearPlatformData = async () => {
    try {
      const res = await fetch("/api/state/clear", { method: "POST" });
      if (res.ok) {
        addSystemLog("Command center cleared operational data into clean live-ready states.", "warning");
        await refreshAllState();
      }
    } catch (e: any) {
      addSystemLog("Fail-safe: Clearing endpoint error.", "error");
    }
  };

  // Initial load
  useEffect(() => {
    refreshAllState();
  }, []);

  return (
    <StateEngineContext.Provider
      value={{
        orders,
        clients,
        sellers,
        stores,
        inventory,
        returns,
        notifications,
        syncLogs,
        isLoading,
        error,
        currentRole,
        isSyncing,
        setIsSyncing,
        systemLogs,
        setSystemLogs,
        setOrders,
        setNotifications,
        setCurrentRole,
        refreshAllState,
        triggerSync,
        modifyOrderStatus,
        seedPlatformData,
        clearPlatformData,
        addSystemLog
      }}
    >
      {children}
    </StateEngineContext.Provider>
  );
}

export function useStateEngine() {
  const context = useContext(StateEngineContext);
  if (!context) {
    throw new Error("useStateEngine must be consumed within a StateEngineProvider bounds.");
  }
  return context;
}

import React, { useState, useEffect } from "react";
import {
  Menu,
  Bell,
  Clock,
  Calendar,
  Settings,
  Database,
  Truck,
  Layers,
  ShoppingBag,
  User,
  FileText,
  Shield,
  Activity,
  Zap,
  HardDrive,
  MessageSquare,
  HelpCircle,
  FileCode,
  Building2,
  Trash2,
  Lock,
  Moon,
  Sun,
  Flame,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  SlidersHorizontal,
  Plus,
  Sparkles
} from "lucide-react";
import { Order, OrderStatus, UserRole, OperationNotification, SyncLog, Client, Store, Seller, InventoryItem, ReturnOrder, Marketplace } from "../types";
import KPIMetrics from "./KPIMetrics";
import LiveActivityFeed from "./LiveActivityFeed";
import OrdersTable from "./OrdersTable";
import OrderDetailsView from "./OrderDetailsView";
import LiveOrderTelemetry from "./LiveOrderTelemetry";
import DataSourceManager, { DataConnector } from "./DataSourceManager";
import AnalyticsPanel from "./AnalyticsPanel";
import SettingsPanel from "./SettingsPanel";
import LiveDashboardTab from "./LiveDashboardTab";

import StoreModule from "./StoreModule";
import ClientModule from "./ClientModule";
import SellerModule from "./SellerModule";
import InventoryModule from "./InventoryModule";
import ReturnsModule from "./ReturnsModule";
import RolesModule from "./RolesModule";
import ShippingModule from "./ShippingModule";
import IntegrationsModule from "./IntegrationsModule";
import AIInsightsPanel from "./AIInsightsPanel";

import { useStateEngine } from "../hooks/useStateEngine";
import { useRoleAccess } from "../hooks/useRoleAccess";

export default function LiveOrdersDashboard() {
  // Sidebar active navigation route tracker
  const [activeTab, setActiveTab] = useState<string>("Dashboard");

  // Primary operational state destructured from high-fidelity central state engine context
  const {
    orders,
    setOrders,
    clients,
    sellers,
    stores,
    inventory,
    returns,
    syncLogs,
    notifications,
    setNotifications,
    currentRole,
    setCurrentRole,
    isSyncing,
    setIsSyncing,
    isLoading,
    error: fetchError,
    systemLogs,
    setSystemLogs,
    refreshAllState: fetchState,
    seedPlatformData,
    addSystemLog: handleAddSystemLog
  } = useStateEngine();

  const [connectors, setConnectors] = useState<DataConnector[]>([]);
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);

  // Selected Order for detail drill-down pages
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedTelemetryOrder, setSelectedTelemetryOrder] = useState<Order | null>(null);

  // App Layout options
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isNotifPanelOpen, setIsNotifPanelOpen] = useState<boolean>(false);
  const [envMode, setEnvMode] = useState<"LIVE" | "TEST" | "DEV">("LIVE");
  const [companyName, setCompanyName] = useState<string>("TTGT Solutions Logistics Node");
  const [logoText, setLogoText] = useState<string>("TTGT");

  // Date and Time ticker
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // CRUD Operations linking directly to REST Endpoints
  const handleAddStore = async (storeData: Omit<Store, "id">) => {
    try {
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeData)
      });
      if (res.ok) {
        handleAddSystemLog(`Store registry added: ${storeData.storeName}`, "success");
        fetchState();
      }
    } catch (e) {
      console.error("Failed to add store:", e);
    }
  };

  const handleEditStore = async (id: string, updatedStore: Partial<Store>) => {
    try {
      const res = await fetch(`/api/stores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStore)
      });
      if (res.ok) {
        handleAddSystemLog(`Store modified: ${id}`, "success");
        fetchState();
      }
    } catch (e) {
      console.error("Failed to edit store:", e);
    }
  };

  const handleDeleteStore = async (id: string) => {
    try {
      const res = await fetch(`/api/stores/${id}`, { method: "DELETE" });
      if (res.ok) {
        handleAddSystemLog(`Store registry purged: ${id}`, "error");
        fetchState();
      }
    } catch (e) {
      console.error("Failed to delete store:", e);
    }
  };

  const handleAddClient = async (clientData: Omit<Client, "id">) => {
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData)
      });
      if (res.ok) {
        handleAddSystemLog(`Client added: ${clientData.name}`, "success");
        fetchState();
      }
    } catch (e) {
      console.error("Failed to add client:", e);
    }
  };

  const handleEditClient = async (id: string, updatedClient: Partial<Client>) => {
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedClient)
      });
      if (res.ok) {
        handleAddSystemLog(`Client amended: ${id}`, "success");
        fetchState();
      }
    } catch (e) {
      console.error("Failed to edit client:", e);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (res.ok) {
        handleAddSystemLog(`Client registration purged: ${id}`, "error");
        fetchState();
      }
    } catch (e) {
      console.error("Failed to delete client:", e);
    }
  };

  const handleAddSeller = async (sellerData: Omit<Seller, "id">) => {
    try {
      const res = await fetch("/api/sellers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sellerData)
      });
      if (res.ok) {
        handleAddSystemLog(`Seller partner linked: ${sellerData.sellerName}`, "success");
        fetchState();
      }
    } catch (e) {
      console.error("Failed to add seller:", e);
    }
  };

  const handleEditSeller = async (id: string, updatedSeller: Partial<Seller>) => {
    try {
      const res = await fetch(`/api/sellers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSeller)
      });
      if (res.ok) {
        handleAddSystemLog(`Seller partner updated: ${id}`, "success");
        fetchState();
      }
    } catch (e) {
      console.error("Failed to edit seller:", e);
    }
  };

  const handleDeleteSeller = async (id: string) => {
    try {
      const res = await fetch(`/api/sellers/${id}`, { method: "DELETE" });
      if (res.ok) {
        handleAddSystemLog(`Seller partnership purged: ${id}`, "error");
        fetchState();
      }
    } catch (e) {
      console.error("Failed to delete seller:", e);
    }
  };

  const handleAddSingleInventory = async (item: InventoryItem) => {
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        handleAddSystemLog(`Single SKU catalog item configured: ${item.sku}`, "success");
        fetchState();
      }
    } catch (e) {
      console.error("Failed to save inventory SKU:", e);
    }
  };

  const handleUploadBulkInventory = async (items: any[]) => {
    try {
      const res = await fetch("/api/inventory/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items })
      });
      if (res.ok) {
        handleAddSystemLog(`Bulk payload processing complete for ${items.length} items`, "success");
        fetchState();
      }
    } catch (e) {
      console.error("Failed to upload bulk inventory SKU:", e);
    }
  };

  const handleTriggerIntegrationsSync = async (type: "Sheets" | "Webhook") => {
    setIsSyncing(true);
    try {
      const configObj = type === "Sheets" ? {
        sheetName: "Operations Ledger",
        sheetUrl: "https://docs.google.com/spreadsheets/d/1tY_X4GT_Solutions_Ledger"
      } : {};
      const res = await fetch("/api/sync/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, config: configObj })
      });
      if (res.ok) {
        handleAddSystemLog(`${type} synchronization dispatched successfully.`, "success");
        fetchState();
      }
    } catch (e) {
      console.error("Sync trigger protocol error:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Sandbox Stream simulation scheduler
  useEffect(() => {
    const isSimConnected = connectors.some(c => c.type === "Sandbox Simulation" && c.status === "Connected");
    if (!isSimConnected) return;

    // Create a periodic order generation system to simulate continuous telemetry
    const interval = setInterval(() => {
      // Create a randomized order
      const customerNames = ["Amit Chawla", "Priyah Sharma", "Nikhil Verma", "Siddharth Sen", "Divya Patel", "Rajesh Gowda", "Arun Nair"];
      const products = ["Logistics Redundant Package A", "Aura Essential freight Cargo", "Freemium Freight Containers", "Redundant Box Series X"];
      const cities = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "Pune"];
      const states = ["Maharashtra", "Delhi NCT", "Karnataka", "Tamil Nadu", "West Bengal", "Telangana", "Maharashtra"];
      const couriers = ["Delhivery", "Bluedart", "DTDC Express", "Shipsy Lanes", "Ekart Logistics"];
      const marketplaces = ["Shopify Hub", "Amazon SP-API", "Flipkart Integration Center", "WooCommerce Rest API"];
      const stores = ["Aura Essentials Shopify", "Delhi Central Amazon", "Southfreight Flipkart Node", "Western India WooCommerce"];

      const chosenIdx = Math.floor(Math.random() * customerNames.length);
      const chosenProdIdx = Math.floor(Math.random() * products.length);
      const chosenCityIdx = Math.floor(Math.random() * cities.length);
      const chosenMpIdx = Math.floor(Math.random() * marketplaces.length);
      const chosenStoreIdx = Math.floor(Math.random() * stores.length);
      const chosenCourierIdx = Math.floor(Math.random() * couriers.length);

      const chosenPrice = Math.floor(650 + Math.random() * 2200);
      const orderId = `TTGT-${100000 + Math.floor(Math.random() * 899999)}`;
      const trackingNo = `TRK-${20000000 + Math.floor(Math.random() * 79999999)}`;

      const newOrder: Order = {
        id: orderId,
        orderDate: new Date().toLocaleTimeString(),
        customerName: customerNames[chosenIdx],
        product: products[chosenProdIdx],
        quantity: Math.floor(Math.random() * 2) + 1,
        marketplace: marketplaces[chosenMpIdx],
        store: stores[chosenStoreIdx],
        status: OrderStatus.New,
        courier: couriers[chosenCourierIdx],
        trackingNumber: trackingNo,
        revenue: chosenPrice,
        phone: `+91 9${70000000 + Math.floor(Math.random() * 29999999)}`,
        city: cities[chosenCityIdx],
        state: states[chosenCityIdx],
        paymentStatus: Math.random() > 0.25 ? "Paid" : "COD",
        historyLogs: [
          { timestamp: new Date().toLocaleTimeString(), description: "Inbound payload parsed, order created", location: "Global Gateway Hub", status: "New" }
        ]
      };

      setOrders(prev => [newOrder, ...prev]);

      // Add a matching system log
      handleAddSystemLog(`Simulated Inbound Order detected: ${orderId} &bull; ₹${chosenPrice} from ${marketplaces[chosenMpIdx]}`, "success");

      // Push custom notification Alert
      const newNotif: OperationNotification = {
        id: `NOTIF_${Date.now()}`,
        type: "Low Stock",
        message: `Inbound system check: ${orderId} registered successfully via Sandbox stream.`,
        timestamp: new Date().toLocaleTimeString(),
        read: false,
        severity: "info"
      };
      setNotifications(prev => [newNotif, ...prev]);

    }, 8000);

    return () => clearInterval(interval);
  }, [connectors]);

  // Helper trigger to instantly create a baseline dataset (Sandbox Connector)
  const handleGenerateSandboxCentral = async () => {
    try {
      const res = await fetch("/api/state/seed", { method: "POST" });
      if (res.ok) {
        setConnectors([{
          id: "CONN_SANDBOX",
          name: "TTGT Sandbox Live Pipeline",
          type: "Sandbox Simulation",
          status: "Connected",
          lastSynced: "Just Now",
          config: { interval: "5" }
        }]);
        handleAddSystemLog("Enterprise production-ready Seeding dataset synchronized successfully.", "success");
        await fetchState();
      }
    } catch (e) {
      console.error("Failed to seed operations state:", e);
      handleAddSystemLog("Fail-safe: Seeding endpoint timed out. Check connection.", "error");
    }
  };

  // Add Connector Callback
  const handleAddNewConnector = (newConn: DataConnector) => {
    setConnectors(prev => [...prev, newConn]);
    handleAddSystemLog(`Data Source: Established connection '${newConn.name}' (${newConn.type}).`, "success");
  };

  // Delete Connector Callback
  const handleDeleteConnector = (id: string) => {
    setConnectors(prev => prev.filter(c => c.id !== id));
    handleAddSystemLog(`Data Source: Disconnected resource ${id}.`, "warning");
    // If we removed the Sandbox simulation, clear out its simulated orders to maintain purity
    if (id === "CONN_SANDBOX") {
      setOrders([]);
    }
  };

  const handleModifyConnector = (id: string, updated: Partial<DataConnector>) => {
    setConnectors(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  // Manual Trigger Synchronizer
  const handleTriggerManualRefresh = (connectorId: string) => {
    handleModifyConnector(connectorId, { status: "Syncing" });
    handleAddSystemLog(`Manual poll request dispatched for connection ID: ${connectorId}...`, "success");

    setTimeout(() => {
      const now = new Date().toLocaleTimeString();
      handleModifyConnector(connectorId, { status: "Connected", lastSynced: now });
      handleAddSystemLog(`Sync cycle completed for ${connectorId}. 0 conflicts resolved.`, "success");

      // Push custom sync toast notification alert
      const completeNotif: OperationNotification = {
        id: `NOTIF_${Date.now()}`,
        type: "Low Stock",
        message: `Manual data sync cycle completed for connector ID: ${connectorId}.`,
        timestamp: now,
        read: false,
        severity: "info"
      };
      setNotifications(prev => [completeNotif, ...prev]);
    }, 1000);
  };

  // Mutate Order Status callback (Supports deep synchronization updates)
  const handleModifyOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        // Append history log
        const logLine = {
          timestamp: new Date().toLocaleTimeString(),
          description: `Internal status overridden to: [${status}]`,
          location: "Manual Override Console",
          status
        };
        const updatedLogs = o.historyLogs ? [logLine, ...o.historyLogs] : [logLine];

        // Also update sub-detail pages if selected
        const updatedOrder = { ...o, status, historyLogs: updatedLogs };
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(updatedOrder);
        }
        if (selectedTelemetryOrder && selectedTelemetryOrder.id === id) {
          setSelectedTelemetryOrder(updatedOrder);
        }
        return updatedOrder;
      }
      return o;
    }));

    handleAddSystemLog(`Order Action: Status update resolved on order ${id} -> [${status}].`, "success");
  };

  // Delete Order row callback
  const handleDeleteOrderRow = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    if (selectedOrder && selectedOrder.id === id) setSelectedOrder(null);
    if (selectedTelemetryOrder && selectedTelemetryOrder.id === id) setSelectedTelemetryOrder(null);
    handleAddSystemLog(`Order Action: Purged order manifest ${id} permanently.`, "error");
  };

  // Clear single specific notifications
  const handleClearNotif = (notifId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  // Resolve layout color themes
  const bodyTheme = isDarkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50/50 text-slate-800";

  // Sidebar navigation options list mapping user requested tabs
  const sidebarItems = [
    { name: "Dashboard", category: "OPERATIONS CORE", icon: Layers },
    { name: "Orders Ledger", category: "OPERATIONS CORE", icon: Truck },
    { name: "Live Monitor", category: "OPERATIONS CORE", icon: Activity },
    { name: "Returns & RTO", category: "OPERATIONS CORE", icon: Clock },
    { name: "Inventory Hub", category: "WAREHOUSE & STOCKS", icon: HardDrive },
    { name: "Store Registry", category: "WAREHOUSE & STOCKS", icon: Building2 },
    { name: "Clients CRM", category: "RELATIONSHIP CRM", icon: User },
    { name: "Seller Registry", category: "RELATIONSHIP CRM", icon: Zap },
    { name: "Transit & SLA", category: "ANALYTICS & INTEL", icon: Truck },
    { name: "AI Forecast Center", category: "ANALYTICS & INTEL", icon: Sparkles },
    { name: "System Data Streams", category: "INTEGRATION SUITE", icon: Database },
    { name: "Operator Controls", category: "INTEGRATION SUITE", icon: Settings }
  ];

  const handleSidebarClick = (name: string) => {
    setActiveTab(name);
    // Erase detail pages if we navigate off
    setSelectedOrder(null);
    setSelectedTelemetryOrder(null);
  };

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${bodyTheme}`}>
      
      {/* SIDEBAR NAVIGATION PANEL */}
      <aside className={`bg-slate-900 border-r border-slate-800 shrink-0 select-none flex flex-col justify-between transition-all duration-300 ${
        isSidebarCollapsed ? "w-16" : "w-64"
      }`}>
        <div>
          {/* Logo Branding Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-2.5">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-xs text-white">
                  {logoText}
                </div>
                <div>
                  <span className="text-xs font-black text-slate-100 block tracking-tight">TTGT Solutions</span>
                  <span className="text-[9px] text-slate-500 block uppercase font-mono font-bold tracking-widest">Ops Tower</span>
                </div>
              </div>
            )}
            {isSidebarCollapsed && (
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-xs text-white mx-auto">
                T
              </div>
            )}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded transition-all cursor-pointer"
            >
              <Menu className="w-4 h-4 mx-auto" />
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="p-2.5 space-y-4 overflow-y-auto max-h-[82vh] custom-scrollbar">
            {/* Categorised side tabs */}
            {Array.from(new Set(sidebarItems.map(item => item.category))).map(cat => (
              <div key={cat} className="space-y-1">
                {!isSidebarCollapsed && (
                  <span className="text-[9px] font-mono font-black text-slate-550 tracking-wider block px-2.5 mb-1.5 uppercase opacity-60">
                    {cat}
                  </span>
                )}
                {sidebarItems.filter(item => item.category === cat).map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeTab === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleSidebarClick(item.name)}
                      className={`w-full flex items-center ${
                        isSidebarCollapsed ? "justify-center px-1" : "px-3"
                      } py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!isSidebarCollapsed && <span className="ml-2.5 truncate">{item.name}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Foot Control */}
        <div className="p-4 border-t border-slate-850 bg-slate-950/20 text-center">
          {!isSidebarCollapsed ? (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold text-center">Environment Node</span>
              <div className="flex justify-center gap-1">
                {["LIVE", "TEST", "DEV"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setEnvMode(mode as any)}
                    className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-black uppercase ${
                      envMode === mode
                        ? "bg-slate-800 text-emerald-500 border border-emerald-500/20"
                        : "bg-transparent text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={`w-2.5 h-2.5 rounded-full mx-auto ${
              envMode === "LIVE" ? "bg-emerald-500" : envMode === "TEST" ? "bg-amber-500" : "bg-blue-500"
            }`}></div>
          )}
        </div>
      </aside>

      {/* PRIMARY VIEWER CONSOLE */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* DASHBOARD HEADER */}
        <header className="bg-white dark:bg-slate-900 border-b border-sidebar border-slate-150 dark:border-slate-800 p-4 py-3 flex items-center justify-between gap-4 select-none shrink-0 shadow-xs">
          
          {/* Header left */}
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider font-mono">
              Control Tower &bull; {activeTab}
            </h1>
            <div className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-black border uppercase shrink-0 ${
              envMode === "LIVE"
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                : envMode === "TEST"
                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                : "bg-blue-500/10 text-blue-600 border-blue-500/20"
            }`}>
              {envMode} REGISTRY ACTIVE
            </div>
          </div>

          {/* Header Center Date and Time */}
          <div className="hidden md:flex items-center gap-4 text-slate-500 font-mono text-[11px] font-bold">
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 p-1.5 px-3 rounded-lg border border-slate-100 dark:border-slate-850">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentTime.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 p-1.5 px-3 rounded-lg border border-slate-100 dark:border-slate-850">
              <Clock className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>{currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}</span>
            </div>
          </div>

          {/* Header Right utilities */}
          <div className="flex items-center gap-1.5 relative">
            
            {/* Dark Mode switcher */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-205 dark:hover:border-slate-700"
              title="Toggle ocular contrast filter theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications bells dropdown button */}
            <button
              onClick={() => setIsNotifPanelOpen(!isNotifPanelOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-lg relative transition-colors cursor-pointer border border-transparent hover:border-slate-205 dark:hover:border-slate-700"
              title="System Alerts logs drawer"
            >
              <Bell className="w-4 h-4" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              )}
            </button>

            {/* Simulated Profile card */}
            <div className="hidden sm:flex items-center gap-2.5 ml-1.5 border-l pl-3 border-slate-200">
              <div className="w-7 h-7 rounded-full bg-slate-100 border flex items-center justify-center font-black text-xs text-slate-700 select-none">
                OP
              </div>
              <div className="text-left font-sans">
                <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-100 block">Operator Tower</span>
                <span className="text-[9px] text-slate-400 block font-mono">Operations Team</span>
              </div>
            </div>

            {/* System Notifications Popover panel */}
            {isNotifPanelOpen && (
              <div className="absolute right-0 top-11 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl shadow-2xl z-50 overflow-hidden text-left text-xs">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 border-b border-slate-105 dark:border-slate-800 flex justify-between items-center font-black font-mono text-[10px] text-slate-400 select-none">
                  <span>OUTBOUND NOTIFICATIONS ({notifications.length})</span>
                  <button onClick={() => setNotifications([])} className="text-rose-500 hover:underline">Erase All</button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 italic">No warnings or exceptions registered in queue logs.</div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-3 hover:bg-slate-55/30 transition-colors flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1"></span>
                        <div className="flex-1">
                          <p className="font-medium text-slate-700 dark:text-slate-300 leading-normal">{n.message}</p>
                          <span className="text-[9px] font-mono text-slate-400 block mt-1">{n.timestamp}</span>
                        </div>
                        <button onClick={() => handleClearNotif(n.id)} className="text-slate-400 hover:text-slate-600 font-bold shrink-0">×</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* POPULAR OVERLAYS CLOSE DETECT */}
        {isNotifPanelOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setIsNotifPanelOpen(false)}></div>
        )}

        {/* MAIN WORKSPACE CONTENT GRID ROUTER */}
        <div className="flex-1 p-5 overflow-y-auto space-y-6">
          
          {/* VIEW: OUTBOUND HANDSHAKE ERROR BANNER */}
          {fetchError && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 text-rose-700 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-200 rounded-lg flex items-start gap-3 shadow-md">
              <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="font-black text-xs font-mono tracking-tight text-rose-900 dark:text-rose-100 uppercase">Operational Gateway Handshake Outage</h3>
                <p className="text-xs mt-1 text-rose-600 dark:text-rose-300 leading-relaxed">{fetchError}</p>
                <button 
                  onClick={fetchState}
                  className="mt-2.5 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] rounded uppercase font-mono tracking-wider transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  Retry Secure Connection
                </button>
              </div>
            </div>
          )}

          {/* VIEW: COMMAND CONSOLE SKELETON LOADER */}
          {isLoading && !fetchError && (
            <div className="space-y-6 animate-pulse select-none">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(idx => (
                  <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-805 p-5 rounded-2xl space-y-3 shadow-sm">
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full w-1/3"></div>
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-2/3"></div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-805 p-6 rounded-2xl h-80 space-y-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                  <div className="space-y-4 mt-6">
                    <div className="h-10 bg-slate-50 dark:bg-slate-950 rounded w-full"></div>
                    <div className="h-10 bg-slate-50 dark:bg-slate-950 rounded w-full"></div>
                    <div className="h-10 bg-slate-50 dark:bg-slate-950 rounded w-full"></div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-805 p-6 rounded-2xl h-80 space-y-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                  <div className="space-y-4 mt-6">
                    {[1, 2, 3].map(p => (
                      <div key={p} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                        <div className="space-y-1.5 flex-1">
                          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC CONSOLE ROUTER FRAME (Renders once loaded successfully) */}
          {!isLoading && (
            <>
              {/* VIEW: ORDER DETAILS VIEW (Renders when an order is selected for details) */}
              {selectedOrder && !selectedTelemetryOrder && (
                <OrderDetailsView
                  order={selectedOrder}
                  onBack={() => setSelectedOrder(null)}
                  onOpenTelemetryTower={(o) => {
                    setSelectedTelemetryOrder(o);
                  }}
                  onModifyStatus={handleModifyOrderStatus}
                />
              )}

              {/* VIEW: LOGISTICS TELEMETRY VIEW (Renders when an order is parsed into operational telemetry dashboard) */}
              {selectedTelemetryOrder && (
                <LiveOrderTelemetry
                  order={selectedTelemetryOrder}
                  onBack={() => setSelectedTelemetryOrder(null)}
                  onRefreshDatabase={() => handleTriggerManualRefresh("CONN_SANDBOX")}
                  onModifyStatus={handleModifyOrderStatus}
                />
              )}

              {/* DEFAULT TABS ROUTER VIEW (Only renders when no specific detail card is prioritized) */}
              {!selectedOrder && !selectedTelemetryOrder && (
                <>
              {/* TAB: DASHBOARD */}
              {activeTab === "Dashboard" && (
                <div className="space-y-6">
                  
                  {/* Dynamic KPI counters card list */}
                  <KPIMetrics orders={orders} />

                  {/* Empty Data warning card if orders array remains entirely unpopulated */}
                  {orders.length === 0 && (
                    <div className="border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-12 text-center shadow-sm select-none">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-400 mx-auto mb-4">
                        <Database className="w-6 h-6 text-slate-400" />
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">No Operations Data Available</h3>
                      <p className="text-xs text-slate-400 mt-1.5 max-w-md mx-auto leading-relaxed">
                        Redundant static values have been eliminated to comply with your guidelines. Start by configuring a resource mapper or launch the Sandbox tracker.
                      </p>
                      
                      <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <button
                          onClick={() => setActiveTab("Data Sources")}
                          className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-650 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Connect Google Sheet
                        </button>
                        <button
                          onClick={handleGenerateSandboxCentral}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-550 rounded-lg text-xs font-black transition-all cursor-pointer shadow"
                        >
                          Launch Sandbox Simulation logs
                        </button>
                      </div>
                    </div>
                  )}

                  {orders.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                      {/* Advanced Control Log ledger grid table (takes 2 cols) */}
                      <div className="lg:col-span-2 space-y-6">
                        <OrdersTable
                          orders={orders}
                          onSelectOrder={(o) => setSelectedOrder(o)}
                          onSelectInteractiveDashboard={(o) => setSelectedTelemetryOrder(o)}
                          onModifyStatus={handleModifyOrderStatus}
                          onDeleteOrder={handleDeleteOrderRow}
                          onTriggerSyncLogs={(id) => handleTriggerManualRefresh("CONN_SANDBOX")}
                        />
                      </div>

                      {/* Right Column: Timeline feed scanner metrics */}
                      <div className="space-y-6">
                        <LiveActivityFeed
                          orders={orders}
                          onSelectOrder={(o) => setSelectedOrder(o)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: ORDERS TABLE ONLY */}
              {activeTab === "Orders Ledger" && (
                <OrdersTable
                  orders={orders}
                  onSelectOrder={(o) => setSelectedOrder(o)}
                  onSelectInteractiveDashboard={(o) => setSelectedTelemetryOrder(o)}
                  onModifyStatus={handleModifyOrderStatus}
                  onDeleteOrder={handleDeleteOrderRow}
                  onTriggerSyncLogs={(id) => handleTriggerManualRefresh("CONN_SANDBOX")}
                />
              )}

              {/* TAB: GENERAL TELEMETRY REDIRECT */}
              {activeTab === "Live Monitor" && (
                <LiveDashboardTab
                  orders={orders}
                  setOrders={setOrders}
                />
              )}

              {/* TAB: RETURNS OPERATION */}
              {activeTab === "Returns & RTO" && (
                <ReturnsModule
                  returns={returns}
                  orders={orders}
                />
              )}

              {/* TAB: INVENTORY AND WMS SYSTEMS */}
              {activeTab === "Inventory Hub" && (
                <InventoryModule
                  inventory={inventory}
                  onUploadBulk={handleUploadBulkInventory}
                  onAddSingle={handleAddSingleInventory}
                />
              )}

              {/* TAB: STORE AND CLIENT CHANNELS */}
              {activeTab === "Store Registry" && (
                <StoreModule
                  stores={stores}
                  clients={clients}
                  onAddStore={handleAddStore}
                  onEditStore={handleEditStore}
                  onDeleteStore={handleDeleteStore}
                />
              )}

              {/* TAB: CLIENTS CRM PORTFOLIOS */}
              {activeTab === "Clients CRM" && (
                <ClientModule
                  clients={clients}
                  onAdd={handleAddClient}
                  onEdit={handleEditClient}
                  onDelete={handleDeleteClient}
                />
              )}

              {/* TAB: SELLER PARTNER PORTFOLIOS */}
              {activeTab === "Seller Registry" && (
                <SellerModule
                  sellers={sellers}
                  onAdd={handleAddSeller}
                  onEdit={handleEditSeller}
                  onDelete={handleDeleteSeller}
                />
              )}

              {/* TAB: TRANSIT SUMMARY COURIER PERFORMANCE */}
              {activeTab === "Transit & SLA" && (
                <ShippingModule
                  orders={orders}
                />
              )}

              {/* TAB: GEMINI ARTIFICIAL INTELLIGENCE FORECAST CENTRE */}
              {activeTab === "AI Forecast Center" && (
                <AIInsightsPanel
                  onRefreshTelemetry={fetchState}
                />
              )}

              {/* TAB: FULL SYSTEM DATA STREAMS SETUP */}
              {activeTab === "System Data Streams" && (
                <IntegrationsModule
                  syncLogs={syncLogs}
                  onTriggerSync={handleTriggerIntegrationsSync}
                  isSyncing={isSyncing}
                />
              )}

              {/* TAB: GLOBAL OPERATOR CONFIG CONTROLS */}
              {activeTab === "Operator Controls" && (
                <div className="space-y-6">
                  <RolesModule
                    currentRole={currentRole}
                    onChangeRole={setCurrentRole}
                  />
                  <SettingsPanel
                    companyName={companyName}
                    setCompanyName={setCompanyName}
                    logoText={logoText}
                    setLogoText={setLogoText}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}

        </div>
      </main>
    </div>
  );
}

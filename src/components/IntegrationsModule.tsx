import React, { useState, useEffect } from "react";
import {
  Database,
  CloudLightning,
  RefreshCw,
  Link,
  ShieldCheck,
  CheckCircle,
  FileSpreadsheet,
  Terminal,
  Play,
  Key,
  Layers,
  Settings,
  X,
  Plus,
  Trash2,
  AlertTriangle,
  Cpu,
  Clock,
  SlidersHorizontal,
  Sparkles,
  Activity,
  Wifi,
  WifiOff,
  Check,
  HelpCircle,
  FileText,
  ChevronRight,
  Code,
  Copy,
  ExternalLink,
  Lock,
  Unlock,
  Send,
  ArrowRight
} from "lucide-react";
import { SyncLog } from "../types";

interface IntegrationsModuleProps {
  syncLogs: SyncLog[];
  onTriggerSync: (type: "Sheets" | "Webhook") => void;
  isSyncing: boolean;
}

// Enterprise Mock Webhook Listeners & Connections
interface ConnectedSystem {
  id: string;
  name: string;
  provider: "Shopify" | "Amazon" | "Flipkart" | "Myntra" | "WooCommerce" | "Custom";
  status: "Connected" | "Running" | "Paused" | "Faulty";
  healthScore: number;
  lastSync: string;
  syncFrequency: string;
  scope: string[];
  clientId?: string;
  clientSecret?: string;
}

export default function IntegrationsModule({ syncLogs, onTriggerSync, isSyncing }: IntegrationsModuleProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "marketplaces" | "sheets" | "mapping" | "developer">("overview");

  // Multi-Store Custom Connectors State
  const [systems, setSystems] = useState<ConnectedSystem[]>([
    {
      id: "CON-01",
      name: "Aura Essentials Shopify Premium",
      provider: "Shopify",
      status: "Connected",
      healthScore: 99,
      lastSync: "2026-06-18 04:15",
      syncFrequency: "15m",
      scope: ["Orders", "Products", "Inventory", "Returns"],
      clientId: "shp_cli_9921200",
      clientSecret: "shp_sec_••••••••••••"
    },
    {
      id: "CON-02",
      name: "Global Warehouse Amazon SP-API Link",
      provider: "Amazon",
      status: "Connected",
      healthScore: 98,
      lastSync: "2026-06-18 05:00",
      syncFrequency: "Real-time Webhook",
      scope: ["Orders", "Inventory", "Shipments"],
      clientId: "amzn_sp_user_33",
      clientSecret: "sp_sec_••••••••••••"
    },
    {
      id: "CON-03",
      name: "Myntra Premium Curations Node",
      provider: "Custom",
      status: "Paused",
      healthScore: 84,
      lastSync: "2026-06-17 18:30",
      syncFrequency: "1h",
      scope: ["Orders"],
      clientId: "myn_node_alpha",
      clientSecret: "myn_sec_••••••••••••"
    },
    {
      id: "CON-04",
      name: "India Retail WooCommerce Node",
      provider: "WooCommerce",
      status: "Connected",
      healthScore: 95,
      lastSync: "2026-06-18 02:45",
      syncFrequency: "12h",
      scope: ["Products", "Inventory"],
      clientId: "wc_ck_99884",
      clientSecret: "wc_cs_••••••••••••"
    },
    {
      id: "CON-05",
      name: "Flipkart Core Seller Link",
      provider: "Flipkart",
      status: "Faulty",
      healthScore: 42,
      lastSync: "2026-06-17 12:15",
      syncFrequency: "6h",
      scope: ["Orders", "Inventory", "Returns"],
      clientId: "fk_key_77a2",
      clientSecret: "fk_sec_••••••••••••"
    }
  ]);

  // Google Sheets Workspace Configuration
  const [sheetUrl, setSheetUrl] = useState("https://docs.google.com/spreadsheets/d/1tY_X4GT_Solutions_Ledger");
  const [selectedSheetTab, setSelectedSheetTab] = useState("Orders");
  const [isSheetsAccountConnected, setIsSheetsAccountConnected] = useState(true);
  const [sheetsSyncSchedule, setSheetsSyncSchedule] = useState("Hourly");

  // Google Sheets Draggable/Visual Column Mapping Schema
  const [sheetsMapping, setSheetsMapping] = useState([
    { targetField: "Order ID (Unique Key)", excelCol: "A", sampleValue: "ORD-99801", isMapped: true },
    { targetField: "Customer Full Name", excelCol: "B", sampleValue: "Aarav Sharma", isMapped: true },
    { targetField: "SKU / Line Product", excelCol: "C", sampleValue: "AURA-SERUM-LAVENDER", isMapped: true },
    { targetField: "Purchased Quantity", excelCol: "D", sampleValue: "2", isMapped: true },
    { targetField: "Order Date timestamp", excelCol: "E", sampleValue: "2026-06-18", isMapped: true },
    { targetField: "Financial Status (Paid/COD)", excelCol: "F", sampleValue: "Paid", isMapped: true },
    { targetField: "Shipping Courier Agent", excelCol: "G", sampleValue: "Delhivery Express", isMapped: true },
    { targetField: "Tracking Manifest AWB", excelCol: "H", sampleValue: "TRK-90088172", isMapped: true },
    { targetField: "Shipment Destination Pincode", excelCol: "I", sampleValue: "400001", isMapped: true }
  ]);

  // Universal Data Field Mapping Models
  const [sourcePlatform, setSourcePlatform] = useState<string>("Shopify");
  const [dataModelType, setDataModelType] = useState<"Order" | "Inventory" | "Customer" | "Return">("Order");
  const [customFieldsMapping, setCustomFieldsMapping] = useState([
    { internalField: "orderId", externalName: "id", desc: "Unique order identifier", validated: true },
    { internalField: "customerName", externalName: "customer.first_name + ' ' + customer.last_name", desc: "Consignee full name translation", validated: true },
    { internalField: "product", externalName: "line_items[0].name", desc: "Primary product string", validated: true },
    { internalField: "quantity", externalName: "line_items[0].quantity", desc: "Summed merchandise count", validated: true },
    { internalField: "revenue", externalName: "total_price", desc: "Total price with discount tags", validated: true },
    { internalField: "trackingNumber", externalName: "fulfillments[0].tracking_number", desc: "Third-party shipping tracking key", validated: true },
    { internalField: "status", externalName: "financial_status === 'paid' ? 'Paid' : 'Pending'", desc: "State translation handler", validated: true }
  ]);

  // Developer API & Hook Configuration
  const [webhookUrl, setWebhookUrl] = useState("https://api.ttgtcommerce.com/v2/webhooks/receiver-alpha");
  const [webhookSecret, setWebhookSecret] = useState("whsec_99a800ffab219a1288bde1930");
  const [activeWebhooks, setActiveWebhooks] = useState([
    { id: "WH-1", name: "Shopify Order Created", topic: "orders/create", active: true },
    { id: "WH-2", name: "Shopify Order Cancelled", topic: "orders/cancelled", active: true },
    { id: "WH-3", name: "Amazon Fulfillment Status", topic: "fba/shipment_status", active: false },
    { id: "WH-4", name: "Delhivery Delivery Completed", topic: "courier/delivery_update", active: true }
  ]);

  // API testing tool state
  const [apiEndpointInput, setApiEndpointInput] = useState("https://api.shopify.com/v3/orders.json?limit=10");
  const [apiTestHeaderKey, setApiTestHeaderKey] = useState("X-Shopify-Access-Token");
  const [apiTestHeaderValue, setApiTestHeaderValue] = useState("shpat_00ffbb9922ff1122aacc");
  const [apiTestBody, setApiTestBody] = useState(`{\n  "status": "any",\n  "fulfillment_status": "unshipped",\n  "created_at_min": "2026-06-18T00:00:00Z"\n}`);
  const [isApiTesting, setIsApiTesting] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<any>(null);
  const [apiTestLogs, setApiTestLogs] = useState<string[]>([]);

  // Modals for connectors
  const [modalConnector, setModalConnector] = useState<ConnectedSystem | null>(null);
  const [newConnectorName, setNewConnectorName] = useState("");
  const [newConnectorProvider, setNewConnectorProvider] = useState<ConnectedSystem["provider"]>("Shopify");
  const [newConnectorClientId, setNewConnectorClientId] = useState("");
  const [newConnectorClientSecret, setNewConnectorClientSecret] = useState("");
  const [newConnectorSyncFreq, setNewConnectorSyncFreq] = useState("15m");
  const [newConnectorScopes, setNewConnectorScopes] = useState<string[]>(["Orders", "Inventory"]);

  // OAuth consent simulate
  const [isOAuthSimActive, setIsOAuthSimActive] = useState(false);
  const [oauthStep, setOauthStep] = useState<"init" | "consenting" | "success">("init");

  // Notifications or toast messages
  const [integrationSystemMessage, setIntegrationSystemMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const displayMessage = (text: string, type: "success" | "error" | "info" = "success") => {
    setIntegrationSystemMessage({ text, type });
    setTimeout(() => setIntegrationSystemMessage(null), 5000);
  };

  // Trigger Sheet integration sync
  const triggerSheetsProcess = () => {
    onTriggerSync("Sheets");
    displayMessage("Google Sheets pipeline triggered. Data blocks synced.", "success");
  };

  // Trigger Webhook / API sync
  const triggerApiProcess = () => {
    onTriggerSync("Webhook");
    displayMessage("API synchronizer processed. Connected webhook logs dispatched.", "info");
  };

  // Add a new system connection
  const handleAddNewSystem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConnectorName) {
      alert("Please provide a valid integration name");
      return;
    }

    const newSys: ConnectedSystem = {
      id: `CON-${Math.floor(10 + Math.random() * 90)}`,
      name: newConnectorName,
      provider: newConnectorProvider,
      status: "Connected",
      healthScore: 100,
      lastSync: "Just configured",
      syncFrequency: newConnectorSyncFreq,
      scope: newConnectorScopes,
      clientId: newConnectorClientId || "client_id_" + Math.floor(Math.random() * 1000000),
      clientSecret: newConnectorClientSecret ? "••••••••••••" : "••••••••••••"
    };

    setSystems((prev) => [...prev, newSys]);
    displayMessage(`API node integrated completely: ${newSys.name}`, "success");
    
    // reset form
    setNewConnectorName("");
    setNewConnectorClientId("");
    setNewConnectorClientSecret("");
    setNewConnectorScopes(["Orders", "Inventory"]);
  };

  // Delete system connection
  const handlePurgeSystem = (id: string, name: string) => {
    if (confirm(`Are you sure you want to decouple the system connection: "${name}"?`)) {
      setSystems((prev) => prev.filter((s) => s.id !== id));
      displayMessage(`Pruned gateway node: ${name}`, "error");
    }
  };

  // Toggle system status (Connected <-> Paused)
  const handleToggleSystemStatus = (id: string, current: string) => {
    setSystems((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = current === "Connected" ? "Paused" : "Connected";
          return {
            ...s,
            status: nextStatus as "Connected" | "Paused"
          };
        }
        return s;
      })
    );
    displayMessage(`Status updated for Node ${id}`, "info");
  };

  // Run dynamic simulated API check
  const handleRunApiTest = async () => {
    setIsApiTesting(true);
    setApiTestResult(null);
    setApiTestLogs(["Initiating DNS lookup...", "Establishing SSL Handshake...", `Connecting to ${apiEndpointInput}`]);

    setTimeout(() => {
      setApiTestLogs(prev => [...prev, `Found 200 OK Response Header`]);
    }, 400);

    setTimeout(() => {
      setApiTestLogs(prev => [...prev, "Payload downloaded: 1.45 KB", "Mapping standard TTGT data models"]);
      
      const mockedResponse = {
        meta: {
          client_gateway: "Shopify Edge Server v1.9",
          timestamp_epoch: Date.now(),
          limit_remaining: 39,
          limit_total: 40,
          call_execution_ms: 182
        },
        payload: {
          orders: [
            {
              id: 998012389,
              order_number: "SHPFY-8812",
              total_price: "1850.00",
              financial_status: "paid",
              created_at: "2026-06-18T14:42:15-05:00",
              customer: {
                first_name: "Amit",
                last_name: "Chawla",
                email: "amit.chawla@gmail.com"
              },
              line_items: [
                {
                  id: 1120038891,
                  name: "Organic Lavender Facial Serum",
                  price: "925.00",
                  quantity: 2,
                  sku: "AURA-SERUM-LAVENDER"
                }
              ],
              shipping_address: {
                city: "Pune",
                province: "Maharashtra",
                zip: "411001"
              }
            }
          ]
        },
        telemetry: {
          connection_health: "Optimal",
          oauth_authority: "Authorized - Scopes: write_orders, read_inventory"
        }
      };

      setApiTestResult(mockedResponse);
      setIsApiTesting(false);
      displayMessage("Endpoint Test Completed successfully", "success");
    }, 1200);
  };

  // Simulated mapping check
  const handleSaveDataMappingFile = () => {
    displayMessage("Core Data Schema Map updated successfully. Changes applied.", "success");
  };

  return (
    <div className="space-y-6">
      {/* Platform Level Dashboard Message */}
      {integrationSystemMessage && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs transition-all duration-300 ${
          integrationSystemMessage.type === "success"
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25"
            : integrationSystemMessage.type === "error"
            ? "bg-rose-500/10 text-rose-600 border-rose-500/25"
            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/25"
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin text-emerald-500" />
            <span className="font-mono font-medium">{integrationSystemMessage.text}</span>
          </div>
          <button onClick={() => setIntegrationSystemMessage(null)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
        </div>
      )}

      {/* Main Tabs Selection Corridor */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 text-xs font-sans font-extrabold flex items-center gap-2 border-b-2 cursor-pointer transition-all ${
            activeTab === "overview"
              ? "border-emerald-500 text-emerald-500 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> Operations Overview
        </button>
        <button
          onClick={() => setActiveTab("marketplaces")}
          className={`px-4 py-2.5 text-xs font-sans font-extrabold flex items-center gap-2 border-b-2 cursor-pointer transition-all ${
            activeTab === "marketplaces"
              ? "border-emerald-500 text-emerald-500 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
        >
          <CloudLightning className="w-3.5 h-3.5" /> Marketplace Connectors
        </button>
        <button
          onClick={() => setActiveTab("sheets")}
          className={`px-4 py-2.5 text-xs font-sans font-extrabold flex items-center gap-2 border-b-2 cursor-pointer transition-all ${
            activeTab === "sheets"
              ? "border-emerald-500 text-emerald-500 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" /> Google Sheets Sync
        </button>
        <button
          onClick={() => setActiveTab("mapping")}
          className={`px-4 py-2.5 text-xs font-sans font-extrabold flex items-center gap-2 border-b-2 cursor-pointer transition-all ${
            activeTab === "mapping"
              ? "border-emerald-500 text-emerald-500 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" /> Visual Schema Mapping
        </button>
        <button
          onClick={() => setActiveTab("developer")}
          className={`px-4 py-2.5 text-xs font-sans font-extrabold flex items-center gap-2 border-b-2 cursor-pointer transition-all ${
            activeTab === "developer"
              ? "border-emerald-500 text-emerald-500 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
        >
          <Code className="w-3.5 h-3.5" /> Developer APIs & webhooks
        </button>
      </div>

      {/* SUB-TAB 1: CONNECTIVITY OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Gateway Health</span>
                <p className="text-xl font-bold font-sans text-emerald-500">98.7% <span className="text-[10px] text-slate-400 font-mono font-normal">SLA</span></p>
                <span className="text-[9px] text-slate-400 font-mono">No API timeout detected</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Wifi className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-101 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Synchronized Nodes</span>
                <p className="text-xl font-bold font-sans dark:text-white">4 / 5 <span className="text-xs text-slate-500 font-normal">Active</span></p>
                <span className="text-[9px] text-rose-500 font-mono font-bold">1 Faulty Node Warn</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Cpu className="w-5 h-5 text-emerald-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-101 dark:border-slate-850 p-4 rounded-xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">API Call Load</span>
                <p className="text-xl font-bold font-sans text-emerald-500">14.8k <span className="text-xs text-slate-400 font-normal font-mono">/hr</span></p>
                <span className="text-[9px] text-slate-400 font-mono">Quota usage: 12.3% of limit</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Google Sheet pipeline</span>
                <p className="text-xl font-bold font-sans dark:text-white">{isSyncing ? "Syncing..." : "Ready"}</p>
                <span className="text-[9px] text-emerald-500 font-mono">Ledger connected</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Connected Systems Grid & Real-time Rate limits */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Active Connector Channels</h3>
                <span className="text-xs text-slate-400 font-mono">Central Connector Hub (Marketplace Agnostic)</span>
              </div>

              <div className="space-y-3">
                {systems.map((sys) => (
                  <div key={sys.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-lg flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        sys.provider === "Shopify"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : sys.provider === "Amazon"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : sys.provider === "WooCommerce"
                          ? "bg-indigo-500/10 text-indigo-500"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-500"
                      }`}>
                        {sys.provider}
                      </span>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white text-[12px]">{sys.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Frequency: {sys.syncFrequency} • Scopes: {sys.scope.join(", ")}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400">Health index</span>
                        <p className={`font-bold ${
                          sys.healthScore < 50 ? "text-rose-500" : sys.healthScore < 90 ? "text-yellow-500" : "text-emerald-500"
                        }`}>{sys.healthScore}%</p>
                      </div>

                      <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        sys.status === "Connected" ? "bg-emerald-500/10 text-emerald-500" : sys.status === "Paused" ? "bg-slate-100 dark:bg-slate-900 text-slate-500" : "bg-rose-500/10 text-rose-500"
                      }`}>
                        {sys.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate limit widgets & logs */}
            <div className="bg-slate-950 text-white rounded-xl p-5 border border-slate-800 font-mono space-y-4">
              <h3 className="text-xs font-black tracking-widest text-emerald-450 text-emerald-400 uppercase border-b border-slate-800 pb-2 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 animate-pulse" /> Webhook live feedback
              </h3>

              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-900 border border-slate-850 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold">SYSTEM BROADCAST STATUS</span>
                    <span className="text-emerald-500 animate-pulse">● BOUND</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Listening on <span className="text-yellow-500 font-bold">{webhookUrl.substring(0, 35)}...</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] text-slate-400 uppercase font-bold">Synchronizer rate limiter metrics:</span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Delhivery Courier quota:</span>
                      <span>4,892 / 5,000 req</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: "97.8%" }} />
                    </div>

                    <div className="flex justify-between pt-1">
                      <span className="text-slate-400">Shopify API token limit:</span>
                      <span>39 / 40 calls</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-yellow-500 h-full rounded-full" style={{ width: "97.5%" }} />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={triggerApiProcess}
                    disabled={isSyncing}
                    className="w-full h-9 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-slate-950 font-black rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} /> Simulate Webhook Trigger
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sync timeline log history */}
          <div className="bg-slate-950 border border-slate-800 text-white rounded-xl p-5 shadow-xl font-mono">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide border-b border-slate-800 pb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-450 text-emerald-400" /> Pipeline Synchronization Audit Trail
            </h4>

            <div className="mt-4 space-y-3.5 max-h-72 overflow-y-auto pr-2 scrollbar-thin">
              {syncLogs.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No synchronization logs returned from server engine.</p>
              ) : (
                syncLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-900 border border-slate-850 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === "Success" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-450"
                        }`}>
                          {log.status}
                        </span>
                        <span className="text-slate-400 font-semibold">{log.type} Sync Node</span>
                        <span className="text-slate-500">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-300 font-mono text-[11px] font-medium leading-relaxed">{log.details}</p>
                    </div>

                    <div className="flex md:flex-col items-start md:items-end justify-between font-mono text-[11px] text-slate-400 uppercase gap-1 shrink-0 pb-1 border-t md:border-t-0 border-slate-800 pt-1 md:pt-0">
                      <span>Files sync: <strong>{log.recordsProcessed} blocks</strong></span>
                      <span className={log.errorCount > 0 ? "text-rose-400 font-bold" : "text-emerald-400"}>
                        Fault indices: <strong>{log.errorCount}</strong>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MARKETPLACE CONNECTORS */}
      {activeTab === "marketplaces" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-md font-sans font-bold leading-tight dark:text-white">Central Marketplace Integration Connectors</h2>
              <p className="text-xs text-slate-400">Map multiple accounts inside the same platform or link custom API systems inside our robust connector registry.</p>
            </div>
          </div>

          {/* Grid of standard connectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systems.map((sys) => (
              <div key={sys.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase border ${
                      sys.status === "Connected"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : sys.status === "Paused"
                        ? "bg-slate-100 dark:bg-slate-950 text-slate-500 border-slate-200"
                        : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    }`}>
                      {sys.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Last Link: {sys.lastSync}</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-md tracking-tight leading-none">{sys.name}</h4>
                    <p className="text-xs text-slate-400 font-mono mt-1">Platform Class: {sys.provider} Gateway</p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Synchronized Entities</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["Orders", "Products", "Inventory", "Returns", "Shipments"].map((objectType) => {
                        const isSelected = sys.scope.includes(objectType);
                        return (
                          <span
                            key={objectType}
                            className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                              isSelected ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10" : "bg-slate-50 dark:bg-slate-950 text-slate-350 dark:text-slate-550 border border-slate-100"
                            }`}
                          >
                            {objectType}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Client Key ID:</span>
                      <span className="font-mono text-[10px] text-slate-600 dark:text-slate-300">{sys.clientId || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sync Schedule:</span>
                      <span className="font-bold text-emerald-500">{sys.syncFrequency}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleSystemStatus(sys.id, sys.status)}
                      className="px-2.5 py-1 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 cursor-pointer text-slate-750 dark:text-gray-300"
                    >
                      {sys.status === "Connected" ? "Pause" : "Resume"}
                    </button>
                    {sys.status === "Faulty" && (
                      <button
                        onClick={() => {
                          setOauthStep("init");
                          setIsOAuthSimActive(true);
                        }}
                        className="px-2.5 py-1 text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-600 rounded cursor-pointer"
                      >
                        Re-Authorize
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handlePurgeSystem(sys.id, sys.name)}
                    className="text-slate-400 hover:text-rose-500 font-mono text-[11px] font-bold"
                  >
                    Decouple Node
                  </button>
                </div>
              </div>
            ))}

            {/* Custom API Integrations Maker Block */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-sans font-extrabold text-slate-800 dark:text-white">Integrate Custom Gateway Node</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Add any custom JSON Rest endpoint, ERP database, or third-party logistics courier mapping directly using our Agnostic Connector Engine.</p>
              </div>

              <div className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-3 text-xs">
                <div className="space-y-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-3 rounded-lg">
                  <span className="font-bold text-[10px] text-slate-400">REUSABLE CONNECTOR SCHEMA</span>
                  <p className="text-[11px] text-slate-500">Supports Shopify Webhook API, WooCommerce OAuth endpoints, Amazon SP-API OAuth corridors, and custom schemas.</p>
                </div>
                <button
                  onClick={() => setIsOAuthSimActive(true)}
                  className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 font-extrabold rounded-lg text-white transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Configure Custom Gateway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GOOGLE SHEETS SYNC */}
      {activeTab === "sheets" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3 flex-wrap gap-2">
              <div>
                <h3 className="text-md font-sans font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-500" /> Secure Google Sheets Ledger Loop
                </h3>
                <p className="text-xs text-slate-400">Stream enterprise orders and inventory lists from your spreadsheet database table securely into TTGT central schemas.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 ${
                  isSheetsAccountConnected ? "bg-emerald-500/10 text-emerald-500 animate-pulse" : "bg-rose-500/10 text-rose-500"
                }`}>
                  {isSheetsAccountConnected ? "★ Pipeline Connected" : "Connection Blocked"}
                </span>
                <button
                  onClick={() => setIsSheetsAccountConnected(!isSheetsAccountConnected)}
                  className="text-xs hover:underline text-slate-400 hover:text-slate-600"
                >
                  {isSheetsAccountConnected ? "Disconnect" : "Re-auth Drive"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                  Spreadsheet Source URL <HelpCircle className="w-3.5 h-3.5 text-slate-300" title="Valid GSheets sharing link" />
                </label>
                <input
                  type="text"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-mono focus:outline-none focus:border-emerald-500 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Worksheet Tab name</label>
                <select
                  value={selectedSheetTab}
                  onChange={(e) => setSelectedSheetTab(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500 dark:text-white font-bold"
                >
                  <option value="Orders">Orders Ledger Tab</option>
                  <option value="Inventory">Inventory Stock Tab</option>
                  <option value="Sellers">Licensed Partners Tab</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 rounded-xl text-xs space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-white">Synchronization Scheduler triggers</h4>
                <p className="text-slate-400 text-[11px]">Choose whether the pull request operates on schedule or requires developer manual clicks.</p>
                <div className="flex gap-2">
                  {["Manual Only", "Hourly", "Daily", "Weekly"].map((sched) => (
                    <button
                      key={sched}
                      onClick={() => setSheetsSyncSchedule(sched)}
                      className={`px-3 py-1.5 rounded font-mono font-bold text-[10px] uppercase border transition-colors ${
                        sheetsSyncSchedule === sched ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/25" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-850 text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {sched}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950 p-4 border border-slate-101 rounded-xl text-xs space-y-1">
                <h4 className="font-bold text-slate-800 dark:text-white">Validation Preview state: Row #2</h4>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-500 mt-2">
                  <div className="p-1 bg-white dark:bg-slate-900 border">
                    <span className="text-slate-400">Col A</span>
                    <p className="font-bold text-slate-700 dark:text-slate-300">ORD-99801</p>
                  </div>
                  <div className="p-1 bg-white dark:bg-slate-900 border">
                    <span className="text-slate-400">Col B</span>
                    <p className="font-bold text-slate-700 dark:text-slate-300">Aarav Sharma</p>
                  </div>
                  <div className="p-1 bg-white dark:bg-slate-905 border">
                    <span className="text-slate-400">Col C</span>
                    <p className="font-bold text-slate-300 truncate">AURA-SERUM-LAVENDER</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Excel Field Mapping Interface inside Sheets config */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-850 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">Interactive Columns Mapping Inspector</span>
                <span className="text-[10px] text-emerald-500 font-mono">Mapped matching complete</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sheetsMapping.map((item, index) => (
                  <div key={index} className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-3 rounded-lg flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5 truncate">
                      <span className="text-[9px] text-slate-400 font-mono">Database Field: <strong className="text-slate-750 dark:text-white">{item.targetField}</strong></span>
                      <p className="text-[10px] text-slate-400 truncate">Example value: <span className="font-mono">{item.sampleValue}</span></p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <ArrowRight className="w-3 h-3 text-emerald-500" />
                      <select
                        value={item.excelCol}
                        onChange={(e) => {
                          const updated = [...sheetsMapping];
                          updated[index].excelCol = e.target.value;
                          setSheetsMapping(updated);
                          displayMessage(`Configured ${item.targetField} to Excel Column ${e.target.value}`, "info");
                        }}
                        className="px-2 py-1 font-mono font-black text-xs border bg-white dark:bg-slate-900 text-emerald-500 border-slate-200 dark:border-slate-800 rounded focus:outline-none"
                      >
                        {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"].map((c) => (
                          <option key={c} value={c}>Excel Col {c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-slate-400 italic font-mono before:content-['//'] before:mr-1 before:text-emerald-500">
                Data pipeline connects directly using Google Drive oauth token security filters.
              </p>

              <button
                onClick={triggerSheetsProcess}
                disabled={isSyncing}
                className="w-full sm:w-auto h-11 px-5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-750 text-slate-950 text-sm font-sans font-extrabold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "Pulling Google sheets Records..." : "Trigger Manual Sheets Sync"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: DATA MAPPING ENGINE STUDIO */}
      {activeTab === "mapping" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
              <div>
                <h3 className="text-md font-sans font-bold dark:text-white">Active Data Model Field Translation Studio</h3>
                <p className="text-xs text-slate-400">Map custom payload properties into TTGT Central standard tables. Reusable across connectors.</p>
              </div>

              <div className="flex gap-2 text-xs">
                <select
                  value={sourcePlatform}
                  onChange={(e) => {
                    setSourcePlatform(e.target.value);
                    displayMessage(`Loaded Schema mappings file for ${e.target.value}`, "info");
                  }}
                  className="px-3 py-1.5 border hover:border-emerald-500 rounded bg-white dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:ring-0"
                >
                  <option value="Shopify">Shopify Mappings</option>
                  <option value="Amazon">Amazon Mappings</option>
                  <option value="Flipkart">Flipkart Link</option>
                  <option value="Custom API v2">Myntra Integrator</option>
                </select>

                <select
                  value={dataModelType}
                  onChange={(e) => {
                    setDataModelType(e.target.value as any);
                    displayMessage(`Loaded model schema: ${e.target.value}`, "info");
                  }}
                  className="px-3 py-1.5 border rounded hover:border-emerald-500 bg-white dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:ring-0"
                >
                  <option value="Order">Standard Order JSON Map</option>
                  <option value="Inventory">Inventory SKU Catalog</option>
                  <option value="Customer">Consignee CRM Data</option>
                  <option value="Return">Returns & Reverse Log</option>
                </select>
              </div>
            </div>

            {/* Field map list */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-2">Translation Map Ledger</span>
              
              <div className="space-y-2 max-h-[440px] overflow-y-auto pr-2">
                {customFieldsMapping.map((field, index) => (
                  <div key={index} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
                    <div className="space-y-1 max-w-sm truncate">
                      <p className="font-extrabold text-slate-850 dark:text-slate-100 text-[12px]">Internal Code key: <span className="text-emerald-500">{field.internalField}</span></p>
                      <p className="text-[11px] text-slate-400 font-sans font-normal italic leading-relaxed">{field.desc}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-350 shrink-0" />
                      <input
                        type="text"
                        value={field.externalName}
                        onChange={(e) => {
                          const updated = [...customFieldsMapping];
                          updated[index].externalName = e.target.value;
                          setCustomFieldsMapping(updated);
                        }}
                        className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-203 dark:border-slate-800 rounded-lg text-xs font-mono font-black text-slate-800 dark:text-white min-w-[240px] focus:outline-none focus:border-emerald-500"
                        placeholder="external_field_key"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t flex items-center justify-between flex-wrap gap-4">
              <span className="text-xs text-slate-400 font-mono italic">Templates save locally in your active sandbox cache memory.</span>
              <button
                onClick={handleSaveDataMappingFile}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 font-black text-xs text-slate-950 rounded-lg cursor-pointer transition-colors"
              >
                Save Schema Map Config
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: DEVELOPER PLAYGROUND APIS & DEV WEBHOOKS */}
      {activeTab === "developer" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Webhook endpoint URL Configuration */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-md font-sans font-bold dark:text-white">Central System API Webhooks Configuration</h3>
                <p className="text-xs text-slate-400">Configure public endpoints for third-party commerce engines to stream events to this platform.</p>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Incoming Notification URL</label>
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Webhook Secret Hash</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={webhookSecret}
                      onChange={(e) => setWebhookSecret(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => displayMessage("Rest API Webhook verification key updated.", "success")}
                      className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold max-h-9 rounded cursor-pointer text-xs"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>

              {/* Status checkboxes mapping events */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-850 pt-3">
                <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Incoming stream webhook listeners</span>
                <div className="space-y-2.5">
                  {activeWebhooks.map((wh) => (
                    <div key={wh.id} className="flex items-center justify-between text-xs p-2 bg-slate-50 dark:bg-slate-950 rounded border">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 dark:text-white">{wh.name}</span>
                        <p className="text-[10px] text-slate-400 font-mono">Topic code match: {wh.topic}</p>
                      </div>

                      <button
                        onClick={() => {
                          const updated = activeWebhooks.map(item => {
                            if (item.id === wh.id) return { ...item, active: !item.active };
                            return item;
                          });
                          setActiveWebhooks(updated);
                          displayMessage(`${wh.name} event listener state changed`, "info");
                        }}
                        className={`px-2 py-1 rounded text-[9px] font-mono font-bold uppercase transition-colors ${
                          wh.active ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-200 text-slate-400 dark:bg-slate-900"
                        }`}
                      >
                        {wh.active ? "Active" : "Disabled"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sandbox Simulated Rest API Testing Room */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 font-mono">
              <div>
                <h3 className="text-xs font-black tracking-widest text-emerald-450 text-emerald-400 uppercase">Live REST API Testing Sandbox</h3>
                <p className="text-[11px] text-slate-400 font-sans mt-1">Simulate live HTTP requests to any custom commerce channel or marketplace payload below.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Target Endpoint URL</label>
                  <input
                    type="text"
                    value={apiEndpointInput}
                    onChange={(e) => setApiEndpointInput(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 text-yellow-500 rounded text-xs select-none focus:outline-none font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Custom Header key</label>
                    <input
                      type="text"
                      value={apiTestHeaderKey}
                      onChange={(e) => setApiTestHeaderKey(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 text-slate-300 rounded text-[11px] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Auth token value</label>
                    <input
                      type="text"
                      value={apiTestHeaderValue}
                      onChange={(e) => setApiTestHeaderValue(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 text-slate-300 rounded text-[11px] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Request JSON Body</label>
                  <textarea
                    rows={4}
                    value={apiTestBody}
                    onChange={(e) => setApiTestBody(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 text-emerald-400 font-mono rounded text-xs focus:outline-none scrollbar-thin"
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleRunApiTest}
                    disabled={isApiTesting}
                    className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-slate-950 font-black rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {isApiTesting ? "Dispatching API request..." : "Execute API Sandbox Test"}
                  </button>
                </div>
              </div>

              {/* Console log response preview */}
              {apiTestLogs.length > 0 && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-slate-450 uppercase block">Sandbox Console Log</span>
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg text-[10px] text-slate-300 space-y-1 max-h-36 overflow-y-auto">
                    {apiTestLogs.map((lg, i) => (
                      <p key={i} className="before:content-['>'] before:mr-2 before:text-emerald-500">{lg}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* JSON preview code block */}
              {apiTestResult && (
                <div className="pt-3 border-t border-slate-805 space-y-2">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase block flex items-center justify-between">
                    <span>HTTP 200 OK • Response Body JSON</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(apiTestResult, null, 2));
                        displayMessage("Copied to clipboard", "success");
                      }}
                      className="text-slate-450 hover:text-white"
                    >
                      [Copy JSON]
                    </button>
                  </span>
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-blue-300 overflow-x-auto max-h-52 overflow-y-auto font-mono scrollbar-thin">
                    {JSON.stringify(apiTestResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OAUTH CONSENT SIMULATION MODAL */}
      {isOAuthSimActive && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-[200] flex items-center justify-center p-4 antialiased">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative font-sans text-xs">
            <button
              onClick={() => setIsOAuthSimActive(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100 dark:bg-slate-950 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {oauthStep === "init" && (
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                    <CloudLightning className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Active Connector Setup Wizard</h3>
                    <p className="text-xs text-slate-400 font-medium">Link marketplaces with standard security credentials or live API secrets.</p>
                  </div>
                </div>

                <form onSubmit={handleAddNewSystem} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Source Marketplace integration Name</label>
                    <input
                      type="text"
                      required
                      value={newConnectorName}
                      onChange={(e) => setNewConnectorName(e.target.value)}
                      placeholder="e.g. Shopify Mumbai Store"
                      className="w-full px-3 py-2 border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Provider API Framework</label>
                      <select
                        value={newConnectorProvider}
                        onChange={(e) => setNewConnectorProvider(e.target.value as any)}
                        className="w-full px-3 py-2 border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none"
                      >
                        <option value="Shopify">Shopify REST Admin</option>
                        <option value="Amazon">Amazon Selling Partner (SP-API)</option>
                        <option value="WooCommerce">WooCommerce REST integration</option>
                        <option value="Flipkart">Flipkart Seller Center API</option>
                        <option value="Custom">Custom Agnostic API Endpoint</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Sync Frequency timer</label>
                      <select
                        value={newConnectorSyncFreq}
                        onChange={(e) => setNewConnectorSyncFreq(e.target.value)}
                        className="w-full px-3 py-2 border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none"
                      >
                        <option value="Real-time Webhook">Real-time Webhook Stream</option>
                        <option value="15m">Every 15 minutes</option>
                        <option value="1h">Every 1 hour</option>
                        <option value="12h">Every 12 hours</option>
                        <option value="24h">Once daily (24h)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Authentication Client ID or Key</label>
                    <input
                      type="text"
                      value={newConnectorClientId}
                      onChange={(e) => setNewConnectorClientId(e.target.value)}
                      placeholder="e.g. shpat_xxxxxx or client_id_key"
                      className="w-full px-3 py-2 border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Access Client Secret Auth token</label>
                    <input
                      type="password"
                      value={newConnectorClientSecret}
                      onChange={(e) => setNewConnectorClientSecret(e.target.value)}
                      placeholder="••••••••••••••••••••••••••••••••"
                      className="w-full px-3 py-2 border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl space-y-1.5 border">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Connect utilizing single sign-on (OAuth 2.0)?</span>
                    <p className="text-slate-500 text-[11px] leading-relaxed">If checked, authorize Shopify / Amazon SP-API using our verified single-click credential portal simulation.</p>
                    <button
                      type="button"
                      onClick={() => setOauthStep("consenting")}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 font-bold text-white rounded text-[11px] cursor-pointer"
                    >
                      Begin OAuth Authorization process
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 font-black text-slate-950 rounded-lg cursor-pointer transition-colors text-sm"
                    >
                      Complete connector coupling
                    </button>
                  </div>
                </form>
              </div>
            )}

            {oauthStep === "consenting" && (
              <div className="p-6 space-y-6 text-center antialiased">
                <div className="mx-auto w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <Lock className="w-8 h-8 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-md font-bold text-slate-900 dark:text-white">Agnostic OAuth 2.0 Gateway Provider</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">TTGT Commerce operations service is requesting permissions to synchronize products, orders, refunds, and live inventory quantities with your {newConnectorProvider || "Shopify"} Store Node.</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 border p-4 rounded-xl text-left font-mono text-[10px] text-slate-500 max-w-sm mx-auto space-y-1.5">
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-bold">REQUESTED PERMISSIONS:</span>
                    <span className="text-emerald-500">SECURE ACCESS</span>
                  </div>
                  <p>✔ read_orders, write_orders</p>
                  <p>✔ read_inventory, write_inventory</p>
                  <p>✔ read_products, write_products</p>
                </div>

                <div className="flex gap-3 justify-center pt-3 border-t">
                  <button
                    onClick={() => setOauthStep("init")}
                    className="px-4 py-2 border dark:border-slate-800 rounded bg-white dark:bg-slate-950 dark:text-white font-bold cursor-pointer hover:bg-slate-50"
                  >
                    Back to settings
                  </button>
                  <button
                    onClick={() => {
                      setOauthStep("success");
                      setTimeout(() => {
                        setIsOAuthSimActive(false);
                        const newSys: ConnectedSystem = {
                          id: `CON-${Math.floor(10 + Math.random() * 90)}`,
                          name: newConnectorName || `${newConnectorProvider} Unified Channel`,
                          provider: newConnectorProvider,
                          status: "Connected",
                          healthScore: 100,
                          lastSync: "Just synced via OAuth",
                          syncFrequency: "Real-time Webhook",
                          scope: ["Orders", "Products", "Inventory"],
                          clientId: "oauth_access_token_99aa",
                          clientSecret: "OAuth Authorized Status"
                        };
                        setSystems(prev => [...prev, newSys]);
                        displayMessage(`Linked through Secure OAuth integration: ${newSys.name}`, "success");
                      }, 1400);
                    }}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded cursor-pointer"
                  >
                    Grant verified Access Permissions
                  </button>
                </div>
              </div>
            )}

            {oauthStep === "success" && (
              <div className="p-6 space-y-4 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CheckCircle className="w-10 h-10 animate-pulse" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Credentials Verified Completely</h3>
                <p className="text-xs text-slate-400">Storing secure OAuth credentials and access parameters safely under client encryption keys. Synced.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

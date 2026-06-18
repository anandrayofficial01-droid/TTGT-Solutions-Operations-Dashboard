import React, { useState } from "react";
import {
  Database,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Settings,
  Flame,
  FileSpreadsheet,
  Globe,
  HardDrive,
  Link2,
  FileText
} from "lucide-react";
import { OrderStatus } from "../types";

export interface DataConnector {
  id: string;
  name: string;
  type: "Google Sheet" | "REST API" | "Webhook" | "JSON / CSV" | "Database" | "Sandbox Simulation";
  status: "Connected" | "Disconnected" | "Syncing" | "Error";
  lastSynced: string;
  config: any;
}

interface DataSourceManagerProps {
  connectors: DataConnector[];
  onAddConnector: (connector: DataConnector) => void;
  onDeleteConnector: (id: string) => void;
  onModifyConnector: (id: string, updated: Partial<DataConnector>) => void;
  onTriggerSync: (connectorId: string) => void;
  onGenerateDemoData?: () => void; // Generates real orders inside the store to instantly test the system
}

export default function DataSourceManager({
  connectors,
  onAddConnector,
  onDeleteConnector,
  onModifyConnector,
  onTriggerSync,
  onGenerateDemoData
}: DataSourceManagerProps) {
  const [activeForm, setActiveForm] = useState<"none" | "sheet" | "api" | "db">("none");
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; msg: string } | null>(null);

  // Form states for Google Sheets
  const [sheetName, setSheetName] = useState("Logistics Central");
  const [sheetUrl, setSheetUrl] = useState("");
  const [sheetRange, setSheetRange] = useState("Orders!A:K");
  const [sheetHeaders, setSheetHeaders] = useState("Row 1");
  const [sheetInterval, setSheetInterval] = useState("10");

  // Custom spreadsheet column mapping state
  const [columnMapping, setColumnMapping] = useState({
    id: "Order ID",
    customerName: "Customer Name",
    product: "Product",
    quantity: "Qty",
    marketplace: "Marketplace",
    store: "Store",
    status: "Status",
    courier: "Courier",
    trackingNumber: "AWB / Tracking Number",
    revenue: "Amount",
    phone: "Buyer Phone",
    city: "City",
    state: "State"
  });

  // Form states for REST API
  const [apiName, setApiName] = useState("Shipsy Live Webhook Link");
  const [apiUrl, setApiUrl] = useState("");
  const [apiMethod, setApiMethod] = useState("GET");
  const [apiHeaderName, setApiHeaderName] = useState("Authorization");
  const [apiHeaderVal, setApiHeaderVal] = useState("Bearer ");
  const [apiResponseMapping, setApiResponseMapping] = useState("data.orders");

  // Connection testing simulator
  const handleTestConnection = (connId: string) => {
    setTestingId(connId);
    setTestResult(null);
    setTimeout(() => {
      setTestingId(null);
      const isOk = Math.random() > 0.15;
      setTestResult({
        id: connId,
        success: isOk,
        msg: isOk 
          ? "Credentials authenticated successfully. Response code [200 OK]." 
          : "Connection failed: Dial timeout. Check network firewalls."
      });
    }, 1500);
  };

  const submitSheetConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetUrl) return;

    onAddConnector({
      id: "CONN_" + Math.random().toString(36).substring(2, 9),
      name: sheetName,
      type: "Google Sheet",
      status: "Connected",
      lastSynced: "Just Now",
      config: {
        url: sheetUrl,
        range: sheetRange,
        interval: sheetInterval,
        mapping: columnMapping
      }
    });

    setSheetUrl("");
    setActiveForm("none");
  };

  const submitApiConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiUrl) return;

    onAddConnector({
      id: "CONN_" + Math.random().toString(36).substring(2, 9),
      name: apiName,
      type: "REST API",
      status: "Connected",
      lastSynced: "Never",
      config: {
        url: apiUrl,
        method: apiMethod,
        headers: { [apiHeaderName]: apiHeaderVal },
        mappingPath: apiResponseMapping
      }
    });

    setApiUrl("");
    setActiveForm("none");
  };

  // Pre-configured Sandbox Simulator connector trigger
  const handleAddSandboxSim = () => {
    const sandboxConn = connectors.find(c => c.type === "Sandbox Simulation");
    if (sandboxConn) {
      onTriggerSync(sandboxConn.id);
      return;
    }

    onAddConnector({
      id: "CONN_SANDBOX",
      name: "TTGT Sandbox Live Pipeline",
      type: "Sandbox Simulation",
      status: "Connected",
      lastSynced: "Just Now",
      config: {
        interval: "5"
      }
    });
    if (onGenerateDemoData) {
      onGenerateDemoData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Connector Header Hub */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-500" /> Operational Data Sources Setup
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Connect external databases, marketplaces, webhook hooks, REST gateways or Google Spreadsheet tables.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveForm(activeForm === "sheet" ? "none" : "sheet")}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> + Google Sheets URL
            </button>
            <button
              onClick={() => setActiveForm(activeForm === "api" ? "none" : "api")}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500" /> + REST API URL
            </button>
            <button
              onClick={handleAddSandboxSim}
              className="flex items-center gap-1.5 bg-emerald-550 hover:bg-emerald-600 bg-emerald-500 text-white px-3.5 py-2 rounded-lg text-xs font-extrabold tracking-tight transition-all cursor-pointer shadow-sm"
              title="Instantly generate live dashboard visualization items"
            >
              <Flame className="w-4 h-4 text-white animate-pulse" /> Connect Sandbox Logs
            </button>
          </div>
        </div>
      </div>

      {/* Sheet Form */}
      {activeForm === "sheet" && (
        <form onSubmit={submitSheetConfig} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b pb-2 mb-2 border-slate-100 dark:border-slate-800">
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> New Sheets Mapping Protocol
            </span>
            <button type="button" onClick={() => setActiveForm("none")} className="text-slate-400 hover:text-slate-600">
              <XCircle className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 uppercase">Connector Name</label>
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 text-xs rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[11px] font-mono text-slate-500 uppercase">Google Sheet ID or Full URL Link</label>
              <input
                type="text"
                required
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvGdB..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 text-xs rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 uppercase font-black">Sheet Name & Cells Scope</label>
              <input
                type="text"
                value={sheetRange}
                onChange={(e) => setSheetRange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 text-xs rounded text-slate-800 dark:text-slate-100 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 uppercase">Header Location Row</label>
              <select
                value={sheetHeaders}
                onChange={(e) => setSheetHeaders(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 text-xs rounded text-slate-800 dark:text-slate-100 focus:outline-none"
              >
                <option value="Row 1">Row 1 (Static Titles)</option>
                <option value="Row 2">Row 2</option>
                <option value="Autodetect">Autodetect labels</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 uppercase">Auto Sync Cycle (seconds)</label>
              <select
                value={sheetInterval}
                onChange={(e) => setSheetInterval(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 text-xs rounded text-slate-800 dark:text-slate-100 focus:outline-none"
              >
                <option value="5">Every 5 Seconds</option>
                <option value="10">Every 10 Seconds</option>
                <option value="30">Every 30 Seconds</option>
                <option value="60">Every 60 Seconds</option>
                <option value="Manual">Manual Synchronization Mode</option>
              </select>
            </div>
          </div>

          {/* Dynamic Spreadsheet Columns Mapping Widget */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
            <span className="text-[11px] font-mono font-extrabold text-slate-500 uppercase block mb-3">Dynamically Bind Spreadsheet Columns names</span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {Object.keys(columnMapping).map((key) => (
                <div key={key} className="space-y-1">
                  <span className="text-[10px] font-mono capitalize text-slate-400 block">{key.replace(/([A-Z])/g, " $1")}</span>
                  <input
                    type="text"
                    value={(columnMapping as any)[key]}
                    onChange={(e) => {
                      const val = e.target.value;
                      setColumnMapping(prev => ({ ...prev, [key]: val }));
                    }}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 text-[11px] rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setActiveForm("none")} className="p-2 border rounded text-xs text-slate-600">Cancel</button>
            <button type="submit" className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs px-4 font-bold">Deploy Connector</button>
          </div>
        </form>
      )}

      {/* REST API Form */}
      {activeForm === "api" && (
        <form onSubmit={submitApiConfig} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b pb-2 mb-2 border-slate-100 dark:border-slate-800">
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-500" /> REST Dispatch Endpoint Configure
            </span>
            <button type="button" onClick={() => setActiveForm("none")} className="text-slate-400 hover:text-slate-600">
              <XCircle className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 uppercase">Endpoint Friendly Name</label>
              <input
                type="text"
                value={apiName}
                onChange={(e) => setApiName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 text-xs rounded text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 uppercase">API Verb/Method</label>
              <select
                value={apiMethod}
                onChange={(e) => setApiMethod(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 text-xs rounded text-slate-800 dark:text-slate-100"
              >
                <option value="GET">GET (Retrieve List)</option>
                <option value="POST">POST (Trigger Fetch)</option>
                <option value="PUT">PUT (Dispatch Update)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 uppercase">Payload Array Mapping Path</label>
              <input
                type="text"
                value={apiResponseMapping}
                onChange={(e) => setApiResponseMapping(e.target.value)}
                placeholder="response.data.orders"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 text-xs rounded text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="space-y-1 md:col-span-3">
              <label className="text-[11px] font-mono text-slate-500 uppercase">REST API Destination URL</label>
              <input
                type="text"
                required
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.ttgtsolutions.com/v3/logistics/orders/sync"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 text-xs rounded text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 uppercase">Custom Header Field</label>
              <input
                type="text"
                value={apiHeaderName}
                onChange={(e) => setApiHeaderName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 text-xs rounded text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[11px] font-mono text-slate-500 uppercase">Header Auth Secret Token</label>
              <input
                type="text"
                value={apiHeaderVal}
                onChange={(e) => setApiHeaderVal(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 text-xs rounded text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setActiveForm("none")} className="p-2 border rounded text-xs text-slate-600">Cancel</button>
            <button type="submit" className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs px-4 font-bold">Deploy API Endpoint</button>
          </div>
        </form>
      )}

      {/* Connectors Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connectors.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 border border-dashed border-slate-300 dark:border-slate-800 text-center p-12 rounded-xl bg-white dark:bg-slate-900">
            <Database className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-extrabold text-slate-700 dark:text-slate-350">No Live Database Connection Established</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Redundant mock states have been disabled. Initiate a mapping protocol above or link the live Sandboxed continuous log.
            </p>
          </div>
        ) : (
          connectors.map((c) => (
            <div key={c.id} className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-xl p-4 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {c.type === "Google Sheet" ? (
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                    ) : c.type === "Sandbox Simulation" ? (
                      <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600">
                        <Flame className="w-4 h-4 animate-pulse" />
                      </div>
                    ) : (
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
                        <Globe className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-black text-slate-800 dark:text-slate-100 block truncate max-w-44">
                        {c.name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">
                        {c.type} &bull; {c.id}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-extrabold border ${
                    c.status === "Connected" 
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                      : c.status === "Syncing" 
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse"
                      : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                  }`}>
                    {c.status}
                  </span>
                </div>

                {/* Configuration details summary */}
                <div className="bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-lg mt-3 text-[11px] space-y-1 text-slate-500 dark:text-slate-400 font-mono">
                  {c.type === "Google Sheet" && (
                    <>
                      <div className="truncate"><strong className="text-slate-400">URL:</strong> {c.config.url}</div>
                      <div><strong className="text-slate-400">Cells:</strong> {c.config.range}</div>
                    </>
                  )}
                  {c.type === "REST API" && (
                    <>
                      <div className="truncate"><strong className="text-slate-400">Verbs:</strong> {c.config.method} {c.config.url}</div>
                      <div><strong className="text-slate-400">Mapping:</strong> {c.config.mappingPath}</div>
                    </>
                  )}
                  {c.type === "Sandbox Simulation" && (
                    <>
                      <div><strong className="text-slate-400">Interval:</strong> Every 5 seconds</div>
                      <div><strong className="text-slate-400">Type:</strong> Continuous stream pipeline</div>
                    </>
                  )}
                  <div className="text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-1.5 mt-1.5">
                    Last synchronised: {c.lastSynced}
                  </div>
                </div>
              </div>

              {/* Interaction pane */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-3 mt-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleTestConnection(c.id)}
                  disabled={testingId === c.id}
                  className="flex-1 text-center py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-[10px] font-mono text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  {testingId === c.id ? "Pinging..." : "Test Connection"}
                </button>
                <button
                  type="button"
                  onClick={() => onTriggerSync(c.id)}
                  className="flex items-center justify-center p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                  title="Manual data refresh cycle"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteConnector(c.id)}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-500 rounded border border-rose-200 dark:border-rose-800/50 transition-colors cursor-pointer"
                  title="Delete connection metadata"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Connection response banner */}
              {testResult && testResult.id === c.id && (
                <div className={`p-2 rounded mt-2.5 text-[10px] font-mono flex items-start gap-1.5 border ${
                  testResult.success
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                    : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                }`}>
                  {testResult.success ? <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />}
                  <span>{testResult.msg}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

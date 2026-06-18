import React, { useState, useEffect } from "react";
import {
  Activity,
  ArrowLeft,
  RefreshCw,
  Zap,
  Truck,
  MapPin,
  Clock,
  Terminal,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Smartphone,
  Globe,
  Settings,
  XCircle,
  HelpCircle,
  MessageSquare
} from "lucide-react";
import { Order, OrderStatus } from "../types";

interface LiveOrderTelemetryProps {
  order: Order;
  onBack: () => void;
  onRefreshDatabase?: () => void;
  onModifyStatus?: (id: string, status: OrderStatus) => void;
}

export default function LiveOrderTelemetry({
  order,
  onBack,
  onRefreshDatabase,
  onModifyStatus
}: LiveOrderTelemetryProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryLogs, setRetryLogs] = useState<string[]>([]);
  const [telemetryPings, setTelemetryPings] = useState<{ id: string; time: string; msg: string; source: string }[]>([]);

  // Hash value for deterministic calculations
  const hashVal = order.customerName.length + (parseInt(order.id.replace(/\D/g, "")) || 47);

  // Generate initial dry run telemetry logs relative to order status
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    const initialLogs = [
      { id: "P5", time: "08:04:05 AM", msg: `SLA status parsed: Delivered in 34 hours (Target 48 hours). Breach flag: FALSE`, source: "Courier SLA Parser" },
      { id: "P4", time: "07:55:04 AM", msg: `Carrier Webhook Postback: Status 'DELIVERED'. Signed for by recipient: Amit Chawla`, source: "Bluedart Gateway" },
      { id: "P3", time: "05:15:20 AM", msg: `API Poll: Handed over at regional delivery lane B. Courier SCAN ID: BD209581`, source: "Carrier API client" },
      { id: "P2", time: "Yesterday, 06:12 PM", msg: `Webhook hook: Status update received 'DISPATCH_DOCK_OUT' - In transit to destination`, source: "Shopify Hub" },
      { id: "P1", time: "Yesterday, 09:30 AM", msg: `System created: Transaction parsed and matching filters. Assigned route: Air Courier`, source: "TTGT Solutions Router" }
    ];

    // Filter logs depending on current state
    if (order.status === OrderStatus.New || order.status === OrderStatus.Processing) {
      setTelemetryPings(initialLogs.slice(4));
    } else if (order.status === OrderStatus.Packed) {
      setTelemetryPings(initialLogs.slice(3));
    } else if (order.status === OrderStatus.Shipped) {
      setTelemetryPings(initialLogs.slice(2));
    } else {
      setTelemetryPings(initialLogs);
    }
  }, [order]);

  // Handle retry sync execution simulator
  const handleRetryApiSync = () => {
    setIsRetrying(true);
    const newLogLine = `[${new Date().toLocaleTimeString()}] Dispatching payload retry to Shopify with status: ${order.status}...`;
    setRetryLogs(prev => [newLogLine, ...prev]);

    setTimeout(() => {
      const isSuccess = Math.random() > 0.15;
      const responseLine = `[${new Date().toLocaleTimeString()}] HTTP response: ${isSuccess ? "200 SUCCESS." : "503 SERVICE UNAVAILABLE."} Synchronization complete for ID: ${order.id}.`;
      setRetryLogs(prev => [responseLine, ...prev]);
      setIsRetrying(false);

      if (isSuccess && onRefreshDatabase) {
        onRefreshDatabase();
      }
    }, 1200);
  };

  const handlePulseWebhookSim = () => {
    const timeStr = new Date().toLocaleTimeString();
    const sources = ["Delhivery API Link", "Shopify REST Webhook", "Amazon Sales SP-API"];
    const randomSrc = sources[Math.floor(Math.random() * sources.length)];
    const randomMsg = `Incoming webhook ping status synchronised: "${order.status}" for order ${order.id}. Checksum matched [SHA-256 Valid].`;

    setTelemetryPings(prev => [
      { id: `PING_${Math.random()}`, time: timeStr, msg: randomMsg, source: randomSrc },
      ...prev
    ]);
  };

  // Deliverable node tracker indices
  const currentIndexMap = () => {
    switch (order.status) {
      case OrderStatus.New:
        return 0;
      case OrderStatus.Processing:
        return 1;
      case OrderStatus.Packed:
        return 2;
      case OrderStatus.Shipped:
        return 3;
      case OrderStatus.Delivered:
        return 4;
      default:
        return 2;
    }
  };

  const activeIndex = currentIndexMap();

  const transitMilestones = [
    { title: "MUMBAI G1", desc: "Warehouse Dock", done: activeIndex >= 0 },
    { title: "CARGO ROAD", desc: "Sorters Hub", done: activeIndex >= 1 },
    { title: "CARRIER IN", desc: "Logistics Pad", done: activeIndex >= 2 },
    { title: "TRANSIT LINE", desc: "Last-Mile Node", done: activeIndex >= 3 },
    { title: "DELIVERED", desc: "Completed Cycle", done: activeIndex >= 4 },
  ];

  return (
    <div className="space-y-6 select-none animate-[fadeIn_0.15s_ease-out]">
      
      {/* Return navbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 px-2 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-350 border border-slate-205 dark:border-slate-850 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Telemetry Gate
          </button>
          <div className="h-6 w-0.5 bg-slate-200"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase font-mono tracking-wider">Telemetry Tower: {order.id}</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Signal Active
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Carrier routing via: <strong>{order.courier}</strong> &bull; AWB: <strong>{order.trackingNumber || "—"}</strong></p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePulseWebhookSim}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            title="Inject simulated operational webhook telemetry ping"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Pulse Webhook Scan
          </button>
          <button
            onClick={onBack}
            className="p-2 bg-slate-103 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" /> Refresh pings
          </button>
        </div>
      </div>

      {/* Grid: Map and details matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left column (Detailed status monitor, SVG map simulation, timeline) - takes 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Milestone Map Progress slider */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 rounded-xl shadow-sm text-center">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block text-left mb-6">Interactive Parcels Location tracker</span>
            
            <div className="grid grid-cols-5 gap-2 relative">
              {/* Underlying linking timeline bar */}
              <div className="absolute top-4 left-5 right-5 h-1 bg-slate-100 dark:bg-slate-800 -z-10"></div>
              <div 
                className="absolute top-4 left-5 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 -z-10 transition-all duration-700" 
                style={{ width: `${(activeIndex / 4) * 91}%` }}
              ></div>

              {transitMilestones.map((mil, idx) => (
                <div key={mil.title} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    idx <= activeIndex
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : idx === activeIndex + 1
                      ? "bg-amber-50 border-amber-400 text-amber-600 animate-pulse dark:bg-amber-950 dark:border-amber-800"
                      : "bg-white border-slate-200 text-slate-400 dark:bg-slate-950 dark:border-slate-850"
                  }`}>
                    {idx < activeIndex ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className={`text-[10px] font-black uppercase text-slate-800 dark:text-slate-150 mt-2 block truncate max-w-full ${idx === activeIndex ? "text-emerald-505 font-black" : "text-slate-500"}`}>
                    {mil.title}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono block truncate max-w-full">{mil.desc}</span>
                </div>
              ))}
            </div>

            {/* SVG Interactive Delivery map diagram */}
            <div className="mt-8 border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl relative overflow-hidden flex flex-col justify-center items-center min-h-[160px]">
              <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
              
              <svg className="w-full max-w-lg h-32 relative z-10" viewBox="0 0 500 120">
                {/* Simulated geographic transit links */}
                <path d="M50 80 Q 250 10 450 80" fill="none" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="5,5" />
                <path 
                  d="M50 80 Q 250 10 450 80" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="3.5" 
                  strokeDasharray="14,14" 
                  className="animate-pulse" 
                  strokeDashoffset={activeIndex * 20}
                  style={{ strokeDashoffset: "20" }}
                />

                {/* Nodes */}
                <circle cx="50" cy="80" r="14" fill="#10b981" stroke="#fff" strokeWidth="3" />
                <text x="50" y="112" fill="#64748b" fontSize="9" textAnchor="middle" fontWeight="bold">MUM-HUB</text>

                <circle cx="250" cy="35" r="12" fill={activeIndex >= 2 ? "#10b981" : "#f59e0b"} stroke="#fff" strokeWidth="2.5" />
                <text x="250" y="18" fill="#64748b" fontSize="8" textAnchor="middle" fontWeight="bold">AIR-GATEWAY</text>

                <circle cx="450" cy="80" r="14" fill={activeIndex >= 4 ? "#10b981" : "#cbd5e1"} stroke="#fff" strokeWidth="3" />
                <text x="450" y="112" fill="#64748b" fontSize="9" textAnchor="middle" fontWeight="bold">DEL-REGION</text>

                {/* Simulated parcel position icon indicator along path */}
                {activeIndex < 4 ? (
                  <g className="animate-bounce" transform={`translate(${50 + activeIndex * 100}, ${80 - activeIndex * 14})`}>
                    <rect x="-10" y="-12" width="20" height="14" rx="2" fill="#3b82f6" />
                    <polygon points="-4,-12 0,-18 4,-12" fill="#3b82f6" />
                    <text x="0" y="-2" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">IN</text>
                  </g>
                ) : (
                  <g transform="translate(450, 80)">
                    <circle cx="0" cy="0" r="18" fill="#10b981" className="animate-ping" opacity="0.3" />
                  </g>
                )}
              </svg>

              <span className="text-[10px] font-mono text-slate-400 relative z-10 block mt-2 text-center">
                Current Estimated Coordinates: <strong className="text-slate-600 dark:text-slate-300">Lat +19.07, Lng +72.87 [Local Dock scan]</strong>
              </span>
            </div>
          </div>

          {/* Webhook Stream logs */}
          <div className="bg-slate-900 border border-slate-950 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-emerald-500" /> Carrier Postback webhook Log Stream
              </h4>
              <span className="text-[10px] text-slate-500">Live Scanners linked</span>
            </div>

            <div className="space-y-2 max-h-[290px] overflow-y-auto pad-right-xs">
              {telemetryPings.map((ping) => (
                <div key={ping.id} className="bg-slate-950 border border-slate-850 p-3 rounded-lg text-[10px] font-mono leading-relaxed space-y-1">
                  <div className="flex justify-between items-center text-slate-40.5 border-b border-slate-900 pb-1 flex-wrap gap-1">
                    <span className="text-slate-400 font-extrabold">{ping.source}</span>
                    <span className="text-slate-500">{ping.time}</span>
                  </div>
                  <p className="text-slate-300 font-medium pl-1.5 border-l border-emerald-500 mt-1">{ping.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column (Control actions, Retry API status console, diagnostic logs) - takes 1 col */}
        <div className="space-y-6">
          
          {/* Diagnostic Command Center actions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-4">
            <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider border-b pb-1.5 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-slate-400" /> Diagnostics Control
            </h4>

            {/* Direct Sync logs triggers */}
            <div className="space-y-3.5">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">REST API Synchronization Status</span>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-150">Active pipeline link ok</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <button
                  onClick={handleRetryApiSync}
                  disabled={isRetrying}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-mono rounded text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} /> 
                  {isRetrying ? "Retrying endpoint sync..." : "Force Route Re-Sync API"}
                </button>
              </div>

              {/* Status overrides */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5">
                <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">Emergency local status overwrite</span>
                <select
                  value={order.status}
                  onChange={(e) => {
                    const st = e.target.value as OrderStatus;
                    if (onModifyStatus) {
                      onModifyStatus(order.id, st);
                    }
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 py-1.5 px-2.5 text-xs rounded text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
                >
                  {Object.values(OrderStatus).map((stVal) => (
                    <option key={stVal} value={stVal}>{stVal}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Diagnostic Console screen log reader */}
          <div className="bg-slate-900 border border-slate-950 rounded-xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block">Terminal Re-Sync Console log</span>
            
            <div className="text-[10px] text-slate-350 bg-slate-950 p-3 rounded-lg font-mono min-h-[140px] max-h-[220px] overflow-y-auto leading-relaxed border border-slate-900 flex flex-col justify-end">
              {retryLogs.length === 0 ? (
                <span className="text-slate-500 self-center justify-self-center py-6 text-center italic">[No retry procedures executed. Wait for instructions...]</span>
              ) : (
                retryLogs.map((log, idx) => (
                  <span key={idx} className="block text-slate-300 mt-1 select-all">{log}</span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

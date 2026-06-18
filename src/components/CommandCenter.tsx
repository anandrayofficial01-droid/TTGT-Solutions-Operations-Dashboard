import React, { useState, useEffect } from "react";
import {
  Activity,
  RefreshCw,
  Clock,
  Database,
  BellRing,
  CheckCircle,
  AlertOctagon,
  TrendingDown,
  Sparkles,
  Zap
} from "lucide-react";
import { Order, OrderStatus, InventoryItem, ReturnOrder, OperationNotification } from "../types";

interface CommandCenterProps {
  orders: Order[];
  inventory: InventoryItem[];
  returns: ReturnOrder[];
  notifications: OperationNotification[];
  onTriggerSync: (type: "Sheets" | "Webhook") => void;
  onClearNotifications: () => void;
}

export default function CommandCenter({
  orders,
  inventory,
  returns,
  notifications,
  onTriggerSync,
  onClearNotifications
}: CommandCenterProps) {
  // 60 seconds auto sync visual timer
  const [countdown, setCountdown] = useState(60);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Trigger mock sync on countdown completion
          handleAutoSync();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAutoSync = async () => {
    setSyncing(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    onTriggerSync("Webhook"); // Triggers server-side state adjustment
    setSyncing(false);
  };

  const handleManualSync = async (type: "Sheets" | "Webhook") => {
    setSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onTriggerSync(type);
    setSyncing(false);
    setCountdown(60);
  };

  // Compute operational levels
  const liveNewOrders = orders.filter((o) => o.status === OrderStatus.New).length;
  const livePacked = orders.filter((o) => o.status === OrderStatus.Packed).length;
  const liveDelayed = orders.filter((o) => o.id === "ORD-99304" || o.status === OrderStatus.New).length;
  const stockDeficits = inventory.filter((i) => i.currentStock <= 20).length;
  const returnAlerts = returns.filter((r) => r.type === "Return").length;

  return (
    <div className="space-y-6">
      {/* Dynamic Control Room Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-xl select-none">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <h3 className="font-extrabold text-sm tracking-wider uppercase flex items-center gap-1.5 font-mono">
              SaaS Operational Command room
            </h3>
            <p className="text-xs text-slate-400">Continuous telemetry pipeline of active marketplace events.</p>
          </div>
        </div>

        {/* Live Countdown Sync badge */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>
              Auto-Sync in <strong className="text-emerald-400">{countdown}s</strong>
            </span>
          </div>

          <button
            onClick={() => handleManualSync("Sheets")}
            disabled={syncing}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-905 font-black px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-sans"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Manual Sheets Pull"}
          </button>
        </div>
      </div>

      {/* Grid displays */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 text-center font-sans tracking-tight leading-none">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-101 dark:border-slate-800 p-4 space-y-2">
          <h4 className="text-2xl font-extrabold text-indigo-500 font-mono">{liveNewOrders}</h4>
          <span className="block text-[10px] text-slate-550 dark:text-slate-400 font-mono font-bold uppercase tracking-wider">New Ingestion</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-101 dark:border-slate-800 p-4 space-y-2">
          <h4 className="text-2xl font-extrabold text-emerald-405 font-mono text-emerald-500">{livePacked}</h4>
          <span className="block text-[10px] text-slate-550 dark:text-slate-400 font-mono font-bold uppercase tracking-wider">Packed Awaiting</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-101 dark:border-slate-800 p-4 space-y-2">
          <h4 className="text-2xl font-extrabold text-amber-500 font-mono">{liveDelayed}</h4>
          <span className="block text-[10px] text-slate-550 dark:text-slate-400 font-mono font-bold uppercase tracking-wider">Logistics Delay</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-101 dark:border-slate-800 p-4 space-y-2">
          <h4 className="text-2xl font-extrabold text-rose-500 font-mono">{stockDeficits}</h4>
          <span className="block text-[10px] text-slate-550 dark:text-slate-400 font-mono font-bold uppercase tracking-wider">Stock Deficits</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-101 dark:border-slate-800 p-4 space-y-2">
          <h4 className="text-2xl font-extrabold text-pink-500 font-mono">{returnAlerts}</h4>
          <span className="block text-[10px] text-slate-550 dark:text-slate-400 font-mono font-bold uppercase tracking-wider">Returns Tracked</span>
        </div>
      </div>

      {/* Ticker Activity panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts panel */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-55 dark:border-slate-850 pb-3">
            <div>
              <h3 className="text-xs font-mono font-extrabold tracking-wider text-slate-404 uppercase">Operations Alert Feeds</h3>
              <p className="text-xs text-slate-500 mt-1">Live critical alerts tracking API dropouts or order SLA bottlenecks</p>
            </div>
            <button
              onClick={onClearNotifications}
              className="text-xs font-semibold text-emerald-500 hover:underline cursor-pointer"
            >
              Clear Feed
            </button>
          </div>

          <div className="space-y-3 pt-1 select-all">
            {notifications.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                No active critical operations alerts. Systems stable.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border text-xs flex gap-3 ${
                    notif.severity === "critical"
                      ? "bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-400"
                      : "bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-400"
                  }`}
                >
                  <AlertOctagon className="w-5 h-5 shrink-0" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold uppercase font-mono tracking-wider">{notif.type}</span>
                      <span className="text-slate-400 font-mono">&bull; {notif.timestamp}</span>
                    </div>
                    <p className="font-medium">{notif.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action simulators */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-5">
            <div className="border-b border-slate-55 dark:border-slate-850 pb-3">
              <h3 className="text-xs font-mono font-extrabold tracking-wider text-slate-400 uppercase">Operational Webhook Ingestion</h3>
              <p className="text-xs text-slate-500 mt-1">Inject sandbox transactions directly into the in-memory log buffer</p>
            </div>

            <div className="space-y-3 pt-1">
              <button
                onClick={() => handleManualSync("Webhook")}
                disabled={syncing}
                className="w-full h-11 flex items-center justify-between px-4 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-101 dark:border-slate-800 rounded-xl text-left transition-colors cursor-pointer group"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-white group-hover:text-emerald-500">Shopify Checkout Event</span>
                  <p className="text-[10px] text-slate-500 font-mono">POST /api/webhooks/shopify_orders</p>
                </div>
                <Zap className="w-4 h-4 text-emerald-500" />
              </button>

              <button
                onClick={() => handleManualSync("Webhook")}
                disabled={syncing}
                className="w-full h-11 flex items-center justify-between px-4 bg-slate-50 dark:bg-slate-955 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-101 dark:border-slate-800 rounded-xl text-left transition-colors cursor-pointer group"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-white group-hover:text-emerald-500">Myntra Dispatch trigger</span>
                  <p className="text-[10px] text-slate-500 font-mono">POST /api/webhooks/myntra_ship</p>
                </div>
                <Zap className="w-4 h-4 text-emerald-555" />
              </button>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 text-center font-mono border-t border-slate-50 dark:border-slate-850 pt-3 uppercase">
            Ingestion endpoints protected. SSL standard enabled.
          </p>
        </div>
      </div>
    </div>
  );
}

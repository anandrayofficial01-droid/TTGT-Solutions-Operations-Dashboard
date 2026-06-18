import React, { useState } from "react";
import {
  Heart,
  TrendingUp,
  Package,
  RotateCcw,
  Store,
  ChevronDown,
  Activity,
  AlertTriangle,
  Info
} from "lucide-react";
import { Client, Store as StoreType, InventoryItem, ReturnOrder } from "../types";

interface ClientHealthProps {
  clients: Client[];
  stores: StoreType[];
  inventory: InventoryItem[];
  returns: ReturnOrder[];
}

export default function ClientHealth({ clients, stores, inventory, returns }: ClientHealthProps) {
  const [selectedClientID, setSelectedClientID] = useState<string | null>(null);

  // Compile detailed health logs for EVERY client dynamically
  const clientsHealth = clients.map((client) => {
    // Linked elements
    const clientStores = stores.filter((s) => s.clientName.toLowerCase() === client.businessName.toLowerCase());
    const storeCount = clientStores.length;
    const activeStoreCount = clientStores.filter((s) => s.status === "Active").length;

    // Store activity score (0-100)
    const storeActivityScore = storeCount === 0 ? 0 : Math.round((activeStoreCount / storeCount) * 100);

    // Inventory Health (Any low stock SKU?)
    const clientStoreNames = clientStores.map((s) => s.storeName.toLowerCase());
    const clientInventory = inventory.filter((item) => clientStoreNames.includes(item.storeName.toLowerCase()));
    const lowStockCount = clientInventory.filter((item) => item.currentStock <= 20).length;
    const inventoryHealthScore = clientInventory.length === 0 ? 100 : Math.max(0, 100 - lowStockCount * 15);

    // Return Rates Core
    const clientReturns = returns.filter((r) => clientStoreNames.includes(r.storeName.toLowerCase()));
    const returnRateScore = Math.max(0, 100 - clientReturns.length * 10);

    // Sales acceleration (Simulated indices)
    const salesGrowthScore = client.status === "Active" ? 85 : 40;
    const orderVolumeScore = client.status === "Active" ? 90 : 50;

    // Consolidated Weight Score
    const globalHealthScore = Math.round(
      salesGrowthScore * 0.25 +
        orderVolumeScore * 0.25 +
        inventoryHealthScore * 0.2 +
        returnRateScore * 0.15 +
        storeActivityScore * 0.15
    );

    let status = "Healthy";
    let colorClass = "text-emerald-500 bg-emerald-555/10 border-emerald-500/20";
    let dotColor = "bg-emerald-500";
    if (globalHealthScore < 60 || client.status === "Suspended") {
      status = "Critical";
      colorClass = "text-rose-500 bg-rose-500/10 border-rose-500/20";
      dotColor = "bg-rose-500";
    } else if (globalHealthScore < 80 || client.status === "Inactive") {
      status = "Attention Needed";
      colorClass = "text-amber-500 bg-amber-500/10 border-amber-500/20";
      dotColor = "bg-amber-500";
    }

    return {
      ...client,
      salesGrowthScore,
      orderVolumeScore,
      inventoryHealthScore,
      returnRateScore,
      storeActivityScore,
      globalHealthScore,
      status,
      colorClass,
      dotColor,
      storeCount,
      activeStoreCount,
      lowStockCount,
      totalReturns: clientReturns.length
    };
  });

  const inspectedClient = clientsHealth.find((c) => c.id === selectedClientID);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-xl">
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-slate-400 font-mono tracking-wider uppercase">Strategic partner Health index</h3>
          <p className="text-xs text-slate-505">Automated compliance algorithms tracking supply friction and billing activity</p>
        </div>
        <Heart className="w-5 h-5 text-emerald-550 shrink-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Partners Health List */}
        <div className="lg:col-span-1.5 space-y-4">
          <div className="bg-white dark:bg-slate-905 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <p className="p-4 border-b border-slate-50 dark:border-slate-850 text-xs font-mono font-extrabold text-slate-400 uppercase">ACTIVE ACCOUNTS INDEX</p>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-850">
              {clientsHealth.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedClientID(selectedClientID === item.id ? null : item.id)}
                  className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-950/40 text-left transition-all ${
                    selectedClientID === item.id ? "bg-slate-50/80 dark:bg-slate-950/60" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
                      {item.businessName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm dark:text-white">{item.businessName}</h4>
                      <p className="text-slate-405 text-xs font-mono mt-0.5">{item.storeCount} stores &bull; {item.lowStockCount} alert SKUs</p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <div className="hidden sm:block">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wide font-extrabold ${item.colorClass}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="shrink-0">
                      <div className="text-sm font-black font-mono dark:text-white">{item.globalHealthScore}%</div>
                      <span className="block text-[10px] text-slate-400 font-mono">WEIGHT</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Breakdown Inspection Card */}
        <div className="lg:col-span-1.5">
          {inspectedClient ? (
            <div className="bg-white dark:bg-slate-905 rounded-xl border border-slate-100 dark:border-slate-800 p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850 pb-4">
                <div>
                  <h4 className="font-bold text-base dark:text-white">{inspectedClient.businessName} Diagnostics</h4>
                  <p className="text-xs text-slate-400 font-mono mt-1">Inspecting: ID {inspectedClient.id}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black font-mono text-emerald-500">{inspectedClient.globalHealthScore}%</div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">INDEX RATING</span>
                </div>
              </div>

              {/* Bento diagnostics */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-500">Sales Growth velocity (Weight: 25%)</span>
                    <span className="font-bold dark:text-slate-200">{inspectedClient.salesGrowthScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${inspectedClient.salesGrowthScore}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-505">Transaction Order Volume (Weight: 25%)</span>
                    <span className="font-bold dark:text-slate-202">{inspectedClient.orderVolumeScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${inspectedClient.orderVolumeScore}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-505">Warehouse Inventory Health (Weight: 20%)</span>
                    <span className="font-bold dark:text-slate-202">{inspectedClient.inventoryHealthScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${inspectedClient.inventoryHealthScore}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-505">Returns & RTO Suppression (Weight: 15%)</span>
                    <span className="font-bold dark:text-slate-202">{inspectedClient.returnRateScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${inspectedClient.returnRateScore}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-505">Marketplace Sync Activity (Weight: 15%)</span>
                    <span className="font-bold dark:text-slate-202">{inspectedClient.storeActivityScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${inspectedClient.storeActivityScore}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Action mitigation recommendation */}
              {inspectedClient.globalHealthScore < 80 && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-4 rounded-xl flex gap-3 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Recommended mitigation:</strong>
                    <p className="mt-1">
                      Link new active marketplace sales points or check underlying warehouse items to restock SKU deficits. Clear active delivery delays.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50/50 dark:bg-slate-905/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-slate-400 text-sm select-none">
              Click any active brand partner card in the directory list to load real-time bento diagnostics and metric index ratings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

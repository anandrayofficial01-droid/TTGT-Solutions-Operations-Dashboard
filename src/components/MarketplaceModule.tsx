import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Activity,
  LineChart,
  BarChart,
  DollarSign,
  Package,
  Layers
} from "lucide-react";
import { Marketplace, Store, StoreStatus } from "../types";

interface MarketplaceModuleProps {
  marketplaces: Marketplace[];
  stores: Store[];
}

export default function MarketplaceModule({ marketplaces, stores }: MarketplaceModuleProps) {
  // Aggregate real store metrics under each marketplace
  const marketStats = marketplaces.map((market) => {
    const linkedStores = stores.filter((s) => s.marketplace.toLowerCase() === market.name.toLowerCase());
    const activeLinked = linkedStores.filter((s) => s.status === StoreStatus.Active).length;

    return {
      ...market,
      calculatedStores: linkedStores.length,
      calculatedActive: activeLinked
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Connected":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Re-auth Required":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    }
  };

  // Find high performer
  const maxRevenueMarket = marketStats.reduce((prev, current) => (prev.revenue > current.revenue ? prev : current), marketStats[0]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Platform Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {marketStats.slice(0, 4).map((m) => (
          <div
            key={m.name}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-base dark:text-white">{m.name}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getStatusColor(m.loginStatus)}`}>
                {m.loginStatus}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-550 dark:text-slate-400">
                <span>Active Channels:</span>
                <span className="font-bold dark:text-slate-200">
                  {m.calculatedActive} / {m.calculatedStores}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-550 dark:text-slate-400">
                <span>GTV Revenue:</span>
                <span className="font-semibold text-emerald-555 font-mono">₹{m.revenue.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-50 dark:border-slate-850 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-slate-400" /> {m.lastSync}
              </span>
              <span className="font-medium text-emerald-400/90">{m.healthScore}% health</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Marketplace Distribution Charts */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-101 dark:border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850 pb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-400 font-mono tracking-wider uppercase">Market Share comparison</h3>
              <p className="text-xs text-slate-500 mt-1">Cross-platform revenue allocation benchmarks</p>
            </div>
            <BarChart className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            {marketStats.map((market) => {
              const totalRevenueAll = marketStats.reduce((sum, current) => sum + current.revenue, 0);
              const percentage = ((market.revenue / Math.max(1, totalRevenueAll)) * 100).toFixed(1);

              return (
                <div key={market.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span>
                      <span className="font-semibold dark:text-white">{market.name}</span>
                      <span className="text-slate-400">({market.calculatedStores} Registered)</span>
                    </div>
                    <div className="font-mono text-slate-600 dark:text-slate-400">
                      <strong>₹{market.revenue.toLocaleString()}</strong> <span className="text-slate-400 text-[10px]">| {percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Channels Health panel */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-101 dark:border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850 pb-4 mb-4">
              <h3 className="text-sm font-extrabold text-slate-400 font-mono tracking-wider uppercase">Top Driver Node</h3>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl text-center space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-widest">HIGHEST REVENUE PLATFORM</div>
              <h4 className="text-2xl font-black text-slate-800 dark:text-white">{maxRevenueMarket?.name}</h4>
              <p className="text-xs text-slate-500">
                Delivering <strong>₹{maxRevenueMarket?.revenue.toLocaleString()}</strong> across <strong>{maxRevenueMarket?.orderVolume}</strong> completed order dispatches.
              </p>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              <h5 className="font-bold text-slate-600 dark:text-slate-350">Platform Integrations Health Checklist</h5>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Amazon SP-API feeds synced cleanly</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Shopify Webhook subscription active</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                  <AlertTriangle className="w-4 h-4 text-rose-450 shrink-0" />
                  <span>Myntra OAuth token expiration in 4 hours</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 dark:border-slate-850 text-[10px] text-slate-400 text-center font-mono uppercase">
            Platform Gateway sync is authorized.
          </div>
        </div>
      </div>
    </div>
  );
}

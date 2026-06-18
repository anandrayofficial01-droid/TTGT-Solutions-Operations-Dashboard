import React from "react";
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Clock,
  Briefcase,
  Store,
  MapPin,
  ShoppingBag,
  Zap
} from "lucide-react";
import { Order, OrderStatus } from "../types";

interface AnalyticsPanelProps {
  orders: Order[];
}

export default function AnalyticsPanel({ orders }: AnalyticsPanelProps) {
  // Compute analytics summaries dynamically
  const courierCounts = React.useMemo(() => {
    const stats: Record<string, { total: number; delivered: number; revenue: number }> = {};
    orders.forEach((o) => {
      const c = o.courier || "Delhivery";
      if (!stats[c]) {
        stats[c] = { total: 0, delivered: 0, revenue: 0 };
      }
      stats[c].total += 1;
      stats[c].revenue += o.revenue || 0;
      if (o.status === OrderStatus.Delivered) {
        stats[c].delivered += 1;
      }
    });
    return stats;
  }, [orders]);

  const marketplaceCounts = React.useMemo(() => {
    const stats: Record<string, number> = {};
    orders.forEach((o) => {
      const mp = o.marketplace || "Shopify";
      stats[mp] = (stats[mp] || 0) + 1;
    });
    return stats;
  }, [orders]);

  const cityCounts = React.useMemo(() => {
    const stats: Record<string, number> = {};
    orders.forEach((o) => {
      const city = o.city || "Mumbai";
      stats[city] = (stats[city] || 0) + 1;
    });
    return stats;
  }, [orders]);

  const totalOrders = orders.length || 1;

  return (
    <div className="space-y-6 select-none animate-[fadeIn_0.1s_ease-out]">
      
      {/* Analytics header stats widget block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Leader Courier SLA</span>
              <span className="text-sm font-black text-slate-800 dark:text-slate-100">Bluedart Express [98.2%]</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Average Transit Time</span>
              <span className="text-sm font-black text-slate-800 dark:text-slate-100">32.6 Hours (Air route)</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">SLA Breaches detected</span>
              <span className="text-sm font-black text-slate-800 dark:text-slate-100">0.02% (Excellent)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid containing dynamic visual bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Courier dispatch volume distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h4 className="text-xs font-mono font-black text-slate-450 uppercase flex items-center gap-1.5 border-b pb-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Courier Delivery Performance Index
            </h4>
            <p className="text-[10.5px] text-slate-400 mt-1">SLA scores mapped directly from connected manifest nodes.</p>
          </div>

          <div className="space-y-4 pt-2">
            {Object.keys(courierCounts).length === 0 ? (
              <span className="text-xs font-mono text-slate-400 italic block text-center py-6">"No Data Available" &bull; Construct connections to parse Courier SLA metrics</span>
            ) : (
              (Object.entries(courierCounts) as [string, { total: number; delivered: number; revenue: number }][]).map(([courier, stat]) => {
                const percentTotal = Math.round((stat.total / totalOrders) * 100);
                const slaPercent = stat.total > 0 ? Math.round((stat.delivered / stat.total) * 100) : 100;
                
                return (
                  <div key={courier} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-750">
                      <span className="text-slate-800 dark:text-slate-100 font-extrabold">{courier}</span>
                      <span className="font-mono text-[11px]">
                        {stat.total} parcels &bull; {percentTotal}% vol &bull; SLA: <strong className="text-emerald-505">{slaPercent}%</strong>
                      </span>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full h-2 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                      <div 
                        className="h-full bg-emerald-500 rounded" 
                        style={{ width: `${percentTotal}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Marketplace distribution channels ratios */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h4 className="text-xs font-mono font-black text-slate-450 uppercase flex items-center gap-1.5 border-b pb-1.5">
              <ShoppingBag className="w-4 h-4 text-blue-500" /> Marketplace Volume Splits Map
            </h4>
            <p className="text-[10.5px] text-slate-400 mt-1">Sales distribution of source gateways active in system logs.</p>
          </div>

          <div className="space-y-4 pt-2">
            {Object.keys(marketplaceCounts).length === 0 ? (
              <span className="text-xs font-mono text-slate-400 italic block text-center py-6">"No Data Available" &bull; Awaiting connector integration</span>
            ) : (
              (Object.entries(marketplaceCounts) as [string, number][]).map(([mp, cnt]) => {
                const percentVal = Math.round((cnt / totalOrders) * 100);
                return (
                  <div key={mp} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-750">
                      <span className="text-slate-800 dark:text-slate-100 font-extrabold">{mp}</span>
                      <span className="font-mono">{cnt} lines &bull; {percentVal}%</span>
                    </div>
                    <div className="w-full h-2 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded" 
                        style={{ width: `${percentVal}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Hot dispatch nodes / Regional locations */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 md:col-span-2">
          <div>
            <h4 className="text-xs font-mono font-black text-slate-450 uppercase flex items-center gap-1.5 border-b pb-1.5">
              <MapPin className="w-4 h-4 text-emerald-500" /> Highest Transit Destination Regional Nodes
            </h4>
            <p className="text-[10.5px] text-slate-400 mt-1">Active transit cities with highest package delivery rates currently logged.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 text-xs">
            {Object.keys(cityCounts).length === 0 ? (
              <div className="col-span-4 text-center text-xs font-mono text-slate-400 py-6">"No Data Available"</div>
            ) : (
              (Object.entries(cityCounts) as [string, number][]).map(([city, cnt]) => {
                const percentVal = Math.round((cnt / totalOrders) * 100);
                return (
                  <div key={city} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-201 dark:border-slate-850 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono uppercase text-slate-400 font-extrabold block">{city}</span>
                      <strong className="text-lg font-mono text-slate-850 dark:text-white mt-1 block">{cnt} shipments</strong>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                        <span>Relative load</span>
                        <span>{percentVal}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-555 bg-emerald-500" style={{ width: `${percentVal}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

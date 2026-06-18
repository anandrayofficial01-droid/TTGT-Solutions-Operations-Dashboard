import React, { useState } from "react";
import {
  Calendar,
  LineChart,
  BarChart,
  ArrowUpRight,
  Sparkles,
  Zap,
  TrendingUp,
  Filter,
  DollarSign,
  Package,
  Layers,
  Award
} from "lucide-react";

interface AnalyticsHubProps {
  clients: any[];
  stores: any[];
  orders: any[];
  returns: any[];
}

export default function AnalyticsHub({ clients, stores, orders, returns }: AnalyticsHubProps) {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [customRangeStart, setCustomRangeStart] = useState("");
  const [customRangeEnd, setCustomRangeEnd] = useState("");

  const dateFilters = [
    "Today",
    "Yesterday",
    "Last 7 Days",
    "Last 30 Days",
    "Last 90 Days",
    "Custom Range"
  ];

  // Helper values responding to date filter to make the charts dynamic!
  const getSimulatedModifier = () => {
    switch (dateRange) {
      case "Today":
        return 0.12;
      case "Yesterday":
        return 0.14;
      case "Last 7 Days":
        return 0.45;
      case "Last 90 Days":
        return 2.5;
      default:
        return 1.0; // Last 30 Days default
    }
  };

  const mod = getSimulatedModifier();

  // Multiplier results matching scales
  const calculatedSumGTV = Math.round(710000 * mod);
  const calculatedOrdersVolume = Math.round(1800 * mod);
  const calculatedClientsGrowth = clients.length;

  // Custom visual inline charts matching datasets
  const revenuePoints = [42, 54, 49, 68, 79, 74, 91].map(v => Math.round(v * mod));
  const orderPoints = [210, 240, 220, 280, 310, 290, 340].map(v => Math.round(v * mod));

  // Top rankings dataset matching components
  const topProducts = [
    { name: "Organic Lavender Serum", sales: Math.round(410 * mod), gtv: Math.round(368590 * mod) },
    { name: "Bamboo Fiber Men's Tee L", sales: Math.round(280 * mod), gtv: Math.round(279720 * mod) },
    { name: "ActiveNoise ANC Headphones", sales: Math.round(112 * mod), gtv: Math.round(559888 * mod) },
    { name: "Raw Wildflower Honey (500g)", sales: Math.round(185 * mod), gtv: Math.round(73815 * mod) }
  ];

  const topClients = [
    { name: "Aura Essentials", storesCount: 2, share: "45%", volume: Math.round(890 * mod) },
    { name: "EcoThreads Apparel", storesCount: 1, share: "28%", volume: Math.round(510 * mod) },
    { name: "Reddy Electronics", storesCount: 1, share: "20%", volume: Math.round(362 * mod) }
  ];

  const topStores = [
    { name: "Aura Essentials Amazon", platform: "Amazon", health: "92%", rev: Math.round(245000 * mod) },
    { name: "Aura Essentials Shopify", platform: "Shopify", health: "88%", rev: Math.round(180000 * mod) },
    { name: "Reddy Electronics Amazon", platform: "Amazon", health: "95%", rev: Math.round(310000 * mod) }
  ];

  return (
    <div className="space-y-6">
      {/* Date Range selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 font-mono select-none">
          {dateFilters.map((df) => (
            <button
              key={df}
              onClick={() => setDateRange(df)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                dateRange === df
                  ? "bg-emerald-500 text-slate-905 font-bold shadow-sm"
                  : "bg-slate-50 dark:bg-slate-950 border border-slate-101 dark:border-slate-800 text-slate-500 hover:text-slate-200"
              }`}
            >
              {df}
            </button>
          ))}
        </div>

        {/* Custom Range Calendars */}
        {dateRange === "Custom Range" && (
          <div className="flex items-center gap-2.5 text-xs font-mono animate-fadeIn">
            <input
              type="date"
              value={customRangeStart}
              onChange={(e) => setCustomRangeStart(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded px-2 py-1 outline-none text-slate-700 dark:text-slate-300"
            />
            <span className="text-slate-400">&mdash;</span>
            <input
              type="date"
              value={customRangeEnd}
              onChange={(e) => setCustomRangeEnd(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded px-2 py-1 outline-none text-slate-700 dark:text-slate-300"
            />
          </div>
        )}

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Syncing Real-Time: June 17, 2026</span>
        </div>
      </div>

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400">Calculated GTV Revenue</span>
          <h3 className="text-2xl font-black font-mono text-emerald-500">₹{calculatedSumGTV.toLocaleString()}</h3>
          <p className="text-xs text-slate-400">Based on: {dateRange} bounds</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400">Logistics Order Volume</span>
          <h3 className="text-2xl font-black font-mono dark:text-white">{calculatedOrdersVolume} Dispatches</h3>
          <p className="text-xs text-slate-405">Completed and in-transit units</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400">Acquisitions rate</span>
          <h3 className="text-2xl font-black font-mono dark:text-white">+{calculatedClientsGrowth} Clients</h3>
          <p className="text-xs text-slate-405">Licensed merchant databases</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-404">Average order value</span>
          <h3 className="text-2xl font-black font-mono dark:text-white">₹{Math.round(calculatedSumGTV / Math.max(1, calculatedOrdersVolume))}</h3>
          <p className="text-xs text-slate-404">Fulfillment value index</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Visual line */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850 pb-3">
            <div>
              <h4 className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-wider">Revenue Trend and SLA Run (₹k)</h4>
              <p className="text-xs text-slate-500 mt-1">Daily gross sales index over sample timeframe</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          {/* SVG Line pathing for high performance analytics dashboard */}
          <div className="w-full h-44 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-850 p-2 relative flex items-end">
            <svg className="w-full h-full" viewBox="0 0 500 150">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Area */}
              <path
                d={`M 0 150 
                    L 0 ${120 - revenuePoints[0]} 
                    L 80 ${120 - revenuePoints[1]} 
                    L 160 ${120 - revenuePoints[2]} 
                    L 240 ${120 - revenuePoints[3]} 
                    L 320 ${120 - revenuePoints[4]} 
                    L 400 ${120 - revenuePoints[5]} 
                    L 480 ${120 - revenuePoints[6]} 
                    L 480 150 Z`}
                fill="url(#chartGradient)"
              />
              {/* Line */}
              <path
                d={`M 0 ${120 - revenuePoints[0]} 
                    L 80 ${120 - revenuePoints[1]} 
                    L 160 ${120 - revenuePoints[2]} 
                    L 240 ${120 - revenuePoints[3]} 
                    L 320 ${120 - revenuePoints[4]} 
                    L 400 ${120 - revenuePoints[5]} 
                    L 480 ${120 - revenuePoints[6]}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Interactive dot anchors */}
              {revenuePoints.map((pt, pIdx) => (
                <circle
                  key={pIdx}
                  cx={pIdx * 80}
                  cy={120 - pt}
                  r="4"
                  fill="#1e293b"
                  stroke="#10b981"
                  strokeWidth="2"
                />
              ))}
            </svg>
            <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] font-mono text-slate-400">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Order Trend Visual bars */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-101 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850 pb-3">
            <div>
              <h4 className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-wider">Order volume Dispatched analytics</h4>
              <p className="text-xs text-slate-505 mt-1">Daily parcel hand-offs across logistics nodes</p>
            </div>
            <BarChart className="w-4 h-4 text-slate-400" />
          </div>

          {/* Bar Charts representation */}
          <div className="w-full h-44 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-101 dark:border-slate-850 p-4 flex items-end justify-between font-mono text-[9px] text-slate-500">
            {orderPoints.map((pt, pIdx) => {
              const barHeight = Math.max(10, Math.min(100, Math.round((pt / (mod * 400)) * 100)));
              return (
                <div key={pIdx} className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="font-bold dark:text-slate-300">{pt}</span>
                  <div className="w-8 bg-emerald-500 rounded-t-md transition-all duration-300" style={{ height: `${barHeight}px` }}></div>
                  <span>Day {pIdx + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top lists rankings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850 pb-3.5">
            <h4 className="text-xs font-mono font-extrabold text-slate-404 uppercase tracking-wider">Top Product Catalog lines</h4>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-4 text-xs font-medium">
            {topProducts.map((p, idx) => (
              <div key={p.name} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <div className="min-w-0">
                  <p className="font-bold truncate max-w-[200px]">{p.name}</p>
                  <span className="text-[10px] text-slate-400 font-mono">Rank {idx + 1} &bull; {p.sales} orders</span>
                </div>
                <div className="font-mono text-emerald-555 text-right shrink-0">
                  <strong>₹{p.gtv.toLocaleString()}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850 pb-3.5">
            <h4 className="text-xs font-mono font-extrabold text-slate-404 uppercase tracking-wider">Top Client Partners</h4>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-4 text-xs">
            {topClients.map((c, idx) => (
              <div key={c.name} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <div>
                  <p className="font-bold">{c.name}</p>
                  <span className="text-[10px] text-slate-405 font-mono">{c.storesCount} Stores linked</span>
                </div>
                <div className="text-right font-mono shrink-0">
                  <span className="font-bold">{c.volume} units</span>
                  <p className="text-[9px] text-slate-450">share: {c.share}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Stores */}
        <div className="bg-white dark:bg-slate-905 rounded-xl border border-slate-100 dark:border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850 pb-3.5">
            <h4 className="text-xs font-mono font-extrabold text-slate-404 uppercase tracking-wider">Top Performing Stores</h4>
            <Award className="w-4 h-4 text-emerald-404 text-emerald-500" />
          </div>

          <div className="space-y-4 text-xs">
            {topStores.map((s, idx) => (
              <div key={s.name} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <div>
                  <p className="font-bold">{s.name}</p>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-950 px-1 rounded inline-block mt-0.5">{s.platform}</span>
                </div>
                <div className="text-right font-mono shrink-0">
                  <strong className="text-emerald-555">₹{s.rev.toLocaleString()}</strong>
                  <p className="text-[9px] text-emerald-400 font-bold">{s.health} performance</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

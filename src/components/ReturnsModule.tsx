import React from "react";
import {
  RotateCcw,
  Sparkles,
  Percent,
  ListRestart,
  BarChart,
  ShieldCheck,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { ReturnOrder, Order, OrderStatus } from "../types";

interface ReturnsModuleProps {
  returns: ReturnOrder[];
  orders: Order[];
}

export default function ReturnsModule({ returns, orders }: ReturnsModuleProps) {
  const totalOrdersCount = Math.max(1, orders.length);

  // Filter types
  const customerReturns = returns.filter((r) => r.type === "Return");
  const rtoOrders = returns.filter((r) => r.type === "RTO");

  // Compute rates
  const returnRate = ((customerReturns.length / totalOrdersCount) * 100).toFixed(1);
  const rtoRate = ((rtoOrders.length / totalOrdersCount) * 100).toFixed(1);

  // Return reason compilation
  const reasonBreakdown = [
    { reason: "Size discrepancy / Too small", percentage: "41.5%", cases: 14, iconClass: "text-amber-500 bg-amber-500/10" },
    { reason: "Customer Unavailable - Multiple attempts", percentage: "28.1%", cases: 9, iconClass: "text-blue-500 bg-blue-500/10" },
    { reason: "Mailing Address Undeliverable", percentage: "18.4%", cases: 6, iconClass: "text-rose-500 bg-rose-500/10" },
    { reason: "Damaged / Defective on opening", percentage: "12.0%", cases: 4, iconClass: "text-indigo-500 bg-indigo-500/10" }
  ];

  // Specific platform rates
  const marketplaceRates = [
    { name: "Flipkart", rate: "5.8%", activeReturns: 4 },
    { name: "Amazon", rate: "4.5%", activeReturns: 5 },
    { name: "Shopify", rate: "2.1%", activeReturns: 1 },
    { name: "Myntra", rate: "6.2%", activeReturns: 2 }
  ];

  return (
    <div className="space-y-6">
      {/* Return stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
          <p className="text-[10px] font-mono font-extrabold tracking-wider text-slate-400 uppercase">Global Customer Return Rate</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-rose-500 font-mono">{returnRate}%</h3>
            <span className="p-1 px-2 text-[10px] bg-emerald-500/10 text-emerald-500 font-bold rounded-lg font-mono">Benchmark target &lt; 5.0%</span>
          </div>
          <p className="text-xs text-slate-500">Based on Rolling 30 Day orders ledger</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
          <p className="text-[10px] font-mono font-extrabold tracking-wider text-slate-400 uppercase">Global RTO Logistics rate</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-indigo-500 font-mono">{rtoRate}%</h3>
            <span className="p-1 px-2 text-[10px] bg-emerald-500/10 text-emerald-500 font-bold rounded-lg font-mono">Secure standard &lt; 3.0%</span>
          </div>
          <p className="text-xs text-slate-500">Shipped but returned undelivered</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
          <p className="text-[10px] font-mono font-extrabold tracking-wider text-slate-400 uppercase">Active Return Orders</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black dark:text-white font-mono">{customerReturns.length} Requests</h3>
            <RotateCcw className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500">Currently traversing return corridor</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
          <p className="text-[10px] font-mono font-extrabold tracking-wider text-slate-400 uppercase">Refund Disbursals Queue</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black dark:text-white font-mono">
              {returns.filter((r) => r.refundStatus === "Pending").length} Pending
            </h3>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-xs text-slate-500">Awaiting visual quality-inspect check</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core reason compilation */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-50 dark:border-slate-850 pb-3">
            <h4 className="text-xs font-mono font-extrabold tracking-wider text-slate-404 uppercase">Reverse Reason Codes Breakdowns</h4>
            <p className="text-xs text-slate-500 mt-1">Categorized core complaints from buyers</p>
          </div>

          <div className="space-y-4 pt-1 text-xs">
            {reasonBreakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20 px-3 py-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
                <span className="font-medium truncate max-w-[200px] dark:text-slate-300">{item.reason}</span>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold dark:text-white">{item.percentage}</span>
                  <p className="text-[10px] text-slate-400">{item.cases} instances</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marketplace Returns comparison */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-50 dark:border-slate-850 pb-3">
            <h4 className="text-xs font-mono font-extrabold tracking-wider text-slate-404 uppercase">Marketplace return trends</h4>
            <p className="text-xs text-slate-500 mt-1">Return rates dissected by online host</p>
          </div>

          <div className="space-y-4">
            {marketplaceRates.map((market) => (
              <div key={market.name} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="dark:text-slate-300">{market.name} Rate</span>
                  <span className="font-mono text-rose-500 font-bold">{market.rate}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-rose-455 h-1.5 rounded-full bg-rose-500"
                    style={{ width: `${parseFloat(market.rate) * 10}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live requests logs */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-50 dark:border-slate-850 pb-3">
            <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">Corridor Intake Stream</h4>
            <p className="text-xs text-slate-500 mt-1">Real-time intakes from transit network</p>
          </div>

          <div className="space-y-3 pt-1 text-xs select-all">
            {returns.map((ret) => (
              <div key={ret.id} className="border-b border-slate-50 dark:border-slate-855 pb-2.5 last:border-b-0 last:pb-0">
                <div className="flex justify-between font-mono text-[10px] tracking-wide mb-1">
                  <span className="font-bold text-slate-500">{ret.id} &bull; {ret.type}</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    ret.refundStatus === "Refunded" ? "text-emerald-500 bg-emerald-500/10" : "text-amber-500 bg-amber-500/10"
                  }`}>{ret.refundStatus}</span>
                </div>
                <p className="font-bold truncate dark:text-slate-200">{ret.productName}</p>
                <p className="text-[10px] text-slate-450 mt-1">Reason: <span className="font-mono italic">{ret.returnReason}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

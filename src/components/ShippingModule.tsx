import React from "react";
import {
  Truck,
  Clock,
  CheckCircle,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  Sliders,
  Award
} from "lucide-react";
import { Order, OrderStatus } from "../types";

interface ShippingModuleProps {
  orders: Order[];
}

export default function ShippingModule({ orders }: ShippingModuleProps) {
  // Compute Logistics variables
  const readyToShip = orders.filter((o) => o.status === OrderStatus.Packed).length;
  // Delayed: orders packed or processing that are over 48 hours old. (Simply simulating ORD-99304)
  const delayedShipments = orders.filter((o) => o.id === "ORD-99304" || o.status === OrderStatus.New).length;
  const failedDeliveries = orders.filter((o) => o.status === OrderStatus.RTO).length;
  const avgDeliveryTime = "3.1 Days";

  // Mock courier data
  const couriers = [
    { name: "Delhivery", processed: 412, avgTime: "2.8d", slaPercent: 96.2, rank: 1 },
    { name: "BlueDart", processed: 289, avgTime: "2.1d", slaPercent: 98.4, rank: 2 },
    { name: "Amazon Logistics", processed: 185, avgTime: "1.9d", slaPercent: 99.1, rank: 3 },
    { name: "XpressBees", processed: 142, avgTime: "3.5d", slaPercent: 88.5, rank: 4 },
    { name: "Shadowfax", processed: 90, avgTime: "3.9d", slaPercent: 84.1, rank: 5 }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold tracking-wider text-slate-400 uppercase">Ready To Ship Nodes</span>
            <PackageItemIcon />
          </div>
          <h3 className="text-xl font-bold dark:text-white font-sans">{readyToShip} Orders</h3>
          <p className="text-xs text-slate-500">In warehouse awaiting hand-off</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold tracking-wider text-slate-400 uppercase">Orders Delayed (SLA Spike)</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-xl font-bold dark:text-white font-sans">{delayedShipments} Shipments</h3>
          <p className="text-xs text-red-500 font-medium">Exceeding 48h packaging bounds</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold tracking-wider text-slate-400 uppercase">Average Delivery Time</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold dark:text-white font-sans">{avgDeliveryTime}</h3>
          <p className="text-xs text-slate-505">Order dispatch to door-step</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-101 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold tracking-wider text-slate-400 uppercase">Failed Deliveries</span>
            <AlertOctagon className="w-5 h-5 text-rose-500" />
          </div>
          <h3 className="text-xl font-bold dark:text-white font-sans">{failedDeliveries} reversed</h3>
          <p className="text-xs text-slate-500">Returned transit to fulfillment node</p>
        </div>
      </div>

      {/* Courier Performance comparison and Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table of couriers */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-101 dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-400 font-mono tracking-wider uppercase">Fulfillment Partner Scorecard</h3>
              <p className="text-xs text-slate-500 mt-1">Real-time stats based on last 10,000 processed shipments</p>
            </div>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-955 border-b border-slate-100 dark:border-slate-800 font-mono tracking-wider font-bold text-slate-400 uppercase">
                  <th className="p-3">Courier Node</th>
                  <th className="p-3 text-center">Executed Volume</th>
                  <th className="p-3 text-center">Avg Transit Time</th>
                  <th className="p-3 text-center">Fulfillment SLA %</th>
                  <th className="p-3 text-right">Operational SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                {couriers.map((c) => (
                  <tr key={c.name} className="hover:bg-slate-50/10">
                    <td className="p-3 font-semibold dark:text-white">{c.name}</td>
                    <td className="p-3 text-center font-mono font-medium">{c.processed} Dispatches</td>
                    <td className="p-3 text-center font-mono text-slate-505 dark:text-slate-405">{c.avgTime}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded border ${
                        c.slaPercent >= 95 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        c.slaPercent >= 88 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        "bg-rose-500/10 text-rose-505 border-rose-500/20"
                      }`}>
                        {c.slaPercent}%
                      </span>
                    </td>
                    <td className="p-3 text-right text-xs">
                      {c.slaPercent >= 95 ? (
                        <span className="text-emerald-500 font-semibold font-mono">STABLE SLA</span>
                      ) : (
                        <span className="text-amber-500 font-semibold font-mono">ATTN REQUIRED</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Courier comparison SLA bar chart widget */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-101 dark:border-slate-800 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-50 dark:border-slate-850 pb-3">
              <h3 className="text-xs font-extrabold text-slate-405 font-mono tracking-wider uppercase">Courier SLA Comparison</h3>
              <p className="text-xs text-slate-450 mt-1">SLA Benchmark target threshold is &ge; 95%</p>
            </div>

            <div className="space-y-4 pt-1">
              {couriers.slice(0, 4).map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="dark:text-slate-300">{c.name}</span>
                    <span className="font-mono text-slate-600 dark:text-slate-450">{c.slaPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${c.slaPercent >= 95 ? "bg-emerald-500" : "bg-amber-400"}`}
                      style={{ width: `${c.slaPercent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-mono mt-6 border-t border-slate-50 dark:border-slate-850 pt-3 text-center">
            SLA calculation includes last 14-days dispatch timelines.
          </p>
        </div>
      </div>
    </div>
  );
}

function PackageItemIcon() {
  return (
    <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
      <Truck className="w-4 h-4" />
    </div>
  );
}

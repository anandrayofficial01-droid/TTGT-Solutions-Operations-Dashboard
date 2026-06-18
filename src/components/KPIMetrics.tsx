import React from "react";
import {
  Layers,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  RefreshCw,
  AlertOctagon,
  TrendingUp,
  TrendingDown,
  Navigation
} from "lucide-react";
import { Order, OrderStatus } from "../types";

interface KPIMetricsProps {
  orders: Order[];
}

export default function KPIMetrics({ orders }: KPIMetricsProps) {
  // Aggregate stats dynamically
  const total = orders.length;
  
  const counts = orders.reduce((acc, current) => {
    const st = current.status;
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stat = (status: OrderStatus) => counts[status] || 0;

  // Let's also resolve Pending, In-Transit, and Failed Deliveries dynamically or from tracking tags
  // Since we want everything dynamic from the order stream, let's map:
  // - In Transit: Shipped orders
  // - Pending: New + Processing + Packed
  // - Failed Delivery: Cancelled + RTO
  const inTransit = stat(OrderStatus.Shipped);
  const pending = stat(OrderStatus.New) + stat(OrderStatus.Processing) + stat(OrderStatus.Packed);
  
  // High fidelity calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.revenue || 0), 0);

  // We have 11 required top cards
  const cards = [
    {
      title: "Today's Orders",
      count: total,
      subtext: `₹${totalRevenue.toLocaleString("en-IN")}`,
      color: "border-slate-300 dark:border-slate-800",
      dot: "bg-slate-700",
    },
    {
      title: "Pending Sync",
      count: pending,
      subtext: "Awaiting dispatch",
      color: "border-slate-205 dark:border-slate-800",
      dot: "bg-slate-400",
    },
    {
      title: "Processing",
      count: stat(OrderStatus.Processing),
      subtext: "In sorting bin",
      color: "border-amber-205 dark:border-slate-800",
      dot: "bg-amber-500",
    },
    {
      title: "Packed",
      count: stat(OrderStatus.Packed),
      subtext: "In sealing stage",
      color: "border-yellow-250 dark:border-slate-800",
      dot: "bg-yellow-500",
    },
    {
      title: "Shipped",
      count: stat(OrderStatus.Shipped),
      subtext: "Forwarded air lane",
      color: "border-purple-200 dark:border-slate-800",
      dot: "bg-purple-500",
    },
    {
      title: "In Transit",
      count: inTransit,
      subtext: "Out with courier",
      color: "border-indigo-200 dark:border-slate-800",
      dot: "bg-indigo-500",
    },
    {
      title: "Delivered",
      count: stat(OrderStatus.Delivered),
      subtext: "Handed over to buyer",
      color: "border-emerald-250 dark:border-slate-800",
      dot: "bg-emerald-500",
    },
    {
      title: "Cancelled",
      count: stat(OrderStatus.Cancelled),
      subtext: "Purged by store",
      color: "border-slate-200 dark:border-slate-850",
      dot: "bg-slate-500",
    },
    {
      title: "Returned",
      count: stat(OrderStatus.Returned),
      subtext: "Inbound refund",
      color: "border-rose-200 dark:border-slate-800",
      dot: "bg-rose-500",
    },
    {
      title: "RTO",
      count: stat(OrderStatus.RTO),
      subtext: "Return to Origin",
      color: "border-pink-200 dark:border-slate-800",
      dot: "bg-pink-500",
    },
    {
      title: "Failed Delivery",
      count: stat(OrderStatus.RTO) + stat(OrderStatus.Cancelled),
      subtext: "Failed dispatch flag",
      color: "border-red-200 dark:border-slate-800",
      dot: "bg-red-500",
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-11 gap-3.5 select-none">
      {cards.map((c) => (
        <div 
          key={c.title} 
          className={`bg-white dark:bg-slate-900 border ${c.color} rounded-xl p-3 shadow-6xs hover:shadow-2xs transition-all relative overflow-hidden flex flex-col justify-between`}
        >
          {/* Accent dot indicator as requested: "No gaming UI, soft colors, minimal design" */}
          <div className="flex items-center justify-between gap-1">
            <span className="text-[9px] font-mono font-black uppercase text-slate-400 truncate tracking-wide">
              {c.title}
            </span>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot} shrink-0`}></span>
          </div>

          <div className="mt-2.5">
            <span className="text-xl font-bold font-mono text-slate-850 dark:text-slate-100 tracking-tight block">
              {c.count}
            </span>
            <span className="text-[9px] text-slate-400 font-mono truncate block mt-0.5">
              {c.subtext}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

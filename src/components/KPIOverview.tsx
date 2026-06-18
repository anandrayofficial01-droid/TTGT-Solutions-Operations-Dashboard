import React from "react";
import {
  Users,
  Store,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Package,
  TrendingDown,
  ShoppingBag,
  DollarSign,
  Truck,
  RotateCcw,
  Clock,
  Shuffle
} from "lucide-react";
import { Client, Store as StoreType, InventoryItem, Order, ReturnOrder, OrderStatus } from "../types";

interface KPIOverviewProps {
  clients: Client[];
  stores: StoreType[];
  inventory: InventoryItem[];
  orders: Order[];
  returns: ReturnOrder[];
}

export default function KPIOverview({ clients, stores, inventory, orders, returns }: KPIOverviewProps) {
  // Calculators
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === "Active").length;
  const inactiveClients = clients.filter(c => c.status === "Inactive" || c.status === "Suspended").length;

  const totalStores = stores.length;
  const activeStores = stores.filter(s => s.status === "Active").length;

  const totalOrders = orders.length;
  const todaysOrders = orders.filter(o => o.orderDate === "2026-06-17").length; // current date in logs
  const pendingOrders = orders.filter(o => o.status === OrderStatus.New || o.status === OrderStatus.Processing || o.status === OrderStatus.Packed).length;
  const shippedOrders = orders.filter(o => o.status === OrderStatus.Shipped).length;
  const deliveredOrders = orders.filter(o => o.status === OrderStatus.Delivered).length;
  const cancelledOrders = orders.filter(o => o.status === OrderStatus.Cancelled).length;
  const returnedOrders = returns.filter(r => r.type === "Return").length;
  const rtoOrders = returns.filter(r => r.type === "RTO").length;

  const totalRevenue = orders.reduce((sum, o) => o.status !== OrderStatus.Cancelled ? sum + o.revenue : sum, 0);
  const monthlyRevenue = totalRevenue * 0.92; // Simulated Monthly Rate
  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.inventoryValue, 0);

  const kpis = [
    {
      title: "Total Clients",
      value: totalClients,
      icon: Users,
      trend: "+2 this month",
      trendPositive: true,
      category: "Account"
    },
    {
      title: "Active Clients",
      value: activeClients,
      icon: Users,
      trend: `${((activeClients / Math.max(1, totalClients)) * 100).toFixed(0)}% of total`,
      trendPositive: true,
      category: "Account"
    },
    {
      title: "Inactive/Suspended",
      value: inactiveClients,
      icon: Users,
      trend: "Requires review",
      trendPositive: false,
      category: "Account"
    },
    {
      title: "Total Stores Managed",
      value: totalStores,
      icon: Store,
      trend: "100k SKU capability",
      trendPositive: true,
      category: "Store"
    },
    {
      title: "Active Licensed Stores",
      value: activeStores,
      icon: Store,
      trend: "+4 newly launched",
      trendPositive: true,
      category: "Store"
    },
    {
      title: "Total Orders (Volume)",
      value: totalOrders,
      icon: ShoppingBag,
      trend: `+${todaysOrders} today`,
      trendPositive: true,
      category: "Fulfillment"
    },
    {
      title: "Today's Fresh Orders",
      value: todaysOrders,
      icon: Clock,
      trend: "Live stream active",
      trendPositive: true,
      category: "Fulfillment"
    },
    {
      title: "Pending Logistics Hub",
      value: pendingOrders,
      icon: Shuffle,
      trend: "Awaiting packaging",
      trendPositive: false,
      category: "Fulfillment"
    },
    {
      title: "Shipped Outbound Node",
      value: shippedOrders,
      icon: Truck,
      trend: "In-transit delivery SLA",
      trendPositive: true,
      category: "Fulfillment"
    },
    {
      title: "Delivered Successfully",
      value: deliveredOrders,
      icon: ShoppingBag,
      trend: "Completed cycles",
      trendPositive: true,
      category: "Fulfillment"
    },
    {
      title: "Cancelled Customer orders",
      value: cancelledOrders,
      icon: RotateCcw,
      trend: "Order cancellations",
      trendPositive: false,
      category: "Return"
    },
    {
      title: "Customer Returns",
      value: returnedOrders,
      icon: RotateCcw,
      trend: `${((returnedOrders / Math.max(1, totalOrders)) * 100).toFixed(1)}% Return Rate`,
      trendPositive: false,
      category: "Return"
    },
    {
      title: "RTO Reversed Shipments",
      value: rtoOrders,
      icon: RotateCcw,
      trend: `${((rtoOrders / Math.max(1, totalOrders)) * 100).toFixed(1)}% RTO Rate`,
      trendPositive: false,
      category: "Return"
    },
    {
      title: "Total GTV Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: "+14.2% MoM",
      trendPositive: true,
      category: "Financial"
    },
    {
      title: "Monthly Run Rate",
      value: `₹${monthlyRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      trend: "Rolling 30 Days",
      trendPositive: true,
      category: "Financial"
    },
    {
      title: "Stock Asset Value",
      value: `₹${totalInventoryValue.toLocaleString("en-IN")}`,
      icon: Package,
      trend: "Audited warehouse assets",
      trendPositive: true,
      category: "Financial"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Category Tabs Indicator */}
      <div className="flex flex-wrap gap-2 text-xs font-mono mb-4 text-slate-500">
        <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Account Control: 3 metrics</span>
        <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Store Network: 2 metrics</span>
        <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Logistics Flow: 5 metrics</span>
        <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Rev / Assets: 3 metrics</span>
        <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Returns audit: 3 metrics</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, kIdx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kIdx}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5 hover:border-emerald-500/45 dark:hover:border-emerald-400/40 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 font-mono tracking-wider uppercase">
                    {kpi.title}
                  </p>
                  <h3 className="text-2xl font-bold dark:text-white mt-2 font-sans tracking-tight">
                    {kpi.value}
                  </h3>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  <Icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 text-xs">
                {kpi.trendPositive ? (
                  <span className="text-emerald-500 font-bold flex items-center font-mono">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="text-red-500 font-bold flex items-center font-mono">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  </span>
                )}
                <span className="text-slate-500 dark:text-slate-400 font-mono tracking-wide">{kpi.trend}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

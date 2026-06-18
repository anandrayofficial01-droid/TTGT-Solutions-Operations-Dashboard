import React, { useState, useEffect } from "react";
import {
  Activity,
  Play,
  Pause,
  Clock,
  CheckCircle,
  Truck,
  RotateCcw,
  AlertTriangle,
  Users,
  Store,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { Order, InventoryItem, Client } from "../types";

interface LiveEvent {
  id: string;
  time: string;
  type: "New Order" | "Order Packed" | "Order Shipped" | "Order Delivered" | "Return Created" | "RTO Created" | "Low Stock Warning" | "Store Suspended" | "New Seller Licensed";
  title: string;
  description: string;
  color: string;
}

interface LiveOperationsFeedProps {
  orders: Order[];
  inventory: InventoryItem[];
  clients: Client[];
}

export default function LiveOperationsFeed({ orders, inventory, clients }: LiveOperationsFeedProps) {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Initialize with some seed historical events to populate right away!
  useEffect(() => {
    const historicalSeeds: LiveEvent[] = [
      {
        id: "EV-001",
        time: getRelativeTime(1),
        type: "Order Delivered",
        title: "Order Delivered successfully",
        description: "ORD-99301 was successfully cleared on Calcutta BlueDart logistics nod.",
        color: "text-purple-500 bg-purple-500/10 border-purple-500/20"
      },
      {
        id: "EV-002",
        time: getRelativeTime(3),
        type: "New Order",
        title: "New order received on Shopify Store",
        description: "Preeti Sharma bought Handcrafted Soy Candle via Shopify division.",
        color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20"
      },
      {
        id: "EV-003",
        time: getRelativeTime(5),
        type: "Low Stock Warning",
        title: "Low stock alert triggered",
        description: "SKU-100012 (Premium Running Shoes) holding only 6 units remaining.",
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
      },
      {
        id: "EV-004",
        time: getRelativeTime(8),
        type: "Order Shipped",
        title: "Order dispatches updated",
        description: "ORD-99304 handed over to Delhivery logistics for regional delivery.",
        color: "text-blue-500 bg-blue-500/10 border-blue-500/20"
      }
    ];
    setEvents(historicalSeeds);
  }, []);

  function getRelativeTime(minusMinutes: number) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - minusMinutes);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  // Live simulator logic: Prepend an event every 5 seconds
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const randTypeIdx = Math.floor(Math.random() * 9);
      const newEv = generateSimulatedEvent(randTypeIdx);
      setEvents((prev) => [newEv, ...prev.slice(0, 14)]); // Keep maximum of 15 items in view
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive, orders, inventory, clients]);

  const generateSimulatedEvent = (typeIdx: number): LiveEvent => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const idStr = `EV-${Math.floor(100 + Math.random() * 900)}`;

    const names = ["Aarav Mehta", "Ishaan Roy", "Dia Sen", "Suhana Nair", "Kabir Gupta", "Pranav Joshi"];
    const products = ["Organic Tea Tonic", "Premium Linen Shirt", "Smart Blender 3000", "Spiced Masala Chai", "Wireless Mouse"];
    const storesList = ["Aura Nykaa Division", "EcoThreads Myntra", "Patel Amazon Node", "SoleMates Flipkart"];
    const couriers = ["Delhivery", "BlueDart", "Shadowfax", "XpressBees"];

    const rName = names[Math.floor(Math.random() * names.length)];
    const rProd = products[Math.floor(Math.random() * products.length)];
    const rStore = storesList[Math.floor(Math.random() * storesList.length)];
    const rCourier = couriers[Math.floor(Math.random() * couriers.length)];
    const randOrdId = `ORD-${Math.floor(900000 + Math.random() * 10000)}`;

    switch (typeIdx) {
      case 0:
        return {
          id: idStr,
          time: timeStr,
          type: "New Order",
          title: "New order received on " + rStore,
          description: `${rName} completed a transaction for ${rProd} - ₹${Math.floor(450 + Math.random() * 2000)}.`,
          color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20"
        };
      case 1:
        return {
          id: idStr,
          time: timeStr,
          type: "Order Packed",
          title: "Order packaging verified",
          description: `${randOrdId} is packed with custom-bonded security wrap. Allocated courier node: ${rCourier}.`,
          color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
        };
      case 2:
        return {
          id: idStr,
          time: timeStr,
          type: "Order Shipped",
          title: "Fulfillment handed over to logistics hub",
          description: `${randOrdId} dispatched and handed over to ${rCourier} line-haul loaders.`,
          color: "text-blue-500 bg-blue-500/10 border-blue-500/20"
        };
      case 3:
        return {
          id: idStr,
          time: timeStr,
          type: "Order Delivered",
          title: "Order Delivered successfully",
          description: `${randOrdId} marked DELIVERED on buyer's handset scan. Destination reached safely.`,
          color: "text-purple-500 bg-purple-500/10 border-purple-500/20"
        };
      case 4:
        return {
          id: idStr,
          time: timeStr,
          type: "Return Created",
          title: "Return pickup request submitted",
          description: `${rName} claimed size misalignment on product: ${rProd}. Retaining under review.`,
          color: "text-rose-500 bg-rose-500/10 border-rose-500/20"
        };
      case 5:
        return {
          id: idStr,
          time: timeStr,
          type: "RTO Created",
          title: "Return to Origin (RTO) initiated",
          description: `Logistics returned ${randOrdId} - customer unavailable at address loop. Returning to warehouse.`,
          color: "text-pink-500 bg-pink-500/10 border-pink-500/20"
        };
      case 6:
        return {
          id: idStr,
          time: timeStr,
          type: "Low Stock Warning",
          title: "Inventory threshold alert",
          description: `SKU-${Math.floor(100800 + Math.random() * 500)} (${rProd}) triggered low-stock safety alarm! Only 9 units remaining.`,
          color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
        };
      case 7:
        return {
          id: idStr,
          time: timeStr,
          type: "Store Suspended",
          title: "Marketplace Store suspended",
          description: `${rStore} has been flagged for API sync validation delays. Access paused temporarily.`,
          color: "text-red-500 bg-red-500/10 border-red-500/20"
        };
      case 8:
      default:
        const clientVal = clients[Math.floor(Math.random() * clients.length)]?.businessName || "Aura Divison";
        return {
          id: idStr,
          time: timeStr,
          type: "New Seller Licensed",
          title: "New seller authorized",
          description: `New seller partner licensed and synced under division: ${clientVal}. State active.`,
          color: "text-teal-500 bg-teal-500/10 border-teal-500/20"
        };
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "New Order":
        return <Activity className="w-4 h-4" />;
      case "Order Packed":
        return <CheckCircle className="w-4 h-4" />;
      case "Order Shipped":
        return <Truck className="w-4 h-4" />;
      case "Order Delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "Return Created":
        return <RotateCcw className="w-4 h-4" />;
      case "RTO Created":
        return <RotateCcw className="w-4 h-4" />;
      case "Low Stock Warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "Store Suspended":
        return <ShieldAlert className="w-4 h-4" />;
      case "New Seller Licensed":
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-xl select-none">
      {/* Header telemetry info bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3 shrink-0">
            {isLive ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-500"></span>
            )}
          </span>
          <div>
            <h3 className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-1.5">
              Live Operations Command Center
            </h3>
            <p className="text-[11px] text-slate-400">Continuous telemetry pipeline of active seller partner operations across 6 marketplaces.</p>
          </div>
        </div>

        <button
          onClick={() => setIsLive(!isLive)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
            isLive
              ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
              : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
          }`}
        >
          {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {isLive ? "LIVE DATA STREAM" : "PAUSED"}
        </button>
      </div>

      {/* Visual Timeline Stream */}
      <div className="mt-4 overflow-x-auto select-all max-h-52 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="relative flex flex-col gap-3 pl-4 border-l border-slate-800">
          {events.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              Initializing telemetry stream hooks...
            </div>
          ) : (
            events.map((ev, idx) => (
              <div
                key={ev.id}
                className={`relative flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg border text-xs transition-all duration-300 transform translate-x-0 ${ev.color} ${idx === 0 ? "scale-[1.01] shadow-[0_0_15px_rgba(16,185,129,0.05)]" : ""}`}
              >
                {/* Dot marker */}
                <div className="absolute -left-[21px] top-4 w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                  <div className={`w-1 h-1 rounded-full ${idx === 0 && isLive ? "bg-emerald-400 animate-ping" : "bg-slate-500"}`}></div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-lg border border-current/20 flex items-center justify-center shrink-0`}>
                    {getIcon(ev.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase font-bold tracking-wider">{ev.type}</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {ev.time}
                      </span>
                    </div>
                    <p className="font-bold text-slate-200 mt-0.5">{ev.title}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{ev.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

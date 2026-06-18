import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  RefreshCw,
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import { Order, OrderStatus } from "../types";
import { resolveStatusBadge } from "./OrdersTable";

interface LiveActivityFeedProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

export default function LiveActivityFeed({ orders, onSelectOrder }: LiveActivityFeedProps) {
  // Extract physical activities dynamically from the last updated orders list
  const activities = React.useMemo(() => {
    // Sort orders by most recent
    const sorted = [...orders].slice(0, 10);
    
    return sorted.map((o) => {
      // Resolve descriptive label for the feed event
      let actionLabel = "Order Created";
      if (o.status === OrderStatus.Processing) actionLabel = "Order Packaged (Processing)";
      if (o.status === OrderStatus.Packed) actionLabel = "Order Packed in Bin";
      if (o.status === OrderStatus.Shipped) actionLabel = "Order Forwarded to Courier Air terminal";
      if (o.status === OrderStatus.Delivered) actionLabel = "Order Handed over/Signed [Delivered]";
      if (o.status === OrderStatus.Cancelled) actionLabel = "Order Purged (Cancelled)";
      if (o.status === OrderStatus.Returned) actionLabel = "Inbound Return scan detected";
      if (o.status === OrderStatus.RTO) actionLabel = "Return to Origin scan (RTO)";

      return {
        id: `FEED_${o.id}_${o.status}`,
        orderId: o.id,
        store: o.store,
        marketplace: o.marketplace,
        courier: o.courier,
        status: o.status,
        timestamp: o.orderDate || "10 seconds ago",
        actionLabel,
        orderObj: o
      };
    });
  }, [orders]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 select-none h-full flex flex-col justify-between">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b pb-2 mb-1 border-slate-100 dark:border-slate-800">
        <span className="text-xs font-mono font-black text-slate-500 uppercase flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-emerald-500 animate-bounce" /> Real-Time Activity Feed
        </span>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-extrabold px-2 py-0.5 rounded-full font-mono">
          Online
        </span>
      </div>

      {/* Activity Timeline List */}
      <div className="flex-1 overflow-y-auto max-h-[380px] space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
        {activities.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg border-slate-200">
            <Bell className="w-6 h-6 text-slate-300 mx-auto mb-2" />
            <h5 className="text-xs font-bold text-slate-700">No Operations Ingress</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Waiting for connected data pipeline streams</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {activities.map((act) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelectOrder(act.orderObj)}
                className="bg-slate-50/50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 border border-slate-150 dark:border-slate-850 p-3 rounded-lg text-xs flex justify-between gap-3 cursor-pointer transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-slate-800 dark:text-slate-100">
                      {act.orderId}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {act.actionLabel}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-450 dark:text-slate-400 truncate font-mono">
                    Node: {act.marketplace} &bull; {act.store} &bull; Carrier: {act.courier}
                  </p>

                  <div className="text-[9px] text-slate-400 font-mono">
                    Scanned time: {act.timestamp}
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end justify-between">
                  {/* Status Badge */}
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-extrabold uppercase tracking-wide border ${resolveStatusBadge(act.status)}`}>
                    {act.status}
                  </span>
                  
                  <span className="text-[9px] text-slate-300 group-hover:text-emerald-500 mt-1">
                    <ExternalLink className="w-3 h-3 hover:text-emerald-500" />
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
        <span className="text-[9.5px] font-mono text-slate-400">
          Showing latest 10 operational pipeline events
        </span>
      </div>
    </div>
  );
}

import React from "react";
import {
  ArrowLeft,
  User,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Barcode,
  Package,
  Activity,
  CreditCard,
  Layers,
  ChevronRight,
  Flame,
  FileCode,
  RotateCcw,
  XCircle,
  HelpCircle
} from "lucide-react";
import { Order, OrderStatus } from "../types";
import { resolveStatusBadge } from "./OrdersTable";

interface OrderDetailsViewProps {
  order: Order;
  onBack: () => void;
  onOpenTelemetryTower: (order: Order) => void;
  onModifyStatus: (id: string, status: OrderStatus) => void;
}

export default function OrderDetailsView({
  order,
  onBack,
  onOpenTelemetryTower,
  onModifyStatus
}: OrderDetailsViewProps) {
  // Deterministic Address details based on hash algorithm
  const hashVal = order.customerName.length + (parseInt(order.id.replace(/\D/g, "")) || 41);
  const userPhone = order.phone || `+91 9${((hashVal * 17) % 90000000) + 10000000}`;
  const mockSku = order.id ? `SKU-${hashVal * 11 % 8000 + 1000}` : "SKU-10825A";
  
  // Weights / Package parameters
  const packWeight = `${((hashVal * 57) % 350 + 150) / 100} kg`;
  const packDims = `${hashVal % 15 + 10} x ${hashVal % 10 + 8} x ${hashVal % 6 + 5} cm`;

  // Dynamic state dates
  const ordDateObj = new Date(order.orderDate || "2026-06-17");
  
  const createdStr = ordDateObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  
  const packedDateObj = new Date(ordDateObj); packedDateObj.setMinutes(hashVal * 3 % 40 + 15);
  const packedStr = packedDateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const shippedDateObj = new Date(ordDateObj); shippedDateObj.setHours(shippedDateObj.getHours() + 1);
  const shippedStr = shippedDateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  // Order timeline checklist markers
  const stages = [
    { label: "Order Created", done: true, time: `${createdStr} at 09:30 AM` },
    { label: "Processing", done: order.status !== OrderStatus.New, time: `${createdStr} at 10:15 AM` },
    { label: "Packed", done: [OrderStatus.Packed, OrderStatus.Shipped, OrderStatus.Delivered].includes(order.status), time: `${createdStr} at 11:22 AM` },
    { label: "Shipped", done: [OrderStatus.Shipped, OrderStatus.Delivered].includes(order.status), time: `${createdStr} at 02:40 PM` },
    { label: "Delivered", done: order.status === OrderStatus.Delivered, time: `${createdStr} at 07:15 PM` }
  ];

  // Resolve JSON payload representer
  const parsedPayload = {
    event_type: "order.synchronized",
    timestamp: "2026-06-17T08:04:05-07:00",
    carrier_gateway: order.courier,
    api_version: "2026.04",
    payload: {
      order_id: order.id,
      customer: {
        raw_name: order.customerName,
        phone_node: userPhone,
        address: {
          city: order.city || "Mumbai",
          state: order.state || "Maharashtra",
          postal_pin: String((hashVal * 123) % 890000 + 110000)
        }
      },
      commodities: [
        {
          sku: mockSku,
          description: order.product,
          units: order.quantity,
          net_revenue: order.revenue
        }
      ],
      package_specifications: {
        declared_weight: packWeight,
        metric_cube: packDims,
        shipment_awb: order.trackingNumber
      },
      external_marketplace: order.marketplace,
      sync_store_code: order.store
    }
  };

  const rawJsonString = order.rawJson || JSON.stringify(parsedPayload, null, 2);

  return (
    <div className="space-y-6 select-none animate-[fadeIn_0.15s_ease-out]">
      {/* Return Navigation Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 px-2 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-350 border border-slate-150 dark:border-slate-850 rounded hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to List
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-800 dark:text-slate-100">{order.id}</span>
              <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-black uppercase tracking-wider ${resolveStatusBadge(order.status)}`}>
                {order.status}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Source Connection: {order.marketplace} &bull; {order.store}</p>
          </div>
        </div>

        {/* Telemetry tower action button */}
        <button
          onClick={() => onOpenTelemetryTower(order)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-extrabold tracking-tight px-4 py-2 rounded-lg text-xs cursor-pointer shadow-md transform hover:scale-[1.01] transition-all"
        >
          <Flame className="w-4 h-4 text-white animate-pulse" /> Launch Specific Live Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column (Details and Items) - takes 2 cols on wide screens */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Details & Customer Matrix */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider border-b pb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-500" /> Customer Information
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-450 dark:text-slate-450 font-medium">Customer Name:</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-100">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450 dark:text-slate-450 font-medium">Mobile Number:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-200">{userPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450 dark:text-slate-455 font-medium">Target Postal Pin:</span>
                  <span className="font-mono">{String((hashVal * 123) % 89000 + 11000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450 dark:text-slate-455 font-medium">Recipient City:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-201">{order.city || "Mumbai"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450 dark:text-slate-455 font-medium">Destination State:</span>
                  <span>{order.state || "Maharashtra"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider border-b pb-1.5 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-500" /> Logistics Courier Matrix
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-450 dark:text-slate-451 font-medium">Courier Partner:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{order.courier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450 dark:text-slate-451 font-medium">Tracking Number:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-205">{order.trackingNumber || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450 dark:text-slate-451 font-medium">Dispatch Date:</span>
                  <span className="font-mono">{ordDateObj.toLocaleDateString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450 dark:text-slate-451 font-medium">Package Weight:</span>
                  <span className="font-mono">{packWeight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-455 font-medium">Physical Dimensions:</span>
                  <span className="font-mono">{packDims}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Address Cards Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-black text-slate-400 uppercase block tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Delivery Shipping Address
              </span>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350">
                {order.customerName}<br />
                Aura Logistics Hub Complex, 15/4-B Floor<br />
                Industrial Zone Sector-X, Pin {(hashVal * 123) % 89000 + 11000}<br />
                {order.city || "Mumbai"}, {order.state || "Maharashtra"}
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono font-black text-slate-400 uppercase block tracking-wider flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Account Billing Address
              </span>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-355">
                {order.customerName}<br />
                Financial Suite-A, Ground Level Terminal Block<br />
                Corporate Financial Lane &bull; IFSC code 90325<br />
                {order.city || "Mumbai"}, {order.state || "Maharashtra"}
              </p>
            </div>
          </div>

          {/* Commodity Items List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 font-bold text-xs text-slate-700 dark:text-slate-205 flex items-center gap-2">
              <Barcode className="w-4 h-4 text-emerald-500" /> Commodity Line Items Breakdown
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-mono font-bold uppercase tracking-wider text-[10px] border-b border-slate-100 dark:border-slate-800">
                  <th className="p-3 pl-4">Product Name & Specifications</th>
                  <th className="p-3">SKU Code</th>
                  <th className="p-3 text-center">Quantity</th>
                  <th className="p-3 text-right pr-4">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                <tr className="hover:bg-slate-50/40">
                  <td className="p-3 pl-4">
                    <span className="font-extrabold text-slate-800 dark:text-slate-105 block">{order.product}</span>
                    <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Category: General Cargo Freight &bull; Insurance: Declared</span>
                  </td>
                  <td className="p-3 font-mono text-slate-600 dark:text-slate-300">
                    {mockSku}
                  </td>
                  <td className="p-3 text-center font-bold text-slate-900 dark:text-white">
                    {order.quantity}
                  </td>
                  <td className="p-3 text-right font-black font-mono text-slate-800 dark:text-white pr-4">
                    ₹{order.revenue}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Interactive Status overrides widget */}
          <div className="bg-emerald-500/5 dark:bg-slate-900/60 border border-emerald-500/20 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                <Activity className="w-4 h-4 text-emerald-500" />
              </span>
              <div>
                <span className="text-xs font-bold text-slate-750 dark:text-slate-200 block">Operational Transition Gate</span>
                <span className="text-[10px] text-slate-450 block">Manually slide manifest state if sync error occurs.</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {Object.values(OrderStatus).slice(0, 5).map((st) => (
                <button
                  key={st}
                  disabled={order.status === st}
                  onClick={() => onModifyStatus(order.id, st)}
                  className={`p-1.5 px-3.5 border text-[10px] font-mono font-black uppercase rounded-lg transition-colors cursor-pointer ${
                    order.status === st
                      ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-800"
                      : "bg-white hover:bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-205 dark:border-slate-800 hover:text-emerald-500"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Timeline & Raw JSON API payload) - takes 1 col */}
        <div className="space-y-6">
          
          {/* Milestone tracking progress checklist */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider border-b pb-1.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" /> Logistics Tracking Timeline
            </h4>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {stages.map((st, sIdx) => (
                <div key={st.label} className="relative">
                  <span className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold ${
                    st.done
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-950 dark:border-slate-800"
                  }`}>
                    {st.done ? "✓" : "○"}
                  </span>
                  <div>
                    <span className={`text-xs font-extrabold block leading-none ${st.done ? "text-slate-800 dark:text-slate-100" : "text-slate-400"}`}>
                      {st.label}
                    </span>
                    {st.done && (
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        {st.time}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Webhook REST API Response JSON card */}
          <div className="bg-slate-900 border border-slate-950 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-muted-foreground text-slate-400" /> Raw Synchronised API Response JSON
              </span>
            </div>
            
            <div className="text-[10px] text-slate-350 font-mono bg-slate-950 p-3 rounded-lg overflow-x-auto max-h-[300px] leading-relaxed custom-scrollbar">
              <pre className="whitespace-pre">{rawJsonString}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

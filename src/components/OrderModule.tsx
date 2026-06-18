import React, { useState } from "react";
import {
  Search,
  Check,
  Truck,
  X,
  XCircle,
  Package,
  Calendar,
  Layers,
  ChevronDown,
  Info,
  Clock,
  MapPin,
  Download
} from "lucide-react";
import { Order, OrderStatus } from "../types";

interface OrderModuleProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onAddOrder?: (order: Omit<Order, "id">) => void;
}

export default function OrderModule({ orders, onUpdateStatus }: OrderModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [trackingRouteID, setTrackingRouteID] = useState<string | null>(null);

  // Search/Filter logic
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Bulk selectors
  const toggleSelectOrder = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((oId) => oId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((o) => o.id));
    }
  };

  // Bulk execution
  const executeBulkStatusChange = (newStatus: OrderStatus) => {
    selectedOrders.forEach((oId) => {
      onUpdateStatus(oId, newStatus);
    });
    setSelectedOrders([]);
    alert(`Bulk Operation: Successfully set ${selectedOrders.length} orders to '${newStatus}'!`);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.New:
        return "bg-indigo-505/10 text-indigo-500 border-indigo-500/20";
      case OrderStatus.Processing:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case OrderStatus.Packed:
        return "bg-blue-500/10 text-blue-505 border-blue-500/20";
      case OrderStatus.Shipped:
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case OrderStatus.Delivered:
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case OrderStatus.Cancelled:
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800";
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Order ID", "Date", "Customer", "Product", "Qty", "Marketplace", "Store", "Status", "Courier", "Tracking", "GTV"];
    const rows = filteredOrders.map(o => [
      o.id, o.orderDate, o.customerName, o.product, o.quantity, o.marketplace, o.store, o.status, o.courier, o.trackingNumber, o.revenue
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TTGT_Orders_Dispatch_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Filtering header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 flex-grow max-w-md bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg px-2.5 py-1.5 focus-within:border-emerald-500/40 transition-colors">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search order ID, customer name, tracking, SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-sm w-full outline-none text-slate-700 dark:text-slate-300"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-semibold px-3 py-2 text-slate-600 dark:text-slate-400 outline-none"
          >
            <option value="All">All Operations Status</option>
            {Object.values(OrderStatus).map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center h-8 gap-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 px-3 text-xs text-slate-600 dark:text-slate-300 rounded-lg transition-all cursor-pointer font-bold"
          >
            <Download className="w-3.5 h-3.5" /> Export Orders CSV
          </button>
        </div>
      </div>

      {/* Bulk Toolbar */}
      {selectedOrders.length > 0 && (
        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-5 py-3 rounded-lg text-xs animate-slideDown">
          <p className="font-bold text-emerald-500">
            {selectedOrders.length} orders queued for action
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => executeBulkStatusChange(OrderStatus.Packed)}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-905 font-bold rounded-lg cursor-pointer"
            >
              Bulk Set packed
            </button>
            <button
              onClick={() => executeBulkStatusChange(OrderStatus.Shipped)}
              className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg cursor-pointer"
            >
              Bulk Set Shipped
            </button>
            <button
              onClick={() => executeBulkStatusChange(OrderStatus.Cancelled)}
              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg cursor-pointer"
            >
              Bulk Void (Cancel)
            </button>
            <button
              onClick={() => setSelectedOrders([])}
              className="text-slate-500 hover:text-slate-200 underline font-mono"
            >
              Dismiss selection
            </button>
          </div>
        </div>
      )}

      {/* Main Grid table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-500">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 mr-2"
                  />
                </th>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Product Unit</th>
                <th className="p-4">Integration Store</th>
                <th className="p-4">Logistics / Courier</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Modify Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    No orders matching filters are found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const isChecked = selectedOrders.includes(o.id);
                  const isTrackingVisible = trackingRouteID === o.id;

                  return (
                    <React.Fragment key={o.id}>
                      <tr className={`hover:bg-slate-50/20 dark:hover:bg-slate-850/20 transition-colors ${isChecked ? "bg-emerald-500/5" : ""}`}>
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectOrder(o.id)}
                            className="rounded border-slate-300"
                          />
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setTrackingRouteID(isTrackingVisible ? null : o.id)}
                            className="font-bold text-slate-800 dark:text-white hover:text-emerald-500 transition-colors text-xs font-mono select-text"
                          >
                            {o.id}
                          </button>
                          <span className="block text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3" /> {o.orderDate}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold dark:text-slate-300">{o.customerName}</p>
                        </td>
                        <td className="p-4 max-w-[200px]">
                          <p className="text-xs truncate font-medium dark:text-slate-300">{o.product}</p>
                          <span className="text-[10px] font-mono text-slate-400">Qty: {o.quantity} | GTV: ₹{o.revenue}</span>
                        </td>
                        <td className="p-4 text-xs font-mono">
                          <p className="font-bold dark:text-slate-205">{o.marketplace}</p>
                          <p className="text-[10px] text-slate-400 truncate">{o.store.replace("Store", "")}</p>
                        </td>
                        <td className="p-4 text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 block">{o.courier}</span>
                          <span className="font-mono text-[10px] text-slate-400 select-all">{o.trackingNumber}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-mono tracking-wider font-extrabold ${getStatusBadge(o.status)}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <select
                            value={o.status}
                            onChange={(e) => onUpdateStatus(o.id, e.target.value as OrderStatus)}
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-105 dark:border-slate-800 rounded px-2 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 outline-none"
                          >
                            {Object.values(OrderStatus).map((state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>

                      {/* Timeline status track visualization dropdown */}
                      {isTrackingVisible && (
                        <tr>
                          <td colSpan={8} className="bg-slate-50/50 dark:bg-slate-950/40 p-4 border-l-2 border-emerald-500">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 font-extrabold tracking-widest uppercase py-0.5 px-2 rounded">
                                  LIVE TRACKER
                                </span>
                                <h4 className="text-xs font-bold text-slate-750 dark:text-white mt-1">
                                  Courier: {o.courier} &bull; Tracking: <span className="font-mono">{o.trackingNumber}</span>
                                </h4>
                              </div>

                              {/* Progress pipeline */}
                              <div className="flex flex-1 max-w-lg items-center text-xs font-mono mt-4 md:mt-0">
                                <div className="flex flex-col items-center flex-1">
                                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-905 flex items-center justify-center font-bold">✓</div>
                                  <span className="text-[10px] text-slate-500 mt-1">Processed</span>
                                </div>
                                <div className={`h-1 flex-1 ${o.status === OrderStatus.New ? "bg-slate-800" : "bg-emerald-500"}`}></div>
                                
                                <div className="flex flex-col items-center flex-1">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold font-xs ${
                                    o.status === OrderStatus.New || o.status === OrderStatus.Processing ? "bg-slate-800 text-slate-400" : "bg-emerald-500 text-slate-900"
                                  }`}>
                                    {o.status === OrderStatus.New || o.status === OrderStatus.Processing ? "2" : "✓"}
                                  </div>
                                  <span className="text-[10px] text-slate-500 mt-1">Packed</span>
                                </div>
                                <div className={`h-1 flex-1 ${o.status === OrderStatus.Shipped || o.status === OrderStatus.Delivered ? "bg-emerald-500" : "bg-slate-800"}`}></div>
                                
                                <div className="flex flex-col items-center flex-1">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold font-xs ${
                                    o.status === OrderStatus.Shipped || o.status === OrderStatus.Delivered ? "bg-emerald-500 text-slate-900" : "bg-slate-800 text-slate-400"
                                  }`}>
                                    {o.status === OrderStatus.Delivered ? "✓" : "3"}
                                  </div>
                                  <span className="text-[10px] text-slate-500 mt-1">Transit</span>
                                </div>
                                <div className={`h-1 flex-1 ${o.status === OrderStatus.Delivered ? "bg-emerald-500" : "bg-slate-800"}`}></div>

                                <div className="flex flex-col items-center flex-1">
                                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center font-bold font-xs ${
                                    o.status === OrderStatus.Delivered ? "bg-emerald-500 text-slate-900 border-none" : "bg-slate-950 border-slate-700 text-slate-400"
                                  }`}>
                                    {o.status === OrderStatus.Delivered ? "✓" : "4"}
                                  </div>
                                  <span className="text-[10px] text-slate-505 mt-1">Delivered</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

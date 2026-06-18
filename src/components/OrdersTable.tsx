import React, { useState, useMemo } from "react";
import {
  MoreVertical,
  SlidersHorizontal,
  Download,
  FileSpreadsheet,
  Printer,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Truck,
  Eye,
  Trash2,
  RefreshCw,
  Clock,
  User,
  ShoppingBag,
  FileText,
  Ship,
  FileCheck
} from "lucide-react";
import { Order, OrderStatus } from "../types";

// Helper state style resolver
export const resolveStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.New:
      return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
    case OrderStatus.Processing:
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case OrderStatus.Packed:
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
    case OrderStatus.Shipped:
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    case OrderStatus.Delivered:
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25";
    case OrderStatus.Cancelled:
      return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    case OrderStatus.Returned:
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    case OrderStatus.RTO:
      return "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

interface OrdersTableProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onSelectInteractiveDashboard: (order: Order) => void;
  onModifyStatus: (id: string, status: OrderStatus) => void;
  onDeleteOrder: (id: string) => void;
  onTriggerSyncLogs?: (id: string) => void;
}

export default function OrdersTable({
  orders,
  onSelectOrder,
  onSelectInteractiveDashboard,
  onModifyStatus,
  onDeleteOrder,
  onTriggerSyncLogs
}: OrdersTableProps) {
  // Filters parameters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMarketplace, setFilterMarketplace] = useState("All");
  const [filterStore, setFilterStore] = useState("All");
  const [filterCourier, setFilterCourier] = useState("All");
  const [filterCity, setFilterCity] = useState("All");
  const [filterState, setFilterState] = useState("All");
  
  // Sort parameters
  const [sortField, setSortField] = useState<keyof Order>("id");
  const [sortAsc, setSortAsc] = useState(false);

  // Pagination parameters
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // Active Context Menu Row state tracker
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modal print/invoice display simulators
  const [modalSim, setModalSim] = useState<{ type: string; orderId: string } | null>(null);

  const toggleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
    setPage(1);
  };

  // Extract unique elements for dropdown filters
  const menuOptions = useMemo(() => {
    const stores = new Set<string>();
    const mps = new Set<string>();
    const couriers = new Set<string>();
    const cities = new Set<string>();
    const states = new Set<string>();

    orders.forEach((o) => {
      if (o.store) stores.add(o.store);
      if (o.marketplace) mps.add(o.marketplace);
      if (o.courier) couriers.add(o.courier);
      if (o.city) cities.add(o.city);
      if (o.state) states.add(o.state);
    });

    return {
      stores: ["All", ...Array.from(stores)],
      marketplaces: ["All", ...Array.from(mps)],
      couriers: ["All", ...Array.from(couriers)],
      cities: ["All", ...Array.from(cities)],
      states: ["All", ...Array.from(states)]
    };
  }, [orders]);

  // Handle Multi-dimensional dynamic filter mapping
  const processedOrders = useMemo(() => {
    let result = orders.filter((o) => {
      const query = search.toLowerCase();
      const matchesSearch =
        o.id.toLowerCase().includes(query) ||
        o.customerName.toLowerCase().includes(query) ||
        o.product.toLowerCase().includes(query) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(query)) ||
        (o.awb && o.awb.toLowerCase().includes(query)) ||
        (o.phone && o.phone.toLowerCase().includes(query));

      const matchesStatus = filterStatus === "All" || o.status === filterStatus;
      const matchesMarketplace = filterMarketplace === "All" || o.marketplace === filterMarketplace;
      const matchesStore = filterStore === "All" || o.store === filterStore;
      const matchesCourier = filterCourier === "All" || o.courier === filterCourier;
      const matchesCity = filterCity === "All" || o.city === filterCity;
      const matchesState = filterState === "All" || o.state === filterState;

      return matchesSearch && matchesStatus && matchesMarketplace && matchesStore && matchesCourier && matchesCity && matchesState;
    });

    // Sorting
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === "string") valA = (valA as string).toLowerCase();
      if (typeof valB === "string") valB = (valB as string).toLowerCase();

      if (valA === undefined) return 1;
      if (valB === undefined) return -1;

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [orders, search, filterStatus, filterMarketplace, filterStore, filterCourier, filterCity, filterState, sortField, sortAsc]);

  // Combined paginated rows indexers
  const paginatedRows = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return processedOrders.slice(startIndex, startIndex + rowsPerPage);
  }, [processedOrders, page, rowsPerPage]);

  const totalPages = Math.ceil(processedOrders.length / rowsPerPage) || 1;

  // Global action utilities
  const exportToCSV = () => {
    if (processedOrders.length === 0) return;
    const headerRow = [
      "Order ID", "Customer Name", "Phone", "Marketplace", "Store Name", 
      "Courier Provider", "AWB", "Estimated Value", "Payment Status", "Status", "City", "State"
    ];
    const dataLines = processedOrders.map((o) => [
      o.id,
      `"${o.customerName.replace(/"/g, '""')}"`,
      o.phone || "",
      o.marketplace,
      `"${o.store.replace(/"/g, '""')}"`,
      o.courier,
      o.trackingNumber || o.awb || "",
      o.revenue,
      o.paymentStatus || "Paid",
      o.status,
      o.city || "",
      o.state || ""
    ].join(","));

    const content = [headerRow.join(","), ...dataLines].join("\n");
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `ttgt_solutions_logistics_manifest_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    // Generate formatted layout and download as standard document
    exportToCSV();
  };

  const handlePrintManifest = () => {
    window.print();
  };

  const handleResetFilters = () => {
    setSearch("");
    setFilterStatus("All");
    setFilterMarketplace("All");
    setFilterStore("All");
    setFilterCourier("All");
    setFilterCity("All");
    setFilterState("All");
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Search & Complex Filtration panel workspace */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-4 rounded-xl shadow-sm space-y-3 select-none">
        <div className="flex items-center justify-between border-b pb-2 mb-1 border-slate-100 dark:border-slate-800">
          <span className="text-xs font-mono font-extrabold text-slate-500 uppercase flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" /> High Density Filter Grid
          </span>
          <button
            onClick={handleResetFilters}
            className="text-[10px] font-mono font-bold text-rose-500 hover:underline cursor-pointer"
          >
            Clear Filters [x]
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="space-y-1 sm:col-span-2">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase">Search Phrase</span>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="ID, customer, tracking AWB, phone..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 pl-8 pr-2.5 py-1.5 rounded text-xs focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase">Marketplace</span>
            <select
              value={filterMarketplace}
              onChange={(e) => { setFilterMarketplace(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-1.5 rounded text-xs text-slate-700 dark:text-slate-350 focus:outline-none"
            >
              {menuOptions.marketplaces.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase">Store Node</span>
            <select
              value={filterStore}
              onChange={(e) => { setFilterStore(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-1.5 rounded text-xs text-slate-700 dark:text-slate-350 focus:outline-none"
            >
              {menuOptions.stores.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase">Courier Code</span>
            <select
              value={filterCourier}
              onChange={(e) => { setFilterCourier(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-1.5 rounded text-xs text-slate-700 dark:text-slate-350 focus:outline-none"
            >
              {menuOptions.couriers.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase">City Node</span>
            <select
              value={filterCity}
              onChange={(e) => { setFilterCity(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-1.5 rounded text-xs text-slate-700 dark:text-slate-350 focus:outline-none"
            >
              {menuOptions.cities.map((ct) => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase">Regional State</span>
            <select
              value={filterState}
              onChange={(e) => { setFilterState(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-1.5 rounded text-xs text-slate-700 dark:text-slate-350 focus:outline-none"
            >
              {menuOptions.states.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid View Controller wrapper */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-xl shadow-sm overflow-hidden select-none">
        
        {/* Actions Row */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
              Live Operations Control Grid ({processedOrders.length} matching)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-705 text-slate-700 dark:text-slate-200 rounded border border-slate-250 dark:border-slate-700 text-[11px] font-bold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" /> Export CSV
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-705 text-slate-700 dark:text-slate-200 rounded border border-slate-250 dark:border-slate-700 text-[11px] font-bold transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Export Excel
            </button>
            <button
              onClick={handlePrintManifest}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-705 text-slate-700 dark:text-slate-200 rounded border border-slate-250 dark:border-slate-700 text-[11px] font-bold transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-blue-500" /> Print Manifest
            </button>
          </div>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] min-w-[1200px]">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-150 dark:border-slate-800/80 sticky top-0 uppercase tracking-wider font-mono font-black select-none">
              <tr>
                <th className="p-3 pl-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900" onClick={() => toggleSort("id")}>
                  <div className="flex items-center gap-1">Order ID <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900" onClick={() => toggleSort("customerName")}>
                  <div className="flex items-center gap-1">Customer <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="p-3">Phone</th>
                <th className="p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900" onClick={() => toggleSort("marketplace")}>
                  <div className="flex items-center gap-1">Marketplace <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="p-3">Store Name</th>
                <th className="p-3">Courier</th>
                <th className="p-3">AWB / Tracking</th>
                <th className="p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900" onClick={() => toggleSort("revenue")}>
                  <div className="flex items-center gap-1 text-right justify-end w-20">Value <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="p-3">Payment</th>
                <th className="p-3 text-center">Status Badge</th>
                <th className="p-3">City / State</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-16 text-center text-slate-405 font-mono text-xs">
                    "No Data Available" &bull; Waiting for Data Source or Live API integration mapping...
                  </td>
                </tr>
              ) : (
                paginatedRows.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/55 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="p-3 pl-4">
                      <span onClick={() => onSelectOrder(o)} className="font-mono font-bold text-slate-800 dark:text-slate-150 block cursor-pointer hover:text-emerald-500 hover:underline">
                        {o.id}
                      </span>
                      <span className="text-[9px] text-slate-400 block font-mono">{o.orderDate}</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                      {o.customerName}
                    </td>
                    <td className="p-3 text-slate-500 font-mono">
                      {o.phone || "+91 98877 66554"}
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-black tracking-wider text-[9px] font-mono px-2 py-0.5 rounded text-slate-500 dark:text-slate-350 uppercase">
                        {o.marketplace}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-650 dark:text-slate-300 truncate max-w-[140px]" title={o.store}>
                      {o.store}
                    </td>
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                      {o.courier}
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-slate-600 dark:text-slate-300 block select-all">
                        {o.trackingNumber || o.awb || "—"}
                      </span>
                    </td>
                    <td className="p-3 text-right bg-slate-50/10 dark:bg-slate-950/10 font-bold font-mono text-slate-800 dark:text-slate-100 pr-5">
                      ₹{o.revenue}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-black ${
                        o.paymentStatus === "Paid" 
                          ? "bg-emerald-500/10 text-emerald-600" 
                          : o.paymentStatus === "Refunded"
                          ? "bg-rose-500/10 text-rose-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}>
                        {o.paymentStatus || "Paid"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-black uppercase tracking-wider inline-block text-center w-28 ${resolveStatusBadge(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-slate-700 dark:text-slate-200 block truncate max-w-28 font-medium">
                        {o.city || "Mumbai"}
                      </span>
                      <span className="text-[9px] text-slate-400 block font-mono">{o.state || "Maharashtra"}</span>
                    </td>
                    <td className="p-3 pr-4 text-right relative">
                      {/* Three dot actions anchor */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === o.id ? null : o.id);
                        }}
                        className="p-1 px-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer block ml-auto"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {/* Dropdown Menu Container (absolute portal helper) */}
                      {activeMenuId === o.id && (
                        <div className="absolute right-3.5 top-10 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-50 text-left overflow-hidden">
                          <div className="bg-slate-50 dark:bg-slate-950 p-2 border-b border-slate-100 dark:border-slate-800 text-[10px] font-mono font-black text-slate-400">
                            ORDER CONTEXT ACTIONS
                          </div>
                          <div className="p-1 space-y-0.5">
                            <button
                              onClick={() => { setActiveMenuId(null); onSelectOrder(o); }}
                              className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-950 rounded text-[11px] text-slate-700 dark:text-slate-200 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-emerald-500" /> View Order Details
                            </button>
                            <button
                              onClick={() => { setActiveMenuId(null); onSelectInteractiveDashboard(o); }}
                              className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-950 rounded text-[11px] text-slate-700 dark:text-slate-200 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5 text-indigo-500 animate-pulse" /> Live Telemetry Tower
                            </button>
                            <button
                              onClick={() => { setActiveMenuId(null); setModalSim({ type: "label", orderId: o.id }); }}
                              className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-950 rounded text-[11px] text-slate-700 dark:text-slate-200 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-500" /> Print Shipping Label
                            </button>
                            <button
                              onClick={() => { setActiveMenuId(null); setModalSim({ type: "invoice", orderId: o.id }); }}
                              className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-950 rounded text-[11px] text-slate-700 dark:text-slate-200 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <FileCheck className="w-3.5 h-3.5 text-amber-500" /> Print Commercial Invoice
                            </button>
                            
                            {/* Inner state swapper menu */}
                            <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-1">
                              <span className="text-[9px] font-mono font-bold text-slate-400 block px-2 mb-1.5">MUTATE STATUS</span>
                              <div className="grid grid-cols-2 gap-1 p-1">
                                {Object.values(OrderStatus).slice(0, 8).map((st) => (
                                  <button
                                    key={st}
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      onModifyStatus(o.id, st);
                                    }}
                                    className="p-1 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-950 text-[9px] text-slate-600 dark:text-slate-300 font-semibold rounded block text-center truncate cursor-pointer hover:text-emerald-600"
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <button
                              onClick={() => { setActiveMenuId(null); if (onTriggerSyncLogs) onTriggerSyncLogs(o.id); }}
                              className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-950 rounded text-[11px] text-slate-700 dark:text-slate-205 font-medium transition-colors flex items-center gap-1.5 cursor-pointer border-t border-slate-100 dark:border-slate-800"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-slate-400" /> Force API Re-Sync
                            </button>
                            <button
                              onClick={() => { setActiveMenuId(null); onDeleteOrder(o.id); }}
                              className="w-full text-left px-2.5 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-955 rounded text-[11px] text-rose-600 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Purge Record
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Backdrop overlay for global menu focus out */}
        {activeMenuId && (
          <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)}></div>
        )}

        {/* Interactive Pagination pane */}
        <div className="p-4 border-t border-slate-150 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Rows per view:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
              className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 py-1 px-2.5 text-xs rounded text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              {[10, 15, 25, 50, 100].map((val) => (
                <option key={val} value={val}>{val} rows</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-500">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({processedOrders.length} records total)
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-1 px-2 bg-white dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-100 text-slate-700 dark:text-slate-350 rounded border border-slate-205 dark:border-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1 px-2 bg-white dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-100 text-slate-700 dark:text-slate-355 rounded border border-slate-205 dark:border-slate-800 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Commercial Invoice & Label Modal simulator */}
      {modalSim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border text-slate-800 flex flex-col space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="font-extrabold text-sm uppercase tracking-wider text-slate-900 font-mono">
                {modalSim.type === "label" ? "Logistics Package Routing Slip" : "TAX COMMERCIAL INVOICE"}
              </span>
              <button onClick={() => setModalSim(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-slate-300 p-5 rounded-lg text-[11px] font-mono bg-slate-50 leading-relaxed text-slate-800">
              {modalSim.type === "label" ? (
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <strong>HUB ORIGIN: TTGT Solutions Mum-C</strong>
                    <strong>DESPATCH ID: {modalSim.orderId}</strong>
                  </div>
                  <div className="text-center py-6 border-b border-dashed border-slate-300">
                    <div className="text-2xl font-black tracking-widest bg-slate-900 text-white p-2.5 inline-block select-all mb-1">
                      ||| | |||| | ||||| | |||
                    </div>
                    <div className="text-[10px] text-slate-400">Tracking: TRK-95029410A</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-left pt-2">
                    <div>
                      <strong className="block text-slate-400">DELIVER TO:</strong>
                      <span className="font-bold text-[12px] block text-slate-900">Registered Operations Consignee</span>
                      <span>15A, Terminal Logistics Tower, Mumbai Industrial Zone</span>
                    </div>
                    <div>
                      <strong className="block text-slate-400">CARRIER ROUTE:</strong>
                      <span className="font-extrabold block text-slate-900">BLUEDART EXPRESS LANE [SLA-24H]</span>
                      <span>Weight: 0.85 Kgs &bull; Dimensions: 12x10x5cm</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <div>
                      <strong>TTGT SOLUTIONS TRADE INVOICE #TTGT-{modalSim.orderId.substring(4)}</strong>
                      <div className="text-[9px] text-slate-400">Date: 2026-06-17 / IST Zone</div>
                    </div>
                    <div className="text-right">
                      <strong>GSTIN: 27AABCT2008E1ZZ</strong>
                    </div>
                  </div>
                  <div className="py-2">
                    <span className="block text-slate-400">CONSIGNEE / BUYER:</span>
                    <strong className="block text-slate-900 text-[12px]">Amit Chawla Inc.</strong>
                    <span>Mumbai, Maharashtra India</span>
                  </div>
                  <table className="w-full text-left border-collapse text-[10px] my-3">
                    <thead>
                      <tr className="border-b bg-slate-200">
                        <th className="p-1">ITEM SPECIFICATION</th>
                        <th className="p-1 text-center">QTY</th>
                        <th className="p-1 text-right">UNIT PRICE</th>
                        <th className="p-1 text-right">CGST</th>
                        <th className="p-1 text-right">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-1">Logistics Core Redundant Package Series</td>
                        <td className="p-1 text-center">1</td>
                        <td className="p-1 text-right">₹1,197.00</td>
                        <td className="p-1 text-right">9%</td>
                        <td className="p-1 text-right font-bold">₹1,197.00</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="text-right border-t pt-2 font-black text-slate-900 text-[12px]">
                    NET INTEGRAL MANIFEST VALUE: ₹1,197.00
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModalSim(null)} className="p-2 border rounded text-xs text-slate-600 font-bold px-4">Close View</button>
              <button onClick={() => window.print()} className="p-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-xs px-5">Print Document</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple internal interface for cross close button
function XCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

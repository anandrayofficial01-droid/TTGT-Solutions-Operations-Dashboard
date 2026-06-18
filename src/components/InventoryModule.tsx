import React, { useState } from "react";
import {
  Search,
  Upload,
  AlertTriangle,
  Flame,
  Snowflake,
  TrendingDown,
  ChevronRight,
  Database,
  Grid,
  Info
} from "lucide-react";
import { InventoryItem } from "../types";

interface InventoryModuleProps {
  inventory: InventoryItem[];
  onUploadBulk: (items: any[]) => void;
  onAddSingle: (item: InventoryItem) => void;
}

export default function InventoryModule({ inventory, onUploadBulk, onAddSingle }: InventoryModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [alertFilter, setAlertFilter] = useState("All");

  // Get unique categories
  const categories = Array.from(new Set(inventory.map((item) => item.category)));

  // Alerts calculations
  const lowStockThreshold = 20;
  const lowStockItems = inventory.filter((item) => item.currentStock > 0 && item.currentStock <= lowStockThreshold);
  const outOfStockItems = inventory.filter((item) => item.currentStock === 0);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.storeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;

    let matchesAlert = true;
    if (alertFilter === "Low") matchesAlert = item.currentStock > 0 && item.currentStock <= lowStockThreshold;
    if (alertFilter === "Out") matchesAlert = item.currentStock === 0;

    return matchesSearch && matchesCategory && matchesAlert;
  });

  // Built-in inventory movement history log
  const movementLogs = [
    { sku: "AURA-FE-01", action: "Stock Decreased (Order Deliver)", qty: -1, date: "10 mins ago", node: "Amazon" },
    { sku: "RED-CB-92", action: "Stock Depleted (Low Threshold Alert)", qty: -2, date: "1 hour ago", node: "Amazon" },
    { sku: "ECO-TE-M1", action: "Google Sheets Inventory Sync", qty: +45, date: "4 hours ago", node: "Flipkart" },
    { sku: "NUR-HON-50", action: "Manual Warehousing Intake", qty: +100, date: "1 day ago", node: "Shopify" }
  ];

  // Bulk uploading mockup tool
  const triggerBulkSample = () => {
    const samplePayload = [
      {
        sku: "AURA-FE-99",
        productName: "Premium Rosewater Facial Mist (150ml)",
        category: "Beauty & Cosmetics",
        storeName: "Aura Essentials Shopify",
        currentStock: 150,
        reservedStock: 15,
        costPrice: 190,
        sellingPrice: 550
      },
      {
        sku: "ECO-HD-W2",
        productName: "Bamboo Cotton Unisex Hoodie L - Teal",
        category: "Apparel & Fashion",
        storeName: "EcoThreads Flipkart",
        currentStock: 65,
        reservedStock: 4,
        costPrice: 550,
        sellingPrice: 1599
      },
      {
        sku: "RED-PA-20",
        productName: "Ultra Charge MagSafe Wireless Powerbank",
        category: "Consumer Electronics",
        storeName: "Reddy Electronics Amazon",
        currentStock: 8,
        reservedStock: 1,
        costPrice: 850,
        sellingPrice: 2499
      }
    ];
    onUploadBulk(samplePayload);
    alert("Enterprise Simulator: 3 New Catalog SKUs pushed to operations buffer!");
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Inventory Alerters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {outOfStockItems.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Critical: Out of Stock Warnings ({outOfStockItems.length} SKUs)</p>
              <p className="text-xs mt-1">
                The following catalog segments are completely dry:{" "}
                <span className="font-mono font-bold font-xs">
                  {outOfStockItems.map((i) => i.sku).join(", ")}
                </span>
              </p>
            </div>
          </div>
        )}

        {lowStockItems.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Replenishment Alert ({lowStockItems.length} SKUs)</p>
              <p className="text-xs mt-1">
                The following listings are hovering below the safety threshold of 20 units:{" "}
                <span className="font-mono font-bold">
                  {lowStockItems.map((i) => `${i.sku} (${i.currentStock})`).join(", ")}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-101 dark:border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2 flex-grow max-w-sm bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg px-2.5 py-1.5 focus-within:border-emerald-500/40 transition-colors">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by SKU, Product or Store name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-sm w-full outline-none text-slate-700 dark:text-slate-300"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-101 dark:border-slate-800 rounded-lg text-xs font-semibold px-3 py-2 text-slate-600 dark:text-slate-400 outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={alertFilter}
            onChange={(e) => setAlertFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-101 dark:border-slate-800 rounded-lg text-xs font-semibold px-3 py-2 text-slate-600 dark:text-slate-400 outline-none"
          >
            <option value="All">All Stocks</option>
            <option value="Low">Low Stock Threshold</option>
            <option value="Out">Out of stock only</option>
          </select>

          <button
            onClick={triggerBulkSample}
            className="flex items-center h-8 gap-1.5 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950 px-3 text-xs text-slate-600 dark:text-slate-300 rounded-lg transition-all cursor-pointer font-bold"
          >
            <Upload className="w-3.5 h-3.5" /> Simulation Bulk Upload
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Inventory Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 font-mono uppercase tracking-wider">SKU Core Ledgers</h3>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-500">
                  <th className="p-3">SKU & Product</th>
                  <th className="p-3 text-center">Fulfillment Node</th>
                  <th className="p-3 text-center">On-Hand</th>
                  <th className="p-3 text-center">Available</th>
                  <th className="p-3 text-center">Price Index</th>
                  <th className="p-3 text-center rounded-r">Safety Forecast</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredInventory.map((item) => {
                  const outOfStock = item.currentStock === 0;
                  const lowStock = item.currentStock > 0 && item.currentStock <= lowStockThreshold;
                  
                  // Forecast calculator: Days before completely dry
                  const dailyRunRate = 2.4; // Average hypothetical units consumed
                  const daysBeforeDry = outOfStock ? 0 : Math.round(item.currentStock / dailyRunRate);

                  return (
                    <tr key={item.sku} className="hover:bg-slate-50/20 dark:hover:bg-slate-850/20">
                      <td className="p-3 max-w-[200px]">
                        <div className="font-bold text-slate-800 dark:text-slate-200 font-mono tracking-wide">{item.sku}</div>
                        <div className="text-slate-450 truncate mt-0.5 text-[11px]">{item.productName}</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-[10px] font-mono tracking-wider bg-slate-50 dark:bg-slate-950 p-1.5 rounded text-slate-500">
                          {item.storeName.replace("Store", "")}
                        </span>
                      </td>
                      <td className="p-3 text-center font-semibold text-slate-800 dark:text-slate-200 font-mono">
                        {item.currentStock}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full font-mono font-bold ${
                          outOfStock ? "bg-rose-500/10 text-rose-500" :
                          lowStock ? "bg-amber-500/10 text-amber-500" :
                          "bg-emerald-500/5 text-emerald-500/90"
                        }`}>
                          {item.availableStock} AV
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono">
                        <p className="text-[11px] font-bold">₹{item.sellingPrice}</p>
                        <p className="text-[9px] text-slate-400">Cost: ₹{item.costPrice}</p>
                      </td>
                      <td className="p-3 text-center font-mono">
                        {daysBeforeDry === 0 ? (
                          <span className="text-red-500 font-bold uppercase text-[9px] tracking-wide">OutOfStock</span>
                        ) : daysBeforeDry <= 10 ? (
                          <span className="text-rose-450 font-bold text-[10px]" title="Order Intake urgent">
                            Refill &lt; {daysBeforeDry} days
                          </span>
                        ) : (
                          <span className="text-emerald-500 text-[10px]">
                            Secure ({daysBeforeDry}d)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forecasts & Movers Panels */}
        <div className="space-y-6">
          {/* Movement history */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-101 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850 pb-3">
              <h3 className="text-xs font-extrabold text-slate-400 font-mono tracking-wider uppercase">Movement Stream</h3>
              <Database className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3.5">
              {movementLogs.map((log, idx) => (
                <div key={idx} className="flex items-start justify-between text-xs gap-3 font-sans">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{log.sku}</span>
                    <p className="text-slate-450 text-[11px]">{log.action}</p>
                  </div>
                  <div className="text-right font-mono shrink-0">
                    <span className={`font-bold ${log.qty > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                      {log.qty > 0 ? `+${log.qty}` : log.qty}
                    </span>
                    <p className="text-[9px] text-slate-400">{log.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aging metrics */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-101 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 font-mono tracking-wider uppercase">Friction Analysis Movers</h3>
            
            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-955 rounded-lg border border-slate-100 dark:border-slate-850">
                <p className="text-emerald-500 font-bold flex items-center gap-1 mb-1">
                  <Flame className="w-3.5 h-3.5" /> FASTEST MOVING
                </p>
                <p className="font-bold text-slate-800 dark:text-white truncate">Lavender Facial Serum</p>
                <span className="text-[10px] text-slate-400 font-mono">Turn: 1.8 days/cycle</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-955 rounded-lg border border-slate-101 dark:border-slate-850">
                <p className="text-sky-505 font-bold flex items-center gap-1 mb-1">
                  <Snowflake className="w-3.5 h-3.5" /> SLOWEST AGING
                </p>
                <p className="font-bold text-slate-800 dark:text-white truncate">Garam Masala Spices</p>
                <span className="text-[10px] text-slate-400 font-mono">Age: 45+ days stored</span>
              </div>
            </div>

            {/* Micro visual bar */}
            <div className="space-y-2 pt-2 text-xs">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Stock aging distribution (Units)</span>
              <div className="w-full flex h-3.5 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 font-mono text-[9px] text-white">
                <div className="bg-emerald-500 flex items-center justify-center font-bold" style={{ width: "65%" }}>0-15d (65%)</div>
                <div className="bg-amber-400 flex items-center justify-center font-bold text-slate-900" style={{ width: "20%" }}>15-30d</div>
                <div className="bg-rose-500/80 flex items-center justify-center font-bold" style={{ width: "15%" }}>30d+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

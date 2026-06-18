import React, { useState } from "react";
import {
  Grid,
  List,
  Search,
  Plus,
  Store,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  X,
  Gauge,
  HelpCircle,
  Clock,
  Activity,
  Trash2,
  Edit2
} from "lucide-react";
import { Client, Store as StoreType, StoreStatus } from "../types";

interface StoreModuleProps {
  stores: StoreType[];
  clients: Client[];
  onAddStore: (store: Omit<StoreType, "id">) => void;
  onEditStore: (id: string, store: Partial<StoreType>) => void;
  onDeleteStore: (id: string) => void;
}

export default function StoreModule({ stores, clients, onAddStore, onEditStore, onDeleteStore }: StoreModuleProps) {
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [marketplaceFilter, setMarketplaceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    storeName: "",
    clientName: "",
    marketplace: "Amazon",
    storeId: "",
    launchDate: new Date().toISOString().split("T")[0],
    status: StoreStatus.Active
  });

  const uniqueMarketplaces = ["Amazon", "Shopify", "Flipkart", "Myntra", "eBay", "Nykaa"];

  const filteredStores = stores.filter((s) => {
    const matchesSearch =
      s.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.storeId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMarket = marketplaceFilter === "All" || s.marketplace === marketplaceFilter;
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;

    return matchesSearch && matchesMarket && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStore(formData);
    setFormData({
      storeName: "",
      clientName: clients[0]?.businessName || "",
      marketplace: "Amazon",
      storeId: "",
      launchDate: new Date().toISOString().split("T")[0],
      status: StoreStatus.Active
    });
    setIsAddOpen(false);
  };

  const handleStartEdit = (store: StoreType) => {
    setSelectedStore(store);
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStore) {
      onEditStore(selectedStore.id, selectedStore);
      setIsEditOpen(false);
      setSelectedStore(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 70) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 flex-grow max-w-lg bg-slate-50 dark:bg-slate-950 border border-slate-105 dark:border-slate-800 rounded-lg px-2.5 py-1.5 focus-within:border-emerald-500/40 transition-colors">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search stores by name, linked client or marketplace ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-sm w-full outline-none text-slate-700 dark:text-slate-300"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Marketplace Filter */}
          <select
            value={marketplaceFilter}
            onChange={(e) => setMarketplaceFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-semibold px-3 py-2 text-slate-600 dark:text-slate-400 outline-none"
          >
            <option value="All">All Platforms</option>
            {uniqueMarketplaces.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-semibold px-3 py-2 text-slate-600 dark:text-slate-400 outline-none"
          >
            <option value="All">All Store Status</option>
            <option value="Active">Active Stores</option>
            <option value="Inactive">Inactive Stores</option>
            <option value="Under Review">Under Review</option>
            <option value="Suspended">Suspended Area</option>
          </select>

          {/* View Toggler */}
          <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-950">
            <button
              onClick={() => setViewMode("card")}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                viewMode === "card" ? "bg-white dark:bg-slate-800 text-emerald-500 shadow-sm" : "text-slate-500"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                viewMode === "table" ? "bg-white dark:bg-slate-800 text-emerald-500 shadow-sm" : "text-slate-500"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center h-8 gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-3 text-xs rounded-lg transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Launch Store
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      {viewMode === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-slate-50 dark:bg-slate-855 rounded-lg border border-slate-100 dark:border-slate-800 group-hover:border-emerald-500/20 transition-all font-sans font-bold text-xs text-orange-500 uppercase flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-emerald-500" />
                    {store.marketplace}
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-extrabold ${
                    store.status === StoreStatus.Active ? "bg-emerald-500/10 text-emerald-500" :
                    store.status === StoreStatus.Inactive ? "bg-slate-50 text-slate-500 dark:bg-slate-850" :
                    store.status === StoreStatus.UnderReview ? "bg-yellow-500/10 text-yellow-500" :
                    "bg-rose-500/10 text-rose-500"
                  }`}>
                    {store.status}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-bold text-base dark:text-white group-hover:text-emerald-500 transition-colors truncate">
                    {store.storeName}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mt-1">Client: <strong>{store.clientName}</strong></p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-50 dark:border-slate-850 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">LAUNCH DATE</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{store.launchDate}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">HEALTH RATE</span>
                    <span className={`inline-flex items-center gap-1 font-bold px-1.5 py-0.5 rounded border ${getScoreColor(store.performanceScore)}`}>
                      <Gauge className="w-3 h-3" /> {store.performanceScore}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-850 mt-5 pt-3.5 text-xs">
                <span className="text-slate-400 font-mono text-[10px]">ID: {store.storeId}</span>
                <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100">
                  <button
                    onClick={() => handleStartEdit(store)}
                    className="p-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteStore(store.id)}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-500">
                  <th className="p-4">Store Identity</th>
                  <th className="p-4">Linked Partner name</th>
                  <th className="p-4">Market Platform</th>
                  <th className="p-4">Store ID</th>
                  <th className="p-4">Launch Date</th>
                  <th className="p-4 px-6 text-center">Score</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                {filteredStores.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400">
                      No marketplace stores linked. Ensure you are provisioned.
                    </td>
                  </tr>
                ) : (
                  filteredStores.map((store) => (
                    <tr key={store.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-850/20 transition-colors">
                      <td className="p-4 font-semibold dark:text-white">{store.storeName}</td>
                      <td className="p-4 text-xs text-slate-500 dark:text-slate-400">{store.clientName}</td>
                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-slate-650 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded dark:text-white">
                          {store.marketplace}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-405">{store.storeId}</td>
                      <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-405">{store.launchDate}</td>
                      <td className="p-4 px-6 text-center">
                        <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded border text-xs ${getScoreColor(store.performanceScore)}`}>
                          {store.performanceScore}%
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-extrabold ${
                          store.status === StoreStatus.Active ? "bg-emerald-500/10 text-emerald-500" :
                          store.status === StoreStatus.Inactive ? "bg-slate-100 text-slate-500 dark:bg-slate-850" :
                          store.status === StoreStatus.UnderReview ? "bg-yellow-500/10 text-yellow-500" :
                          "bg-rose-500/10 text-rose-500"
                        }`}>
                          {store.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => handleStartEdit(store)}
                          className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 inline" />
                        </button>
                        <button
                          onClick={() => onDeleteStore(store.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Store Side Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl w-full max-w-md p-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              Provision Seller Store Node
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Store Identifier Name</label>
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  placeholder="e.g. Aura Essentials Amazon Store"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-sm outline-none dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Link Brand Partner</label>
                <select
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-sm outline-none dark:text-white"
                >
                  <option value="">-- Select Client --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.businessName}>
                      {c.businessName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Marketplace Host</label>
                  <select
                    value={formData.marketplace}
                    onChange={(e) => setFormData({ ...formData, marketplace: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-sm outline-none dark:text-white"
                  >
                    {uniqueMarketplaces.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">External Store ID</label>
                  <input
                    type="text"
                    required
                    value={formData.storeId}
                    onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                    placeholder="e.g. AZ-AURA-ESS"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-sm outline-none dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Launch Date</label>
                  <input
                    type="date"
                    required
                    value={formData.launchDate}
                    onChange={(e) => setFormData({ ...formData, launchDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-xs outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Active Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StoreStatus })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-xs outline-none dark:text-white"
                  >
                    <option value="Active">Active Node</option>
                    <option value="Inactive">Inactive Node</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Suspended">Suspended Node</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded animate-fadeIn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-slate-905 text-xs rounded"
                >
                  Link & Deploy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Store Side Modal */}
      {isEditOpen && selectedStore && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl w-full max-w-md p-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              Modify Store Allocation
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Store Name</label>
                <input
                  type="text"
                  required
                  value={selectedStore.storeName}
                  onChange={(e) => setSelectedStore({ ...selectedStore, storeName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-sm outline-none dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Compliance Score</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={selectedStore.performanceScore}
                    onChange={(e) => setSelectedStore({ ...selectedStore, performanceScore: parseInt(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-sm outline-none dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Store Status</label>
                  <select
                    value={selectedStore.status}
                    onChange={(e) => setSelectedStore({ ...selectedStore, status: e.target.value as StoreStatus })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-sm outline-none dark:text-white text-slate-700"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-slate-905 text-xs rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

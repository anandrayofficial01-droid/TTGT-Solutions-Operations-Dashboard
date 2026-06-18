import React, { useState } from "react";
import {
  Search,
  Plus,
  ShieldAlert,
  UserCheck,
  Building2,
  Phone,
  Mail,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  X,
  AlertTriangle
} from "lucide-react";
import { Seller, SellerStatus } from "../types";

interface SellerModuleProps {
  sellers: Seller[];
  onAdd: (seller: Omit<Seller, "id">) => void;
  onEdit: (id: string, seller: Partial<Seller>) => void;
  onDelete: (id: string) => void;
}

export default function SellerModule({ sellers, onAdd, onEdit, onDelete }: SellerModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  // Add Form State
  const [formData, setFormData] = useState({
    sellerName: "",
    companyName: "",
    email: "",
    phone: "",
    status: SellerStatus.Active,
    storeCount: 1
  });

  // Edit Form State
  const [editFormData, setEditFormData] = useState<Seller | null>(null);

  const filteredSellers = sellers.filter((s) => {
    const matchesSearch =
      s.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      joinedDate: new Date().toISOString().split("T")[0]
    });
    setFormData({
      sellerName: "",
      companyName: "",
      email: "",
      phone: "",
      status: SellerStatus.Active,
      storeCount: 1
    });
    setIsAddOpen(false);
  };

  const handleStartEdit = (seller: Seller) => {
    setEditFormData(seller);
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData) {
      onEdit(editFormData.id, editFormData);
      setIsEditOpen(false);
      setEditFormData(null);
    }
  };

  const toggleStatus = (seller: Seller) => {
    const newStatus = seller.status === SellerStatus.Active ? SellerStatus.Suspended : SellerStatus.Active;
    onEdit(seller.id, { status: newStatus });
  };

  // Stats Counters
  const totalCount = sellers.length;
  const activeCount = sellers.filter(s => s.status === SellerStatus.Active).length;
  const suspendedCount = sellers.filter(s => s.status === SellerStatus.Suspended).length;
  const pendingCount = sellers.filter(s => s.status === SellerStatus.Pending).length;

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-1">
          <p className="text-xs text-slate-400 font-mono uppercase tracking-wider font-bold">Total Seller Accounts</p>
          <p className="text-2xl font-extrabold text-slate-800 dark:text-white font-mono">{totalCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-1">
          <p className="text-xs text-emerald-500 font-mono uppercase tracking-wider font-bold">Active Partners</p>
          <p className="text-2xl font-extrabold text-emerald-500 font-mono">{activeCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-1">
          <p className="text-xs text-rose-500 font-mono uppercase tracking-wider font-bold">Suspended Accounts</p>
          <p className="text-2xl font-extrabold text-rose-500 font-mono">{suspendedCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-1">
          <p className="text-xs text-amber-500 font-mono uppercase tracking-wider font-bold">Pending Licences</p>
          <p className="text-2xl font-extrabold text-amber-500 font-mono">{pendingCount}</p>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by seller, company division, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
          >
            <option value="All">All Statuses</option>
            <option value={SellerStatus.Active}>Active Only</option>
            <option value={SellerStatus.Suspended}>Suspended Only</option>
            <option value={SellerStatus.Pending}>Pending Approval</option>
          </select>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 font-bold px-4 py-2.5 rounded-lg text-white text-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Seller Partner
        </button>
      </div>

      {/* Table view */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-55 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850 text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
                <th className="p-4 pl-6">ID & Company</th>
                <th className="p-4">Primary Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Sub-Stores</th>
                <th className="p-4 text-right pr-6">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 font-medium">
                    No seller accounts match your filtration criteria.
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="p-4 pl-6">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                          {seller.sellerName}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 font-mono">
                          <Building2 className="w-3.5 h-3.5 shrink-0" /> {seller.companyName} &bull; ID: {seller.id}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {seller.email}
                        </p>
                        <p className="text-xs text-slate-500 font-mono flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {seller.phone}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider ${
                        seller.status === SellerStatus.Active ? "bg-emerald-500/10 text-emerald-500" :
                        seller.status === SellerStatus.Suspended ? "bg-rose-500/10 text-rose-500" :
                        "bg-amber-500/10 text-amber-500"
                      }`}>
                        {seller.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {seller.joinedDate}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-slate-400" /> {seller.storeCount} Stores
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleStatus(seller)}
                          className={`p-1.5 rounded transition-all cursor-pointer ${
                            seller.status === SellerStatus.Active
                              ? "text-rose-500 hover:bg-rose-500/10"
                              : "text-emerald-500 hover:bg-emerald-500/10"
                          }`}
                          title={seller.status === SellerStatus.Active ? "Suspend Operations" : "Activate Operations"}
                        >
                          {seller.status === SellerStatus.Active ? <ShieldAlert className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleStartEdit(seller)}
                          className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 rounded transition-all cursor-pointer dark:text-white"
                          title="Modify Account Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(seller.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 rounded transition-all cursor-pointer"
                          title="Remove Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl max-w-md w-full shadow-2xl p-6 relative">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">License New Seller Partner</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Seller Contact Name</label>
                <input
                  type="text"
                  required
                  value={formData.sellerName}
                  onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Merchant Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Patel Apparel Ventures"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Primary Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@merchant.com"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Direct Mobile</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 99999 55555"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Initial Store Allotment</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.storeCount}
                    onChange={(e) => setFormData({ ...formData, storeCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as SellerStatus })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                  >
                    <option value={SellerStatus.Active}>Active</option>
                    <option value={SellerStatus.Pending}>Pending Account</option>
                    <option value={SellerStatus.Suspended}>Suspended</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 font-extrabold py-2.5 rounded-lg text-white transition-colors cursor-pointer text-sm"
              >
                Provision License Node
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && editFormData && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl max-w-md w-full shadow-2xl p-6 relative">
            <button
              onClick={() => {
                setIsEditOpen(false);
                setEditFormData(null);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Modify Seller Account: {editFormData.id}</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Seller Contact Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.sellerName}
                  onChange={(e) => setEditFormData({ ...editFormData, sellerName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Merchant Company Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.companyName}
                  onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Primary Email</label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Direct Mobile</label>
                  <input
                    type="text"
                    required
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Store Count</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editFormData.storeCount}
                    onChange={(e) => setEditFormData({ ...editFormData, storeCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Operational Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as SellerStatus })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                  >
                    <option value={SellerStatus.Active}>Active</option>
                    <option value={SellerStatus.Suspended}>Suspended</option>
                    <option value={SellerStatus.Pending}>Pending</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 font-extrabold py-2.5 rounded-lg text-white transition-colors cursor-pointer text-sm"
              >
                Apply Modifications
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Download,
  X,
  Building,
  Mail,
  Phone,
  FileText,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  User,
  ArrowLeft
} from "lucide-react";
import { Client, ClientStatus } from "../types";

interface ClientModuleProps {
  clients: Client[];
  onAdd: (client: Omit<Client, "id">) => void;
  onEdit: (id: string, client: Partial<Client>) => void;
  onDelete: (id: string) => void;
}

export default function ClientModule({ clients, onAdd, onEdit, onDelete }: ClientModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Modal controllers
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Client | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    agreementDate: new Date().toISOString().split("T")[0],
    status: ClientStatus.Active
  });

  // Filters & searches
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // CSV Exporter
  const handleExportCSV = () => {
    const headers = [
      "Client ID",
      "Client Name",
      "Business Name",
      "Phone",
      "Email",
      "GST Number",
      "Address",
      "City",
      "State",
      "Pincode",
      "Agreement Date",
      "Status"
    ];

    const rows = filteredClients.map((c) => [
      c.id,
      c.name,
      c.businessName,
      c.phone,
      c.email,
      c.gstNumber,
      c.address,
      c.city,
      c.state,
      c.pincode,
      c.agreementDate,
      c.status
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((val) => `"${val}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TTGT_Clients_Partners_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    // Reset
    setFormData({
      name: "",
      businessName: "",
      phone: "",
      email: "",
      gstNumber: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      agreementDate: new Date().toISOString().split("T")[0],
      status: ClientStatus.Active
    });
    setIsAddOpen(false);
  };

  const handleStartEdit = (client: Client) => {
    setEditForm(client);
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm) {
      onEdit(editForm.id, editForm);
      setIsEditOpen(false);
      setEditForm(null);
    }
  };

  if (selectedClient) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
          <button
            onClick={() => setSelectedClient(null)}
            className="flex items-center gap-2 hover:text-emerald-500 font-medium text-slate-500 text-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Partners List
          </button>
          
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold tracking-wider ${
              selectedClient.status === ClientStatus.Active ? "bg-emerald-500/10 text-emerald-500" :
              selectedClient.status === ClientStatus.Inactive ? "bg-slate-100 text-slate-500" :
              "bg-rose-500/10 text-rose-500"
            }`}>
              {selectedClient.status}
            </span>
            <button
              onClick={() => handleStartEdit(selectedClient)}
              className="p-1 px-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 font-medium text-xs rounded transition-all cursor-pointer dark:text-white"
            >
              Modify Account
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-slate-55 dark:bg-slate-950/40 p-5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xl mb-4 border border-emerald-500/20 shadow-inner">
              {selectedClient.businessName.substring(0, 2).toUpperCase()}
            </div>
            <h2 className="text-lg font-bold dark:text-white">{selectedClient.businessName}</h2>
            <p className="text-slate-400 text-xs mt-1 font-mono">ID: {selectedClient.id}</p>
            
            <div className="w-full mt-6 space-y-3.5 text-left text-sm pt-4 border-t border-slate-100 dark:border-slate-850">
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <User className="w-4 h-4 text-slate-400" />
                <span>Primary Contact: <strong className="text-slate-800 dark:text-slate-200">{selectedClient.name}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{selectedClient.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{selectedClient.phone}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h3 className="text-md font-bold text-slate-700 dark:text-slate-300">Operational & Licensing Records</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-955 rounded-lg border border-slate-100 dark:border-slate-850">
                <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Taxation Code</p>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-mono font-bold dark:text-white">{selectedClient.gstNumber}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-955 rounded-lg border border-slate-100 dark:border-slate-850">
                <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Contract Agreement Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold dark:text-white">{selectedClient.agreementDate}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-955 rounded-lg border border-slate-100 dark:border-slate-850 space-y-2">
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-0.5">Billing & Node Address</p>
              <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-rose-450 shrink-0 mt-0.5" />
                <div>
                  <p>{selectedClient.address}</p>
                  <p className="font-medium mt-1">{selectedClient.city}, {selectedClient.state} - <span className="font-mono">{selectedClient.pincode}</span></p>
                </div>
              </div>
            </div>

            <div className="border border-slate-100 dark:border-slate-800/80 rounded-xl p-5 bg-gradient-to-r from-emerald-500/5 to-transparent">
              <h4 className="text-xs font-mono font-bold tracking-wider text-emerald-500 uppercase mb-2">Performance Audit Log</h4>
              <p className="text-xs text-slate-500">
                This client Partner represents a high-scale listing capacity. Currently active across Multiple marketplaces with regular catalog sync schedules.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Action bars */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2 flex-grow max-w-md bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg px-2.5 py-1.5 focus-within:border-emerald-500/40 transition-colors">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search core client list by ID, Name or business..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-sm w-full outline-none text-slate-700 dark:text-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-semibold px-3 py-2 text-slate-600 dark:text-slate-400 outline-none"
          >
            <option value="All">All Partner Status</option>
            <option value="Active">Active partners</option>
            <option value="Inactive">Inactive partners</option>
            <option value="Suspended">Suspended partners</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center h-8 gap-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 px-2.5 text-xs text-slate-600 dark:text-slate-300 rounded-lg transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center h-8 gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-3 text-xs rounded-lg transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> New Partner
          </button>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-500">
                <th className="p-4">Partner Details</th>
                <th className="p-4">Business Unit</th>
                <th className="p-4">Gst Compliance</th>
                <th className="p-4">Agreement Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    No partner clients found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-850/20 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold font-mono">
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold dark:text-white">{client.name}</div>
                        <div className="text-xs text-slate-400 font-mono">{client.email}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium dark:text-slate-300">{client.businessName}</span>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400">{client.gstNumber}</td>
                    <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400">{client.agreementDate}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-extrabold ${
                        client.status === ClientStatus.Active ? "bg-emerald-500/10 text-emerald-500" :
                        client.status === ClientStatus.Inactive ? "bg-slate-100 text-slate-500 dark:bg-slate-850" :
                        "bg-rose-500/10 text-rose-500"
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedClient(client)}
                        className="text-xs font-semibold text-emerald-500 hover:underline cursor-pointer"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => handleStartEdit(client)}
                        className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5 inline" />
                      </button>
                      <button
                        onClick={() => onDelete(client.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Archive Partner"
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

      {/* Add Partner Client Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              Add Partner Client
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-sm outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Business / Brand Name</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-sm outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-sm outline-none dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-sm outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1.5">GST Code (15-chars)</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-sm outline-none dark:text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Agreement Date</label>
                  <input
                    type="date"
                    required
                    value={formData.agreementDate}
                    onChange={(e) => setFormData({ ...formData, agreementDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-xs outline-none dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1.5">Mailing Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-sm outline-none dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-xs outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1.5">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-xs outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1.5">Pincode</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-xs outline-none dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-slate-905 text-xs rounded"
                >
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Partner Modal */}
      {isEditOpen && editForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl w-full max-w-lg p-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              Modify Partner details
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Authorized Contact Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-sm outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Business Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.businessName}
                    onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-sm outline-none text-slate-500 cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Phone</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-sm outline-none dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1.5">Primary Email</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-sm outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Partner Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as ClientStatus })}
                    className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-sm outline-none text-slate-705 dark:text-slate-300"
                  >
                    <option value="Active">Active State</option>
                    <option value="Inactive">Inactive State</option>
                    <option value="Suspended">Suspended Area</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">GST Code (Taxation)</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    value={editForm.gstNumber}
                    onChange={(e) => setEditForm({ ...editForm, gstNumber: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-100 dark:border-slate-800 rounded px-3 py-1.5 text-xs outline-none dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-55 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-slate-905 text-xs rounded"
                >
                  Update Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

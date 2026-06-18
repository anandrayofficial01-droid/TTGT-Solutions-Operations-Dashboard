import React from "react";
import {
  LayoutDashboard,
  Users,
  Store,
  Gauge,
  Package,
  ShoppingCart,
  Truck,
  RotateCcw,
  Activity,
  Sparkles,
  RefreshCw,
  FolderOpen,
  UserCheck,
  ShieldAlert,
  Sliders,
  Database
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
}

export default function Sidebar({ activeTab, setActiveTab, userRole }: SidebarProps) {
  const menuItems = [
    { id: "Dashboard", label: "Executive Summary", icon: LayoutDashboard },
    { id: "Clients", label: "Client Partners", icon: Users },
    { id: "Sellers", label: "Seller Partners", icon: Sparkles },
    { id: "Stores", label: "Seller Stores", icon: Store },
    { id: "Inventory", label: "Inventory Master", icon: Package },
    { id: "Orders", label: "Order Control", icon: ShoppingCart },
    { id: "Shipping", label: "Shipping Logistics", icon: Truck },
    { id: "Returns", label: "Returns & RTO", icon: RotateCcw },
    { id: "Client Health", label: "Client Health Index", icon: Gauge },
    { id: "Command Center", label: "Operations Room", icon: Activity, badge: "Live" },
    { id: "Integrations", label: "Sheets & API Sync", icon: Database },
    { id: "Roles", label: "RBAC Controls", icon: UserCheck }
  ];

  // RBAC sidebar permissions and visibility filters
  const getFilteredItems = () => {
    if (userRole === "Super Admin" || userRole === "Operations Manager") {
      return menuItems;
    }
    if (userRole === "Team Leader") {
      // Team Leader: Can configure clients, stores, products, but cannot configure roles
      return menuItems.filter((i) => i.id !== "Roles");
    }
    if (userRole === "Executive") {
      // Executive: view orders, inventory, logistics, returns. Cannot configure Core clients, sellers, or roles.
      return menuItems.filter(
        (i) => i.id !== "Clients" && i.id !== "Sellers" && i.id !== "Roles"
      );
    }
    // ReadOnly / Viewer: cannot configure clients, sellers, stores, or roles. Read-only for everything else.
    return menuItems.filter(
      (i) => i.id !== "Clients" && i.id !== "Sellers" && i.id !== "Stores" && i.id !== "Roles"
    );
  };

  const filteredItems = getFilteredItems();

  return (
    <aside className="w-68 bg-slate-900 border-r border-slate-800 flex flex-col h-screen shrink-0 text-slate-300">
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-wider text-white font-sans flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-900 w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              TTGT
            </span>
            <span className="font-semibold text-sm">Solutions</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider mt-1 uppercase">SaaS Ops Core v3.1</p>
        </div>
      </div>

      {/* Role Profile Badge */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 font-mono text-sm uppercase">
            {userRole.substring(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Access Scope</p>
            <p className="text-sm font-semibold text-slate-200 truncate">{userRole}</p>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-thin">
        <p className="text-[10px] text-slate-600 font-extrabold font-mono tracking-wider uppercase px-2 mb-2">MANAGEMENT SUITE</p>
        
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none ${
                 isActive
                   ? "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500 font-medium"
                   : "hover:bg-slate-800/60 hover:text-white text-slate-400"
               }`}
             >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 items-center ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-mono tracking-widest bg-rose-500 text-white font-extrabold px-1.5 py-0.5 rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Meta */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-col gap-1.5 text-xs text-slate-600 font-mono">
        <p className="flex justify-between">
          <span>Node status</span>
          <span className="text-emerald-400 font-bold">&#x25cf; Online</span>
        </p>
        <p className="text-[10px]">100K+ SKU Load balancer active</p>
      </div>
    </aside>
  );
}

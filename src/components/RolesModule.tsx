import React from "react";
import { ShieldCheck, UserCheck, Eye, ToggleLeft, ToggleRight, Settings, Info, Lock } from "lucide-react";
import { UserRole } from "../types";

interface RolesModuleProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
}

export default function RolesModule({ currentRole, onChangeRole }: RolesModuleProps) {
  const roleCards = [
    {
      role: UserRole.SuperAdmin,
      title: "Super Administrator",
      description: "Complete unrestricted administrative control across all domains, licensing, sync configurations, billing and staff roles.",
      permissions: ["Full Access to Clients", "Modify Financial/License parameters", "Sellers provision and suspend", "Trigger sync nodes", "All standard read-write bounds"],
      badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    },
    {
      role: UserRole.OperationsManager,
      title: "Operations Manager",
      description: "Coordinates seller operations, inventory refuels, courier assignments and RMA approvals. Full access exception for license billing models.",
      permissions: ["Edit Clients (Operational parameters)", "Full Access to Seller Partners", "Inventory refueling & adjustments", "Courier allocations & status overrides"],
      badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    },
    {
      role: UserRole.TeamLeader,
      title: "Operations Team Leader",
      description: "Manages day-to-day warehouse nodes, packet dispatches and store health audits. Prevents role allocations and core client deletions.",
      permissions: ["Add stores and link to clients", "Inventory bulk uploads & modifications", "Update order processing states", "View clients, sellers, and logs"],
      badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    {
      role: UserRole.Executive,
      title: "Fulfillment Executive",
      description: "Triage orders, packaging validation, shipping tracking, delay detection and RMA registrations. No client configuration permissions.",
      permissions: ["Access Order Control Center", "Trigger packet state packing / shipping", "Register returns and RTOs", "Read-only inventory indices"],
      badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20"
    },
    {
      role: UserRole.ReadOnly,
      title: "Read Only Auditor / Viewer",
      description: "External licensing partners, client delegates or observers tracking operational volume without modify permissions.",
      permissions: ["View dashboards & summaries", "Observe cargo logistics & SLAs", "Check inventory counts (Read-only)", "Observe Sheet logs (Strictly sandbox)"],
      badgeColor: "bg-slate-500/10 text-slate-500 border-slate-500/20"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Alert Header */}
      <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-xl shadow-xl flex items-start gap-3.5 select-none animate-fadeIn">
        <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
        <div>
          <h3 className="font-extrabold text-sm tracking-widest font-mono uppercase text-emerald-450 text-emerald-400">
            RBAC Access Control Sandbox Console
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Toggle worker roles in the simulator below to inspect instant view restrictiveness. The navigation sidebar and operations sheets will lock or unlock live.
          </p>
        </div>
      </div>

      {/* Simulator Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roleCards.map((rc) => {
          const isActive = rc.role === currentRole;
          return (
            <div
              key={rc.role}
              onClick={() => onChangeRole(rc.role)}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                isActive
                  ? "bg-slate-900/15 dark:bg-slate-900 border-emerald-500 shadow-lg scale-[1.02]"
                  : "bg-white dark:bg-slate-905 dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 border-slate-100 dark:border-slate-850"
              }`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-extrabold uppercase border ${rc.badgeColor}`}>
                    {rc.role}
                  </span>
                  {isActive ? (
                    <span className="flex items-center gap-1 text-emerald-500 font-bold font-mono text-[10px] uppercase">
                      <UserCheck className="w-4 h-4 animate-bounce" /> Current Actor
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">Simulate</span>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 dark:text-white text-md">{rc.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">{rc.description}</p>
                </div>

                <div className="space-y-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-850">
                  <p className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">Privilege Scope</p>
                  <ul className="space-y-1">
                    {rc.permissions.map((p, idx) => (
                      <li key={idx} className="text-xs text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="truncate">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeRole(rc.role);
                }}
                className={`w-full h-10 mt-5 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-slate-50 dark:bg-slate-950 dark:text-white border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {isActive ? "ACTIVE AUTHORIZATION" : "AUTHENTICATE AS THIS ACTOR"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

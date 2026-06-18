import React, { useState } from "react";
import {
  Settings,
  Shield,
  Palette,
  Clock,
  Briefcase,
  Mail,
  Lock,
  Globe,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Flame,
  FileCheck,
  UserCheck
} from "lucide-react";
import { UserRole } from "../types";

interface SettingsPanelProps {
  companyName: string;
  setCompanyName: (v: string) => void;
  logoText: string;
  setLogoText: (v: string) => void;
}

export default function SettingsPanel({
  companyName,
  setCompanyName,
  logoText,
  setLogoText
}: SettingsPanelProps) {
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");
  const [currency, setCurrency] = useState("INR (₹)");
  const [smtpServer, setSmtpServer] = useState("smtp.ttgtsolutions.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [apiKeyShopify, setApiKeyShopify] = useState("shpat_6720512aba94...");
  const [webhookUrl, setWebhookUrl] = useState("https://delivery-webhook.ttgtsolutions.com/ingress");

  const [notifSuccess, setNotifSuccess] = useState(true);
  const [notifFailed, setNotifFailed] = useState(true);
  const [notifRto, setNotifRto] = useState(false);

  // Simulated Roles permission setup table
  const [roles, setRoles] = useState([
    { role: UserRole.SuperAdmin, permModule: "Full Access All Sites", write: true, delete: true, apiConfig: true },
    { role: UserRole.OperationsManager, permModule: "Orders & Analytics Manage", write: true, delete: false, apiConfig: true },
    { role: UserRole.Executive, permModule: "Status Override & Trace", write: true, delete: false, apiConfig: false },
    { role: UserRole.ReadOnly, permModule: "Restricted View Only Mode", write: false, delete: false, apiConfig: false }
  ]);

  const [saving, setSaving] = useState(false);
  const [saveStamp, setSaveStamp] = useState<string | null>(null);

  const handleSaveAllConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveStamp(null);
    setTimeout(() => {
      setSaving(false);
      setSaveStamp(new Date().toLocaleTimeString());
    }, 1200);
  };

  const handleTogglePerm = (idx: number, prop: "write" | "delete" | "apiConfig") => {
    setRoles(prev => {
      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        [prop]: !copy[idx][prop]
      };
      return copy;
    });
  };

  return (
    <form onSubmit={handleSaveAllConfig} className="space-y-6 select-none animate-[fadeIn_0.1s_ease-out]">
      
      {/* Settings Grid Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-850 dark:text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-500" /> Control Tower Configuration Panel
          </h3>
          <p className="text-xs text-slate-500 mt-1">Configure company metadata, carrier api credentials, webhooks, and secure user permissions.</p>
        </div>
        <div>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 border border-transparent rounded-lg text-xs font-black transition-all cursor-pointer"
          >
            {saving ? "Storing settings..." : "Write Configurations"}
          </button>
        </div>
      </div>

      {saveStamp && (
        <div className="p-3 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-xl text-xs font-mono font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Configurations saved and loaded at {saveStamp}! Synchronized across active data connectors.
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile and general setups (2 sections) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider border-b pb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-500" /> Company Corporate Identity
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-black text-slate-400 uppercase">Registered Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-201 dark:border-slate-800 text-xs p-2 rounded text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-black text-slate-400 uppercase">Logo Short Initials</label>
                <input
                  type="text"
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-201 dark:border-slate-800 text-xs p-2 rounded text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-black text-slate-400 uppercase">Primary Platform Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-201 dark:border-slate-800 text-xs p-2 rounded text-slate-800 dark:text-slate-300 focus:outline-none"
                >
                  <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST - Local Time)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-black text-slate-400 uppercase">Operational Currency Symbol</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-201 dark:border-slate-800 text-xs p-2 rounded text-slate-800 dark:text-slate-300 focus:outline-none"
                >
                  <option value="INR (₹)">Indian Rupee (INR ₹)</option>
                  <option value="USD ($)">United States Dollar (USD $)</option>
                  <option value="EUR (€)">Euro (EUR €)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Secure Webhooks & Outbound SMTP section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider border-b pb-1.5 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-500" /> Outbound Alerts Webhooks & SMTP SMTP Setup
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-mono font-black text-slate-400 uppercase">Alert Postback Destination Webhook URL</label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-201 dark:border-slate-800 text-xs p-2 rounded text-slate-850 dark:text-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-black text-slate-400 uppercase">SMTP Port</label>
                <input
                  type="text"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-201 dark:border-slate-800 text-xs p-2 rounded text-slate-850 dark:text-slate-200"
                />
              </div>

              <div className="space-y-1 md:col-span-3">
                <label className="text-[10px] font-mono font-black text-slate-400 uppercase">SMTP Server Mailhost</label>
                <input
                  type="text"
                  value={smtpServer}
                  onChange={(e) => setSmtpServer(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-201 dark:border-slate-800 text-xs p-2 rounded text-slate-850"
                />
              </div>
            </div>
          </div>

          {/* Secure interactive Permissions Checkbox Matrix */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 font-bold text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5 uppercase font-mono tracking-wide">
              <Shield className="w-4 h-4 text-emerald-500" /> Secure Role-Based Access Control matrix
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 font-mono text-[10px] font-black text-slate-400 tracking-wider">
                  <th className="p-3 pl-4">ROLE LEVEL</th>
                  <th className="p-3 text-center">WRITE OVERRIDE ({roles.filter(r=>r.write).length})</th>
                  <th className="p-3 text-center">PURGE ORDER RECORD ({roles.filter(r=>r.delete).length})</th>
                  <th className="p-3 text-center">API MANAGER CONFIG ({roles.filter(r=>r.apiConfig).length})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {roles.map((item, idx) => (
                  <tr key={item.role} className="hover:bg-slate-55/30">
                    <td className="p-3 pl-4">
                      <span className="font-extrabold text-slate-800 dark:text-white block">{item.role}</span>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{item.permModule}</span>
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.write}
                        onChange={() => handleTogglePerm(idx, "write")}
                        className="w-4 h-4 rounded text-emerald-550 focus:ring-emerald-500 border-slate-320"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.delete}
                        onChange={() => handleTogglePerm(idx, "delete")}
                        className="w-4 h-4 rounded text-emerald-550 focus:ring-emerald-500 border-slate-320"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.apiConfig}
                        onChange={() => handleTogglePerm(idx, "apiConfig")}
                        className="w-4 h-4 rounded text-emerald-555"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column settings details */}
        <div className="space-y-6">
          
          {/* Third party Secure tokens config storage */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-4">
            <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider border-b pb-1.5 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-500" /> Carrier API Integrator Keys
            </h4>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-[10.5px] font-mono text-slate-400 block uppercase">Shopify REST Token key</span>
                <input
                  type="password"
                  value={apiKeyShopify}
                  onChange={(e) => setApiKeyShopify(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-201 dark:border-slate-800 p-2 text-xs rounded font-mono"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10.5px] font-mono text-slate-400 block uppercase">Delhivery Secret signature</span>
                <input
                  type="password"
                  value="delhivery_signature_7302fbc7892b"
                  readOnly
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-201 dark:border-slate-800 p-2 text-xs rounded font-mono"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10.5px] font-mono text-slate-400 block uppercase">Bluedart API key Client ID</span>
                <input
                  type="text"
                  value="BD-CLIENT-AURA-892"
                  readOnly
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-201 dark:border-slate-800 p-2 text-xs rounded font-mono"
                />
              </div>
            </div>
          </div>

          {/* Core System parameters triggers toggling */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-4">
            <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider border-b pb-1.5 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-blue-500" /> Platform Notifications Alerts
            </h4>

            <div className="space-y-2.5 text-xs text-slate-650 dark:text-slate-350 select-none">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifSuccess}
                  onChange={(e) => setNotifSuccess(e.target.checked)}
                  className="rounded text-emerald-500"
                />
                <span>Alert on Synchronization success</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifFailed}
                  onChange={(e) => setNotifFailed(e.target.checked)}
                  className="rounded text-emerald-500"
                />
                <span>Alert on Webhook fail triggers</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifRto}
                  onChange={(e) => setNotifRto(e.target.checked)}
                  className="rounded text-emerald-500"
                />
                <span>Alert on Return Outflow (RTO) Spike</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

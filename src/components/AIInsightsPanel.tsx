import React, { useState, useEffect } from "react";
import {
  Sparkles,
  AlertOctagon,
  TrendingUp,
  PackageCheck,
  RefreshCw,
  Gauge,
  HelpCircle,
  TrendingDown,
  Wand2,
  Info
} from "lucide-react";

interface AIInsightsPanelProps {
  onRefreshTelemetry?: () => void;
}

export default function AIInsightsPanel({ onRefreshTelemetry }: AIInsightsPanelProps) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      setInsights(data);
    } catch (e) {
      console.error("Failed to query AI insights service", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-6">
      {/* Visual Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg select-none">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h3 className="font-extrabold text-sm tracking-wider uppercase font-mono">
              TTGT Solutions AI Ops Engine
            </h3>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Empowered by Gemini 3.5 Flash modeling to scan supply chains, identify high-risk sellers, and maximize seasonal retail holding efficiency.
          </p>
        </div>

        <button
          onClick={fetchInsights}
          disabled={loading}
          className="flex items-center gap-1.5 h-10 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-905 font-black px-4 rounded-lg text-xs transition-all cursor-pointer font-sans"
        >
          <Wand2 className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Synthesizing..." : "Query Live AI Analytics"}
        </button>
      </div>

      {loading ? (
        /* Loading skeletons */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 h-32 rounded-xl p-5">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 w-1/3 rounded"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 w-2/3 rounded mt-4"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 w-1/2 rounded mt-2"></div>
            </div>
          ))}
        </div>
      ) : insights ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Simulation status ribbon */}
          {insights.usingMockBackup && (
            <div className="bg-slate-50 dark:bg-slate-950/65 border border-slate-150 dark:border-slate-850 text-slate-500 rounded-xl px-4 py-2.5 text-xs flex items-center gap-2 select-none">
              <Info className="w-4 h-4 text-emerald-500" />
              <span>
                <strong>Heuristic Engine Safe Active:</strong> Operating under locally optimized business forecasting algorithms. Provide a GEMINI_API_KEY secret to toggle real generative insights.
              </span>
            </div>
          )}

          {/* Main Insights Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Attention Needed Stores */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-mono font-extrabold text-slate-404 uppercase tracking-wider border-b border-slate-50 dark:border-slate-850 pb-2 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-500" /> Channels Requiring Immediate Intervention
              </h4>
              <div className="space-y-4 text-xs font-medium">
                {insights.attentionNeededStores?.map((store: any, idx: number) => (
                  <div key={idx} className="bg-slate-50/50 dark:bg-slate-955 p-4 rounded-xl border border-slate-101 dark:border-slate-850 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-white">{store.name}</span>
                      <span className="text-[10px] font-mono bg-rose-500/10 text-rose-500 font-extrabold px-1.5 py-0.5 rounded">
                        Score: {store.score}/100
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed"><strong>Risk Trigger:</strong> {store.reason}</p>
                    <p className="text-emerald-555 text-[11px] font-semibold leading-relaxed"><strong>Prescription:</strong> {store.action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical General Operational Risks */}
            <div className="bg-white dark:bg-slate-900 border border-slate-101 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-mono font-extrabold text-slate-404 uppercase tracking-wider border-b border-slate-50 dark:border-slate-850 pb-2 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-400" /> Systemic Operational Risk Assessment
              </h4>
              <div className="space-y-4">
                {insights.criticalRisks?.map((risk: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3.5 text-xs bg-slate-50/50 dark:bg-slate-955 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      risk.severity === "critical" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-550"
                    }`}>
                      <AlertOctagon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h5 className="font-bold dark:text-white truncate">{risk.title}</h5>
                      <p className="text-slate-450 leading-relaxed text-[11px]">{risk.description}</p>
                      <p className="text-[11px] leading-relaxed dark:text-slate-300 font-medium"><strong>Mitigation guideline:</strong> {risk.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Restock & Optimization Opportunities */}
            <div className="bg-white dark:bg-slate-900 border border-slate-101 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-mono font-extrabold text-slate-404 uppercase tracking-wider border-b border-slate-50 dark:border-slate-850 pb-2 flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-400" /> Restocking Opportunities & Demand forecasts
              </h4>
              <div className="space-y-4">
                {insights.restockOpportunities?.length === 0 ? (
                  <p className="text-xs text-slate-400 p-4 text-center">No catalog items flagged for stock shortages.</p>
                ) : (
                  insights.restockOpportunities?.map((opp: any, idx: number) => (
                    <div key={idx} className="bg-slate-50/40 dark:bg-slate-955/40 p-4 rounded-xl border border-slate-101 dark:border-slate-850 text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">{opp.sku}</span>
                          <h5 className="font-bold text-slate-800 dark:text-white mt-1.5 truncate max-w-[200px]">{opp.name}</h5>
                        </div>
                        <div className="text-right">
                          <span className="text-rose-500 font-bold">On-Hand: {opp.currentStock}</span>
                          <p className="text-[9px] text-emerald-500 font-bold mt-1">Suggest: +{opp.suggestedRestock} Units</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed"><strong>Forecast trigger:</strong> {opp.reason}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Strategic expansion & savings summaries */}
            <div className="space-y-6">
              {/* Sales expansion growth */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-mono font-extrabold text-slate-404 uppercase tracking-wider border-b border-slate-50 dark:border-slate-850 pb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Strategic Growth Initiatives
                </h4>
                <div className="space-y-3.5 text-xs">
                  {insights.salesGrowthOpportunities?.map((opp: any, idx: number) => (
                    <div key={idx} className="bg-slate-50/50 dark:bg-slate-955/60 p-3.5 rounded-lg border border-slate-100 dark:border-slate-850 flex justify-between items-start gap-4">
                      <div className="space-y-1 min-w-0">
                        <span className="font-bold dark:text-white text-xs truncate block">{opp.title}</span>
                        <p className="text-slate-450 leading-relaxed text-[11px]">{opp.description}</p>
                      </div>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-extrabold ${
                        opp.impact === "high" ? "bg-emerald-500/10 text-emerald-500" : "bg-indigo-500/10 text-indigo-500"
                      }`}>{opp.impact} Impact</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Holding costs optimization */}
              <div className="bg-white dark:bg-slate-900 border border-slate-101 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-mono font-extrabold text-slate-404 uppercase tracking-wider border-b border-slate-50 dark:border-slate-850 pb-2 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-450 text-emerald-500" /> Holding cost reduction suggests
                </h4>
                <div className="space-y-3.5 text-xs">
                  {insights.inventoryOptimization?.map((opt: any, idx: number) => (
                    <div key={idx} className="bg-slate-50/50 dark:bg-slate-955/60 p-3.5 rounded-lg border border-slate-100 dark:border-slate-850 space-y-1.5">
                      <span className="font-bold dark:text-white text-xs block">{opt.title}</span>
                      <p className="text-slate-450 leading-relaxed text-[11px]">{opt.description}</p>
                      <span className="block text-[11px] text-emerald-500 font-bold">{opt.costSavings}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-slate-400">
          No insights generated. Click the Synthesize trigger at top-right to pull current parameters.
        </div>
      )}
    </div>
  );
}

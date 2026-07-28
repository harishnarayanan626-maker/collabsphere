import React, { useState } from 'react';
import { RiskInsightAlert, LowContributionUser } from '../types';

interface RiskInsightsViewProps {
  alerts: RiskInsightAlert[];
  lowContributionUsers: LowContributionUser[];
  onRebalanceWorkload: () => void;
}

export const RiskInsightsView: React.FC<RiskInsightsViewProps> = ({
  alerts,
  lowContributionUsers,
  onRebalanceWorkload,
}) => {
  const [nudgedUsers, setNudgedUsers] = useState<number[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleNudge = (id: number, name: string) => {
    setNudgedUsers((prev) => [...prev, id]);
    setToastMsg(`Nudge notification sent to ${name}!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setToastMsg('Risk Insights Report downloaded successfully!');
      setTimeout(() => setToastMsg(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Risk Insights & Analytics
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Predictive tracking and early warning alerts for academic project success.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRebalanceWorkload}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-indigo-600">auto_fix_high</span>
            <span>Auto-Balance</span>
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-indigo-600 text-white font-medium text-xs rounded-lg shadow-xs hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>{isExporting ? 'Exporting...' : 'Export Risk Report'}</span>
          </button>
        </div>
      </div>

      {/* Top Section: Deadline Risk Cards */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-rose-600">warning</span>
          <span>Deadline Risks</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all border-l-4 border-l-rose-500"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                    {alert.risk_badge}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 text-base">
                    error_outline
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mb-1">{alert.title}</h3>
                <p className="text-xs text-slate-500 font-medium mb-3">{alert.assigned_to_name}</p>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-indigo-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">tips_and_updates</span>
                    Actionable Tip:
                  </span>
                  <p className="leading-relaxed">{alert.actionable_tip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Section: Workload Imbalance & Low Contribution Flags */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Workload Imbalance */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600">scale</span>
              <span>Workload Capacity Distribution</span>
            </h2>
            <span className="text-xs text-slate-400">Live Telemetry</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Alex Chen</span>
                <span className="text-indigo-600">85% Capacity</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Sarah Johnson</span>
                <span className="text-emerald-600">40% Capacity (Underutilized)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Jordan Smith</span>
                <span className="text-rose-600 font-bold">110% Capacity (Overloaded)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Maria Garcia</span>
                <span className="text-indigo-600">65% Capacity</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>

          {/* Smart Recommendation Banner */}
          <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-lg shrink-0">
              <span className="material-symbols-outlined text-lg">smart_toy</span>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-slate-900">Smart Re-balancing Recommendation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reassign 2 tasks from <strong className="text-slate-900">Jordan Smith</strong> to{' '}
                <strong className="text-slate-900">Sarah Johnson</strong> to balance workload and reduce burn-out risk.
              </p>
              <button
                onClick={onRebalanceWorkload}
                className="mt-2 px-3 py-1 bg-indigo-600 text-white text-[11px] font-semibold rounded-md hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Apply Re-balancing Now
              </button>
            </div>
          </div>
        </div>

        {/* Low Contribution Flags */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">person_off</span>
              <span>Low Contribution Flags</span>
            </h2>
            <span className="text-xs text-slate-400">Inactivity Audit</span>
          </div>

          <div className="space-y-3">
            {lowContributionUsers.map((user) => {
              const isNudged = nudgedUsers.includes(user.id);

              return (
                <div
                  key={user.id}
                  className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-slate-900">{user.name}</p>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                          user.risk_level === 'High Risk'
                            ? 'bg-rose-50 text-rose-700 border-rose-100'
                            : user.risk_level === 'Medium Risk'
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {user.risk_level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {user.updates_count} updates • Last login: {user.last_login}
                    </p>
                  </div>

                  <button
                    onClick={() => handleNudge(user.id, user.name)}
                    disabled={isNudged}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      isNudged
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isNudged ? 'Nudged ✓' : 'Send Nudge'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: Predictive Risk Forecast Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600">analytics</span>
              <span>Predictive Milestone Risk Forecast</span>
            </h2>
            <p className="text-xs text-slate-500">
              Machine Learning projected completion risk over upcoming sprint weeks.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full w-fit">
            Overall Health Score: 84%
          </span>
        </div>

        {/* Visual Forecast Chart SVG */}
        <div className="relative h-64 w-full bg-slate-50 rounded-lg p-4 border border-slate-200 flex items-end">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-40">
            <div className="border-b border-slate-200 w-full"></div>
            <div className="border-b border-slate-200 w-full"></div>
            <div className="border-b border-slate-200 w-full"></div>
            <div className="border-b border-slate-200 w-full"></div>
          </div>

          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200">
            <defs>
              <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Area */}
            <path
              d="M 50 150 Q 150 130 250 110 T 450 70 T 650 140 T 750 60 L 750 180 L 50 180 Z"
              fill="url(#riskGrad)"
            />
            {/* Line */}
            <path
              d="M 50 150 Q 150 130 250 110 T 450 70 T 650 140 T 750 60"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2.5"
            />
            {/* Data Points */}
            <circle cx="50" cy="150" r="4.5" fill="#4f46e5" />
            <circle cx="250" cy="110" r="4.5" fill="#4f46e5" />
            <circle cx="450" cy="70" r="5.5" fill="#e11d48" />
            <circle cx="650" cy="140" r="4.5" fill="#4f46e5" />
            <circle cx="750" cy="60" r="5.5" fill="#059669" />
          </svg>

          {/* Week Labels & Tooltip */}
          <div className="absolute inset-x-4 bottom-2 flex justify-between text-[11px] font-medium text-slate-500">
            <span>Wk 1 (Requirements)</span>
            <span>Wk 2 (Database Schema)</span>
            <span className="text-rose-600 font-bold">Wk 4 (API Integration - 78% Risk)</span>
            <span>Wk 6 (Beta Test)</span>
            <span className="text-emerald-600 font-bold">Wk 8 (Final Demo)</span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 z-50">
          <span className="material-symbols-outlined text-emerald-400">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};

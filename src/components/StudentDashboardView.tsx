import React, { useState, useEffect } from 'react';
import { Task, ContributionLog, Team } from '../types';

interface StudentDashboardViewProps {
  tasks: Task[];
  activityLogs: ContributionLog[];
  activeTeam?: Team;
  onNavigateView: (view: 'tasks' | 'team' | 'risks' | 'schema') => void;
}

const CountdownTimer: React.FC<{ targetDeadline?: string }> = ({ targetDeadline = '2026-10-31' }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const calculateTime = () => {
      const targetDate = new Date(`${targetDeadline}T23:59:59`).getTime();
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDeadline]);

  if (timeLeft.isPast) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-xl flex items-center gap-2">
        <span className="material-symbols-outlined text-base">timer_off</span>
        <span className="text-xs font-bold uppercase tracking-wider">Target Deadline Passed</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center gap-3">
      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
        <span className="material-symbols-outlined text-lg">timer</span>
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Target Deadline ({targetDeadline})
        </div>
        <div className="flex items-center gap-1.5 text-slate-900 font-mono font-bold text-xs mt-0.5">
          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700">{String(timeLeft.days).padStart(2, '0')}d</span>
          <span>:</span>
          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700">{String(timeLeft.hours).padStart(2, '0')}h</span>
          <span>:</span>
          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700">{String(timeLeft.minutes).padStart(2, '0')}m</span>
          <span>:</span>
          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}s</span>
        </div>
      </div>
    </div>
  );
};

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  tasks,
  activityLogs,
  activeTeam,
  onNavigateView,
}) => {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sm text-slate-500 mb-1 font-medium">
            <span>Teams</span>
            <span>/</span>
            <span className="text-slate-400">{activeTeam?.team_name || 'Alpha Phoenix'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {activeTeam?.project_subtitle || 'Smart Campus IoT'}{' '}
            <span className="ml-2 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-md uppercase">
              Active
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 italic">
            Faculty Advisor: Dr. Aris Thorne • Target: {activeTeam?.target_deadline || '2026-10-31'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <CountdownTimer targetDeadline={activeTeam?.target_deadline || '2026-10-31'} />

          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-3.5 py-1.5 font-medium text-xs rounded-md transition-colors cursor-pointer ${
                period === 'weekly' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-3.5 py-1.5 font-medium text-xs rounded-md transition-colors cursor-pointer ${
                period === 'monthly' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Active Tasks */}
        <div
          onClick={() => onNavigateView('tasks')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <span className="material-symbols-outlined text-xl">task_alt</span>
            </div>
            <span className="text-emerald-700 text-xs font-semibold flex items-center bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
              +12%
            </span>
          </div>
          <h3 className="font-medium text-xs text-slate-500">Active Tasks</h3>
          <p className="font-bold text-2xl text-slate-900 mt-1">{tasks.length + 19}</p>
        </div>

        {/* At-Risk Tasks */}
        <div
          onClick={() => onNavigateView('risks')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-red-300 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <span className="material-symbols-outlined text-xl">report_problem</span>
            </div>
            <span className="text-red-700 text-xs font-semibold flex items-center bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
              3 High
            </span>
          </div>
          <h3 className="font-medium text-xs text-slate-500">At-Risk Tasks</h3>
          <p className="font-bold text-2xl text-slate-900 mt-1">07</p>
        </div>

        {/* Team Members */}
        <div
          onClick={() => onNavigateView('team')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
              <span className="material-symbols-outlined text-xl">groups</span>
            </div>
          </div>
          <h3 className="font-medium text-xs text-slate-500">Team Members</h3>
          <p className="font-bold text-2xl text-slate-900 mt-1">06</p>
        </div>

        {/* Upcoming Deadlines */}
        <div
          onClick={() => onNavigateView('tasks')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <span className="material-symbols-outlined text-xl">event_upcoming</span>
            </div>
          </div>
          <h3 className="font-medium text-xs text-slate-500">Upcoming Deadlines</h3>
          <p className="font-bold text-2xl text-slate-900 mt-1">03</p>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Workload Distribution Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-slate-900 text-base">
              Workload Distribution
            </h2>
            <button className="text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>

          <div className="space-y-5">
            {/* Alex Chen */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-900 font-semibold">Alex Chen</span>
                <span className="text-slate-500">85% Capacity</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>

            {/* Sarah Johnson */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-900 font-semibold">Sarah Johnson</span>
                <span className="text-slate-500">40% Capacity</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-1000"
                  style={{ width: '40%' }}
                ></div>
              </div>
            </div>

            {/* Jordan Smith */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-900 font-semibold">Jordan Smith</span>
                <span className="text-red-600 font-semibold">110% Capacity (Overloaded)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-1000"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>

            {/* Maria Garcia */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-900 font-semibold">Maria Garcia</span>
                <span className="text-slate-500">65% Capacity</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                  style={{ width: '65%' }}
                ></div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
              <span>Underloaded</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
              <span>Balanced</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <span>Overloaded</span>
            </div>
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-slate-900 text-base">Risk Alerts</h2>
            <button
              onClick={() => onNavigateView('risks')}
              className="text-indigo-600 font-semibold text-xs hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="flex-1 space-y-2.5">
            {/* Task Alert 1 */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-medium text-sm text-slate-900">Database Schema Design</p>
                <p className="text-xs text-slate-500">Owned by Alex</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 text-[10px] font-bold rounded uppercase">
                  High
                </span>
                <p className="text-xs text-red-600 mt-1 font-medium">4 days behind</p>
              </div>
            </div>

            {/* Task Alert 2 */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-medium text-sm text-slate-900">Frontend Auth</p>
                <p className="text-xs text-slate-500">Owned by Jordan</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 border border-yellow-100 text-[10px] font-bold rounded uppercase">
                  Medium
                </span>
                <p className="text-xs text-yellow-700 mt-1 font-medium">2 days behind</p>
              </div>
            </div>

            {/* Task Alert 3 */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-medium text-sm text-slate-900">Unit Testing Suite</p>
                <p className="text-xs text-slate-500">Owned by Sarah</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 text-[10px] font-bold rounded uppercase">
                  Low
                </span>
                <p className="text-xs text-slate-500 mt-1">Pace dropping</p>
              </div>
            </div>
          </div>

          {/* Insight Box */}
          <div className="mt-5 bg-slate-50 p-3.5 rounded-lg flex items-start gap-3 border border-slate-200">
            <div className="bg-indigo-600 p-1.5 rounded-md text-white shrink-0">
              <span className="material-symbols-outlined text-base">lightbulb</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900">Insight:</strong> Task re-assignment for Jordan could resolve 60% of the High-Risk blockers.
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Layout Row: Team Presence & Project Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Presence */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <h2 className="font-bold text-slate-900 text-base mb-4">
            Team Presence
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGqMTnHiOUQ5znSOr_zDSxHMAAQouq43wQTUhco0QA8jkSMfceNieqGS9QOmtE4uoBZv5wLhJ_kwtypR4UITPTYPwrBzoKzF1M0jQImXWDNhh51C4qRlnLMYS7vOdHijK-KrwIdDQ2xdP6kKTyJI7ubYYmSRWkXAiIQFT3wPO1BQwykY13CGUmWoqFOoM9N-VUByQu6a787fYfPhgn0j7ILi5WgFn43u5vp5A6monS8ru8BWAF5XTeEMIdjfuLfubnoK1dwmtQiDGJ"
                  alt="Alex Chen"
                  className="w-9 h-9 rounded-full border border-slate-200 object-cover"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900">Alex Chen</p>
                <p className="text-[11px] text-slate-500">Editing Schema</p>
              </div>
            </div>

            <div className="flex items-center gap-3 opacity-60">
              <div className="relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCYd9K34eDiJARnmPPnCufamTIMRWAQPthbR_beGkxNDqGEQtj4GjnXmSVM2IGDmVEBzmLBF7DymSsXaBtgV_f_CYCdoz9V34Fqf9hZ49C8xSOsSuuBbx2g-2j3czd9nN1PN-gWcp6goJMkkyktQ-dEmg-dxMN3qeiVHe54B3dDQiMGHxCIgf8KT0UXaCa7DJ0fBcD4YPrhO_TkkUxdkILzWkDOqJHhSHPdD-qszgBpLnMtkSZW_PQxLOoomTGG21kd7x3neO12jKY"
                  alt="Sarah Johnson"
                  className="w-9 h-9 rounded-full border border-slate-200 object-cover"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-slate-300 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900">Sarah Johnson</p>
                <p className="text-[11px] text-slate-500">Offline</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKAAw-tUkVwD-o1X0SM5voGvH4w1P9oEgA-61Xrr_BQHzaF6eYSYGhdl5CuJJZS0zdxRVy45Sjv-MiA655blY--nGOYesdaRPZDJWktFIg8jeWCtZMAOV4mKi_ZzOD1oURaPaElz6vfJQ1ndX6RMds8HL_5e1ZCJUif8vZ7YIzME3J-jf1H5mwv5MkGwB7tRzmZWLInQBL9SR25tNqYBsmisaSj-sRoEdw5_3I-wzRaG8e8faUyvgvCRMRYdEarVmKcHeEbVAew9Bc"
                  alt="Jordan Smith"
                  className="w-9 h-9 rounded-full border border-slate-200 object-cover"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900">Jordan Smith</p>
                <p className="text-[11px] text-slate-500">In a meeting</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateView('team')}
            className="w-full mt-6 py-2 border border-slate-200 font-medium text-xs text-slate-700 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Manage Team
          </button>
        </div>

        {/* Project Activity Log */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <h2 className="font-bold text-slate-900 text-base mb-4">
            Contribution Log
          </h2>
          <div className="relative border-l border-slate-100 ml-2 pl-6 space-y-6 overflow-y-auto max-h-[300px] pr-2 no-scrollbar">
            {activityLogs.map((log) => (
              <div key={log.id} className="relative">
                <div className="absolute -left-[29px] top-1 w-2 h-2 rounded-full bg-indigo-600 outline outline-4 outline-white"></div>
                <p className="text-xs font-bold text-slate-900">
                  {log.student_name} <span className="font-normal text-slate-500">{log.action_type}</span>
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">{log.details}</p>
                <p className="text-[9px] text-slate-400 uppercase mt-1">{log.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

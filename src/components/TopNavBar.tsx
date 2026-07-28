import React from 'react';
import { AppView, UserRole } from '../types';

interface TopNavBarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNewProject: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentView,
  setCurrentView,
  userRole,
  setUserRole,
  searchQuery,
  setSearchQuery,
}) => {
  const [unreadCount, setUnreadCount] = React.useState(3);
  const [showNotifications, setShowNotifications] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-8 h-16 bg-white border-b border-slate-200">
      {/* Brand & Workspace Links */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-3 text-left focus:outline-hidden group cursor-pointer"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              hub
            </span>
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">
            CollabSphere
          </span>
        </button>

        {/* Top Navbar quick navigation links */}
        <div className="hidden lg:flex items-center ml-6 gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`hover:text-slate-900 transition-colors py-1 ${
              currentView === 'dashboard' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
            }`}
          >
            Workspace
          </button>
          <button
            onClick={() => setCurrentView('team')}
            className={`hover:text-slate-900 transition-colors py-1 ${
              currentView === 'team' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
            }`}
          >
            Teams
          </button>
          <button
            onClick={() => setCurrentView('risks')}
            className={`hover:text-slate-900 transition-colors py-1 ${
              currentView === 'risks' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setCurrentView('schema')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all border border-indigo-100 cursor-pointer`}
          >
            <span className="material-symbols-outlined text-[14px]">database</span>
            MySQL Schema
          </button>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, tasks, schema..."
            className="w-full bg-slate-100 border-none rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder-slate-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Toggle Switch */}
        <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setUserRole('Student')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              userRole === 'Student' ? 'bg-white text-indigo-600 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setUserRole('Faculty')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              userRole === 'Faculty' ? 'bg-white text-indigo-600 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Faculty
          </button>
        </div>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50 text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-sm text-slate-900">Notifications ({unreadCount})</span>
                <button
                  onClick={() => {
                    setUnreadCount(0);
                    setShowNotifications(false);
                  }}
                  className="text-indigo-600 font-medium hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                <div className="p-2.5 bg-red-50/50 rounded-lg border-l-2 border-red-500 text-slate-700">
                  <p className="font-semibold text-slate-900">Risk Flag Raised</p>
                  <p className="text-slate-600 mt-0.5">Database Schema Design is 4 days behind schedule.</p>
                  <span className="text-[10px] text-slate-400">10 mins ago</span>
                </div>
                <div className="p-2.5 bg-indigo-50/50 rounded-lg border-l-2 border-indigo-600 text-slate-700">
                  <p className="font-semibold text-slate-900">New Member Invited</p>
                  <p className="text-slate-600 mt-0.5">Alex Rivera accepted invite to Alpha Phoenix.</p>
                  <span className="text-[10px] text-slate-400">1 hour ago</span>
                </div>
                <div className="p-2.5 bg-emerald-50/50 rounded-lg border-l-2 border-emerald-600 text-slate-700">
                  <p className="font-semibold text-slate-900">SQL Schema Export</p>
                  <p className="text-slate-600 mt-0.5">MySQL DDL updated with foreign keys and indexes.</p>
                  <span className="text-[10px] text-slate-400">2 hours ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar / Logout */}
        <div
          onClick={() => setCurrentView('login')}
          className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-slate-100 transition-colors"
          title="Switch User / Login"
        >
          <img
            src={
              userRole === 'Faculty'
                ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuATFXzGbqPKIvSZ4B3CmCx2kiFqGJzJRt4u2kctwAkDFqDkEwp0DWsFPzGgg4hh2Pb5_IArqzDupMmKsXEgXhsNFHm6XpJJSyqIQYFdX0hJC3Zzy7TkYCji9pUhVltJP8vBZeAvEcNwOogeXLbkmXCx-bmHk3X_iAqo51JnJoNJFLknyoo_XxiLhHwgYrdqKtUJVXpIWlsqtrBsWJ-A5wfMB_2tn2oeA3k5_1cEfRsLLUPvCbdGTNGe3xNA4QIR-PLJ9kh9K7-VEpuP'
                : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcBssw-hikusgkYeIawyYKIG_YdNJj9dHUF3SJXfd2pwzpsfjTLp01EWVjznYNffwmyHUzkBd_1HnpAt1LcuhDgS-CZGZ221i9Y89HT7FqDlbUBg_TH_tCdscVb0M6-hFyxPLB4rkmEVinKx6WFXrLksBvuT0nLAfoGsF9JnP8hBdKMfXEqSX5i9cWcyoP5Ls26C-94_HBndF5msim_LMQziPGa67dVYCmvLSIWCPPj0c4URILHonCwC5ynFWe45aKe3cwoHlZLrEF'
            }
            alt="User profile"
            className="w-8 h-8 rounded-full border border-slate-200 object-cover"
          />
        </div>
      </div>
    </header>
  );
};

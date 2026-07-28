import React from 'react';
import { AppView, UserRole } from '../types';

interface SideNavBarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  userRole: UserRole;
  onOpenNewProject: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  currentView,
  setCurrentView,
  userRole,
  onOpenNewProject,
}) => {
  const navItems = [
    {
      id: 'dashboard' as AppView,
      label: 'Dashboard',
      icon: 'dashboard',
    },
    {
      id: 'tasks' as AppView,
      label: 'Task Board',
      icon: 'assignment',
    },
    {
      id: 'team' as AppView,
      label: 'My Teams',
      icon: 'group',
    },
    {
      id: 'risks' as AppView,
      label: 'Risk Insights',
      icon: 'warning',
    },
    {
      id: 'faculty' as AppView,
      label: 'Faculty Overview',
      icon: 'school',
      roleBadge: userRole === 'Faculty' ? 'Active' : undefined,
    },
    {
      id: 'schema' as AppView,
      label: 'MySQL Schema',
      icon: 'database',
      isSpecial: true,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full pt-20 pb-6 px-5 flex flex-col gap-6 bg-white border-r border-slate-200 w-64 z-40 hidden md:flex shrink-0">
      {/* Menu Header / Section Label */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
          Main Menu
        </h3>
        
        {/* Primary Navigation Menu */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.isSpecial && (
                  <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                    SQL
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role Indicator Info */}
      <div className="mt-auto px-3.5 py-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium">Active Mode:</span>
          <span className="font-semibold text-indigo-600">{userRole}</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          {userRole === 'Faculty'
            ? 'Read-only inspection & faculty advisory tools enabled.'
            : 'Student mode active: update tasks, manage deliverables & collaborate.'}
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={onOpenNewProject}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        <span>New Project</span>
      </button>
    </aside>
  );
};

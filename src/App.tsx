import React, { useState } from 'react';
import { AppView, UserRole, Task, Student, Team, RiskInsightAlert, LowContributionUser, ContributionLog } from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEAMS,
  INITIAL_FACULTY,
  INITIAL_TASKS,
  INITIAL_RISK_ALERTS,
  LOW_CONTRIBUTION_USERS,
  INITIAL_ACTIVITY_LOGS,
} from './data/mockData';

import { TopNavBar } from './components/TopNavBar';
import { SideNavBar } from './components/SideNavBar';
import { AuthScreen } from './components/AuthScreen';
import { StudentDashboardView } from './components/StudentDashboardView';
import { TaskBoardView } from './components/TaskBoardView';
import { TeamFormationView } from './components/TeamFormationView';
import { RiskInsightsView } from './components/RiskInsightsView';
import { FacultyOverviewView } from './components/FacultyOverviewView';
import { MySQLSchemaView } from './components/MySQLSchemaView';
import { NewProjectModal } from './components/NewProjectModal';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('Student');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // App State
  const [students] = useState<Student[]>(INITIAL_STUDENTS);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [riskAlerts] = useState<RiskInsightAlert[]>(INITIAL_RISK_ALERTS);
  const [lowContribUsers] = useState<LowContributionUser[]>(LOW_CONTRIBUTION_USERS);
  const [activityLogs, setActivityLogs] = useState<ContributionLog[]>(INITIAL_ACTIVITY_LOGS);

  // Auth Handle
  const handleLoginSuccess = (role: UserRole) => {
    setUserRole(role);
    if (role === 'Faculty') {
      setCurrentView('faculty');
    } else {
      setCurrentView('dashboard');
    }
  };

  // Add Task
  const handleAddTask = (
    newTaskData: Omit<Task, 'id' | 'created_date' | 'ideal_progress_pct' | 'actual_progress_pct'>
  ) => {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now(),
      created_date: new Date().toISOString().split('T')[0],
      ideal_progress_pct: 100,
      actual_progress_pct: 0,
    };

    setTasks((prev) => [newTask, ...prev]);

    // Log contribution
    const newLog: ContributionLog = {
      id: Date.now(),
      student_id: 0,
      student_name: newTaskData.assigned_name || 'Student',
      project_id: 1,
      action_type: 'created task',
      details: `Created task "${newTask.title}" assigned to ${newTask.assigned_name}.`,
      timestamp: 'JUST NOW',
      badge_color: 'bg-primary',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Update Task Status
  const handleUpdateTaskStatus = (taskId: number, newStatus: 'To Do' | 'In Progress' | 'Done') => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  // Update Task Progress Percentage
  const handleUpdateTaskProgress = (taskId: number, newProgressPct: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const history = t.progress_history
            ? [...t.progress_history]
            : [
                { date: 'Start', progress: 0 },
                { date: 'Initial', progress: t.actual_progress_pct },
              ];
          history.push({
            date: `Rev ${history.length + 1}`,
            progress: newProgressPct,
          });
          return {
            ...t,
            actual_progress_pct: newProgressPct,
            progress_history: history,
          };
        }
        return t;
      })
    );
  };

  // Attach External Link to Task
  const handleAttachTaskUrl = (taskId: number, label: string, url: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const existing = t.external_urls || [];
          return {
            ...t,
            external_urls: [...existing, { label, url }],
          };
        }
        return t;
      })
    );
  };

  // Invite Student to Team
  const handleInviteStudent = (student: Student) => {
    const newLog: ContributionLog = {
      id: Date.now(),
      student_id: student.id,
      student_name: 'Harish Narayanan',
      project_id: 1,
      action_type: 'invited team member',
      details: `Sent invitation to ${student.name} (${student.skills.slice(0, 2).join(', ')}).`,
      timestamp: 'JUST NOW',
      badge_color: 'bg-secondary',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Auto-Balance Workload
  const handleRebalanceWorkload = () => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.assigned_name === 'Jordan Smith' && t.status === 'To Do') {
          return {
            ...t,
            assigned_name: 'Sarah Johnson',
            assigned_avatar:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuBCYd9K34eDiJARnmPPnCufamTIMRWAQPthbR_beGkxNDqGEQtj4GjnXmSVM2IGDmVEBzmLBF7DymSsXaBtgV_f_CYCdoz9V34Fqf9hZ49C8xSOsSuuBbx2g-2j3czd9nN1PN-gWcp6goJMkkyktQ-dEmg-dxMN3qeiVHe54B3dDQiMGHxCIgf8KT0UXaCa7DJ0fBcD4YPrhO_TkkUxdkILzWkDOqJHhSHPdD-qszgBpLnMtkSZW_PQxLOoomTGG21kd7x3neO12jKY',
            risk_level: 'On Track',
          };
        }
        return t;
      })
    );
  };

  // Create New Team
  const handleCreateTeam = (teamName: string, projectTitle: string, targetDeadline?: string) => {
    const newTeam: Team = {
      id: Date.now(),
      team_name: teamName,
      project_subtitle: projectTitle,
      target_deadline: targetDeadline || '2026-11-15',
      progress_pct: 10,
      high_risks_count: 0,
      med_risks_count: 0,
      team_size: 1,
      next_milestone: 'Project Kickoff',
      sprint_velocity: '0 pts/wk',
      member_ids: [0],
    };
    setTeams((prev) => [newTeam, ...prev]);
  };

  // If in Login mode
  if (currentView === 'login') {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#141b2b] flex flex-col font-['Inter',sans-serif]">
      {/* Top Navbar */}
      <TopNavBar
        currentView={currentView}
        setCurrentView={setCurrentView}
        userRole={userRole}
        setUserRole={setUserRole}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
      />

      <div className="flex flex-1 pt-16">
        {/* Left Sidebar (Desktop) */}
        <SideNavBar
          currentView={currentView}
          setCurrentView={setCurrentView}
          userRole={userRole}
          onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        />

        {/* Main Content View Container */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 pb-20 md:pb-12 max-w-7xl mx-auto w-full transition-all">
          {currentView === 'dashboard' && (
            <StudentDashboardView
              tasks={tasks}
              activityLogs={activityLogs}
              onNavigateView={setCurrentView}
              activeTeam={teams[0]}
            />
          )}

          {currentView === 'tasks' && (
            <TaskBoardView
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onUpdateTaskProgress={handleUpdateTaskProgress}
              onAttachUrl={handleAttachTaskUrl}
              searchQuery={searchQuery}
            />
          )}

          {currentView === 'team' && (
            <TeamFormationView
              students={students}
              onInviteStudent={handleInviteStudent}
            />
          )}

          {currentView === 'risks' && (
            <RiskInsightsView
              alerts={riskAlerts}
              lowContributionUsers={lowContribUsers}
              onRebalanceWorkload={handleRebalanceWorkload}
            />
          )}

          {currentView === 'faculty' && (
            <FacultyOverviewView
              teams={teams}
              faculty={INITIAL_FACULTY[0]}
            />
          )}

          {currentView === 'schema' && <MySQLSchemaView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[#c7c4d8] flex items-center justify-around py-2 px-1 z-50 text-[10px] font-semibold text-[#464555]">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center gap-0.5 ${
            currentView === 'dashboard' ? 'text-[#3525cd]' : ''
          }`}
        >
          <span className="material-symbols-outlined text-lg">dashboard</span>
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentView('tasks')}
          className={`flex flex-col items-center gap-0.5 ${
            currentView === 'tasks' ? 'text-[#3525cd]' : ''
          }`}
        >
          <span className="material-symbols-outlined text-lg">assignment</span>
          <span>Tasks</span>
        </button>

        <button
          onClick={() => setCurrentView('team')}
          className={`flex flex-col items-center gap-0.5 ${
            currentView === 'team' ? 'text-[#3525cd]' : ''
          }`}
        >
          <span className="material-symbols-outlined text-lg">group</span>
          <span>Team</span>
        </button>

        <button
          onClick={() => setCurrentView('risks')}
          className={`flex flex-col items-center gap-0.5 ${
            currentView === 'risks' ? 'text-[#3525cd]' : ''
          }`}
        >
          <span className="material-symbols-outlined text-lg">warning</span>
          <span>Risks</span>
        </button>

        <button
          onClick={() => setCurrentView('schema')}
          className={`flex flex-col items-center gap-0.5 text-[#3525cd] font-bold`}
        >
          <span className="material-symbols-outlined text-lg">database</span>
          <span>MySQL</span>
        </button>
      </div>

      {/* Initialize New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreateTeam={handleCreateTeam}
      />
    </div>
  );
}

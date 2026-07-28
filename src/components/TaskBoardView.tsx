import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, YAxis, Tooltip } from 'recharts';
import { Task } from '../types';

interface TaskBoardViewProps {
  tasks: Task[];
  onAddTask: (newTask: Omit<Task, 'id' | 'created_date' | 'ideal_progress_pct' | 'actual_progress_pct'>) => void;
  onUpdateTaskStatus: (taskId: number, newStatus: 'To Do' | 'In Progress' | 'Done') => void;
  onUpdateTaskProgress?: (taskId: number, newProgressPct: number) => void;
  onAttachUrl?: (taskId: number, label: string, url: string) => void;
  searchQuery: string;
}

interface TaskCardProps {
  task: Task;
  allTasks: Task[];
  onUpdateTaskStatus: (taskId: number, newStatus: 'To Do' | 'In Progress' | 'Done') => void;
  onUpdateTaskProgress?: (taskId: number, newProgressPct: number) => void;
  onAttachUrl?: (taskId: number, label: string, url: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  allTasks,
  onUpdateTaskStatus,
  onUpdateTaskProgress,
  onAttachUrl,
}) => {
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [linkLabel, setLinkLabel] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const handleAddLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkLabel.trim() || !linkUrl.trim()) return;
    if (onAttachUrl) {
      onAttachUrl(task.id, linkLabel.trim(), linkUrl.trim());
    }
    setLinkLabel('');
    setLinkUrl('');
    setIsAddingLink(false);
  };

  const parentTask = task.depends_on_task_id
    ? allTasks.find((t) => t.id === task.depends_on_task_id)
    : null;
  const isBlocked = parentTask ? parentTask.status !== 'Done' : false;

  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-all group border-l-4 ${
        task.priority === 'High'
          ? 'border-l-red-500'
          : task.priority === 'Medium'
          ? 'border-l-amber-500'
          : 'border-l-emerald-500'
      }`}
    >
      {/* Top Badge & Action Row */}
      <div className="flex justify-between items-start mb-2 gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`font-semibold text-[10px] uppercase px-2 py-0.5 rounded border tracking-wide ${
              task.risk_level === 'High Risk'
                ? 'bg-red-50 text-red-700 border-red-100'
                : task.risk_level === 'Medium Risk'
                ? 'bg-amber-50 text-amber-700 border-amber-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-100'
            }`}
          >
            {task.risk_level}
          </span>

          {/* Estimated Hours Badge */}
          {task.estimated_hours !== undefined && task.estimated_hours > 0 && (
            <span
              className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
              title="Estimated Work Hours"
            >
              <span className="material-symbols-outlined text-xs text-indigo-500">schedule</span>
              <span>{task.estimated_hours}h est.</span>
            </span>
          )}
        </div>

        {/* Quick Column Transfer Action */}
        <div className="flex items-center gap-1 text-xs shrink-0">
          {task.status !== 'To Do' && (
            <button
              onClick={() => onUpdateTaskStatus(task.id, task.status === 'Done' ? 'In Progress' : 'To Do')}
              className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 cursor-pointer"
              title="Move backward"
            >
              ←
            </button>
          )}
          {task.status !== 'Done' && (
            <button
              onClick={() => onUpdateTaskStatus(task.id, task.status === 'To Do' ? 'In Progress' : 'Done')}
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 cursor-pointer flex items-center gap-0.5"
              title="Move forward"
            >
              <span>{task.status === 'To Do' ? 'Start' : 'Done'}</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>

      {/* Task Title & Description */}
      <h4 className={`font-bold text-sm mb-1 ${task.status === 'Done' ? 'line-through text-slate-400' : 'text-slate-900 group-hover:text-indigo-600 transition-colors'}`}>
        {task.title}
      </h4>
      <p className="text-xs text-slate-600 line-clamp-2 mb-2 leading-relaxed">
        {task.description}
      </p>

      {/* Prerequisite / Task Dependency Visual Indicator */}
      {parentTask && (
        <div
          className={`my-2 p-2 rounded-lg text-[11px] border flex items-center justify-between transition-colors ${
            isBlocked
              ? 'bg-amber-50/90 text-amber-900 border-amber-200'
              : 'bg-emerald-50/90 text-emerald-900 border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0 pr-2">
            <span className="material-symbols-outlined text-sm shrink-0">
              {isBlocked ? 'lock' : 'check_circle'}
            </span>
            <div className="truncate">
              <span className="text-[9px] uppercase font-bold tracking-wider opacity-80 block">
                {isBlocked ? 'Prerequisite Blocked' : 'Prerequisite Met'}
              </span>
              <span className="font-semibold truncate block">Task #{parentTask.id}: {parentTask.title}</span>
            </div>
          </div>
          <span
            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0 uppercase ${
              isBlocked ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
            }`}
          >
            {parentTask.status}
          </span>
        </div>
      )}

      {/* Actual Progress Slider */}
      <div className="my-2.5 p-2 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
        <div className="flex justify-between items-center text-[11px] font-semibold">
          <span className="text-slate-500">Actual Progress</span>
          <span
            className={`font-mono text-[11px] ${
              task.actual_progress_pct >= 100 ? 'text-emerald-700 font-bold' : 'text-indigo-600 font-bold'
            }`}
          >
            {task.actual_progress_pct}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={task.actual_progress_pct}
          onChange={(e) => onUpdateTaskProgress && onUpdateTaskProgress(task.id, Number(e.target.value))}
          className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
        />
      </div>

      {/* Sparkline Progress History Chart (Recharts) */}
      <div className="my-2 bg-slate-50/80 p-2 rounded-lg border border-slate-100">
        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mb-1">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px] text-indigo-500">show_chart</span>
            Historical Progression
          </span>
          <span className="text-slate-400 text-[9px] font-normal font-mono">
            {task.progress_history ? `${task.progress_history.length} updates` : 'Sparkline'}
          </span>
        </div>
        <div className="h-8 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={
                task.progress_history && task.progress_history.length > 0
                  ? task.progress_history
                  : [
                      { date: 'Start', progress: 0 },
                      { date: 'Current', progress: task.actual_progress_pct },
                    ]
              }
              margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
            >
              <YAxis domain={[0, 100]} hide />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow-xs font-mono">
                        {payload[0].payload.date}: {payload[0].value}%
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 2, fill: '#4f46e5', strokeWidth: 1, stroke: '#ffffff' }}
                activeDot={{ r: 3.5, fill: '#4f46e5' }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attached External Links */}
      <div className="mt-2 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Attached Resources ({task.external_urls?.length || 0})
          </span>
          <button
            type="button"
            onClick={() => setIsAddingLink(!isAddingLink)}
            className="text-[10px] text-indigo-600 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">add_link</span>
            <span>Attach Link</span>
          </button>
        </div>

        {task.external_urls && task.external_urls.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {task.external_urls.map((link, idx) => (
              <a
                key={idx}
                href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-indigo-200/80 transition-colors shadow-2xs group/link"
                title={link.url}
              >
                <span className="material-symbols-outlined text-xs text-indigo-500 group-hover/link:scale-110 transition-transform">
                  {link.url.includes('github') ? 'code' : link.url.includes('google') ? 'description' : 'link'}
                </span>
                <span className="truncate max-w-[120px]">{link.label}</span>
                <span className="material-symbols-outlined text-[10px] text-indigo-400">open_in_new</span>
              </a>
            ))}
          </div>
        )}

        {/* Inline Add External Link Form */}
        {isAddingLink && (
          <form onSubmit={handleAddLinkSubmit} className="p-2 bg-indigo-50/70 border border-indigo-200 rounded-lg space-y-2 text-xs">
            <input
              type="text"
              placeholder="Label (e.g., Google Doc, GitHub Repo)"
              required
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="URL (e.g., https://docs.google.com/...)"
              required
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
            <div className="flex justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingLink(false)}
                className="px-2 py-0.5 text-[10px] bg-slate-200 text-slate-700 rounded hover:bg-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-2 py-0.5 text-[10px] bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 cursor-pointer"
              >
                Save Link
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
        <div className="flex items-center gap-2">
          <img
            src={task.assigned_avatar}
            alt={task.assigned_name}
            className="w-6 h-6 rounded-full border border-slate-200 object-cover"
          />
          <span className="text-[11px] font-medium text-slate-600">{task.assigned_name}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400 text-[11px] font-medium">
          <span className="material-symbols-outlined text-xs">calendar_today</span>
          <span>{task.due_date}</span>
        </div>
      </div>
    </div>
  );
};

export const TaskBoardView: React.FC<TaskBoardViewProps> = ({
  tasks,
  onAddTask,
  onUpdateTaskStatus,
  onUpdateTaskProgress,
  onAttachUrl,
  searchQuery,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAssigneeName, setNewAssigneeName] = useState('Alex Chen');
  const [newDueDate, setNewDueDate] = useState('2024-10-25');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newEstimatedHours, setNewEstimatedHours] = useState<number>(12);
  const [newDependsOnTaskId, setNewDependsOnTaskId] = useState<string>('');
  const [newExternalUrlLabel, setNewExternalUrlLabel] = useState<string>('');
  const [newExternalUrl, setNewExternalUrl] = useState<string>('');

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todoTasks = filteredTasks.filter((t) => t.status === 'To Do');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'In Progress');
  const doneTasks = filteredTasks.filter((t) => t.status === 'Done');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      project_id: 1,
      title: newTitle,
      description: newDescription || 'No description provided.',
      assigned_to: 1,
      assigned_name: newAssigneeName,
      assigned_avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAGqMTnHiOUQ5znSOr_zDSxHMAAQouq43wQTUhco0QA8jkSMfceNieqGS9QOmtE4uoBZv5wLhJ_kwtypR4UITPTYPwrBzoKzF1M0jQImXWDNhh51C4qRlnLMYS7vOdHijK-KrwIdDQ2xdP6kKTyJI7ubYYmSRWkXAiIQFT3wPO1BQwykY13CGUmWoqFOoM9N-VUByQu6a787fYfPhgn0j7ILi5WgFn43u5vp5A6monS8ru8BWAF5XTeEMIdjfuLfubnoK1dwmtQiDGJ',
      status: 'To Do',
      priority: newPriority,
      risk_level: newPriority === 'High' ? 'High Risk' : 'On Track',
      due_date: newDueDate,
      category_tag: 'NEW',
      estimated_hours: Number(newEstimatedHours) || 8,
      depends_on_task_id: newDependsOnTaskId ? Number(newDependsOnTaskId) : undefined,
      external_urls:
        newExternalUrl.trim() && newExternalUrlLabel.trim()
          ? [{ label: newExternalUrlLabel.trim(), url: newExternalUrl.trim() }]
          : undefined,
      progress_history: [
        { date: 'Created', progress: 0 },
      ],
    });

    setNewTitle('');
    setNewDescription('');
    setNewEstimatedHours(12);
    setNewDependsOnTaskId('');
    setNewExternalUrlLabel('');
    setNewExternalUrl('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Project Task Board
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            CollabSphere Academic Project Management • Fall Semester 2024
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-xs md:text-sm shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Add Task</span>
        </button>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TO DO COLUMN */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-600">
                To Do
              </h3>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                {todoTasks.length}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-h-[500px]">
            {todoTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                allTasks={tasks}
                onUpdateTaskStatus={onUpdateTaskStatus}
                onUpdateTaskProgress={onUpdateTaskProgress}
                onAttachUrl={onAttachUrl}
              />
            ))}

            <button
              onClick={() => setIsModalOpen(true)}
              className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center justify-center text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer font-medium text-xs gap-2 bg-slate-50/50"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* IN PROGRESS COLUMN */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-600">
                In Progress
              </h3>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                {inProgressTasks.length}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-h-[500px]">
            {inProgressTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                allTasks={tasks}
                onUpdateTaskStatus={onUpdateTaskStatus}
                onUpdateTaskProgress={onUpdateTaskProgress}
                onAttachUrl={onAttachUrl}
              />
            ))}
          </div>
        </div>

        {/* DONE COLUMN */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-600">
                Done
              </h3>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                {doneTasks.length}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-h-[500px]">
            {doneTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                allTasks={tasks}
                onUpdateTaskStatus={onUpdateTaskStatus}
                onUpdateTaskProgress={onUpdateTaskProgress}
                onAttachUrl={onAttachUrl}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Create New Task</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Analyze Research Methodology"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide detailed context for this task..."
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Assignee
                  </label>
                  <select
                    value={newAssigneeName}
                    onChange={(e) => setNewAssigneeName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Alex Chen">Alex Chen</option>
                    <option value="Sarah Johnson">Sarah Johnson</option>
                    <option value="Jordan Smith">Jordan Smith</option>
                    <option value="Maria Garcia">Maria Garcia</option>
                    <option value="Alex Rivera">Alex Rivera</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={newEstimatedHours}
                    onChange={(e) => setNewEstimatedHours(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Task Dependency Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Prerequisite Task Dependency</span>
                  <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                </label>
                <select
                  value={newDependsOnTaskId}
                  onChange={(e) => setNewDependsOnTaskId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">None (Independent Task)</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      Task #{t.id}: {t.title} ({t.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* External URL Attachments */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Attach Initial External Resource URL (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Label (e.g. Google Doc)"
                    value={newExternalUrlLabel}
                    onChange={(e) => setNewExternalUrlLabel(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="URL (e.g. https://github.com/...)"
                    value={newExternalUrl}
                    onChange={(e) => setNewExternalUrl(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Priority Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Low', 'Medium', 'High'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setNewPriority(lvl)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        newPriority === lvl
                          ? lvl === 'High'
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : lvl === 'Medium'
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg shadow-xs hover:bg-indigo-700 cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

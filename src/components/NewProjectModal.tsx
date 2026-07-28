import React, { useState } from 'react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (teamName: string, projectTitle: string, description: string, targetDeadline: string) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateTeam,
}) => {
  const [teamName, setTeamName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDeadline, setTargetDeadline] = useState('2026-11-15');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !projectTitle.trim()) return;
    onCreateTeam(teamName, projectTitle, description, targetDeadline);
    setTeamName('');
    setProjectTitle('');
    setDescription('');
    setTargetDeadline('2026-11-15');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl w-full max-w-lg border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Form New Academic Project</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Team Name</label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Epsilon Cybernetics"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Project Title</label>
            <input
              type="text"
              required
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="e.g. Autonomous Campus Shuttle Telemetry"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Project Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline research goals and deliverable milestones..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Target Deadline</span>
              <span className="text-[11px] text-indigo-600 font-normal">Project Completion Date</span>
            </label>
            <input
              type="date"
              required
              value={targetDeadline}
              onChange={(e) => setTargetDeadline(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Initialize Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

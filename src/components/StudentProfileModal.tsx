import React from 'react';
import { Student } from '../types';

interface StudentProfileModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onInvite?: (student: Student) => void;
  isInvited?: boolean;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose,
  onInvite,
  isInvited = false,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-16 h-16 rounded-2xl border-2 border-white/30 object-cover shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{student.name}</h2>
                <span className="bg-indigo-500/30 text-indigo-100 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-indigo-300/30">
                  {student.role}
                </span>
              </div>
              <p className="text-xs text-indigo-200">{student.year} • {student.email}</p>
              <div className="flex items-center gap-2 pt-1">
                {student.gpa && (
                  <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                    GPA {student.gpa}
                  </span>
                )}
                <span className="bg-white/10 text-white text-[11px] font-medium px-2 py-0.5 rounded">
                  {student.capacityPct}% Capacity
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded border uppercase ${
                    student.status === 'Available'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  }`}
                >
                  {student.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Bio Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              About & Research Background
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {student.bio || 'Academic researcher actively contributing to undergraduate computer science and software development cohorts.'}
            </p>
          </div>

          {/* Technical Skills & Competencies */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verified Technical Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm text-indigo-500">verified</span>
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Past Academic Contributions & History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Past Project Contributions & Portfolio
              </h3>
              <span className="text-[11px] font-semibold text-slate-500">
                {student.pastContributions?.length || 0} Projects Recorded
              </span>
            </div>

            {student.pastContributions && student.pastContributions.length > 0 ? (
              <div className="space-y-3">
                {student.pastContributions.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-2xs space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{proj.project_name}</h4>
                        <p className="text-xs font-medium text-indigo-600">{proj.role} • {proj.year}</p>
                      </div>
                      {proj.commits_count && (
                        <span className="bg-slate-100 text-slate-700 text-[11px] font-mono font-bold px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-slate-500">code</span>
                          <span>{proj.commits_count} Commits</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500 italic">
                No prior archived projects on record for this cohort.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="material-symbols-outlined text-base text-slate-400">schedule</span>
            <span>Last active: {student.lastActive}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>
            {onInvite && (
              <button
                onClick={() => onInvite(student)}
                disabled={isInvited}
                className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                  isInvited
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {isInvited ? 'check_circle' : 'person_add'}
                </span>
                <span>{isInvited ? 'Invited to Team' : 'Invite to Team'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

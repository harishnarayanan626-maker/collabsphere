import React, { useState } from 'react';
import { Team, Faculty } from '../types';

interface FacultyOverviewViewProps {
  teams: Team[];
  faculty: Faculty;
}

export const FacultyOverviewView: React.FC<FacultyOverviewViewProps> = ({
  teams,
  faculty,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'roster' | 'tasks' | 'risks'>('roster');
  const [facultyNote, setFacultyNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];

  const handleSendFeedback = () => {
    if (!facultyNote.trim()) return;
    setToastMessage(`Advisory feedback sent to ${currentTeam.team_name}!`);
    setFacultyNote('');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleScheduleSync = () => {
    setToastMessage(`Sync meeting request sent to ${currentTeam.team_name} team lead.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setToastMessage('Unable to open print preview window. Please allow popups.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>CollabSphere Progress Report - ${faculty.name}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #0f172a; line-height: 1.5; }
            .header { border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
            .title { font-size: 24px; font-weight: 800; color: #1e1b4b; margin: 0; }
            .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
            .meta { font-size: 12px; text-align: right; color: #475569; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 16px; font-weight: 700; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th { background: #f8fafc; text-align: left; padding: 10px 12px; border-bottom: 2px solid #cbd5e1; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 10px; }
            td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
            .badge { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; }
            .badge-green { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
            .badge-amber { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
            .badge-rose { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">CollabSphere Academic Progress Report</h1>
              <p class="subtitle">Faculty Advisor Cohort Inspection & Risk Audit</p>
            </div>
            <div class="meta">
              <p><strong>Advisor:</strong> ${faculty.name}</p>
              <p><strong>Department:</strong> ${faculty.department || 'Computer Science'}</p>
              <p><strong>Generated Date:</strong> ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">1. Supervised Teams Executive Overview</h2>
            <table>
              <thead>
                <tr>
                  <th>Team & Project</th>
                  <th>Overall Progress</th>
                  <th>Risk Status</th>
                  <th>Team Capacity</th>
                  <th>Next Milestone</th>
                  <th>Sprint Velocity</th>
                </tr>
              </thead>
              <tbody>
                ${teams
                  .map(
                    (t) => `
                  <tr>
                    <td><strong>${t.team_name}</strong><br/><span style="color:#64748b;">${t.project_subtitle || ''}</span></td>
                    <td><strong>${t.progress_pct}%</strong></td>
                    <td>
                      ${
                        t.high_risks_count > 0
                          ? `<span class="badge badge-rose">${t.high_risks_count} High Risks</span>`
                          : t.med_risks_count > 0
                          ? `<span class="badge badge-amber">${t.med_risks_count} Med Risks</span>`
                          : `<span class="badge badge-green">On Track</span>`
                      }
                    </td>
                    <td>${t.team_size} Members</td>
                    <td>${t.next_milestone}</td>
                    <td>${t.sprint_velocity}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2 class="section-title">2. Detailed Inspection (${currentTeam.team_name})</h2>
            <p style="font-size: 13px;"><strong>Project Scope:</strong> ${currentTeam.project_subtitle}</p>
            <p style="font-size: 13px;"><strong>Target Deadline:</strong> ${currentTeam.target_deadline || '2026-10-31'}</p>
            <p style="font-size: 13px;"><strong>Current Progress:</strong> ${currentTeam.progress_pct}% Completed</p>
            ${
              facultyNote
                ? `<div style="background: #f8fafc; padding: 15px; border-left: 4px solid #4f46e5; border-radius: 4px; margin-top: 15px;"><strong style="font-size: 12px; color:#4f46e5;">Advisor Advisory Comment:</strong><p style="margin: 5px 0 0 0; font-size: 12px; color: #334155;">${facultyNote}</p></div>`
                : ''
            }
          </div>

          <div class="footer">
            <span>CollabSphere Academic Oversight System</span>
            <span>Faculty Advisor Signature: ___________________________</span>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    setToastMessage('Generated PDF document print view!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <img
            src={
              faculty.avatarUrl ||
              'https://lh3.googleusercontent.com/aida-public/AB6AXuATFXzGbqPKIvSZ4B3CmCx2kiFqGJzJRt4u2kctwAkDFqDkEwp0DWsFPzGgg4hh2Pb5_IArqzDupMmKsXEgXhsNFHm6XpJJSyqIQYFdX0hJC3Zzy7TkYCji9pUhVltJP8vBZeAvEcNwOogeXLbkmXCx-bmHk3X_iAqo51JnJoNJFLknyoo_XxiLhHwgYrdqKtUJVXpIWlsqtrBsWJ-A5wfMB_2tn2oeA3k5_1cEfRsLLUPvCbdGTNGe3xNA4QIR-PLJ9kh9K7-VEpuP'
            }
            alt={faculty.name}
            className="w-12 h-12 rounded-xl border border-slate-200 object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-xl text-slate-900">{faculty.name}</h1>
              <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-md">
                Faculty Advisor
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{faculty.department} Department</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-xs shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            <span>Export as PDF</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600">
            <span className="material-symbols-outlined text-base text-slate-400">visibility</span>
            <span>Read-Only Inspection Mode</span>
          </div>
        </div>
      </div>

      {/* Active Teams Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-lg text-slate-900">Supervised Teams Overview</h2>
            <p className="text-xs text-slate-500">Real-time milestone tracking across student cohorts.</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">4 Active Teams</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Team & Project</th>
                <th className="py-3.5 px-6">Overall Progress</th>
                <th className="py-3.5 px-6">Risk Status</th>
                <th className="py-3.5 px-6">Team Size</th>
                <th className="py-3.5 px-6">Next Milestone</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teams.map((team) => {
                const isSelected = team.id === selectedTeamId;

                return (
                  <tr
                    key={team.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-indigo-50/40 font-medium' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <p className="font-bold text-sm text-slate-900">{team.team_name}</p>
                      <p className="text-[11px] text-slate-500">{team.project_subtitle}</p>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              team.progress_pct > 70
                                ? 'bg-emerald-600'
                                : team.progress_pct > 40
                                ? 'bg-indigo-600'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${team.progress_pct}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-xs text-slate-900">{team.progress_pct}%</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {team.high_risks_count > 0 ? (
                        <span className="bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                          {team.high_risks_count} High Risks
                        </span>
                      ) : team.med_risks_count > 0 ? (
                        <span className="bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                          {team.med_risks_count} Medium Risks
                        </span>
                      ) : (
                        <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                          On Track
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-slate-600 font-medium">{team.team_size} Members</td>

                    <td className="py-4 px-6 text-slate-900 font-medium">{team.next_milestone}</td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedTeamId(team.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected ? 'Inspecting' : 'Inspect Team'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Team Detail Inspector */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-xl text-slate-900">{currentTeam.team_name} Inspection</h2>
              <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-md">
                {currentTeam.project_subtitle}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Sprint Velocity: {currentTeam.sprint_velocity} • Next Milestone: {currentTeam.next_milestone}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'roster' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Roster
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'tasks' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tasks Board
            </button>
            <button
              onClick={() => setActiveTab('risks')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'risks' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Risks & Audit
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'roster' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcBssw-hikusgkYeIawyYKIG_YdNJj9dHUF3SJXfd2pwzpsfjTLp01EWVjznYNffwmyHUzkBd_1HnpAt1LcuhDgS-CZGZ221i9Y89HT7FqDlbUBg_TH_tCdscVb0M6-hFyxPLB4rkmEVinKx6WFXrLksBvuT0nLAfoGsF9JnP8hBdKMfXEqSX5i9cWcyoP5Ls26C-94_HBndF5msim_LMQziPGa67dVYCmvLSIWCPPj0c4URILHonCwC5ynFWe45aKe3cwoHlZLrEF"
                alt="Lead"
                className="w-9 h-9 rounded-full border border-slate-200 object-cover"
              />
              <div>
                <p className="font-bold text-xs text-slate-900">Harish Narayanan</p>
                <p className="text-[11px] text-indigo-600 font-semibold">Team Lead</p>
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGqMTnHiOUQ5znSOr_zDSxHMAAQouq43wQTUhco0QA8jkSMfceNieqGS9QOmtE4uoBZv5wLhJ_kwtypR4UITPTYPwrBzoKzF1M0jQImXWDNhh51C4qRlnLMYS7vOdHijK-KrwIdDQ2xdP6kKTyJI7ubYYmSRWkXAiIQFT3wPO1BQwykY13CGUmWoqFOoM9N-VUByQu6a787fYfPhgn0j7ILi5WgFn43u5vp5A6monS8ru8BWAF5XTeEMIdjfuLfubnoK1dwmtQiDGJ"
                alt="Alex Chen"
                className="w-9 h-9 rounded-full border border-slate-200 object-cover"
              />
              <div>
                <p className="font-bold text-xs text-slate-900">Alex Chen</p>
                <p className="text-[11px] text-slate-500">Schema Developer</p>
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKAAw-tUkVwD-o1X0SM5voGvH4w1P9oEgA-61Xrr_BQHzaF6eYSYGhdl5CuJJZS0zdxRVy45Sjv-MiA655blY--nGOYesdaRPZDJWktFIg8jeWCtZMAOV4mKi_ZzOD1oURaPaElz6vfJQ1ndX6RMds8HL_5e1ZCJUif8vZ7YIzME3J-jf1H5mwv5MkGwB7tRzmZWLInQBL9SR25tNqYBsmisaSj-sRoEdw5_3I-wzRaG8e8faUyvgvCRMRYdEarVmKcHeEbVAew9Bc"
                alt="Jordan Smith"
                className="w-9 h-9 rounded-full border border-slate-200 object-cover"
              />
              <div>
                <p className="font-bold text-xs text-slate-900">Jordan Smith</p>
                <p className="text-[11px] text-rose-600 font-semibold">Overloaded Member</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
            <p className="font-bold text-sm text-slate-900">Read-Only Task Board Status</p>
            <p className="text-slate-600">
              12 Tasks Completed • 2 Tasks In Progress • 3 Blocked High-Risk Tasks.
            </p>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="p-4 bg-rose-50 text-rose-700 rounded-lg border border-rose-200 text-xs space-y-1">
            <p className="font-bold text-sm">Critical Risk Audit</p>
            <p>Database Schema Design is currently blocking Phase 2 backend deployment.</p>
          </div>
        )}

        {/* Faculty Advisory Toolbar */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <label className="block text-xs font-bold text-slate-900">
            Faculty Evaluation Notes & Advisory Actions
          </label>
          <textarea
            rows={2}
            value={facultyNote}
            onChange={(e) => setFacultyNote(e.target.value)}
            placeholder="Write official advisory comment or review instructions..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
          />

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={handleScheduleSync}
              className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-slate-500">calendar_month</span>
              <span>Request Sync Meeting</span>
            </button>

            <button
              onClick={handleSendFeedback}
              className="px-4 py-2 bg-indigo-600 text-white font-medium text-xs rounded-lg shadow-xs hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">send</span>
              <span>Send Advisory Feedback</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 z-50">
          <span className="material-symbols-outlined text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

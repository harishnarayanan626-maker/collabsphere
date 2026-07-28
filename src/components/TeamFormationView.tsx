import React, { useState } from 'react';
import { Student } from '../types';
import { StudentProfileModal } from './StudentProfileModal';

interface TeamFormationViewProps {
  students: Student[];
  onInviteStudent: (student: Student) => void;
}

export const TeamFormationView: React.FC<TeamFormationViewProps> = ({
  students,
  onInviteStudent,
}) => {
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('All Talent');
  const [searchQuery, setSearchQuery] = useState('');
  const [invitedStudentIds, setInvitedStudentIds] = useState<number[]>([]);
  const [profileStudent, setProfileStudent] = useState<Student | null>(null);

  const skillFilters = [
    'All Talent',
    'React',
    'UI Design',
    'Python',
    'Data Science',
    'Mobile Dev',
    'Product Mgmt',
  ];

  const handleInvite = (student: Student) => {
    if (invitedStudentIds.includes(student.id)) return;
    setInvitedStudentIds((prev) => [...prev, student.id]);
    onInviteStudent(student);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      student.bio?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkill =
      selectedSkillFilter === 'All Talent' ||
      student.skills.some((s) => s.toLowerCase().includes(selectedSkillFilter.toLowerCase()));

    return matchesSearch && matchesSkill;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Team Formation
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Discover classmates, evaluate skillsets, and build balanced project teams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Discover Students */}
        <div className="lg:col-span-8 space-y-5">
          {/* Search & Skill Pills */}
          <div className="space-y-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, major, or skill..."
                className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {skillFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedSkillFilter(filter)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedSkillFilter === filter
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Student Roster Cards */}
          <div className="space-y-4">
            {filteredStudents.map((student) => {
              const isInvited = invitedStudentIds.includes(student.id);

              return (
                <div
                  key={student.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={student.avatarUrl}
                      alt={student.name}
                      onClick={() => setProfileStudent(student)}
                      className="w-12 h-12 rounded-xl border border-slate-200 object-cover shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      title="View Student Profile"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3
                          onClick={() => setProfileStudent(student)}
                          className="font-bold text-base text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1 group"
                        >
                          <span>{student.name}</span>
                          <span className="material-symbols-outlined text-sm text-slate-400 group-hover:text-indigo-600">
                            visibility
                          </span>
                        </h3>
                        {student.gpa && (
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                            GPA {student.gpa}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${
                            student.status === 'Available'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}
                        >
                          {student.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{student.year}</p>
                      <p className="text-xs text-slate-600 line-clamp-1 max-w-md">{student.bio}</p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {student.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-indigo-50 text-indigo-700 text-[11px] font-medium px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInvite(student)}
                    disabled={isInvited}
                    className={`shrink-0 px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                      isInvited
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isInvited ? 'check_circle' : 'person_add'}
                    </span>
                    <span>{isInvited ? 'Invited' : 'Invite to Team'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Current Team Roster */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-bold text-lg text-slate-900">Alpha Phoenix</h2>
                <p className="text-xs text-slate-500">Team Roster Capacity</p>
              </div>
              <span className="bg-indigo-50 text-indigo-700 font-bold text-xs px-3 py-1 rounded-md">
                {3 + invitedStudentIds.length}/5 Seats
              </span>
            </div>

            {/* Formation Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Formation Progress</span>
                <span className="text-indigo-600">{Math.min(100, (3 + invitedStudentIds.length) * 20)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (3 + invitedStudentIds.length) * 20)}%` }}
                ></div>
              </div>
            </div>

            {/* Members Roster */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcBssw-hikusgkYeIawyYKIG_YdNJj9dHUF3SJXfd2pwzpsfjTLp01EWVjznYNffwmyHUzkBd_1HnpAt1LcuhDgS-CZGZ221i9Y89HT7FqDlbUBg_TH_tCdscVb0M6-hFyxPLB4rkmEVinKx6WFXrLksBvuT0nLAfoGsF9JnP8hBdKMfXEqSX5i9cWcyoP5Ls26C-94_HBndF5msim_LMQziPGa67dVYCmvLSIWCPPj0c4URILHonCwC5ynFWe45aKe3cwoHlZLrEF"
                  alt="Team Lead"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div className="flex-1">
                  <p className="font-bold text-xs text-slate-900">Harish Narayanan</p>
                  <p className="text-[11px] text-indigo-600 font-semibold">Team Lead • Full Stack</p>
                </div>
                <span className="material-symbols-outlined text-emerald-600 text-base">verified</span>
              </div>

              <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOtOTgUP9nKJWq1l1OCg3m6KcL47oMEei4CNsOl8As--ykppj3vUvskazia2dmSoorysdbH9ZqXyXbUFxODTZZOqLnMXySXhzPc4zqsvBA_DttA5bCDR4QenBrmiJFyp_cZJ7_G9MntWQ3NBD1ONGHf4O86EhlGZn4d5YR3e6j4rFc2ugcGTPCH3ZJwh2MnZ0azfRCzW_fDyBUYPMpfmTmMUd9jQIM0UO9PrOJsnbhBBQaN7qq4ZflQ8Er38vO8-pdFywpD9-egkBa"
                  alt="Leo G."
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div className="flex-1">
                  <p className="font-bold text-xs text-slate-900">Leo G.</p>
                  <p className="text-[11px] text-slate-500">Backend Engineer</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrJqoLQQquighbPtVNyhiUybVQmbMJzWJAj-SoB_MB69u1tBGNuMYj0j-x1Lo6ZnqHCWrAiZ0VMmZpY7Oz9cwEt5SSXPVWuLYBMzTf44h0u3mwli0QemehGHyq0E-om1p7wGdY07K0kG5BF_jXR_RJznCtdajQdhGh7zXlng5LhwB6GsIq0RqXnbCrb8nBtawgfkJNGAqoqPMgZmpxE93rp2-fVl65jMX1swknMLE9fjwyeySZ9q1QPzSsW1m3JmdGWoISOQPqz2B7"
                  alt="Sofia R."
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div className="flex-1">
                  <p className="font-bold text-xs text-slate-900">Sofia R.</p>
                  <p className="text-[11px] text-slate-500">UI/UX Designer</p>
                </div>
              </div>

              {/* Invited Member Slots */}
              {invitedStudentIds.map((id) => {
                const s = students.find((st) => st.id === id);
                if (!s) return null;
                return (
                  <div key={id} className="flex items-center gap-3 p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                    <img
                      src={s.avatarUrl}
                      alt={s.name}
                      className="w-9 h-9 rounded-full object-cover border border-emerald-300"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-xs text-slate-900">{s.name}</p>
                      <p className="text-[11px] text-emerald-700 font-semibold">Pending Invite Response</p>
                    </div>
                  </div>
                );
              })}

              {/* Empty Seats */}
              {Array.from({ length: Math.max(0, 2 - invitedStudentIds.length) }).map((_, i) => (
                <div
                  key={i}
                  className="p-3 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs font-medium gap-2"
                >
                  <span className="material-symbols-outlined text-base">person_add</span>
                  <span>Empty Seat ({i + 4}/5)</span>
                </div>
              ))}
            </div>

            {/* Team Balance Card */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-600">
                <span className="material-symbols-outlined text-base">auto_awesome</span>
                <span className="font-bold text-xs">Skill Balance Score: 82%</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Excellent mix of engineering and design talent. Consider adding a Data Science specialist for project completeness.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Profile Detail Modal */}
      <StudentProfileModal
        student={profileStudent}
        isOpen={Boolean(profileStudent)}
        onClose={() => setProfileStudent(null)}
        onInvite={handleInvite}
        isInvited={profileStudent ? invitedStudentIds.includes(profileStudent.id) : false}
      />
    </div>
  );
};

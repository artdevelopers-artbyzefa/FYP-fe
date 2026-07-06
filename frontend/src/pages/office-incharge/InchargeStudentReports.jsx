import React, { useEffect, useState } from 'react';
import { getInchargeStudentReports } from '../../services/office-incharge.service';
import { ArrowLeft, Users, User, Mail, BookOpen, Code, GraduationCap, ChevronRight, Search, FileText, BarChart3, CheckCircle, X, Clock } from 'lucide-react';
import { IDEA_STATUS_MAP } from '../../utils/constants/status.constant';
import { StudentRecordsSkeleton } from '../../components/Skeleton';

const fypStatusConfig = {
  not_started: { label: 'Not Started', color: 'bg-gray-50 text-gray-500 border-gray-200' },
  proposal_submitted: { label: 'Proposal Submitted', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  proposal_approved: { label: 'Proposal Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  proposal_rejected: { label: 'Proposal Rejected', color: 'bg-rose-50 text-rose-600 border-rose-200' },
  phase1_ongoing: { label: 'Phase 1 Ongoing', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  phase1_completed: { label: 'Phase 1 Completed', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  phase2_ongoing: { label: 'Phase 2 Ongoing', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  phase2_completed: { label: 'Phase 2 Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  failed: { label: 'Failed', color: 'bg-rose-50 text-rose-600 border-rose-200' },
};

const groupStatusConfig = {
  forming: { label: 'Forming', color: 'bg-gray-50 text-gray-500 border-gray-200' },
  pending_approval: { label: 'Pending Approval', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved: { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', color: 'bg-rose-50 text-rose-600 border-rose-200' },
  active: { label: 'Active', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  completed: { label: 'Completed', color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

export default function InchargeStudentRecords() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getInchargeStudentReports()
      .then(res => setStudents(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s =>
    !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.regNo?.toLowerCase().includes(search.toLowerCase())
  );

  if (view === 'idea' && selectedIdea) {
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4">
          <button onClick={() => { setView('group'); setSelectedIdea(null); }} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3">
            <ArrowLeft size={14} /> Back to Group
          </button>
          <h2 className="text-xl font-bold text-slate-900">{selectedIdea.title}</h2>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${IDEA_STATUS_MAP[selectedIdea.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
              {IDEA_STATUS_MAP[selectedIdea.status]?.label || selectedIdea.status}
            </span>
            <span className="bg-slate-50 text-slate-700 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-slate-200">Submitted by {selectedIdea.submittedBy}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {selectedIdea.description && (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><BookOpen size={13} /> Description</h5>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedIdea.description}</p>
              </div>
            )}
            {selectedIdea.techStack && (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><Code size={13} /> Technology Stack</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedIdea.techStack.split(',').map((t, i) => (
                    <span key={i} className="bg-gray-50 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-lg border border-line">{t.trim()}</span>
                  ))}
                </div>
              </div>
            )}
            {selectedIdea.feedback && (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><FileText size={13} /> Feedback</h5>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedIdea.feedback}</p>
              </div>
            )}
          </div>
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Idea Details</h5>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Status</span><span className={`font-bold px-2 py-0.5 rounded-lg border ${IDEA_STATUS_MAP[selectedIdea.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{IDEA_STATUS_MAP[selectedIdea.status]?.label || selectedIdea.status}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Submitted By</span><span className="font-bold text-slate-900">{selectedIdea.submittedBy}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'group' && selected?.group) {
    const g = selected.group;
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4">
          <button onClick={() => { setView('list'); setSelected(null); }} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3">
            <ArrowLeft size={14} /> Back to Student Records
          </button>
          <h2 className="text-xl font-bold text-slate-900">{g.fypTitle || g.name || 'Group Detail'}</h2>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${groupStatusConfig[g.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{groupStatusConfig[g.status]?.label || g.status}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><FileText size={13} /> Project Ideas</h5>
              <div className="space-y-3">
                {g.ideas?.length > 0 ? g.ideas.map((idea, i) => (
                  <div key={i} onClick={() => { setSelectedIdea(idea); setView('idea'); }} className="p-4 rounded-xl border border-line cursor-pointer hover:border-blue-200 hover:bg-blue-50/20 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-slate-900 text-sm">{idea.title}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap ${IDEA_STATUS_MAP[idea.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{IDEA_STATUS_MAP[idea.status]?.label || idea.status}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Submitted by {idea.submittedBy}</p>
                    {idea.description && <p className="text-xs text-slate-500 mt-2 line-clamp-2">{idea.description}</p>}
                  </div>
                )) : <p className="text-xs text-slate-400 py-4 text-center">No ideas submitted yet</p>}
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><User size={13} /> Supervision</h5>
              <div className="space-y-3">
                <div><span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-0.5">Supervisor</span><span className="font-bold text-slate-900 text-sm">{g.supervisor?.name || 'N/A'}</span></div>
                {g.coSupervisor && <div><span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-0.5">Co-Supervisor</span><span className="font-bold text-slate-900 text-sm">{g.coSupervisor.name}</span></div>}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><Users size={13} /> Team Members ({g.memberCount})</h5>
              <div className="space-y-2">
                {g.members?.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-line">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">{m.name?.charAt(0)}</div>
                    <div className="min-w-0"><div className="text-sm font-bold text-slate-900 truncate">{m.name}</div><div className="text-[10px] text-gray-400 truncate">{m.regNo || m.email}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Progress</h5>
              <div className="flex items-center gap-3"><div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${g.progress || 0}%` }} /></div><span className="text-sm font-black text-slate-900">{g.progress || 0}%</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'detail' && selected) {
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4">
          <button onClick={() => { setView('list'); setSelected(null); }} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3">
            <ArrowLeft size={14} /> Back to Student Records
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xl shrink-0">{selected.name?.charAt(0)}</div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{selected.name}</h2>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1"><GraduationCap size={12} /> {selected.regNo || 'No Reg No'}</span>
                <span className="flex items-center gap-1"><Mail size={12} /> {selected.email}</span>
                {selected.section && <span>Section {selected.section}</span>}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${fypStatusConfig[selected.fypStatus]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
              {fypStatusConfig[selected.fypStatus]?.label || selected.fypStatus}
            </span>
            {selected.cgpa > 0 && <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-blue-200">CGPA: {selected.cgpa}</span>}
            {selected.semester > 0 && <span className="bg-purple-50 text-purple-700 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-purple-200">Semester {selected.semester}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {selected.group ? (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><Users size={13} /> Assigned Group</h5>
                <div onClick={() => setView('group')} className="p-4 rounded-xl border border-line cursor-pointer hover:border-blue-200 hover:bg-blue-50/20 transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-bold text-slate-900 text-sm">{selected.group.fypTitle || selected.group.name || 'Unnamed Group'}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap ${groupStatusConfig[selected.group.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                      {groupStatusConfig[selected.group.status]?.label || selected.group.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><User size={12} /> {selected.group.supervisor?.name || 'No supervisor'}</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {selected.group.memberCount} members</span>
                    <ChevronRight size={14} className="text-slate-300 ml-auto" />
                  </div>
                  {selected.group.ideas?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {selected.group.ideas.slice(0, 3).map((idea, i) => (
                        <span key={i} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${IDEA_STATUS_MAP[idea.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{idea.title?.slice(0, 18)}...</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><Users size={13} /> Assigned Group</h5>
                <p className="text-xs text-slate-400 py-4 text-center">No group assigned yet</p>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><User size={13} /> Assigned Supervisor</h5>
              {selected.assignedSupervisor ? (
                <div><span className="font-bold text-slate-900 text-sm">{selected.assignedSupervisor.name}</span><p className="text-[10px] text-slate-400">{selected.assignedSupervisor.email}</p></div>
              ) : <p className="text-xs text-slate-400 py-2">No supervisor assigned</p>}
            </div>
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Student Info</h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Father Name</span><span className="font-bold text-slate-900">{selected.fatherName || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Section</span><span className="font-bold text-slate-900">{selected.section || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Semester</span><span className="font-bold text-slate-900">{selected.semester || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">CGPA</span><span className="font-bold text-slate-900">{selected.cgpa || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">FYP Status</span><span className={`font-bold px-2 py-0.5 rounded-lg border ${fypStatusConfig[selected.fypStatus]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{fypStatusConfig[selected.fypStatus]?.label || selected.fypStatus}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Records</h2>
          <p className="text-xs text-slate-900 mt-0.5 font-medium">View all students, their groups, project ideas, and supervisors</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by name or reg no..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-line rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
        </div>
      </div>

      {loading ? <StudentRecordsSkeleton /> : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
          <GraduationCap className="w-10 h-10" />
          <p className="text-sm font-bold">No students found</p>
          <p className="text-xs">Try adjusting your search.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Reg No</th>
                  <th className="py-3 px-4">FYP Status</th>
                  <th className="py-3 px-4">Supervisor</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Group</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                {filtered.map(s => (
                  <tr key={s._id} className="hover:bg-blue-50/30 transition-colors cursor-pointer" onClick={() => { setSelected(s); setView('detail'); }}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">{s.name?.charAt(0)}</div>
                        <span className="font-bold text-slate-900 text-sm">{s.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">{s.regNo || s.email || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap ${fypStatusConfig[s.fypStatus]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                        {fypStatusConfig[s.fypStatus]?.label || s.fypStatus || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs">{s.group?.supervisor?.name || s.assignedSupervisor?.name || <span className="text-slate-400">No supervisor</span>}</td>
                    <td className="py-3 px-4 text-xs text-slate-600 max-w-[160px] truncate">{s.group?.fypTitle || s.fypTitle || <span className="text-slate-400">-</span>}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">{s.group ? `${s.group.memberCount} members` : <span className="text-slate-400">No group</span>}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-blue-600 text-[10px] font-bold flex items-center justify-end gap-0.5">View Profile <ChevronRight size={12} /></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { getFacultySupervisedGroups } from '../../services/faculty.service';
import { STATUS_MAP } from '../../utils/constants/status.constant';
import { Users, FileText, TrendingUp, Loader2, AlertCircle, ArrowLeft, Lightbulb, ThumbsUp, MessageSquare } from 'lucide-react';

const FacultySupervision = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    setLoading(true); setError(null);
    getFacultySupervisedGroups()
      .then(res => setGroups(Array.isArray(res.data) ? res.data : []))
      .catch(err => { console.error(err); setError('Failed to load groups.'); setGroups([]); })
      .finally(() => setLoading(false));
  }, []);

  const openDetail = (g) => {
    setSelectedGroup(g);
  };

  if (loading) return <div className="flex-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /><span className="ml-2 text-sm text-slate-500 font-medium">Loading groups...</span></div>;

  if (selectedGroup) {
    const g = selectedGroup;
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedGroup(null)} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-transparent border-0 cursor-pointer"><ArrowLeft size={14} /> Back to all groups</button>

        <div className="card p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{g.name || `Group ${g.groupId?.toString().substring(0, 4)}`}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{g.title}</p>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
              g.status === 'active' ? 'badge-emerald' : g.status === 'approved' ? 'badge-blue' : g.status === 'completed' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'badge-slate'
            }`}>{STATUS_MAP[g.status] || g.status}</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Users size={15} /> Members ({g.members.length})</h3>
              <div className="space-y-2">
                {g.members.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex-center text-blue-600 text-xs font-bold flex-shrink-0">
                      {(m.name || '?').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-slate-900 truncate">{m.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{m.email} {m.regNo ? `· ${m.regNo}` : ''}</div>
                    </div>
                  </div>
                ))}
              </div>

              {g.acceptedIdea && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2"><Lightbulb size={15} /> Accepted Project Idea</h3>
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                    <div className="flex items-center gap-2">
                      <ThumbsUp size={14} className="text-emerald-600" />
                      <p className="text-sm font-bold text-slate-900">{g.acceptedIdea.title}</p>
                    </div>
                    {g.acceptedIdea.description && <p className="text-xs text-slate-600 leading-relaxed">{g.acceptedIdea.description}</p>}
                    {g.acceptedIdea.techStack && (
                      <div className="flex flex-wrap gap-1.5">
                        {g.acceptedIdea.techStack.split(',').map((t, i) => (
                          <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">{t.trim()}</span>
                        ))}
                      </div>
                    )}
                    {g.acceptedIdea.supervisorFeedback && (
                      <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 flex items-start gap-2">
                        <MessageSquare size={12} className="text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold text-blue-700 mb-0.5">Your Feedback:</p>
                          <p className="text-xs text-slate-700">{g.acceptedIdea.supervisorFeedback}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {g.recentLogs?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2"><FileText size={15} /> Recent Weekly Logs</h3>
                  <div className="space-y-1.5">
                    {g.recentLogs.map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-line">
                        <span className="text-xs font-medium text-slate-700">Week {log.week}</span>
                        <span className={`badge-sm ${log.status === 'approved' ? 'badge-emerald' : log.status === 'submitted' ? 'badge-amber' : 'badge-slate'}`}>{log.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-slate-500 pt-3 border-t border-line">
                <span className="font-medium">Leader: {g.leaderName}</span>
                {g.coSupervisor && g.coSupervisor !== 'Not assigned' && <span>Co-supervisor: {g.coSupervisor}</span>}
                <span className="flex items-center gap-1"><TrendingUp size={13} /> {g.progress}%</span>
                <span>{g.approvedLogs}/{g.totalLogs} logs approved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <h2 className="text-xl font-bold text-slate-900">Supervised Project Groups</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Click a group to view full details and set committee assignment preferences.</p>
      </div>

      {error ? (
        <div className="flex flex-col items-center gap-2 py-12 text-slate-400">
          <AlertCircle className="w-8 h-8" />
          <p className="text-sm font-bold">{error}</p>
          <button onClick={() => window.location.reload()} className="text-xs text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-0">Retry</button>
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-slate-400">
          <Users className="w-8 h-8" />
          <p className="text-sm font-bold">No supervised groups yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map(g => (
            <div key={g.groupId} className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div onClick={() => openDetail(g)} className="cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-base truncate">{g.name || `Group ${g.groupId?.toString().substring(0, 4)}`}</h3>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{g.title}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ml-2 ${
                    g.status === 'active' ? 'badge-emerald' : g.status === 'approved' ? 'badge-blue' : g.status === 'completed' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'badge-slate'
                  }`}>{STATUS_MAP[g.status] || g.status}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Users size={12} /> {g.members.length}</span>
                  <span className="flex items-center gap-1"><TrendingUp size={12} /> {g.progress}%</span>
                  <span className="flex items-center gap-1"><FileText size={12} /> {g.approvedLogs}/{g.totalLogs}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                  <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${g.progress}%` }} />
                </div>
              </div>

            </div>
          ))}
        </div>
      )}


    </div>
  );
};

export default FacultySupervision;

import React, { useEffect, useState } from 'react';
import { getFacultySupervisedGroups } from '../../services/faculty.service';
import { ChevronDown, ChevronUp, Users, FileText, TrendingUp, Clock, CheckCircle, Loader2, AlertCircle, Mail, User } from 'lucide-react';

const STATUS_MAP = {
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  active: 'Active',
  completed: 'Completed',
  rejected: 'Rejected',
  forming: 'Forming'
};

const FacultySupervision = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getFacultySupervisedGroups()
      .then(res => setGroups(Array.isArray(res.data) ? res.data : []))
      .catch(err => { console.error(err); setError('Failed to load groups.'); setGroups([]); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading groups...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <h2 className="text-xl font-bold text-slate-900">Supervised Project Groups</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Monitor your supervised groups, track weekly logs, and review progress.</p>
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
          <p className="text-xs text-slate-400">Groups will appear here once students request you as their supervisor and you approve them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {groups.map(g => (
            <div key={g.groupId} className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
              <div
                onClick={() => setExpanded(expanded === g.groupId ? null : g.groupId)}
                className="p-5 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-base truncate">{g.name}</h3>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{g.title}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                      g.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : g.status === 'approved' ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : g.status === 'completed' ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>{STATUS_MAP[g.status] || g.status}</span>
                    {expanded === g.groupId ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Users size={13} />
                    <span className="font-medium">{g.members.length} member{g.members.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp size={13} />
                    <span className="font-medium">{g.progress}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText size={13} />
                    <span className="font-medium">{g.approvedLogs}/{g.totalLogs} logs</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${g.progress}%` }}></div>
                </div>
              </div>

              {expanded === g.groupId && (
                <div className="border-t border-line px-5 py-4 bg-slate-50/50 space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Group Members</h4>
                    <div className="space-y-2">
                      {g.members.map((m, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-line">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {m.name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-slate-900 truncate">{m.name}</div>
                            <div className="text-[10px] text-slate-400">{m.email} {m.regNo ? `· ${m.regNo}` : ''}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {g.recentLogs && g.recentLogs.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Weekly Logs</h4>
                      <div className="space-y-1.5">
                        {g.recentLogs.map((log, i) => (
                          <div key={i} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-line">
                            <div className="flex items-center gap-2">
                              <Clock size={13} className="text-slate-400" />
                              <span className="text-xs font-medium text-slate-700">Week {log.week}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                              log.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : log.status === 'submitted' ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-slate-50 text-slate-500 border-slate-200'
                            }`}>{log.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-line">
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} />
                      <span className="font-medium">{g.leaderName} (Leader)</span>
                    </div>
                    <span className="font-medium">Co-supervisor: {g.coSupervisor}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultySupervision;

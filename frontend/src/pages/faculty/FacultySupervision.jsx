import React, { useEffect, useState } from 'react';
import { getFacultySupervisedGroups, saveGroupPreferences } from '../../services/faculty.service';
import { showToast } from '../../components/AppToast';
import { Users, FileText, TrendingUp, Loader2, AlertCircle, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';

const FIELDS = [
  'Web Development', 'Game Development', 'Software Requirement Engineering',
  'Mobile App Development', 'Machine Learning / AI', 'Database Systems',
  'Cybersecurity', 'Deployment'
];

const PRIORITY = {
  1: { label: '1st Choice', weight: '50%', card: 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400', text: 'text-emerald-700', badge: 'bg-emerald-500 text-white', dot: 'bg-emerald-500' },
  2: { label: '2nd Choice', weight: '30%', card: 'bg-blue-50 border-blue-400 ring-1 ring-blue-400', text: 'text-blue-700', badge: 'bg-blue-500 text-white', dot: 'bg-blue-500' },
  3: { label: '3rd Choice', weight: '20%', card: 'bg-amber-50 border-amber-400 ring-1 ring-amber-400', text: 'text-amber-700', badge: 'bg-amber-500 text-white', dot: 'bg-amber-500' },
};

const STATUS_MAP = {
  pending_approval: 'Pending Approval', approved: 'Approved', active: 'Active',
  completed: 'Completed', rejected: 'Rejected', forming: 'Forming'
};

const FacultySupervision = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [prefs, setPrefs] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true); setError(null);
    getFacultySupervisedGroups()
      .then(res => setGroups(Array.isArray(res.data) ? res.data : []))
      .catch(err => { console.error(err); setError('Failed to load groups.'); setGroups([]); })
      .finally(() => setLoading(false));
  }, []);

  const openDetail = (g) => {
    setSelectedGroup(g);
    setPrefs(g.preferences?.map(p => ({ field: p.field, priority: p.priority })) || []);
  };

  const getPriority = (field) => { const p = prefs.find(p => p.field === field); return p ? p.priority : null; };

  const handleSelect = (field) => {
    const current = getPriority(field);
    if (current) { setPrefs(prefs.filter(p => p.field !== field)); return; }
    if (prefs.length >= 3) { showToast.error('Max 3 preferences.'); return; }
    setPrefs([...prefs, { field, priority: prefs.length + 1 }]);
  };

  const handleSavePrefs = async () => {
    if (prefs.length === 0) { showToast.error('Select at least one preference.'); return; }
    setSaving(true);
    try {
      await saveGroupPreferences(selectedGroup.groupId, prefs);
      showToast.success('Preferences saved.');
      setGroups(groups.map(g => g.groupId === selectedGroup.groupId ? { ...g, preferences: prefs } : g));
    } catch (err) { showToast.error(err?.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Committee Assignment Preferences</h3>
              </div>
              <p className="text-[10px] text-slate-400 mb-4">Select up to 3 fields ranked by preference. These determine which committee evaluates this group.</p>

              <div className="flex items-center gap-3 mb-4 text-[10px]">
                {[1, 2, 3].map(p => (
                  <div key={p} className="flex items-center gap-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${PRIORITY[p].dot}`} />
                    <span className="font-medium text-slate-500">{PRIORITY[p].label} ({PRIORITY[p].weight})</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-4">
                {FIELDS.map(field => {
                  const priority = getPriority(field);
                  const cls = priority ? PRIORITY[priority] : null;
                  return (
                    <div key={field} onClick={() => handleSelect(field)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${cls ? cls.card : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-xs font-bold ${cls ? cls.text : 'text-slate-900'}`}>{field}</div>
                          {cls && <div className={`text-[9px] font-bold mt-0.5 ${cls.text}`}>{PRIORITY[priority].label} · Weight: {PRIORITY[priority].weight}</div>}
                        </div>
                        <div className={`w-6 h-6 rounded-full flex-center flex-shrink-0 ${cls ? cls.badge : 'bg-gray-100 text-gray-400'}`}>
                          {cls ? <CheckCircle size={11} /> : <span className="text-[10px] font-bold">+</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button onClick={handleSavePrefs} disabled={saving || prefs.length === 0}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50 border-0 flex-center gap-2">
                {saving && <Loader2 size={12} className="animate-spin" />}
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
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
            <div key={g.groupId} onClick={() => openDetail(g)} className="card p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
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
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultySupervision;

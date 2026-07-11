import React, { useEffect, useState } from 'react';
import { getInchargeSessions, createInchargeSession, deleteInchargeSession, activateInchargeSession } from '../../services/office-incharge.service';
import { showToast, showAlert } from '../../components/AppToast';
import { Calendar, Plus, Trash2, CheckCircle, Loader2, AlertCircle, X } from 'lucide-react';

const InchargeSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', sessionName: '', duration: '', startDate: '', endDate: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadSessions = () => {
    setLoading(true);
    setError(null);
    getInchargeSessions()
      .then(res => setSessions(Array.isArray(res.data) ? res.data : []))
      .catch(err => { console.error(err); setError('Failed to load sessions.'); setSessions([]); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadSessions(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { showToast.error('Session name is required.'); return; }
    setSubmitting(true);
    try {
      await createInchargeSession({
        name: form.name.trim(),
        sessionName: form.sessionName.trim() || form.name.trim(),
        duration: form.duration.trim(),
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined
      });
      showToast.success('Session created and set as active.');
      setShowForm(false);
      setForm({ name: '', sessionName: '', duration: '', startDate: '', endDate: '' });
      loadSessions();
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to create session.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleActivate = (session) => {
    showAlert.confirm('Activate Session', `Set "${session.name}" as the active session?`).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await activateInchargeSession(session.id);
          showToast.success(`"${session.name}" is now active.`);
          loadSessions();
        } catch (err) {
          showToast.error(err?.response?.data?.message || 'Failed to activate session.');
        }
      }
    });
  };

  const handleDelete = (session) => {
    if (session.isActive) { showToast.error('Cannot delete the active session.'); return; }
    showAlert.confirm('Delete Session', `Delete "${session.name}"? This cannot be undone.`, 'Delete', 'Cancel').then(async (res) => {
      if (res.isConfirmed) {
        try {
          await deleteInchargeSession(session.id);
          showToast.success('Session deleted.');
          loadSessions();
        } catch (err) {
          showToast.error(err?.response?.data?.message || 'Failed to delete session.');
        }
      }
    });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">FYP Cycle History</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Manage all FYP academic cycles — create new sessions, activate past ones, and track full cycle history</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm ${showForm ? 'bg-gray-50 text-gray-600 border border-gray-200' : 'bg-btn text-white hover:bg-btn-hover'}`}>
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'New FYP Cycle'}
        </button>
      </div>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-inner">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-btn text-white rounded-xl flex items-center justify-center"><Calendar className="w-5 h-5" /></div>
            <div>
              <h3 className="text-base font-bold text-gray-800">Create New FYP Cycle</h3>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest">New cycles become active immediately</p>
            </div>
          </div>
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5">Cycle Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Spring 2026" className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5">Display Name</label>
                <input type="text" value={form.sessionName} onChange={e => setForm(f => ({ ...f, sessionName: e.target.value }))} placeholder="e.g. SP26" className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5">Duration</label>
                <input type="text" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. Feb 2026 – Jul 2026" className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1.5">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1.5">End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-200/50">
              <button type="submit" disabled={submitting} className="px-8 py-2.5 bg-btn text-white rounded-xl text-xs font-bold shadow-sm hover:bg-btn-hover transition-all cursor-pointer border-0 disabled:opacity-50 flex items-center gap-2">
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {submitting ? 'Creating...' : 'Create & Activate'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Cycle Name</th>
                <th className="py-2.5 px-4">Duration</th>
                <th className="py-2.5 px-4">Start Date</th>
                <th className="py-2.5 px-4">End Date</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right w-[130px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
              {loading ? (
                Array.from({ length: 5 }, (_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }, (_, j) => (
                      <td key={j} className="py-3 px-4"><div className="h-4 rounded-md skeleton" /></td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <AlertCircle className="w-8 h-8" />
                      <p className="text-sm font-bold">{error}</p>
                      <button onClick={loadSessions} className="text-xs text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-0">Retry</button>
                    </div>
                  </td>
                </tr>
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Calendar className="w-8 h-8" />
                      <p className="text-sm font-bold">No FYP cycles created yet.</p>
                      <button onClick={() => setShowForm(true)} className="text-xs text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-0">Create your first cycle</button>
                    </div>
                  </td>
                </tr>
              ) : (
                sessions.map(s => (
                  <tr key={s.id} className={`hover:bg-blue-50/30 transition-colors ${s.isActive ? 'bg-emerald-50/30' : ''}`}>
                    <td className="py-2.5 px-4 font-bold text-slate-900 text-sm">{s.name}</td>
                    <td className="py-2.5 px-4 text-slate-500 text-xs">{s.duration || '-'}</td>
                    <td className="py-2.5 px-4 text-slate-500 text-xs">{s.startDate ? new Date(s.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</td>
                    <td className="py-2.5 px-4 text-slate-500 text-xs">{s.endDate ? new Date(s.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</td>
                    <td className="py-2.5 px-4">
                      {s.isActive ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg w-fit">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">Archived</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        {!s.isActive && (
                          <button onClick={() => handleActivate(s)} className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold transition-all hover:bg-emerald-100 cursor-pointer flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Activate
                          </button>
                        )}
                        <button onClick={() => handleDelete(s)} className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold transition-all hover:bg-rose-100 cursor-pointer flex items-center gap-1 disabled:opacity-30" disabled={s.isActive} title={s.isActive ? 'Cannot delete active session' : 'Delete session'}>
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default InchargeSessions;

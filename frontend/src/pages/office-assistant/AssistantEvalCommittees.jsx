import React, { useEffect, useState } from 'react';
import { showToast } from '../../components/AppToast';
import { Info, Lock, Loader2 } from 'lucide-react';
import api from '../../services/api';

const AssistantEvalCommittees = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [committees, setCommittees] = useState([]);
  const [faculty, setFaculty] = useState([]);

  const [form, setForm] = useState({
    name: '',
    head: '',
    members: [],
    type: 'evaluation',
    milestone: ''
  });

  useEffect(() => {
    Promise.all([
      api.get('/office-assistant/eval-committee'),
      api.get('/office-assistant/faculty')
    ]).then(([commRes, facRes]) => {
      setCommittees(commRes.data?.data || []);
      setFaculty(facRes.data?.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.head || form.members.length === 0) {
      showToast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/committees', form);
      showToast.success('Committee created successfully!');
      setForm({ name: '', head: '', members: [], type: 'evaluation', milestone: '' });
      const res = await api.get('/office-assistant/eval-committee');
      setCommittees(res.data?.data || []);
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to create committee.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMembersChange = (e) => {
    const opts = [...e.target.options].filter(o => o.selected).map(o => o.value);
    setForm(f => ({ ...f, members: opts }));
  };

  return (
    <>
      <div className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">FYP Evaluation Committee Management</h2>
        <p className="text-xs text-slate-900 mt-0.5 font-medium">Configure FYP-1 & FYP-2 boards, enforce 50% rotation rules, monitor workload counters, and manage milestone locks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {loading ? (
          <div className="lg:col-span-3 flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-sm text-slate-900 font-medium">Loading...</span>
          </div>
        ) : (
          <>
        <div className="lg:col-span-2 bg-white rounded-2xl border border-line shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-line">Configure Evaluation Board</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Committee Name</label>
                <input
                  type="text"
                  placeholder="e.g. FEC-FYP1-A"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Milestone Window</label>
                <select
                  value={form.milestone}
                  onChange={e => setForm(f => ({ ...f, milestone: e.target.value }))}
                  className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer"
                  required
                >
                  <option value="">Select...</option>
                  <option value="10">10% Milestone</option>
                  <option value="30">30% Milestone</option>
                  <option value="60">60% Milestone</option>
                  <option value="100">100% Final Defense</option>
                  <option value="External">External Evaluation</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                  <span>Assign Committee Head</span>
                  <Info className="text-slate-900 w-4 h-4" />
                </label>
                <select
                  value={form.head}
                  onChange={e => setForm(f => ({ ...f, head: e.target.value }))}
                  className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer"
                  required
                >
                  <option value="">Select Head...</option>
                  {faculty.map(f => (
                    <option key={f.id || f._id} value={f.id || f._id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Assign Members (Multi-select)</label>
                <select
                  multiple
                  value={form.members}
                  onChange={handleMembersChange}
                  className="w-full bg-white border border-line rounded-xl px-4 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer h-24"
                  required
                >
                  {faculty.map(f => (
                    <option key={f.id || f._id} value={f.id || f._id}>{f.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-900 mt-1 font-bold">Hold Ctrl/Cmd to select multiple members</p>
              </div>
            </div>

            <div className="pt-4 border-t border-line flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Committee Configuration'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-line shadow-sm p-6 space-y-5">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-line">Active Boards</h3>
          {committees.length === 0 ? (
            <p className="text-xs text-gray-400 font-medium text-center py-6">No evaluation boards configured yet.</p>
          ) : (
            committees.map(c => (
              <div key={c.id} className="p-4 rounded-2xl bg-white border border-line flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm mb-0.5 flex items-center gap-2">
                    <span>{c.name}</span>
                    {c.status === 'locked' && <Lock className="w-4 h-4 text-xs" title="Locked" />}
                  </div>
                  <div className="text-xs text-slate-900 font-medium">Head: {c.head}</div>
                  {c.schedule && <div className="text-[10px] text-gray-400 mt-0.5">{c.schedule}</div>}
                </div>
                <span className={`font-bold text-[10px] px-2.5 py-1 rounded-lg border ${c.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                  {c.status === 'active' ? 'Active' : 'Locked'}
                </span>
              </div>
            ))
          )}
        </div>
        </>
        )}
      </div>
    </>
  );
};

export default AssistantEvalCommittees;

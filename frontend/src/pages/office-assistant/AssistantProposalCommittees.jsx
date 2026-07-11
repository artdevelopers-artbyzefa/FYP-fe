import React, { useEffect, useState } from 'react';
import { showToast } from '../../components/AppToast';
import { Bot, Loader2 } from 'lucide-react';
import api from '../../services/api';

const AssistantProposalCommittees = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [committees, setCommittees] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [proposals, setProposals] = useState([]);

  const [form, setForm] = useState({
    name: '',
    researchArea: '',
    head: '',
    members: [],
    type: 'proposal'
  });

  useEffect(() => {
    Promise.all([
      api.get('/office-assistant/proposal-committee'),
      api.get('/office-assistant/faculty'),
      api.get('/proposals')
    ]).then(([commRes, facRes, propRes]) => {
      setCommittees(commRes.data?.data || []);
      setFaculty(facRes.data?.data || []);
      setProposals(propRes.data?.data || []);
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
      await api.post('/committees', {
        name: form.name,
        researchArea: form.researchArea,
        head: form.head,
        members: form.members,
        type: 'proposal'
      });
      showToast.success('Committee created successfully!');
      setForm({ name: '', researchArea: '', head: '', members: [], type: 'proposal' });
      const res = await api.get('/office-assistant/proposal-committee');
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

  const handleAssign = async () => {
    showToast.success('Proposal assigned to committee (API integration pending).');
  };

  const handlePublish = async () => {
    showToast.success('Meeting schedule published!');
  };

  return (
    <>
      <div className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Proposal Evaluation Committee Management</h2>
        <p className="text-xs text-slate-900 mt-0.5 font-medium">Create evaluation boards, leverage AI-assisted faculty matching, assign pending proposals, and publish schedules</p>
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
          <h3 className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-line">Create Proposal Committee</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Committee Name</label>
                <input
                  type="text"
                  placeholder="e.g. PEC-1 (AI & Vision)"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Research Area / Track</label>
                <input
                  type="text"
                  placeholder="e.g. Artificial Intelligence"
                  value={form.researchArea}
                  onChange={e => setForm(f => ({ ...f, researchArea: e.target.value }))}
                  className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Assign Committee Head</label>
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
                className="bg-btn hover:bg-btn-hover text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Committee'}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-line">
            <h3 className="text-base font-bold text-slate-900 mb-4">Assign Pending Proposals & Publish Schedule</h3>
            <div className="bg-white rounded-2xl p-5 border border-line space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="w-full sm:w-1/2">
                  <label className="block text-xs font-bold text-slate-900 mb-1">Select Proposal</label>
                  <select className="w-full bg-white border border-line rounded-xl px-4 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer">
                    {proposals.length === 0 ? (
                      <option>No proposals available</option>
                    ) : (
                      proposals.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))
                    )}
                  </select>
                </div>
                <div className="w-full sm:w-1/2">
                  <label className="block text-xs font-bold text-slate-900 mb-1">Target Committee</label>
                  <select className="w-full bg-white border border-line rounded-xl px-4 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer">
                    {committees.length === 0 ? (
                      <option>No committees available</option>
                    ) : (
                      committees.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button onClick={handleAssign} className="bg-btn hover:bg-btn-hover text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer">Assign Proposal</button>
                <button onClick={handlePublish} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer">Publish Schedule</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-line shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-line">
            <Bot className="text-slate-900 text-lg" />
            <h3 className="text-sm font-bold text-slate-900">Existing Committees</h3>
          </div>
          {committees.length === 0 ? (
            <p className="text-xs text-gray-400 font-medium text-center py-6">No proposal committees created yet.</p>
          ) : (
            <div className="space-y-4">
              {committees.map(c => (
                <div key={c.id} className="p-3 rounded-xl bg-white border border-line">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900 text-xs">{c.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${c.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.status || 'active'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-900 font-medium">Head: {c.head}</p>
                  <p className="text-[10px] text-gray-400">{c.members?.length || 0} members</p>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
        )}
      </div>
    </>
  );
};

export default AssistantProposalCommittees;

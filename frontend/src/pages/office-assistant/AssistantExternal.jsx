import React, { useEffect, useState } from 'react';
import { getOfficeExternal } from '../../services/office-assistant.service';
import { showToast } from '../../components/AppToast';
import { UserPlus, X, Loader2 } from 'lucide-react';
import api from '../../services/api';

const AssistantExternal = () => {
  const [evaluators, setEvaluators] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getOfficeExternal(),
      api.get('/office-assistant/projects')
    ]).then(([extRes, projRes]) => {
      setEvaluators(extRes.data || []);
      setProjects(projRes.data?.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      windowStart: formData.get('windowStart'),
      windowEnd: formData.get('windowEnd')
    };
    try {
      await api.post('/office-assistant/external', payload);
      showToast.success('Evaluator account created!');
      setIsCreateOpen(false);
      const res = await getOfficeExternal();
      setEvaluators(res.data || []);
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to create evaluator.');
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      projectId: formData.get('projectId'),
      evaluatorId: formData.get('evaluatorId')
    };
    try {
      await api.post('/office-assistant/external/assign', payload);
      showToast.success('Project allocated to evaluator successfully!');
      setIsAssignOpen(false);
      const res = await getOfficeExternal();
      setEvaluators(res.data || []);
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to allocate project.');
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">External & Industry Supervisor Management</h2>
          <p className="text-xs text-slate-900 mt-0.5 font-medium">Create temporary evaluator accounts, set evaluation windows, and allocate project assignments</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
          <UserPlus className="w-4 h-4" /> Create Temporary Evaluator
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 border-b border-line text-[11px] font-bold text-slate-900 tracking-wider">
                <th className="py-3.5 px-6">Evaluator Name</th>
                <th className="py-3.5 px-6">Email Address</th>
                <th className="py-3.5 px-6">Evaluation Window</th>
                <th className="py-3.5 px-6">Assigned Project</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-900">
              {loading
                ? Array.from({ length: 5 }, (_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 6 }, (_, j) => (
                        <td key={j} className="py-4 px-6"><div className="h-4 rounded-md skeleton w-24" /></td>
                      ))}
                    </tr>
                  ))
                : evaluators.length === 0
                  ? <tr><td colSpan={6} className="py-8 text-center text-sm text-gray-400 font-medium">No external evaluators registered yet.</td></tr>
                  : evaluators.map(ev => (
                <tr key={ev.id} className="hover:bg-white/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{ev.name}</td>
                  <td className="py-4 px-6 text-slate-900">{ev.email}</td>
                  <td className="py-4 px-6 text-slate-900 font-mono text-xs">{ev.window}</td>
                  <td className={`py-4 px-6 truncate max-w-xs ${ev.project === 'Unassigned' || !ev.project ? 'text-gray-400 italic' : 'text-gray-600'}`}>{ev.project || 'Unassigned'}</td>
                  <td className="py-4 px-6">
                    <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border ${ev.status === 'Allocated' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-400 border-gray-200'}`}>
                      {ev.status || 'Unallocated'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {ev.status === 'Allocated' ? (
                      <button onClick={() => showToast.success('Notification email dispatched!')} className="px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-line text-xs font-bold transition-all cursor-pointer">Notify</button>
                    ) : (
                      <button onClick={() => setIsAssignOpen(true)} className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all cursor-pointer shadow-sm">Assign Project</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 bg-blue-600/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-line">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-line">
              <h3 className="text-lg font-bold text-slate-900">Create Temporary Evaluator Account</h3>
              <X className="w-4 h-4 cursor-pointer text-lg" onClick={() => setIsCreateOpen(false)} />
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Evaluator Full Name</label>
                <input type="text" name="name" placeholder="e.g. Dr. Usman Qureshi" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Email Address</label>
                <input type="email" name="email" placeholder="evaluator@cuiatd.edu.pk" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Evaluation Window Start</label>
                  <input type="date" name="windowStart" className="w-full bg-white border border-line rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 cursor-pointer" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Evaluation Window End</label>
                  <input type="date" name="windowEnd" className="w-full bg-white border border-line rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 cursor-pointer" required />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 hover:bg-white transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAssignOpen && (
        <div className="fixed inset-0 bg-blue-600/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-line">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-line">
              <h3 className="text-lg font-bold text-slate-900">Allocate Project to Evaluator</h3>
              <X className="w-4 h-4 cursor-pointer text-lg" onClick={() => setIsAssignOpen(false)} />
            </div>
            <form onSubmit={handleAssign} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Select Evaluator</label>
                <select name="evaluatorId" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer" required>
                  <option value="">Select evaluator...</option>
                  {evaluators.filter(e => e.status !== 'Allocated').map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Select Project</label>
                <select name="projectId" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer" required>
                  <option value="">Select project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button type="button" onClick={() => setIsAssignOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 hover:bg-white transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer">Confirm Allocation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantExternal;

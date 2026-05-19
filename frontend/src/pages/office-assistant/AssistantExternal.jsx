import React, { useEffect, useState } from 'react';
import { getOfficeExternal } from '../../services/office-assistant.service';
import { showToast } from '../../components/AppToast';

const AssistantExternal = () => {
  const [evaluators, setEvaluators] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  useEffect(() => {
    getOfficeExternal().then(res => setEvaluators(res.data)).catch(console.error);
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    showToast.success('Evaluator account created!');
    setIsCreateOpen(false);
  };

  const handleAssign = (e) => {
    e.preventDefault();
    showToast.success('Project allocated to evaluator successfully!');
    setIsAssignOpen(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-800">External & Industry Supervisor Management</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Create temporary evaluator accounts, set evaluation windows, and allocate project assignments</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="bg-secondary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer">
          <i className="fas fa-user-plus"></i> Create Temporary Evaluator
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Evaluator Name</th>
                <th className="py-3.5 px-6">Email Address</th>
                <th className="py-3.5 px-6">Evaluation Window</th>
                <th className="py-3.5 px-6">Assigned Project</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
              {evaluators.map(ev => (
                <tr key={ev.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-900">{ev.name}</td>
                  <td className="py-4 px-6 text-gray-600">{ev.email}</td>
                  <td className="py-4 px-6 text-gray-600 font-mono text-xs">{ev.window}</td>
                  <td className={`py-4 px-6 truncate max-w-xs ${ev.project === 'Unassigned' ? 'text-gray-400 italic' : 'text-gray-600'}`}>{ev.project}</td>
                  <td className="py-4 px-6">
                    <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border ${ev.status === 'Allocated' ? 'bg-success/10 text-success border-success/20' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {ev.status === 'Allocated' ? (
                      <button onClick={() => showToast.success('Notification email dispatched!')} className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-secondary border border-gray-200 text-xs font-bold transition-all cursor-pointer">Notify</button>
                    ) : (
                      <button onClick={() => setIsAssignOpen(true)} className="px-3 py-1.5 rounded-lg bg-secondary text-white font-bold text-xs transition-all cursor-pointer shadow-sm hover:bg-blue-700">Assign Project</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-50">
              <h3 className="text-lg font-black text-gray-900">Create Temporary Evaluator Account</h3>
              <i className="fas fa-times text-gray-400 hover:text-gray-600 cursor-pointer text-lg" onClick={() => setIsCreateOpen(false)}></i>
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Evaluator Full Name</label>
                <input type="text" placeholder="e.g. Dr. Usman Qureshi" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-secondary focus:bg-white transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                <input type="email" placeholder="evaluator@cuiatd.edu.pk" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-secondary focus:bg-white transition-all" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Evaluation Window Start</label>
                  <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-secondary cursor-pointer" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Evaluation Window End</label>
                  <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-secondary cursor-pointer" required />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-secondary hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all cursor-pointer">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAssignOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-50">
              <h3 className="text-lg font-black text-gray-900">Allocate Project to Evaluator</h3>
              <i className="fas fa-times text-gray-400 hover:text-gray-600 cursor-pointer text-lg" onClick={() => setIsAssignOpen(false)}></i>
            </div>
            <form onSubmit={handleAssign} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Select Project</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 outline-none focus:border-secondary cursor-pointer" required>
                  <option value="Federated Learning for Medical Diagnosis">Federated Learning for Medical Diagnosis</option>
                  <option value="Smart Energy Management Using IoT">Smart Energy Management Using IoT</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <button type="button" onClick={() => setIsAssignOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-secondary hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all cursor-pointer">Confirm Allocation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantExternal;

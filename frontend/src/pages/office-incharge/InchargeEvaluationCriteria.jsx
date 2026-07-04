import { useEffect, useState } from 'react';
import { getInchargeEvaluationCriteria, createEvaluationCriterion, updateEvaluationCriterion, deleteEvaluationCriterion } from '../../services/office-incharge.service';
import { showToast, showAlert } from '../../components/AppToast';
import { CheckSquare, Plus, Trash2, Pencil, Loader2, AlertCircle } from 'lucide-react';

const defaultForm = { title: '', weightage: '', maxMarks: '', description: '', status: 'active' };

const InchargeEvaluationCriteria = () => {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...defaultForm });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getInchargeEvaluationCriteria()
      .then(res => setCriteria(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to load evaluation criteria.'))
      .finally(() => setLoading(false));
  }, []);

  const refetch = () => {
    getInchargeEvaluationCriteria()
      .then(res => setCriteria(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to load evaluation criteria.'));
  };

  const resetForm = () => {
    setForm({ ...defaultForm });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title || '',
      weightage: item.weightage?.toString() || '',
      maxMarks: item.maxMarks?.toString() || '',
      description: item.description || '',
      status: item.status || 'active',
    });
    setEditingId(item.id || item._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { showToast.error('Title is required.'); return; }
    if (!form.weightage || isNaN(Number(form.weightage))) { showToast.error('Valid weightage is required.'); return; }
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        weightage: Number(form.weightage),
        maxMarks: form.maxMarks ? Number(form.maxMarks) : undefined,
        description: form.description.trim() || undefined,
        status: form.status,
      };
      if (editingId) {
        await updateEvaluationCriterion(editingId, payload);
        showToast.success('Criterion updated.');
      } else {
        await createEvaluationCriterion(payload);
        showToast.success('Criterion created.');
      }
      resetForm();
      refetch();
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to save criterion.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (item) => {
    showAlert.confirm(
      'Delete Criterion',
      `Delete "${item.title}"? This cannot be undone.`,
      'Delete',
      'Cancel'
    ).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await deleteEvaluationCriterion(item.id || item._id);
          showToast.success('Criterion deleted.');
          refetch();
        } catch (err) {
          showToast.error(err?.response?.data?.message || 'Failed to delete.');
        }
      }
    });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Evaluation Criteria</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Define criteria used to evaluate FYP projects — set titles, weightage, and maximum marks.</p>
        </div>
        <button onClick={() => { if (!showForm) resetForm(); setShowForm(!showForm); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm ${showForm ? 'bg-gray-50 text-gray-600 border border-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'New Criterion'}
        </button>
      </div>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? 'max-h-[600px] opacity-100 mb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-inner">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center"><CheckSquare className="w-5 h-5" /></div>
            <div>
              <h3 className="text-base font-bold text-gray-800">{editingId ? 'Edit Criterion' : 'New Evaluation Criterion'}</h3>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest">{editingId ? 'Update the criterion details' : 'Define a new evaluation criterion'}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5">Criterion Title *</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Problem Statement & Relevance" className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5">Weightage (%) *</label>
                <input type="number" value={form.weightage} onChange={e => setForm(f => ({ ...f, weightage: e.target.value }))} placeholder="e.g. 30" className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" min="1" max="100" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5">Maximum Marks</label>
                <input type="number" value={form.maxMarks} onChange={e => setForm(f => ({ ...f, maxMarks: e.target.value }))} placeholder="e.g. 100" className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" min="1" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description of what this criterion evaluates..." className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all h-20 resize-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-200/50">
              <button type="submit" disabled={submitting} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 transition-all cursor-pointer border-0 disabled:opacity-50 flex items-center gap-2">
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {submitting ? 'Saving...' : editingId ? 'Update Criterion' : 'Create Criterion'}
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
                <th className="py-2.5 px-4">Title</th>
                <th className="py-2.5 px-4">Weightage</th>
                <th className="py-2.5 px-4">Max Marks</th>
                <th className="py-2.5 px-4">Description</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right w-[120px]">Actions</th>
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
                      <button onClick={refetch} className="text-xs text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-0">Retry</button>
                    </div>
                  </td>
                </tr>
              ) : criteria.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <CheckSquare className="w-8 h-8" />
                      <p className="text-sm font-bold">No evaluation criteria defined yet.</p>
                      <button onClick={() => { resetForm(); setShowForm(true); }} className="text-xs text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-0">Create your first criterion</button>
                    </div>
                  </td>
                </tr>
              ) : (
                criteria.map((item) => (
                  <tr key={item.id || item._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-slate-900 text-sm">{item.title}</td>
                    <td className="py-2.5 px-4"><span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">{item.weightage}%</span></td>
                    <td className="py-2.5 px-4 text-slate-500 text-xs">{item.maxMarks ?? '-'}</td>
                    <td className="py-2.5 px-4 text-slate-500 text-xs max-w-[200px] truncate">{item.description || '-'}</td>
                    <td className="py-2.5 px-4">
                      {item.status === 'active' ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg w-fit">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">Inactive</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleEdit(item)} className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border-0 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-all" title="Edit">
                          <Pencil size={11} />
                        </button>
                        <button onClick={() => handleDelete(item)} className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 border-0 flex items-center justify-center cursor-pointer hover:bg-rose-100 transition-all" title="Delete">
                          <Trash2 size={11} />
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

export default InchargeEvaluationCriteria;

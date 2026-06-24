import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getFacultyWorkload, updateHodFaculty } from '../../services/hod.service';
import { showToast } from '../../components/AppToast';
import { Pencil, Loader2, AlertCircle, Search, X } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const complianceBadge = (status) => {
  switch (status) {
    case 'Compliant': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Partial': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Non-Compliant': return 'bg-rose-50 text-rose-600 border-rose-200';
    default: return 'bg-slate-50 text-slate-500 border-slate-200';
  }
};

const HodFacultyOversight = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editFaculty, setEditFaculty] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', facultyType: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadFaculty = () => {
    setLoading(true);
    setError(null);
    getFacultyWorkload().then((res) => {
      setFaculty(Array.isArray(res.data) ? res.data : []);
    }).catch(err => {
      console.error(err);
      setError('Failed to load faculty data.');
      setFaculty([]);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadFaculty(); }, []);

  const handleEdit = (f) => {
    setEditFaculty(f);
    setEditForm({
      name: f.name || '',
      email: f.email || '',
      facultyType: f.designation?.toLowerCase() || 'supervisor'
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim()) {
      showToast.error('Name and email are required.');
      return;
    }
    setSubmitting(true);
    try {
      await updateHodFaculty(editFaculty.id, {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        facultyType: editForm.facultyType
      });
      showToast.success('Faculty updated successfully.');
      setEditFaculty(null);
      loadFaculty();
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to update faculty.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="border-b border-line pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Faculty Workload & Performance Oversight</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Monitor faculty supervision caps, research alignment tags, and weekly meeting log compliance</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
        <div className="p-4 bg-white border-b border-line flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Supervision Load Distribution</h3>
          <span className="text-xs font-medium text-slate-400">{faculty.length} faculty</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Faculty Member</th>
                <th className="py-2.5 px-4">Designation</th>
                <th className="py-2.5 px-4 text-center">Load</th>
                <th className="py-2.5 px-4">Research Alignment</th>
                <th className="py-2.5 px-4 text-center">Meeting Compliance</th>
                <th className="py-2.5 px-4 text-right w-[60px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
              {loading ? (
                Array.from({ length: 6 }, (_, i) => (
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
                      <button onClick={loadFaculty} className="text-xs text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-0">Retry</button>
                    </div>
                  </td>
                </tr>
              ) : faculty.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-slate-400 font-medium">No faculty data available</td>
                </tr>
              ) : (
                faculty.map(f => (
                  <tr key={f.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-slate-900 text-sm">{f.name}</td>
                    <td className="py-2.5 px-4 text-xs text-slate-500 font-medium">{f.designation}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`font-bold text-xs px-2 py-0.5 rounded-lg border ${f.slots >= 6 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-slate-700 border-slate-200'}`}>
                        {f.slots}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(f.research) && f.research.length > 0
                          ? f.research.map((tag, idx) => (
                              <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-medium">{tag}</span>
                            ))
                          : <span className="text-[10px] text-slate-400 italic">No tags</span>
                        }
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${complianceBadge(f.compliance)}`}>
                        {f.compliance || 'Unknown'}
                      </span>
                      {f.complianceScore !== undefined && (
                        <span className="ml-1 text-[9px] text-slate-400 font-medium">({f.complianceScore}%)</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button onClick={() => handleEdit(f)} className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold transition-all hover:bg-blue-100 cursor-pointer flex items-center gap-1">
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {editFaculty && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Edit Faculty</h3>
              <button onClick={() => setEditFaculty(null)} className="w-8 h-8 rounded-lg bg-gray-50 border-0 flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Full Name</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Email</label>
                <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Designation</label>
                <select value={editForm.facultyType} onChange={e => setEditForm(f => ({ ...f, facultyType: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:border-primary cursor-pointer">
                  <option value="supervisor">Supervisor</option>
                  <option value="committee">Committee</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setEditFaculty(null)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer border-0">Cancel</button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 transition-all cursor-pointer border-0 disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HodFacultyOversight;

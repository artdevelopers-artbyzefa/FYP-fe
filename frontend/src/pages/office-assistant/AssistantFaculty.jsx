import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOfficeFaculty, deleteOfficeFaculty, sendFacultyInvite } from '../../services/office-assistant.service';
import { showToast, showAlert } from '../../components/AppToast';
import { Search, Send, Trash2, Pencil, ArrowLeft, ArrowRight, Plus, CheckSquare, Square, X } from 'lucide-react';

export default function AssistantFaculty() {
  const navigate = useNavigate();
  const location = useLocation();
  const isIncharge = location.pathname.includes('/office-incharge/');
  const basePath = isIncharge ? '/office-incharge' : '/office-assistant';

  const [faculty, setFaculty] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', facultyType: 'supervisor', phone: '' });
  const [adding, setAdding] = useState(false);
  const limit = 20;
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleSelectAll = () => setSelectedIds(prev => prev.length === faculty.length ? [] : faculty.map(f => f.id));

  const handleBulkDelete = async () => {
    if (!window.confirm(`PERMANENTLY DELETE ${selectedIds.length} faculty?`)) return;
    if (!window.confirm('FINAL WARNING: This cannot be undone.')) return;
    let ok = 0;
    for (const id of selectedIds) {
      try { await deleteOfficeFaculty(id); ok++; } catch {}
    }
    showToast.success('Done', `${ok} deleted`);
    setSelectedIds([]);
    loadFaculty(page);
  };

  const loadFaculty = useCallback((p) => {
    setLoading(true);
    getOfficeFaculty(p || page, limit, search, typeFilter, statusFilter).then(res => {
      setFaculty(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [page, search, typeFilter, statusFilter]);

  useEffect(() => { loadFaculty(page); }, [page]);
  useEffect(() => { const t = setTimeout(() => { setPage(1); loadFaculty(1); }, 400); return () => clearTimeout(t); }, [search, typeFilter, statusFilter]);

  const handleDelete = (f) => {
    showAlert.confirm('Delete Faculty', `Permanently delete ${f.name}?`, 'Delete', 'Cancel').then(async (res) => {
      if (res.isConfirmed) { try { await deleteOfficeFaculty(f.id); showToast.success(`${f.name} deleted.`); loadFaculty(page); } catch (err) { showToast.error('Failed to delete.'); } }
    });
  };

  const handleResend = async (f) => {
    try { await sendFacultyInvite(f.id); showToast.success(`Invitation resent to ${f.email}`); } catch (err) { showToast.error('Failed to resend.'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Faculty Profiles</h2>
          <p className="text-xs text-slate-900 mt-0.5 font-medium">Supervisor & Committee Faculty</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-xs hover:bg-blue-800 transition-all cursor-pointer border-0">
            <Plus className="w-4 h-4" /> Add Faculty
          </button>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-white border border-line rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer">
            <option value="">All Types</option><option value="committee">Committee</option><option value="supervisor">Supervisor</option><option value="both">Both</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-white border border-line rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer">
            <option value="">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="relative w-full sm:w-80">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search faculty name or email..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-line rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
      </div>

      {showAdd && (
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (!addForm.name || !addForm.email) return;
          setAdding(true);
          try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/office-assistant/faculty', {
              method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ name: addForm.name, email: addForm.email, facultyType: addForm.facultyType, phone: addForm.phone })
            });
            const data = await res.json();
            if (data.success) {
              showToast.success('Faculty added. Invitation email sent.');
              setShowAdd(false);
              setAddForm({ name: '', email: '', facultyType: 'supervisor', phone: '' });
              loadFaculty(page);
            } else showToast.error(data.message || 'Failed to add faculty');
          } catch { showToast.error('Failed to add faculty'); }
          setAdding(false);
        }} className="bg-blue-50/50 rounded-2xl border border-blue-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Add New Faculty</h3>
            <button type="button" onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-blue-100 cursor-pointer border-0 bg-transparent text-slate-500"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Full Name *</label>
              <input type="text" placeholder="Faculty name" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Email *</label>
              <input type="email" placeholder="@cuiatd.edu.pk" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Type</label>
              <select value={addForm.facultyType} onChange={e => setAddForm(f => ({ ...f, facultyType: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer">
                <option value="supervisor">Supervisor</option><option value="committee">Committee</option><option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Phone</label>
              <input type="text" placeholder="Optional" value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-white cursor-pointer border-0">Cancel</button>
            <button type="submit" disabled={adding || !addForm.name || !addForm.email} className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-navy-dark cursor-pointer border-0 disabled:opacity-50">
              {adding ? 'Adding...' : 'Add Faculty'}
            </button>
          </div>
        </form>
      )}

      {selectedIds.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-sm font-bold text-primary">{selectedIds.length} selected</span>
          <div className="flex gap-2">
            <button onClick={handleBulkDelete} className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer border-0 flex items-center gap-1.5">
              <Trash2 size={14} /> Delete Selected
            </button>
            <button onClick={() => setSelectedIds([])} className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-500 text-xs font-bold hover:bg-gray-50 cursor-pointer flex items-center gap-1.5">
              <X size={14} /> Clear
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-line">
                <th className="w-10 px-3 py-3">
                  <button onClick={toggleSelectAll} className="cursor-pointer border-0 bg-transparent p-0 text-slate-400 hover:text-primary transition-colors" title="Select all">
                    {selectedIds.length === faculty.length && faculty.length > 0 ? <CheckSquare size={15} /> : <Square size={15} />}
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? Array.from({ length: 5 }, (_, i) => (
                <tr key={i} className="animate-pulse">{Array.from({ length: 6 }, (_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-200 rounded w-3/4" /></td>)}</tr>
              )) : faculty.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400 text-sm font-bold">No faculty found</td></tr>
              ) : faculty.map(f => (
                <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                    <button onClick={() => toggleSelect(f.id)} className="cursor-pointer border-0 bg-transparent p-0 text-slate-400 hover:text-primary transition-colors">
                      {selectedIds.includes(f.id) ? <CheckSquare size={15} className="text-primary" /> : <Square size={15} />}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900 text-sm">{f.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{f.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${f.facultyType === 'committee' ? 'bg-purple-50 text-purple-700 border-purple-200' : f.facultyType === 'supervisor' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{f.facultyType}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${f.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>{f.active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => navigate(`${basePath}/faculty/${f.id}`)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold hover:bg-blue-100 cursor-pointer flex items-center gap-1">
                        <Pencil size={12} /> View
                      </button>
                      {!f.active && (
                        <button onClick={(e) => { e.stopPropagation(); handleResend(f); }}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold hover:bg-amber-100 cursor-pointer flex items-center gap-1">
                          <Send size={12} /> Invite
                        </button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(f); }}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold hover:bg-red-100 cursor-pointer flex items-center gap-1">
                        <Trash2 size={12} /> Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">{total} total faculty</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="p-2 rounded-xl border border-line text-slate-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"><ArrowLeft size={14} /></button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 3, totalPages - 6)), pg = start + i;
              if (pg > totalPages) return null;
              return <button key={pg} onClick={() => setPage(pg)} className={`w-9 h-9 rounded-xl text-xs font-bold ${pg === page ? 'bg-primary text-white' : 'border border-line text-slate-500 hover:bg-white'} cursor-pointer`}>{pg}</button>;
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="p-2 rounded-xl border border-line text-slate-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"><ArrowRight size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

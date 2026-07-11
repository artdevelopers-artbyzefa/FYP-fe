import React, { useEffect, useState, useCallback } from 'react';
import { getOfficeFaculty, deleteOfficeFaculty, sendFacultyInvite, updateOfficeFaculty } from '../../services/office-assistant.service';
import { showToast, showAlert } from '../../components/AppToast';
import { Search, Send, Trash2, Pencil, ArrowLeft, ArrowRight, ChevronRight, Loader2, Mail, Users, CheckCircle, XCircle, Star } from 'lucide-react';
import { GROUP_STATUS_MAP } from '../../utils/constants/status.constant';
import apiClient from '../../api/apiClient';

const TYPE_COLORS = { committee: 'bg-purple-50 text-purple-700 border-purple-200', supervisor: 'bg-blue-50 text-blue-700 border-blue-200', both: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
const PRIORITY_LABELS = { 1: '1st Choice', 2: '2nd Choice', 3: '3rd Choice' };

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[1,2,3,4,5,6,7].map(i => (
        <td key={i} className="px-4 py-3"><div className="h-4 bg-slate-200 rounded w-3/4" /></td>
      ))}
    </tr>
  );
}

export default function AssistantFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const limit = 20;
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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
      if (res.isConfirmed) { try { await deleteOfficeFaculty(f.id); showToast.success(`${f.name} deleted.`); loadFaculty(page); } catch (err) { showToast.error(err?.response?.data?.message || 'Failed to delete.'); } }
    });
  };

  if (view === 'detail' && selected) {
    return <FacultyDetail facultyId={selected.id} onBack={() => { setView('list'); setSelected(null); }} onUpdate={() => loadFaculty(page)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Faculty Profiles</h2>
          <p className="text-xs text-slate-900 mt-0.5 font-medium">Supervisor & Committee Faculty profiles with group oversight</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
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

      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-line">
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Groups</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Preferences</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              ) : faculty.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Users className="w-10 h-10" /><p className="text-sm font-bold">No faculty found</p>
                      <p className="text-xs">Try adjusting your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                faculty.map(f => (
                  <tr key={f.id} onClick={() => { setSelected(f); setView('detail'); }} className={`hover:bg-slate-50 transition-colors cursor-pointer ${!f.active ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${f.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {f.name?.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('') || '?'}
                        </div>
                        <span className="text-sm font-bold text-slate-900">{f.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{f.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap ${TYPE_COLORS[f.facultyType] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{f.facultyType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">{f.proposed + f.inProgress}</span>
                        <span className="text-[9px] text-slate-400">({f.proposed} pend, {f.inProgress} act)</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {f.preferences?.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star size={11} className="text-amber-400" />
                          <span className="text-xs text-slate-600">{f.preferences.map(p => p.field).join(', ')}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {f.active ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600"><CheckCircle size={11} /> Active</span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><XCircle size={11} /> Inactive</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-blue-600 text-[10px] font-bold flex items-center justify-end gap-0.5">View <ChevronRight size={11} /></span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">{total} total faculty</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="p-2 rounded-xl border border-line text-slate-500 hover:bg-white disabled:opacity-30 cursor-pointer"><ArrowLeft size={14} /></button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 3, totalPages - 6)); const p = start + i;
              if (p > totalPages) return null;
              return <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${p === page ? 'bg-btn text-white' : 'border border-line text-slate-500 hover:bg-blue-50'}`}>{p}</button>;
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="p-2 rounded-xl border border-line text-slate-500 hover:bg-white disabled:opacity-30 cursor-pointer"><ArrowRight size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

function FacultyDetail({ facultyId, onBack, onUpdate }) {
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', facultyType: 'supervisor', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiClient.get(`/office-assistant/faculty/${facultyId}`).then(res => {
      const f = res.data?.data;
      setFaculty(f);
      if (f) setEditForm({ name: f.name || '', email: f.email || '', facultyType: f.facultyType || 'supervisor', phone: f.phone || '' });
    }).catch(() => {}).finally(() => setLoading(false));
  }, [facultyId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateOfficeFaculty(facultyId, {
        name: editForm.name.trim(), email: editForm.email.trim(),
        facultyType: editForm.facultyType, phone: editForm.phone.trim()
      });
      showToast.success('Faculty updated successfully!');
      setEditing(false);
      onUpdate();
    } catch (err) { showToast.error(err?.response?.data?.message || 'Failed to update.'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = () => {
    showAlert.confirm('Delete Faculty', `Permanently delete ${faculty.name}?`, 'Delete', 'Cancel').then(async (res) => {
      if (res.isConfirmed) { try { await deleteOfficeFaculty(facultyId); showToast.success('Faculty deleted.'); onBack(); onUpdate(); } catch (err) { showToast.error('Failed to delete.'); } }
    });
  };

  const handleResendInvite = async () => {
    try { await sendFacultyInvite(facultyId); showToast.success(`Invitation resent to ${faculty.email}`); } catch (err) { showToast.error('Failed to resend.'); }
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-3"><ArrowLeft size={14} /> Back to Faculty Profiles</div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-200 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-slate-200 rounded w-48 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-64 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><div className="h-48 bg-slate-100 rounded-2xl animate-pulse" /></div>
        <div className="space-y-5"><div className="h-32 bg-slate-100 rounded-2xl animate-pulse" /><div className="h-40 bg-slate-100 rounded-2xl animate-pulse" /></div>
      </div>
    </div>
  );
  if (!faculty) return <div className="text-center py-20 text-slate-400">Faculty not found.</div>;

  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3">
          <ArrowLeft size={14} /> Back to Faculty Profiles
        </button>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 ${faculty.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
            {faculty.name?.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('') || '?'}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{faculty.name}</h2>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1"><Mail size={12} /> {faculty.email}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${TYPE_COLORS[faculty.facultyType] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{faculty.facultyType}</span>
              {faculty.active ? <span className="flex items-center gap-1 text-emerald-600"><CheckCircle size={12} /> Active</span> : <span className="flex items-center gap-1 text-slate-400"><XCircle size={12} /> Inactive</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditing(!editing)} className="px-4 py-2 bg-btn text-white text-xs font-bold rounded-xl hover:bg-btn-hover transition-all cursor-pointer border-0 flex items-center gap-1.5"><Pencil size={12} /> {editing ? 'Cancel' : 'Edit'}</button>
            {!faculty.active && <button onClick={handleResendInvite} className="px-4 py-2 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl border border-amber-200 hover:bg-amber-100 transition-all cursor-pointer flex items-center gap-1.5"><Send size={12} /> Resend Invite</button>}
            <button onClick={handleDelete} className="px-4 py-2 bg-white text-rose-600 text-xs font-bold rounded-xl border border-rose-200 hover:bg-rose-50 transition-all cursor-pointer flex items-center gap-1.5"><Trash2 size={12} /> Delete</button>
          </div>
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-line p-6 shadow-sm space-y-5">
          <h5 className="text-xs font-bold text-slate-900 tracking-wider">Edit Faculty Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Full Name *</label>
              <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Email *</label>
              <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Faculty Type</label>
              <select value={editForm.facultyType} onChange={e => setEditForm(f => ({ ...f, facultyType: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer">
                <option value="supervisor">Supervisor</option><option value="committee">Committee</option><option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Phone</label>
              <input type="text" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-line">
            <button type="button" onClick={() => setEditing(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 border border-line hover:bg-gray-50 cursor-pointer">Cancel</button>
            <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-btn text-white rounded-xl text-xs font-bold hover:bg-btn-hover transition-all cursor-pointer disabled:opacity-50">{submitting ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      ) : (
        <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><Users size={13} /> Supervised Groups ({faculty.groups?.length || 0})</h5>
              {faculty.groups?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {faculty.groups.map(g => (
                    <div key={g.id} className="p-4 rounded-xl border border-line">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-bold text-slate-900 text-sm truncate">{g.title}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap ${GROUP_STATUS_MAP[g.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{GROUP_STATUS_MAP[g.status]?.label || g.status}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>Leader: {g.leader}</span>
                        {g.members?.length > 0 && <><span>|</span> <span>{g.members.length} members</span></>}
                      </div>
                      {g.progress > 0 && <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-btn rounded-full" style={{ width: `${g.progress}%` }} /></div>}
                    </div>
                  ))}
                </div>
              ) : <p className="text-xs text-slate-400 py-4 text-center">No groups assigned yet</p>}
            </div>

            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Statistics</h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-center">
                  <p className="text-lg font-black text-blue-700">{faculty.proposed || 0}</p>
                  <p className="text-[9px] font-bold text-blue-500">Pending</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                  <p className="text-lg font-black text-emerald-700">{faculty.inProgress || 0}</p>
                  <p className="text-[9px] font-bold text-emerald-500">Active</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Committee Preferences</h5>
              {faculty.preferences?.length > 0 ? (
                <div className="space-y-2">
                  {faculty.preferences.sort((a, b) => a.priority - b.priority).map(p => (
                    <div key={p.priority} className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                      <span className="text-xs font-bold text-slate-900">{p.field}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${p.priority === 1 ? 'bg-amber-100 text-amber-700 border-amber-200' : p.priority === 2 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{PRIORITY_LABELS[p.priority]}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No preferences set</p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Contact</h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Email</span><span className="font-bold text-slate-900">{faculty.email}</span></div>
                {faculty.phone && <div className="flex justify-between"><span className="text-slate-400">Phone</span><span className="font-bold text-slate-900">{faculty.phone}</span></div>}
                <div className="flex justify-between"><span className="text-slate-400">Type</span><span className={`font-bold px-2 py-0.5 rounded-lg border ${TYPE_COLORS[faculty.facultyType] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{faculty.facultyType}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Status</span>{faculty.active ? <span className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle size={12} /> Active</span> : <span className="font-bold text-slate-400 flex items-center gap-1"><XCircle size={12} /> Inactive</span>}</div>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}

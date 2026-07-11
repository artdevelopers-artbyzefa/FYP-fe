import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { showToast } from '../../components/AppToast';
import {
  Calendar, Clock, Plus, Trash2, Send, CheckCircle, Users,
  RefreshCw, ChevronDown, ChevronUp, X, MapPin, Building2,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  getTimetableSchedules, createTimetableSchedule, getTimetableScheduleById,
  generateTimetableSlots, assignTimetableSlot, unassignTimetableSlot,
  notifyTimetableSlot, deleteTimetableSlots, deleteTimetableSlot,
  publishTimetableSchedule, deleteTimetableSchedule
} from '../../services/office-incharge.service';
import { getInchargeSessions } from '../../services/office-incharge.service';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const DAY_LABELS = { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday' };
const TIMES = [
  { start: '09:00', end: '10:30', label: '09:00 \u2013 10:30' },
  { start: '10:30', end: '12:00', label: '10:30 \u2013 12:00' },
  { start: '12:00', end: '13:30', label: '12:00 \u2013 13:30' },
  { start: '13:30', end: '15:00', label: '13:30 \u2013 15:00' },
  { start: '15:00', end: '16:30', label: '15:00 \u2013 16:30' },
  { start: '16:30', end: '18:00', label: '16:30 \u2013 18:00' },
];

export default function TimetableManagement() {
  const [schedules, setSchedules] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [form, setForm] = useState({ title: '', date: '', session: '', phaseKey: '' });

  const [assigningSlot, setAssigningSlot] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const [schedRes, sessRes] = await Promise.all([getTimetableSchedules(), getInchargeSessions()]);
      setSchedules(schedRes.data || []);
      setSessions(sessRes.data || []);
    } catch { showToast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => { setWeekOffset(0); }, [selectedId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) { showToast.error('Title and date required'); return; }
    try {
      const payload = { title: form.title, date: form.date, phaseKey: form.phaseKey };
      if (form.session) payload.session = form.session;
      await createTimetableSchedule(payload);
      showToast.success('Schedule created');
      setShowCreate(false);
      setForm({ title: '', date: '', session: '', phaseKey: '' });
      load();
    } catch { showToast.error('Failed to create'); }
  };

  const openSched = async (id) => {
    setSelectedId(id);
    setDetailLoading(true);
    setDetail(null);
    setDetailError(null);
    try {
      const body = await getTimetableScheduleById(id);
      setDetail(body.data || body);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load schedule';
      setDetailError(msg);
      showToast.error(msg);
    }
    finally { setDetailLoading(false); }
  };

  const handleGenerate = async (id) => {
    try {
      const res = await generateTimetableSlots(id);
      showToast.success(res.message || 'Generated');
      openSched(id);
    } catch (err) { showToast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleAssign = async (slotId, committeeId, groupId, venue) => {
    try {
      await assignTimetableSlot(slotId, { committeeId, groupId, venue });
      showToast.success('Assigned');
      setAssigningSlot(null);
      setEditMode(false);
      openSched(selectedId);
    } catch { showToast.error('Failed'); }
  };

  const handleUnassign = async (slotId) => {
    try {
      await unassignTimetableSlot(slotId);
      showToast.success('Cleared');
      openSched(selectedId);
    } catch { showToast.error('Failed'); }
  };

  const handleNotify = async (slotId) => {
    try {
      const res = await notifyTimetableSlot(slotId);
      showToast.success(res.message || 'Notified');
      openSched(selectedId);
    } catch (err) { showToast.error(err.response?.data?.message || 'Failed'); }
  };

  const handlePublish = async (id) => {
    try {
      await publishTimetableSchedule(id);
      showToast.success('Published');
      load();
      if (selectedId === id) openSched(id);
    } catch { showToast.error('Failed'); }
  };

  const handleClearSlots = async (id) => {
    try {
      await deleteTimetableSlots(id);
      showToast.success('Cleared');
      openSched(id);
    } catch { showToast.error('Failed'); }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Delete this slot permanently?')) return;
    try {
      await deleteTimetableSlot(slotId);
      showToast.success('Slot deleted');
      setAssigningSlot(null);
      openSched(selectedId);
    } catch { showToast.error('Failed to delete slot'); }
  };

  const handleEditSlot = (slot) => {
    setAssigningSlot(slot);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete permanently?')) return;
    try {
      await deleteTimetableSchedule(id);
      showToast.success('Deleted');
      if (selectedId === id) { setSelectedId(null); setDetail(null); }
      load();
    } catch { showToast.error('Failed'); }
  };

  if (loading) return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-line shadow-sm p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl skeleton" />
            <div className="space-y-2">
              <div className="h-4 w-44 rounded-md skeleton" />
              <div className="h-3 w-64 rounded-md skeleton" />
            </div>
          </div>
          <div className="h-9 w-28 rounded-xl skeleton" />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-line">
          <div className="h-3 w-36 rounded-md skeleton" />
        </div>
        <div className="p-4 flex gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex-shrink-0 w-56 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="h-4 w-14 rounded-full skeleton" />
              <div className="h-4 w-40 rounded-md skeleton" />
              <div className="h-3 w-28 rounded-md skeleton" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const s = detail?.schedule || null;
  const slots = detail?.slots || [];
  const committees = detail?.committees || [];
  const groups = detail?.groups || [];

  const slotMap = {};
  if (slots.length) {
    for (const sl of slots) {
      if (sl) slotMap[sl.day + '|' + sl.startTime] = sl;
    }
  }

  const getMon = (d) => {
    if (!d) return new Date();
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return new Date();
    const day = dt.getDay();
    const diff = dt.getDate() - day + (day === 0 ? -6 : 1);
    dt.setDate(diff);
    dt.setHours(0, 0, 0, 0);
    return dt;
  };

  const fmt = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '';
    return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const fshort = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '';
    return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const baseMon = s ? getMon(s.date) : new Date();
  const dispMon = (() => {
    const d = new Date(baseMon);
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  })();
  const weekDates = DAYS.map((_, i) => {
    const d = new Date(dispMon);
    d.setDate(dispMon.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-line shadow-sm p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Timetable Management</h2>
              <p className="text-[11px] text-slate-500">Manage FYP presentation schedules and slot assignments</p>
            </div>
          </div>
          <button onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-4 py-2.5 bg-btn text-white text-xs font-bold rounded-xl hover:bg-btn-hover cursor-pointer border-0 shadow-sm">
            <Plus size={15} /> New Schedule
          </button>
        </div>
        {showCreate && (
          <form onSubmit={handleCreate} className="mt-5 pt-5 border-t border-line space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Title</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="e.g. Phase 1 Presentations"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Week Starting (Mon)</label>
                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Session (optional)</label>
                <select value={form.session} onChange={e => setForm({...form, session: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all">
                  <option value="">Select session</option>
                  {sessions.length === 0 ? (
                    <option value="" disabled>No sessions available — create one in Sessions page</option>
                  ) : (
                    sessions.map(s => <option key={s.id || s._id} value={s.id || s._id}>{s.name}</option>)
                  )}
                </select>
                {sessions.length === 0 && (
                  <Link to="/office-incharge/sessions" className="text-[10px] text-blue-600 font-bold mt-1.5 inline-block hover:underline">+ Create a session</Link>
                )}
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Phase Key</label>
                <input type="text" value={form.phaseKey} onChange={e => setForm({...form, phaseKey: e.target.value})}
                  placeholder="e.g. proposal_defense"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowCreate(false)}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">Cancel</button>
              <button type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-btn rounded-xl hover:bg-btn-hover cursor-pointer border-0 transition-all shadow-sm">Create</button>
            </div>
          </form>
        )}
      </div>

      {/* SCHEDULE LIST */}
      {schedules.length > 0 && (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-line">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">All Schedules ({schedules.length})</span>
          </div>
          <div className="p-4 overflow-x-auto">
            <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
              {schedules.map(sc => (
                <div key={sc._id}
                  onClick={() => openSched(sc._id)}
                  className={'flex-shrink-0 w-56 p-4 rounded-xl border-2 cursor-pointer transition-all ' + (selectedId === sc._id
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm')}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={'text-[9px] font-bold px-2 py-0.5 rounded-full border ' + (sc.status === 'published'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200')}>{sc.status}</span>
                    {selectedId === sc._id && <CheckCircle size={12} className="text-blue-600" />}
                  </div>
                  <p className="text-xs font-bold text-slate-900 truncate">{sc.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    <Calendar size={10} className="inline mr-1" />
                    {fmt(sc.date)}
                  </p>
                  {sc.session?.name && <p className="text-[10px] text-slate-400 mt-0.5">{sc.session.name}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* UPCOMING EVALUATIONS */}
      {schedules.filter(sc => sc.status === 'published').length > 0 && !selectedId && (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-line">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Upcoming Committee Evaluations</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {schedules.filter(sc => sc.status === 'published').slice(0, 5).map(sc => (
              <div key={sc._id} onClick={() => openSched(sc._id)}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-blue-50/30 cursor-pointer transition-all">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar size={18} className="text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{sc.title}</p>
                  <p className="text-[11px] text-slate-500">
                    {fmt(sc.date)}
                    {sc.session?.name && <span> &middot; {sc.session.name}</span>}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg whitespace-nowrap">Published</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NO SCHEDULE */}
      {!selectedId && !detailLoading && schedules.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm p-12 text-center">
          <Calendar size={48} className="mx-auto mb-3 text-slate-300" />
          <h3 className="text-base font-bold text-slate-400">No Schedule Selected</h3>
          <p className="text-xs text-slate-400 mt-1">Create a new schedule to get started</p>
        </div>
      )}

      {/* LOADING */}
      {selectedId && detailLoading && (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-line">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl skeleton" />
              <div className="space-y-2">
                <div className="h-4 w-44 rounded-md skeleton" />
                <div className="h-3 w-72 rounded-md skeleton" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-24 rounded-xl skeleton" />
              <div className="h-8 w-20 rounded-xl skeleton" />
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex gap-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex-1 h-8 rounded-lg skeleton" />
              ))}
            </div>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-32 h-20 rounded-lg skeleton" />
                {Array.from({ length: 5 }, (_, j) => (
                  <div key={j} className="flex-1 h-20 rounded-lg skeleton" />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ERROR */}
      {selectedId && !detailLoading && detailError && !detail && (
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8 text-center">
          <div style={{ fontSize: '40px', marginBottom: '12px', color: '#f87171' }}>!</div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#dc2626', marginBottom: '8px' }}>Failed to Load</h3>
          <p style={{ fontSize: '12px', color: '#ef4444', marginBottom: '16px' }}>{detailError}</p>
          <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '16px' }}>Check the browser console (F12) for error details and verify the backend server is running on port 5000.</p>
          <button onClick={() => openSched(selectedId)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#2563eb', color: '#fff', fontSize: '12px', fontWeight: 700, border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* SCHEDULE DETAIL */}
      {s && !detailLoading && (
        <>
          {/* INFO BAR */}
          <div className="bg-white rounded-2xl border border-line shadow-sm p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-3">
                <div className={'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ' + (s.status === 'published' ? 'bg-emerald-100' : 'bg-amber-100')}>
                  <Calendar size={18} className={s.status === 'published' ? 'text-emerald-600' : 'text-amber-600'} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Calendar size={11} /> Week of {fmt(dispMon)}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Building2 size={11} /> Mon \u2013 Fri
                    </span>
                    {s.session?.name && <span className="text-[11px] text-slate-500">{s.session.name}</span>}
                    <span className={'text-[10px] font-bold px-2 py-0.5 rounded-full border ' + (s.status === 'published'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200')}>{s.status}</span>
                    <span className="text-[10px] text-slate-400">{slots.length ? slots.length + ' slots' : 'No slots'}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {!slots.length ? (
                  <button onClick={() => handleGenerate(selectedId)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-btn text-white text-[10px] font-bold rounded-xl hover:bg-btn-hover cursor-pointer border-0 shadow-sm">
                    <RefreshCw size={13} /> Generate Slots
                  </button>
                ) : (
                  <>
                    <button onClick={() => handleClearSlots(selectedId)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 text-[10px] font-bold rounded-xl hover:bg-red-100 cursor-pointer border border-red-200">
                      <Trash2 size={12} /> Clear All
                    </button>
                    {s.status !== 'published' && (
                      <button onClick={() => handlePublish(selectedId)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-[10px] font-bold rounded-xl hover:bg-emerald-700 cursor-pointer border-0 shadow-sm">
                        <CheckCircle size={13} /> Publish
                      </button>
                    )}
                  </>
                )}
                <button onClick={() => handleDelete(selectedId)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white text-red-500 text-[10px] font-bold rounded-xl hover:bg-red-50 cursor-pointer border border-red-200">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </div>

          {/* COMMITTEE EVALUATION SUMMARY */}
          {!assigningSlot && committees.length > 0 && (
            <div className="bg-white rounded-2xl border border-line shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users size={14} className="text-slate-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Evaluation Committees</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {committees.map(c => {
                  const assigned = slots.filter(sl => sl.status === 'assigned' && sl.committee?._id?.toString() === (c._id || c.id)?.toString());
                  return (
                    <div key={c._id || c.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-[11px]">
                      <span className="font-bold text-slate-800">{c.name}</span>
                      <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${assigned.length > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-400'}`}>
                        {assigned.length} / {slots.filter(sl => sl.committee?._id?.toString() === (c._id || c.id)?.toString()).length} assigned
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {assigningSlot ? (
            <AssignPanel
              slot={assigningSlot}
              committees={committees}
              groups={groups}
              editMode={editMode}
              onClose={() => { setAssigningSlot(null); setEditMode(false); }}
              onAssign={handleAssign}
              onEdit={() => setEditMode(true)}
              onDelete={() => handleDeleteSlot(assigningSlot._id)}
            />
          ) : (
            /* TIMETABLE GRID */
            <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
              {/* Week Nav */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-line">
                <button onClick={() => setWeekOffset(w => w - 1)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '11px', fontWeight: 700, color: '#475569', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>
                  <ChevronLeft size={14} /> Previous Week
                </button>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  Week of {fmt(dispMon)}
                </span>
                <button onClick={() => setWeekOffset(w => w + 1)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '11px', fontWeight: 700, color: '#475569', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>
                  Next Week <ChevronRight size={14} />
                </button>
              </div>

              {/* Day Headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ padding: '12px', borderRight: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time</span>
                </div>
                {DAYS.map((day, i) => (
                  <div key={day} style={{ padding: '12px', borderRight: i < 4 ? '1px solid #e2e8f0' : 'none' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>{DAY_LABELS[day]}</div>
                      <div style={{ fontSize: '9px', color: '#94a3b8' }}>{fshort(weekDates[i])}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slot Rows */}
              {TIMES.map((tm, rowIdx) => (
                <div key={tm.start} style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', borderBottom: rowIdx < TIMES.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                  <div style={{ padding: '12px', borderRight: '1px solid #e2e8f0', background: '#f8fafc80', display: 'flex', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                      <Clock size={12} style={{ color: '#3b82f6' }} />
                      {tm.label}
                    </span>
                  </div>
                  {DAYS.map((day, colIdx) => {
                    const slot = slotMap[day + '|' + tm.start];
                    return (
                      <div key={day} style={{ padding: '8px', borderRight: colIdx < 4 ? '1px solid #e2e8f0' : 'none', verticalAlign: 'top' }}>
                        {slot ? (
                        <SlotCard
                          slot={slot}
                          onAssignClick={() => setAssigningSlot(slot)}
                          onUnassign={handleUnassign}
                          onNotify={handleNotify}
                          onEdit={() => handleEditSlot(slot)}
                          onDelete={() => handleDeleteSlot(slot._id)}
                        />
                        ) : (
                          <div style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e2e8f0', borderRadius: '12px' }}>
                            <span style={{ fontSize: '9px', color: '#cbd5e1', fontStyle: 'italic' }}>
                              {slots.length ? '\u2014' : 'Empty'}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ===== SLOT CARD ===== */
function SlotCard({ slot, onAssignClick, onUnassign, onNotify, onEdit, onDelete }) {
  const isAssigned = slot.status === 'assigned';
  const isNotified = !!slot.notifiedAt;

  if (isAssigned) {
    const grp = slot.group || {};
    const leaderName = grp.leader?.user?.name;
    return (
      <div onClick={onAssignClick}
        style={{ borderRadius: '12px', border: '1px solid', padding: '10px', background: isNotified ? '#ecfdf5' : '#eef2ff', borderColor: isNotified ? '#a7f3d0' : '#c7d2fe', cursor: 'pointer' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#60a5fa'; e.currentTarget.style.background = '#eff6ff40'; }}
        onMouseLeave={e => { if (!e.currentTarget.contains(document.activeElement)) { e.currentTarget.style.borderColor = isNotified ? '#a7f3d0' : '#c7d2fe'; e.currentTarget.style.background = isNotified ? '#ecfdf5' : '#eef2ff'; } }}>
        {slot.committee && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '8px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={9} style={{ color: '#4f46e5' }} />
            </div>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#4338ca', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slot.committee.name}</span>
          </div>
        )}
        {(grp.projectIdea?.title || grp.fypTitle) && (
          <p style={{ fontSize: '8px', color: '#64748b', fontStyle: 'italic', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>&ldquo;{grp.projectIdea?.title || grp.fypTitle}&rdquo;</p>
        )}
        {grp.supervisor && (
          <p style={{ fontSize: '8px', color: '#64748b', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sup: {grp.supervisor.name}</p>
        )}
        {slot.venue && slot.venue !== 'TBD' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <MapPin size={8} style={{ color: '#94a3b8' }} />
            <span style={{ fontSize: '8px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slot.venue}</span>
          </div>
        )}
        <div style={{ display: 'flex', gap: '4px', paddingTop: '4px', borderTop: '1px solid rgba(226,232,240,0.6)' }}>
          {!isNotified ? (
            <button onClick={e => { e.stopPropagation(); onNotify(slot._id); }}
              title="Notify"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', padding: '4px 6px', background: '#3b82f6', color: '#fff', fontSize: '7px', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
              <Send size={7} /> Notify
            </button>
          ) : (
            <span style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', padding: '4px 6px', fontSize: '7px', fontWeight: 700, color: '#059669', background: '#ecfdf5', borderRadius: '8px'}}>
              <CheckCircle size={7} /> Notified
            </span>
          )}
          <button onClick={e => { e.stopPropagation(); onEdit(slot); }}
            title="Edit"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 6px', background: '#fff', color: '#2563eb', fontSize: '7px', fontWeight: 700, border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer'}}>
            Edit
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(slot._id); }}
            title="Delete"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 6px', background: '#fff', color: '#ef4444', fontSize: '7px', fontWeight: 700, border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer'}}>
            <Trash2 size={7} /> Del
          </button>
          <button onClick={e => { e.stopPropagation(); onUnassign(slot._id); }}
            title="Clear"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 6px', background: '#fff', color: '#f87171', fontSize: '7px', fontWeight: 700, border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer'}}>
            <X size={7} /> Clear
          </button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onAssignClick}
      style={{ minHeight: '80px', border: '2px dashed #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#60a5fa'; e.currentTarget.style.background = '#eff6ff40'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'transparent'; }}>
      <Plus size={16} style={{ color: '#cbd5e1' }} />
      <span style={{ fontSize: '8px', color: '#94a3b8' }}>Assign</span>
    </div>
  );
}

/* ===== ASSIGN PANEL (in-page, expandable) ===== */
function AssignPanel({ slot, committees, groups, editMode, onClose, onAssign, onEdit, onDelete }) {
  const isAssigned = slot.status === 'assigned' && !editMode;
  const [selC, setSelC] = useState(slot?.committee?._id || '');
  const [selG, setSelG] = useState(slot?.group?._id || '');
  const [selV, setSelV] = useState(slot?.venue && slot.venue !== 'TBD' ? slot.venue : '');

  const filteredGroups = selC
    ? groups.filter(g => (g.committeeMembers || []).some(cm => (cm._id || cm)?.toString() === selC))
    : groups;

  const groupName = (g) => {
    if (g.name) return g.name;
    if (g.projectIdea?.title) return g.projectIdea.title;
    if (g.fypTitle) return g.fypTitle;
    const memberTitle = (g.members || []).map(m => m.fypTitle).find(Boolean);
    if (memberTitle) return memberTitle;
    const names = (g.members || []).map(m => m.user?.name).filter(Boolean);
    if (names.length) return names.join(', ');
    if (g.leader?.user?.name) return g.leader.user.name;
    return 'Group ' + g._id?.slice(-4);
  };

  const handleConfirm = () => {
    if (!selC && !selG) { showToast.error('Select a committee or group'); return; }
    onAssign(slot._id, selC || null, selG || null, selV || 'TBD');
  };

  if (isAssigned) {
    const com = slot.committee || {};
    const grp = slot.group || {};
    return (
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-slate-50 border-b border-line flex items-center gap-3">
          <button onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-all">
            <ChevronLeft size={14} /> Back to Timetable
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={14} className="text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-slate-900">Slot Assigned</span>
            <span className="text-[10px] text-slate-500">&middot; {slot.day?.[0]?.toUpperCase() + slot.day?.slice(1)} &middot; {slot.startTime} &ndash; {slot.endTime}</span>
          </div>
        </div>
        <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <Users size={13} /> Committee
            </div>
            <p className="text-sm font-bold text-slate-900">{com.name || 'N/A'}</p>
            {com.type && <p className="text-[10px] text-slate-400">Type: {com.type}</p>}
            {com.head && <p className="text-[11px] text-slate-500">Head: <span className="font-semibold text-slate-700">{com.head.name}</span></p>}
            {com.members?.length > 0 && (
              <div className="text-[11px] text-slate-500">
                Members ({com.members.length}):
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {com.members.map(m => (
                    <span key={m._id} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-medium">{m.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <Users size={13} /> Group / Project
            </div>
            <p className="text-sm font-bold text-slate-900">{groupName(grp)}</p>
            {grp.leader?.user?.name && <p className="text-[11px] text-slate-500">Leader: <span className="font-semibold text-slate-700">{grp.leader.user.name}</span></p>}
            {(grp.projectIdea?.title || grp.fypTitle || (grp.members || []).map(m => m.fypTitle).find(Boolean)) && (
              <p className="text-[11px] text-slate-600 italic">&ldquo;{grp.projectIdea?.title || grp.fypTitle || (grp.members || []).map(m => m.fypTitle).find(Boolean)}&rdquo;</p>
            )}
            {grp.supervisor && <p className="text-[11px] text-slate-500">Supervisor: <span className="font-semibold text-slate-700">{grp.supervisor.name}</span></p>}
            {grp.members?.length > 0 && (
              <div className="text-[11px] text-slate-500">
                Members ({grp.members.length}):
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {grp.members.map(m => (
                    <span key={m._id} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md text-[10px] font-medium">{m.user?.name || 'Student'} {m.regNo && <span className="text-slate-400">({m.regNo})</span>}</span>
                  ))}
                </div>
              </div>
            )}
            {grp.status && <p className="text-[10px] text-slate-400">Status: {grp.status}</p>}
          </div>
        </div>
        {slot.venue && slot.venue !== 'TBD' && (
          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-white rounded-xl border border-slate-200 px-4 py-3">
            <MapPin size={13} className="text-slate-400" /> Venue: <span className="font-semibold text-slate-700">{slot.venue}</span>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button onClick={onEdit}
            className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 cursor-pointer transition-all flex items-center gap-1.5">
            Edit Assignment
          </button>
          <button onClick={onDelete}
            className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 cursor-pointer transition-all flex items-center gap-1.5">
            <Trash2 size={12} /> Delete Slot
          </button>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
      <div className="px-5 py-4 bg-slate-50 border-b border-line flex items-center gap-3">
        <button onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-all">
          <ChevronLeft size={14} /> Back to Timetable
        </button>
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock size={14} className="text-blue-600" />
          </div>
          <span className="text-xs font-bold text-slate-900">Assign Slot</span>
          <span className="text-[10px] text-slate-500">&middot; {slot.day?.[0]?.toUpperCase() + slot.day?.slice(1)} &middot; {slot.startTime} &ndash; {slot.endTime}</span>
        </div>
      </div>
      <div className="p-6 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Committee</label>
          <select value={selC} onChange={e => { setSelC(e.target.value); setSelG(''); }}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all">
            <option value="">Select committee</option>
            {committees.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
          </select>
          {selC && (() => {
            const c = committees.find(cm => (cm._id || cm.id) === selC);
            if (!c) return null;
            return (
              <div className="mt-2 text-[10px] text-slate-500 bg-white rounded-lg border border-slate-100 p-2 space-y-1">
                {c.head && <p>Head: <span className="font-semibold text-slate-700">{c.head.name}</span></p>}
                {c.members?.length > 0 && <p>Members: {c.members.map(m => m.name).join(', ')}</p>}
              </div>
            );
          })()}
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            Group {selC ? <span className="text-slate-400 font-normal normal-case">({filteredGroups.length} matching)</span> : ''}
          </label>
          <select value={selG} onChange={e => setSelG(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all">
            <option value="">Select group</option>
            {filteredGroups.length === 0 && selC ? (
              <option value="" disabled>No groups match this committee</option>
            ) : (
              filteredGroups.map(g => <option key={g._id} value={g._id}>{groupName(g)}</option>)
            )}
          </select>
          {selG && (() => {
            const g = groups.find(gr => gr._id === selG);
            if (!g) return null;
            return (
              <div className="mt-2 text-[10px] text-slate-500 bg-white rounded-lg border border-slate-100 p-2 space-y-1">
                {(g.projectIdea?.title || g.fypTitle) && <p className="italic">&ldquo;{g.projectIdea?.title || g.fypTitle}&rdquo;</p>}
                {g.supervisor && <p>Supervisor: <span className="font-semibold text-slate-700">{g.supervisor.name}</span></p>}
                {g.members?.length > 0 && <p>Members: {g.members.map(m => (m.user?.name || 'Student') + (m.regNo ? ' (' + m.regNo + ')' : '')).join(', ')}</p>}
              </div>
            );
          })()}
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Venue</label>
          <input value={selV} onChange={e => setSelV(e.target.value)} placeholder="e.g. Lab 4"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={handleConfirm}
          className="px-6 py-2.5 bg-btn text-white text-xs font-bold rounded-xl hover:bg-btn-hover cursor-pointer border-0 transition-all shadow-sm flex items-center gap-2">
          <CheckCircle size={14} /> Confirm Assignment
        </button>
      </div>
    </div>
  </div>
  );
}

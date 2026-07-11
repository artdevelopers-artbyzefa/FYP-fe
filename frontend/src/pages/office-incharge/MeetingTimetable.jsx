import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import { showToast } from '../../components/AppToast';
import {
  Calendar, Clock, Plus, Trash2, ChevronLeft, ChevronRight,
  Users, MapPin, FileText, X, CheckCircle, AlertTriangle,
  RefreshCw, User, BookOpen
} from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const DAY_LABELS = { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday' };
const HOURS = Array.from({ length: 10 }, (_, i) => {
  const h = i + 8;
  return `${String(h).padStart(2, '0')}:00`;
});

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtShort(d) {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function meetingDurationMinutes(startTime, endTime) {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

function parseTime(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export default function MeetingTimetable() {
  const [meetings, setMeetings] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [clashError, setClashError] = useState(null);
  const [form, setForm] = useState({
    faculty: '', student: '', group: '',
    date: '', startTime: '09:00', endTime: '10:00',
    venue: '', agenda: ''
  });

  const today = new Date();
  const baseMonday = getMonday(today);
  const displayMonday = new Date(baseMonday);
  displayMonday.setDate(displayMonday.getDate() + weekOffset * 7);

  const weekDates = DAYS.map((_, i) => {
    const d = new Date(displayMonday);
    d.setDate(displayMonday.getDate() + i);
    return d;
  });

  const loadFaculty = useCallback(async () => {
    try {
      const res = await apiClient.get('/user', { params: { role: 'faculty', limit: 200 } });
      setFacultyList(res.data?.data || []);
    } catch {
      // fail silently — faculty dropdown will be empty
    }
  }, []);

  const loadMeetings = useCallback(async () => {
    try {
      const start = weekDates[0].toISOString().split('T')[0];
      const end = weekDates[4].toISOString().split('T')[0];
      const res = await apiClient.get('/meetings', { params: { startDate: start, endDate: end } });
      setMeetings(res.data?.data || []);
    } catch {
      showToast.error('Failed to load meetings');
    }
  }, [weekOffset]);

  useEffect(() => { loadFaculty(); }, [loadFaculty]);
  useEffect(() => {
    setLoading(true);
    loadMeetings().finally(() => setLoading(false));
  }, [loadMeetings]);

  const resetForm = () => {
    setForm({ faculty: '', student: '', group: '', date: '', startTime: '09:00', endTime: '10:00', venue: '', agenda: '' });
    setEditingMeeting(null);
    setClashError(null);
  };

  const openCreateForm = () => {
    resetForm();
    const d = new Date();
    setForm(f => ({ ...f, date: d.toISOString().split('T')[0] }));
    setShowForm(true);
  };

  const openEditForm = (meeting) => {
    setEditingMeeting(meeting);
    setForm({
      faculty: meeting.faculty?._id || '',
      student: meeting.student?._id || '',
      group: meeting.group?._id || '',
      date: new Date(meeting.date).toISOString().split('T')[0],
      startTime: meeting.startTime,
      endTime: meeting.endTime,
      venue: meeting.venue || '',
      agenda: meeting.agenda || ''
    });
    setClashError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.faculty || !form.date || !form.startTime || !form.endTime) {
      showToast.error('Faculty, date, start time, and end time are required');
      return;
    }
    setSubmitting(true);
    setClashError(null);
    try {
      const payload = {
        faculty: form.faculty,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        venue: form.venue || 'TBD',
        agenda: form.agenda || ''
      };
      if (form.student) payload.student = form.student;
      if (form.group) payload.group = form.group;

      if (editingMeeting) {
        await apiClient.put(`/meetings/${editingMeeting._id}`, payload);
        showToast.success('Meeting updated');
      } else {
        await apiClient.post('/meetings', payload);
        showToast.success('Meeting created');
      }
      setShowForm(false);
      resetForm();
      loadMeetings();
    } catch (err) {
      if (err.response?.status === 409) {
        const msg = err.response?.data?.message || 'Time slot clash detected';
        setClashError(msg);
        showToast.error(msg);
      } else {
        const msg = err.response?.data?.message || err.mappedError?.message || 'Failed to save meeting';
        showToast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this meeting?')) return;
    try {
      await apiClient.delete(`/meetings/${id}`);
      showToast.success('Meeting cancelled');
      setSelectedMeeting(null);
      loadMeetings();
    } catch {
      showToast.error('Failed to cancel meeting');
    }
  };

  const handleComplete = async (meeting) => {
    try {
      await apiClient.put(`/meetings/${meeting._id}`, { status: 'completed' });
      showToast.success('Meeting marked as completed');
      setSelectedMeeting(null);
      loadMeetings();
    } catch {
      showToast.error('Failed to update meeting');
    }
  };

  const meetingsByDayHour = {};
  for (const m of meetings) {
    const dateStr = new Date(m.date).toISOString().split('T')[0];
    const dayIndex = weekDates.findIndex(d => d.toISOString().split('T')[0] === dateStr);
    if (dayIndex === -1) continue;
    const hour = m.startTime.split(':')[0];
    const key = `${dayIndex}|${hour}`;
    if (!meetingsByDayHour[key]) meetingsByDayHour[key] = [];
    meetingsByDayHour[key].push(m);
  }

  const getMeetingsForCell = (dayIdx, hour) => {
    return meetingsByDayHour[`${dayIdx}|${hour}`] || [];
  };

  const getMeetingsForDay = (dayIdx) => {
    const dateStr = weekDates[dayIdx]?.toISOString().split('T')[0];
    return meetings.filter(m => new Date(m.date).toISOString().split('T')[0] === dateStr);
  };

  const statusColors = {
    scheduled: { bg: '#eef2ff', border: '#c7d2fe', text: '#4338ca', dot: '#6366f1' },
    completed: { bg: '#ecfdf5', border: '#a7f3d0', text: '#059669', dot: '#10b981' },
    cancelled: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', dot: '#ef4444' },
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-line shadow-sm p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Meeting Timetable</h2>
              <p className="text-[11px] text-slate-500">Schedule and manage student-teacher meetings</p>
            </div>
          </div>
          <button onClick={openCreateForm}
            className="flex items-center gap-2 px-4 py-2.5 bg-btn text-white text-xs font-bold rounded-xl hover:bg-btn-hover cursor-pointer border-0 shadow-sm transition-all">
            <Plus size={15} /> New Meeting
          </button>
        </div>
      </div>

      {/* WEEK NAV */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-line">
          <button onClick={() => setWeekOffset(w => w - 1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-all">
            <ChevronLeft size={14} /> Previous
          </button>
          <span className="text-xs font-bold text-slate-700">
            {fmtDate(weekDates[0])} — {fmtDate(weekDates[4])}
          </span>
          <button onClick={() => setWeekOffset(w => w + 1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-all">
            Next <ChevronRight size={14} />
          </button>
        </div>

        {/* DAY HEADERS */}
        <div className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-line bg-slate-50/50">
          <div className="px-3 py-3 border-r border-line">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Time</span>
          </div>
          {DAYS.map((day, i) => {
            const dayMeetings = getMeetingsForDay(i);
            return (
              <div key={day} className={`px-3 py-3 ${i < 4 ? 'border-r border-line' : ''}`}>
                <div className="text-center">
                  <div className="text-[11px] font-bold text-slate-700">{DAY_LABELS[day]}</div>
                  <div className="text-[9px] text-slate-400">{fmtShort(weekDates[i])}</div>
                  {dayMeetings.length > 0 && (
                    <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 rounded-md">
                      <span className="text-[8px] font-bold text-blue-600">{dayMeetings.length}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* TIME GRID */}
        <div className="overflow-auto max-h-[600px]">
          {HOURS.map((hour, rowIdx) => (
            <div key={hour}
              className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-slate-100 min-h-[72px]">
              <div className="px-3 py-2 border-r border-line bg-slate-50/30 flex items-start">
                <span className="text-[10px] font-bold text-slate-400">{hour}</span>
              </div>
              {DAYS.map((day, colIdx) => {
                const cellMeetings = getMeetingsForCell(colIdx, hour);
                return (
                  <div key={day}
                    className={`px-1.5 py-1 ${colIdx < 4 ? 'border-r border-line' : ''} ${cellMeetings.length > 0 ? 'bg-blue-50/20' : ''}`}
                  >
                    {cellMeetings.length > 0 ? (
                      <div className="space-y-1">
                        {cellMeetings.map(m => {
                          const colors = statusColors[m.status] || statusColors.scheduled;
                          const startMin = parseTime(m.startTime);
                          const endMin = parseTime(m.endTime);
                          const hourMin = parseInt(hour) * 60;
                          const topOffset = Math.max(0, (startMin - hourMin) / 60 * 72);
                          const height = Math.max(28, (endMin - startMin) / 60 * 72);
                          return (
                            <div key={m._id}
                              onClick={() => setSelectedMeeting(m)}
                              className="rounded-lg border px-2 py-1.5 cursor-pointer transition-all hover:shadow-sm"
                              style={{
                                background: colors.bg,
                                borderColor: colors.border,
                              }}
                            >
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: colors.dot }} />
                                <span className="text-[9px] font-bold truncate" style={{ color: colors.text }}>
                                  {m.startTime}–{m.endTime}
                                </span>
                              </div>
                              <p className="text-[8px] text-slate-600 truncate leading-tight mt-0.5">
                                {m.faculty?.name || 'Faculty'}
                              </p>
                              {m.student?.name && (
                                <p className="text-[7px] text-slate-400 truncate leading-tight">
                                  with {m.student.name}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-full min-h-[56px]" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* CREATE/EDIT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30" onClick={() => { if (!submitting) { setShowForm(false); resetForm(); } }}>
          <div className="bg-white rounded-2xl border border-line shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  {editingMeeting ? <FileText size={14} className="text-blue-600" /> : <Plus size={14} className="text-blue-600" />}
                </div>
                <span className="text-sm font-bold text-slate-900">{editingMeeting ? 'Edit Meeting' : 'New Meeting'}</span>
              </div>
              <button onClick={() => { setShowForm(false); resetForm(); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border-0 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer transition-all">
                <X size={16} />
              </button>
            </div>

            {clashError && (
              <div className="mx-5 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-[11px] font-medium text-red-700">{clashError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Faculty <span className="text-red-400">*</span>
                </label>
                <select value={form.faculty} onChange={e => setForm({ ...form, faculty: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all">
                  <option value="">Select faculty</option>
                  {facultyList.map(f => (
                    <option key={f._id} value={f._id}>{f.name} {f.email ? `(${f.email})` : ''}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Date <span className="text-red-400">*</span></label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Venue</label>
                  <input type="text" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })}
                    placeholder="e.g. Lab 4, Room 201"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Start Time <span className="text-red-400">*</span></label>
                  <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">End Time <span className="text-red-400">*</span></label>
                  <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Student (optional)</label>
                <input type="text" value={form.student} onChange={e => setForm({ ...form, student: e.target.value })}
                  placeholder="Student user ID (optional)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Agenda (optional)</label>
                <textarea value={form.agenda} onChange={e => setForm({ ...form, agenda: e.target.value })}
                  placeholder="Meeting agenda or purpose"
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all resize-none" />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-line">
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-btn rounded-xl hover:bg-btn-hover cursor-pointer border-0 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {submitting ? (
                    <><RefreshCw size={13} className="animate-spin" /> Saving...</>
                  ) : (
                    <>{editingMeeting ? 'Update' : 'Create'} Meeting</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEETING DETAIL SIDEBAR / MODAL */}
      {selectedMeeting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30" onClick={() => setSelectedMeeting(null)}>
          <div className="bg-white rounded-2xl border border-line shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: (statusColors[selectedMeeting.status] || statusColors.scheduled).bg }}>
                  <Calendar size={14} style={{ color: (statusColors[selectedMeeting.status] || statusColors.scheduled).text }} />
                </div>
                <span className="text-sm font-bold text-slate-900">Meeting Details</span>
              </div>
              <button onClick={() => setSelectedMeeting(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border-0 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer transition-all">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border"
                  style={{
                    background: (statusColors[selectedMeeting.status] || statusColors.scheduled).bg,
                    borderColor: (statusColors[selectedMeeting.status] || statusColors.scheduled).border,
                    color: (statusColors[selectedMeeting.status] || statusColors.scheduled).text
                  }}>
                  {selectedMeeting.status.charAt(0).toUpperCase() + selectedMeeting.status.slice(1)}
                </span>
                {selectedMeeting.venue && selectedMeeting.venue !== 'TBD' && (
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <MapPin size={10} /> {selectedMeeting.venue}
                  </span>
                )}
              </div>

              {/* Datetime */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <Calendar size={13} className="text-slate-400" />
                  <span className="font-semibold">{fmtDate(selectedMeeting.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <Clock size={13} className="text-slate-400" />
                  <span className="font-semibold">{selectedMeeting.startTime} – {selectedMeeting.endTime}</span>
                </div>
              </div>

              {/* Faculty */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Faculty</p>
                  <p className="text-sm font-bold text-slate-900">{selectedMeeting.faculty?.name || 'N/A'}</p>
                  {selectedMeeting.faculty?.email && (
                    <p className="text-[10px] text-slate-400">{selectedMeeting.faculty.email}</p>
                  )}
                </div>
              </div>

              {/* Student */}
              {selectedMeeting.student && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen size={14} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student</p>
                    <p className="text-sm font-bold text-slate-900">{selectedMeeting.student?.name || 'N/A'}</p>
                    {selectedMeeting.student?.email && (
                      <p className="text-[10px] text-slate-400">{selectedMeeting.student.email}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Group */}
              {selectedMeeting.group && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users size={14} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Group</p>
                    <p className="text-sm font-bold text-slate-900">{selectedMeeting.group?.name || 'N/A'}</p>
                  </div>
                </div>
              )}

              {/* Agenda */}
              {selectedMeeting.agenda && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Agenda</p>
                  <p className="text-xs text-slate-700">{selectedMeeting.agenda}</p>
                </div>
              )}

              {/* Actions */}
              {selectedMeeting.status === 'scheduled' && (
                <div className="flex gap-2 pt-2 border-t border-line">
                  <button onClick={() => { setSelectedMeeting(null); openEditForm(selectedMeeting); }}
                    className="flex-1 px-4 py-2.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 cursor-pointer transition-all">
                    Edit
                  </button>
                  <button onClick={() => handleComplete(selectedMeeting)}
                    className="flex-1 px-4 py-2.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 cursor-pointer transition-all flex items-center justify-center gap-1.5">
                    <CheckCircle size={13} /> Complete
                  </button>
                  <button onClick={() => handleCancel(selectedMeeting._id)}
                    className="px-4 py-2.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 cursor-pointer transition-all flex items-center justify-center gap-1.5">
                    <Trash2 size={13} /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

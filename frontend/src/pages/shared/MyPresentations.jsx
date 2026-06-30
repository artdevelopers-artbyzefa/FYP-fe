import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Users, ChevronRight, BookOpen } from 'lucide-react';
import apiClient from '../../api/apiClient';

export default function MyPresentations() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    apiClient.get('/presentation-schedules/my-slots')
      .then(res => setSlots(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (selected) {
    const s = selected;
    const com = s.committee || {};
    const grp = s.group || {};
    const sched = s.schedule || {};
    return (
      <div className="space-y-5">
        <div className="border-b border-line pb-4">
          <button onClick={() => setSelected(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3">
            <ChevronRight size={14} className="rotate-180" /> Back to All Presentations
          </button>
          <h2 className="text-xl font-bold text-slate-900">{sched.title || 'Presentation'}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Calendar size={13} /> {s.date ? new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
            <span className="flex items-center gap-1"><Clock size={13} /> {s.startTime} &ndash; {s.endTime}</span>
            <span className="flex items-center gap-1"><MapPin size={13} /> {s.venue}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-line shadow-sm p-5 space-y-3">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Users size={13} /> Evaluation Committee</h5>
            <p className="text-sm font-bold text-slate-900">{com.name || 'N/A'}</p>
            {com.type && <p className="text-[10px] text-slate-400">Type: {com.type}</p>}
            {com.head && <p className="text-[11px] text-slate-500">Head: <span className="font-semibold text-slate-700">{com.head.name}</span></p>}
            {com.members?.length > 0 && (
              <div className="text-[11px] text-slate-500">
                Committee Members ({com.members.length}):
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {com.members.map(m => (
                    <span key={m._id} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-medium">{m.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-line shadow-sm p-5 space-y-3">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><BookOpen size={13} /> Group / Project</h5>
            <p className="text-sm font-bold text-slate-900">{grp.name || grp.fypTitle || grp.projectIdea?.title || 'Group'}</p>
            {grp.projectIdea?.title && <p className="text-[11px] text-slate-600 italic">&ldquo;{grp.projectIdea.title}&rdquo;</p>}
            {grp.leader?.user?.name && <p className="text-[11px] text-slate-500">Leader: <span className="font-semibold text-slate-700">{grp.leader.user.name}</span></p>}
            {grp.supervisor && <p className="text-[11px] text-slate-500">Supervisor: <span className="font-semibold text-slate-700">{grp.supervisor.name}</span></p>}
            {grp.members?.length > 0 && (
              <div className="text-[11px] text-slate-500">
                Members ({grp.members.length}):
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {grp.members.map(m => (
                    <span key={m._id} className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-medium">{m.user?.name || 'Student'} {m.regNo && <span className="text-slate-400">({m.regNo})</span>}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {s.venue && (
          <div className="bg-white rounded-2xl border border-line shadow-sm p-4 flex items-center gap-3">
            <MapPin size={16} className="text-slate-400" />
            <div><p className="text-xs font-bold text-slate-900">Venue</p><p className="text-[11px] text-slate-500">{s.venue}</p></div>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-56 rounded-lg skeleton" />
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-line p-5 space-y-3">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl skeleton" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 rounded-md skeleton" />
                  <div className="h-3 w-64 rounded-md skeleton" />
                </div>
              </div>
              <div className="h-3 w-40 rounded-md skeleton" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-slate-400">
        <Calendar size={48} className="text-slate-300" />
        <h3 className="text-base font-bold">No Presentations Scheduled</h3>
        <p className="text-xs">You have no upcoming or assigned presentations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">My Presentations</h2>
      <p className="text-xs text-slate-500">Your scheduled presentations, defenses, and committee evaluations</p>

      <div className="space-y-3">
        {slots.map(s => {
          const sched = s.schedule || {};
          const com = s.committee || {};
          const grp = s.group || {};
          return (
            <div key={s._id} onClick={() => setSelected(s)}
              className="bg-white rounded-2xl border border-line shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <Calendar size={20} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{sched.title || 'FYP Presentation'}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1"><Calendar size={11} /> {s.date ? new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                        <span className="flex items-center gap-1"><Clock size={11} /> {s.startTime} &ndash; {s.endTime}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} /> {s.venue || 'TBD'}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 shrink-0 mt-1" />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px]">
                    {com.name && <span className="flex items-center gap-1"><Users size={11} className="text-blue-500" /> {com.name}</span>}
                    {grp.fypTitle && <span className="text-slate-600 italic">&ldquo;{grp.fypTitle}&rdquo;</span>}
                    {grp.supervisor?.name && <span className="text-slate-500">Sup: {grp.supervisor.name}</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

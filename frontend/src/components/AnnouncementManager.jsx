import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Pencil, Calendar, X, Check, Bell, Upload } from 'lucide-react';

const AnnouncementManager = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [editing, setEditing] = useState(null);
    const fileRef = useRef();

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const loadAnnouncements = async () => {
        const res = await window.fetch('/api/announcements', { headers });
        const data = await res.json();
        if (data.success) setAnnouncements(data.data);
    };

    useEffect(() => { loadAnnouncements(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) return;
        if (editing) {
            await fetch(`/api/announcements/${editing}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json', ...headers },
                body: JSON.stringify({ title, content, date: new Date(date).toISOString() })
            });
        } else {
            await fetch('/api/announcements', {
                method: 'POST', headers: { 'Content-Type': 'application/json', ...headers },
                body: JSON.stringify({ title, content, date: new Date(date).toISOString() })
            });
        }
        setTitle(''); setContent(''); setDate(new Date().toISOString().split('T')[0]);
        setEditing(null);
        loadAnnouncements();
    };

    const handleDelete = async (id) => {
        await fetch(`/api/announcements/${id}`, { method: 'DELETE', headers });
        loadAnnouncements();
    };

    const startEdit = (a) => {
        setEditing(a._id); setTitle(a.title); setContent(a.content);
        setDate(new Date(a.date).toISOString().split('T')[0]);
    };

    const cancelEdit = () => {
        setEditing(null); setTitle(''); setContent('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    Announcements
                </h3>
            </div>
            <div className="p-6 space-y-6">
                <form onSubmit={handleSubmit} className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                    <div className="flex items-center gap-2 mb-4">
                        {editing ? <Pencil className="w-4 h-4 text-blue-600" /> : <Plus className="w-4 h-4 text-blue-600" />}
                        <span className="text-sm font-bold text-slate-800">{editing ? 'Edit Announcement' : 'New Announcement'}</span>
                    </div>
                    <div className="space-y-3">
                        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 bg-white" />
                        <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} rows="2"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 bg-white resize-none" />
                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 bg-white" />
                        <div className="flex gap-2">
                            <button type="submit" disabled={!title || !content}
                                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                                {editing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                {editing ? 'Update' : 'Add'}
                            </button>
                            {editing && (
                                <button type="button" onClick={cancelEdit}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {announcements.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm font-medium text-slate-400">No announcements</p>
                        </div>
                    ) : (
                        announcements.map(a => (
                            <div key={a._id} className="group p-4 rounded-xl bg-white border border-slate-100 hover:border-blue-200 transition-all">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900">{a.title}</p>
                                        <p className="text-xs text-slate-500 mt-1">{a.content}</p>
                                        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400">
                                            <Calendar className="w-3 h-3" /> {formatDate(a.date)}
                                        </div>
                                    </div>
                                    <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => startEdit(a)} className="p-2 rounded-lg text-blue-400 hover:bg-blue-50" title="Edit">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(a._id)} className="p-2 rounded-lg text-red-400 hover:bg-red-50" title="Delete">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementManager;

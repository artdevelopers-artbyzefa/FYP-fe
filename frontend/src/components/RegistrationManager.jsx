import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Users, CheckCircle, XCircle } from 'lucide-react';

const RegistrationManager = () => {
    const [batches, setBatches] = useState([]);
    const [exceptions, setExceptions] = useState([]);
    const [newBatch, setNewBatch] = useState('');
    const [newRegNo, setNewRegNo] = useState('');
    const [reason, setReason] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
        try {
            const [bRes, eRes] = await Promise.all([
                fetch('/api/registration/batches', { headers }),
                fetch('/api/registration/exceptions', { headers })
            ]);
            const bData = await bRes.json();
            const eData = await eRes.json();
            if (bData.success) setBatches(bData.data);
            if (eData.success) setExceptions(eData.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchData(); }, []);

    const addBatch = async (e) => {
        e.preventDefault();
        if (!newBatch) return;
        await fetch('/api/registration/batches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...headers },
            body: JSON.stringify({ session: newBatch })
        });
        setNewBatch('');
        fetchData();
    };

    const removeBatch = async (id) => {
        await fetch(`/api/registration/batches/${id}`, { method: 'DELETE', headers });
        fetchData();
    };

    const addException = async (e) => {
        e.preventDefault();
        if (!newRegNo) return;
        await fetch('/api/registration/exceptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...headers },
            body: JSON.stringify({ regNo: newRegNo, reason })
        });
        setNewRegNo('');
        setReason('');
        fetchData();
    };

    const removeException = async (id) => {
        await fetch(`/api/registration/exceptions/${id}`, { method: 'DELETE', headers });
        fetchData();
    };

    return (
        <div className="space-y-8">
            {/* Allowed Batches */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <Users className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-slate-900">Allowed Batches / Sessions</h3>
                </div>
                <p className="text-sm text-slate-500 mb-4">Students from these sessions can register for FYP. Add session codes like FA23, SP24, FA24 etc.</p>

                <form onSubmit={addBatch} className="flex gap-3 mb-6">
                    <input type="text" placeholder="e.g. FA23" value={newBatch} onChange={e => setNewBatch(e.target.value.toUpperCase())}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary uppercase" />
                    <button type="submit" disabled={!newBatch}
                        className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </form>

                <div className="flex flex-wrap gap-2">
                    {batches.map(b => (
                        <div key={b._id} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-100">
                            <span className="font-bold text-sm text-primary">{b.session}</span>
                            <button onClick={() => removeBatch(b._id)} className="text-red-400 hover:text-red-600 transition-colors">
                                <XCircle className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {batches.length === 0 && (
                        <p className="text-sm text-slate-400 py-3">No batches added yet. No students can register.</p>
                    )}
                </div>
            </div>

            {/* Individual Exceptions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg font-bold text-slate-900">Individual Student Exceptions</h3>
                </div>
                <p className="text-sm text-slate-500 mb-4">Allow specific students by registration number regardless of their batch.</p>

                <form onSubmit={addException} className="space-y-3 mb-6">
                    <input type="text" placeholder="Registration Number (e.g. FA23-BCS-034)" value={newRegNo} onChange={e => setNewRegNo(e.target.value.toUpperCase())}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary uppercase" />
                    <input type="text" placeholder="Reason (optional)" value={reason} onChange={e => setReason(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    <button type="submit" disabled={!newRegNo}
                        className="w-full py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Allow Student
                    </button>
                </form>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {exceptions.map(s => (
                        <div key={s._id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900">{s.regNo}</p>
                                {s.reason && <p className="text-xs text-slate-500">{s.reason}</p>}
                            </div>
                            <button onClick={() => removeException(s._id)}
                                className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {exceptions.length === 0 && (
                        <p className="text-sm text-slate-400 text-center py-6">No exceptions added.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegistrationManager;

import React, { useState, useEffect } from 'react';
import { Send, Mail, Users, Loader2 } from 'lucide-react';

const EmailCenter = () => {
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('/api/user', { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(res => { if (res.success) setUsers(res.data || []); })
            .catch(() => {});
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!recipient || !subject || !message) return;
        setSending(true);
        setResult(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/user/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ to: recipient, subject, text: message })
            });
            const data = await res.json();
            setResult(data.success ? 'Email sent successfully!' : 'Failed to send email.');
        } catch (e) {
            setResult('Error sending email.');
        }
        setSending(false);
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-3">
                    <Mail className="w-6 h-6 text-primary" /> Email Center
                </h2>
                <p className="text-sm text-gray-500 font-medium mt-1">Send emails to faculty, students, or any registered user.</p>
            </div>

            <div className="flex gap-6 items-start">
                {/* Left — Form */}
                <div className="w-3/5">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <form onSubmit={handleSend} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Recipient Email</label>
                                <input type="email" value={recipient} onChange={e => setRecipient(e.target.value)}
                                    placeholder="email@cuiatd.edu.pk"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Subject</label>
                                <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                                    placeholder="Email subject"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Message</label>
                                <textarea value={message} onChange={e => setMessage(e.target.value)} rows="6"
                                    placeholder="Type your message here..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
                            </div>
                            <button type="submit" disabled={sending || !recipient || !subject || !message}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition-all disabled:opacity-50">
                                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                {sending ? 'Sending...' : 'Send Email'}
                            </button>
                            {result && (
                                <div className={`p-3 rounded-xl text-sm font-medium ${result.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                    {result}
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Right — Users */}
                <div className="w-2/5">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" /> Registered Users
                        </h3>
                        <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                            {users.map(u => (
                                <div key={u._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => setRecipient(u.email)}>
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">{u.name?.[0] || '?'}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{u.email} <span className="text-[10px] text-primary">({u.role})</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailCenter;

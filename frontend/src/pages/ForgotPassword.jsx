import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { showToast } from '../components/AppToast';
import { ArrowLeft, Mail, Send } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { showToast.error('Enter your email address.'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });
      const data = await res.json();
      setSent(true);
    } catch { showToast.error('Failed to connect to server.'); }
    finally { setSubmitting(false); }
  };

  if (sent) {
    return (
      <main className="bg-[#1e3a8a] min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-10 shadow-2xl text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-black text-gray-800 mb-3">Check Your Email</h2>
            <p className="text-sm text-gray-500 mb-6">If an account exists for that email, a password reset link has been sent.</p>
            <Link to="/login" className="text-sm text-primary font-bold hover:underline">Back to Login</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#1e3a8a] min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-10 shadow-2xl">
          <Link to="/login" className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>

          <div className="text-center mb-8">
            <div className="w-[80px] h-[80px] mx-auto mb-4 drop-shadow">
              <img src="/cuilogo.png" alt="CUI Logo" className="h-20 w-auto mx-auto" />
            </div>
            <h1 className="text-xl font-black text-[#1e3a8a] tracking-tight mb-1">Forgot Password</h1>
            <p className="text-sm font-medium text-gray-500">Enter your email to receive a reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-gray-700 outline-none focus:border-primary transition-all" required />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-[#1e3a8a] text-white rounded-xl py-3.5 font-bold text-base hover:bg-blue-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-2">
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
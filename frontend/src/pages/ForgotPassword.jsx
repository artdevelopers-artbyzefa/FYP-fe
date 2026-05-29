import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { showToast } from '../components/AppToast';
import { ArrowLeft, Mail, KeyRound, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const sendCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) { showToast.error('Enter your email address.'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });
      await res.json();
      setStep('reset');
      showToast.success('If that email exists, a code has been sent.');
    } catch { showToast.error('Failed to connect.'); }
    finally { setSubmitting(false); }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (!code.trim()) { showToast.error('Enter the verification code.'); return; }
    if (password.length < 6) { showToast.error('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { showToast.error('Passwords do not match.'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: code.trim(), password })
      });
      const data = await res.json();
      if (!res.ok) { showToast.error(data.message || 'Failed to reset password.'); setSubmitting(false); return; }
      setDone(true);
    } catch { showToast.error('Failed to connect.'); }
    finally { setSubmitting(false); }
  };

  if (done) {
    return (
      <main className="bg-[#1e3a8a] min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md"><div className="bg-white rounded-3xl p-10 shadow-2xl text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-8 h-8 text-emerald-600" /></div>
          <h2 className="text-xl font-black text-gray-800 mb-3">Password Reset!</h2>
          <p className="text-sm text-gray-500 mb-6">Your password has been reset successfully.</p>
          <button onClick={() => navigate('/login')} className="px-8 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-navy-dark transition-all cursor-pointer border-0">Go to Login</button>
        </div></div>
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
            <div className="w-[80px] h-[80px] mx-auto mb-4"><img src="/cuilogo.png" alt="CUI Logo" className="h-20 w-auto mx-auto" /></div>
            <h1 className="text-xl font-black text-[#1e3a8a] tracking-tight mb-1">Reset Password</h1>
            <p className="text-sm font-medium text-gray-500">
              {step === 'email' ? 'Enter your email to receive a code' : 'Enter the code and your new password'}
            </p>
          </div>

          {step === 'email' ? (
            <form onSubmit={sendCode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-gray-700 outline-none focus:border-primary transition-all" required />
                </div>
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-[#1e3a8a] text-white rounded-xl py-3.5 font-bold text-base hover:bg-blue-900 transition-all disabled:opacity-70 cursor-pointer border-0">
                {submitting ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={resetPassword} className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-xl text-sm text-center">
                <span className="text-gray-500">Code sent to </span>
                <span className="font-bold text-gray-700">{email}</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 tracking-wider">Verification Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="text" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit code" className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-gray-700 outline-none focus:border-primary transition-all text-center tracking-[8px]" required maxLength={6} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 tracking-wider">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-sm font-medium text-gray-700 outline-none focus:border-primary transition-all" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary cursor-pointer bg-transparent border-0">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 tracking-wider">Confirm Password</label>
                <input type={showPassword ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-gray-700 outline-none focus:border-primary transition-all" required minLength={6} />
              </div>

              <button type="submit" disabled={submitting} className="w-full bg-[#1e3a8a] text-white rounded-xl py-3.5 font-bold text-base hover:bg-blue-900 transition-all disabled:opacity-70 cursor-pointer border-0">
                {submitting ? 'Resetting...' : 'Reset Password'}
              </button>

              <button type="button" onClick={() => { setStep('email'); setCode(''); }} className="w-full text-xs font-bold text-gray-400 hover:text-primary transition-colors cursor-pointer bg-transparent border-0">
                Wrong email? Go back
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
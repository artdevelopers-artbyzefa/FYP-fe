import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { showToast } from '../components/AppToast';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      showToast.error('Invalid or missing invitation link.');
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (password.length < 6) {
      showToast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      showToast.error('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast.error(data.message || 'Failed to set password.');
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch (err) {
      showToast.error('Failed to connect to server.');
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-3">Password Set!</h2>
          <p className="text-gray-500 text-sm mb-8">Your password has been set successfully. You can now log in to your account.</p>
          <button onClick={() => navigate('/login')} className="px-8 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-navy-dark transition-all cursor-pointer border-0 w-full">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-12 max-w-md w-full text-center">
          <h2 className="text-2xl font-black text-gray-800 mb-3">Invalid Link</h2>
          <p className="text-gray-500 text-sm mb-8">This invitation link is invalid or missing required information. Please contact your administrator for a new invitation.</p>
          <button onClick={() => navigate('/login')} className="px-8 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-navy-dark transition-all cursor-pointer border-0 w-full">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-12 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">FYP Portal</h1>
          <p className="text-xs text-gray-400 font-bold tracking-widest mt-1">CUI-ATD</p>
        </div>

        <h2 className="text-lg font-bold text-gray-700 mb-1">Set Your Password</h2>
        <p className="text-sm text-gray-400 mb-6">Create a password for your faculty account.</p>

        <div className="bg-gray-50 rounded-xl p-3 mb-6 text-sm">
          <span className="text-gray-500 text-xs font-bold">Account:</span>
          <p className="font-bold text-gray-700 mt-0.5">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 tracking-widest">New Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all pr-10" required minLength={6} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-0">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 tracking-widest">Confirm Password</label>
            <input type={showPassword ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat your password" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" required minLength={6} />
          </div>
          <button type="submit" disabled={submitting} className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold tracking-wider hover:bg-navy-dark transition-all cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? 'Setting Password...' : 'Set Password & Activate Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
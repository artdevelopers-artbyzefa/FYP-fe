import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/auth.service';
import { showToast as AppToast } from '../components/AppToast';
import { ArrowLeft, ArrowRight, ChevronDown, Eye, EyeOff, Loader, Lock, Mail, UserCircle, Zap } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ role: 'Student', email: '', password: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      AppToast.error('Missing fields', 'Enter email and password');
      return;
    }
    setIsLoading(true);
    try {
      const response = await loginUser(formData);
      AppToast.success('Login Successful', 'Welcome back to the FYP Portal!');
      const userRole = response.user?.role || formData.role;
      const routes = {
        'Student': '/dashboard',
        'HOD': '/hod/dashboard',
        'FYP Office Assistant': '/office-assistant/dashboard',
        'Faculty Supervisor': '/faculty/dashboard',
        'Faculty': '/faculty/dashboard',
        'FYP Office In-charge': '/office-incharge/dashboard',
        'System Administrator': '/admin/dashboard',
        'Admin': '/admin/dashboard',
        'Industry Supervisor': '/industry/dashboard',
        'Industry': '/industry/dashboard',
      };
      navigate(routes[userRole] || '/dashboard');
    } catch (error) {
      const msg = error?.message || '';
      if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('not found')) {
        AppToast.error('Wrong Password', 'Enter correct email and password.');
      } else {
        AppToast.error(error?.title || 'Login Failed', msg || 'Invalid credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (email, password, role) => {
    setIsLoading(true);
    try {
      const response = await loginUser({ role, email, password });
      AppToast.success('Login Successful', `Welcome, ${role}!`);
      const userRole = response.user?.role || role;
      const routes = {
        'Student': '/dashboard',
        'HOD': '/hod/dashboard',
        'FYP Office Assistant': '/office-assistant/dashboard',
        'Faculty Supervisor': '/faculty/dashboard',
        'Faculty': '/faculty/dashboard',
        'FYP Office In-charge': '/office-incharge/dashboard',
        'System Administrator': '/admin/dashboard',
        'Admin': '/admin/dashboard',
        'Industry Supervisor': '/industry/dashboard',
        'Industry': '/industry/dashboard',
      };
      navigate(routes[userRole] || '/dashboard');
    } catch (error) {
      AppToast.error(error?.title || 'Login Failed', error?.message || 'Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-[#1e3a8a] min-h-screen flex items-center justify-center p-6 font-poppins selection:bg-primary/20 selection:text-primary">

      {/* Login Card */}
      <div className="w-full max-w-[480px]">
        <div className="bg-white rounded-3xl p-10 shadow-2xl">

          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
          </div>

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <img src="/cuilogo.png" alt="CUI Logo" className="h-20 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-black text-[#1e3a8a] tracking-tight mb-1">CUI Abbottabad</h1>
            <p className="text-sm font-medium text-gray-500">FYP Management System</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wider">Select Role</label>
              <div className="relative">
                <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-8 text-sm font-semibold text-gray-700 outline-none focus:border-primary appearance-none cursor-pointer transition-all">
                  <option value="Student">Student</option>
                  <option value="FYP Office Assistant">FYP Office Assistant</option>
                  <option value="FYP Office In-charge">FYP Office In-charge</option>
                  <option value="Faculty Supervisor">Faculty Supervisor</option>
                  <option value="HOD">HOD</option>
                  <option value="System Administrator">System Administrator</option>
                  <option value="Industry Supervisor">Industry Supervisor</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Enter your email"
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-gray-700 outline-none focus:border-primary" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                <input type={showPassword ? "text" : "password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Enter your password"
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-sm font-medium text-gray-700 outline-none focus:border-primary" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors z-10 focus:outline-none">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full bg-[#1e3a8a] text-white rounded-xl py-3.5 font-bold text-base hover:bg-blue-900 transition-all disabled:opacity-70 flex items-center justify-center gap-3 mt-2">
              {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : null}
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              {!isLoading ? <ArrowRight className="w-5 h-5" /> : null}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 text-center mb-3 tracking-wider">QUICK LOGIN</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => handleQuickLogin('FYPIncharge@cuiatd.edu.pk', 'Megamix@123', 'FYP Office In-charge')} disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 transition-all disabled:opacity-50">
                <Zap className="w-3.5 h-3.5" /> FYP Incharge
              </button>
              <button type="button" onClick={() => handleQuickLogin('office@cuiatd.edu.pk', 'Megamix@123', 'FYP Office Assistant')} disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold border border-amber-200 transition-all disabled:opacity-50">
                <Zap className="w-3.5 h-3.5" /> FYP Assistant
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;

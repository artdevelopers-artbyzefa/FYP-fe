import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginUser } from '../services/auth.service';
import { showToast as AppToast } from '../components/AppToast';
import { ArrowLeft, ArrowRight, ChevronDown, Eye, EyeOff, Loader, Lock, Mail, UserCircle } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      role: 'Student'
    }
  });

  const handleQuickLogin = (role, email, password) => {
    setValue('role', role);
    setValue('email', email);
    setValue('password', password);
    setTimeout(() => {
      handleSubmit(onSubmit)();
    }, 50);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await loginUser(data);
      AppToast.success('Login Successful', 'Welcome back to the FYP Portal!');

      // Role-based navigation
      const userRole = response.user?.role || data.role;
      if (userRole === 'HOD') {
        navigate('/hod/dashboard');
      } else if (userRole === 'FYP Office Assistant') {
        navigate('/office-assistant/dashboard');
      } else if (userRole === 'Faculty Supervisor' || userRole === 'Faculty') {
        navigate('/faculty/dashboard');
      } else if (userRole === 'FYP Office In-charge') {
        navigate('/office-incharge/dashboard');
      } else if (userRole === 'System Administrator' || userRole === 'Admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'Industry Supervisor' || userRole === 'Industry') {
        navigate('/industry/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      AppToast.error(error.title || 'Login Failed', error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-[#1e3a8a] min-h-screen flex items-center justify-center p-6 font-poppins selection:bg-primary/20 selection:text-primary">

      {/* Login Card */}
      <div className="w-full max-w-[480px]">
        <div className="bg-white rounded-3xl p-10 shadow-2xl">

          {/* Back to Home */}
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-[80px] h-[80px] mx-auto mb-4 drop-shadow">
              <img
                src="/cuilogo.png"
                alt="CUI Logo"
                className="h-20 w-auto mx-auto"
              />
            </div>
            <h1 className="text-2xl font-black text-[#1e3a8a] tracking-tight mb-1">CUI Abbottabad</h1>
            <p className="text-sm font-medium text-gray-500">FYP Management System</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wider">Select Role</label>
              <div className="relative">
                <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                <select
                  {...register('role', { required: 'Role is required' })}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-8 text-sm font-semibold text-gray-700 outline-none focus:border-primary appearance-none cursor-pointer transition-all"
                >
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

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register('email', { required: 'Email is required' })}
                  className={`w-full bg-white border ${errors.email ? 'border-primary' : 'border-gray-200'} rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-gray-700 outline-none focus:border-primary transition-all`}
                />
              </div>
              {errors.email && <p className="text-danger text-[10px] font-bold mt-1 ml-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register('password', { required: 'Password is required' })}
                  className={`w-full bg-white border ${errors.password ? 'border-primary' : 'border-gray-200'} rounded-xl py-3 pl-10 pr-10 text-sm font-medium text-gray-700 outline-none focus:border-primary transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary text-sm transition-colors z-10 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-danger text-[10px] font-bold mt-1 ml-1">{errors.password.message}</p>}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" id="remMe" className="w-4 h-4 border border-gray-300 rounded accent-primary" />
                <span className="text-gray-500 font-medium">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary font-bold hover:underline">Forgot Password?</Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1e3a8a] text-white rounded-xl py-3.5 font-bold text-base hover:bg-blue-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-2"
            >
              {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : null}
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              {!isLoading ? <ArrowRight className="w-5 h-5" /> : null}
            </button>

            {/* Quick Demo Logins */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="text-center text-[10px] font-black text-gray-400 mb-3 tracking-wider">
                Quick Demo Login
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Student', 'fa23-bcs-013@cuiatd.edu.pk', 'Megamix@123')}
                  className="py-2.5 px-3 text-xs font-bold rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-primary hover:text-white hover:border-primary transition-all text-center focus:outline-none"
                >
                  Student (FA23-BCS-013)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Student', 'fa23-bcs-034@cuiatd.edu.pk', 'Megamix@123')}
                  className="py-2.5 px-3 text-xs font-bold rounded-lg border border-amber-200 text-amber-700 bg-amber-50 hover:bg-primary hover:text-white hover:border-primary transition-all text-center focus:outline-none"
                >
                  Student (FA23-BCS-034)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('HOD', 'hod@cuiatd.edu.pk', 'Megamix@123')}
                  className="py-2.5 px-3 text-xs font-bold rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-primary hover:text-white hover:border-primary transition-all text-center focus:outline-none"
                >
                  HOD
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('FYP Office In-charge', 'fypincharge@cuiatd.edu.pk', 'Megamix@123')}
                  className="py-2.5 px-3 text-xs font-bold rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-primary hover:text-white hover:border-primary transition-all text-center focus:outline-none"
                >
                  FYP Incharge
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Faculty Supervisor', 'faculty@cuiatd.edu.pk', 'Megamix@123')}
                  className="py-2.5 px-3 text-xs font-bold rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-primary hover:text-white hover:border-primary transition-all text-center focus:outline-none"
                >
                  Faculty
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Faculty Supervisor', 'ininsico@gmail.com', 'Megamix@123')}
                  className="py-2.5 px-3 text-xs font-bold rounded-lg border border-amber-200 text-amber-700 bg-amber-50 hover:bg-primary hover:text-white hover:border-primary transition-all text-center focus:outline-none"
                >
                  Faculty (ininsico)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Faculty Supervisor', 'bilalrathore577@gmail.com', 'Megamix@123')}
                  className="py-2.5 px-3 text-xs font-bold rounded-lg border border-amber-200 text-amber-700 bg-amber-50 hover:bg-primary hover:text-white hover:border-primary transition-all text-center focus:outline-none"
                >
                  Faculty (Bilal)
                </button>
              </div>
              <div className="flex justify-center mt-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('FYP Office Assistant', 'office@cuiatd.edu.pk', 'Megamix@123')}
                  className="w-full py-2.5 px-3 text-xs font-bold rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-primary hover:text-white hover:border-primary transition-all text-center focus:outline-none"
                >
                  Office Assistant
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
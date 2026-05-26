import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginUser } from '../services/auth.service';
import { showToast as AppToast } from '../components/AppToast';

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
    <div className="bg-primary min-h-screen flex items-center justify-center p-6 font-poppins selection:bg-secondary/30 selection:text-white">

      {/* Login Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-[440px] relative shadow-2xl animate-fade-in">

        {/* Back to Home */}
        <Link
          to="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-navy transition-colors font-medium text-sm"
        >
          <i className="fas fa-arrow-left text-sm"></i>
          Back to Home
        </Link>

        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border border-gray-100 overflow-hidden">
            <img
              src="/cuilogo.png"
              alt="CUI Logo"
              className="w-[85%] h-auto object-contain"
            />
          </div>
          <h1 className="text-xl font-black text-primary leading-tight mb-1">CUI Abbottabad</h1>
          <div className="text-sm text-gray-500 font-medium">FYP Management System</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Role Selection */}
          <div className="flex flex-col gap-1.5 mb-5 relative">
            <label className="text-xs font-bold text-gray-600">Select Role</label>
            <div className="relative">
              <i className="fas fa-user-circle absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none z-10"></i>
              <select
                {...register('role', { required: 'Role is required' })}
                className="w-full py-3 pr-10 pl-11 border-[1.5px] border-gray-200 rounded-xl text-sm text-gray-800 bg-white outline-none transition-all focus:border-secondary focus:ring-[3px] focus:ring-blue-600/10 appearance-none cursor-pointer"
              >
                <option value="Student">Student</option>
                <option value="FYP Office Assistant">FYP Office Assistant</option>
                <option value="FYP Office In-charge">FYP Office In-charge</option>
                <option value="Faculty Supervisor">Faculty Supervisor</option>
                <option value="HOD">HOD</option>
                <option value="System Administrator">System Administrator</option>
                <option value="Industry Supervisor">Industry Supervisor</option>
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-xs font-bold text-gray-600">Email Address</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none z-10"></i>
              <input
                type="email"
                placeholder="Enter your email"
                {...register('email', { required: 'Email is required' })}
                className={`w-full py-3 pr-4 pl-11 border-[1.5px] ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl text-sm text-gray-800 bg-white outline-none transition-all focus:border-secondary focus:ring-[3px] focus:ring-blue-600/10`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-xs font-bold text-gray-600">Password</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none z-10"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required' })}
                className={`w-full py-3 pr-11 pl-11 border-[1.5px] ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl text-sm text-gray-800 bg-white outline-none transition-all focus:border-secondary focus:ring-[3px] focus:ring-blue-600/10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary text-sm p-1 transition-colors z-10 focus:outline-none"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.password.message}</p>}
          </div>

          {/* Remember & Forgot */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remMe" className="w-4 h-4 accent-primary cursor-pointer border-gray-300 rounded" />
              <label htmlFor="remMe" className="text-xs font-bold text-gray-500 cursor-pointer select-none">Remember me</label>
            </div>
            <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline">Forgot Password?</Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3.5 text-base font-bold rounded-xl bg-primary text-white flex items-center justify-center gap-2 transition-all hover:bg-blue-900 hover:-translate-y-[1px] hover:shadow-lg active:translate-y-0 disabled:opacity-80 disabled:cursor-not-allowed"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-arrow-right'}`}></i>
          </button>

          {/* Quick Demo Logins */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="text-center text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-wider">
              Quick Demo Login
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('Student', 'student@cuiatd.edu.pk', 'Megamix@123')}
                className="py-2 px-3 text-xs font-bold rounded-lg border border-gray-200 text-gray-700 bg-gray-50 hover:bg-secondary hover:text-white hover:border-secondary transition-all text-center focus:outline-none"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('HOD', 'hod@cuiatd.edu.pk', 'Megamix@123')}
                className="py-2 px-3 text-xs font-bold rounded-lg border border-gray-200 text-gray-700 bg-gray-50 hover:bg-secondary hover:text-white hover:border-secondary transition-all text-center focus:outline-none"
              >
                HOD
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('FYP Office In-charge', 'fypincharge@cuiatd.edu.pk', 'Megamix@123')}
                className="py-2 px-3 text-xs font-bold rounded-lg border border-gray-200 text-gray-700 bg-gray-50 hover:bg-secondary hover:text-white hover:border-secondary transition-all text-center focus:outline-none"
              >
                FYP Incharge
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('Faculty Supervisor', 'faculty@cuiatd.edu.pk', 'Megamix@123')}
                className="py-2 px-3 text-xs font-bold rounded-lg border border-gray-200 text-gray-700 bg-gray-50 hover:bg-secondary hover:text-white hover:border-secondary transition-all text-center focus:outline-none"
              >
                Faculty
              </button>
            </div>
            <div className="flex justify-center mt-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('FYP Office Assistant', 'office@cuiatd.edu.pk', 'Megamix@123')}
                className="w-full py-2 px-3 text-xs font-bold rounded-lg border border-gray-200 text-gray-700 bg-gray-50 hover:bg-secondary hover:text-white hover:border-secondary transition-all text-center focus:outline-none"
              >
                Office Assistant
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
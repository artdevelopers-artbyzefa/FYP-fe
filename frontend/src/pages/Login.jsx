import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginUser } from '../services/auth.service';
import AppToast from '../components/AppToast';

const roles = [
  { id: 'Student', label: 'Student' },
  { id: 'HOD', label: 'HOD' },
  { id: 'FYP Office', label: 'FYP Office' },
  { id: 'Admin', label: 'System Administrator' },
  { id: 'Faculty', label: 'Faculty Supervisor' },
  { id: 'Industry', label: 'Industry Supervisor' },
];

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      role: 'Student'
    }
  });

  const selectedRole = watch('role');
  const activeRoleLabel = roles.find(r => r.id === selectedRole)?.label || 'Student';

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await loginUser(data);
      AppToast.success('Login Successful', 'Welcome back to the FYP Portal!');
      navigate('/dashboard');
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
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors mb-6">
          <i className="fas fa-arrow-left"></i> Back to Home
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
          
          {/* Role Selection - ONLY corners rounded, NO font changes */}
          <div className="flex flex-col gap-1.5 mb-5 relative">
            <label className="text-xs font-bold text-gray-600">Select Role</label>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full py-3 pr-10 pl-11 border-[1.5px] border-gray-200 rounded-xl text-sm text-gray-800 bg-white cursor-pointer relative"
            >
              <i className="fas fa-user-circle absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none z-10"></i>
              <span>{activeRoleLabel}</span>
              <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
            </div>

            {isDropdownOpen && (
              <>
                <div className="absolute z-50 w-full top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                  <div className="flex flex-col">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          setValue('role', role.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-normal transition-all ${
                          selectedRole === role.id 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
              </>
            )}
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
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.password.message}</p>}
          </div>

          {/* Remember & Forgot */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remMe" className="w-4 h-4 accent-primary cursor-pointer border-gray-300 rounded"/>
              <label htmlFor="remMe" className="text-xs font-bold text-gray-500 cursor-pointer select-none">Remember me</label>
            </div>
            <Link to="/forgot-password" strokeLinecap="round" className="text-xs font-bold text-primary hover:underline">Forgot Password?</Link>
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
        </form>
      </div>
    </div>
  );
};

export default Login;
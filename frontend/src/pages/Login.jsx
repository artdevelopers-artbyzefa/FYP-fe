import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Removed lucide-react import

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [role, setRole] = useState('Student');

  const roles = [
    { id: 'student', label: 'Student', icon: 'fa-graduation-cap' },
    { id: 'hod', label: 'HOD', icon: 'fa-shield-halved' },
    { id: 'fyp-office', label: 'FYP Office', icon: 'fa-building' },
    { id: 'admin', label: 'System Administrator', icon: 'fa-user' },
    { id: 'faculty', label: 'Faculty Supervisor', icon: 'fa-users' },
    { id: 'industry', label: 'Industry Supervisor', icon: 'fa-briefcase' },
  ];

  const SelectedIcon = roles.find(r => r.label === role)?.icon || 'fa-user';

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      {/* Login Card */}
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 lg:p-12 shadow-2xl relative">
        
        {/* Back to Home */}
        <Link 
          to="/" 
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-navy transition-colors font-medium text-sm"
        >
          <i className="fas fa-arrow-left text-sm"></i>
          Back to Home
        </Link>

        {/* Logo & Header */}
        <div className="text-center mt-8 mb-10">
          <div className="flex justify-center mb-4">
            <img src="/cuilogo.png" alt="CUI Logo" className="h-20 w-auto" />
          </div>
          <h1 className="text-2xl font-extrabold text-navy leading-tight">
            CUI Abbottabad
          </h1>
          <p className="text-gray-500 font-semibold text-sm tracking-wide">
            FYP Management System
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          
          {/* Custom Role Selection */}
          <div className="space-y-2 relative">
            <label className="block text-sm font-bold text-navy ml-1">Select Role</label>
            
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 border-2 rounded-2xl transition-all duration-200 ${
                isDropdownOpen ? 'border-blue-bright ring-4 ring-blue-bright/10' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white rounded-full text-gray-400 shadow-sm border border-gray-100 flex items-center justify-center w-8 h-8">
                  <i className={`fas ${SelectedIcon} text-sm`}></i>
                </div>
                <span className="text-gray-700 font-bold">{role}</span>
              </div>
              <i className={`fas fa-chevron-down text-sm text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {/* Dropdown Menu - Full width, specific internal padding */}
            {isDropdownOpen && (
              <>
                <div className="absolute z-20 w-full top-[calc(100%-10px)] left-0 bg-white border border-gray-200 rounded-b-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="py-1">
                    {roles.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setRole(item.label);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-16 py-3 text-[15px] transition-colors ${
                          role === item.label 
                            ? 'bg-blue-bright text-white font-bold' 
                            : 'text-navy font-semibold hover:bg-gray-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Overlay to close on click outside */}
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              </>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-navy ml-1">Email Address</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-bright focus:border-transparent outline-none text-gray-700 font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-navy ml-1">Password</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-bright focus:border-transparent outline-none text-gray-700 font-medium"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-navy focus:ring-navy" />
              <span className="text-sm font-bold text-navy/70 group-hover:text-navy transition-colors">Remember me</span>
            </label>
            <Link to="/forgot-password" strokeLinecap="round" className="text-sm font-bold text-navy hover:text-blue-bright transition-colors">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-navy text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-bright transition-all transform active:scale-[0.98] shadow-lg shadow-blue-900/20"
          >
            Sign In
            <i className="fas fa-arrow-right text-sm"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
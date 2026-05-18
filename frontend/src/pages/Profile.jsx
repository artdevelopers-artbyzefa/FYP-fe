import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Bell, 
  ChevronDown, 
  User, 
  Mail, 
  CreditCard, 
  Calendar, 
  Phone, 
  Save,
  UserPlus,
  LayoutGrid
} from 'lucide-react';
import { getUserInfo } from '../utils/app.utils';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const dynamicUser = getUserInfo();
  
  // State for form inputs
  const [formData, setFormData] = useState({
    fatherName: dynamicUser?.fatherName || '',
    section: dynamicUser?.classification || '',
    dob: dynamicUser?.dob || '',
    phone: dynamicUser?.phone || ''
  });

  // State for profile photo simulation
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Fallback to exact values shown in the user screenshot if dynamic user is incomplete
  const studentInfo = {
    name: dynamicUser?.name || 'AROOJ71004',
    id: dynamicUser?.studentId || 'FA21-BCS-000',
    email: dynamicUser?.email || 'arooj71004@gmail.com'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        toast.success('Photo loaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Validate mandatory fields
    if (!formData.fatherName.trim()) {
      toast.error("Father's Name is required");
      return;
    }
    
    // Simulate API request
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Saving profile details...',
        success: 'Profile updated successfully!',
        error: 'Failed to update profile'
      }
    );
  };

  return (
    <div className="font-poppins bg-[#f4f7fe] min-h-screen p-6 lg:p-8 space-y-6 select-none">
      {/* Top Header Bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 backdrop-blur-md rounded-[24px] p-4 border border-white/50 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors focus:outline-none shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-extrabold text-[#1e3a8a] tracking-tight font-poppins">My Profile</h1>
            <span className="text-[12px] font-semibold text-slate-400 tracking-tight font-poppins">CUI Abbottabad · Monday, May 18, 2026</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Phase Pill */}
          <div className="flex items-center gap-2 bg-emerald-50/60 border border-emerald-200/80 rounded-full px-4.5 py-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="text-[13px] font-bold text-emerald-700 font-poppins">Phase 1: Student Registration</span>
          </div>

          {/* Bell Icon */}
          <button 
            className="w-10 h-10 border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-colors focus:outline-none relative shrink-0"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-[20px] px-3 py-1.5 shadow-sm shrink-0">
            <div className="w-9 h-9 bg-blue-100 text-blue-800 rounded-full font-bold flex items-center justify-center text-sm shrink-0">
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                'AR'
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[13.5px] font-extrabold text-[#1e3a8a] leading-none font-poppins">{studentInfo.name}</span>
              <span className="text-[11px] font-bold text-slate-400 mt-0.5 font-poppins">Student</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 cursor-pointer" />
          </div>
        </div>
      </header>

      {/* Main Content Form Container */}
      <form onSubmit={handleSave} className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border border-slate-100 space-y-8">
        <div>
          <h2 className="text-[26px] font-black text-[#1e3a8a] leading-none tracking-tight font-poppins">Edit My Profile</h2>
          <p className="text-[14px] font-semibold text-slate-400 mt-2 font-poppins">Update your personal details and profile picture</p>
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {/* Upload Container Box */}
        <div 
          onClick={triggerFileSelect}
          className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100/50 transition-all duration-200 group"
        >
          <div className="w-28 h-28 bg-white border border-slate-100 rounded-[24px] flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-200">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover rounded-[24px]" />
            ) : (
              <UserPlus className="w-10 h-10 text-slate-300" />
            )}
          </div>
          <span className="text-[13.5px] font-bold text-slate-400 mt-4 tracking-tight font-poppins">
            Click image to upload profile photo (Mandatory)
          </span>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Father's Name */}
          <div className="space-y-2 text-left">
            <label className="text-[13px] font-bold text-slate-700 font-poppins">Father's Name</label>
            <div className="h-12 border border-slate-200 rounded-[14px] flex items-center px-4 bg-white focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                placeholder="Enter father's name"
                className="text-sm font-semibold text-slate-700 outline-none w-full pl-3 placeholder:text-slate-400/60 font-poppins"
              />
            </div>
          </div>

          {/* Current Section */}
          <div className="space-y-2 text-left">
            <label className="text-[13px] font-bold text-slate-700 font-poppins">Current Section</label>
            <div className="h-12 border border-slate-200 rounded-[14px] flex items-center px-4 bg-white focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
              <LayoutGrid className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="text"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                placeholder="e.g. A, B, C"
                className="text-sm font-semibold text-slate-700 outline-none w-full pl-3 placeholder:text-slate-400/60 font-poppins"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2 text-left">
            <label className="text-[13px] font-bold text-slate-700 font-poppins">Date of Birth</label>
            <div className="h-12 border border-slate-200 rounded-[14px] flex items-center px-4 bg-white focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="text"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                placeholder="dd/mm/yyyy"
                className="text-sm font-semibold text-slate-700 outline-none w-full pl-3 placeholder:text-slate-400/60 font-poppins"
              />
              <Calendar className="w-4 h-4 text-slate-400 shrink-0 ml-auto cursor-pointer hover:text-[#2563eb] transition-colors" />
            </div>
          </div>

          {/* WhatsApp / Mobile Number */}
          <div className="space-y-2 text-left">
            <label className="text-[13px] font-bold text-slate-700 font-poppins">WhatsApp/Mobile Number</label>
            <div className="h-12 border border-slate-200 rounded-[14px] flex items-center px-4 bg-white focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+92..."
                className="text-sm font-semibold text-slate-700 outline-none w-full pl-3 placeholder:text-slate-400/60 font-poppins"
              />
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex justify-end pt-4 shrink-0">
          <button 
            type="submit"
            className="bg-[#2563eb] text-white font-extrabold text-[14.5px] px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-600 transition-all duration-200 shadow-md shadow-blue-500/10 focus:outline-none"
          >
            <Save className="w-4.5 h-4.5 shrink-0" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

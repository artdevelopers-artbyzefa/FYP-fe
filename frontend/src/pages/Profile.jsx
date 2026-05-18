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

  // State for profile photo simulation (Mandatory)
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Fallback to exact values shown in the user screenshot if dynamic user is incomplete
  const studentInfo = {
    name: dynamicUser?.name || 'AROOJ71004',
    id: dynamicUser?.studentId || 'FA21-BCS-000',
    email: dynamicUser?.email || 'arooj71004@gmail.com'
  };

  // Enforces dd/mm/yy formatting on user typing dynamically
  const formatDOB = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    let formatted = '';
    if (digits.length > 0) {
      formatted += digits.slice(0, 2);
    }
    if (digits.length > 2) {
      formatted += '/' + digits.slice(2, 4);
    }
    if (digits.length > 4) {
      formatted += '/' + digits.slice(4, 6);
    }
    return formatted;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dob') {
      setFormData(prev => ({
        ...prev,
        dob: formatDOB(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
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
    
    // Strict validations
    if (!previewUrl) {
      toast.error('Profile photo is mandatory. Please upload a photo to save profile.');
      return;
    }
    if (!formData.fatherName.trim()) {
      toast.error("Father's Name is required");
      return;
    }
    if (!formData.section.trim()) {
      toast.error('Current Section is required');
      return;
    }
    if (!formData.dob.trim()) {
      toast.error('Date of Birth is required');
      return;
    }
    
    // Validate strict dd/mm/yy format (Day: 01-31, Month: 01-12, Year: 2 digits)
    const dobRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{2}$/;
    if (!dobRegex.test(formData.dob)) {
      toast.error('Date of Birth must be in dd/mm/yy format (e.g. 15/08/99)');
      return;
    }
    
    if (!formData.phone.trim()) {
      toast.error('WhatsApp/Mobile Number is required');
      return;
    }

    // Simulate API save request with sonner toaster promises
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
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 px-1 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors focus:outline-none shrink-0 shadow-sm bg-white"
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
          <div className="flex items-center gap-2 bg-[#eefdf5] border border-emerald-200/80 rounded-full px-4.5 py-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="text-[13px] font-bold text-emerald-700 font-poppins">Phase 1: Student Registration</span>
          </div>

          {/* Bell Icon */}
          <button 
            className="w-10 h-10 border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-colors focus:outline-none relative shrink-0 bg-white shadow-sm"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
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

      {/* Main Content Form Card Container */}
      <form onSubmit={handleSave} className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border border-slate-100 space-y-8 max-w-full">
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

        {/* Upload Container Box - Responsive Width & Centered on Desktop */}
        <div 
          onClick={triggerFileSelect}
          className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100/50 transition-all duration-200 group w-full md:max-w-2xl mx-auto"
        >
          <div className="w-28 h-28 bg-white border border-slate-100 rounded-[24px] flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-200">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover rounded-[24px]" />
            ) : (
              <UserPlus className="w-10 h-10 text-slate-300" />
            )}
          </div>
          <span className="text-[13.5px] font-bold text-slate-400 mt-4 tracking-tight font-poppins text-center">
            Click image to upload profile photo (Mandatory)
          </span>
        </div>

        {/* Form Fields Grid - Stack on mobile, grid on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Father's Name */}
          <div className="space-y-2 text-left">
            <label className="text-[13px] font-bold text-slate-700 font-poppins">Father's Name</label>
            <div className="h-12 border border-slate-200 rounded-[14px] flex items-center px-4 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                placeholder="Enter father’s name"
                className="text-sm font-semibold text-slate-700 outline-none w-full pl-3 placeholder:text-slate-400/60 font-poppins"
              />
            </div>
          </div>

          {/* Current Section */}
          <div className="space-y-2 text-left">
            <label className="text-[13px] font-bold text-slate-700 font-poppins">Current Section</label>
            <div className="h-12 border border-slate-200 rounded-[14px] flex items-center px-4 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
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
            <div className="h-12 border border-slate-200 rounded-[14px] flex items-center px-4 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="text"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                placeholder="dd/mm/yy"
                maxLength={8}
                className="text-sm font-semibold text-slate-700 outline-none w-full pl-3 placeholder:text-slate-400/60 font-poppins"
              />
              <Calendar className="w-4 h-4 text-slate-400 shrink-0 ml-auto cursor-pointer hover:text-blue-600 transition-colors" />
            </div>
          </div>

          {/* WhatsApp / Mobile Number */}
          <div className="space-y-2 text-left">
            <label className="text-[13px] font-bold text-slate-700 font-poppins">WhatsApp/Mobile Number</label>
            <div className="h-12 border border-slate-200 rounded-[14px] flex items-center px-4 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
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

        {/* Save Button Row - Aligned bottom right */}
        <div className="flex justify-end pt-4 shrink-0">
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm shadow-blue-500/10 focus:outline-none"
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

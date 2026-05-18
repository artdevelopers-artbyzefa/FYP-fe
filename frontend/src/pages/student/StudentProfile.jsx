import React, { useState, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { setUserInfo } from '../../utils/app.utils';
import { updateStudentProfile } from '../../services/student.service';
import { showToast as toast } from '../../components/AppToast';

export default function Profile() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fatherName: user.fatherName || '',
    section: user.section || '',
    dob: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
        setFormData({ ...formData, profilePic: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateStudentProfile(formData);
      toast.success(res.message);
      
      // Update local storage so the UI unlocks
      setUserInfo({ ...user, profileCompleted: true });
      
      // Then navigate to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Alert Banner for incomplete profile */}
      {!user.profileCompleted && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-2xl shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0"><i className="fas fa-exclamation-triangle text-amber-500"></i></div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-amber-800">Complete Your Profile to Unlock the FYP Workflow</h3>
              <div className="mt-1 text-xs text-amber-700">You must fill in your Father's Name, Section, Date of Birth, and upload a Profile Picture to proceed to the portal functionalities.</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Edit My Profile</h2>
        <p className="text-sm text-gray-500 mb-6">Update your personal details and profile picture</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Profile Pic Upload */}
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 rounded-2xl bg-white border shadow-sm overflow-hidden flex items-center justify-center mb-4 relative group cursor-pointer"
            >
              {profilePicPreview ? (
                <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <i className="fas fa-user-plus text-4xl text-gray-200"></i>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <i className="fas fa-camera text-white text-xl"></i>
              </div>
            </div>
            <p className="text-xs text-gray-400 font-medium">Click image to upload profile photo (Mandatory)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Father's Name</label>
              <div className="relative">
                <i className="fas fa-user-tie absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input type="text" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} placeholder="Enter father's name" className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:border-secondary focus:ring-2 focus:ring-blue-100 outline-none transition-all" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Current Section</label>
              <div className="relative">
                <i className="fas fa-users-rectangle absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input type="text" value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} placeholder="e.g. A, B, C" className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:border-secondary focus:ring-2 focus:ring-blue-100 outline-none transition-all" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Date of Birth</label>
              <div className="relative">
                <i className="fas fa-cake-candles absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:border-secondary focus:ring-2 focus:ring-blue-100 outline-none transition-all" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">WhatsApp/Mobile Number</label>
              <div className="relative">
                <i className="fas fa-phone absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+92..." className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:border-secondary focus:ring-2 focus:ring-blue-100 outline-none transition-all" required />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20">
              <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-save'}`}></i> {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

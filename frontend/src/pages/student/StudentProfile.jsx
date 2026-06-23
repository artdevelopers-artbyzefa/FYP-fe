import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { setUserInfo } from '../../utils/app.utils';
import { getStudentProfile, updateStudentProfile } from '../../services/student.service';
import { showToast as toast } from '../../components/AppToast';
import { AlertTriangle, Cake, Camera, Loader, Phone, Save, User, UserPlus, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
export default function Profile() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fatherName: '',
    section: '',
    dob: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const fileInputRef = useRef(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  useEffect(() => {
    getStudentProfile().then(data => {
      setFormData({
        fatherName: data.fatherName || '',
        section: data.section || '',
        dob: data.dateofBirth ? data.dateofBirth.split('T')[0] : '',
        phone: data.whatsappNumber || ''
      });
      if (data.profilepicture) setProfilePicPreview(data.profilepicture);
      setFetching(false);
    }).catch(() => {
      setFetching(false);
    });
  }, []);

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

  const [phoneError, setPhoneError] = useState('');

  const validatePhone = (phone) => /^\+92-\d{10}$/.test(phone);

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, phone: val });
    if (val && !validatePhone(val)) {
      setPhoneError('Format: +92-XXXXXXXXXX');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.phone && !validatePhone(formData.phone)) {
      toast.error('Phone must be in +92-XXXXXXXXXX format (e.g. +92-3315821144)');
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        fatherName: formData.fatherName,
        section: formData.section,
        dob: formData.dob,
        phone: formData.phone,
        profilepicture: profilePicPreview || undefined
      };
      const res = await updateStudentProfile(payload);
      toast.success(res.message);
      
      setUserInfo({ ...user, profileCompleted: true, profilepicture: profilePicPreview || user.profilepicture });
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex items-center justify-center min-h-[60vh]"><Loader className="animate-spin text-slate-900 text-3xl" /></div>;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="animate-in fade-in slide-in- duration-300">
      {/* Alert Banner for incomplete profile */}
      {!user.profileCompleted && (
        <div className="bg-white border-l-4 border-blue-600 p-4 mb-6 rounded-r-2xl shadow-card">
          <div className="flex">
            <div className="flex-shrink-0"><AlertTriangle className="text-slate-900" /></div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-slate-900">Complete Your Profile to Unlock the FYP Workflow</h3>
              <div className="mt-1 text-xs text-slate-900">You must fill in your Father's Name, Section, Date of Birth, and upload a Profile Picture to proceed to the portal functionalities.</div>
            </div>
          </div>
        </div>
      )}

      <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Edit My Profile</h2>
        <p className="text-sm text-slate-900 mb-6">Update your personal details and profile picture</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Profile Pic Upload */}
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border-2 border-dashed border-line">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 rounded-2xl bg-white border shadow-card overflow-hidden flex items-center justify-center mb-4 relative group cursor-pointer"
            >
              {profilePicPreview ? (
                <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserPlus className="text-4xl text-slate-900" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="text-white text-xl" />
              </div>
            </div>
            <p className="text-xs text-slate-900 font-medium">Click image to upload profile photo (Mandatory)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">Father's Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-900 text-sm" />
                <input type="text" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} placeholder="Enter father's name" className="w-full bg-white border border-line rounded-xl py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">Current Section</label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-900 text-sm" />
                <select value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} className="w-full bg-white border border-line rounded-xl py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none cursor-pointer" required>
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">Date of Birth</label>
              <div className="relative">
                <Cake className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-900 text-sm" />
                <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full bg-white border border-line rounded-xl py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">WhatsApp/Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-900 text-sm" />
                <input type="tel" value={formData.phone} onChange={handlePhoneChange} placeholder="+92-3315821144" className={`w-full bg-white border rounded-xl py-2.5 pl-10 pr-3 text-sm outline-none transition-all ${
                  !formData.phone ? 'border-line'
                  : validatePhone(formData.phone) ? 'border-emerald-500 ring-2 ring-emerald-200'
                  : 'border-red-500 ring-2 ring-red-200'
                }`} required />
              </div>
              {formData.phone && (
                <p className={`text-[10px] mt-1 ${validatePhone(formData.phone) ? 'text-emerald-600' : 'text-red-500'}`}>
                  {validatePhone(formData.phone) ? 'Valid format' : 'Must be +92-XXXXXXXXXX (10 digits)'}
                </p>
              )}
              {!formData.phone && (
                <p className="text-[10px] text-slate-500 mt-1">Format: +92-XXXXXXXXXX (e.g. +92-3315821144)</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500">
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

import React, { useState, useEffect } from 'react';
import { useOutletContext, Link, Navigate } from 'react-router-dom';
import { getStudentProfile } from '../../services/student.service';
import { FolderOpen, IdCard, Inbox, Lightbulb, Loader, Mail, User, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const PROFILE_CACHE_KEY = 'cached_profile';

export default function Dashboard() {
  const { user } = useOutletContext();
  const cached = (() => { try { const d = localStorage.getItem(PROFILE_CACHE_KEY); return d ? JSON.parse(d) : null; } catch { return null; } })();
  const [profile, setProfile] = useState(cached);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    getStudentProfile().then(data => {
      setProfile(data);
      setLoading(false);
      try { localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(data)); } catch {}
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader className="animate-spin text-slate-900 text-3xl" /></div>;

  if (!profile?.profileCompleted) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="animate-in fade-in slide-in- duration-300">
      
      {/* Student Profile Card (Internship Portal Matching) */}
      <motion.div variants={item} className="bg-white rounded-[2rem] border border-line shadow-card p-4 sm:p-6 mb-8 flex flex-col md:flex-row items-center gap-4 sm:gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-900 text-3xl">
          {profile.profilepicture ? (
            <img src={profile.profilepicture} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            <User className="text-slate-900" />
          )}
        </div>
        <div className="flex-1 text-center md:text-left min-w-0 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div className="min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight truncate px-2">{profile.name}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-3 justify-center md:justify-start px-2">
                <span className="text-slate-900 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider bg-slate-100 px-2.5 py-1.5 rounded-xl border border-line flex items-center shrink-0">
                  <IdCard className="w-4 h-4 mr-2 opacity-60" /> <span>{profile.regNo}</span>
                </span>
                <span className="text-slate-900 font-bold text-[9px] sm:text-[10px] bg-white px-2.5 py-1.5 rounded-xl border border-line flex items-center min-w-0">
                  <Mail className="mr-2 opacity-60 text-[10px] shrink-0" /> 
                  <span className="break-all sm:break-normal">{profile.email}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/50 rounded-2xl border border-line overflow-hidden grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-50">
            <div className="p-3 md:p-4 flex flex-col items-center md:items-start transition-colors hover:bg-white">
              <p className="text-[8px] md:text-[9px] font-bold text-slate-900 tracking-widest mb-1 md:mb-1.5">Father's Name</p>
              <p className="text-[10px] md:text-xs font-bold text-slate-900 truncate w-full text-center md:text-left">{profile.fatherName}</p>
            </div>
            <div className="p-3 md:p-4 flex flex-col items-center md:items-start transition-colors hover:bg-white">
              <p className="text-[8px] md:text-[9px] font-bold text-slate-900 tracking-widest mb-1 md:mb-1.5">Classification</p>
              <p className="text-[10px] md:text-xs font-bold text-slate-900 text-center md:text-left">Sem {profile.semester} / {profile.section}</p>
            </div>
            <div className="p-3 md:p-4 flex flex-col items-center md:items-start transition-colors hover:bg-white">
              <p className="text-[8px] md:text-[9px] font-bold text-slate-900 tracking-widest mb-1 md:mb-1.5">Academic Merit</p>
              <p className="text-[10px] md:text-xs font-bold text-slate-900 text-center md:text-left">{profile.cgpa} CGPA</p>
            </div>
            <div className="p-3 md:p-4 flex flex-col items-center md:items-start transition-colors hover:bg-white">
              <p className="text-[8px] md:text-[9px] font-bold text-slate-900 tracking-widest mb-1 md:mb-1.5">Course</p>
              <p className="text-[10px] md:text-xs font-bold text-slate-900 truncate w-full text-center md:text-left">FYP-1</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
        
        {/* Tabs Card */}
        <motion.div variants={item} className="bg-white rounded-[2rem] border border-line shadow-card p-6 min-h-[250px]">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-5 border-b border-line pb-4">
            <div className="flex gap-6 w-full md:w-auto overflow-x-auto">
              <button className="text-sm font-bold text-slate-900 border-b-2 border-line pb-2 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-500"><Users className="w-4 h-4 mr-1.5 focus-visible:ring-2 focus-visible:ring-blue-500" /> Group Members</button>
              <Link to="/partners/requests" className="text-sm font-bold text-slate-900 hover:text-blue-600 pb-2 whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"><Inbox className="w-4 h-4 mr-1.5 focus-visible:ring-2 focus-visible:ring-blue-500" /> Requests</Link>
              <Link to="/project/approved" className="text-sm font-bold text-slate-900 hover:text-blue-600 pb-2 whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"><Lightbulb className="w-4 h-4 mr-1.5 focus-visible:ring-2 focus-visible:ring-blue-500" /> Ideas</Link>
            </div>
          </div>
          <div className="text-center py-16 text-sm text-slate-900 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl text-slate-900 mb-4">
              <FolderOpen className="w-4 h-4" />
            </div>
            <p className="font-bold text-slate-900">No detailed records to display yet.</p>
            <p className="text-xs mt-1">Start by finding FYP partners or submitting a new idea.</p>
          </div>
        </motion.div>

        {/* Side Widget (Task Completion) */}
        <motion.div variants={item} className="bg-white rounded-[2rem] border border-line shadow-card p-6 min-h-[250px] flex flex-col items-center">
          <div className="w-full text-left mb-6">
            <h3 className="text-base font-bold text-slate-900">Task Completion</h3>
            <p className="text-[10px] font-bold text-slate-900 tracking-widest mt-1">Overall Project Progress</p>
          </div>
          
          <div className="relative flex-1 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-36 h-36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eff6ff" strokeWidth="4"/>
              <path strokeDasharray="25, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2563EB" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
              <span className="text-3xl font-bold text-slate-900 leading-none">25%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
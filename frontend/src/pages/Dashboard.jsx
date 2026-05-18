import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';
import { API_URLS } from '../services/apiUrls';
import {
  ChevronLeft,
  Bell,
  ChevronDown,
  User,
  Mail,
  CreditCard,
  FolderOpen,
  Users,
  ClipboardList,
  Lightbulb
} from 'lucide-react';
import { getUserInfo } from '../utils/app.utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const dynamicUser = getUserInfo();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      setError(null);
      try {
        await api.get(API_URLS.dashboardStats);
      } catch (err) {
        console.error("Dashboard stats fetched failed, using local mocked states", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  // Tab states for the bottom left card
  const [activeTab, setActiveTab] = useState('members');

  // Fallback to exact values shown in the user screenshot if dynamic user is incomplete
  const studentInfo = {
    name: dynamicUser?.name || 'AROOJ71004',
    id: dynamicUser?.studentId || 'FA21-BCS-000',
    email: dynamicUser?.email || 'arooj71004@gmail.com',
    fatherName: dynamicUser?.fatherName || 'Arooj Fatima',
    classification: dynamicUser?.classification || 'Sem 8 / A',
    academicMerit: dynamicUser?.cgpa !== undefined ? `${dynamicUser.cgpa} CGPA` : '0.00 CGPA',
    course: dynamicUser?.course || 'FYP-1'
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
            <h1 className="text-2xl font-extrabold text-[#1e3a8a] tracking-tight font-poppins">Dashboard</h1>
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
              AR
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[13.5px] font-extrabold text-[#1e3a8a] leading-none font-poppins">{studentInfo.name}</span>
              <span className="text-[11px] font-bold text-slate-400 mt-0.5 font-poppins">Student</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 cursor-pointer" />
          </div>
        </div>
      </header>

      {/* Main Info Card */}
      <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 md:items-center">
        {/* Profile Card Placeholder */}
        <div className="w-24 h-24 bg-[#f8fafc] border border-slate-100 rounded-[20px] flex items-center justify-center shrink-0">
          <User className="w-10 h-10 text-slate-300" />
        </div>

        {/* Text Info */}
        <div className="flex-grow space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
            <h2 className="text-3xl font-black text-[#1e3a8a] tracking-tight leading-none font-poppins">{studentInfo.name}</h2>
            <div className="flex flex-wrap gap-2.5">
              <div className="bg-[#eff6ff] text-[#2563eb] text-[13px] font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-blue-50/50">
                <CreditCard className="w-3.5 h-3.5 shrink-0" />
                <span>{studentInfo.id}</span>
              </div>
              <div className="bg-[#f8fafc] text-[#64748b] text-[13px] font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-slate-100">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>{studentInfo.email}</span>
              </div>
            </div>
          </div>

          {/* Details Container Box with separator lines */}
          <div className="bg-[#f8fafc] border border-slate-100/80 rounded-[20px] p-5 px-6 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
            <div className="md:border-r border-slate-200/60 md:pr-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-poppins">Father's Name</p>
              <p className="text-[14.5px] font-extrabold text-[#1e3a8a] font-poppins">{studentInfo.fatherName}</p>
            </div>
            <div className="md:border-r border-slate-200/60 md:px-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-poppins">Classification</p>
              <p className="text-[14.5px] font-extrabold text-[#1e3a8a] font-poppins">{studentInfo.classification}</p>
            </div>
            <div className="md:border-r border-slate-200/60 md:px-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-poppins">Academic Merit</p>
              <p className="text-[14.5px] font-extrabold text-[#1e3a8a] font-poppins">{studentInfo.academicMerit}</p>
            </div>
            <div className="md:pl-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-poppins">Course</p>
              <p className="text-[14.5px] font-extrabold text-[#1e3a8a] font-poppins">{studentInfo.course}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Interactive Tabs Card */}
        <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border border-slate-100 lg:col-span-2 flex flex-col justify-between min-h-[360px]">
          {/* Tab Headers */}
          <div>
            <div className="flex items-center gap-6 border-b border-slate-100 pb-3 shrink-0">
              <button
                onClick={() => setActiveTab('members')}
                className={`relative pb-3 text-[15px] font-bold font-poppins transition-colors focus:outline-none flex items-center gap-2 ${activeTab === 'members' ? 'text-[#1e3a8a]' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Group Members</span>
                {activeTab === 'members' && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-[#2563eb] rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('requests')}
                className={`relative pb-3 text-[15px] font-bold font-poppins transition-colors focus:outline-none flex items-center gap-2 ${activeTab === 'requests' ? 'text-[#1e3a8a]' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <ClipboardList className="w-4 h-4 shrink-0" />
                <span>Requests</span>
                {activeTab === 'requests' && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-[#2563eb] rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('ideas')}
                className={`relative pb-3 text-[15px] font-bold font-poppins transition-colors focus:outline-none flex items-center gap-2 ${activeTab === 'ideas' ? 'text-[#1e3a8a]' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <Lightbulb className="w-4 h-4 shrink-0" />
                <span>Ideas</span>
                {activeTab === 'ideas' && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-[#2563eb] rounded-full"></span>
                )}
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#f8fafc] border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 shadow-sm shrink-0">
              <FolderOpen className="w-8 h-8 text-slate-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[16px] font-extrabold text-[#1e3a8a] font-poppins">No detailed records to display yet.</h3>
              <p className="text-[13px] font-semibold text-slate-400 font-poppins leading-relaxed">Start by finding FYP partners or submitting a new idea.</p>
            </div>
          </div>
        </div>

        {/* Right Circular Progress Card */}
        <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border border-slate-100 flex flex-col justify-between min-h-[360px]">
          {/* Card Title */}
          <div className="shrink-0 text-left">
            <h3 className="text-[18px] font-extrabold text-[#1e3a8a] font-poppins">Task Completion</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 font-poppins">Overall Project Progress</p>
          </div>

          {/* Custom Visual Ring Progress Indicator */}
          <div className="flex-grow flex items-center justify-center py-6">
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              {/* Outer Shadow Circle Ring */}
              <svg className="w-full h-full transform -rotate-90 select-none" viewBox="0 0 100 100">
                {/* Background Ring Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#eff6ff"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Active Colored Sector Segment Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#2563eb"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="238.76"
                  strokeDashoffset="179.07"
                  strokeLinecap="round"
                  className="transition-all duration-[1500ms] ease-out"
                />
              </svg>

              {/* Central Text Label */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-[#1e3a8a] tracking-tight font-poppins leading-none">25%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import api from '../../services/api';
import { API_URLS } from '../../services/apiUrls';
import { 
  ProposalsIcon, 
  GroupsIcon, 
  EvaluationsIcon, 
  HeadManagementIcon,
  CalendarIcon
} from '../../assets/icons';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [data, setData] = useState({
    pendingProposalsCount: 1,
    defensesCount: 2,
    supervisedGroupsCount: 4,
    supervisedGroupsCapacity: '4/4',
    weeklyLogApprovalRate: '100%',
    committeeHeadStatus: 'PEC-1',
    committeeHeadActive: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get(API_URLS.facultyDashboard);
        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.warn('Backend API connection failed, using demo/mock dashboard data.', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner Section */}
      <div className="bg-[#1e3a8a] text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden">
        {/* Soft background glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        {/* Left Welcome Info */}
        <div className="max-w-xl space-y-3 z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            Welcome, {user?.name || 'Faculty'}!
          </h1>
          <p className="text-sm md:text-base text-black/90 leading-relaxed font-light">
            Here is your academic supervision and committee management dashboard. Track active student groups, review pending project proposals, and input committee evaluation scores.
          </p>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-col gap-3 w-full md:w-auto shrink-0 z-10">
          {/* Pending Proposals Button */}
          <button 
            onClick={() => navigate('/faculty/proposals')}
            className="flex items-center justify-between gap-4 bg-white text-black font-bold px-5 py-3 rounded-2xl shadow-md hover:bg-white transition-all duration-200 group text-sm w-full md:w-56"
          >
            <div className="flex items-center gap-2.5">
              <ProposalsIcon className="w-4 h-4 text-[#1e3a8a]" />
              <span>Pending Proposals</span>
            </div>
            <span className="bg-white text-black px-2 py-0.5 rounded-full text-xs font-black">
              ({data.pendingProposalsCount})
            </span>
          </button>

          {/* Defenses Button */}
          <button 
            onClick={() => navigate('/faculty/evaluations')}
            className="flex items-center justify-between gap-4 bg-[#f59e0b] text-white font-bold px-5 py-3 rounded-2xl shadow-md hover:bg-[#d97706] transition-all duration-200 group text-sm w-full md:w-56"
          >
            <div className="flex items-center gap-2.5">
              <EvaluationsIcon className="w-4 h-4 text-white" />
              <span>Defenses</span>
            </div>
            <span className="bg-white/30 text-white px-2 py-0.5 rounded-full text-xs font-black">
              ({data.defensesCount})
            </span>
          </button>
        </div>
      </div>

      {/* Summary Boxes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Supervised Groups */}
        <div className="bg-white rounded-2xl p-5 border border-black shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-200">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#2563eb] shrink-0 border border-black/30">
            <GroupsIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-black tracking-widest block">
              Supervised Groups
            </span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-black text-black">
                {data.supervisedGroupsCount}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white text-[#2563eb] border border-black/35">
                Full Cap ({data.supervisedGroupsCapacity})
              </span>
            </div>
          </div>
        </div>

        {/* Pending Proposals */}
        <div className="bg-white rounded-2xl p-5 border border-black shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-200">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black shrink-0 border border-black/30">
            <ProposalsIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-black tracking-widest block">
              Pending Proposals
            </span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-black text-black">
                {data.pendingProposalsCount}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white text-[#d97706] border border-black/30">
                Requires Review
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Log Approval */}
        <div className="bg-white rounded-2xl p-5 border border-black shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-200">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black shrink-0 border border-black/30">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-black tracking-widest block">
              Weekly Log Approval
            </span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-black text-black">
                {data.weeklyLogApprovalRate}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white text-black border border-black/30">
                Up to date
              </span>
            </div>
          </div>
        </div>

        {/* Committee Head Status */}
        <div className="bg-white rounded-2xl p-5 border border-black shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-200">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black shrink-0 border border-black/30">
            <HeadManagementIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-black tracking-widest block">
              Committee Head Status
            </span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-black text-black">
                {data.committeeHeadStatus}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white text-black border border-black/30">
                Active Head
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Functional Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Student Proposals Card */}
        <div 
          onClick={() => navigate('/faculty/proposals')}
          className="bg-white rounded-2xl p-6 border border-black shadow-sm flex flex-col justify-between h-48 hover:-translate-y-1 hover:shadow-md transition-all duration-250 cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black border border-black/30">
              <ProposalsIcon className="w-5 h-5" />
            </div>
            <span className="text-black group-hover:text-blue-600 transition-colors text-xl font-light">→</span>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-[#1e3a8a] group-hover:text-[#2563eb] transition-colors">
              Student Proposals
            </h3>
            <p className="text-xs text-black leading-relaxed">
              Review incoming project proposals and request mandatory revisions.
            </p>
          </div>
        </div>

        {/* Project Supervision Card */}
        <div 
          onClick={() => navigate('/faculty/groups')}
          className="bg-white rounded-2xl p-6 border border-black shadow-sm flex flex-col justify-between h-48 hover:-translate-y-1 hover:shadow-md transition-all duration-250 cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#2563eb] border border-black/30">
              <GroupsIcon className="w-5 h-5" />
            </div>
            <span className="text-black group-hover:text-blue-600 transition-colors text-xl font-light">→</span>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-[#1e3a8a] group-hover:text-[#2563eb] transition-colors">
              Project Supervision
            </h3>
            <p className="text-xs text-black leading-relaxed">
              Track weekly log submissions and review draft thesis chapters.
            </p>
          </div>
        </div>

        {/* Committee Evaluations Card */}
        <div 
          onClick={() => navigate('/faculty/evaluations')}
          className="bg-white rounded-2xl p-6 border border-black shadow-sm flex flex-col justify-between h-48 hover:-translate-y-1 hover:shadow-md transition-all duration-250 cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black border border-black/30">
              <EvaluationsIcon className="w-5 h-5" />
            </div>
            <span className="text-black group-hover:text-blue-600 transition-colors text-xl font-light">→</span>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-[#1e3a8a] group-hover:text-[#2563eb] transition-colors">
              Committee Evaluations
            </h3>
            <p className="text-xs text-black leading-relaxed">
              Input scores per CLO criteria and submit locked evaluation scorecards.
            </p>
          </div>
        </div>

        {/* Committee Head Duties Card */}
        <div 
          onClick={() => navigate('/faculty/head-management')}
          className="bg-white rounded-2xl p-6 border border-[#fef08a] shadow-sm flex flex-col justify-between h-48 hover:-translate-y-1 hover:shadow-md transition-all duration-250 cursor-pointer group bg-gradient- /20"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center text-black border border-black/40">
              <HeadManagementIcon className="w-5 h-5" />
            </div>
            <span className="text-black group-hover:text-blue-600 transition-colors text-xl font-light">→</span>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-[#1e3a8a] group-hover:text-[#2563eb] transition-colors">
              Committee Head Duties
            </h3>
            <p className="text-xs text-black leading-relaxed">
              Consolidate member evaluations and publish final consensus scores.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

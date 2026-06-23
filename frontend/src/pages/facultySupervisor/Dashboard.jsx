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
import { motion } from 'framer-motion';
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      
      <motion.div variants={item} className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="max-w-xl space-y-3 z-10">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome, {user?.name || 'Faculty'}!
          </h1>
          <p className="text-sm md:text-base text-blue-200 leading-relaxed">
            Here is your academic supervision and committee management dashboard. Track active student groups, review pending project proposals, and input committee evaluation scores.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto shrink-0 z-10">
          <button 
            onClick={() => navigate('/faculty/proposals')}
            className="flex items-center justify-between gap-4 bg-white text-blue-900 font-semibold px-5 py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 group text-sm w-full md:w-56 focus-visible:ring-2 focus-visible:ring-white"
          >
            <div className="flex items-center gap-2.5">
              <ProposalsIcon className="w-4 h-4 text-blue-600" />
              <span>Pending Proposals</span>
            </div>
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
              ({data.pendingProposalsCount})
            </span>
          </button>

          <button 
            onClick={() => navigate('/faculty/evaluations')}
            className="flex items-center justify-between gap-4 bg-blue-600 text-white font-semibold px-5 py-3 rounded-xl shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 group text-sm w-full md:w-56 focus-visible:ring-2 focus-visible:ring-white"
          >
            <div className="flex items-center gap-2.5">
              <EvaluationsIcon className="w-4 h-4 text-white" />
              <span>Defenses</span>
            </div>
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-bold">
              ({data.defensesCount})
            </span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        
        <motion.div variants={item} className="bg-white rounded-2xl p-5 border border-line shadow-card flex items-center gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
            <GroupsIcon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider block">
              Supervised Groups
            </span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-extrabold text-slate-900">
                {data.supervisedGroupsCount}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">
                Full Cap ({data.supervisedGroupsCapacity})
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-2xl p-5 border border-line shadow-card flex items-center gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
            <ProposalsIcon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider block">
              Pending Proposals
            </span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-extrabold text-slate-900">
                {data.pendingProposalsCount}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700">
                Requires Review
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-2xl p-5 border border-line shadow-card flex items-center gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider block">
              Weekly Log Approval
            </span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-extrabold text-slate-900">
                {data.weeklyLogApprovalRate}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                Up to date
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-2xl p-5 border border-line shadow-card flex items-center gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
            <HeadManagementIcon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider block">
              Committee Head Status
            </span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-extrabold text-slate-900">
                {data.committeeHeadStatus}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">
                Active Head
              </span>
            </div>
          </div>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <motion.div 
          variants={item}
          onClick={() => navigate('/faculty/proposals')}
          className="bg-white rounded-2xl p-6 border border-line shadow-card flex flex-col justify-between h-48 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer group focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <ProposalsIcon className="w-5 h-5" />
            </div>
            <span className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-200 text-xl font-light">→</span>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
              Student Proposals
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review incoming project proposals and request mandatory revisions.
            </p>
          </div>
        </motion.div>

        <motion.div 
          variants={item}
          onClick={() => navigate('/faculty/groups')}
          className="bg-white rounded-2xl p-6 border border-line shadow-card flex flex-col justify-between h-48 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer group focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <GroupsIcon className="w-5 h-5" />
            </div>
            <span className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-200 text-xl font-light">→</span>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
              Project Supervision
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track weekly log submissions and review draft thesis chapters.
            </p>
          </div>
        </motion.div>

        <motion.div 
          variants={item}
          onClick={() => navigate('/faculty/evaluations')}
          className="bg-white rounded-2xl p-6 border border-line shadow-card flex flex-col justify-between h-48 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer group focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <EvaluationsIcon className="w-5 h-5" />
            </div>
            <span className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-200 text-xl font-light">→</span>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
              Committee Evaluations
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Input scores per CLO criteria and submit locked evaluation scorecards.
            </p>
          </div>
        </motion.div>

        <motion.div 
          variants={item}
          onClick={() => navigate('/faculty/head-management')}
          className="bg-white rounded-2xl p-6 border border-blue-200 shadow-card flex flex-col justify-between h-48 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer group bg-blue-50/30 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <HeadManagementIcon className="w-5 h-5" />
            </div>
            <span className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-200 text-xl font-light">→</span>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
              Committee Head Duties
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Consolidate member evaluations and publish final consensus scores.
            </p>
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
}

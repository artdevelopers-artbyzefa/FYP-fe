import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getFacultyDashboardStats } from '../../services/faculty.service';
import { ArrowRight, Crown, GitBranch, Landmark, Star, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacultyDashboardStats().then((res) => setStats(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-56 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-line p-6 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div className="skeleton h-12 w-12 rounded-2xl" />
                <div className="skeleton h-6 w-20 rounded-full" />
              </div>
              <div className="skeleton h-3 w-32 rounded-md mb-2" />
              <div className="skeleton h-8 w-16 rounded-md" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-line shadow-card">
              <div className="flex justify-between items-center mb-4">
                <div className="skeleton h-10 w-10 rounded-xl" />
                <div className="skeleton h-5 w-5 rounded-md" />
              </div>
              <div className="skeleton h-5 w-40 rounded-md mb-1" />
              <div className="skeleton h-3 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome Banner */}
      <motion.div variants={item} className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 rounded-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="relative px-6 sm:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-semibold text-blue-200 tracking-widest ">Faculty Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight text-balance">
                {(() => {
                  const pk = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }));
                  const h = pk.getHours();
                  if (h < 12) return 'Good Morning';
                  if (h < 17) return 'Good Afternoon';
                  return 'Good Evening';
                })()}, <span className="text-white font-semibold">{user?.name || 'Faculty'}</span>
              </h1>
              <p className="text-sm text-blue-200 font-medium max-w-2xl leading-relaxed">
                Track your supervised groups, review supervision requests, and manage committee duties.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => navigate('/faculty/proposals')} className="group relative overflow-hidden bg-white text-blue-900 px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-white">
                <span className="relative flex items-center gap-2">
                  <UserCheck size={14} />
                  Supervision Requests
                  {(stats?.pendingRequests ?? 0) > 0 && (
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {stats.pendingRequests}
                    </span>
                  )}
                </span>
              </button>
              <button onClick={() => navigate('/faculty/evaluations')} className="group relative overflow-hidden bg-white/15 border border-white/20 text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95 hover:bg-white/20 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-white">
                <Star size={14} />
                Committee Evaluations
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          variants={item}
          onClick={() => navigate('/faculty/proposals')}
          className="group bg-white p-6 rounded-2xl border border-line shadow-card hover:shadow-card-hover hover:-translate-y-0.5 hover:border-blue-200 transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform duration-200">
              <UserCheck size={18} />
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base mb-1 group-hover:text-blue-700 transition-colors">Supervision Requests</h3>
            <p className="text-xs text-slate-400 font-medium">Review student requests to be your supervisee. Accept or reject supervision requests.</p>
          </div>
        </motion.div>
        <motion.div
          variants={item}
          onClick={() => navigate('/faculty/supervision')}
          className="group bg-white p-6 rounded-2xl border border-line shadow-card hover:shadow-card-hover hover:-translate-y-0.5 hover:border-blue-200 transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform duration-200">
              <GitBranch size={18} />
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base mb-1 group-hover:text-blue-700 transition-colors">Project Supervision</h3>
            <p className="text-xs text-slate-400 font-medium">Track weekly log submissions and review draft thesis chapters.</p>
          </div>
        </motion.div>
        <motion.div
          variants={item}
          onClick={() => navigate('/faculty/evaluations')}
          className="group bg-white p-6 rounded-2xl border border-line shadow-card hover:shadow-card-hover hover:-translate-y-0.5 hover:border-blue-200 transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform duration-200">
              <Star size={18} />
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base mb-1 group-hover:text-blue-700 transition-colors">Committee Evaluations</h3>
            <p className="text-xs text-slate-400 font-medium">Input scores per CLO criteria and submit locked evaluation scorecards.</p>
          </div>
        </motion.div>
        <motion.div
          variants={item}
          onClick={() => navigate('/faculty/head-duties')}
          className="group bg-white p-6 rounded-2xl border border-line shadow-card hover:shadow-card-hover hover:-translate-y-0.5 hover:border-blue-200 transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform duration-200">
              <Crown size={18} />
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base mb-1 group-hover:text-blue-700 transition-colors">Committee Head Duties</h3>
            <p className="text-xs text-slate-400 font-medium">Consolidate member evaluations and publish final consensus scores.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FacultyDashboard;

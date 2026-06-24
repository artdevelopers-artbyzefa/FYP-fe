import React, { useState, useEffect } from 'react';
import { useOutletContext, Link, Navigate } from 'react-router-dom';
import { getStudentProfile } from '../../services/student.service';
import { getGroupIdeas } from '../../services/student.service';
import { FolderOpen, IdCard, Inbox, Lightbulb, Loader, Lock, Mail, Send, User, Users, UserPlus, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const PROFILE_CACHE_KEY = 'cached_profile';

export default function Dashboard() {
  const { user } = useOutletContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groupIdeas, setGroupIdeas] = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem(PROFILE_CACHE_KEY);
    getStudentProfile().then(data => {
      setProfile(data);
      setLoading(false);
      try { localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(data)); } catch {}
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (profile?.group) {
      getGroupIdeas().then(res => {
        setGroupIdeas(res?.data || []);
        setIdeasLoading(false);
      }).catch(() => setIdeasLoading(false));
    }
  }, [profile]);

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        
        <motion.div variants={item} className="card p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-line">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex-center text-blue-600">
              <Users size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Group Members</h3>
              <p className="text-[10px] text-slate-500">{profile?.group?.name || 'Your FYP team'}</p>
            </div>
          </div>
          {profile?.group?.members?.length > 0 ? (
            <div className="flex-1 space-y-2">
              {profile.group.members.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex-center text-blue-600 text-xs font-bold flex-shrink-0">
                    {(m.name || '?').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-900 truncate">{m.name || 'Unknown'}</div>
                    <div className="text-[10px] text-slate-500 truncate">{m.email || ''}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex-center text-blue-400 mb-4">
                <UserPlus size={24} />
              </div>
              <p className="text-sm font-bold text-slate-900">No group yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-5 max-w-[200px]">Find partners to form your FYP group and start collaborating.</p>
              <Link to="/partners" className="btn-primary text-xs inline-flex items-center gap-1.5">
                <UserPlus size={14} /> Find Partners
              </Link>
            </div>
          )}
        </motion.div>

        <motion.div variants={item} className="card p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-line">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex-center text-amber-600">
              <Inbox size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Requests</h3>
              <p className="text-[10px] text-slate-500">Partner invitations</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
            <div className="w-14 h-14 rounded-full bg-amber-50 flex-center text-amber-400 mb-4">
              <Send size={24} />
            </div>
            <p className="text-sm font-bold text-slate-900">No pending requests</p>
            <p className="text-xs text-slate-500 mt-1 mb-5 max-w-[200px]">Partner requests and invitations will appear here.</p>
            <Link to="/partners/requests" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 bg-transparent border-0 cursor-pointer">
              View All <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        <motion.div variants={item} className="card p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-line">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex-center text-amber-600">
              <Lightbulb size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Group Ideas</h3>
              <p className="text-[10px] text-slate-500">Agreement-based proposals</p>
            </div>
          </div>
          {ideasLoading ? (
            <div className="flex-1 flex items-center justify-center py-6">
              <Loader className="animate-spin text-slate-300" size={20} />
            </div>
          ) : groupIdeas.length > 0 ? (
            <div className="flex-1 space-y-2">
              {groupIdeas.slice(0, 3).map(idea => {
                const totalVotes = profile?.group?.members?.length || 1;
                const agreeCount = idea.votes?.filter(v => v.decision === 'agree').length || 0;
                const isAgreed = idea.agreementStatus === 'agreed';
                const isVoting = idea.agreementStatus === 'voting';
                return (
                  <Link key={idea._id} to="/project/new" className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100 hover:bg-amber-50 transition-colors no-underline">
                    <div className={`w-9 h-9 rounded-lg flex-center text-xs font-bold flex-shrink-0 ${isAgreed ? 'bg-emerald-100 text-emerald-600' : isVoting ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                      {isAgreed ? <CheckCircle size={16} /> : isVoting ? <Clock size={16} /> : <Lightbulb size={16} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-slate-900 truncate">{idea.title}</div>
                      <div className="text-[10px] text-slate-500">{agreeCount}/{totalVotes} agreed</div>
                    </div>
                  </Link>
                );
              })}
              {groupIdeas.length > 3 && (
                <Link to="/project/new" className="block text-center text-xs font-bold text-blue-600 hover:text-blue-700 pt-2 no-underline">
                  View all {groupIdeas.length} ideas
                </Link>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
              <div className="w-14 h-14 rounded-full bg-gray-50 flex-center text-gray-300 mb-4">
                <Lightbulb size={24} />
              </div>
              <p className="text-sm font-bold text-slate-900">No ideas yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-5 max-w-[200px]">Propose an idea and get agreement from all group members.</p>
              <Link to="/project/new" className="btn-primary text-xs inline-flex items-center gap-1.5 no-underline">
                <Lightbulb size={14} /> Propose Idea
              </Link>
            </div>
          )}
        </motion.div>

      </div>
    </motion.div>
  );
}
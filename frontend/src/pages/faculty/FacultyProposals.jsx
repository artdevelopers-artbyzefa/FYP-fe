import React, { useEffect, useState, useContext } from 'react';
import { getSupervisorRequests, approveSupervisorRequest, rejectSupervisorRequest } from '../../services/faculty.service';
import { X, Check, Loader2, CheckCircle, AlertCircle, UserCheck, ShieldBan } from 'lucide-react';
import { motion } from 'framer-motion';
import PhaseContext from '../../contexts/PhaseContext';
const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const FacultyProposals = () => {
  const phaseCtx = useContext(PhaseContext);
  const currentPhase = phaseCtx?.currentPhase;
  const isPhase2OrLater = currentPhase && (currentPhase.key === 'phase2_development' || currentPhase.key === 'phase2_defense');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  useEffect(() => { if (!isPhase2OrLater) fetchRequests(); }, [isPhase2OrLater]);

  const fetchRequests = async () => {
    try {
      const res = await getSupervisorRequests();
      setRequests(res.data || []);
    } catch { showToastMsg('error', 'Failed to load supervisor requests.');
    } finally { setLoading(false); }
  };

  const showToastMsg = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 4000);
  };

  const handleApprove = async (reqId) => {
    setActionLoading(reqId);
    try {
      await approveSupervisorRequest(reqId);
      showToastMsg('success', 'Supervisor request approved. Group is now under your supervision.');
      setRequests(prev => prev.filter(r => r.id !== reqId));
    } catch { showToastMsg('error', 'Failed to approve request.');
    } finally { setActionLoading(null); }
  };

  const handleReject = async (reqId) => {
    if (!window.confirm('Reject this supervision request? The group will need to select another supervisor.')) return;
    setActionLoading(reqId);
    try {
      await rejectSupervisorRequest(reqId);
      showToastMsg('success', 'Supervisor request rejected.');
      setRequests(prev => prev.filter(r => r.id !== reqId));
    } catch { showToastMsg('error', 'Failed to reject request.');
    } finally { setActionLoading(null); }
  };

  if (isPhase2OrLater) return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Supervision Requests</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Review incoming student requests to be your supervisee.</p>
      </motion.div>
      <motion.div variants={item} className="bg-white rounded-2xl border border-amber-200 p-8 text-center shadow-card bg-amber-50">
        <ShieldBan className="w-10 h-10 mx-auto mb-3 text-amber-500" />
        <p className="font-bold text-amber-800">Supervision Requests Closed</p>
        <p className="text-xs text-amber-700 mt-1">The registration and group formation phase has ended. No new supervision requests can be processed at this stage.</p>
      </motion.div>
    </motion.div>
  );

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-blue-600 animate-spin" /><span className="ml-2 text-sm text-slate-500 font-medium">Loading requests...</span></div>;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Supervision Requests</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Review incoming student requests to be your supervisee.</p>
      </motion.div>
      <div className="space-y-4">
        {requests.length === 0 ? (
          <motion.div variants={item} className="bg-white rounded-2xl border border-line p-8 text-center shadow-card">
            <UserCheck className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-900">No pending supervision requests</p>
            <p className="text-xs text-slate-500 mt-1">When students request you as their supervisor, they will appear here.</p>
          </motion.div>
        ) : (
          requests.map(r => (
            <motion.div key={r.id} variants={item} className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
              <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="font-semibold text-slate-900 text-base truncate">{r.groupName}</h3>
                    {r.title && <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-line px-2 py-0.5 rounded-lg truncate max-w-[200px]">{r.title}</span>}
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">Pending</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                    <span>Leader: <strong className="text-slate-700">{r.leaderName}</strong> ({r.leaderRegNo})</span>
                    <span>Members: <strong className="text-slate-700">{r.members.length}</strong></span>
                    {r.members.length > 0 && <span className="text-slate-400">({r.members.map(m => m.name).join(', ')})</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleApprove(r.id)} disabled={actionLoading === r.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 cursor-pointer border-0 focus-visible:ring-2 focus-visible:ring-blue-500">
                    {actionLoading === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Accept
                  </button>
                  <button onClick={() => handleReject(r.id)} disabled={actionLoading === r.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-600 text-xs font-semibold rounded-xl border border-line hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all disabled:opacity-50 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
      {toast.show && (
        <div className="fixed bottom-8 right-8 z-50 animate-fadeSlideUp">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg text-sm font-semibold border ${toast.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white text-slate-800 border-line'}`}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FacultyProposals;

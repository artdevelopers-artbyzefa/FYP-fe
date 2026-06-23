import React, { useEffect, useState } from 'react';
import { getSupervisorRequests, approveSupervisorRequest, rejectSupervisorRequest } from '../../services/faculty.service';
import { X, Check, Loader2, CheckCircle, AlertCircle, UserCheck } from 'lucide-react';

const FacultyProposals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await getSupervisorRequests();
      setRequests(res.data || []);
    } catch (error) {
      console.error(error);
      showToastMsg('error', 'Failed to load supervisor requests.');
    } finally {
      setLoading(false);
    }
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
    } catch (error) {
      showToastMsg('error', error?.response?.data?.message || 'Failed to approve request.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reqId) => {
    if (!window.confirm('Reject this supervision request? The group will need to select another supervisor.')) return;
    setActionLoading(reqId);
    try {
      await rejectSupervisorRequest(reqId);
      showToastMsg('success', 'Supervisor request rejected.');
      setRequests(prev => prev.filter(r => r.id !== reqId));
    } catch (error) {
      showToastMsg('error', error?.response?.data?.message || 'Failed to reject request.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-black animate-spin" />
        <span className="ml-2 text-sm text-black font-medium">Loading requests...</span>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-black pb-4 mb-6">
        <h2 className="text-xl font-black text-black">Supervision Requests</h2>
        <p className="text-xs text-black mt-0.5 font-medium">Review incoming student requests to be your supervisee. Accept to take them under your supervision or reject to decline.</p>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black p-8 text-center text-black shadow-sm">
            <UserCheck className="w-10 h-10 mx-auto mb-3 text-black/40" />
            <p className="font-bold text-black">No pending supervision requests</p>
            <p className="text-xs text-black mt-1">When students request you as their supervisor, they will appear here.</p>
          </div>
        ) : (
          requests.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-black shadow-sm overflow-hidden">
              <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="font-black text-black text-base truncate">{r.groupName}</h3>
                    {r.title && (
                      <span className="text-xs font-bold text-black bg-white border border-black px-2 py-0.5 rounded-lg truncate max-w-[200px]">
                        {r.title}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-black bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded-lg">
                      Pending
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-black font-medium">
                    <span>Leader: <strong>{r.leaderName}</strong> ({r.leaderRegNo})</span>
                    <span>Members: <strong>{r.members.length}</strong></span>
                    {r.members.length > 0 && (
                      <span className="text-black/70">
                        ({r.members.map(m => m.name).join(', ')})
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(r.id)}
                    disabled={actionLoading === r.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading === r.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(r.id)}
                    disabled={actionLoading === r.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white text-black text-xs font-bold rounded-xl border border-black hover:bg-white active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {toast.show && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in- slide-in- duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl text-sm font-bold border ${
            toast.type === 'success'
              ? 'bg-black text-white border-gray-800'
              : 'bg-white text-black border-black'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default FacultyProposals;

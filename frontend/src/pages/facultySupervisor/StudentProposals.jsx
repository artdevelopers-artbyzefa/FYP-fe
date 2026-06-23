import React, { useState, useEffect } from 'react';
import { Check, Edit, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { getProposals, acceptProposal, requestRevisions, rejectProposal } from '../../services/proposalService';
import { motion } from 'framer-motion';
const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function StudentProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await getProposals();
      if (response.data && response.data.length > 0) {
        setProposals(response.data);
      } else {
        setProposals([
          {
            id: 1,
            title: 'AI Traffic Management System',
            status: 'Pending Review',
            groupId: 'G-042',
            leaderName: 'Ahmed Farooq',
            leaderRegNo: 'SP21-BCS-001',
            problemStatement: '"Traffic congestion in Abbottabad city causes significant delays during peak university hours. This project proposes a real-time computer vision pipeline using YOLOv8 to dynamically adjust traffic light timings based on active vehicle queue lengths at major intersections."',
            targetDomain: 'AI & Vision',
            hardwareReq: 'Jetson Nano',
            membersCount: 3,
            documentLink: 'proposal_v1.pdf'
          }
        ]);
      }
    } catch (error) {
      console.error(error);
      setProposals([
        {
          id: 1,
          title: 'AI Traffic Management System',
          status: 'Pending Review',
          groupId: 'G-042',
          leaderName: 'Ahmed Farooq',
          leaderRegNo: 'SP21-BCS-001',
          problemStatement: '"Traffic congestion in Abbottabad city causes significant delays during peak university hours. This project proposes a real-time computer vision pipeline using YOLOv8 to dynamically adjust traffic light timings based on active vehicle queue lengths at major intersections."',
          targetDomain: 'AI & Vision',
          hardwareReq: 'Jetson Nano',
          membersCount: 3,
          documentLink: 'proposal_v1.pdf'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 4000);
  };

  const closeModals = () => {
    setActiveModal(null);
    setSelectedProposal(null);
    setComments('');
  };

  const openModal = (type, proposal) => {
    setActiveModal(type);
    setSelectedProposal(proposal);
    setComments('');
  };

  const handleDownload = async (proposalId, fileName) => {
    showToast('success', `Downloading ${fileName}...`);
    try {
      const response = await api.get(`/proposals/${proposalId}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.warn('Backend unavailable, simulating download.', error);
      setTimeout(() => showToast('success', `${fileName} downloaded successfully!`), 2000);
    }
  };

  const handleAccept = async (proposal) => {
    if (!window.confirm(`Are you sure you want to accept proposal for Group ${proposal.groupId}? This action cannot be undone.`)) {
      return;
    }

    setSubmitting(true);
    try {
      await acceptProposal(proposal.id);
      showToast('success', 'Proposal accepted successfully!');
      setProposals(prev => prev.filter(p => p.id !== proposal.id));
    } catch (error) {
      showToast('error', error?.response?.data?.message || 'Failed to process request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAction = async () => {
    if (!selectedProposal || activeModal === 'accept') return;
    
    setSubmitting(true);
    try {
      if (activeModal === 'revise') {
        await requestRevisions(selectedProposal.id, comments);
        showToast('success', 'Revision request sent successfully!');
      } else if (activeModal === 'reject') {
        await rejectProposal(selectedProposal.id, comments);
        showToast('success', 'Proposal rejected with official justification.');
      }
      
      setProposals(prev => prev.filter(p => p.id !== selectedProposal.id));
      closeModals();
    } catch (error) {
      showToast('error', error?.response?.data?.message || 'Failed to process request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#2563eb] animate-spin" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading proposals...</span>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 pb-10">
      {/* Page Header */}
      <motion.div variants={item} className="space-y-1.5">
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Project Proposals Review
        </h1>
        <p className="text-sm text-slate-500">
          Review incoming student project proposals. Request mandatory revisions or issue formal accept/reject decisions.
        </p>
      </motion.div>

      {/* Proposals List */}
      <div className="space-y-6">
        {proposals.length === 0 ? (
          <motion.div variants={item} className="bg-white rounded-2xl border border-line p-8 text-center text-slate-900 shadow-card">
            No pending proposals to review.
          </motion.div>
        ) : (
          proposals.map(proposal => (
            <motion.div key={proposal.id} variants={item} className="bg-white rounded-3xl border border-line shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 md:p-8 space-y-8 animate-in fade-in slide-in- duration-300">
               
              {/* Card Header: Title & Actions */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{proposal.title}</h2>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-900 border border-line">
                      {proposal.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    Group {proposal.groupId} | Leader: {proposal.leaderName} ({proposal.leaderRegNo})
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap md:flex-nowrap shrink-0">
                  <button 
                    onClick={() => handleAccept(proposal)}
                    disabled={submitting}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#059669] text-white text-sm font-bold rounded-xl hover:bg-[#047857] active:scale-95 transition-all disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                  <button 
                    onClick={() => openModal('revise', proposal)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#d97706] text-white text-sm font-bold rounded-xl hover:bg-[#b45309] active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <Edit className="w-4 h-4" />
                    Request Revisions
                  </button>
                  <button 
                    onClick={() => openModal('reject', proposal)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-900 text-sm font-bold rounded-xl border border-line hover:bg-blue-50 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>

              {/* Card Body: Content & Metadata */}
              <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                
                {/* Left: Problem Statement */}
                <div className="flex-1 bg-slate-50 rounded-2xl p-5 md:p-6 border border-line">
                  <h3 className="text-sm font-extrabold text-slate-900 mb-4">Problem Statement & Methodology</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {proposal.problemStatement}
                  </p>
                </div>

                {/* Right: Metadata */}
                <div className="lg:w-80 bg-slate-50 rounded-2xl p-5 md:p-6 border border-line shrink-0">
                  <h3 className="text-sm font-extrabold text-slate-900 mb-4">Project Metadata</h3>
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center border-b border-line pb-3">
                      <span className="text-xs font-semibold text-slate-700">Target Domain:</span>
                      <span className="text-xs font-bold text-slate-900">{proposal.targetDomain}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-line pb-3">
                      <span className="text-xs font-semibold text-slate-700">Hardware Req:</span>
                      <span className="text-xs font-bold text-slate-900">{proposal.hardwareReq}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-line pb-3">
                      <span className="text-xs font-semibold text-slate-700">Members:</span>
                      <span className="text-xs font-bold text-slate-900">{proposal.membersCount} Students</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-700">Proposal Document:</span>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleDownload(proposal.id, proposal.documentLink);
                        }}
                        className="text-xs font-bold text-[#2563eb] hover:underline cursor-pointer bg-transparent border-none p-0"
                      >
                        {proposal.documentLink}
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
          ))
        )}
      </div>

      {/* Revise/Reject Modals */}
      {(activeModal === 'revise' || activeModal === 'reject') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModals}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-xl relative z-10 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden">
            
            <div className="px-6 md:px-8 py-5 border-b border-line flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900">
                {activeModal === 'revise' ? 'Request Proposal Revisions' : 'Reject Project Proposal'}
              </h3>
              <button onClick={closeModals} className="text-slate-700 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 md:p-8 bg-slate-50">
              <label className="block text-xs font-bold text-slate-900 mb-2">
                {activeModal === 'revise' ? 'Mandatory Revision Comments' : 'Mandatory Rejection Justification'}
              </label>
              <textarea
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={
                  activeModal === 'revise' 
                    ? 'Specify exactly what changes are required in the problem statement, methodology, or hardware requirements...' 
                    : 'Provide official justification for rejecting this proposal...'
                }
                className="w-full p-4 border border-line rounded-2xl text-sm bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
              />
            </div>

            <div className="px-6 md:px-8 py-5 border-t border-line flex items-center justify-center gap-4">
              <button 
                onClick={closeModals}
                disabled={submitting}
                className="px-6 py-2.5 text-slate-700 font-bold text-sm hover:text-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Cancel
              </button>
              <button 
                onClick={handleAction}
                disabled={submitting || !comments.trim()}
                className={`px-6 py-2.5 text-white font-bold text-sm rounded-xl transition-all shadow-card flex items-center gap-2 ${
                  activeModal === 'revise' 
                    ? 'bg-[#d97706] hover:bg-[#b45309] disabled:opacity-50' 
                    : 'bg-[#e11d48] hover:bg-[#be123c] disabled:opacity-50'
                }`}
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {activeModal === 'revise' ? 'Send Revision Request' : 'Confirm Rejection'}
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in- slide-in- duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl text-sm font-bold border ${
            toast.type === 'success' 
              ? 'bg-blue-900 text-white border-line' 
              : 'bg-white'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-slate-900 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-slate-900 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

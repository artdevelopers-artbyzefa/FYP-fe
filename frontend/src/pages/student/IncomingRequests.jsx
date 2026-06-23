import React, { useState, useEffect } from 'react';
import { getIncomingRequests, respondPartnerRequest } from '../../services/student.service';
import { showToast as toast } from '../../components/AppToast';
import { Check, Loader, X } from 'lucide-react';
import { motion } from 'framer-motion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
export default function IncomingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIncomingRequests().then(data => {
      setRequests(data);
      setLoading(false);
    });
  }, []);

  const handleRespond = async (id, status) => {
    try {
      const res = await respondPartnerRequest(id, status);
      toast.success(res.message);
      setRequests(requests.filter(r => r.id !== id));
    } catch {
      toast.error('Action failed.');
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader className="animate-spin text-slate-900 text-2xl" /></div>;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="animate-in fade-in slide-in- duration-300">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Incoming Requests</h2>
      
      {requests.length === 0 ? (
        <div className="text-center py-16 text-sm text-slate-900 bg-white rounded-2xl border border-line max-w-3xl">
          No incoming requests found.
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl">
          {requests.map(req => (
            <motion.div variants={item} key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-line rounded-xl bg-white hover:border-blue-500 transition-colors gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white text-slate-900 rounded-full flex items-center justify-center font-black text-lg">
                  {req.name.substring(0,2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{req.name}</div>
                  <div className="text-xs text-slate-900 mt-0.5">{req.program} • {req.regNo} • CGPA: {req.cgpa}</div>
                </div>
              </div>
              <div className="flex gap-2 sm:ml-auto">
                <button 
                  onClick={() => handleRespond(req.id, 'accepted')}
                  className="bg-white hover:bg-white text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex-1 sm:flex-none"
                >
                  <Check className="w-4 h-4 mr-1.5" /> Accept
                </button>
                <button 
                  onClick={() => handleRespond(req.id, 'rejected')}
                  className="bg-white hover:bg-white text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex-1 sm:flex-none"
                >
                  <X className="w-4 h-4 mr-1.5" /> Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

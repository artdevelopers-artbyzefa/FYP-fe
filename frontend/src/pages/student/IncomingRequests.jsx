import React, { useState, useEffect } from 'react';
import { getIncomingRequests, respondPartnerRequest } from '../../services/student.service';
import { showToast as toast } from '../../components/AppToast';

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

  if (loading) return <div className="p-8 text-center"><i className="fas fa-spinner fa-spin text-primary text-2xl"></i></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Incoming Requests</h2>
      
      {requests.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-400 bg-white rounded-2xl border border-gray-100 max-w-3xl">
          No incoming requests found.
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl">
          {requests.map(req => (
            <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl bg-white hover:border-secondary transition-colors gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-lg">
                  {req.name.substring(0,2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-gray-800">{req.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{req.program} • {req.regNo} • CGPA: {req.cgpa}</div>
                </div>
              </div>
              <div className="flex gap-2 sm:ml-auto">
                <button 
                  onClick={() => handleRespond(req.id, 'accepted')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex-1 sm:flex-none"
                >
                  <i className="fas fa-check mr-1.5"></i> Accept
                </button>
                <button 
                  onClick={() => handleRespond(req.id, 'rejected')}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex-1 sm:flex-none"
                >
                  <i className="fas fa-times mr-1.5"></i> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

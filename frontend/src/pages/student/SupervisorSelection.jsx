import React, { useState, useEffect } from 'react';
import { getAvailableSupervisors, requestSupervisor } from '../../services/student.service';
import { showToast as toast } from '../../components/AppToast';

export default function SupervisorSelection() {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState({});

  useEffect(() => {
    getAvailableSupervisors().then(data => {
      setSupervisors(data);
      setLoading(false);
    });
  }, []);

  const handleRequest = async (id) => {
    setRequesting({...requesting, [id]: true});
    try {
      const res = await requestSupervisor(id);
      toast.success(res.message);
    } catch {
      toast.error('Request failed.');
    } finally {
      setRequesting({...requesting, [id]: false});
    }
  };

  if (loading) return <div className="p-8 text-center"><i className="fas fa-spinner fa-spin text-primary text-2xl"></i></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Supervisor Selection</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {supervisors.map(sup => (
          <div key={sup.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg hover:border-secondary transition-all flex flex-col">
            <div className="flex gap-4 mb-4 items-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-2xl">
                {sup.avatar}
              </div>
              <div>
                <div className="font-bold text-gray-800 text-lg">{sup.name}</div>
                <div className="text-xs text-gray-500 font-medium">{sup.designation}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium mb-6 flex-1">
              <i className="fas fa-tag text-blue-600 mr-2"></i> {sup.tags.join(', ')}
            </div>
            <button 
              onClick={() => handleRequest(sup.id)}
              disabled={requesting[sup.id]}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
            >
              {requesting[sup.id] ? 'Requesting...' : 'Request Supervisor'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

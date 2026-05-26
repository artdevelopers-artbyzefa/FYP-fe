import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getAssignedProjects } from '../../services/industry.service';
import { showToast as toast } from '../../components/AppToast';

const STATUS_BADGE = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  submitted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

export default function IndustryProjects() {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getAssignedProjects().then(setProjects);
  }, []);

  return (
    <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>
      <div className="rounded-[2rem] p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-gray-100 shadow-sm"
        style={{ background: 'linear-gradient(135deg, #2B3990, #1E3A8A)' }}>
        <div className="text-white">
          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">External Evaluation Portal</h1>
          <p className="text-sm text-white/80 font-medium max-w-2xl leading-relaxed">
            Welcome, {user.name}. Review assigned final year projects, download thesis documents, and input external evaluation scores per HEC/CUI standards.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {projects.filter(p => p.evaluationStatus === 'pending').length > 0 && (
            <button
              onClick={() => navigate(`/industry-dashboard/scoring?groupId=${projects.find(p => p.evaluationStatus === 'pending').groupId}`)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <i className="fas fa-star-half-alt"></i>
              Pending ({projects.filter(p => p.evaluationStatus === 'pending').length})
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="p-5 bg-gray-50 border-b border-gray-100">
          <h3 className="text-base font-black text-gray-800">Assigned Projects Roster</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Project Title & Group ID</th>
                <th className="py-3.5 px-6">Internal Supervisor</th>
                <th className="py-3.5 px-6">Thesis Document</th>
                <th className="py-3.5 px-6 text-center">Evaluation Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
              {projects.map(p => (
                <tr key={p.groupId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <span className="font-bold text-gray-900 block">{p.title}</span>
                      <span className="text-xs text-gray-500 font-mono">Group {p.groupId} · {p.members} Members</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 font-bold">{p.internalSupervisor}</td>
                  <td className="py-4 px-6">
                    <button onClick={() => toast.info(`Downloading ${p.thesisFile}...`)} className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                      <i className="fas fa-file-pdf mr-1"></i>{p.thesisFile}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`font-bold px-2.5 py-1 rounded-lg text-xs ${STATUS_BADGE[p.evaluationStatus]}`}>
                      {p.evaluationStatus === 'pending' ? 'Pending Scorecard' : 'Submitted ✓'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {p.evaluationStatus === 'pending' ? (
                      <button
                        onClick={() => navigate(`/industry-dashboard/scoring?groupId=${p.groupId}`)}
                        className="px-3 py-1.5 rounded-lg text-white hover:bg-blue-700 text-xs font-bold transition-all cursor-pointer shadow-sm"
                        style={{ backgroundColor: '#2563EB' }}
                      >
                        <i className="fas fa-edit mr-1"></i>Input Score
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 font-bold">Locked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

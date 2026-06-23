import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAssignedProjects } from '../../services/industry.service';
import { showToast as toast } from '../../components/AppToast';
import { FileText, Pencil, StarHalf } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const STATUS_BADGE = {
  pending: 'bg-white',
  submitted: 'bg-white',
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
      <div className="rounded-[2rem] p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-line shadow-card"
        >
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
              className="bg-white hover:bg-white text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <StarHalf className="w-4 h-4" />
              Pending ({projects.filter(p => p.evaluationStatus === 'pending').length})
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden mb-8">
        <div className="p-5 bg-white border-b border-line">
          <h3 className="text-base font-black text-slate-900">Assigned Projects Roster</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 border-b border-line text-[11px] font-black text-slate-900 uppercase tracking-wider">
                <th className="py-3.5 px-6">Project Title & Group ID</th>
                <th className="py-3.5 px-6">Internal Supervisor</th>
                <th className="py-3.5 px-6">Thesis Document</th>
                <th className="py-3.5 px-6 text-center">Evaluation Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-slate-50 text-sm font-medium text-slate-900">
              {projects.map(p => (
                <tr key={p.groupId} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <span className="font-bold text-slate-900 block">{p.title}</span>
                      <span className="text-xs text-slate-900 font-mono">Group {p.groupId} | {p.members} Members</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-900 font-bold">{p.internalSupervisor}</td>
                  <td className="py-4 px-6">
                    <button onClick={() => toast.info(`Downloading ${p.thesisFile}...`)} className="text-xs font-bold text-slate-900 hover:underline cursor-pointer">
                      <FileText className="w-4 h-4 mr-1" />{p.thesisFile}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`font-bold px-2.5 py-1 rounded-lg text-xs ${STATUS_BADGE[p.evaluationStatus]}`}>
                      {p.evaluationStatus === 'pending' ? 'Pending Scorecard' : 'Submitted '}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {p.evaluationStatus === 'pending' ? (
                      <button
                        onClick={() => navigate(`/industry-dashboard/scoring?groupId=${p.groupId}`)}
                        className="px-3 py-1.5 rounded-lg text-white hover:bg-blue-600 text-xs font-bold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none shadow-card"
                        style={{ backgroundColor: '#2563EB' }}
                      >
                        <Pencil className="w-4 h-4 mr-1" />Input Score
                      </button>
                    ) : (
                      <span className="text-xs text-slate-900 font-bold">Locked</span>
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

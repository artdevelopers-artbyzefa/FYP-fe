import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowRight, GitBranch, UserCheck } from 'lucide-react';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext();

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 rounded-2xl">
        <div className="relative px-6 sm:px-8 py-6 sm:py-8">
          <div className="text-white">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">
              Welcome, {user?.name || 'Faculty'}
            </h1>
            <p className="text-sm text-blue-200 font-medium max-w-2xl">
              Supervision requests and your supervised groups.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div onClick={() => navigate('/faculty/proposals')} className="bg-white p-6 rounded-2xl border border-line shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <UserCheck size={18} />
            </div>
            <ArrowRight className="text-slate-300 ml-auto w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 text-base mb-1">Supervision Requests</h3>
          <p className="text-xs text-slate-400">Review student requests to be your supervisee.</p>
        </div>
        <div onClick={() => navigate('/faculty/supervision')} className="bg-white p-6 rounded-2xl border border-line shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <GitBranch size={18} />
            </div>
            <ArrowRight className="text-slate-300 ml-auto w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 text-base mb-1">Project Supervision</h3>
          <p className="text-xs text-slate-400">Track groups and review progress.</p>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showToast } from '../../components/AppToast';
import { ArrowLeft, UserCheck, UserX, Shield, GraduationCap, Mail, Phone, Calendar, Clock } from 'lucide-react';

const statusColors = {
  forming: 'bg-gray-100 text-gray-600 border-gray-200',
  pending_approval: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-blue-50 text-blue-700 border-blue-200',
  rejected: 'bg-rose-50 text-rose-600 border-rose-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-purple-50 text-purple-700 border-purple-200'
};

const SupervisorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/office-assistant/faculty/' + id)
      .then(res => res.json())
      .then(res => {
        if (res.data) setFaculty(res.data);
        else showToast.error('Faculty not found');
      })
      .catch(() => showToast.error('Failed to load faculty details'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400 text-sm font-bold">Loading...</div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-bold text-gray-600">Faculty not found</h3>
        <button onClick={() => navigate('/office-assistant/faculty')} className="mt-4 px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold cursor-pointer border-0">Back to Faculty</button>
      </div>
    );
  }

  const isActive = faculty.active;

  return (
    <>
      <div className="mb-6">
        <button onClick={() => navigate('/office-assistant/faculty')} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer bg-transparent border-0 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Faculty
        </button>

        <div className={`rounded-2xl border-2 p-6 ${isActive ? 'bg-emerald-50/40 border-emerald-200' : 'bg-red-50/40 border-red-200'}`}>
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0 ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {faculty.name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-black text-gray-800">{faculty.name}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${isActive ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'} flex items-center gap-1.5`}>
                  {isActive ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                  {isActive ? 'Active — Has logged in' : 'Inactive — Has not set up account'}
                </span>
                <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> {faculty.facultyType}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3 text-sm text-gray-600 bg-white/60 rounded-xl px-4 py-3">
              <Mail className="w-4 h-4 text-gray-400" /> {faculty.email}
            </div>
            {faculty.phone && (
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-white/60 rounded-xl px-4 py-3">
                <Phone className="w-4 h-4 text-gray-400" /> {faculty.phone}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-base font-black text-gray-700 tracking-tight flex items-center gap-2">
          <GraduationCap className="w-5 h-5" /> Supervised Groups ({faculty.groups?.length || 0})
        </h3>
      </div>

      {(!faculty.groups || faculty.groups.length === 0) && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-400 text-sm font-bold">No supervised groups yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {faculty.groups?.map(g => (
          <div key={g.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-gray-800 text-sm truncate">{g.title}</h4>
                <p className="text-xs text-gray-400 mt-1">Leader: {g.leader}</p>
                {g.members.length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">Members: {g.members.join(', ')}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${statusColors[g.status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                  {g.status?.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${g.progress || 0}%` }} />
                  </div>
                  <span className="font-bold text-gray-500">{g.progress || 0}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(g.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SupervisorDetail;
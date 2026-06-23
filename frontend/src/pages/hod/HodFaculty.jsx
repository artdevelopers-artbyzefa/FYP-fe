import React, { useEffect, useState, useCallback } from 'react';
import { getHodFacultyList } from '../../services/hod.service';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

const HodFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const loadFaculty = useCallback((p) => {
    getHodFacultyList(p || page, limit).then(res => {
      setFaculty(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    }).catch(err => {
      console.error(err);
    });
  }, [page]);

  useEffect(() => { loadFaculty(page); }, [page, loadFaculty]);

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight">Faculty</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">View all faculty members and their supervision details</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[11px] font-bold text-gray-400 tracking-wider">
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Phone</th>
                <th className="py-3.5 px-6">Faculty Type</th>
                <th className="py-3.5 px-6">Supervision Load</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
              {faculty.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-gray-300" />
                      <p className="text-sm font-bold text-gray-400">No faculty found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                faculty.map(f => (
                  <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-800">{f.name}</td>
                    <td className="py-4 px-6 text-gray-600 text-xs">{f.email || '-'}</td>
                    <td className="py-4 px-6 text-gray-600 text-xs">{f.phone || '-'}</td>
                    <td className="py-4 px-6">
                      <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border tracking-wider ${
                        f.facultyType === 'both' ? 'bg-violet-50 text-violet-700 border-violet-200'
                          : f.facultyType === 'supervisor' ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : f.facultyType === 'committee' ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}>{f.facultyType}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-xs font-bold">{f.supervisionLoad} group{f.supervisionLoad !== 1 ? 's' : ''}</td>
                    <td className="py-4 px-6">
                      <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border tracking-wider ${
                        f.isactive ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-600 border-rose-200'
                      }`}>{f.isactive ? 'Active' : 'Inactive'}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-xs font-bold text-gray-400">{total} total faculty</span>
          <div className="flex items-center gap-2">
            <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 3, totalPages - 6));
              const p = start + i;
              if (p > totalPages) return null;
              return (
                <button key={p} onClick={() => goToPage(p)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${p === page ? 'bg-primary text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HodFaculty;

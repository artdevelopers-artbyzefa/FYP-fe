import React, { useState, useEffect } from 'react';
import { getSystemHealth, triggerDatabaseBackup, clearApplicationCache } from '../../services/admin.service';
import { showToast as toast } from '../../components/AppToast';

export default function AdminMaintenance() {
  const [health, setHealth] = useState({});

  useEffect(() => {
    getSystemHealth().then(setHealth);
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-800">System Maintenance & Backup Console</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Trigger automated database backups, view system health metrics, and clear application cache</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h3 className="text-base font-black text-gray-800 pb-3 border-b border-gray-50">Database & Cache Maintenance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xl mb-3"><i className="fas fa-database"></i></div>
                <h4 className="font-black text-gray-900 text-sm mb-1">Database Backup Snapshot</h4>
                <p className="text-xs text-gray-600 leading-relaxed">Create an immediate, fully encrypted snapshot of the entire FYP database.</p>
              </div>
              <button onClick={async () => { const res = await triggerDatabaseBackup(); toast.success(res.message); }} className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"><i className="fas fa-cloud-download-alt"></i> Trigger Snapshot Backup</button>
            </div>
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl mb-3"><i className="fas fa-broom"></i></div>
                <h4 className="font-black text-gray-900 text-sm mb-1">Clear Application Cache</h4>
                <p className="text-xs text-gray-600 leading-relaxed">Flush system routing cache and compiled validation schemas.</p>
              </div>
              <button onClick={async () => { const res = await clearApplicationCache(); toast.success(res.message); }} className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"><i className="fas fa-sync-alt"></i> Flush System Cache</button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h3 className="text-base font-black text-gray-800 pb-3 border-b border-gray-50">System Health Metrics</h3>
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-gray-700 mb-1"><span>Server CPU Load</span><span>{health.cpuLoad}%</span></div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full rounded-full" style={{ width: `${health.cpuLoad}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between font-bold text-gray-700 mb-1"><span>Memory Allocation (RAM)</span><span>{health.ramUsed} GB / {health.ramTotal} GB</span></div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden"><div className="bg-blue-500 h-full rounded-full" style={{ width: `${(health.ramUsed/health.ramTotal)*100}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between font-bold text-gray-700 mb-1"><span>Database Storage Capacity</span><span>{health.dbUsed} GB / {health.dbTotal} GB</span></div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(health.dbUsed/health.dbTotal)*100}%` }}></div></div>
            </div>
            <div className="pt-4 border-t border-gray-50 flex justify-between items-center font-bold text-gray-500">
              <span>System Uptime:</span><span className="text-emerald-600 font-black">{health.uptime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

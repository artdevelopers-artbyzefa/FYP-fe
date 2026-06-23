import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSystemHealth, triggerDatabaseBackup, clearApplicationCache } from '../../services/admin.service';
import { showToast as toast } from '../../components/AppToast';
import { Broom, CloudDownload, Database, RefreshCw } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function AdminMaintenance() {
  const [health, setHealth] = useState({});

  useEffect(() => {
    getSystemHealth().then(setHealth);
  }, []);

  return (
    <div className="animate-in fade-in slide-in- duration-300">
      <div className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-black text-slate-900">System Maintenance & Backup Console</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Trigger automated database backups, view system health metrics, and clear application cache</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-line shadow-card p-6 space-y-6">
          <h3 className="text-base font-black text-slate-900 pb-3 border-b border-line">Database & Cache Maintenance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-line flex flex-col justify-between space-y-4">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white text-slate-900 flex items-center justify-center font-bold text-xl mb-3"><Database className="w-4 h-4" /></div>
                <h4 className="font-black text-slate-900 text-sm mb-1">Database Backup Snapshot</h4>
                <p className="text-xs text-slate-900 leading-relaxed">Create an immediate, fully encrypted snapshot of the entire FYP database.</p>
              </div>
              <button onClick={async () => { const res = await triggerDatabaseBackup(); toast.success(res.message); }} className="w-full py-2.5 bg-white hover:bg-white text-white rounded-xl text-xs font-bold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none flex items-center justify-center gap-2"><CloudDownload className="w-4 h-4" /> Trigger Snapshot Backup</button>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-line flex flex-col justify-between space-y-4">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white text-slate-900 flex items-center justify-center font-bold text-xl mb-3"><Broom className="w-4 h-4" /></div>
                <h4 className="font-black text-slate-900 text-sm mb-1">Clear Application Cache</h4>
                <p className="text-xs text-slate-900 leading-relaxed">Flush system routing cache and compiled validation schemas.</p>
              </div>
              <button onClick={async () => { const res = await clearApplicationCache(); toast.success(res.message); }} className="w-full py-2.5 bg-white hover:bg-white text-white rounded-xl text-xs font-bold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /> Flush System Cache</button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-line shadow-card p-6 space-y-6">
          <h3 className="text-base font-black text-slate-900 pb-3 border-b border-line">System Health Metrics</h3>
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-900 mb-1"><span>Server CPU Load</span><span>{health.cpuLoad}%</span></div>
              <div className="w-full bg-white h-2.5 rounded-full overflow-hidden"><div className="bg-white h-full rounded-full" style={{ width: `${health.cpuLoad}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between font-bold text-slate-900 mb-1"><span>Memory Allocation (RAM)</span><span>{health.ramUsed} GB / {health.ramTotal} GB</span></div>
              <div className="w-full bg-white h-2.5 rounded-full overflow-hidden"><div className="bg-blue-600 h-full rounded-full" style={{ width: `${(health.ramUsed/health.ramTotal)*100}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between font-bold text-slate-900 mb-1"><span>Database Storage Capacity</span><span>{health.dbUsed} GB / {health.dbTotal} GB</span></div>
              <div className="w-full bg-white h-2.5 rounded-full overflow-hidden"><div className="bg-white h-full rounded-full" style={{ width: `${(health.dbUsed/health.dbTotal)*100}%` }}></div></div>
            </div>
            <div className="pt-4 border-t border-line flex justify-between items-center font-bold text-slate-900">
              <span>System Uptime:</span><span className="text-slate-900 font-black">{health.uptime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

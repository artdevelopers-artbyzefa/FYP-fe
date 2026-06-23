import React, { useState, useEffect } from 'react';
import { submitIdea } from '../../services/student.service';
import { showToast as toast } from '../../components/AppToast';
import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
export default function NewIdea() {
  const [formData, setFormData] = useState({ title: '', desc: '', tech: '' });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitIdea(formData);
      toast.success(res.message);
      setFormData({ title: '', desc: '', tech: '' });
    } catch {
      toast.error('Failed to submit idea.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setPageLoading(false); }, []);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="animate-in fade-in slide-in- duration-300">
      {pageLoading ? (
        <div className="space-y-6 animate-pulse bg-white border border-line rounded-2xl p-6 shadow-card max-w-3xl mx-auto">
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-10 w-full rounded-xl" />
          <div className="skeleton h-32 w-full rounded-xl" />
          <div className="skeleton h-10 w-32 rounded-xl" />
        </div>
      ) : (
        <motion.div variants={item} className="bg-white border border-line rounded-2xl p-6 shadow-card max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Submit Project Idea</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1.5">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20" required/>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1.5">Problem Statement</label>
            <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-600/20" required></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1.5">Technology Stack</label>
            <input type="text" value={formData.tech} onChange={e => setFormData({...formData, tech: e.target.value})} placeholder="e.g. React, Node.js" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20" required/>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1.5">Proposal (PDF)</label>
            <input type="file" accept="application/pdf" className="w-full bg-white border border-line rounded-xl px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white file:text-slate-900 hover:file:bg-white"/>
          </div>
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-colors mt-2 focus-visible:ring-2 focus-visible:ring-blue-500">
            {loading ? <Loader className="w-4 h-4 animate-spin mr-1.5" /> : ''} {loading ? 'Submitting...' : 'Submit Idea'}
          </button>
        </form>
      </motion.div>
      )}
    </motion.div>
  );
}

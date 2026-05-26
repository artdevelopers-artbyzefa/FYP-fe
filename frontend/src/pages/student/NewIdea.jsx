import React, { useState } from 'react';
import { submitIdea } from '../../services/student.service';
import { showToast as toast } from '../../components/AppToast';
import { Loader } from 'lucide-react';

export default function NewIdea() {
  const [formData, setFormData] = useState({ title: '', desc: '', tech: '' });
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="animate-in fade-in slide-in- duration-300">
      <div className="bg-white border border-black rounded-2xl p-6 shadow-sm max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-black mb-6">Submit Project Idea</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-black mb-1.5">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white border border-black rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20" required/>
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1.5">Problem Statement</label>
            <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-white border border-black rounded-xl px-4 py-2.5 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-600/20" required></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1.5">Technology Stack</label>
            <input type="text" value={formData.tech} onChange={e => setFormData({...formData, tech: e.target.value})} placeholder="e.g. React, Node.js" className="w-full bg-white border border-black rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20" required/>
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1.5">Proposal (PDF)</label>
            <input type="file" accept="application/pdf" className="w-full bg-white border border-black rounded-xl px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-white"/>
          </div>
          <button disabled={loading} className="w-full bg-black hover:bg-black text-white py-3 rounded-xl font-bold transition-colors mt-2">
            {loading ? <Loader className="w-4 h-4 fa-spin mr-1.5" /> : ''} {loading ? 'Submitting...' : 'Submit Idea'}
          </button>
        </form>
      </div>
    </div>
  );
}

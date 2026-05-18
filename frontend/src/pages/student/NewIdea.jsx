import React, { useState } from 'react';
import { submitIdea } from '../../services/student.service';
import { showToast as toast } from '../../components/AppToast';

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
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Submit Project Idea</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20" required/>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Problem Statement</label>
            <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-600/20" required></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Technology Stack</label>
            <input type="text" value={formData.tech} onChange={e => setFormData({...formData, tech: e.target.value})} placeholder="e.g. React, Node.js" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20" required/>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Proposal (PDF)</label>
            <input type="file" accept="application/pdf" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"/>
          </div>
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors mt-2">
            {loading ? <i className="fas fa-spinner fa-spin mr-1.5"></i> : ''} {loading ? 'Submitting...' : 'Submit Idea'}
          </button>
        </form>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { getFacultyProfile } from '../../services/faculty.service';
import { showToast } from '../../components/AppToast';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const FacultyProfile = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacultyProfile().then(res => setTags(res.data.tags)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    setTags([...tags, newTag.trim()]);
    setNewTag('');
    showToast.success('Research tag added to matching engine!');
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
    showToast.warning('Research tag removed.');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4 mb-6">
          <div className="skeleton h-7 w-56 rounded-md" />
          <div className="skeleton h-4 w-[500px] rounded-md mt-2" />
        </div>
        <div className="bg-white rounded-2xl border border-line shadow-card p-6 max-w-2xl">
          <div className="mb-6">
            <div className="skeleton h-5 w-36 rounded-md mb-2" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="skeleton h-8 w-24 rounded-xl" />
              ))}
            </div>
          </div>
          <div>
            <div className="skeleton h-5 w-24 rounded-md mb-2" />
            <div className="flex gap-2">
              <div className="skeleton h-10 flex-1 rounded-xl" />
              <div className="skeleton h-10 w-20 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <div className="border-b border-line pb-4 mb-6">
          <h2 className="text-xl font-bold text-slate-900">Faculty Research Tags</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Manage your research interests. This data feeds into the AI Committee Matcher for optimal evaluation board placement.</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card p-6 max-w-2xl">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-900 mb-2">Current Active Tags</label>
          <div className="flex flex-wrap gap-2" id="tagContainer">
            {tags.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium">No research tags added yet. Add tags below to help with committee matching.</p>
            ) : (
              tags.map((tag, index) => (
                <span key={index} className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm">
                  {tag} <X className="w-3.5 h-3.5 cursor-pointer hover:text-white/70 transition-colors" onClick={() => handleRemoveTag(index)} />
                </span>
              ))
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Add New Tag</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newTag} 
              onChange={(e) => setNewTag(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="e.g. Distributed Systems" 
              className="flex-1 bg-white border border-line rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all" 
            />
            <button onClick={handleAddTag} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">Add Tag</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FacultyProfile;

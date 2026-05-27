import React, { useEffect, useState } from 'react';
import { getFacultyProfile } from '../../services/faculty.service';
import { showToast } from '../../components/AppToast';

const FacultyProfile = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    getFacultyProfile().then(res => setTags(res.data.tags)).catch(console.error);
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

  return (
    <>
      <div className="border-b border-black pb-4 mb-6">
        <h2 className="text-xl font-black text-black">Faculty Research Tags</h2>
        <p className="text-xs text-black mt-0.5 font-medium">Manage your research interests. This data feeds into the AI Committee Matcher for optimal evaluation board placement.</p>
      </div>

      <div className="bg-white rounded-2xl border border-black shadow-sm p-6 max-w-2xl">
        <div className="mb-6">
          <label className="block text-sm font-bold text-black mb-2">Current Active Tags</label>
          <div className="flex flex-wrap gap-2" id="tagContainer">
            {tags.map((tag, index) => (
              <span key={index} className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
                {tag} <i className="fas fa-times cursor-pointer hover:text-blue-600" onClick={() => handleRemoveTag(index)}></i>
              </span>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-black mb-2">Add New Tag</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newTag} 
              onChange={(e) => setNewTag(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="e.g. Distributed Systems" 
              className="flex-1 bg-white border border-black rounded-xl px-4 py-2 text-sm outline-none focus:border-black focus:bg-white transition-all" 
            />
            <button onClick={handleAddTag} className="bg-white hover:bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">Add Tag</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacultyProfile;

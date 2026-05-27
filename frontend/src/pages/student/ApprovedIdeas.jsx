import React, { useState, useEffect } from 'react';
import { getApprovedIdeas, selectApprovedIdea } from '../../services/student.service';
import { showToast as toast } from '../../components/AppToast';
import { Loader, Tag, User } from 'lucide-react';

export default function ApprovedIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState({});

  useEffect(() => {
    getApprovedIdeas().then(data => {
      setIdeas(data);
      setLoading(false);
    });
  }, []);

  const handleSelect = async (id) => {
    setSelecting({...selecting, [id]: true});
    try {
      const res = await selectApprovedIdea(id);
      toast.success(res.message);
    } catch {
      toast.error('Failed to select idea.');
    } finally {
      setSelecting({...selecting, [id]: false});
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader className="animate-spin text-black text-2xl" /></div>;

  return (
    <div className="animate-in fade-in slide-in- duration-300">
      <h2 className="text-xl font-bold text-black mb-6">University Approved Ideas</h2>
      
      <div className="grid grid-cols-1 gap-5 max-w-3xl">
        {ideas.map(idea => (
          <div key={idea.id} className="bg-white border border-black rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-black text-black mb-2">{idea.title}</h3>
            <p className="text-sm text-black mb-4 leading-relaxed">{idea.desc}</p>
            <div className="flex gap-4 text-xs font-bold text-black mb-6">
              <span><Tag className="w-4 h-4 mr-1.5" /> {idea.tags.join(', ')}</span>
              <span><User className="w-4 h-4 mr-1.5" /> {idea.supervisor}</span>
            </div>
            <button 
              onClick={() => handleSelect(idea.id)}
              disabled={selecting[idea.id]}
              className="border-2 border-black text-black hover:border-blue-600 hover:text-blue-600 px-5 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
            >
              {selecting[idea.id] ? 'Selecting...' : 'Select Idea'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

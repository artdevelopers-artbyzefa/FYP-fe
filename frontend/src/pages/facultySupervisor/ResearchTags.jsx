import React, { useState } from 'react';
import { X, Plus, Info } from 'lucide-react';
import api from '../../services/api';
import { API_URLS } from '../../services/apiUrls';

const initialTags = [
  { id: 1, label: 'AI & Computer Vision' },
  { id: 2, label: 'Deep Learning' },
  { id: 3, label: 'Autonomous Systems' },
];

export default function ResearchTags() {
  const [tags, setTags] = useState(initialTags);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    if (tags.some(t => t.label.toLowerCase() === trimmed.toLowerCase())) return;
    setTags(prev => [...prev, { id: Date.now(), label: trimmed }]);
    setNewTag('');
  };

  const handleRemoveTag = (id) => {
    setTags(prev => prev.filter(t => t.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-6">

      {/* Page Heading - outside card */}
      <div className="space-y-1.5">
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
          Research Domain Profile & Tag Management
        </h1>
        <p className="text-sm text-gray-500">
          Configure research alignment tags. These tags power the global supervisor assignment matching engine.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm max-w-2xl">

        {/* Manage Research Tags */}
        <div className="px-6 pt-6 pb-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Manage Research Tags
          </h2>

          {/* Active Research Domain Tags label */}
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Active Research Domain Tags
          </p>

          {/* Tags container */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-wrap gap-2.5 mb-5">
            {tags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1.5 bg-gray-800 text-white text-sm font-medium px-3.5 py-1.5 rounded-full"
              >
                {tag.label}
                <button
                  onClick={() => handleRemoveTag(tag.id)}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
                  title={`Remove "${tag.label}"`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {tags.length === 0 && (
              <span className="text-sm text-gray-400 italic">
                No research tags configured yet. Add your first tag below.
              </span>
            )}
          </div>

          {/* Add Tag Input Row */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add new research tag (e.g. NLP, Robotics)..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full text-sm text-gray-800 bg-white outline-none transition-all focus:border-[#2563eb] focus:ring-2 focus:ring-blue-500/10 placeholder:text-gray-400"
            />
            <button
              onClick={handleAddTag}
              disabled={!newTag.trim()}
              className="px-5 py-2.5 bg-[#2563eb] text-white text-sm font-bold rounded-full hover:bg-[#1d4ed8] active:scale-[0.97] transition-all duration-150 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              Add Tag
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="px-6 pb-6 pt-2">
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl px-5 py-4 flex items-start gap-3">
            <div className="w-6 h-6 bg-[#2563eb] rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-gray-900">
                Global Matching Engine Active
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                When students submit project proposals, the FYP Office matching algorithm automatically evaluates your active research tags to recommend supervision pairings.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

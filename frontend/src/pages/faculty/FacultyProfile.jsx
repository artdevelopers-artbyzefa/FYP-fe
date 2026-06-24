import React, { useEffect, useState } from 'react';
import { getFacultyProfile, saveFacultyPreferences } from '../../services/faculty.service';
import { showToast } from '../../components/AppToast';
import { Loader2, CheckCircle, Sparkles } from 'lucide-react';

const FIELDS = [
  'Web Development',
  'Game Development',
  'Software Requirement Engineering',
  'Mobile App Development',
  'Machine Learning / AI',
  'Database Systems',
  'Cybersecurity',
  'Cloud Computing'
];

const PRIORITY_CONFIG = {
  1: { label: '1st Choice', weight: '50%', color: 'bg-emerald-500', border: 'border-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-400' },
  2: { label: '2nd Choice', weight: '30%', color: 'bg-blue-500', border: 'border-blue-400', bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-400' },
  3: { label: '3rd Choice', weight: '20%', color: 'bg-amber-500', border: 'border-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-400' },
};

const FacultyProfile = () => {
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getFacultyProfile()
      .then(res => {
        const prefs = res.data?.preferences || [];
        setPreferences(prefs.map(p => ({ field: p.field, priority: p.priority })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getPriority = (field) => {
    const p = preferences.find(p => p.field === field);
    return p ? p.priority : null;
  };

  const handleSelect = (field) => {
    const current = getPriority(field);
    if (current) {
      setPreferences(preferences.filter(p => p.field !== field));
      return;
    }
    if (preferences.length >= 3) {
      showToast.error('You can select up to 3 preferences. Remove one first.');
      return;
    }
    const nextPriority = preferences.length + 1;
    setPreferences([...preferences, { field, priority: nextPriority }]);
  };

  const handleSave = async () => {
    if (preferences.length === 0) {
      showToast.error('Select at least one preference.');
      return;
    }
    setSaving(true);
    try {
      await saveFacultyPreferences(preferences);
      showToast.success('Preferences saved successfully.');
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-line pb-4">
        <h2 className="text-xl font-bold text-slate-900">Committee Suggestion</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Select up to 3 fields ranked by preference. These determine your committee placement weighting for evaluations.</p>
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Your Preferences</h3>
            <p className="text-[10px] text-slate-400">Click a field to set it as your 1st, 2nd, or 3rd choice. Click again to remove.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6 text-xs">
          {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${cfg.color}`} />
              <span className="font-medium text-slate-600">{cfg.label} — {cfg.weight}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {FIELDS.map(field => {
            const priority = getPriority(field);
            const cfg = priority ? PRIORITY_CONFIG[priority] : null;
            return (
              <div
                key={field}
                onClick={() => handleSelect(field)}
                className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  cfg
                    ? `${cfg.bg} ${cfg.border} ${cfg.ring} ring-1`
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className={`text-sm font-bold ${cfg ? cfg.text : 'text-slate-900'}`}>{field}</div>
                    {cfg && (
                      <div className={`text-[10px] font-bold mt-1 ${cfg.text}`}>
                        {cfg.label} · Evaluation weight: {cfg.weight}
                      </div>
                    )}
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    cfg ? `${cfg.color} text-white` : 'bg-gray-100 text-gray-400'
                  }`}>
                    {cfg ? <CheckCircle size={14} /> : <span className="text-xs font-bold">{preferences.length + 1 <= 3 ? '+' : ''}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-line">
          <div className="text-xs text-slate-400 font-medium">
            {preferences.length === 0
              ? 'No preferences selected'
              : `${preferences.length}/3 preferences selected`}
          </div>
          <button
            onClick={handleSave}
            disabled={saving || preferences.length === 0}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 transition-all cursor-pointer border-0 disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;

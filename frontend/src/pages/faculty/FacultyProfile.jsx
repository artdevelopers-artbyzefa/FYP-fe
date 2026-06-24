import React, { useEffect, useState } from 'react';
import { getFacultyProfile, saveFacultyPreferences } from '../../services/faculty.service';
import { showToast } from '../../components/AppToast';
import { Loader2, CheckCircle, Sparkles, Pencil, X } from 'lucide-react';

const FIELDS = [
  'Web Development',
  'Game Development',

  'Mobile App Development',
  'Machine Learning / AI',
  'Database Systems',
  'Cybersecurity',
  'Deployment'
];

const PRIORITY_LABELS = { 1: '1st Choice', 2: '2nd Choice', 3: '3rd Choice' };
const PRIORITY_WEIGHTS = { 1: '50%', 2: '30%', 3: '20%' };
const PRIORITY_CLASSES = {
  1: { card: 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400', text: 'text-emerald-700', badge: 'bg-emerald-500 text-white', dot: 'bg-emerald-500' },
  2: { card: 'bg-blue-50 border-blue-400 ring-1 ring-blue-400', text: 'text-blue-700', badge: 'bg-blue-500 text-white', dot: 'bg-blue-500' },
  3: { card: 'bg-amber-50 border-amber-400 ring-1 ring-amber-400', text: 'text-amber-700', badge: 'bg-amber-500 text-white', dot: 'bg-amber-500' },
};

const FacultyProfile = () => {
  const [preferences, setPreferences] = useState([]);
  const [savedPrefs, setSavedPrefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getFacultyProfile()
      .then(res => {
        const prefs = (res.data?.preferences || []).map(p => ({ field: p.field, priority: p.priority }));
        setPreferences(prefs);
        setSavedPrefs(prefs);
        setEditing(prefs.length === 0);
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
      setSavedPrefs(preferences);
      setEditing(false);
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setPreferences(savedPrefs);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="page-header">
        <h2 className="page-title">Committee Suggestion</h2>
        <p className="page-desc">Select up to 3 fields ranked by preference. These determine your committee placement weighting for evaluations.</p>
      </div>

      <div className="card p-6 md:p-8">
        <div className="flex-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex-center text-blue-600">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Your Preferences</h3>
              <p className="text-[10px] text-slate-400">{editing ? 'Click a field to set 1st, 2nd, or 3rd choice. Click again to remove.' : 'Your ranked preferences for committee placement.'}</p>
            </div>
          </div>
          {!editing && savedPrefs.length > 0 && (
            <button onClick={() => { setPreferences(savedPrefs); setEditing(true); }} className="btn-edit">
              <Pencil className="w-3 h-3" /> Edit
            </button>
          )}
        </div>

        {!editing && savedPrefs.length > 0 ? (
          <div className="space-y-3">
            {savedPrefs.sort((a, b) => a.priority - b.priority).map(p => {
              const cls = PRIORITY_CLASSES[p.priority];
              return (
                <div key={p.field} className={`p-4 rounded-2xl border-2 ${cls.card}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className={`text-sm font-bold ${cls.text}`}>{p.field}</div>
                      <div className={`text-[10px] font-bold mt-1 ${cls.text}`}>{PRIORITY_LABELS[p.priority]} · Evaluation weight: {PRIORITY_WEIGHTS[p.priority]}</div>
                    </div>
                    <div className={`w-7 h-7 rounded-full flex-center flex-shrink-0 ${cls.badge}`}>
                      <CheckCircle size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : editing ? (
          <>
            <div className="flex items-center gap-4 mb-6 text-xs">
              {[1, 2, 3].map(p => (
                <div key={p} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${PRIORITY_CLASSES[p].dot}`} />
                  <span className="font-medium text-slate-600">{PRIORITY_LABELS[p]} — {PRIORITY_WEIGHTS[p]}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {FIELDS.map(field => {
                const priority = getPriority(field);
                const cls = priority ? PRIORITY_CLASSES[priority] : null;
                return (
                  <div
                    key={field}
                    onClick={() => handleSelect(field)}
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      cls ? cls.card : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className={`text-sm font-bold ${cls ? cls.text : 'text-slate-900'}`}>{field}</div>
                        {cls && (
                          <div className={`text-[10px] font-bold mt-1 ${cls.text}`}>
                            {PRIORITY_LABELS[priority]} · Evaluation weight: {PRIORITY_WEIGHTS[priority]}
                          </div>
                        )}
                      </div>
                      <div className={`w-7 h-7 rounded-full flex-center flex-shrink-0 ${
                        cls ? cls.badge : 'bg-gray-100 text-gray-400'
                      }`}>
                        {cls ? <CheckCircle size={14} /> : <span className="text-xs font-bold">+</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex-between pt-5 border-t border-line">
              <div className="text-xs text-slate-400 font-medium">
                {preferences.length === 0 ? 'No preferences selected' : `${preferences.length}/3 selected`}
              </div>
              <div className="flex gap-2">
                <button onClick={handleCancel} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-gray-50 transition-colors cursor-pointer border-0 flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button onClick={handleSave} disabled={saving || preferences.length === 0} className="btn-primary disabled:opacity-50 flex items-center gap-2">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {saving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          </>
        ) : null}

        {!editing && savedPrefs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-slate-400 font-medium mb-4">No preferences set yet.</p>
            <button onClick={() => setEditing(true)} className="btn-primary">Set Preferences</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyProfile;

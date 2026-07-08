import { useState, useCallback } from 'react';
import { Info, ChevronDown, ChevronRight, Pencil } from 'lucide-react';

const TierRadio = ({ tier, name, checked, onChange }) => {
  const isSelected = checked === tier.label;
  return (
    <label
      className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all text-left ${
        isSelected
          ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-200'
          : 'border-slate-200 hover:border-slate-300 bg-white'
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={isSelected}
        onChange={() => onChange(tier)}
        className="mt-0.5 accent-blue-600 cursor-pointer shrink-0"
      />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
            tier.label === 'Excellent' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            tier.label === 'Good' ? 'bg-blue-50 text-blue-700 border-blue-200' :
            tier.label === 'Adequate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
            'bg-red-50 text-red-700 border-red-200'
          }`}>{tier.label}</span>
          <span className="text-[10px] font-semibold text-slate-500">{tier.minScore} – {tier.maxScore}</span>
        </div>
        <p className="text-[9px] text-slate-500 mt-0.5 leading-relaxed">{tier.description}</p>
      </div>
    </label>
  );
};

const SubCriterionRow = ({ sub, values, onTierChange, onScoreChange }) => {
  const v = values[sub.id] || { score: 0, tier: null };
  const selected = v.tier;
  const score = v.score;
  const selectedTier = selected ? sub.tiers.find(t => t.label === selected) : null;
  const tierMin = selectedTier?.minScore ?? 0;
  const tierMax = selectedTier?.maxScore ?? sub.maxScore;

  const handleScoreInput = (e) => {
    const raw = e.target.value;
    if (raw === '' || raw === '-') {
      onScoreChange(sub.id, 0);
      return;
    }
    const val = parseFloat(raw);
    if (!isNaN(val)) {
      const clamped = Math.min(Math.max(val, tierMin), tierMax);
      onScoreChange(sub.id, parseFloat(clamped.toFixed(1)));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-900">{sub.label}</span>
          {sub.description && (
            <span className="text-[9px] text-slate-400 ml-1.5 font-normal">({sub.description})</span>
          )}
        </div>
        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
          Max {sub.maxScore}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {sub.tiers.map(tier => (
          <TierRadio
            key={tier.label}
            tier={tier}
            name={`${sub.id}_tier`}
            checked={selected}
            onChange={(t) => onTierChange(sub.id, t)}
          />
        ))}
      </div>
      {selected && selectedTier && (
        <div className="flex items-center justify-end gap-2">
          <Pencil size={11} className="text-slate-400" />
          <input
            type="number"
            min={tierMin}
            max={tierMax}
            step="0.1"
            value={score}
            onChange={handleScoreInput}
            className="w-20 text-center bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
          />
          <span className="text-[10px] text-slate-400 font-medium">
            / {tierMin}–{tierMax}
          </span>
        </div>
      )}
    </div>
  );
};

const CriterionSection = ({ criterion, values, onTierChange, onScoreChange, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen ?? true);

  const total = criterion.subCriteria.reduce((sum, sub) => {
    return sum + (values[sub.id]?.score ?? 0);
  }, 0);

  return (
    <div className="border border-line rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50/80 hover:bg-slate-100 transition-colors cursor-pointer border-0 text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded shrink-0">{criterion.clo}</span>
          <span className="text-xs font-bold text-slate-900 truncate">{criterion.label}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold text-slate-500">
            {total.toFixed(1)} / {criterion.maxScore}
          </span>
          {open ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
        </div>
      </button>
      {open && (
        <div className="px-4 py-3 space-y-4 border-t border-line">
          {criterion.subCriteria.map(sub => (
            <SubCriterionRow
              key={sub.id}
              sub={sub}
              values={values}
              onTierChange={onTierChange}
              onScoreChange={onScoreChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const RubricEvaluationForm = ({ rubric, values, onChange, marks, onMarksChange, remarks, onRemarksChange, errors, readOnly }) => {
  const handleTierChange = useCallback((subId, tier) => {
    const midpoint = parseFloat(((tier.minScore + tier.maxScore) / 2).toFixed(1));
    const score = Math.min(midpoint, tier.maxScore);
    const newValues = { ...values, [subId]: { score, tier: tier.label } };
    onChange(newValues);
    const total = calcTotal(newValues, rubric);
    onMarksChange(total);
  }, [values, onChange, onMarksChange, rubric]);

  const handleScoreChange = useCallback((subId, newScore) => {
    const current = values[subId];
    if (!current || !current.tier) return;
    const newValues = { ...values, [subId]: { ...current, score: newScore } };
    onChange(newValues);
    const total = calcTotal(newValues, rubric);
    onMarksChange(total);
  }, [values, onChange, onMarksChange, rubric]);

  if (!rubric) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 rounded-xl border border-blue-100">
        <Info size={13} className="text-blue-600 shrink-0" />
        <span className="text-[10px] text-blue-700 font-medium">
          Select a tier, then adjust the exact score using the editable field. Scores are clamped to the criterion max.
        </span>
      </div>

      {rubric.criteria.map(criterion => (
        <CriterionSection
          key={criterion.id}
          criterion={criterion}
          values={values}
          onTierChange={handleTierChange}
          onScoreChange={handleScoreChange}
        />
      ))}

      <div className="bg-white rounded-xl border border-line p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900">Total Score</span>
          <span className="text-sm font-extrabold text-blue-700">
            {marks || 0} / {rubric.totalMarks}
          </span>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-700 mb-1">
            Overall Remarks <span className="text-red-500">*</span>
          </label>
          <textarea
            value={remarks}
            onChange={e => onRemarksChange(e.target.value)}
            placeholder="Provide overall feedback on the group's performance..."
            rows={2}
            readOnly={readOnly}
            className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs outline-none transition-all focus:ring-1 resize-none ${
              errors.remarks ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-line focus:border-blue-400 focus:ring-blue-400'
            } ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
          {errors.remarks && <p className="text-[9px] text-red-500 font-medium mt-1">{errors.remarks}</p>}
        </div>
      </div>
    </div>
  );
};

export const calcTotal = (values, rubric) => {
  if (!rubric || !values) return 0;
  let total = 0;
  for (const criterion of rubric.criteria) {
    for (const sub of criterion.subCriteria) {
      total += values[sub.id]?.score ?? 0;
    }
  }
  return parseFloat(total.toFixed(1));
};

export const buildInitialValues = (rubric, existingScores) => {
  if (!rubric) return {};
  const initial = {};
  for (const criterion of rubric.criteria) {
    for (const sub of criterion.subCriteria) {
      const existing = existingScores?.find(s => s.criterionId === sub.id);
      if (existing) {
        initial[sub.id] = { score: existing.score, tier: existing.tier };
      } else {
        initial[sub.id] = { score: 0, tier: null };
      }
    }
  }
  return initial;
};

export const buildCriteriaScoresPayload = (values, rubric) => {
  if (!rubric || !values) return [];
  const payload = [];
  for (const criterion of rubric.criteria) {
    for (const sub of criterion.subCriteria) {
      const v = values[sub.id];
      payload.push({
        criterionId: sub.id,
        label: sub.label,
        score: v?.score ?? 0,
        maxScore: sub.maxScore,
        tier: v?.tier ?? '',
        remarks: ''
      });
    }
  }
  return payload;
};

export default RubricEvaluationForm;

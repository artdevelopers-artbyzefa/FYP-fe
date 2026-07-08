import React, { useEffect, useState, useCallback } from 'react';
import { getInchargeRubrics, saveRubric, updateRubric, deleteRubric } from '../../services/office-incharge.service';
import { showToast } from '../../components/AppToast';
import { Plus, Trash2, Loader2, CheckCircle, XCircle, AlertTriangle, BookOpen, FileText, ChevronDown, ChevronUp, Pencil, Download, Sparkles } from 'lucide-react';
import {
  generateStandardPdf, generateDetailedPdf, generateAcademicPdf,
  generateMinimalPdf, generateScoringPdf, generateComprehensivePdf
} from '../../components/office-incharge/RubricPdfTemplates';
import RubricPreview from '../../components/office-incharge/RubricPreview';
import DownloadModal from '../../components/office-incharge/DownloadModal';

const EMPTY = () => ({ id: crypto.randomUUID(), name: '', clo: '', weight: '' });

const TX = {
  surface: '#f1f5f9', white: '#ffffff', primary: '#1e3a8a', accent: '#3b82f6',
  success: '#059669', warning: '#d97706', danger: '#dc2626',
  ink: '#0f172a', muted: '#64748b', line: '#e2e8f0',
};

function Badge({ status }) {
  const m = {
    active: { bg: '#ecfdf5', text: '#065f46', label: 'Active' },
    locked: { bg: '#fef3c7', text: '#92400e', label: 'Locked' },
    archived: { bg: '#f1f5f9', text: '#475569', label: 'Archived' },
    draft: { bg: '#eff6ff', text: '#1e40af', label: 'Draft' },
  };
  const s = m[status] || m.draft;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap" style={{ backgroundColor: s.bg, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.text }} />
      {s.label}
    </span>
  );
}

function CriterionRow({ criterion, onChange, onRemove, canRemove }) {
  const h = (f, v) => onChange(criterion.id, f, v);
  const inputClass = "w-full border rounded-lg px-3 py-2.5 text-sm font-medium outline-none transition-all";
  return (
    <div className="grid grid-cols-[1fr_1fr_90px_36px] gap-3 items-end p-3.5 rounded-xl border" style={{ borderColor: TX.line, backgroundColor: TX.white }}>
      <div>
        <label className="block text-xs font-bold mb-1" style={{ color: TX.muted }}>Criterion</label>
        <input type="text" value={criterion.name} onChange={(e) => h('name', e.target.value)} className={inputClass} style={{ borderColor: TX.line, color: TX.ink }} onFocus={(e) => e.target.style.borderColor = TX.accent} onBlur={(e) => e.target.style.borderColor = TX.line} placeholder="e.g. Problem Statement" required />
      </div>
      <div>
        <label className="block text-xs font-bold mb-1" style={{ color: TX.muted }}>CLO</label>
        <input type="text" value={criterion.clo} onChange={(e) => h('clo', e.target.value)} className={inputClass} style={{ borderColor: TX.line, color: TX.ink }} onFocus={(e) => e.target.style.borderColor = TX.accent} onBlur={(e) => e.target.style.borderColor = TX.line} placeholder="e.g. CLO-1" required />
      </div>
      <div>
        <label className="block text-xs font-bold mb-1" style={{ color: TX.muted }}>Wt.%</label>
        <input type="number" value={criterion.weight} onChange={(e) => h('weight', e.target.value)} className={`${inputClass} text-center`} style={{ borderColor: TX.line, color: TX.ink }} onFocus={(e) => e.target.style.borderColor = TX.accent} onBlur={(e) => e.target.style.borderColor = TX.line} min="1" max="100" required />
      </div>
      <button type="button" onClick={() => onRemove(criterion.id)} disabled={!canRemove} className="h-9 flex items-center justify-center rounded-lg border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed px-2" style={{ borderColor: TX.line, color: TX.danger }} title="Remove"><Trash2 size={13} /></button>
    </div>
  );
}

export default function InchargeRubrics() {
  const [rubricName, setRubricName] = useState('');
  const [criteria, setCriteria] = useState([EMPTY()]);
  const [rubricsData, setRubricsData] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => { fetchRubrics(); }, []);

  const fetchRubrics = async () => {
    setLoading(true); setError(null);
    try {
      const res = await getInchargeRubrics();
      setRubricsData(res);
    } catch {
      setError('Failed to load rubric history');
    } finally { setLoading(false); }
  };

  const rubrics = rubricsData?.data || [];
  const totalW = criteria.reduce((s, c) => s + (Number(c.weight) || 0), 0);
  const isValid = totalW === 100;
  const hasEmpty = criteria.some(c => !c.name.trim() || !c.clo.trim() || !c.weight);

  const nextVer = useCallback(() => {
    if (!rubrics.length) return 'v1.0';
    const nums = rubrics.map(r => { const m = r.version?.match(/v(\d+)/); return m ? parseInt(m[1], 10) : 0; });
    return `v${Math.max(...nums) + 1}.0`;
  }, [rubrics]);

  const addC = () => setCriteria([...criteria, EMPTY()]);
  const updC = (id, f, v) => setCriteria(criteria.map(c => c.id === id ? { ...c, [f]: v } : c));
  const remC = (id) => { if (criteria.length > 1) setCriteria(criteria.filter(c => c.id !== id)); };

  const loadRubric = (r) => {
    setRubricName(r.name);
    setCriteria(r.criteria.map(c => ({ ...c, id: crypto.randomUUID(), weight: c.weight?.toString() || '' })));
    setEditingId(r.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const TEMPLATE_MAP = {
    standard: { label: 'Standard', gen: generateStandardPdf },
    detailed: { label: 'Detailed', gen: generateDetailedPdf },
    academic: { label: 'Academic', gen: generateAcademicPdf },
    minimal: { label: 'Minimal', gen: generateMinimalPdf },
    scoring: { label: 'Scoring Card', gen: generateScoringPdf },
    comprehensive: { label: 'Comprehensive', gen: generateComprehensivePdf },
  };

  const buildRubric = () => ({
    name: rubricName || 'Evaluation Rubric',
    criteria: criteria.filter(c => c.name.trim()).map(({ id, ...rest }) => ({ ...rest, weight: Number(rest.weight), maxScore: 100 })),
  });

  const handleDownload = () => {
    const r = buildRubric();
    if (!r.criteria.length) { showToast.error('Add at least one criterion'); return; }
    const tpl = TEMPLATE_MAP[selectedTemplate];
    try {
      tpl.gen(r);
      setDownloading(true);
      showToast.success(`PDF downloaded (${tpl.label})`);
    } catch (e) {
      showToast.error('PDF generation failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || hasEmpty || submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        name: rubricName.trim(),
        criteria: criteria.map(({ id, ...rest }) => ({ ...rest, weight: Number(rest.weight), maxScore: 100 })),
        status: 'active',
      };
      if (editingId) {
        await updateRubric(editingId, payload);
        showToast.success(`"${rubricName}" updated.`);
      } else {
        await saveRubric({
          ...payload,
          version: nextVer(),
          type: 'custom',
          validation: 'valid',
        });
        showToast.success(`"${rubricName}" published as ${nextVer()}`);
      }
      setRubricName('');
      setCriteria([EMPTY()]);
      setEditingId(null);
      fetchRubrics();
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to save rubric');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteRubric(id);
      showToast.success('Rubric deleted.');
      fetchRubrics();
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to delete.');
    }
  };

  return (
    <div className="animate-fadeSlideUp">
      <DownloadModal isOpen={downloading} onComplete={() => setDownloading(false)} />

      <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: TX.line }}>
        <div>
          <h2 className="text-xl font-bold" style={{ color: TX.ink }}>Rubric Builder</h2>
          <p className="text-sm font-medium mt-0.5" style={{ color: TX.muted }}>View published rubrics, create new ones, and export with different themes.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); if (!showForm) { setRubricName(''); setCriteria([EMPTY()]); setEditingId(null); } }}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 ${showForm ? 'bg-gray-100 text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
          {showForm ? 'Cancel' : 'Create Rubric'}
        </button>
      </div>

      {showForm && (
        <div className="flex flex-col lg:flex-row gap-5 mb-8">
          <div className="w-full lg:w-1/2">
            <form onSubmit={handleSubmit} className="rounded-2xl border shadow-sm overflow-hidden h-full" style={{ borderColor: TX.line, backgroundColor: TX.white }}>
              <div className="p-4 border-b" style={{ borderColor: TX.line, backgroundColor: TX.surface }}>
                <div className="flex items-center gap-2">
                  <FileText size={16} style={{ color: TX.primary }} />
                  <h3 className="text-sm font-bold" style={{ color: TX.ink }}>{editingId ? 'Edit Rubric' : 'New Rubric'}</h3>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: TX.ink }}>Rubric Title</label>
                  <input type="text" value={rubricName} onChange={(e) => setRubricName(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm font-bold outline-none transition-all"
                    style={{ borderColor: TX.line, color: TX.ink }} placeholder="e.g. FYP-1 Evaluation Rubric" required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: TX.ink }}>Criteria</span>
                    <button type="button" onClick={addC} className="flex items-center gap-1 text-xs font-bold transition-all cursor-pointer bg-transparent border-0" style={{ color: TX.accent }}>
                      <Plus size={13} /> Add Criterion
                    </button>
                  </div>
                  <div className="space-y-2">
                    {criteria.map(c => (
                      <CriterionRow key={c.id} criterion={c} onChange={updC} onRemove={remC} canRemove={criteria.length > 1} />
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-xl border flex items-center justify-between" style={{ borderColor: isValid ? '#a7f3d0' : '#fecaca', backgroundColor: isValid ? '#f0fdf4' : '#fef2f2' }}>
                  <div className="flex items-center gap-2">
                    {isValid ? <CheckCircle size={14} style={{ color: TX.success }} /> : <XCircle size={14} style={{ color: TX.danger }} />}
                    <span className="text-xs font-bold" style={{ color: isValid ? TX.success : TX.danger }}>Total: {totalW}%</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: isValid ? '#d1fae5' : '#fee2e2', color: isValid ? '#065f46' : '#991b1b' }}>
                    {isValid ? 'Valid' : `${100 - totalW}% off`}
                  </span>
                </div>
              </div>
              <div className="p-4 border-t flex justify-end" style={{ borderColor: TX.line, backgroundColor: TX.surface }}>
                <button type="submit" disabled={!isValid || hasEmpty || submitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed border-0"
                  style={{ backgroundColor: !isValid || hasEmpty ? '#cbd5e1' : TX.primary, color: '#fff' }}>
                  {submitting ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : editingId ? 'Update Rubric' : 'Publish Rubric'}
                </button>
              </div>
            </form>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: TX.line, backgroundColor: TX.white }}>
              <div className="p-4 border-b" style={{ borderColor: TX.line, backgroundColor: TX.surface }}>
                <div className="flex items-center gap-2">
                  <Sparkles size={16} style={{ color: TX.primary }} />
                  <h3 className="text-sm font-bold" style={{ color: TX.ink }}>Live Preview</h3>
                </div>
                <p className="text-xs font-medium mt-0.5" style={{ color: TX.muted }}>Choose a theme and see how your rubric will look</p>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(TEMPLATE_MAP).map(([k, v]) => (
                    <div key={k} onClick={() => setSelectedTemplate(k)}
                      className={`px-3 py-2 rounded-lg border-2 cursor-pointer transition-all text-center ${
                        selectedTemplate === k ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 bg-white'
                      }`}>
                      <div className="text-xs font-bold whitespace-nowrap" style={{ color: selectedTemplate === k ? TX.primary : TX.ink }}>{v.label}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border overflow-hidden" style={{ borderColor: TX.line, backgroundColor: TX.surface }}>
                  <div className="p-3">
                    <RubricPreview rubric={buildRubric()} selectedTemplate={selectedTemplate} onTemplateChange={setSelectedTemplate} />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button type="button" onClick={handleDownload} disabled={!buildRubric().criteria.length}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed border-0"
                    style={{ backgroundColor: buildRubric().criteria.length ? TX.primary : '#cbd5e1', color: '#fff' }}>
                    <Download size={14} /> Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: TX.line, backgroundColor: TX.white }}>
        <div className="p-4 border-b" style={{ borderColor: TX.line, backgroundColor: TX.surface }}>
          <div className="flex items-center gap-2">
            <BookOpen size={16} style={{ color: TX.primary }} />
            <h3 className="text-sm font-bold" style={{ color: TX.ink }}>Published Rubrics</h3>
          </div>
          <p className="text-xs font-medium mt-0.5" style={{ color: TX.muted }}>{rubrics.length} total — click to expand and view criteria</p>
        </div>
        <div className="p-3 space-y-2">
          {loading ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-3 rounded-xl border animate-pulse" style={{ borderColor: TX.line }}>
              <div className="h-3.5 w-32 rounded-md skeleton mb-1.5" />
              <div className="h-3 w-48 rounded-md skeleton" />
            </div>
          )) : error ? (
            <div className="text-center py-6 px-3">
              <AlertTriangle size={22} className="mx-auto mb-2" style={{ color: TX.warning }} />
              <p className="text-xs font-medium" style={{ color: TX.muted }}>{error}</p>
              <button type="button" onClick={fetchRubrics} className="mt-2 text-xs font-bold bg-transparent border-0 cursor-pointer" style={{ color: TX.accent }}>Retry</button>
            </div>
          ) : !rubrics.length ? (
            <div className="text-center py-6 px-3">
              <BookOpen size={24} className="mx-auto mb-2" style={{ color: TX.muted }} />
              <p className="text-xs font-medium" style={{ color: TX.muted }}>No rubrics published yet</p>
            </div>
          ) : rubrics.map(r => {
            const isOpen = expanded === (r.id || r._id);
            return (
            <div key={r.id || r._id}>
              <div
                onClick={() => setExpanded(isOpen ? null : (r.id || r._id))}
                className="p-3.5 rounded-xl border transition-all hover:shadow-sm cursor-pointer"
                style={{ borderColor: TX.line, borderBottomLeftRadius: isOpen ? '0' : '', borderBottomRightRadius: isOpen ? '0' : '', borderBottom: isOpen ? 'none' : '' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate" style={{ color: TX.ink }}>{r.name || 'Untitled'}</p>
                    <p className="text-[11px] font-medium mt-0.5" style={{ color: TX.muted }}>{r.version || ''} · {r.criteria?.length || 0} criteria</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button type="button" onClick={(e) => { e.stopPropagation(); loadRubric(r); }} className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 border-0 flex-center cursor-pointer hover:bg-blue-100 transition-all" title="Edit"><Pencil size={13} /></button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(r.id, r.name); }} className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 border-0 flex-center cursor-pointer hover:bg-rose-100 transition-all" title="Delete"><Trash2 size={13} /></button>
                    <Badge status={r.status} />
                    {isOpen ? <ChevronUp size={14} style={{ color: TX.muted }} /> : <ChevronDown size={14} style={{ color: TX.muted }} />}
                  </div>
                </div>
                {r.createdAt && (
                  <p className="text-[10px] mt-1.5" style={{ color: TX.muted }}>
                    {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
              {isOpen && (
                <div className="p-3.5 rounded-b-xl border border-t-0 space-y-2" style={{ borderColor: TX.line, backgroundColor: TX.surface }}>
                  {r.criteria?.length > 0 ? r.criteria.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white border" style={{ borderColor: TX.line }}>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold truncate" style={{ color: TX.ink }}>{c.name}</p>
                        <p className="text-[10px] font-medium" style={{ color: TX.muted }}>{c.clo || ''}</p>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: '#eff6ff', color: TX.primary }}>{c.weight}%</span>
                    </div>
                  )) : (
                    <p className="text-xs text-center py-4" style={{ color: TX.muted }}>No criteria defined.</p>
                  )}
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useCallback } from 'react';
import { getInchargeRubrics, saveRubric } from '../../services/office-incharge.service';
import { showToast } from '../../components/AppToast';
import { Plus, Trash2, Download, FileText, Loader2, CheckCircle, XCircle, AlertTriangle, BookOpen, Sparkles } from 'lucide-react';
import {
  generateStandardPdf, generateDetailedPdf, generateAcademicPdf,
  generateMinimalPdf, generateScoringPdf, generateComprehensivePdf
} from '../../components/office-incharge/RubricPdfTemplates';
import RubricPreview from '../../components/office-incharge/RubricPreview';
import DownloadModal from '../../components/office-incharge/DownloadModal';

const EMPTY = () => ({ id: crypto.randomUUID(), name: '', clo: '', weight: '' });

const DEFAULTS = {
  proposal: {
    name: 'Official Proposal Evaluation Rubric',
    criteria: [
      { id: crypto.randomUUID(), name: 'Problem Statement & Relevance', clo: 'CLO-1 (Problem Identification)', weight: 30 },
      { id: crypto.randomUUID(), name: 'Literature Review & Methodology', clo: 'CLO-2 (Design & Methodology)', weight: 40 },
      { id: crypto.randomUUID(), name: 'Expected Outcomes & Deliverables', clo: 'CLO-3 (Modern Tool Usage)', weight: 30 },
    ],
  },
  fyp: {
    name: 'FYP Evaluation Rubric',
    criteria: [
      { id: crypto.randomUUID(), name: 'Project Complexity & Scope', clo: 'CLO-2 (Design & Methodology)', weight: 25 },
      { id: crypto.randomUUID(), name: 'Implementation & Modern Tool Usage', clo: 'CLO-3 (Modern Tool Usage)', weight: 35 },
      { id: crypto.randomUUID(), name: 'Analysis & Results', clo: 'CLO-4 (Analysis)', weight: 25 },
      { id: crypto.randomUUID(), name: 'Presentation & Documentation', clo: 'CLO-5 (Communication)', weight: 15 },
    ],
  },
};

const TX = {
  surface: '#f1f5f9', white: '#ffffff', primary: '#1e3a8a', accent: '#3b82f6',
  success: '#059669', warning: '#d97706', danger: '#dc2626',
  ink: '#0f172a', muted: '#64748b', line: '#e2e8f0',
};

const TEMPLATE_MAP = {
  standard: { label: 'Standard', gen: generateStandardPdf },
  detailed: { label: 'Detailed', gen: generateDetailedPdf },
  academic: { label: 'Academic', gen: generateAcademicPdf },
  minimal: { label: 'Minimal', gen: generateMinimalPdf },
  scoring: { label: 'Scoring Card', gen: generateScoringPdf },
  comprehensive: { label: 'Comprehensive', gen: generateComprehensivePdf },
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
  const [rubricType, setRubricType] = useState('proposal');
  const [rubricName, setRubricName] = useState(DEFAULTS.proposal.name);
  const [criteria, setCriteria] = useState(DEFAULTS.proposal.criteria);
  const [rubricsData, setRubricsData] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const d = DEFAULTS[rubricType];
    setCriteria(d.criteria.map(c => ({ ...c, id: crypto.randomUUID() })));
    setRubricName(d.name);
  }, [rubricType]);

  useEffect(() => { fetchRubrics(); }, []);

  const fetchRubrics = async () => {
    setLoading(true); setError(null);
    try {
      const res = await getInchargeRubrics();
      setRubricsData(res);
    } catch {
      setError('Failed to load rubric history');
      showToast.error('Could not load rubric history');
    } finally { setLoading(false); }
  };

  const rubrics = rubricsData?.data || [];
  const totalW = criteria.reduce((s, c) => s + (Number(c.weight) || 0), 0);
  const isValid = totalW === 100;
  const hasEmpty = criteria.some(c => !c.name.trim() || !c.clo.trim() || !c.weight);

  const nextVer = useCallback(() => {
    const same = rubrics.filter(r => r.type === rubricType && r.version);
    if (!same.length) return 'v1.0';
    const nums = same.map(r => { const m = r.version.match(/v(\d+)/); return m ? parseInt(m[1], 10) : 0; });
    return `v${Math.max(...nums) + 1}.0`;
  }, [rubrics, rubricType]);

  const addC = () => setCriteria([...criteria, EMPTY()]);
  const updC = (id, f, v) => setCriteria(criteria.map(c => c.id === id ? { ...c, [f]: v } : c));
  const remC = (id) => { if (criteria.length > 1) setCriteria(criteria.filter(c => c.id !== id)); };
  const resetF = () => {
    const d = DEFAULTS[rubricType];
    setCriteria(d.criteria.map(c => ({ ...c, id: crypto.randomUUID() })));
    setRubricName(d.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || hasEmpty || submitting) return;
    setSubmitting(true);
    try {
      await saveRubric({
        name: rubricName.trim(),
        version: nextVer(),
        type: rubricType,
        criteria: criteria.map(({ id, ...rest }) => ({ ...rest, weight: Number(rest.weight), maxScore: 100 })),
        status: 'active', validation: 'valid',
      });
      showToast.success(`"${rubricName}" published as ${nextVer()}`);
      resetF(); fetchRubrics();
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to publish rubric');
    } finally { setSubmitting(false); }
  };

  const buildRubric = () => ({
    name: rubricName || 'Evaluation Rubric',
    version: nextVer(),
    type: rubricType,
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
      console.error('PDF generation error:', e);
      showToast.error('PDF generation failed. Check console for details.');
    }
  };

  const previewRubric = buildRubric();

  return (
    <div className="animate-fadeSlideUp">
      <DownloadModal isOpen={downloading} onComplete={() => setDownloading(false)} />

      <div className="mb-6 pb-4 border-b flex items-center justify-between" style={{ borderColor: TX.line }}>
        <div>
          <h2 className="text-xl font-bold" style={{ color: TX.ink }}>Rubric Builder</h2>
          <p className="text-sm font-medium mt-0.5" style={{ color: TX.muted }}>Design, validate, and publish evaluation rubrics. Weights must total exactly 100%.</p>
        </div>
        <span className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: TX.surface, color: TX.muted }}>
          {rubrics.length} published
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ─── Left: Schema Form ─── */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="rounded-2xl border shadow-sm overflow-hidden h-full" style={{ borderColor: TX.line, backgroundColor: TX.white }}>
            <div className="p-5 border-b flex items-center justify-between flex-wrap gap-3" style={{ borderColor: TX.line, backgroundColor: TX.surface }}>
              <div className="flex items-center gap-2">
                <FileText size={16} style={{ color: TX.primary }} />
                <h3 className="text-base font-bold" style={{ color: TX.ink }}>Schema Form</h3>
              </div>
              <div className="flex gap-1.5">
                {['proposal', 'fyp'].map(t => (
                  <button key={t} type="button" onClick={() => setRubricType(t)}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    style={{ backgroundColor: rubricType === t ? TX.primary : TX.white, color: rubricType === t ? TX.white : TX.muted, border: `1px solid ${rubricType === t ? TX.primary : TX.line}` }}
                  >{t === 'proposal' ? 'Proposal' : 'FYP Eval'}</button>
                ))}
              </div>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: TX.ink }}>Rubric Title</label>
                <input type="text" value={rubricName} onChange={(e) => setRubricName(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 text-base font-bold outline-none transition-all"
                  style={{ borderColor: TX.line, color: TX.ink, backgroundColor: TX.white }}
                  onFocus={(e) => e.target.style.borderColor = TX.accent} onBlur={(e) => e.target.style.borderColor = TX.line} required />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: TX.ink }}>Criteria</span>
                  <button type="button" onClick={addC} className="flex items-center gap-1 text-xs font-bold transition-all cursor-pointer bg-transparent border-0" style={{ color: TX.accent }}>
                    <Plus size={13} /> Add Criterion
                  </button>
                </div>
                <div className="space-y-2.5">
                  {criteria.map(c => (
                    <CriterionRow key={c.id} criterion={c} onChange={updC} onRemove={remC} canRemove={criteria.length > 1} />
                  ))}
                </div>
                {!criteria.length && (
                  <div className="text-center py-8 rounded-xl border border-dashed" style={{ borderColor: TX.line }}>
                    <BookOpen size={26} className="mx-auto mb-2" style={{ color: TX.muted }} />
                    <p className="text-sm font-medium" style={{ color: TX.muted }}>No criteria. Click "Add Criterion" to start.</p>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl border flex items-center justify-between" style={{ borderColor: isValid ? '#a7f3d0' : '#fecaca', backgroundColor: isValid ? '#f0fdf4' : '#fef2f2' }}>
                <div className="flex items-center gap-2">
                  {isValid ? <CheckCircle size={16} style={{ color: TX.success }} /> : <XCircle size={16} style={{ color: TX.danger }} />}
                  <span className="text-sm font-bold" style={{ color: isValid ? TX.success : TX.danger }}>Total: {totalW}%</span>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-lg" style={{ backgroundColor: isValid ? '#d1fae5' : '#fee2e2', color: isValid ? '#065f46' : '#991b1b' }}>
                  {isValid ? 'Valid Schema' : `Needs ${totalW < 100 ? '+' : ''}${100 - totalW}%`}
                </span>
              </div>
            </div>

            <div className="p-5 border-t flex justify-end" style={{ borderColor: TX.line, backgroundColor: TX.surface }}>
              <button type="submit" disabled={!isValid || hasEmpty || submitting}
                className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed border-0"
                style={{ backgroundColor: !isValid || hasEmpty ? '#cbd5e1' : TX.primary, color: !isValid || hasEmpty ? '#94a3b8' : TX.white }}>
                {submitting ? <><Loader2 size={15} className="animate-spin" /> Publishing...</> : 'Publish Rubric'}
              </button>
            </div>
          </form>
        </div>

        {/* ─── Right column: export card + live preview + history ─── */}
        <div className="lg:col-span-5 flex flex-col gap-5">

          {/* Export Card */}
          <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: TX.line, backgroundColor: TX.primary }}>
            <div className="p-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles size={16} style={{ color: 'rgba(255,255,255,0.8)' }} />
                <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>Export PDF</span>
              </div>
              <div className="flex items-center gap-2">
                <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="flex-1 text-xs font-bold border rounded-lg px-3 py-2.5 outline-none cursor-pointer"
                  style={{ borderColor: TX.line, color: TX.ink, backgroundColor: TX.white }}>
                  {Object.entries(TEMPLATE_MAP).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
                <button type="button" onClick={handleDownload}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer border-0"
                  style={{ backgroundColor: TX.white, color: TX.primary }}>
                  <Download size={15} />
                  PDF
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview (always visible) */}
          <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: TX.line, backgroundColor: TX.white }}>
            <div className="p-3 border-b" style={{ borderColor: TX.line, backgroundColor: TX.surface }}>
              <h3 className="text-xs font-bold" style={{ color: TX.ink }}>Live Preview</h3>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: TX.muted }}>
                {TEMPLATE_MAP[selectedTemplate].label} template · updates as you type
              </p>
            </div>
            <div className="p-3">
              <RubricPreview
                rubric={previewRubric}
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />
            </div>
          </div>

          {/* Version History */}
          <div className="rounded-2xl border shadow-sm overflow-hidden flex-1" style={{ borderColor: TX.line, backgroundColor: TX.white }}>
            <div className="p-4 border-b" style={{ borderColor: TX.line, backgroundColor: TX.surface }}>
              <h3 className="text-sm font-bold" style={{ color: TX.ink }}>Version History</h3>
              <p className="text-xs font-medium mt-0.5" style={{ color: TX.muted }}>{rubrics.length} published</p>
            </div>
            <div className="p-3 space-y-2 max-h-[280px] overflow-y-auto">
              {loading ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-3 rounded-xl border" style={{ borderColor: TX.line }}>
                  <div className="skeleton h-3.5 w-36 rounded-md mb-1.5" />
                  <div className="skeleton h-3 w-28 rounded-md" />
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
              ) : rubrics.map(r => (
                <div key={r.id} className="p-3 rounded-xl border transition-all hover:shadow-sm" style={{ borderColor: TX.line }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate" style={{ color: TX.ink }}>{r.version}</p>
                      <p className="text-[11px] font-medium mt-0.5 truncate" style={{ color: TX.muted }}>{r.name}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: TX.muted }}>
                        {r.date ? new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      </p>
                    </div>
                    <Badge status={r.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

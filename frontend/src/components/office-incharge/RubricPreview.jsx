import { Eye, FileText, LayoutGrid, ScrollText, Wind, CreditCard, ClipboardList } from 'lucide-react';

const T = {
  navy: '#14286e',
  blue: '#2563eb',
  ink: '#0f172a',
  muted: '#64748b',
  line: '#e2e8f0',
  white: '#ffffff',
  surface: '#f1f5f9',
  success: '#059669',
  gold: '#b4821a',
};

const TEMPLATES = [
  { id: 'standard', name: 'Standard', icon: FileText, desc: 'Clean table layout with criteria, CLOs, weights, and score columns.' },
  { id: 'detailed', name: 'Detailed', icon: LayoutGrid, desc: 'Performance level descriptors per criterion with tick-box scoring.' },
  { id: 'academic', name: 'Academic', icon: ScrollText, desc: 'Formal HEC-style with info block, certification, signature lines.' },
  { id: 'minimal', name: 'Minimal', icon: Wind, desc: 'Ultra-clean, light borders, maximum whitespace. Modern & airy.' },
  { id: 'scoring', name: 'Scoring Card', icon: CreditCard, desc: 'Compact one-pager with big score boxes. Built for evaluators.' },
  { id: 'comprehensive', name: 'Comprehensive', icon: ClipboardList, desc: 'Full evaluation form with comments, summary, and signatures.' },
];

function TemplatedPreview({ rubric, template }) {
  const criteria = rubric.criteria?.filter((c) => c.name?.trim()) || [];
  const totalW = criteria.reduce((s, c) => s + Number(c.weight || 0), 0);
  const isValid = totalW === 100;

  if (criteria.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8" style={{ color: T.muted }}>
        <Eye size={32} className="mb-3 opacity-40" />
        <p className="text-xs font-medium">Add criteria to see a live preview</p>
        <p className="text-[10px] mt-1">The preview updates as you type.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {template === 'standard' && <StandardPreview criteria={criteria} totalW={totalW} isValid={isValid} rubric={rubric} />}
      {template === 'detailed' && <DetailedPreview criteria={criteria} totalW={totalW} isValid={isValid} rubric={rubric} />}
      {template === 'academic' && <AcademicPreview criteria={criteria} totalW={totalW} isValid={isValid} rubric={rubric} />}
      {template === 'minimal' && <MinimalPreview criteria={criteria} totalW={totalW} isValid={isValid} rubric={rubric} />}
      {template === 'scoring' && <ScoringPreview criteria={criteria} totalW={totalW} isValid={isValid} rubric={rubric} />}
      {template === 'comprehensive' && <ComprehensivePreview criteria={criteria} totalW={totalW} isValid={isValid} rubric={rubric} />}
    </div>
  );
}

function DocBar({ children, light }) {
  return (
    <div className="w-full px-5 py-3" style={{ backgroundColor: light ? T.surface : T.navy }}>
      <div className="flex items-center justify-between">{children}</div>
    </div>
  );
}

function DocLine() {
  return <div className="mx-5 border-t" style={{ borderColor: T.line }} />;
}

function DocFooter() {
  return (
    <>
      <div className="mx-5 border-t mt-auto" style={{ borderColor: T.line }} />
      <div className="px-5 py-2 flex items-center justify-between">
        <span className="text-[7px]" style={{ color: T.muted }}>
          Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · CUI FYP Management System
        </span>
        <span className="text-[7px]" style={{ color: T.muted }}>Page 1</span>
      </div>
    </>
  );
}

/* ─── Standard ─── */
function StandardPreview({ criteria, totalW, isValid, rubric }) {
  const typeLabel = rubric.type === 'fyp' ? 'FYP Evaluation Rubric' : 'Proposal Defense Rubric';
  return (
    <div className="flex flex-col h-full text-[8px]" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <DocBar>
        <div>
          <div className="text-[11px] font-bold" style={{ color: T.white }}>{rubric.name || 'Evaluation Rubric'}</div>
          <div className="text-[6.5px] mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>{typeLabel} · {rubric.version || 'v1.0'} · CUI Abbottabad</div>
        </div>
        <div className="text-[7px] font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>FYP Office</div>
      </DocBar>
      <DocLine />
      <div className="px-5 py-3 flex-1 overflow-auto">
        <table className="w-full border-collapse" style={{ borderColor: T.line }}>
          <thead>
            <tr style={{ backgroundColor: T.navy, color: T.white }}>
              {['#', 'Criterion', 'Mapped CLO', 'Wt.%', 'Score'].map((h) => (
                <th key={h} className="text-[7px] font-bold py-1.5 px-1 text-center border" style={{ borderColor: '#334155' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((c, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? T.white : '#f8fafc' }}>
                <td className="text-center py-1.5 border text-[7px]" style={{ borderColor: T.line }}>{i + 1}</td>
                <td className="py-1.5 px-2 border text-[7px] font-medium" style={{ borderColor: T.line, color: T.ink }}>{c.name}</td>
                <td className="py-1.5 px-2 border text-[7px]" style={{ borderColor: T.line, color: T.muted }}>{c.clo || '-'}</td>
                <td className="text-center py-1.5 border text-[7px] font-bold" style={{ borderColor: T.line }}>{c.weight}%</td>
                <td className="text-center py-1.5 border text-[7px]" style={{ borderColor: T.line, color: T.blue }}>____ / {c.maxScore || 100}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td colSpan={2} />
              <td className="text-right py-1.5 px-2 border text-[7px] font-bold" style={{ borderColor: T.line }}>
                Total: <span style={{ color: isValid ? T.success : T.gold }}>{totalW}%</span>
              </td>
              <td colSpan={2} className="text-center py-1.5 border text-[7px] font-bold" style={{ borderColor: T.line }}>____ / ____</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <DocFooter />
    </div>
  );
}

/* ─── Detailed (fixed overlap) ─── */
function DetailedPreview({ criteria, totalW, rubric }) {
  const levels = ['Excellent', 'Good', 'Satisfactory', 'Poor'];
  const scores = [4, 3, 2, 1];
  const getDesc = getShortDescriptor;

  return (
    <div className="flex flex-col h-full text-[8px]" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <DocBar>
        <div>
          <div className="text-[11px] font-bold" style={{ color: T.white }}>{rubric.name || 'Evaluation Rubric'}</div>
          <div className="text-[6.5px] mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>FYP Office · {rubric.version || 'v1.0'}</div>
        </div>
      </DocBar>
      <DocLine />
      <div className="px-4 py-2 flex-1 overflow-auto space-y-[3px]">
        {criteria.map((c, i) => (
          <div key={i} className="border rounded" style={{ borderColor: T.line }}>
            <div className="flex items-center gap-2 px-2.5 py-1.5 border-b" style={{ borderColor: T.line, backgroundColor: i % 2 === 0 ? T.white : T.surface }}>
              <span className="text-[7px] font-bold shrink-0 w-4 h-4 rounded flex items-center justify-center text-white" style={{ backgroundColor: T.navy }}>{i + 1}</span>
              <span className="text-[7.5px] font-bold truncate" style={{ color: T.ink }}>{c.name}</span>
              {c.clo && <span className="text-[6px] ml-auto shrink-0" style={{ color: T.muted }}>{c.clo}</span>}
              <span className="text-[6.5px] font-semibold shrink-0 ml-1" style={{ color: T.muted }}>{c.weight}%</span>
            </div>
            <div className="grid grid-cols-4 gap-[1px] p-[2px]">
              {levels.map((level, li) => (
                <div key={li} className="border rounded px-1 py-1 text-center" style={{ borderColor: T.line, backgroundColor: T.white }}>
                  <div className="text-[5.5px] font-bold leading-tight" style={{ color: T.ink }}>{level}</div>
                  <div className="text-[5px] leading-tight mt-[1px]" style={{ color: T.muted }}>{getDesc(c.name, li)}</div>
                  <div className="text-[6px] mt-[2px]" style={{ color: T.blue }}>[{scores[li]}]</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-[3px] p-2 rounded border flex items-center justify-between text-[6.5px]" style={{ borderColor: T.line, backgroundColor: T.surface }}>
          <span style={{ color: T.muted }}>Total: ____ / 100</span>
          <span className="font-bold" style={{ color: T.ink }}>Weight: {totalW}%</span>
        </div>
      </div>
      <DocFooter />
    </div>
  );
}

/* ─── Academic ─── */
function AcademicPreview({ criteria, totalW, isValid, rubric }) {
  return (
    <div className="flex flex-col h-full text-[8px]" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div style={{ backgroundColor: T.navy }}>
        <div className="px-5 pt-3 pb-2">
          <div className="text-[11px] font-bold text-center" style={{ color: T.white }}>COMSATS University Islamabad</div>
          <div className="text-[6px] text-center mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Abbottabad Campus · Department of Computer Science</div>
          <div className="text-[7.5px] font-bold text-center mt-1.5" style={{ color: T.white }}>FYP Evaluation Scorecard</div>
          <div className="text-[6px] text-center mt-[1px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {rubric.type === 'fyp' ? 'FYP Evaluation Rubric' : 'Proposal Defense Rubric'} · {rubric.version || 'v1.0'}
          </div>
        </div>
        <div style={{ height: 2, backgroundColor: T.blue }} />
      </div>
      <DocLine />
      <div className="px-4 py-2 border-b mx-4" style={{ borderColor: T.line }}>
        <div className="grid grid-cols-2 gap-x-3 gap-y-[1px]">
          {[['Program:', 'BS CS'], ['Semester:', 'Spring 2026'], ['Course:', 'CSC-499'], ['Rubric:', rubric.name || 'Evaluation']].map(([l, v], i) => (
            <div key={i} className="flex gap-1 text-[6px]">
              <span className="font-bold" style={{ color: T.muted }}>{l}</span>
              <span style={{ color: T.ink }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 py-2 flex-1 overflow-auto">
        <table className="w-full border-collapse" style={{ borderColor: T.line }}>
          <thead>
            <tr style={{ backgroundColor: T.navy, color: T.white }}>
              {['#', 'Criterion', 'CLO', 'Wt.', 'Max', 'Score'].map((h) => (
                <th key={h} className="text-[6px] font-bold py-1 px-0.5 text-center border" style={{ borderColor: '#334155' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((c, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? T.white : '#f8fafc' }}>
                <td className="text-center py-1 border text-[6px]" style={{ borderColor: T.line }}>{i + 1}</td>
                <td className="py-1 px-1.5 border text-[6px] font-medium" style={{ borderColor: T.line, color: T.ink }}>{c.name}</td>
                <td className="py-1 px-1.5 border text-[6px]" style={{ borderColor: T.line, color: T.muted }}>{c.clo || '-'}</td>
                <td className="text-center py-1 border text-[6px]" style={{ borderColor: T.line }}>{c.weight}%</td>
                <td className="text-center py-1 border text-[6px]" style={{ borderColor: T.line }}>{c.maxScore || 100}</td>
                <td className="text-center py-1 border text-[6px]" style={{ borderColor: T.line, color: T.blue }}>______</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: T.surface }}>
              <td colSpan={2} />
              <td colSpan={4} className="text-right py-1 px-1.5 border text-[6.5px] font-bold" style={{ borderColor: T.line, color: T.ink }}>
                Total: <span style={{ color: isValid ? T.success : T.gold }}>{totalW}%</span> · Weighted: ______
              </td>
            </tr>
          </tfoot>
        </table>
        <div className="mt-[6px] p-2 rounded border" style={{ borderColor: T.line, backgroundColor: T.surface }}>
          <div className="text-[6.5px] font-bold" style={{ color: T.ink }}>Certification</div>
          <div className="text-[6px] mt-1 leading-tight" style={{ color: T.muted }}>
            This is to certify that the above evaluation has been conducted in accordance with the approved FYP evaluation policy of the Department of Computer Science.
          </div>
          <div className="flex justify-between mt-2 text-[6px]">
            <span><span className="font-bold" style={{ color: T.muted }}>Evaluator:</span> __________</span>
            <span><span className="font-bold" style={{ color: T.muted }}>HOD:</span> __________</span>
          </div>
        </div>
      </div>
      <DocFooter />
    </div>
  );
}

/* ─── Minimal ─── */
function MinimalPreview({ criteria, totalW, rubric }) {
  return (
    <div className="flex flex-col h-full text-[8px]" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <DocBar light>
        <div>
          <div className="text-[11px] font-bold" style={{ color: T.ink }}>{rubric.name || 'Evaluation Rubric'}</div>
          <div className="text-[6.5px] mt-0.5" style={{ color: T.muted }}>{rubric.version || 'v1.0'} · CUI Abbottabad</div>
        </div>
      </DocBar>
      <DocLine />
      <div className="px-5 py-3 flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ backgroundColor: T.surface }}>
              {['#', 'Criterion', 'CLO', 'Wt.', 'Score'].map((h) => (
                <th key={h} className="text-[6.5px] font-bold py-1.5 px-1 text-center border-b" style={{ borderColor: T.line, color: T.ink }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((c, i) => (
              <tr key={i}>
                <td className="text-center py-1.5 border-b text-[6.5px]" style={{ borderColor: T.line, color: T.muted }}>{i + 1}</td>
                <td className="py-1.5 px-2 border-b text-[6.5px]" style={{ borderColor: T.line, color: T.ink }}>{c.name}</td>
                <td className="py-1.5 px-2 border-b text-[6.5px]" style={{ borderColor: T.line, color: T.muted }}>{c.clo || '-'}</td>
                <td className="text-center py-1.5 border-b text-[6.5px]" style={{ borderColor: T.line, color: T.ink }}>{c.weight}%</td>
                <td className="text-center py-1.5 border-b text-[6.5px]" style={{ borderColor: T.line, color: T.blue }}>______</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} />
              <td className="text-right py-1.5 px-1 text-[6.5px] font-bold" style={{ color: T.ink }}>Total: {totalW}%</td>
              <td className="text-center py-1.5 text-[6.5px] font-bold" style={{ color: T.ink }}>______</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <DocFooter />
    </div>
  );
}

/* ─── Scoring Card ─── */
function ScoringPreview({ criteria, totalW, rubric }) {
  return (
    <div className="flex flex-col h-full text-[8px]" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="px-4 py-2.5 text-center" style={{ backgroundColor: T.navy }}>
        <div className="text-[10px] font-bold" style={{ color: T.white }}>FYP Scoring Card</div>
        <div className="text-[6px] mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{rubric.name || 'Evaluation'} · {rubric.version || 'v1.0'}</div>
      </div>
      <div style={{ height: 1.5, backgroundColor: T.blue }} />
      <DocLine />
      <div className="px-4 py-2 flex-1 overflow-auto space-y-[2px]">
        {criteria.map((c, i) => (
          <div key={i} className="flex items-center gap-2 px-2.5 py-2 rounded border" style={{ borderColor: T.line, backgroundColor: i % 2 === 0 ? T.white : T.surface }}>
            <span className="text-[6.5px] font-bold w-4 shrink-0" style={{ color: T.muted }}>{i + 1}.</span>
            <div className="flex-1 min-w-0">
              <div className="text-[7px] font-medium truncate" style={{ color: T.ink }}>{c.name}</div>
              <div className="text-[5.5px]" style={{ color: T.muted }}>{c.clo || ''}</div>
            </div>
            <span className="text-[6px] font-semibold shrink-0" style={{ color: T.muted }}>W:{c.weight}%</span>
            <div className="w-[18px] h-[18px] rounded border-2 shrink-0 flex items-center justify-center" style={{ borderColor: T.blue }}>
              <span className="text-[6px]" style={{ color: T.blue }}>S</span>
            </div>
            <div className="w-[18px] h-[18px] rounded border-2 shrink-0 flex items-center justify-center" style={{ borderColor: T.blue }}>
              <span className="text-[6px]" style={{ color: T.blue }}>W</span>
            </div>
          </div>
        ))}
        <div className="mt-[3px] p-2 rounded text-center text-[7px] font-bold" style={{ backgroundColor: T.surface, color: T.navy }}>
          Total Weight: {totalW}% · Final Score: ______ / 100
        </div>
      </div>
      <DocFooter />
    </div>
  );
}

/* ─── Comprehensive ─── */
function ComprehensivePreview({ criteria, totalW, isValid, rubric }) {
  return (
    <div className="flex flex-col h-full text-[8px]" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div style={{ backgroundColor: T.navy }}>
        <div className="px-4 pt-2.5 pb-1.5">
          <div className="text-[9px] font-bold text-center" style={{ color: T.white }}>COMSATS University Islamabad</div>
          <div className="text-[5.5px] text-center" style={{ color: 'rgba(255,255,255,0.7)' }}>Dept. of Computer Science</div>
          <div className="text-[7px] font-bold text-center mt-1" style={{ color: T.white }}>Comprehensive FYP Evaluation</div>
        </div>
        <div style={{ height: 1.5, backgroundColor: T.blue }} />
      </div>
      <div className="px-4 py-1.5 border-b" style={{ borderColor: T.line, backgroundColor: T.surface }}>
        <div className="grid grid-cols-2 gap-x-2 text-[5.5px]">
          <span><span className="font-bold" style={{ color: T.muted }}>Evaluator:</span> ________</span>
          <span className="text-right"><span className="font-bold" style={{ color: T.muted }}>Date:</span> ________</span>
          <span><span className="font-bold" style={{ color: T.muted }}>Student:</span> ________</span>
          <span className="text-right"><span className="font-bold" style={{ color: T.muted }}>Reg. No:</span> ________</span>
        </div>
      </div>
      <div className="px-4 py-2 flex-1 overflow-auto">
        <table className="w-full border-collapse" style={{ borderColor: T.line }}>
          <thead>
            <tr style={{ backgroundColor: T.navy, color: T.white }}>
              {['#', 'Criterion', 'CLO', 'Wt.', 'Score', 'Wtd', 'Comments'].map((h) => (
                <th key={h} className="text-[5.5px] font-bold py-1 px-0.5 text-center border" style={{ borderColor: '#334155' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((c, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? T.white : '#f8fafc' }}>
                <td className="text-center py-1 border text-[5.5px]" style={{ borderColor: T.line }}>{i + 1}</td>
                <td className="py-1 px-1 border text-[5.5px]" style={{ borderColor: T.line, color: T.ink }}>{c.name}</td>
                <td className="py-1 px-1 border text-[5.5px]" style={{ borderColor: T.line, color: T.muted }}>{c.clo ? c.clo.slice(0, 6) : '-'}</td>
                <td className="text-center py-1 border text-[5.5px]" style={{ borderColor: T.line }}>{c.weight}%</td>
                <td className="text-center py-1 border text-[5.5px]" style={{ borderColor: T.line, color: T.blue }}>__</td>
                <td className="text-center py-1 border text-[5.5px]" style={{ borderColor: T.line, color: T.blue }}>__</td>
                <td className="text-center py-1 border text-[5.5px]" style={{ borderColor: T.line, color: T.muted }}>____</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: T.surface }}>
              <td colSpan={3} />
              <td colSpan={4} className="text-right py-1 px-1 border text-[6px] font-bold" style={{ borderColor: T.line, color: T.ink }}>
                Total Wt: {totalW}% · Weighted: ___
              </td>
            </tr>
          </tfoot>
        </table>
        <div className="mt-[6px] p-2 rounded border" style={{ borderColor: T.line, backgroundColor: T.surface }}>
          <div className="text-[6px] font-bold" style={{ color: T.ink }}>Summary</div>
          <div className="grid grid-cols-3 gap-1 mt-1 text-[5.5px]">
            <span><span className="font-bold" style={{ color: T.muted }}>Raw:</span> ___ / {criteria.length * 4}</span>
            <span><span className="font-bold" style={{ color: T.muted }}>%:</span> ___</span>
            <span><span className="font-bold" style={{ color: T.muted }}>Grade:</span> ___</span>
          </div>
          <div className="mt-1.5 border-t pt-1 text-[5.5px] flex justify-between" style={{ borderColor: T.line }}>
            <span><span className="font-bold" style={{ color: T.muted }}>Evaluator:</span> ________</span>
            <span><span className="font-bold" style={{ color: T.muted }}>HOD:</span> ________</span>
          </div>
        </div>
      </div>
      <DocFooter />
    </div>
  );
}

function getShortDescriptor(name, level) {
  const map = [
    { k: ['problem', 'relevance', 'objective'], v: ['Clear problem, strong justification', 'Good problem context', 'Basic problem stated', 'Vague problem'] },
    { k: ['literature', 'review', 'background'], v: ['Comprehensive synthesis', 'Good range of sources', 'Some relevant sources', 'Minimal sources'] },
    { k: ['methodology', 'approach', 'design'], v: ['Rigorous methodology', 'Appropriate methodology', 'Basic methodology', 'Unclear methodology'] },
    { k: ['outcome', 'deliverable', 'result'], v: ['Well-defined outcomes', 'Clear outcomes', 'Vague outcomes', 'No outcomes'] },
    { k: ['implement', 'tool', 'technolog'], v: ['Advanced implementation', 'Good tool usage', 'Basic implementation', 'Incorrect tools'] },
    { k: ['analysis', 'evaluation', 'testing'], v: ['Rigorous analysis', 'Good analysis', 'Basic analysis', 'No analysis'] },
    { k: ['presentation', 'document', 'communic'], v: ['Exceptional clarity', 'Clear & organized', 'Adequate', 'Poor'] },
  ];
  const lower = (name || '').toLowerCase();
  const match = map.find(m => m.k.some(k => lower.includes(k)));
  return (match || map[2]).v[level] || '';
}

export default function RubricPreview({ rubric, selectedTemplate, onTemplateChange }) {
  return (
    <div className="flex items-center justify-center py-2">
      <div
        className="w-full border shadow-sm rounded-sm overflow-hidden"
        style={{ borderColor: T.line, backgroundColor: T.white, aspectRatio: '210 / 297', maxHeight: '380px', fontSize: '8px' }}
      >
        <TemplatedPreview rubric={rubric} template={selectedTemplate} />
      </div>
    </div>
  );
}

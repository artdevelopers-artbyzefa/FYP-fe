import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const C = {
  navy: [20, 40, 110], blue: [37, 99, 235], ink: [15, 23, 42],
  muted: [100, 116, 139], line: [226, 232, 240], white: [255, 255, 255],
  light: [241, 245, 249], success: [5, 150, 105], gold: [180, 130, 20],
};

function saveDoc(doc, name) {
  const filename = name.replace(/\s+/g, '_').toLowerCase();
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.pdf`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
}

function brandHeader(doc, rubric, variant) {
  const pw = doc.internal.pageSize.getWidth();
  const barH = variant === 'academic' || variant === 'comprehensive' ? 52 : variant === 'minimal' ? 30 : 44;

  if (variant === 'minimal') {
    doc.setFillColor(...C.light);
    doc.rect(0, 0, pw, barH, 'F');
    doc.setDrawColor(...C.line);
    doc.line(14, barH, pw - 14, barH);
    doc.setTextColor(...C.ink);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(rubric.name || 'Evaluation Rubric', 16, 16);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.muted);
    const label = rubric.type === 'fyp' ? 'FYP Evaluation Rubric' : 'Proposal Defense Rubric';
    doc.text(`${label}  ·  ${rubric.version || 'v1.0'}`, 16, 24);
    return;
  }

  if (variant === 'scoring') {
    doc.setFillColor(...C.navy);
    doc.rect(0, 0, pw, 36, 'F');
    doc.setTextColor(...C.white);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('FYP Scoring Card', pw / 2, 14, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`${rubric.name || 'Evaluation'}  ·  ${rubric.version || 'v1.0'}`, pw / 2, 24, { align: 'center' });
    doc.setDrawColor(...C.blue);
    doc.setLineWidth(0.6);
    doc.line(14, 34, pw - 14, 34);
    doc.setLineWidth(0.2);
    return;
  }

  if (variant === 'academic' || variant === 'comprehensive') {
    doc.setFillColor(...C.navy);
    doc.rect(0, 0, pw, barH, 'F');
    doc.setFillColor(...C.blue);
    doc.rect(0, barH - 3, pw, 3, 'F');
    doc.setTextColor(...C.white);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('COMSATS University Islamabad', pw / 2, 16, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Abbottabad Campus  ·  Department of Computer Science', pw / 2, 26, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(variant === 'academic' ? 'FYP Evaluation Scorecard' : 'Comprehensive FYP Evaluation Form', pw / 2, 38, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const label = rubric.type === 'fyp' ? 'FYP Evaluation Rubric' : 'Proposal Defense Rubric';
    doc.text(`${label}  ·  ${rubric.version || 'v1.0'}`, pw / 2, 46, { align: 'center' });
    return;
  }

  doc.setFillColor(...C.navy);
  doc.rect(0, 0, pw, barH, 'F');
  const label = rubric.type === 'fyp' ? 'FYP Evaluation Rubric' : 'Proposal Defense Rubric';
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.white);
  doc.text(rubric.name || 'Evaluation Rubric', 16, 18);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${label}  ·  ${rubric.version || 'v1.0'}  ·  CUI Abbottabad`, 16, 30);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bolditalic');
  doc.text('FYP Office', pw - 16, 18, { align: 'right' });
  doc.setDrawColor(...C.line);
  doc.line(14, barH + 6, pw - 14, barH + 6);
}

function brandFooter(doc) {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  doc.setDrawColor(...C.line);
  doc.line(14, ph - 22, pw - 14, ph - 22);
  doc.setTextColor(...C.muted);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  const ds = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`Generated: ${ds}  ·  CUI FYP Management System`, 14, ph - 12);
  doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber}`, pw - 14, ph - 12, { align: 'right' });
}

/* ─── 1. Standard ─── */
export function generateStandardPdf(rubric) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  brandHeader(doc, rubric, 'standard');
  const criteria = rubric.criteria || [];
  const totalW = criteria.reduce((s, c) => s + Number(c.weight || 0), 0);
  doc.autoTable({
    startY: 60,
    head: [['#', 'Criterion', 'Mapped CLO', 'Wt.%', 'Score']],
    body: criteria.map((c, i) => [i + 1, c.name || '-', c.clo || '-', `${c.weight}`, '____ / ' + (c.maxScore || 100)]),
    foot: [[{ content: '', colSpan: 2 }, { content: `Total Weight: ${totalW}%`, colSpan: 2, styles: { halign: 'right', fontStyle: 'bold', fontSize: 9, textColor: totalW === 100 ? [...C.success] : [...C.gold] } }, { content: '____ / ____', styles: { fontStyle: 'bold', fontSize: 9 } }]],
    theme: 'grid',
    headStyles: { fillColor: [...C.navy], textColor: [...C.white], fontSize: 9, fontStyle: 'bold', halign: 'center', cellPadding: 2 },
    bodyStyles: { fontSize: 8.5, textColor: [...C.ink], cellPadding: 2 },
    alternateRowStyles: { fillColor: [...C.light] },
    footStyles: { fillColor: 248, textColor: [...C.ink], fontSize: 9, cellPadding: 2 },
    columnStyles: { 0: { cellWidth: 10, halign: 'center' }, 1: { cellWidth: 66 }, 2: { cellWidth: 50 }, 3: { cellWidth: 18, halign: 'center' }, 4: { cellWidth: 28, halign: 'center' } },
    margin: { left: 14, right: 14 },
    tableLineColor: 203, tableLineWidth: 0.2,
  });
  let y = doc.lastAutoTable.finalY + 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...C.ink);
  doc.text('Scoring Guide', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  ['1. Enter a score for each criterion (0 to max score).', '2. Weighted score = (Score / Max) × Weight. Total = sum of weighted scores.', '3. Final percentage = (Total / Sum of weights) × 100.', '4. Submit completed scorecard to the FYP Office.'].forEach((t, i) => doc.text(t, 14, y += 5));
  y += 4;
  if (y < doc.internal.pageSize.getHeight() - 28) brandFooter(doc);
  saveDoc(doc, rubric.name || 'rubric');
}

/* ─── 2. Detailed ─── */
export function generateDetailedPdf(rubric) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();
  brandHeader(doc, rubric, 'standard');

  const criteria = rubric.criteria || [];
  const totalW = criteria.reduce((s, c) => s + Number(c.weight || 0), 0);
  const levels = ['Excellent', 'Good', 'Satisfactory', 'Poor'];
  const marks = [4, 3, 2, 1];

  let y = 60;
  criteria.forEach((c, i) => {
    const rh = 30;
    const even = i % 2 === 0;
    doc.setFillColor(...(even ? C.white : C.light));
    doc.rect(14, y, pw - 28, rh, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(14, y, pw - 28, rh, 'S');
    doc.setFillColor(...C.navy);
    doc.rect(14, y, 5, rh, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...C.ink);
    doc.text(`${i + 1}`, 16.5, y + 5, { align: 'center' });

    doc.setFontSize(9);
    doc.text(c.name || '-', 23, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.muted);
    doc.text(c.clo ? `CLO: ${c.clo}` : '', 23, y + 11);

    const lx = pw - 14 - 155;
    doc.setFontSize(6);
    doc.text(`Weight: ${c.weight}%  |  Max: ${c.maxScore || 100}`, 23, y + 16);

    const bw = 38;
    levels.forEach((level, li) => {
      const bx = lx + li * (bw + 1);
      const by = y + 3;
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(...(even && li % 2 === 0 ? [248, 250, 252] : C.white));
      doc.rect(bx, by, bw, 24, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(...C.ink);
      doc.text(`${level} (${marks[li]})`, bx + bw / 2, by + 6, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.5);
      doc.setTextColor(...C.muted);
      doc.text(getShortDesc(c.name, li), bx + bw / 2, by + 13, { align: 'center', maxWidth: bw - 4 });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(...C.blue);
      doc.text('[  ]  ___', bx + bw / 2, by + 20, { align: 'center' });
    });
    y += rh + 2;
  });

  doc.setDrawColor(...C.line);
  doc.setFillColor(...C.light);
  doc.rect(14, y, pw - 28, 10, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...C.ink);
  doc.text(`Total Weight: ${totalW}%`, pw - 14 - 8, y + 6.5, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  doc.text('Total Score: ____ / 100', 14 + 6, y + 6.5);

  y += 16;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...C.ink);
  doc.text('Instructions', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  ['1. Tick one level per criterion and enter score (4 / 3 / 2 / 1).', '2. Weighted score = Score × Weight / 100. Sum all weighted scores.', '3. Final score = total weighted score out of 100.', '4. Submit to FYP Office.'].forEach((t, i) => doc.text(t, 14, y += 5));
  y += 4;
  if (y < doc.internal.pageSize.getHeight() - 28) brandFooter(doc);
  saveDoc(doc, `${rubric.name || 'rubric'}_detailed`);
}

/* ─── 3. Academic ─── */
export function generateAcademicPdf(rubric) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();
  brandHeader(doc, rubric, 'academic');

  const criteria = rubric.criteria || [];
  const totalW = criteria.reduce((s, c) => s + Number(c.weight || 0), 0);
  let y = 70;

  doc.setDrawColor(...C.line);
  doc.setFillColor(...C.light);
  doc.rect(14, y, pw - 28, 28, 'FD');
  doc.rect(14, y, pw - 28, 28, 'S');

  const infoData = [['Program:', 'BS Computer Science', 'Semester:', 'Spring 2026'], ['Course:', 'CSC-499 FYP', 'Rubric:', rubric.name || 'Evaluation']];
  infoData.forEach((row, ri) => {
    row.forEach((v, ci) => {
      const ix = ci % 2 === 0 ? 20 : pw / 2 + 6;
      const iy = y + 6 + ri * 7;
      doc.setFont('helvetica', ci % 2 === 0 ? 'bold' : 'normal');
      doc.setTextColor(ci % 2 === 0 ? C.muted : C.ink);
      doc.setFontSize(7.5);
      doc.text(v, ix, iy);
    });
  });
  y += 36;

  doc.autoTable({
    startY: y,
    head: [['#', 'Criterion Title', 'CLO', 'Weight', 'Max', 'Score']],
    body: criteria.map((c, i) => [i + 1, c.name || '-', c.clo || '-', `${c.weight}%`, c.maxScore || 100, '______']),
    foot: [[{ content: '', colSpan: 2 }, { content: `Total Weight: ${totalW}%  |  Weighted Score: ______`, colSpan: 4, styles: { halign: 'right', fontStyle: 'bold', fontSize: 8.5, fillColor: [...C.light], textColor: [...C.ink], cellPadding: 2 } }]],
    theme: 'grid',
    headStyles: { fillColor: [...C.navy], textColor: [...C.white], fontSize: 8.5, fontStyle: 'bold', halign: 'center', cellPadding: 2 },
    bodyStyles: { fontSize: 8, textColor: [...C.ink], cellPadding: 2 },
    alternateRowStyles: { fillColor: [...C.light] },
    footStyles: { fontSize: 8.5, textColor: [...C.ink] },
    columnStyles: { 0: { cellWidth: 10, halign: 'center' }, 1: { cellWidth: 58 }, 2: { cellWidth: 46 }, 3: { cellWidth: 18, halign: 'center' }, 4: { cellWidth: 20, halign: 'center' }, 5: { cellWidth: 24, halign: 'center' } },
    margin: { left: 14, right: 14 },
    tableLineColor: 203, tableLineWidth: 0.2,
  });
  y = doc.lastAutoTable.finalY + 14;

  doc.setDrawColor(...C.line);
  doc.setFillColor(...C.light);
  doc.rect(14, y, pw - 28, 40, 'FD');
  doc.rect(14, y, pw - 28, 40, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...C.ink);
  doc.text('Certification', 20, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  doc.text('This is to certify that the above evaluation has been conducted in accordance with', 20, y + 14);
  doc.text('the approved FYP evaluation policy of the Department of Computer Science.', 20, y + 19);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...C.ink);
  doc.text('Evaluator:', 20, y + 30);
  doc.text('____________________', 20 + 18, y + 30);
  doc.text('HOD / In-charge:', pw / 2 + 8, y + 30);
  doc.text('____________________', pw / 2 + 8 + 28, y + 30);
  y += 46;

  doc.setDrawColor(...C.line);
  doc.line(14, y, pw - 14, y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...C.ink);
  doc.text('CLO Legend', 14, y + 8);
  const legend = [['CLO-1', 'Problem Identification & Analysis'], ['CLO-2', 'Design / Development of Solution'], ['CLO-3', 'Modern Tool Usage'], ['CLO-4', 'Analysis & Interpretation'], ['CLO-5', 'Communication & Presentation']];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.muted);
  legend.forEach(([code, desc], i) => {
    const lx = 14 + (i < 3 ? 0 : pw / 2 - 14);
    const ly = y + 14 + (i < 3 ? i : i - 3) * 5.5;
    doc.setFont('helvetica', 'bold');
    doc.text(code + ':', lx, ly);
    doc.setFont('helvetica', 'normal');
    doc.text(desc, lx + 14, ly);
  });
  y += i => { };
  if (y < doc.internal.pageSize.getHeight() - 28) brandFooter(doc);
  saveDoc(doc, `${rubric.name || 'rubric'}_academic`);
}

/* ─── 4. Minimal ─── */
export function generateMinimalPdf(rubric) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  brandHeader(doc, rubric, 'minimal');
  const criteria = rubric.criteria || [];
  const totalW = criteria.reduce((s, c) => s + Number(c.weight || 0), 0);
  doc.autoTable({
    startY: 42,
    head: [['#', 'Criterion', 'Mapped CLO', 'Weight', 'Score']],
    body: criteria.map((c, i) => [i + 1, c.name || '-', c.clo || '-', `${c.weight}%`, '______']),
    foot: [[{ content: '', colSpan: 2 }, { content: `Total: ${totalW}%`, colSpan: 2, styles: { halign: 'right', fontStyle: 'bold', fontSize: 8.5, textColor: C.ink } }, { content: '______', styles: { fontStyle: 'bold', fontSize: 8.5 } }]],
    theme: 'plain',
    headStyles: { fillColor: [...C.light], textColor: [...C.ink], fontSize: 8, fontStyle: 'bold', halign: 'center', cellPadding: 2 },
    bodyStyles: { fontSize: 8, textColor: [...C.ink], cellPadding: 2 },
    footStyles: { fontSize: 8.5, textColor: [...C.ink] },
    columnStyles: { 0: { cellWidth: 10, halign: 'center' }, 1: { cellWidth: 72 }, 2: { cellWidth: 50 }, 3: { cellWidth: 22, halign: 'center' }, 4: { cellWidth: 22, halign: 'center' } },
    margin: { left: 14, right: 14 },
    tableLineColor: 226, tableLineWidth: 0.15,
  });
  brandFooter(doc);
  saveDoc(doc, `${rubric.name || 'rubric'}_minimal`);
}

/* ─── 5. Scoring Card ─── */
export function generateScoringPdf(rubric) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();
  brandHeader(doc, rubric, 'scoring');

  const criteria = rubric.criteria || [];
  const totalW = criteria.reduce((s, c) => s + Number(c.weight || 0), 0);
  let y = 46;

  criteria.forEach((c, i) => {
    const rh = 22;
    const even = i % 2 === 0;
    doc.setFillColor(...(even ? C.white : C.light));
    doc.rect(14, y, pw - 28, rh, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(14, y, pw - 28, rh, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...C.ink);
    doc.text(`${i + 1}. ${c.name || '-'}`, 20, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...C.muted);
    doc.text(c.clo ? `CLO: ${c.clo}` : '', 20, y + 15);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.muted);
    const wtX = pw / 2 + 12;
    doc.text(`Wt: ${c.weight}%`, wtX, y + 8);

    const ss = 16;
    const sx = wtX + 20;

    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.4);
    doc.rect(sx, y + 3, ss, ss, 'S');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...C.muted);
    doc.text('Score', sx + ss / 2, y + ss + 4, { align: 'center' });

    doc.setLineWidth(0.2);
    const wsx = sx + ss + 5;
    doc.rect(wsx, y + 3, ss, ss, 'S');
    doc.text('Wtd', wsx + ss / 2, y + ss + 4, { align: 'center' });

    y += rh + 2;
  });

  doc.setDrawColor(...C.blue);
  doc.setFillColor(...C.light);
  doc.rect(14, y, pw - 28, 12, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...C.navy);
  doc.text(`Total Weight: ${totalW}%  |  Final Score: ______ / 100`, pw / 2, y + 8, { align: 'center' });
  y += 18;

  doc.setDrawColor(...C.line);
  doc.line(14, y, pw - 14, y);
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.ink);
  doc.text('Rating:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.muted);
  doc.text('4 = Excellent  |  3 = Good  |  2 = Satisfactory  |  1 = Poor', 14 + 16, y);
  y += 8;
  if (y < doc.internal.pageSize.getHeight() - 28) brandFooter(doc);
  saveDoc(doc, `${rubric.name || 'rubric'}_scoring`);
}

/* ─── 6. Comprehensive (landscape) ─── */
export function generateComprehensivePdf(rubric) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });
  const pw = doc.internal.pageSize.getWidth();
  brandHeader(doc, rubric, 'comprehensive');

  const criteria = rubric.criteria || [];
  const totalW = criteria.reduce((s, c) => s + Number(c.weight || 0), 0);
  let y = 68;

  doc.setDrawColor(...C.line);
  doc.setFillColor(...C.light);
  doc.rect(14, y, pw - 28, 18, 'FD');
  doc.rect(14, y, pw - 28, 18, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  doc.text('Evaluator:', 20, y + 7);
  doc.text('________________________', 20 + 18, y + 7);
  doc.text('Date:', pw / 2 + 10, y + 7);
  doc.text('________________', pw / 2 + 26, y + 7);
  doc.text('Student:', 20, y + 14);
  doc.text('________________________', 20 + 18, y + 14);
  doc.text('Reg. No:', pw / 2 + 10, y + 14);
  doc.text('________________', pw / 2 + 26, y + 14);
  y += 24;

  doc.autoTable({
    startY: y,
    head: [['#', 'Criterion', 'CLO', 'Wt.', 'Score (1-4)', 'Wtd', 'Comments']],
    body: criteria.map((c, i) => [i + 1, c.name || '-', c.clo || '-', `${c.weight}%`, '______', '______', '____________________']),
    foot: [[{ content: '', colSpan: 3 }, { content: `Total Weight: ${totalW}%`, colSpan: 2, styles: { halign: 'right', fontStyle: 'bold', fontSize: 8, textColor: [...C.ink], cellPadding: 2 } }, { content: '______', styles: { fontStyle: 'bold', fontSize: 8 } }, { content: '', styles: { fontStyle: 'bold', fontSize: 8 } }]],
    theme: 'grid',
    headStyles: { fillColor: [...C.navy], textColor: [...C.white], fontSize: 7.5, fontStyle: 'bold', halign: 'center', cellPadding: 2 },
    bodyStyles: { fontSize: 7.5, textColor: [...C.ink], cellPadding: 2 },
    alternateRowStyles: { fillColor: [...C.light] },
    footStyles: { fillColor: 248, textColor: [...C.ink], fontSize: 8, cellPadding: 2 },
    columnStyles: { 0: { cellWidth: 10, halign: 'center' }, 1: { cellWidth: 80 }, 2: { cellWidth: 40 }, 3: { cellWidth: 16, halign: 'center' }, 4: { cellWidth: 24, halign: 'center' }, 5: { cellWidth: 20, halign: 'center' }, 6: { cellWidth: 60 } },
    margin: { left: 14, right: 14 },
    tableLineColor: 203, tableLineWidth: 0.15,
  });
  y = doc.lastAutoTable.finalY + 12;

  doc.setDrawColor(...C.line);
  doc.setFillColor(...C.light);
  doc.rect(14, y, pw - 28, 50, 'FD');
  doc.rect(14, y, pw - 28, 50, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...C.ink);
  doc.text('Evaluation Summary', 20, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.ink);
  doc.text('Total Raw Score:', 20, y + 16);
  doc.setTextColor(...C.blue);
  doc.text('______ / ' + (criteria.length * 4), 20 + 30, y + 16);

  doc.setTextColor(...C.ink);
  doc.text('Weighted Percentage:', pw / 3 + 10, y + 16);
  doc.setTextColor(...C.blue);
  doc.text('______ %', pw / 3 + 10 + 40, y + 16);

  doc.setTextColor(...C.ink);
  doc.text('Grade:', 2 * pw / 3 + 10, y + 16);
  doc.setTextColor(...C.blue);
  doc.text('______', 2 * pw / 3 + 10 + 18, y + 16);

  doc.setTextColor(...C.muted);
  doc.setFont('helvetica', 'bold');
  doc.text('Overall Remarks:', 20, y + 26);
  doc.setDrawColor(...C.line);
  doc.rect(20, y + 28, pw - 48, 16, 'S');

  y += 56;
  doc.setDrawColor(...C.line);
  doc.setFillColor(...C.light);
  doc.rect(14, y, pw - 28, 22, 'FD');
  doc.rect(14, y, pw - 28, 22, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.ink);
  doc.text('Evaluator Signature:', 20, y + 8);
  doc.text('________________________', 20 + 34, y + 8);
  doc.text('Date:', pw / 2 + 10, y + 8);
  doc.text('________________', pw / 2 + 10 + 18, y + 8);
  doc.text('HOD / Dean Signature:', 20, y + 17);
  doc.text('________________________', 20 + 38, y + 17);
  doc.text('Date:', pw / 2 + 10, y + 17);
  doc.text('________________', pw / 2 + 10 + 18, y + 17);

  if (y < doc.internal.pageSize.getHeight() - 28) brandFooter(doc);
  saveDoc(doc, `${rubric.name || 'rubric'}_comprehensive`);
}

function getShortDesc(name, level) {
  const map = [
    { k: ['problem', 'relevance', 'objective'], v: ['Clear, well-justified problem', 'Good problem context', 'Basic problem', 'Vague problem'] },
    { k: ['literature', 'review', 'background'], v: ['Comprehensive synthesis', 'Good range of sources', 'Some sources', 'Minimal sources'] },
    { k: ['methodology', 'approach', 'design'], v: ['Rigorous methodology', 'Appropriate method', 'Basic method', 'Unclear method'] },
    { k: ['outcome', 'deliverable', 'result'], v: ['Well-defined outcomes', 'Clear outcomes', 'Vague outcomes', 'No outcomes'] },
    { k: ['implement', 'tool', 'technolog'], v: ['Advanced implementation', 'Good tool usage', 'Basic tools', 'Wrong tools'] },
    { k: ['analysis', 'evaluation', 'testing'], v: ['Rigorous analysis', 'Good analysis', 'Basic analysis', 'No analysis'] },
    { k: ['presentation', 'document', 'communic'], v: ['Exceptional clarity', 'Clear & organized', 'Adequate', 'Poor'] },
  ];
  const lower = (name || '').toLowerCase();
  const match = map.find(m => m.k.some(k => lower.includes(k)));
  return (match || map[2]).v[level] || '';
}

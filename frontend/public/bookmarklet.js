javascript:(function(){
  const API_URL = prompt('FYP Portal API URL:', location.origin + '/api/sis/bookmarklet');
  if (!API_URL) return;

  const data = {};
  const q = s => { const e = document.querySelector(s); return e ? e.innerText.trim() : '' };
  const qa = s => { const e = document.querySelector(s); return e ? e.getAttribute('value') || e.innerText.trim() : '' };

  // ---- STUDENT INFO (Dashboard.aspx) ----
  data.name = q('#lbl_Name') || q('#lbl_StudentName');
  data.regNo = q('#lbl_RollNo');
  data.fatherName = q('#lbl_FatherName');
  data.program = q('#lbl_ProgramName');
  data.section = q('#lbl_CurrentSection');
  data.dateOfBirth = q('#lblDoB');
  data.cnic = q('#lblNID');
  data.advisor = q('#lblStuAdv');
  data.thesisTitle = q('#lblThesisTitle');
  data.registeredCourses = q('#lbl_RegisteredCourses');
  data.totalCourses = q('#lbl_TotalRegisteredCourses');

  // ---- OUTSTANDING FEE ----
  data.outstandingFee = q('#DataContent_lblOutStandingFee');
  data.academicDues = q('#DataContent_lblFee');
  data.boardingDues = q('#DataContent_lblBoarding');
  data.otherDues = q('#DataContent_lblOther');

  // ---- PROFILE PICTURE ----
  const img = document.querySelector('#stImg');
  if (img) {
    const src = img.getAttribute('src');
    if (src) data.profilePicture = src.startsWith('http') ? src : location.origin + (src.startsWith('/') ? '' : '/') + src;
  }

  // ---- PARSE ROLL NUMBER (CIIT/FA23-BCS-013/ATD -> FA23-BCS-013) ----
  if (data.regNo) {
    const match = data.regNo.match(/CIIT\/(.+)\/ATD/i);
    if (match) data.rollNumber = match[1];
    else data.rollNumber = data.regNo;
  }

  // ---- CGPA & COURSES (from ECharts JavaScript data) ----
  data.cgpaHistory = [];
  data.courses = [];

  // Find the gpBarChart script - it has semester CGPA data
  const html = document.documentElement.outerHTML;

  // Extract CGPA per semester from the chart data arrays
  const gpMatch = html.match(/data:\s*\[([\d\.\,\s]+)\]\s*\]\s*\};?\s*if\s*\(option[^;]+gpBarChart/);
  if (gpMatch) {
    const vals = gpMatch[1].split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    const semMatch = html.match(/'FA\d{2}'|'SP\d{2}'|'WS\d{2}'/g);
    if (semMatch && vals.length) {
      data.cgpaHistory = semMatch.map((s, i) => ({ semester: s.replace(/'/g, ''), cgpa: vals[i] || null }));
      data.cgpa = vals[vals.length - 1];
    }
  }

  // Extract course results from resultGraph data (per semester courses with grades)
  const resultMatch = html.match(/data:\s*\[(.*?)\]\s*\}\s*\]\s*\]\s*\]\s*\];/gs);
  if (resultMatch) {
    const semesterLabels = html.match(/'FA\d{2}'|'SP\d{2}'|'WS\d{2}'/g);
    const allSeries = [...html.matchAll(/data:\s*\[(.*?)\]\s*\}\s*\]/gs)];
    let semIdx = 0;
    for (const series of allSeries) {
      const courseMatches = [...series[1].matchAll(/\{value:\s*(\d+),\s*course:\s*'([^']+)',\s*grade:\s*'([^']+)'\}/g)];
      if (courseMatches.length > 0) {
        const semester = semesterLabels && semesterLabels[semIdx] ? semesterLabels[semIdx].replace(/'/g, '') : `Sem${semIdx + 1}`;
        for (const m of courseMatches) {
          data.courses.push({ semester, course: m[2], percentage: parseInt(m[1]), grade: m[3] });
        }
        semIdx++;
      }
    }
  }

  if (!data.name) {
    alert('Could not find student data. Make sure you are on the SIS dashboard page (Dashboard.aspx) after logging in.');
    return;
  }

  // ---- SHOW PREVIEW ----
  const payload = JSON.stringify(data, null, 2);
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:999999;display:flex;align-items:center;justify-content:center;';
  div.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:650px;width:92%;max-height:85vh;overflow:auto;font-family:system-ui,sans-serif;">' +
    '<h2 style="color:#1e3a8a;font-size:18px;margin:0 0 4px;">Student Data Extracted</h2>' +
    '<p style="color:#666;font-size:12px;margin:0 0 16px;">Verify your data below, then click Send.</p>' +
    '<pre style="background:#f5f5f5;padding:12px;border-radius:8px;overflow:auto;max-height:350px;white-space:pre-wrap;font-size:11px;font-family:monospace;line-height:1.4;">' + payload + '</pre>' +
    '<div style="display:flex;gap:8px;margin-top:16px;">' +
    '<button id="bs" style="flex:1;padding:10px 16px;background:#1e3a8a;color:white;border:0;border-radius:8px;font-weight:600;cursor:pointer;">Send to FYP Portal</button>' +
    '<button id="bc" style="padding:10px 16px;background:#eee;color:#333;border:0;border-radius:8px;font-weight:600;cursor:pointer;">Cancel</button></div></div>';
  document.body.appendChild(div);

  document.getElementById('bc').onclick = () => div.remove();
  document.getElementById('bs').onclick = async () => {
    const btn = document.getElementById('bs');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    try {
      const r = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const j = await r.json();
      if (j.success) {
        div.innerHTML = '<div style="background:white;border-radius:16px;padding:32px;text-align:center;font-family:system-ui,sans-serif;">' +
          '<div style="font-size:48px;margin-bottom:12px;">&#10004;&#65039;</div>' +
          '<h2 style="color:#059669;font-size:18px;margin:0 0 8px;">Synced to FYP Portal!</h2>' +
          '<p style="color:#666;font-size:13px;margin:0 0 4px;">' + (j.message || 'SIS data synced successfully.') + '</p>' +
          '<p style="color:#999;font-size:11px;">You can now close this tab and use the FYP Portal.</p>' +
          '<button onclick="this.closest(\'div\').parentNode.remove()" style="margin-top:16px;padding:10px 24px;background:#1e3a8a;color:white;border:0;border-radius:8px;font-weight:600;cursor:pointer;">Close</button></div>';
      } else throw new Error(j.message || 'Sync failed');
    } catch (e) {
      btn.disabled = false;
      btn.textContent = 'Try Again';
      alert('Error: ' + e.message);
    }
  };
})();

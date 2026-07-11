import React, { useEffect, useState, useMemo } from 'react';
import { showToast } from '../../components/AppToast';
import { Users, Plus, Trash2, Pencil, X, Check, GitBranch, Star, ArrowLeft, Save, RefreshCw, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import { EvalCommitteesSkeleton } from '../../components/Skeleton';

const PW = { 1: '50%', 2: '30%', 3: '20%' };
const PL = { 1: '1st Choice', 2: '2nd Choice', 3: '3rd Choice' };
const PC = {
  1: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', badge: 'bg-emerald-500', dot: 'bg-emerald-500' },
  2: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', badge: 'bg-blue-500', dot: 'bg-blue-500' },
  3: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', badge: 'bg-amber-500', dot: 'bg-amber-500' },
};
const FIELDS = ['Web Development', 'Game Development', 'Mobile App Development', 'Machine Learning / AI', 'Database Systems', 'Cybersecurity', 'Deployment'];

function buildVectors(faculty) {
  const wm = { 1: 0.5, 2: 0.3, 3: 0.2 };
  return faculty.map(function(f) {
    var vec = FIELDS.map(function(field) {
      var p = (f.preferences || []).find(function(x) { return x.field === field; });
      return p ? (wm[p.priority] || 0) : 0;
    });
    var norm = Math.sqrt(vec.reduce(function(s, v) { return s + v * v; }, 0)) || 1;
    return { id: f.id, name: f.name, faculty: f, vector: vec.map(function(v) { return v / norm; }), raw: vec };
  });
}

function cosSim(a, b) {
  var dot = 0;
  for (var i = 0; i < a.length; i++) { dot += a[i] * b[i]; }
  return dot;
}

function greedyCluster(items, k) {
  if (items.length === 0 || k <= 0) { return []; }
  if (k >= items.length) { return items.map(function(_, i) { return [i]; }); }
  var n = items.length;
  var dim = items[0].vector.length;
  var sm = [];
  for (var i = 0; i < n; i++) {
    sm[i] = [];
    for (var j = 0; j < n; j++) {
      sm[i][j] = i === j ? -Infinity : cosSim(items[i].vector, items[j].vector);
    }
  }
  var groups = [];
  for (var g = 0; g < k; g++) { groups[g] = []; }
  var assigned = {};
  var allIdx = [];
  for (var i = 0; i < n; i++) { allIdx.push(i); }
  for (var g = 0; g < k; g++) {
    var remaining = allIdx.filter(function(i) { return !assigned[i]; });
    if (remaining.length === 0) { break; }
    var bestSeed = remaining[0];
    var bestAvgSim = -Infinity;
    for (var si = 0; si < remaining.length; si++) {
      var seed = remaining[si];
      var totalSim = 0;
      var cnt = 0;
      for (var oi = 0; oi < remaining.length; oi++) {
        if (seed !== remaining[oi]) { totalSim += sm[seed][remaining[oi]]; cnt++; }
      }
      var avg = cnt > 0 ? totalSim / cnt : 0;
      if (avg > bestAvgSim) { bestAvgSim = avg; bestSeed = seed; }
    }
    groups[g].push(bestSeed);
    assigned[bestSeed] = true;
    var maxSize = Math.ceil(n / k);
    while (groups[g].length < maxSize) {
      var rem = allIdx.filter(function(i) { return !assigned[i]; });
      if (rem.length === 0) { break; }
      var best = rem[0];
      var bestSim = -Infinity;
      for (var ri = 0; ri < rem.length; ri++) {
        var r = rem[ri];
        var minSim = Infinity;
        for (var mi = 0; mi < groups[g].length; mi++) {
          var s = sm[r][groups[g][mi]];
          if (s < minSim) { minSim = s; }
        }
        if (minSim > bestSim) { bestSim = minSim; best = r; }
      }
      groups[g].push(best);
      assigned[best] = true;
    }
  }
  var unassigned = allIdx.filter(function(i) { return !assigned[i]; });
  for (var ui = 0; ui < unassigned.length; ui++) {
    var idx = unassigned[ui];
    var bestGroup = 0;
    var bestSim2 = -Infinity;
    for (var g2 = 0; g2 < groups.length; g2++) {
      for (var mi2 = 0; mi2 < groups[g2].length; mi2++) {
        if (sm[idx][groups[g2][mi2]] > bestSim2) { bestSim2 = sm[idx][groups[g2][mi2]]; bestGroup = g2; }
      }
    }
    groups[bestGroup].push(idx);
  }
  return groups.filter(function(g) { return g.length > 0; }).map(function(g) { return g.map(function(i) { return items[i]; }); });
}

function FacultyPrefEditor(props) {
  var faculty = props.faculty;
  var onSave = props.onSave;
  var onBack = props.onBack;
  var [prefs, setPrefs] = useState([].concat(faculty.preferences || []));
  var [saving, setSaving] = useState(false);
  function getPriority(field) {
    var p = prefs.find(function(x) { return x.field === field; });
    return p ? p.priority : null;
  }
  function handleSelect(field) {
    var cur = getPriority(field);
    if (cur) { setPrefs(prefs.filter(function(p) { return p.field !== field; })); return; }
    if (prefs.length >= 3) { showToast.error('Max 3 preferences.'); return; }
    setPrefs([].concat(prefs).concat([{ field: field, priority: prefs.length + 1 }]));
  }
  async function handleSave() {
    setSaving(true);
    try {
      await api.put('/office-assistant/faculty/' + faculty.id + '/preferences', { preferences: prefs });
      showToast.success('Preferences saved.');
      if (onSave) { onSave(faculty.id, prefs); }
    } catch (err) { showToast.error(err?.response?.data?.message || 'Failed to save.'); }
    finally { setSaving(false); }
  }
  var initials = faculty.name ? faculty.name.split(' ').filter(Boolean).slice(0, 2).map(function(w) { return w[0]; }).join('') : '?';
  return React.createElement('div', { className: 'space-y-6' },
    React.createElement('div', { className: 'border-b border-line pb-4' },
      React.createElement('button', { onClick: onBack, className: 'flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3' },
        React.createElement(ArrowLeft, { size: 14 }), ' Back to Faculty List'
      ),
      React.createElement('div', { className: 'flex items-center gap-4' },
        React.createElement('div', { className: 'w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 ' + (faculty.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500') }, initials),
        React.createElement('div', { className: 'flex-1' },
          React.createElement('h2', { className: 'text-xl font-bold text-slate-900' }, faculty.name),
          React.createElement('div', { className: 'flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap' },
            React.createElement('span', null, faculty.email),
            React.createElement('span', { className: 'font-bold px-2 py-0.5 rounded-lg border text-[10px] ' + (faculty.facultyType === 'committee' ? 'bg-purple-50 text-purple-700 border-purple-200' : faculty.facultyType === 'both' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200') }, faculty.facultyType),
            faculty.research && faculty.research.length > 0 ? React.createElement('span', { className: 'text-slate-400' }, 'Research: ' + faculty.research.join(', ')) : null
          )
        ),
        React.createElement('button', { onClick: handleSave, disabled: saving, className: 'px-5 py-2.5 bg-btn text-white rounded-xl text-xs font-bold hover:bg-btn-hover disabled:opacity-50 cursor-pointer border-0 flex items-center gap-1.5' },
          saving ? React.createElement(Loader2, { size: 12, className: 'animate-spin' }) : React.createElement(Check, { size: 12 }),
          saving ? 'Saving...' : 'Save Preferences'
        )
      )
    ),
    React.createElement('div', { className: 'bg-white rounded-2xl border border-line shadow-sm p-6' },
      React.createElement('h5', { className: 'text-xs font-bold text-slate-900 tracking-wider mb-4' }, 'Committee Preferences'),
      React.createElement('p', { className: 'text-[10px] text-slate-500 mb-5' }, 'Select up to 3 fields ranked by preference. These determine committee placement weighting (50% / 30% / 20%) during evaluation clustering.'),
      React.createElement('div', { className: 'flex items-center gap-5 mb-6 text-xs' },
        [1, 2, 3].map(function(p) {
          return React.createElement('div', { key: p, className: 'flex items-center gap-2' },
            React.createElement('div', { className: 'w-3 h-3 rounded-full ' + PC[p].dot }),
            React.createElement('span', { className: 'font-medium text-slate-600' }, PL[p] + ' \u2014 ' + PW[p])
          );
        })
      ),
      React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3' },
        FIELDS.map(function(field) {
          var priority = getPriority(field);
          var pc = priority ? PC[priority] : null;
          return React.createElement('div', { key: field, onClick: function() { handleSelect(field); }, className: 'relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ' + (pc ? pc.bg + ' ' + pc.border : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/30') },
            React.createElement('div', { className: 'flex items-start justify-between' },
              React.createElement('div', null,
                React.createElement('div', { className: 'text-sm font-bold ' + (pc ? pc.text : 'text-slate-900') }, field),
                pc ? React.createElement('div', { className: 'text-[10px] font-bold mt-1 ' + pc.text }, PL[priority] + ' \u2014 Weight: ' + PW[priority]) : null
              ),
              React.createElement('div', { className: 'w-7 h-7 rounded-full flex items-center justify-center shrink-0 ' + (pc ? pc.badge + ' text-white' : 'bg-gray-100 text-gray-400') },
                pc ? React.createElement(Check, { size: 13 }) : React.createElement('span', { className: 'text-xs font-bold' }, '+')
              )
            )
          );
        })
      ),
      React.createElement('div', { className: 'flex items-center justify-between pt-5 mt-5 border-t border-line' },
        React.createElement('span', { className: 'text-xs text-slate-400 font-medium' }, prefs.length === 0 ? 'No preferences selected' : prefs.length + '/3 selected'),
        React.createElement('div', { className: 'flex gap-2' },
          React.createElement('button', { onClick: onBack, className: 'px-4 py-2 rounded-xl text-xs font-bold text-slate-600 border border-line hover:bg-gray-50 cursor-pointer' }, 'Cancel'),
          React.createElement('button', { onClick: handleSave, disabled: saving || prefs.length === 0, className: 'px-5 py-2 bg-btn text-white rounded-xl text-xs font-bold hover:bg-btn-hover disabled:opacity-50 cursor-pointer flex items-center gap-1.5' },
            saving && React.createElement(Loader2, { size: 12, className: 'animate-spin' }), ' Save Preferences'
          )
        )
      )
    ),
    React.createElement('div', { className: 'bg-white rounded-2xl border border-line shadow-sm p-6' },
      React.createElement('h5', { className: 'text-xs font-bold text-slate-900 tracking-wider mb-3' }, 'Research Areas'),
      faculty.research && faculty.research.length > 0
        ? React.createElement('div', { className: 'flex flex-wrap gap-2' }, faculty.research.map(function(tag, i) {
            return React.createElement('span', { key: i, className: 'text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100' }, tag);
          }))
        : React.createElement('p', { className: 'text-xs text-slate-400' }, 'No research areas tagged.')
    )
  );
}

var TABS = [
  { key: 'faculty', label: 'Faculty & Preferences' },
  { key: 'formation', label: 'Committee Formation' },
  { key: 'manage', label: 'Manage Committees' },
];

export default function AssistantEvalCommittees() {
  var [tab, setTab] = useState('faculty');
  var [loading, setLoading] = useState(true);
  var [committees, setCommittees] = useState([]);
  var [faculty, setFaculty] = useState([]);
  var [submitting, setSubmitting] = useState(false);
  var [membersPerComm, setMembersPerComm] = useState(3);
  var [suggestedGroups, setSuggestedGroups] = useState(null);
  var [groupConfigs, setGroupConfigs] = useState({});
  var [editingFaculty, setEditingFaculty] = useState(null);
  var [editCommittee, setEditCommittee] = useState(null);
  var [facPage, setFacPage] = useState(1);
  var [grpPage, setGrpPage] = useState(1);
  var perPage = 10;

  function loadData() {
    setLoading(true);
    Promise.all([
      api.get('/office-assistant/eval-committee'),
      api.get('/office-assistant/faculty?limit=1000')
    ]).then(function(r) {
      setCommittees(r[0].data?.data || []);
      setFaculty(r[1].data?.data || []);
    }).catch(function() {}).finally(function() { setLoading(false); });
  }

  useEffect(function() { loadData(); }, []);

  var facultyVectors = useMemo(function() { return buildVectors(faculty); }, [faculty]);

  if (editingFaculty) {
    return React.createElement(FacultyPrefEditor, {
      faculty: editingFaculty,
      onSave: function(id, prefs) {
        setFaculty(faculty.map(function(f) { return f.id === id ? Object.assign({}, f, { preferences: prefs }) : f; }));
      },
      onBack: function() { setEditingFaculty(null); }
    });
  }

  function handleCluster() {
    if (facultyVectors.length === 0) { showToast.error('No faculty available.'); return; }
    var assignedIds = {};
    committees.forEach(function(c) {
      (c.members || []).forEach(function(m) { assignedIds[typeof m === 'string' ? m : (m.id || m._id)] = true; });
    });
    var available = facultyVectors.filter(function(v) { return !assignedIds[v.id]; });
    if (available.length === 0) { showToast.error('All faculty are already assigned to committees.'); return; }
    var withPrefs = available.filter(function(v) { return (v.faculty.preferences || []).length > 0; });
    if (withPrefs.length < 2) { showToast.error('At least 2 unassigned faculty need preferences set for clustering.'); return; }
    var k = Math.max(1, Math.ceil(available.length / membersPerComm));
    var groups = greedyCluster(available, k);
    setGrpPage(1);
    setSuggestedGroups(groups);
    var configs = {};
    groups.forEach(function(g, gi) {
      configs[gi] = { name: 'Evaluation Committee ' + (gi + 1), head: g[0]?.id || '' };
    });
    setGroupConfigs(configs);
    showToast.success('Formed ' + groups.length + ' suggested groups.');
  }

  async function handleCreateComm(members, head, name, milestone, groupIdx) {
    if (!name || !head || members.length === 0) { showToast.error('Fill in all fields.'); return; }
    setSubmitting(true);
    try {
      await api.post('/committees', { name: name, head: head, members: members, type: 'evaluation', milestone: milestone });
      showToast.success('Committee created!');
      setSuggestedGroups(null);
      setGroupConfigs({});
      loadData();
    } catch (err) { showToast.error(err?.response?.data?.message || 'Failed.'); }
    finally { setSubmitting(false); }
  }

  async function handleUpdateComm(id, data) {
    try {
      await api.put('/committees/' + id, data);
      showToast.success('Committee updated.');
      setEditCommittee(null);
      loadData();
    } catch (err) { showToast.error(err?.response?.data?.message || 'Failed.'); }
  }

  async function handleDeleteComm(id) {
    if (!window.confirm('Delete this committee permanently?')) return;
    try {
      await api.delete('/committees/' + id);
      showToast.success('Committee deleted.');
      loadData();
    } catch (err) { showToast.error('Failed to delete.'); }
  }

  function renderFacultyTab() {
    var totalPages = Math.ceil(faculty.length / perPage) || 1;
    var paged = faculty.slice((facPage - 1) * perPage, facPage * perPage);
    return React.createElement('div', { className: 'space-y-4' },
      React.createElement('p', { className: 'text-xs text-slate-500' }, faculty.length + ' total faculty'),
      React.createElement('div', { className: 'bg-white rounded-2xl border border-line shadow-sm overflow-hidden' },
        React.createElement('div', { className: 'overflow-x-auto' },
          React.createElement('table', { className: 'w-full text-left' },
            React.createElement('thead', null,
              React.createElement('tr', { className: 'bg-slate-50 border-b border-line text-[10px] font-bold text-slate-500 uppercase tracking-wider' },
                React.createElement('th', { className: 'py-3 px-4' }, 'Faculty'),
                React.createElement('th', { className: 'py-3 px-4' }, '1st Choice (50%)'),
                React.createElement('th', { className: 'py-3 px-4' }, '2nd Choice (30%)'),
                React.createElement('th', { className: 'py-3 px-4' }, '3rd Choice (20%)'),
                React.createElement('th', { className: 'py-3 px-4 text-right' }, 'Status')
              )
            ),
            React.createElement('tbody', { className: 'divide-y divide-line text-sm' },
              paged.map(function(f) {
                var prefs = f.preferences || [];
                var p1 = prefs.find(function(x) { return x.priority == 1; });
                var p2 = prefs.find(function(x) { return x.priority == 2; });
                var p3 = prefs.find(function(x) { return x.priority == 3; });
                var has = prefs.length > 0;
                var initials = f.name ? f.name.split(' ').filter(Boolean).slice(0, 2).map(function(w) { return w[0]; }).join('') : '?';
                return React.createElement('tr', { key: f.id, onClick: function() { setEditingFaculty(f); }, className: 'hover:bg-slate-50 transition-colors cursor-pointer' },
                  React.createElement('td', { className: 'py-3 px-4' },
                    React.createElement('div', { className: 'flex items-center gap-2.5' },
                      React.createElement('div', { className: 'w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold shrink-0 ' + (f.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500') }, initials),
                      React.createElement('span', { className: 'text-xs font-bold text-slate-900' }, f.name)
                    )
                  ),
                  React.createElement('td', { className: 'px-4' }, p1 ? React.createElement('span', { className: 'text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200' }, p1.field) : React.createElement('span', { className: 'text-[10px] text-slate-400 italic' }, 'Not set')),
                  React.createElement('td', { className: 'px-4' }, p2 ? React.createElement('span', { className: 'text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200' }, p2.field) : React.createElement('span', { className: 'text-[10px] text-slate-400 italic' }, 'Not set')),
                  React.createElement('td', { className: 'px-4' }, p3 ? React.createElement('span', { className: 'text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200' }, p3.field) : React.createElement('span', { className: 'text-[10px] text-slate-400 italic' }, 'Not set')),
                  React.createElement('td', { className: 'px-4 text-right' },
                    React.createElement('span', { className: 'text-[10px] font-bold flex items-center justify-end gap-1 ' + (has ? 'text-emerald-600' : 'text-amber-600') },
                      has ? React.createElement(React.Fragment, null, React.createElement(Check, { size: 11 }), ' Set') : React.createElement(React.Fragment, null, React.createElement(Pencil, { size: 11 }), ' Configure'),
                      React.createElement(ChevronRight, { size: 11 })
                    )
                  )
                );
              })
            )
          )
        )
      ),
      totalPages > 1 ? React.createElement('div', { className: 'flex items-center justify-between' },
        React.createElement('span', { className: 'text-xs text-slate-400' }, faculty.length + ' total'),
        React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement('button', { onClick: function() { setFacPage(Math.max(1, facPage - 1)); }, disabled: facPage <= 1, className: 'p-1.5 rounded-lg border border-line text-slate-500 hover:bg-white disabled:opacity-30 cursor-pointer text-xs' }, 'Prev'),
          React.createElement('span', { className: 'text-xs font-bold text-slate-500' }, facPage + ' / ' + totalPages),
          React.createElement('button', { onClick: function() { setFacPage(Math.min(totalPages, facPage + 1)); }, disabled: facPage >= totalPages, className: 'p-1.5 rounded-lg border border-line text-slate-500 hover:bg-white disabled:opacity-30 cursor-pointer text-xs' }, 'Next')
        )
      ) : null
    );
  }

  function renderFormationTab() {
    var grpWidgets = [];
    if (suggestedGroups) {
      var paged = suggestedGroups.slice((grpPage - 1) * perPage, grpPage * perPage);
      var totalGrpPages = Math.ceil(suggestedGroups.length / perPage);
      for (var gi = 0; gi < paged.length; gi++) {
        var group = paged[gi];
        var realIdx = (grpPage - 1) * perPage + gi;
        var cfg = groupConfigs[realIdx] || { name: '', head: '', milestone: '30' };
        var members = [];
        for (var mi = 0; mi < group.length; mi++) {
          var m = group[mi];
          var prefs = m.faculty.preferences || [];
          var shared = [];
          if (mi > 0) {
            for (var fi = 0; fi < FIELDS.length; fi++) {
              var field = FIELDS[fi];
              var inThis = prefs.some(function(p) { return p.field === field; });
              var inOthers = false;
              for (var oi = 0; oi < mi; oi++) {
                if ((group[oi].faculty.preferences || []).some(function(p) { return p.field === field; })) { inOthers = true; break; }
              }
              if (inThis && inOthers) { shared.push(field); }
            }
          }
          var badgeEls = [];
          if (prefs.length > 0) {
            var sorted = prefs.slice().sort(function(a, b) { return a.priority - b.priority; });
            for (var pi = 0; pi < sorted.length; pi++) {
              var p = sorted[pi];
              var pc2 = PC[p.priority];
              badgeEls.push(React.createElement('span', { key: pi, className: 'text-[9px] font-bold px-1.5 py-0.5 rounded border ' + (pc2 ? pc2.bg + ' ' + pc2.text + ' ' + pc2.border : '') }, (p.field || '').slice(0, 10)));
            }
          }
          members.push(React.createElement('div', { key: m.id, className: 'p-2.5 rounded-xl border border-line' },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('div', { className: 'flex items-center gap-2.5' },
                React.createElement('div', { className: 'w-6 h-6 rounded-md bg-slate-100 text-slate-600 text-[8px] font-bold flex items-center justify-center' }, m.name ? m.name.charAt(0) : '?'),
                React.createElement('span', { className: 'text-xs font-bold text-slate-900' }, m.name)
              ),
              badgeEls.length > 0 ? React.createElement('div', { className: 'flex gap-1' }, badgeEls) : React.createElement('span', { className: 'text-[9px] text-slate-400 italic' }, 'No prefs')
            ),
            shared.length > 0 && mi > 0 ? React.createElement('div', { className: 'mt-1.5 flex items-center gap-1.5 text-[9px] text-indigo-600' },
              React.createElement(Star, { size: 9, className: 'fill-indigo-300 text-indigo-300' }),
              React.createElement('span', null, 'Shared: ' + shared.join(', '))
            ) : null
          ));
        }
        grpWidgets.push(React.createElement('div', { key: realIdx, className: 'bg-white rounded-2xl border border-line shadow-sm overflow-hidden' },
          React.createElement('div', { className: 'px-5 py-4 bg-slate-50 border-b border-line flex items-center justify-between' },
            React.createElement('h4', { className: 'text-xs font-bold text-slate-900 flex items-center gap-1.5' },
              React.createElement(Users, { size: 13 }),
              ' Group ' + (realIdx + 1),
              React.createElement('span', { className: 'text-slate-400 font-medium' }, '(' + group.length + ' members)')
            )
          ),
          React.createElement('div', { className: 'px-5 py-3 border-b border-line bg-white grid grid-cols-2 gap-3' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-[9px] font-bold text-slate-500 mb-1' }, 'Committee Name'),
              React.createElement('input', { type: 'text', value: cfg.name, onChange: function(e) { var g = {}; for (var k in groupConfigs) { g[k] = groupConfigs[k]; } g[realIdx] = Object.assign({}, cfg, { name: e.target.value }); setGroupConfigs(g); }, className: 'w-full bg-white border border-line rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none focus:border-blue-500' })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-[9px] font-bold text-slate-500 mb-1' }, 'Head'),
              React.createElement('select', { value: cfg.head, onChange: function(e) { var g = {}; for (var k in groupConfigs) { g[k] = groupConfigs[k]; } g[realIdx] = Object.assign({}, cfg, { head: e.target.value }); setGroupConfigs(g); }, className: 'w-full bg-white border border-line rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none focus:border-blue-500 cursor-pointer' },
                React.createElement('option', { value: '' }, 'Select...'),
                group.map(function(m) { return React.createElement('option', { key: m.id, value: m.id }, m.name); })
              )
            )
          ),
          React.createElement('div', { className: 'p-4 space-y-3' }, members),
          React.createElement('div', { className: 'px-5 py-3 bg-slate-50 border-t border-line flex justify-end' },
            React.createElement('button', { onClick: function() {
              var c = groupConfigs[realIdx];
              if (!c || !c.name || !c.head) { showToast.error('Set name and head first.'); return; }
              handleCreateComm(group.map(function(m) { return m.id; }), c.head, c.name, c.milestone, realIdx);
            }, disabled: submitting, className: 'flex items-center gap-1.5 px-4 py-2 bg-btn text-white rounded-lg text-xs font-bold hover:bg-btn-hover disabled:opacity-50 cursor-pointer border-0' },
              React.createElement(Save, { size: 12 }), ' Save Committee'
            )
          )
        ));
      }
    }
    return React.createElement('div', { className: 'space-y-5' },
      React.createElement('div', { className: 'flex items-center gap-4 flex-wrap' },
        React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement('span', { className: 'text-xs font-bold text-slate-600' }, 'Members per committee:'),
          React.createElement('input', { type: 'number', min: 1, value: membersPerComm, onChange: function(e) { var v = parseInt(e.target.value); if (isNaN(v) || v < 1) { v = 1; } if (v > 50) { v = 50; } setMembersPerComm(v); }, className: 'w-20 bg-white border border-line rounded-lg px-2 py-1.5 text-sm font-bold text-center outline-none focus:border-blue-500' })
        ),
        React.createElement('button', { onClick: handleCluster, className: 'flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all cursor-pointer border-0' },
          React.createElement(GitBranch, { size: 13 }), ' Suggest Groups'
        ),
        suggestedGroups ? React.createElement('button', { onClick: function() { setSuggestedGroups(null); }, className: 'flex items-center gap-1.5 px-4 py-2 bg-white text-slate-600 rounded-xl text-xs font-bold border border-line hover:bg-slate-50 transition-all cursor-pointer' },
          React.createElement(RefreshCw, { size: 13 }), ' Clear'
        ) : null,
        React.createElement('span', { className: 'text-xs text-slate-400 ml-auto' }, facultyVectors.length + ' faculty')
      ),
      suggestedGroups ? React.createElement('div', { className: 'space-y-4' },
        React.createElement('div', { className: 'flex items-center justify-between' },
          React.createElement('p', { className: 'text-xs text-slate-500' }, suggestedGroups.length + ' suggested groups'),
          React.createElement('button', { onClick: async function() {
            for (var gi2 = 0; gi2 < suggestedGroups.length; gi2++) {
              var c2 = groupConfigs[gi2];
              if (!c2 || !c2.name || !c2.head) { showToast.error('Group ' + (gi2 + 1) + ' missing name or head.'); return; }
              try { await api.post('/committees', { name: c2.name, head: c2.head, members: suggestedGroups[gi2].map(function(m) { return m.id; }), type: 'evaluation', milestone: c2.milestone }); }
              catch (e) { showToast.error('Failed to create ' + c2.name); return; }
            }
            showToast.success('All committees saved!');
            setSuggestedGroups(null);
            loadData();
          }, className: 'flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer border-0' },
            React.createElement(Save, { size: 13 }), ' Save All Committees'
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-4' }, grpWidgets),
        suggestedGroups.length > perPage ? React.createElement('div', { className: 'flex items-center justify-between pt-2' },
          React.createElement('span', { className: 'text-xs text-slate-400' }, suggestedGroups.length + ' groups'),
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement('button', { onClick: function() { setGrpPage(Math.max(1, grpPage - 1)); }, disabled: grpPage <= 1, className: 'p-1.5 rounded-lg border border-line text-slate-500 hover:bg-white disabled:opacity-30 cursor-pointer text-xs' }, 'Prev'),
            React.createElement('span', { className: 'text-xs font-bold text-slate-500' }, grpPage + ' / ' + totalGrpPages),
            React.createElement('button', { onClick: function() { setGrpPage(Math.min(totalGrpPages, grpPage + 1)); }, disabled: grpPage >= totalGrpPages, className: 'p-1.5 rounded-lg border border-line text-slate-500 hover:bg-white disabled:opacity-30 cursor-pointer text-xs' }, 'Next')
          )
        ) : null
      ) : React.createElement('div', { className: 'bg-white rounded-2xl border border-line shadow-sm p-10 text-center text-slate-400' },
        React.createElement(GitBranch, { className: 'w-10 h-10 mx-auto mb-3 opacity-50' }),
        React.createElement('p', { className: 'text-sm font-bold' }, 'Set members per committee and click "Suggest Groups"'),
        React.createElement('p', { className: 'text-xs mt-1' }, 'Faculty with similar preferences are clustered together.')
      )
    );
  }

  function renderManageTab() {
    return React.createElement('div', { className: 'space-y-4' },
      React.createElement('div', { className: 'flex items-center justify-between' },
        React.createElement('p', { className: 'text-xs text-slate-500' }, committees.length + ' evaluation committee' + (committees.length !== 1 ? 's' : '')),
        React.createElement('button', { onClick: function() { setEditCommittee({ name: '', head: '', members: [] }); }, className: 'flex items-center gap-1.5 px-4 py-2 bg-btn text-white rounded-xl text-xs font-bold hover:bg-btn-hover transition-all cursor-pointer border-0' },
          React.createElement(Plus, { size: 13 }), ' New Committee'
        )
      ),
      editCommittee ? React.createElement('div', { className: 'bg-white rounded-2xl border border-line shadow-sm p-5' },
        React.createElement('h4', { className: 'text-xs font-bold text-slate-900 mb-4' }, editCommittee._id ? 'Edit Committee' : 'Create New Committee'),
        React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-[10px] font-bold text-slate-500 mb-1' }, 'Name'),
            React.createElement('input', { type: 'text', value: editCommittee.name, onChange: function(e) { setEditCommittee(Object.assign({}, editCommittee, { name: e.target.value })); }, className: 'w-full bg-white border border-line rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500', placeholder: 'e.g. FEC-FYP1-A' })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-[10px] font-bold text-slate-500 mb-1' }, 'Head'),
            React.createElement('select', { value: editCommittee.head, onChange: function(e) { setEditCommittee(Object.assign({}, editCommittee, { head: e.target.value })); }, className: 'w-full bg-white border border-line rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 cursor-pointer' },
              React.createElement('option', { value: '' }, 'Select head...'),
              faculty.map(function(f) { return React.createElement('option', { key: f.id, value: f.id }, f.name); })
            )
          )
        ),
        React.createElement('div', { className: 'mb-4' },
          React.createElement('label', { className: 'block text-[10px] font-bold text-slate-500 mb-1' }, 'Members'),
          React.createElement('div', { className: 'flex flex-wrap gap-2 mb-2' },
            (editCommittee.members || []).map(function(mId) {
              var f2 = faculty.find(function(f) { return f.id === mId; });
              return f2 ? React.createElement('span', { key: mId, className: 'flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-lg border border-blue-200' },
                f2.name,
                React.createElement('button', { onClick: function() { setEditCommittee(Object.assign({}, editCommittee, { members: editCommittee.members.filter(function(id) { return id !== mId; }) })); }, className: 'bg-transparent border-0 p-0 text-blue-400 hover:text-red-500 cursor-pointer text-xs' }, React.createElement(X, { size: 11 }))
              ) : null;
            })
          ),
          React.createElement('select', { value: '', onChange: function(e) { if (e.target.value && !editCommittee.members.includes(e.target.value)) { setEditCommittee(Object.assign({}, editCommittee, { members: [].concat(editCommittee.members).concat([e.target.value]) })); } }, className: 'w-full bg-white border border-line rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 cursor-pointer' },
            React.createElement('option', { value: '' }, 'Add member...'),
            faculty.filter(function(f) { return !(editCommittee.members || []).includes(f.id); }).map(function(f) { return React.createElement('option', { key: f.id, value: f.id }, f.name + ' (' + f.facultyType + ')'); })
          )
        ),
          React.createElement('div', { className: 'flex justify-end gap-3' },
            editCommittee._id ? React.createElement('button', { onClick: function() { if (window.confirm('Delete this committee permanently?')) { handleDeleteComm(editCommittee._id); } }, className: 'px-4 py-2 rounded-xl text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 cursor-pointer flex items-center gap-1.5' }, React.createElement(Trash2, { size: 12 }), ' Delete') : null,
            React.createElement('button', { onClick: function() { setEditCommittee(null); }, className: 'px-4 py-2 rounded-xl text-xs font-bold text-slate-600 border border-line hover:bg-gray-50 cursor-pointer' }, 'Cancel'),
            React.createElement('button', { onClick: async function() {
              if (editCommittee._id) {
                await handleUpdateComm(editCommittee._id, { name: editCommittee.name, head: editCommittee.head, members: editCommittee.members });
              } else {
                await handleCreateComm(editCommittee.members, editCommittee.head, editCommittee.name, '');
              }
              setEditCommittee(null);
            }, disabled: submitting || !editCommittee.name || !editCommittee.head || editCommittee.members.length === 0, className: 'px-5 py-2 bg-btn text-white rounded-xl text-xs font-bold hover:bg-btn-hover disabled:opacity-50 cursor-pointer' },
              editCommittee._id ? 'Update' : 'Create'
            )
          )
        )
      : null,
      React.createElement('div', { className: 'bg-white rounded-2xl border border-line shadow-sm overflow-hidden' },
        React.createElement('div', { className: 'overflow-x-auto' },
          React.createElement('table', { className: 'w-full text-left' },
            React.createElement('thead', null,
              React.createElement('tr', { className: 'bg-slate-50 border-b border-line text-[10px] font-bold text-slate-500 uppercase tracking-wider' },
                React.createElement('th', { className: 'py-3 px-4' }, 'Name'),
                React.createElement('th', { className: 'py-3 px-4' }, 'Head'),
                React.createElement('th', { className: 'py-3 px-4' }, 'Members'),
                React.createElement('th', { className: 'py-3 px-4' }, 'Status'),
                React.createElement('th', { className: 'py-3 px-4 text-right' }, 'Actions')
              )
            ),
            React.createElement('tbody', { className: 'divide-y divide-line text-sm' },
              committees.length === 0
                ? React.createElement('tr', null, React.createElement('td', { colSpan: 5, className: 'py-12 text-center text-slate-400 text-xs' }, 'No evaluation committees configured yet.'))
                : committees.map(function(c) {
                    return React.createElement('tr', { key: c.id, className: 'hover:bg-slate-50 transition-colors' },
                      React.createElement('td', { className: 'py-3 px-4 font-bold text-slate-900 text-xs' }, c.name),
                      React.createElement('td', { className: 'py-3 px-4 text-xs text-slate-600' }, c.head || 'N/A'),
                      React.createElement('td', { className: 'py-3 px-4' },
                        React.createElement('div', { className: 'flex flex-wrap gap-1' },
                          (c.members || []).map(function(m, i) {
                            return React.createElement('span', { key: i, className: 'text-[9px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200' }, typeof m === 'string' ? m : m.name);
                          })
                        )
                      ),
                      React.createElement('td', { className: 'py-3 px-4' },
                        React.createElement('span', { className: 'text-[9px] font-bold px-2 py-0.5 rounded-lg border ' + (c.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200') }, c.status === 'active' ? 'Active' : c.status)
                      ),
                      React.createElement('td', { className: 'py-3 px-4 text-right' },
                        React.createElement('div', { className: 'flex items-center justify-end gap-1' },
                          React.createElement('button', { onClick: function() { setEditCommittee({ _id: c.id, name: c.name, head: c.headId || '', members: (c.members || []).map(function(m) { return m.id || m._id || m; }).filter(Boolean) }); }, className: 'p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 cursor-pointer border-0' }, React.createElement(Pencil, { size: 12 })),
                          React.createElement('button', { onClick: function() { handleDeleteComm(c.id); }, className: 'p-1.5 rounded-lg hover:bg-red-50 text-red-500 cursor-pointer border-0' }, React.createElement(Trash2, { size: 12 }))
                        )
                      )
                    );
                  })
            )
          )
        )
      )
    );
  }

  if (loading) return React.createElement(EvalCommitteesSkeleton, null);

  return React.createElement('div', { className: 'space-y-6' },
    React.createElement('div', { className: 'border-b border-line pb-4' },
      React.createElement('h2', { className: 'text-xl font-bold text-slate-900' }, 'Evaluation Committee Management'),
      React.createElement('p', { className: 'text-xs text-slate-500 mt-0.5 font-medium' }, 'View faculty preferences, form committees using clustering, and manage evaluation boards')
    ),
    React.createElement('div', { className: 'flex gap-2 flex-wrap' },
      TABS.map(function(t) {
        return React.createElement('button', { key: t.key, onClick: function() { setTab(t.key); }, className: 'px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ' + (tab === t.key ? 'bg-btn text-white border-btn' : 'bg-white text-slate-600 border-gray-200 hover:bg-blue-50') }, t.label);
      })
    ),
    tab === 'faculty' ? renderFacultyTab() : null,
    tab === 'formation' ? renderFormationTab() : null,
    tab === 'manage' ? renderManageTab() : null
  );
}
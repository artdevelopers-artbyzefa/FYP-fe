import React, { useEffect, useState, useMemo } from 'react';
import { showToast } from '../../components/AppToast';
import { Users, Loader2, Check, X, ArrowLeft, ChevronRight, Search, BookOpen, Star } from 'lucide-react';
import api from '../../services/api';

var PRIORITY_COLORS = {
  1: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-500' },
  2: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-500' },
  3: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-500' },
};

function scoreGroupForCommittee(groupPrefs, committeeMembers, allFaculty) {
  if (!groupPrefs || groupPrefs.length === 0) { return 0; }
  var weightMap = { 1: 0.5, 2: 0.3, 3: 0.2 };
  var totalScore = 0;
  for (var gi = 0; gi < groupPrefs.length; gi++) {
    var gp = groupPrefs[gi];
    var field = gp.field;
    var weight = weightMap[gp.priority] || 0;
    var fieldScore = 0;
    for (var mi = 0; mi < committeeMembers.length; mi++) {
      var cmId = typeof committeeMembers[mi] === 'string' ? committeeMembers[mi] : (committeeMembers[mi].id || committeeMembers[mi]._id);
      var fac = null;
      for (var fi = 0; fi < allFaculty.length; fi++) {
        if (allFaculty[fi].id === cmId) { fac = allFaculty[fi]; break; }
      }
      if (fac && fac.preferences) {
        for (var pi = 0; pi < fac.preferences.length; pi++) {
          if (fac.preferences[pi].field === field) {
            fieldScore += weightMap[fac.preferences[pi].priority] || 0;
          }
        }
      }
    }
    totalScore += weight * (1 + fieldScore);
  }
  return totalScore;
}

export default function InchargeCommitteeOversight() {
  var [loading, setLoading] = useState(true);
  var [groups, setGroups] = useState([]);
  var [committees, setCommittees] = useState([]);
  var [faculty, setFaculty] = useState([]);
  var [savingId, setSavingId] = useState(null);
  var [search, setSearch] = useState('');
  var [filter, setFilter] = useState('assigned');

  function loadData() {
    setLoading(true);
    Promise.all([
      api.get('/groups'),
      api.get('/office-assistant/eval-committee'),
      api.get('/office-assistant/faculty?limit=1000')
    ]).then(function(r) {
      setGroups(r[0].data?.data || []);
      setCommittees(r[1].data?.data || []);
      setFaculty(r[2].data?.data || []);
    }).catch(function() {}).finally(function() { setLoading(false); });
  }

  useEffect(function() { loadData(); }, []);

  var assignments = useMemo(function() {
    if (!groups.length || !committees.length || !faculty.length) { return []; }
    var result = [];
    for (var gi = 0; gi < groups.length; gi++) {
      var g = groups[gi];
      var groupPrefs = g.preferences || [];
      var supervisorId = g.supervisor ? (g.supervisor._id || g.supervisor.id) : null;
      var scored = [];
      for (var ci = 0; ci < committees.length; ci++) {
        var c = committees[ci];
        var cmIds = (c.members || []).map(function(m) { return m.id || m._id || m; });
        var hasConflict = supervisorId && cmIds.indexOf(supervisorId) !== -1;
        var score = scoreGroupForCommittee(groupPrefs, c.members, faculty);
        scored.push({ committeeIdx: ci, committeeName: c.name, committeeId: c.id, score: score, hasConflict: hasConflict });
      }
      scored.sort(function(a, b) { return b.score - a.score; });
      var best = null;
      for (var si = 0; si < scored.length; si++) {
        if (!scored[si].hasConflict) { best = scored[si]; break; }
      }
      if (!best && scored.length > 0) { best = scored[0]; }
      var secondBest = null;
      var foundBest = false;
      for (var si2 = 0; si2 < scored.length; si2++) {
        if (scored[si2].hasConflict && !foundBest) { continue; }
        if (!foundBest && !scored[si2].hasConflict) { foundBest = true; continue; }
        if (foundBest && !scored[si2].hasConflict) { secondBest = scored[si2]; break; }
      }
      var currentCommitteeId = g.committeeMembers && g.committeeMembers.length > 0
        ? (typeof g.committeeMembers[0] === 'string' ? g.committeeMembers[0] : (g.committeeMembers[0]._id || g.committeeMembers[0].id))
        : null;
      result.push({
        group: g,
        scored: scored,
        best: best,
        secondBest: secondBest,
        supervisorId: supervisorId,
        supervisorName: g.supervisor ? g.supervisor.name : 'N/A',
        currentCommitteeId: currentCommitteeId
      });
    }
    return result;
  }, [groups, committees, faculty]);

  var filtered = useMemo(function() {
    var q = search.toLowerCase();
    return assignments.filter(function(a) {
      if (filter === 'assigned') { if (!a.currentCommitteeId) { return false; } }
      else if (filter === 'pending') { if (a.currentCommitteeId) { return false; } }
      if (!search) { return true; }
      var name = (a.group.name || a.group.fypTitle || '').toLowerCase();
      var members = (a.group.members || []).map(function(m) { return (m.user ? m.user.name : '') + ' ' + (m.regNo || ''); }).join(' ').toLowerCase();
      return name.indexOf(q) !== -1 || members.indexOf(q) !== -1;
    });
  }, [assignments, search, filter]);

  async function handleAssign(groupId, committeeId) {
    setSavingId(groupId);
    try {
      await api.put('/groups/' + groupId + '/committee', { committeeMembers: [committeeId] });
      showToast.success('Committee assigned.');
      loadData();
    } catch (err) { showToast.error('Failed to assign.'); }
    finally { setSavingId(null); }
  }

  async function handleRemoveAssignment(groupId) {
    setSavingId(groupId);
    try {
      await api.put('/groups/' + groupId + '/committee', { committeeMembers: [] });
      showToast.success('Assignment removed.');
      loadData();
    } catch (err) { showToast.error('Failed to remove.'); }
    finally { setSavingId(null); }
  }

  if (loading) {
    return React.createElement('div', { className: 'flex items-center justify-center py-20' },
      React.createElement(Loader2, { className: 'w-6 h-6 animate-spin text-blue-600' }),
      React.createElement('span', { className: 'ml-2 text-sm text-slate-500 font-medium' }, 'Loading...')
    );
  }

  return React.createElement('div', { className: 'space-y-6' },
    React.createElement('div', { className: 'border-b border-line pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4' },
      React.createElement('div', null,
        React.createElement('h2', { className: 'text-xl font-bold text-slate-900' }, 'Committee Oversight & Student Assignment'),
        React.createElement('p', { className: 'text-xs text-slate-500 mt-0.5 font-medium' }, 'Assign student groups to evaluation committees. Supervisors cannot evaluate their own students.')
      ),
      React.createElement('div', { className: 'flex items-center gap-3 w-full sm:w-auto' },
        React.createElement('div', { className: 'flex gap-1.5' },
          [
            { key: 'assigned', label: 'Assigned' },
            { key: 'pending', label: 'Pending Review' },
            { key: 'all', label: 'All' },
          ].map(function(t) {
            return React.createElement('button', { key: t.key, onClick: function() { setFilter(t.key); }, className: 'px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ' + (filter === t.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-gray-200 hover:bg-blue-50') }, t.label);
          })
        ),
        React.createElement('div', { className: 'relative w-full sm:w-56' },
        React.createElement(Search, { size: 14, className: 'absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' }),
        React.createElement('input', { type: 'text', value: search, onChange: function(e) { setSearch(e.target.value); }, placeholder: 'Search groups...', className: 'w-full pl-9 pr-3 py-2 bg-white border border-line rounded-xl text-sm outline-none focus:border-blue-500' })
      )
    ),
    ),
    React.createElement('div', { className: 'bg-white rounded-2xl border border-line shadow-sm overflow-hidden' },
      React.createElement('div', { className: 'px-5 py-3 bg-slate-50 border-b border-line flex items-center justify-between' },
        React.createElement('h3', { className: 'text-xs font-bold text-slate-900 flex items-center gap-2' },
          React.createElement(Users, { size: 14 }), 'Student Groups (' + filtered.length + ')'
        ),
        React.createElement('span', { className: 'text-[10px] text-slate-400' }, committees.length + ' committees available')
      ),
      React.createElement('div', { className: 'overflow-x-auto' },
        React.createElement('table', { className: 'w-full text-left' },
          React.createElement('thead', null,
            React.createElement('tr', { className: 'bg-slate-50 border-b border-line text-[10px] font-bold text-slate-500 uppercase tracking-wider' },
              React.createElement('th', { className: 'py-3 px-4' }, 'Group'),
              React.createElement('th', { className: 'py-3 px-4' }, 'Supervisor'),
              React.createElement('th', { className: 'py-3 px-4' }, 'Preferences'),
              React.createElement('th', { className: 'py-3 px-4' }, 'Suggested Committee'),
              React.createElement('th', { className: 'py-3 px-4' }, 'Score'),
              React.createElement('th', { className: 'py-3 px-4 text-right' }, 'Actions')
            )
          ),
          React.createElement('tbody', { className: 'divide-y divide-line text-sm' },
            filtered.length === 0
              ? React.createElement('tr', null, React.createElement('td', { colSpan: 6, className: 'py-12 text-center text-slate-400' },
                  React.createElement(BookOpen, { className: 'w-8 h-8 mx-auto mb-2 opacity-50' }),
                  React.createElement('p', { className: 'text-sm font-bold' }, 'No groups found')
                ))
              : filtered.map(function(a) {
                  var g = a.group;
                  var gName = g.name || g.fypTitle || 'Untitled Group';
                  var groupPrefs = g.preferences || [];
                  var currentAssigned = a.currentCommitteeId;
                  var assignedCommitteeName = '';
                  if (currentAssigned) {
                    for (var ci = 0; ci < committees.length; ci++) {
                      if (committees[ci].id === currentAssigned) { assignedCommitteeName = committees[ci].name; break; }
                    }
                  }
                  var blockedCommitteeIds = {};
                  if (a.supervisorId) {
                    for (var ci2 = 0; ci2 < committees.length; ci2++) {
                      var cMembers = committees[ci2].members || [];
                      for (var mi2 = 0; mi2 < cMembers.length; mi2++) {
                        if ((cMembers[mi2].id || cMembers[mi2]._id || cMembers[mi2]) === a.supervisorId) {
                          blockedCommitteeIds[committees[ci2].id] = true;
                        }
                      }
                    }
                  }
                  var suggestName = a.best ? a.best.committeeName : 'No match';
                  var suggestScore = a.best ? a.best.score.toFixed(1) : '-';
                  var hasConflict = a.best ? a.best.hasConflict : false;
                  return React.createElement('tr', { key: g._id, className: 'hover:bg-slate-50 transition-colors' },
                    React.createElement('td', { className: 'py-3 px-4' },
                      React.createElement('div', { className: 'flex items-center gap-2.5' },
                        React.createElement('div', { className: 'w-7 h-7 rounded-lg bg-slate-100 text-slate-600 text-[9px] font-bold flex items-center justify-center' }, (gName.charAt(0) || '?').toUpperCase()),
                        React.createElement('div', null,
                          React.createElement('div', { className: 'text-xs font-bold text-slate-900' }, gName),
                          React.createElement('div', { className: 'text-[9px] text-slate-400' }, (g.members || []).length + ' members')
                        )
                      )
                    ),
                    React.createElement('td', { className: 'px-4 text-xs text-slate-600' }, a.supervisorName),
                    React.createElement('td', { className: 'px-4' },
                      groupPrefs.length > 0
                        ? React.createElement('div', { className: 'flex gap-1 flex-wrap' }, groupPrefs.map(function(p) {
                            var pc = PRIORITY_COLORS[p.priority];
                            return React.createElement('span', { key: p.priority, className: 'text-[9px] font-bold px-1.5 py-0.5 rounded border ' + (pc ? pc.bg + ' ' + pc.text + ' ' + pc.border : '') }, p.field);
                          }))
                        : React.createElement('span', { className: 'text-[10px] text-slate-400 italic' }, 'No preferences')
                    ),
                    React.createElement('td', { className: 'px-4' },
                      currentAssigned
                        ? React.createElement('span', { className: 'text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1 w-fit' },
                            React.createElement(Check, { size: 11 }), assignedCommitteeName
                          )
                        : React.createElement('div', { className: 'flex flex-col gap-0.5' },
                            React.createElement('span', { className: 'text-xs font-bold text-indigo-700' }, suggestName),
                            (a.best && a.best.hasConflict)
                              ? React.createElement('span', { className: 'text-[9px] text-amber-600' }, 'Supervisor conflict — ' + (a.secondBest ? a.secondBest.committeeName : 'no alternative'))
                              : null
                          )
                    ),
                    React.createElement('td', { className: 'px-4' },
                      React.createElement('span', { className: 'text-xs font-bold text-slate-900' }, suggestScore)
                    ),
                    React.createElement('td', { className: 'px-4 text-right' },
                      React.createElement('div', { className: 'flex items-center justify-end gap-1.5' },
                        React.createElement('select', {
                          value: currentAssigned || '',
                          onChange: function(e) {
                            if (e.target.value) { handleAssign(g._id, e.target.value); }
                          },
                          disabled: savingId === g._id,
                          className: 'text-[10px] font-bold bg-white border border-line rounded-lg px-2 py-1.5 outline-none focus:border-blue-500 cursor-pointer'
                        },
                          React.createElement('option', { value: '' }, currentAssigned ? 'Change...' : 'Assign...'),
                          committees.filter(function(c) { return !blockedCommitteeIds[c.id]; }).map(function(c) {
                            return React.createElement('option', { key: c.id, value: c.id }, c.name);
                          }),
                          Object.keys(blockedCommitteeIds).length > 0
                            ? React.createElement('option', { disabled: true, className: 'text-slate-300' }, '\u2014 Committees with supervisor excluded \u2014')
                            : null
                        ),
                        currentAssigned
                          ? React.createElement('button', {
                              onClick: function() { handleRemoveAssignment(g._id); },
                              disabled: savingId === g._id,
                              className: 'p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 cursor-pointer border-0 disabled:opacity-30'
                            }, React.createElement(X, { size: 12 }))
                          : null
                      )
                    )
                  );
                })
          )
        )
      )
    ),
    React.createElement('div', { className: 'bg-white rounded-2xl border border-line shadow-sm overflow-hidden' },
      React.createElement('div', { className: 'px-5 py-3 bg-slate-50 border-b border-line' },
        React.createElement('h3', { className: 'text-xs font-bold text-slate-900 flex items-center gap-2' },
          React.createElement(Users, { size: 14 }), 'Evaluation Committees (' + committees.length + ')'
        )
      ),
      React.createElement('div', { className: 'overflow-x-auto' },
        React.createElement('table', { className: 'w-full text-left' },
          React.createElement('thead', null,
            React.createElement('tr', { className: 'bg-slate-50 border-b border-line text-[10px] font-bold text-slate-500 uppercase tracking-wider' },
              React.createElement('th', { className: 'py-3 px-4' }, 'Committee'),
              React.createElement('th', { className: 'py-3 px-4' }, 'Head'),
              React.createElement('th', { className: 'py-3 px-4' }, 'Members'),
              React.createElement('th', { className: 'py-3 px-4' }, 'Status')
            )
          ),
          React.createElement('tbody', { className: 'divide-y divide-line text-sm' },
            committees.length === 0
              ? React.createElement('tr', null, React.createElement('td', { colSpan: 4, className: 'py-12 text-center text-slate-400' }, 'No committees created yet.'))
              : committees.map(function(c) {
                  var headName = c.head || 'Not assigned';
                  var memberNames = (c.members || []).map(function(m) { return typeof m === 'string' ? m : (m.name || ''); }).filter(Boolean);
                  return React.createElement('tr', { key: c.id, className: 'hover:bg-slate-50 transition-colors' },
                    React.createElement('td', { className: 'py-3 px-4 font-bold text-slate-900 text-xs' }, c.name),
                    React.createElement('td', { className: 'py-3 px-4 text-xs text-slate-600' }, headName),
                    React.createElement('td', { className: 'py-3 px-4' },
                      React.createElement('div', { className: 'flex flex-wrap gap-1' },
                        memberNames.map(function(n, i) { return React.createElement('span', { key: i, className: 'text-[9px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded' }, n); })
                      )
                    ),
                    React.createElement('td', { className: 'py-3 px-4' },
                      React.createElement('span', { className: 'text-[9px] font-bold px-2 py-0.5 rounded-lg border ' + (c.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200') }, c.status === 'active' ? 'Active' : (c.status || 'N/A'))
                    )
                  );
                })
          )
        )
      )
    )
  );
}
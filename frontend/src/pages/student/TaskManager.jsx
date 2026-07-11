import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, X, Check, Calendar, Clock,
  List, Columns, CalendarDays, Trash2,
  User, Tag, AlignLeft, AlertCircle, Bell, ChevronDown, Pencil, GripVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import apiClient from '../../api/apiClient';
import { STUDENT_TASKS_API_URL } from '../../utils/constants/api-url.constant';
import { getStudentGroup } from '../../services/student.service';
import { logger } from '../../utils/logger';

const COLUMNS = ['Not Started', 'In Progress', 'Review', 'Completed'];

const COLUMN_META = {
  'Not Started': { dot: 'bg-slate-400', statusKey: 'not_started' },
  'In Progress': { dot: 'bg-blue-500', statusKey: 'in_progress' },
  'Review': { dot: 'bg-amber-500', statusKey: 'review' },
  'Completed': { dot: 'bg-emerald-500', statusKey: 'completed' },
};

const COL_TO_STATUS = {
  'Not Started': 'not_started',
  'In Progress': 'in_progress',
  'Review': 'review',
  'Completed': 'completed',
};

const REVERSE_STATUS = {
  not_started: 'Not Started',
  'not-started': 'Not Started',
  todo: 'Not Started',
  in_progress: 'In Progress',
  'in-progress': 'In Progress',
  review: 'Review',
  done: 'Completed',
  completed: 'Completed',
};

const PRIORITY_STYLES = {
  high: { dot: 'bg-red-500', label: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  medium: { dot: 'bg-amber-500', label: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  low: { dot: 'bg-emerald-500', label: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
};

const formatDate = (d) => {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const normalizeTasksResponse = (data) => {
  if (!data) return null;
  if (!Array.isArray(data) && data['Not Started'] !== undefined) return data;
  if (Array.isArray(data)) {
    return {
      'Not Started': data.filter(t => t.status === 'todo' || t.status === 'not-started' || t.status === 'not_started'),
      'In Progress': data.filter(t => (t.status === 'in-progress' || t.status === 'in_progress') && (t.progress || 0) < 100),
      'Review': data.filter(t => t.status === 'review' && (t.progress || 0) < 100),
      'Completed': data.filter(t => t.status === 'done' || t.status === 'completed' || t.progress >= 100),
    };
  }
  return null;
};

const taskBoardData = {
  'Not Started': [
    { id: 1, title: 'Supervisor Meeting Slides – S3', categories: ['Documentation'], priority: 'medium', dueDate: '2026-02-22', overdue: true, assignee: 'AR', progress: 0, description: '' },
    { id: 2, title: 'Performance Optimization', categories: ['Backend'], priority: 'low', dueDate: '2026-02-28', overdue: true, assignee: 'UA', progress: 0, description: '' },
    { id: 3, title: 'User Acceptance Testing', categories: ['Testing'], priority: 'high', dueDate: '2026-03-03', overdue: true, assignee: 'AR', progress: 0, description: '' },
  ],
  'In Progress': [
    { id: 8, title: 'Frontend Auth & Routing', categories: ['Frontend'], priority: 'high', dueDate: '2026-02-15', overdue: true, assignee: 'FK', progress: 75, description: '' },
    { id: 9, title: 'REST API Development', categories: ['Backend'], priority: 'high', dueDate: '2026-02-18', overdue: true, assignee: 'UA', progress: 60, description: '' },
  ],
  'Review': [
    { id: 13, title: 'API Integration Testing', categories: ['Testing'], priority: 'medium', dueDate: '2026-02-14', overdue: true, assignee: 'UA', progress: 92, description: '' },
  ],
  'Completed': [
    { id: 16, title: 'Project Proposal Document', categories: ['Documentation'], priority: 'high', dueDate: '2025-12-01', overdue: false, progress: 100, assignee: 'AR', description: '' },
  ]
};

function getAssigneeOptions(members) {
  if (!members?.length) return [];
  return members.map(m => ({
    value: m?.user?.name ? m.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?',
    label: m?.user?.name || 'Unknown Member',
  }));
}

function InlineTitleEdit({ value, onSave, onCancel }) {
  const [text, setText] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const commit = () => {
    if (text.trim() && text.trim() !== value) {
      onSave(text.trim());
    } else {
      onCancel();
    }
  };

  return (
    <input
      ref={inputRef}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit();
        if (e.key === 'Escape') onCancel();
      }}
      className="w-full text-[13px] font-semibold text-slate-800 bg-blue-50 border border-blue-300 rounded px-1.5 py-0.5 outline-none focus:ring-2 focus:ring-blue-500/30"
    />
  );
}

function TaskCard({ task, onSelect, index }) {
  const [editing, setEditing] = useState(false);

  const handleInlineSave = async (title) => {
    setEditing(false);
    try {
      await apiClient.put(`${STUDENT_TASKS_API_URL}/${task.id || task._id}`, { title });
    } catch (err) {
      logger('Error updating task title:', err);
    }
  };

  return (
    <Draggable draggableId={String(task.id || task._id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="group relative"
        >
          <div
            onClick={() => !editing && onSelect(task)}
            className={`bg-white rounded-lg border px-3.5 py-3 cursor-pointer transition-all duration-150 ${
              snapshot.isDragging
                ? 'border-blue-400 bg-blue-50 shadow-lg rotate-2 scale-[1.02] z-50'
                : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
            }`}
          >
            <div className="flex items-start gap-1.5">
              <div
                {...provided.dragHandleProps}
                className="mt-0.5 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-400 transition-colors flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <GripVertical size={14} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0" onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); }}>
                {editing ? (
                  <InlineTitleEdit
                    value={task.title}
                    onSave={handleInlineSave}
                    onCancel={() => setEditing(false)}
                  />
                ) : (
                  <h4 className="text-[13px] font-semibold text-slate-800 leading-snug line-clamp-2">{task.title}</h4>
                )}
                <div className="flex items-center gap-2.5 mt-2.5">
                  {task.priority && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                      <span className={`w-2 h-2 rounded-full ${PRIORITY_STYLES[task.priority]?.dot || 'bg-slate-400'}`} />
                      {task.priority}
                    </span>
                  )}
                  {task.dueDate && (
                    <span className={`flex items-center gap-1 text-[11px] font-medium ${task.overdue ? 'text-red-500' : 'text-slate-500'}`}>
                      <Calendar size={11} />
                      {formatDate(task.dueDate)}
                    </span>
                  )}
                  {task.assignee && (
                    <span className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-[9px] font-bold text-slate-600">
                      {task.assignee.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                {task.progress > 0 && task.progress < 100 && (
                  <div className="mt-2.5 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${task.progress}%` }} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setEditing(true); }}
            className="absolute top-2 right-2 p-1 rounded-md bg-white border border-slate-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-600 cursor-pointer"
            title="Rename"
          >
            <Pencil size={12} strokeWidth={2} />
          </button>
        </div>
      )}
    </Draggable>
  );
}

function BoardView({ tasks, onSelectTask, onDragEnd }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'thin' }}>
        {COLUMNS.map(col => {
          const meta = COLUMN_META[col];
          const colTasks = tasks[col] || [];
          return (
            <Droppable key={col} droppableId={col}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 min-w-[260px] max-w-[320px] rounded-xl border transition-colors ${
                    snapshot.isDraggingOver
                      ? 'border-blue-300 bg-blue-50/50'
                      : 'bg-slate-50/80 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                      <h3 className="text-[13px] font-semibold text-slate-700">{col}</h3>
                      <span className="text-[11px] font-medium text-slate-400 ml-1">{colTasks.length}</span>
                    </div>
                  </div>
                  <div className="p-2.5 space-y-2 min-h-[120px]">
                    {colTasks.map((task, index) => (
                      <TaskCard key={task.id || task._id} task={task} index={index} onSelect={onSelectTask} />
                    ))}
                    {provided.placeholder}
                    {colTasks.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex items-center justify-center h-20 text-[12px] text-slate-400 font-medium">
                        No tasks
                      </div>
                    )}
                    {colTasks.length === 0 && snapshot.isDraggingOver && (
                      <div className="flex items-center justify-center h-20 text-[12px] text-blue-400 font-medium border-2 border-dashed border-blue-200 rounded-lg bg-blue-50/30">
                        Drop here
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
}

function TableView({ tasks, onSelectTask }) {
  const allTasks = Object.values(tasks).flat();
  if (allTasks.length === 0) {
    return <div className="flex items-center justify-center h-48 text-sm text-slate-400 font-medium">No tasks yet</div>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200" style={{ scrollbarWidth: 'thin' }}>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Task</th>
            <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
            <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Due</th>
            <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Assignee</th>
          </tr>
        </thead>
        <tbody>
          {allTasks.map((task, i) => (
            <tr
              key={task.id || task._id || i}
              onClick={() => onSelectTask(task)}
              className="border-b border-slate-100 hover:bg-blue-50/40 cursor-pointer transition-colors last:border-0"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_STYLES[task.priority]?.dot || 'bg-slate-400'} flex-shrink-0`} />
                  <span className="text-[13px] font-medium text-slate-800 line-clamp-1">{task.title}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
                  <span className={`w-1.5 h-1.5 rounded-full ${COLUMN_META[REVERSE_STATUS[task.status]]?.dot || 'bg-slate-400'}`} />
                  {REVERSE_STATUS[task.status] || task.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`text-[12px] font-medium ${PRIORITY_STYLES[task.priority]?.label || 'text-slate-500'}`}>{task.priority}</span>
              </td>
              <td className="px-4 py-3">
                <span className={`text-[12px] font-medium ${task.overdue ? 'text-red-500' : 'text-slate-500'}`}>
                  {formatDate(task.dueDate) || '—'}
                </span>
              </td>
              <td className="px-4 py-3">
                {task.assignee ? (
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-[9px] font-bold text-slate-600">
                      {task.assignee.substring(0, 2).toUpperCase()}
                    </span>
                    {task.assignee}
                  </span>
                ) : <span className="text-[12px] text-slate-400">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CalendarView({ tasks }) {
  const allTasks = Object.values(tasks).flat();
  const withDates = allTasks.filter(t => t.dueDate).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  if (withDates.length === 0) {
    return <div className="flex items-center justify-center h-48 text-sm text-slate-400 font-medium">No tasks with due dates</div>;
  }
  const grouped = {};
  withDates.forEach(t => {
    const key = formatDate(t.dueDate);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  });
  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([date, dateTasks]) => (
        <div key={date} className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200">
            <span className="text-[12px] font-semibold text-slate-600">{date}</span>
            <span className="text-[11px] text-slate-400 ml-2">{dateTasks.length} task{dateTasks.length > 1 ? 's' : ''}</span>
          </div>
          <div className="divide-y divide-slate-100">
            {dateTasks.map((task, i) => (
              <div key={task.id || task._id || i} className="px-4 py-2.5 flex items-center gap-3 hover:bg-blue-50/30 transition-colors">
                <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_STYLES[task.priority]?.dot || 'bg-slate-400'} flex-shrink-0`} />
                <span className="flex-1 text-[13px] font-medium text-slate-800 line-clamp-1">{task.title}</span>
                {task.overdue && <span className="text-[10px] font-semibold text-red-500 uppercase">Overdue</span>}
                <span className="text-[11px] font-medium text-slate-400">{task.assignee}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskSidePanel({ task, onClose, onSave, onDelete, visible, assigneeOptions }) {
  const [edit, setEdit] = useState(task ? { ...task } : null);
  const [saving, setSaving] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  const prevTaskKeyRef = useRef(task?.id || task?._id);
  if ((task?.id || task?._id) !== prevTaskKeyRef.current) {
    prevTaskKeyRef.current = task?.id || task?._id;
    setEdit(task ? { ...task } : null);
    setConfirmClose(false);
  }

  const isDirty = useCallback(() => {
    if (!task || !edit) return false;
    return JSON.stringify(task) !== JSON.stringify(edit);
  }, [task, edit]);

  const handleClose = () => {
    if (isDirty() && !confirmClose) {
      setConfirmClose(true);
      return;
    }
    setConfirmClose(false);
    onClose();
  };

  const handleSave = async () => {
    if (!edit) return;
    setSaving(true);
    try {
      await onSave(edit);
    } finally {
      setSaving(false);
    }
  };

  const dirty = isDirty();

  if (!edit) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/10 z-40" onClick={handleClose}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
            className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-white border-l border-slate-200 z-50 shadow-xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <button onClick={handleClose} className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={18} />
                </button>
                {dirty && <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Unsaved</span>}
              </div>
              <button
                onClick={() => onDelete(edit.id || edit._id)}
                className="p-1.5 hover:bg-red-50 rounded-md transition-colors text-slate-400 hover:text-red-500 cursor-pointer"
                title="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6" style={{ scrollbarWidth: 'thin' }}>
              <div>
                <input
                  type="text"
                  value={edit.title}
                  onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                  className="w-full text-[18px] font-bold text-slate-900 bg-transparent border-none outline-none focus:ring-0 p-0"
                  placeholder="Task title"
                />
              </div>
              <div className="space-y-3">
                <PropertyRow icon={List} label="Status">
                  <select
                    value={edit.status || 'not_started'}
                    onChange={(e) => setEdit({ ...edit, status: e.target.value })}
                    className="text-[13px] font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </PropertyRow>
                <PropertyRow icon={Tag} label="Priority">
                  <div className="flex gap-1.5">
                    {['low', 'medium', 'high'].map(p => {
                      const ps = PRIORITY_STYLES[p];
                      return (
                        <button
                          key={p}
                          onClick={() => setEdit({ ...edit, priority: p })}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-all cursor-pointer ${
                            edit.priority === p
                              ? `${ps.bg} ${ps.label} ring-1 ring-slate-300`
                              : 'text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </PropertyRow>
                <PropertyRow icon={User} label="Assignee">
                  <select
                    value={edit.assignee || ''}
                    onChange={(e) => setEdit({ ...edit, assignee: e.target.value })}
                    className="text-[13px] font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-full cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {assigneeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </PropertyRow>
                <PropertyRow icon={Calendar} label="Due date">
                  <input
                    type="date"
                    value={edit.dueDate ? (typeof edit.dueDate === 'string' ? edit.dueDate : edit.dueDate.toISOString().split('T')[0]) : ''}
                    onChange={(e) => setEdit({ ...edit, dueDate: e.target.value ? new Date(e.target.value) : null })}
                    className="text-[13px] font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </PropertyRow>
                <PropertyRow icon={Clock} label="Progress">
                  <div className="flex items-center gap-3">
                    <input
                      type="range" min="0" max="100"
                      value={edit.progress || 0}
                      onChange={(e) => setEdit({ ...edit, progress: parseInt(e.target.value) })}
                      className="w-32 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />
                    <span className="text-[12px] font-semibold text-slate-600 w-8">{edit.progress || 0}%</span>
                  </div>
                </PropertyRow>
                <PropertyRow icon={AlignLeft} label="Description">
                  <textarea
                    value={edit.description || ''}
                    onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                    placeholder="Add a description..."
                    rows={3}
                    className="w-full text-[13px] text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                  />
                </PropertyRow>
              </div>
              {edit.createdAt && (
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Activity</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[12px] text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                      Created {new Date(edit.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {edit.updatedAt && edit.updatedAt !== edit.createdAt && (
                      <div className="flex items-center gap-2 text-[12px] text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                        Updated {new Date(edit.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with save */}
            <div className="border-t border-slate-200 px-5 py-4">
              {confirmClose ? (
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-slate-600 flex-1">Discard changes?</span>
                  <button
                    onClick={() => { setConfirmClose(false); onClose(); }}
                    className="px-3 py-1.5 text-[12px] font-semibold text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    onClick={() => setConfirmClose(false)}
                    className="px-3 py-1.5 text-[12px] font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                  >
                    Keep editing
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={!dirty || saving}
                  className={`w-full py-2.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                    dirty && !saving
                      ? 'bg-btn hover:bg-btn-hover text-white'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : dirty ? (
                    'Save Changes'
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Check size={14} />
                      Saved
                    </span>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function PropertyRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center gap-2 w-28 flex-shrink-0 pt-1">
        <Icon size={14} className="text-slate-400" strokeWidth={1.5} />
        <span className="text-[12px] font-medium text-slate-500">{label}</span>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default function TaskManager() {
  const [view, setView] = useState('board');
  const [tasks, setTasks] = useState({ 'Not Started': [], 'In Progress': [], 'Review': [], 'Completed': [] });
  const [group, setGroup] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [showQuickOptions, setShowQuickOptions] = useState(false);
  const [quickPriority, setQuickPriority] = useState('medium');
  const [quickDueDate, setQuickDueDate] = useState('');
  const [quickAssignee, setQuickAssignee] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const quickInputRef = useRef(null);
  const notifRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await apiClient.get(STUDENT_TASKS_API_URL);
        const normalized = normalizeTasksResponse(res.data);
        if (normalized) setTasks(normalized);
      } catch (err) {
        if (import.meta.env.DEV) {
          logger('[DEV] Tasks API failed, using mock fallback.', err);
          setTasks(taskBoardData);
        } else {
          setFetchError('Unable to load tasks.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    getStudentGroup()
      .then(res => {
        const data = res?.data || res;
        setGroup(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (showQuickAdd && quickInputRef.current) {
      quickInputRef.current.focus();
    }
  }, [showQuickAdd]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allTasks = Object.values(tasks).flat();
  const completedCount = (tasks['Completed'] || []).length;
  const inProgressCount = (tasks['In Progress'] || []).length;
  const reviewCount = (tasks['Review'] || []).length;
  const totalTasks = allTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const groupMembers = group?.members || [];
  const assigneeOptions = getAssigneeOptions(groupMembers);

  const addNotification = useCallback((message) => {
    const id = Date.now();
    setNotifications(prev => [{ id, message, time: new Date(), unread: true }, ...prev].slice(0, 20));
  }, []);

  const markNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setShowPanel(true);
  };

  const handleSaveTask = async (updated) => {
    if (updated.progress >= 100) {
      updated.status = 'completed';
    }
    const col = REVERSE_STATUS[updated.status] || 'Not Started';
    try {
      await apiClient.put(`${STUDENT_TASKS_API_URL}/${updated.id || updated._id}`, updated);
    } catch (err) {
      logger('Error updating task:', err);
    }
    setTasks(prev => {
      const next = {};
      Object.keys(prev).forEach(c => {
        next[c] = prev[c].map(t => (t.id === updated.id || t._id === updated._id ? updated : t));
      });
      const newCol = REVERSE_STATUS[updated.status] || 'Not Started';
      if (newCol !== col) {
        const item = next[col]?.find(t => t.id === updated.id || t._id === updated._id);
        if (item) {
          next[col] = next[col].filter(t => t.id !== updated.id && t._id !== updated._id);
          next[newCol] = [...(next[newCol] || []), item];
        }
      }
      return next;
    });
    setSelectedTask(updated);
    showToast('Task saved');
  };

  const handleDeleteTask = async (id) => {
    try {
      await apiClient.delete(`${STUDENT_TASKS_API_URL}/${id}`);
    } catch (err) {
      logger('Error deleting task:', err);
    }
    setTasks(prev => {
      const next = {};
      Object.keys(prev).forEach(c => {
        next[c] = prev[c].filter(t => t.id !== id && t._id !== id);
      });
      return next;
    });
    setShowPanel(false);
    setSelectedTask(null);
    showToast('Task deleted');
  };

  const handleCreateTask = async () => {
    const title = quickTitle.trim();
    if (!title) return;
    const newTask = {
      id: Date.now(),
      title,
      categories: [],
      priority: quickPriority,
      dueDate: quickDueDate ? new Date(quickDueDate) : null,
      assignee: quickAssignee,
      progress: 0,
      status: 'not_started',
      description: '',
      overdue: quickDueDate ? new Date(quickDueDate) < new Date() : false,
    };
    try {
      await apiClient.post(STUDENT_TASKS_API_URL, newTask);
    } catch (err) {
      logger('Error creating task:', err);
    }
    setTasks(prev => ({
      ...prev,
      'Not Started': [...prev['Not Started'], newTask],
    }));

    if (quickAssignee) {
      const assignedName = assigneeOptions.find(o => o.value === quickAssignee)?.label || quickAssignee;
      addNotification(`"${title}" assigned to ${assignedName}`);
    }
    addNotification(`"${title}" created`);

    setQuickTitle('');
    setQuickPriority('medium');
    setQuickDueDate('');
    setQuickAssignee('');
    setShowQuickOptions(false);
    setShowQuickAdd(false);
    showToast('Task created');
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    setTasks(prev => {
      const next = { ...prev };
      const sourceItems = [...(next[sourceCol] || [])];
      const [moved] = sourceItems.splice(source.index, 1);
      next[sourceCol] = sourceItems;

      if (!moved) return prev;

      const updated = {
        ...moved,
        status: COL_TO_STATUS[destCol] || moved.status,
        progress: destCol === 'Completed' ? 100 : moved.progress,
      };

      const destItems = [...(next[destCol] || [])];
      destItems.splice(destination.index, 0, updated);
      next[destCol] = destItems;

      apiClient.put(`${STUDENT_TASKS_API_URL}/${updated.id || updated._id}`, {
        status: updated.status,
        progress: updated.progress,
      }).catch(err => logger('Error saving task after drag:', err));

      showToast(`Moved to ${destCol}`);
      return next;
    });
  };

  const handleQuickKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCreateTask();
    }
    if (e.key === 'Escape') {
      setShowQuickAdd(false);
      setQuickTitle('');
      setShowQuickOptions(false);
    }
  };

  const views = [
    { id: 'board', icon: Columns, label: 'Board' },
    { id: 'table', icon: List, label: 'Table' },
    { id: 'calendar', icon: CalendarDays, label: 'Calendar' },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="flex-1 flex flex-col min-w-0 font-sans antialiased text-slate-800">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-[13px] font-medium px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Check size={14} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {fetchError && (
        <div className="mx-4 mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-[13px] font-medium">
          <AlertCircle size={15} />
          {fetchError}
        </div>
      )}

      {/* Header */}
      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-3 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Tasks</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">{totalTasks} task{totalTasks !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-500"
              >
                <Bell size={18} strokeWidth={1.5} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifs && (
                <div className="absolute right-0 top-10 w-80 bg-white rounded-xl border border-slate-200 shadow-lg z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <span className="text-[12px] font-bold text-slate-700">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markNotifsRead} className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-[12px] text-slate-400 font-medium">No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`px-4 py-2.5 border-b border-slate-50 last:border-0 ${n.unread ? 'bg-blue-50/40' : ''}`}>
                          <div className="flex items-start gap-2">
                            {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                            <div className={n.unread ? '' : 'ml-[14px]'}>
                              <p className="text-[12px] text-slate-700 font-medium leading-snug">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-0.5 block">
                                {n.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowQuickAdd(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-btn hover:bg-btn-hover text-white text-[13px] font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Plus size={16} strokeWidth={2} />
              New Task
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 md:gap-6">
          {[
            { label: 'Total', count: totalTasks, color: 'text-slate-900' },
            { label: 'In Progress', count: inProgressCount, color: 'text-blue-600' },
            { label: 'Review', count: reviewCount, color: 'text-amber-600' },
            { label: 'Completed', count: completedCount, color: 'text-emerald-600' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-1.5">
              <span className={`text-[15px] font-bold ${stat.color}`}>{stat.count}</span>
              <span className="text-[11px] font-medium text-slate-400">{stat.label}</span>
            </div>
          ))}
          {totalTasks > 0 && (
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="h-1.5 w-20 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${completionRate}%` }} />
              </div>
              <span className="text-[11px] font-medium text-slate-400">{completionRate}%</span>
            </div>
          )}
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-1 mt-3 bg-slate-100 rounded-lg p-0.5 w-fit">
          {views.map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all cursor-pointer ${
                view === v.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <v.icon size={14} strokeWidth={1.5} />
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick add bar */}
      <AnimatePresence>
        {showQuickAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden border-b border-slate-200 bg-slate-50/60"
          >
            <div className="px-4 md:px-6 py-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={quickInputRef}
                    type="text"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    onKeyDown={handleQuickKeyDown}
                    placeholder="Add a task, press Enter to save..."
                    className="w-full px-3.5 py-2.5 text-[14px] bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 placeholder:text-slate-400 font-medium text-slate-800"
                  />
                </div>
                <button
                  onClick={() => setShowQuickOptions(!showQuickOptions)}
                  className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                    showQuickOptions ? 'bg-blue-50 border-blue-300 text-blue-600' : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-100'
                  }`}
                  title="More options"
                >
                  <ChevronDown size={16} strokeWidth={1.5} className={`transition-transform ${showQuickOptions ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={handleCreateTask}
                  disabled={!quickTitle.trim()}
                  className="px-4 py-2.5 bg-btn hover:bg-btn-hover disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Add
                </button>
                <button
                  onClick={() => { setShowQuickAdd(false); setQuickTitle(''); setShowQuickOptions(false); }}
                  className="p-2.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 cursor-pointer"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              <AnimatePresence>
                {showQuickOptions && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-slate-500">Priority</span>
                        <div className="flex gap-1">
                          {['low', 'medium', 'high'].map(p => (
                            <button
                              key={p}
                              onClick={() => setQuickPriority(p)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-all cursor-pointer ${
                                quickPriority === p
                                  ? `${PRIORITY_STYLES[p].bg} ${PRIORITY_STYLES[p].label} ring-1 ring-slate-300`
                                  : 'text-slate-500 hover:bg-slate-100 bg-white border border-slate-200'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-slate-500">Due</span>
                        <input
                          type="date"
                          value={quickDueDate}
                          onChange={(e) => setQuickDueDate(e.target.value)}
                          className="px-2.5 py-1 text-[12px] bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-700"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-slate-500">Assignee</span>
                        <select
                          value={quickAssignee}
                          onChange={(e) => setQuickAssignee(e.target.value)}
                          className="px-2.5 py-1 text-[12px] bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-700 cursor-pointer"
                        >
                          <option value="">Unassigned</option>
                          {assigneeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4" style={{ scrollbarWidth: 'thin' }}>
        {loading ? (
          <div className="flex gap-4">
            {COLUMNS.map(c => (
              <div key={c} className="flex-1 min-w-[260px] max-w-[320px] space-y-2.5">
                <div className="skeleton h-5 w-24 rounded" />
                {[1, 2].map(i => <div key={i} className="skeleton h-24 w-full rounded-lg" />)}
              </div>
            ))}
          </div>
        ) : view === 'board' ? (
          <BoardView tasks={tasks} onSelectTask={handleSelectTask} onDragEnd={handleDragEnd} />
        ) : view === 'table' ? (
          <TableView tasks={tasks} onSelectTask={handleSelectTask} />
        ) : (
          <CalendarView tasks={tasks} />
        )}
      </div>

      <TaskSidePanel
        task={selectedTask}
        visible={showPanel}
        onClose={() => { setShowPanel(false); setSelectedTask(null); }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        assigneeOptions={assigneeOptions}
      />
    </div>
  );
}

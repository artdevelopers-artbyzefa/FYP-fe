import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  KanbanSquare,
  Users,
  LineChart,
  CalendarDays,
  GraduationCap,
  Plus,
  ClipboardList,
  CheckCircle2,
  Zap,
  Hourglass,
  Clock,
  Search,
  Eye,
  Tag,
  X,
  Check,
  Calendar
} from 'lucide-react';
import apiClient from '../../api/apiClient';
import { STUDENT_TASKS_API_URL } from '../../utils/constants/api-url.constant';
import { logger } from '../../utils/logger';

/**
 * Fix 1: Task Response Normalizer
 * Handles both response shapes from the backend:
 *   - Flat array:    [{ id, title, status: 'todo' | 'in-progress' | 'review' | 'done' }]
 *   - Grouped obj:  { 'Not Started': [...], 'In Progress': [...], ... }
 */
const normalizeTasksResponse = (data) => {
  if (!data) return null;

  // Already grouped object — use as-is
  if (!Array.isArray(data) && data['Not Started'] !== undefined) return data;

  // Flat array — group by status
  if (Array.isArray(data)) {
    return {
      'Not Started': data.filter(t => t.status === 'todo' || t.status === 'not-started'),
      'In Progress': data.filter(t => t.status === 'in-progress'),
      'Review':      data.filter(t => t.status === 'review'),
      'Completed':   data.filter(t => t.status === 'done' || t.status === 'completed'),
    };
  }

  return null; // unknown shape
};

const taskBoardData = {
  'Not Started': [
    { id: 1, title: 'Supervisor Meeting Slides – S3', categories: ['Documentation'], priority: 'medium', date: 'Feb 22', overdue: true, assignee: 'AR' },
    { id: 2, title: 'Performance Optimization', categories: ['Backend'], priority: 'low', date: 'Feb 28', overdue: true, assignee: 'UA' },
    { id: 3, title: 'User Acceptance Testing', categories: ['Testing'], priority: 'high', date: 'Mar 3', overdue: true, assignee: 'AR' },
    { id: 4, title: 'ML Model Integration', categories: ['ML', 'Backend'], priority: 'high', date: 'Mar 1', overdue: true, assignee: 'AM' },
    { id: 5, title: 'Security Audit', categories: ['Security'], priority: 'medium', date: 'Mar 6', overdue: true, assignee: 'UA' },
    { id: 6, title: 'Final Documentation', categories: ['Documentation'], priority: 'high', date: 'Mar 10', overdue: true, assignee: 'AR' },
    { id: 7, title: 'Deployment & CI/CD Setup', categories: ['DevOps'], priority: 'medium', date: 'Mar 8', overdue: true, assignee: 'UA' },
  ],
  'In Progress': [
    { id: 8, title: 'Frontend Auth & Routing', categories: ['Frontend'], priority: 'high', date: 'Feb 15', overdue: true, progress: 75, assignee: 'FK' },
    { id: 9, title: 'REST API Development', categories: ['Backend'], priority: 'high', date: 'Feb 18', overdue: true, progress: 60, assignee: 'UA' },
    { id: 10, title: 'ML Model Training — Phase 1', categories: ['ML'], priority: 'high', date: 'Feb 20', overdue: true, progress: 45, assignee: 'AM' },
    { id: 11, title: 'Dashboard UI Components', categories: ['Frontend'], priority: 'medium', date: 'Feb 17', overdue: true, progress: 80, assignee: 'FK' },
    { id: 12, title: 'Code Review & Refactoring', categories: ['Quality'], priority: 'medium', date: 'Feb 16', overdue: true, progress: 30, assignee: 'AR' },
  ],
  'Review': [
    { id: 13, title: 'API Integration Testing', categories: ['Testing'], priority: 'medium', date: 'Feb 14', overdue: true, progress: 92, assignee: 'UA' },
    { id: 14, title: 'Mobile Responsiveness', categories: ['Frontend'], priority: 'medium', date: 'Feb 13', overdue: true, progress: 88, assignee: 'FK' },
    { id: 15, title: 'Data Preprocessing Pipeline', categories: ['ML'], priority: 'high', date: 'Feb 12', overdue: true, progress: 95, assignee: 'AM' },
  ],
  'Completed': [
    { id: 16, title: 'Project Proposal Document', categories: ['Documentation'], priority: 'high', date: 'Dec 1', overdue: false, progress: 100, assignee: 'AR' },
    { id: 17, title: 'Literature Review', categories: ['Research'], priority: 'high', date: 'Dec 15', overdue: false, progress: 100, assignee: 'FK' },
    { id: 18, title: 'System Architecture Design', categories: ['Design'], priority: 'high', date: 'Jan 5', overdue: false, progress: 100, assignee: 'AR' },
    { id: 19, title: 'Database Schema Design', categories: ['Backend'], priority: 'medium', date: 'Jan 10', overdue: false, progress: 100, assignee: 'UA' },
    { id: 20, title: 'UI/UX Wireframes', categories: ['Design'], priority: 'medium', date: 'Jan 15', overdue: false, progress: 100, assignee: 'FK' },
  ]
};

const TaskCard = ({ task, onDelete, onEdit }) => {
  const priorityStyle = {
    'high': 'text-[#dc2626] bg-[#fee2e2]',
    'medium': 'text-[#d97706] bg-[#fef3c7]',
    'low': 'text-[#16a34a] bg-[#dcfce7]'
  }[task.priority];

  return (
    <div className="bg-white rounded-[16px] p-5 shadow-sm border border-gray-100/80 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {task.categories.map((cat, i) => (
          <span key={i} className="bg-[#eff6ff] text-[#2563eb] font-bold text-[11px] px-2.5 py-1 rounded-full uppercase">
            {cat}
          </span>
        ))}
      </div>

      <h4 className="text-[15px] font-bold text-[#1e293b] leading-tight mb-4">{task.title}</h4>

      <div className="flex items-center justify-between mb-4">
        <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full capitalize ${priorityStyle}`}>
          {task.priority}
        </span>
        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[12px] font-bold text-gray-500">{task.date}</span>
          {task.overdue && (
            <svg className="w-4 h-4 text-[#dc2626]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          )}
        </div>
      </div>

      {task.progress !== undefined && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[12px] font-semibold text-gray-400">Progress</span>
            <span className="text-[12px] font-bold text-[#1e293b]">{task.progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${task.progress === 100 ? 'bg-[#16a34a]' : 'bg-[#2563eb]'}`}
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-50">
        <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-[12px] font-bold shadow-sm ring-2 ring-white">
          {task.assignee}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            className="w-[30px] h-[30px] rounded-[8px] bg-[#eff6ff] text-[#2563eb] flex items-center justify-center hover:bg-blue-100 transition-colors"
          >
            <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            className="w-[30px] h-[30px] rounded-[8px] bg-[#fef2f2] text-[#dc2626] flex items-center justify-center hover:bg-red-100 transition-colors"
          >
            <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const BoardColumn = ({ title, icon: Icon, count, tasks, onDelete, onEdit }) => {
  const bgColors = {
    'Not Started': 'bg-[#f8fafc]',
    'In Progress': 'bg-[#eff6ff]',
    'Review': 'bg-[#fffbeb]',
    'Completed': 'bg-[#f0fdf4]'
  };

  const textColors = {
    'Not Started': 'text-[#475569]',
    'In Progress': 'text-[#2563eb]',
    'Review': 'text-[#d97706]',
    'Completed': 'text-[#16a34a]'
  };

  const countBgs = {
    'Not Started': 'bg-[#475569]',
    'In Progress': 'bg-[#2563eb]',
    'Review': 'bg-[#d97706]',
    'Completed': 'bg-[#16a34a]'
  };

  return (
    <div className={`flex-1 min-w-[320px] max-w-[340px] rounded-[24px] ${bgColors[title]} p-5 flex flex-col`}>
      <div className="flex items-center justify-between mb-5 px-1">
        <div className={`flex items-center gap-2.5 ${textColors[title]}`}>
          <Icon className="w-5 h-5 stroke-[2.5]" />
          <h3 className="font-extrabold text-[16px]">{title}</h3>
        </div>
        <div className={`w-6 h-6 rounded-full ${countBgs[title]} text-white flex items-center justify-center text-[12px] font-bold shadow-sm`}>
          {count}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {tasks.map(task => <TaskCard key={task.id} task={task} onDelete={onDelete} onEdit={onEdit} />)}
      </div>
    </div>
  );
};

const TaskManager = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [activeTab, setActiveTab] = useState('Task Board');

  // Custom interactive states
  const [tasks, setTasks] = useState(taskBoardData);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null); // Fix 3

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await apiClient.get(STUDENT_TASKS_API_URL);
        // Fix 1: normalize response — works with both flat array and grouped object
        const normalized = normalizeTasksResponse(response.data);
        if (normalized) setTasks(normalized);
      } catch (err) {
        // Fix 3: dev gets silent fallback; production shows visible error
        if (import.meta.env.DEV) {
          logger("[DEV] Failed to load tasks from backend, using mocked fallback.", err);
        } else {
          setFetchError("Unable to load tasks. Please refresh or contact support.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Form states for Add Task Modal
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategories, setNewTaskCategories] = useState(['Frontend']);
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('AR');

  // Interactive Supervisor State
  const [requestedSupervisors, setRequestedSupervisors] = useState({});

  // Notification lists state (with 3 unread count)
  const [notifications, setNotifications] = useState([
    { id: 1, sender: 'Dr. Tariq Hassan', action: 'assigned you a new task:', target: 'ML Model Training — Phase 1', time: '10m ago', unread: true },
    { id: 2, sender: 'Fatima Khan', action: 'moved to Review', target: 'Mobile Responsiveness', time: '1h ago', unread: true },
    { id: 3, sender: 'Ahmed Raza', action: 'added a comment on', target: 'Supervisor Meeting Slides — S3', time: '3h ago', unread: true }
  ]);

  const showToastMessage = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleDeleteTask = async (id) => {
    setLoading(true);
    try {
      await apiClient.delete(`${STUDENT_TASKS_API_URL}/${id}`);
    } catch (err) {
      if (import.meta.env.DEV) {
        logger("[DEV] Error deleting task (applied locally):", err);
      } else {
        showToastMessage('Failed to delete task. Please try again.');
      }
    } finally {
      setLoading(false);
    }
    const updatedTasks = {};
    Object.keys(tasks).forEach(col => {
      updatedTasks[col] = tasks[col].filter(t => t.id !== id);
    });
    setTasks(updatedTasks);
    showToastMessage('Task deleted successfully!');
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      categories: newTaskCategories,
      priority: newTaskPriority,
      date: newTaskDueDate || 'Feb 22',
      overdue: true,
      assignee: newTaskAssignee
    };

    setLoading(true);
    try {
      await apiClient.post(STUDENT_TASKS_API_URL, newTask);
    } catch (err) {
      logger("Error creating task:", err);
      logger("Created task locally", newTask);
    } finally {
      setLoading(false);
    }

    setTasks({
      ...tasks,
      'Not Started': [...tasks['Not Started'], newTask]
    });

    // Reset Form
    setNewTaskTitle('');
    setNewTaskCategories(['Frontend']);
    setNewTaskPriority('medium');
    setNewTaskDueDate('');
    setNewTaskAssignee('AR');
    setShowAddTaskModal(false);

    showToastMessage('New task created successfully!');
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!selectedTask || !selectedTask.title.trim()) return;

    setLoading(true);
    try {
      await apiClient.put(`${STUDENT_TASKS_API_URL}/${selectedTask.id}`, selectedTask);
    } catch (err) {
      logger("Error updating task:", err);
      logger("Updated task locally", selectedTask);
    } finally {
      setLoading(false);
    }

    const updatedTasks = {};
    Object.keys(tasks).forEach(col => {
      updatedTasks[col] = tasks[col].map(t => {
        if (t.id === selectedTask.id) {
          return selectedTask;
        }
        return t;
      });
    });

    setTasks(updatedTasks);
    setShowEditTaskModal(false);
    setSelectedTask(null);
    showToastMessage('Task updated successfully!');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    showToastMessage('All notifications marked as read!');
  };

  const handleRequestSupervisor = (id, name) => {
    setRequestedSupervisors({
      ...requestedSupervisors,
      [id]: true
    });
    showToastMessage(`Request successfully sent to ${name}! Status: Pending Approval.`);
  };

  const tabs = [
    { id: 'Dashboard', icon: LayoutDashboard },
    { id: 'Task Board', icon: KanbanSquare },
    { id: 'Team', icon: Users },
    { id: 'Analytics', icon: LineChart },
    { id: 'Calendar', icon: CalendarDays },
    { id: 'Supervisor', icon: GraduationCap }
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#f4f7fe] font-poppins antialiased">
      {/* Fix 3: Production error banner — only shown when backend is unreachable in prod */}
      {fetchError && (
        <div className="mx-6 mt-4 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-3.5 rounded-2xl text-[13px] font-semibold shadow-sm">
          <svg className="w-4 h-4 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {fetchError}
        </div>
      )}
      {/* Main Content Padding Wrapper */}
      <div className="p-6 md:p-8 max-w-[1400px] w-full mx-auto space-y-8">

        {/* 2. Navigation Tabs & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <h2 className="text-[28px] font-extrabold text-[#1e293b] tracking-tight">
              {activeTab === 'Team' ? 'Team Overview' : activeTab}
            </h2>

            {/* Tabs */}
            <div className="hidden md:flex items-center gap-1 bg-white px-1.5 py-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] transition-colors relative whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-[#f4f7fe] text-[#2563eb] font-bold'
                    : 'text-gray-500 hover:text-gray-800 font-semibold hover:bg-gray-50'
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.id}
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#2563eb] rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-xl font-bold text-[14px] shadow-lg shadow-blue-500/25 transition-all cursor-pointer animate-pulse-subtle"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add Task
            </button>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 relative hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {notifications.filter(n => n.unread).length > 0 && (
                <div className="absolute -top-1.5 -right-1.5 bg-[#f23c3c] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {notifications.filter(n => n.unread).length}
                </div>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-[52px] w-80 bg-white rounded-[24px] border border-slate-100 shadow-xl py-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="px-4 pb-3 border-b border-slate-50 flex items-center justify-between">
                  <span className="text-[13px] font-extrabold text-slate-800 tracking-tight">Notifications</span>
                  {notifications.filter(n => n.unread).length > 0 && (
                    <button
                      onClick={handleMarkAllNotificationsRead}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-[280px] overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 relative ${n.unread ? 'bg-blue-50/20' : ''}`}
                    >
                      {n.unread && (
                        <span className="absolute left-1.5 top-4 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      )}
                      <p className="text-[12px] text-slate-600 font-medium leading-normal pl-1.5">
                        <span className="font-bold text-slate-800">{n.sender}</span> {n.action} <span className="font-semibold text-blue-600">{n.target}</span>
                      </p>
                      <span className="text-[10px] text-gray-400 font-semibold block mt-1 pl-1.5">{n.time}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 pt-3 border-t border-slate-50 text-center">
                  <span className="text-[11px] font-extrabold text-blue-600 hover:underline cursor-pointer">
                    View all notifications
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'Task Board' ? (
          <div>
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="relative w-full sm:w-[280px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200/80 rounded-xl text-[14px] font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-gray-400"
                />
              </div>

              <div className="relative">
                <select className="appearance-none bg-white border border-gray-200/80 rounded-xl pl-4 pr-10 py-2.5 text-[14px] font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer min-w-[150px]">
                  <option>All Priorities</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select className="appearance-none bg-white border border-gray-200/80 rounded-xl pl-4 pr-10 py-2.5 text-[14px] font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer min-w-[150px]">
                  <option>All Members</option>
                  <option>Ahmed Raza</option>
                  <option>Fatima Khan</option>
                  <option>Usman Ali</option>
                  <option>Ayesha Malik</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Board Columns */}
            <div className="flex gap-6 overflow-x-auto pb-6 -mx-6 px-6 md:mx-0 md:px-0">
              <BoardColumn title="Not Started" icon={ClipboardList} count={taskBoardData['Not Started'].length} tasks={taskBoardData['Not Started']} />
              <BoardColumn title="In Progress" icon={Zap} count={taskBoardData['In Progress'].length} tasks={taskBoardData['In Progress']} />
              <BoardColumn title="Review" icon={Eye} count={taskBoardData['Review'].length} tasks={taskBoardData['Review']} />
              <BoardColumn title="Completed" icon={CheckCircle2} count={taskBoardData['Completed'].length} tasks={taskBoardData['Completed']} />
            </div>
          </div>
        ) : activeTab === 'Dashboard' ? (
          <div className="space-y-8">
            {/* 3. Project Progress Overview (Blue Card) */}
            <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] rounded-[24px] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/10">
              {/* Faded FYP text background */}
              <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 text-[100px] md:text-[140px] font-black text-white/10 pointer-events-none tracking-tighter select-none">
                FYP
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center font-bold text-[20px] backdrop-blur-sm shrink-0">
                    {user?.avatar || 'ST'}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[28px] font-extrabold flex items-center gap-2">
                      Welcome back, {user?.name || 'Student'}!
                    </h3>
                    <p className="text-blue-100/80 font-medium text-[15px] mt-1">
                      AI-Powered Recommendation System · Sprint 2 of 4
                    </p>

                    <div className="mt-8 flex items-center gap-6">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200/80 mb-2">Overall Progress</span>
                        <span className="text-[42px] font-black leading-none tracking-tight">25%</span>
                      </div>

                      <div className="flex flex-col justify-end w-full max-w-[320px] min-w-[240px] mb-1">
                        <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/10">
                          <div className="h-full bg-emerald-400 w-1/4 rounded-full"></div>
                        </div>
                        <span className="text-[12px] text-blue-100/70 font-medium mt-2">5 of 20 tasks completed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats inside blue card */}
                <div className="flex items-center justify-center gap-8 lg:mr-16 w-full lg:w-auto">
                  <div className="flex flex-col items-center">
                    <Zap className="w-6 h-6 text-white mb-2" fill="currentColor" />
                    <span className="text-[26px] font-black leading-none">5</span>
                    <span className="text-[12px] text-blue-200 font-semibold mt-1">Active</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg className="w-6 h-6 text-white mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                    <span className="text-[26px] font-black leading-none">3</span>
                    <span className="text-[12px] text-blue-200 font-semibold mt-1">Review</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <ClipboardList className="w-6 h-6 text-white mb-2" />
                    <span className="text-[26px] font-black leading-none">7</span>
                    <span className="text-[12px] text-blue-200 font-semibold mt-1">Pending</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-gray-500 mb-1">Total Tasks</span>
                  <span className="text-[32px] font-black text-[#1e293b] leading-none mb-2">20</span>
                  <span className="text-[12px] font-medium text-gray-400">All tasks in project</span>
                </div>
                <div className="w-[52px] h-[52px] rounded-[14px] bg-blue-50 flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-[#2563eb]" />
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-gray-500 mb-1">Completed</span>
                  <span className="text-[32px] font-black text-[#16a34a] leading-none mb-2">5</span>
                  <span className="text-[12px] font-medium text-gray-400">25% completion rate</span>
                </div>
                <div className="w-[52px] h-[52px] rounded-[14px] bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-[#16a34a]" fill="currentColor" />
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-gray-500 mb-1">In Progress</span>
                  <span className="text-[32px] font-black text-[#2563eb] leading-none mb-2">5</span>
                  <span className="text-[12px] font-medium text-gray-400">Currently active</span>
                </div>
                <div className="w-[52px] h-[52px] rounded-[14px] bg-blue-50 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#2563eb]" fill="currentColor" />
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-gray-500 mb-1">Pending</span>
                  <span className="text-[32px] font-black text-[#ea580c] leading-none mb-2">7</span>
                  <span className="text-[12px] font-medium text-gray-400">3 in review</span>
                </div>
                <div className="w-[52px] h-[52px] rounded-[14px] bg-orange-50 flex items-center justify-center">
                  <Hourglass className="w-6 h-6 text-[#ea580c]" />
                </div>
              </div>
            </div>

            {/* 5. Main Layout Grid (Deadlines & Activity) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left: Upcoming Deadlines */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-[#1e3a8a] stroke-[2.5]" />
                  <h3 className="text-[20px] font-extrabold text-[#1e293b]">Upcoming Deadlines</h3>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'Data Preprocessing Pipeline', priority: 'high', assignee: 'Ayesha Malik', date: 'Feb 12', overdue: true },
                    { title: 'Mobile Responsiveness', priority: 'medium', assignee: 'Fatima Khan', date: 'Feb 13', overdue: true },
                    { title: 'API Integration Testing', priority: 'medium', assignee: 'Usman Ali', date: 'Feb 14', overdue: true },
                    { title: 'Frontend Auth & Routing', priority: 'high', assignee: 'Fatima Khan', date: 'Feb 15', overdue: true },
                    { title: 'Code Review & Refactoring', priority: null, assignee: '', date: 'Feb 16', overdue: false }
                  ].map((task, idx) => (
                    <div key={idx} className="bg-white rounded-[16px] p-5 shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#2563eb]/30 transition-colors cursor-pointer relative overflow-hidden">
                      {/* Left priority border highlight */}
                      {task.priority === 'high' && <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#dc2626]"></div>}
                      {task.priority === 'medium' && <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#eab308]"></div>}

                      <div className="flex flex-col gap-1.5 ml-1">
                        <span className="font-bold text-[#1e293b] text-[15px]">{task.title}</span>
                        {(task.priority || task.assignee) && (
                          <div className="flex items-center gap-3">
                            {task.priority && (
                              <span className={`text-[12px] font-bold uppercase tracking-wider ${task.priority === 'high' ? 'text-[#dc2626]' : 'text-[#eab308]'}`}>
                                {task.priority}
                              </span>
                            )}
                            {task.assignee && (
                              <span className="text-[13px] font-semibold text-gray-400 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                {task.assignee}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`font-bold text-[14px] ${task.overdue ? 'text-[#dc2626]' : 'text-[#1e293b]'}`}>
                          {task.date}
                        </span>
                        {task.overdue && (
                          <span className="text-[12px] font-bold text-[#dc2626]">
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Recent Activity */}
              <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 lg:h-max">
                <div className="flex items-center gap-2 mb-8">
                  <svg className="w-5 h-5 text-[#1e3a8a] stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-[20px] font-extrabold text-[#1e293b]">Recent Activity</h3>
                </div>

                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute top-4 bottom-4 left-[19px] w-0.5 bg-gray-200"></div>

                  <div className="space-y-8 relative z-10">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-[13px] shrink-0 border-4 border-white shadow-sm ring-1 ring-gray-100">
                        AR
                      </div>
                      <div className="flex flex-col mt-1">
                        <p className="text-[14px] text-gray-600 font-medium leading-relaxed">
                          <span className="font-bold text-[#1e293b]">Ahmed Raza</span> completed <span className="text-[#2563eb] font-semibold">"System Architecture Design"</span>
                        </p>
                        <span className="text-[12px] font-semibold text-gray-400 mt-1">2 h ago</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-[13px] shrink-0 border-4 border-white shadow-sm ring-1 ring-gray-100">
                        FK
                      </div>
                      <div className="flex flex-col mt-1">
                        <p className="text-[14px] text-gray-600 font-medium leading-relaxed">
                          <span className="font-bold text-[#1e293b]">Fatima Khan</span> moved to Review <span className="text-[#2563eb] font-semibold">"Mobile Responsiveness"</span>
                        </p>
                        <span className="text-[12px] font-semibold text-gray-400 mt-1">3 h ago</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-[13px] shrink-0 border-4 border-white shadow-sm ring-1 ring-gray-100">
                        AM
                      </div>
                      <div className="flex flex-col mt-1">
                        <p className="text-[14px] text-gray-600 font-medium leading-relaxed">
                          <span className="font-bold text-[#1e293b]">Ayesha Malik</span> updated progress <span className="text-[#2563eb] font-semibold">"ML Model Training - Phase 1"</span>
                        </p>
                        <span className="text-[12px] font-semibold text-gray-400 mt-1">4 h ago</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-[13px] shrink-0 border-4 border-white shadow-sm ring-1 ring-gray-100">
                        UA
                      </div>
                      <div className="flex flex-col mt-1">
                        <p className="text-[14px] text-gray-600 font-medium leading-relaxed">
                          <span className="font-bold text-[#1e293b]">Usman Ali</span> submitted review <span className="text-[#2563eb] font-semibold">"API Integration Testing"</span>
                        </p>
                        <span className="text-[12px] font-semibold text-gray-400 mt-1">5 h ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'Team' ? (
          <div className="space-y-8">
            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Ahmed Raza', role: 'Team Lead', avatar: 'AR', assigned: 6, done: 2, active: 1, productivity: 33, color: 'bg-[#1e3a8a]' },
                { name: 'Fatima Khan', role: 'Frontend Dev', avatar: 'FK', assigned: 5, done: 2, active: 2, productivity: 40, color: 'bg-[#334155]' },
                { name: 'Usman Ali', role: 'Backend Dev', avatar: 'UA', assigned: 6, done: 1, active: 1, productivity: 17, color: 'bg-[#2563eb]' },
                { name: 'Ayesha Malik', role: 'ML Engineer', avatar: 'AM', assigned: 3, done: 0, active: 1, productivity: 0, color: 'bg-[#1d4ed8]' }
              ].map((member, idx) => (
                <div key={idx} className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 ${member.color} text-white rounded-2xl flex items-center justify-center text-[18px] font-bold border border-white shadow-sm ring-1 ring-gray-100 shrink-0`}>
                      {member.avatar}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-[16px] font-extrabold text-[#1e293b] hover:text-[#2563eb] transition-colors cursor-pointer leading-tight">
                        {member.name}
                      </h3>
                      <p className="text-[12px] text-gray-400 font-semibold mt-0.5">{member.role}</p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3 my-6">
                    <div className="bg-[#eff6ff] border border-blue-50/50 rounded-xl p-2.5 flex flex-col items-center justify-center">
                      <span className="text-[16px] font-black text-[#1e3a8a] leading-none">{member.assigned}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Assigned</span>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 flex flex-col items-center justify-center">
                      <span className="text-[16px] font-black text-emerald-700 leading-none">{member.done}</span>
                      <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider mt-1.5">Done</span>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-2.5 flex flex-col items-center justify-center">
                      <span className="text-[16px] font-black text-blue-700 leading-none">{member.active}</span>
                      <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider mt-1.5">Active</span>
                    </div>
                  </div>

                  {/* Productivity */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold text-gray-400">Productivity</span>
                      <span className="text-[13px] font-black text-[#1e293b]">{member.productivity}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#1e3a8a] transition-all duration-500"
                        style={{ width: `${member.productivity}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Project Supervisor Section */}
            <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-[#1e3a8a] stroke-[2.5]" />
                <h3 className="text-[15px] font-bold text-[#1e293b]">Project Supervisor</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1e3a8a] text-white flex items-center justify-center text-[16px] font-bold shrink-0 shadow-sm border border-blue-900/10">
                  TH
                </div>
                <div className="flex flex-col">
                  <h4 className="text-[16px] font-bold text-[#1e293b] leading-tight">Dr. Tariq Hassan</h4>
                  <p className="text-[13px] text-gray-400 font-semibold mt-0.5">
                    Associate Professor <span className="text-gray-300 mx-1.5">•</span> Department of Computer Science
                  </p>
                  <p className="text-[13px] text-gray-400 font-semibold mt-0.5">
                    tariq.hassan@cuiatd.edu.pk <span className="text-gray-300 mx-1.5">•</span> Office Hours: Mon/Wed 2-4 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'Analytics' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 pb-6 bg-slate-50/50 mt-2">
            {/* Task Status Doughnut Chart */}
            <div className="bg-white border border-gray-100 rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col items-center">
              <h3 className="text-[16px] font-bold text-[#1e293b] self-start mb-6">Task Status</h3>
              <div className="relative w-[220px] h-[220px] flex items-center justify-center font-poppins">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: 5, color: '#16a34a' },
                        { name: 'In Progress', value: 5, color: '#2563eb' },
                        { name: 'Review', value: 3, color: '#d97706' },
                        { name: 'Not Started', value: 7, color: '#cbd5e1' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={0}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    >
                      {[
                        { name: 'Completed', value: 5, color: '#16a34a' },
                        { name: 'In Progress', value: 5, color: '#2563eb' },
                        { name: 'Review', value: 3, color: '#d97706' },
                        { name: 'Not Started', value: 7, color: '#cbd5e1' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Inner label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-[26px] font-black text-slate-800 leading-none">20</span>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">Total Tasks</span>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="grid grid-cols-2 gap-4 mt-8 w-full">
                {[
                  { label: 'Not Started', count: 7, color: 'bg-[#cbd5e1]' },
                  { label: 'In Progress', count: 5, color: 'bg-[#2563eb]' },
                  { label: 'Review', count: 3, color: 'bg-[#d97706]' },
                  { label: 'Completed', count: 5, color: 'bg-[#16a34a]' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className={`w-3 h-3 rounded-full ${item.color} shrink-0`}></span>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-extrabold text-slate-700 leading-tight">{item.label}</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-0.5">{item.count} tasks</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Member Contribution Bar Chart */}
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[16px] font-bold text-[#1e293b]">Member Contribution</h3>
                
                {/* Legend */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-[#e2e8f0]"></span>
                    <span className="text-[12px] font-bold text-slate-500">Assigned</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-[#1e3a8a]"></span>
                    <span className="text-[12px] font-bold text-slate-500">Completed</span>
                  </div>
                </div>
              </div>

              {/* Recharts Bar Chart */}
              <div className="relative flex-grow h-[280px] mt-6 w-full pr-4 font-poppins">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Ahmed', assigned: 6, completed: 2 },
                      { name: 'Fatima', assigned: 5, completed: 2 },
                      { name: 'Usman', assigned: 6, completed: 1 },
                      { name: 'Ayesha', assigned: 3, completed: 0 }
                    ]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    barGap={10}
                  >
                    <CartesianGrid vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 13, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                      domain={[0, 6]}
                      ticks={[0, 1, 2, 3, 4, 5, 6]}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-800 text-white text-[11px] font-bold px-3 py-2 rounded-xl shadow-lg border border-slate-700/50 flex flex-col gap-1">
                              <p className="text-slate-300 font-extrabold text-[12px] mb-0.5">{payload[0].payload.name}</p>
                              <p className="text-[#93c5fd]">{payload[0].value} Assigned</p>
                              {payload[1] && <p className="text-[#34d399]">{payload[1].value} Completed</p>}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="assigned" 
                      fill="#e2e8f0" 
                      radius={[6, 6, 0, 0]} 
                      maxBarSize={32}
                      isAnimationActive={true}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                    <Bar 
                      dataKey="completed" 
                      fill="#1e3a8a" 
                      radius={[6, 6, 0, 0]} 
                      maxBarSize={32}
                      isAnimationActive={true}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : activeTab === 'Calendar' ? (
          <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] mt-2 mx-6 mb-6">
            <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold text-base">
              <Calendar className="text-[#0f2c59] w-4.5 h-4.5" />
              <h3 className="tracking-wide">Deadlines List</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                { day: '12', month: 'Feb', title: 'Data Preprocessing Pipeline', priority: 'high' },
                { day: '13', month: 'Feb', title: 'Mobile Responsiveness', priority: 'medium' },
                { day: '14', month: 'Feb', title: 'API Integration Testing', priority: 'medium' },
                { day: '15', month: 'Feb', title: 'Frontend Auth & Routing', priority: 'high' },
                { day: '16', month: 'Feb', title: 'Code Review & Refactoring', priority: 'medium' },
                { day: '17', month: 'Feb', title: 'Dashboard UI Components', priority: 'medium' },
                { day: '18', month: 'Feb', title: 'REST API Development', priority: 'high' },
                { day: '20', month: 'Feb', title: 'ML Model Training — Phase 1', priority: 'high' },
                { day: '22', month: 'Feb', title: 'Supervisor Meeting Slides - S3', priority: 'medium' },
                { day: '28', month: 'Feb', title: 'Performance Optimization', priority: 'low' }
              ].map((deadline, idx) => {
                const priorityStyles = {
                  high: 'bg-red-50/60 border-red-100 text-red-600',
                  medium: 'bg-amber-50/60 border-amber-100 text-amber-600',
                  low: 'bg-emerald-50/60 border-emerald-100 text-emerald-600'
                }[deadline.priority];

                return (
                  <div key={idx} className="bg-[#fef2f2] border-l-4 border-red-500 rounded-r-xl px-4 py-3 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] w-full group hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center">
                      {/* Left Date Block */}
                      <div className="bg-red-100/50 w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 mr-3.5">
                        <span className="text-red-600 font-bold text-base leading-none">{deadline.day}</span>
                        <span className="text-red-400 text-[10px] font-bold uppercase mt-0.5">{deadline.month}</span>
                      </div>

                      {/* Middle Info */}
                      <div className="flex-1 flex flex-col min-w-0 mr-4">
                        <span className="text-slate-800 font-bold text-sm truncate">
                          {deadline.title}
                        </span>
                        <span className={`mt-1 self-start inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${priorityStyles}`}>
                          {deadline.priority}
                        </span>
                      </div>
                    </div>

                    {/* Right Overdue Tag */}
                    <span className="bg-red-100/60 text-red-600 text-[10px] font-extrabold px-3 py-1 rounded-full border border-red-200/50 tracking-wider shrink-0 uppercase">
                      OVERDUE
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="px-6 pb-6 bg-slate-50/50 space-y-8 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 1,
                  name: 'Dr. Ali Hassan',
                  designation: 'Associate Professor',
                  expertise: 'AI, Machine Learning, Computer Vision',
                  avatar: 'AH'
                },
                {
                  id: 2,
                  name: 'Dr. Zeeshan Ali',
                  designation: 'Assistant Professor',
                  expertise: 'Web Technologies, Cloud Computing',
                  avatar: 'ZA'
                },
                {
                  id: 3,
                  name: 'Ms. Sana Malik',
                  designation: 'Lecturer',
                  expertise: 'IoT, Embedded Systems, Robotics',
                  avatar: 'SM'
                }
              ].map((supervisor) => (
                <div
                  key={supervisor.id}
                  className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 group"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center text-[18px] font-bold border border-blue-100/50 shrink-0">
                      {supervisor.avatar}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-[18px] font-bold text-[#1e293b] tracking-tight">{supervisor.name}</h3>
                      <p className="text-[13px] text-gray-400 font-medium">{supervisor.designation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-[#1e293b] font-semibold text-[13px] mb-8 leading-snug">
                    <Tag className="w-4 h-4 text-blue-600 shrink-0" />
                    {supervisor.expertise}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleRequestSupervisor(supervisor.id, supervisor.name)}
                      className={`flex-1 py-3.5 rounded-xl font-bold text-[14px] tracking-wide shadow-lg transition-all active:scale-[0.98] ${
                        requestedSupervisors[supervisor.id]
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-none cursor-default'
                          : 'bg-[#1e3a8a] hover:bg-[#172554] text-white shadow-blue-900/10 cursor-pointer'
                      }`}
                    >
                      {requestedSupervisors[supervisor.id] ? 'Requested (Pending)' : 'Request Supervisor'}
                    </button>
                    <button className="w-[52px] h-[52px] border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all cursor-pointer">
                      <Users className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form
            onSubmit={handleCreateTask}
            className="bg-white rounded-[28px] max-w-md w-full p-6 border border-slate-100 shadow-2xl relative flex flex-col gap-5 animate-in slide-in-from-bottom-8 duration-300"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> Create New Task
              </h3>
              <button
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="Enter task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Priority</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {['low', 'medium', 'high'].map((p) => {
                    const colors = {
                      low: 'border-emerald-100 text-emerald-600 bg-emerald-50/50',
                      medium: 'border-amber-100 text-amber-600 bg-amber-50/50',
                      high: 'border-red-100 text-red-600 bg-red-50/50'
                    }[p];
                    const activeColors = {
                      low: 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20',
                      medium: 'bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-500/20',
                      high: 'bg-red-500 border-red-500 text-white shadow-sm shadow-red-500/20'
                    }[p];
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setNewTaskPriority(p)}
                        className={`py-2 rounded-xl text-xs font-bold border capitalize transition-all cursor-pointer ${
                          newTaskPriority === p ? activeColors : colors
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-semibold">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {['Frontend', 'Backend', 'Documentation', 'ML', 'Testing', 'Research', 'Design'].map((cat) => {
                    const isActive = newTaskCategories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => {
                          if (isActive) {
                            setNewTaskCategories(newTaskCategories.filter(c => c !== cat));
                          } else {
                            setNewTaskCategories([...newTaskCategories, cat]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-semibold">Due Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Feb 22"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-semibold">Assignee</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-slate-700 cursor-pointer"
                  >
                    <option value="AR">AR - Ahmed Raza</option>
                    <option value="FK">FK - Fatima Khan</option>
                    <option value="UA">UA - Usman Ali</option>
                    <option value="AM">AM - Ayesha Malik</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="flex-1 py-3 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-[#2563eb] text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form
            onSubmit={handleUpdateTask}
            className="bg-white rounded-[28px] max-w-md w-full p-6 border border-slate-100 shadow-2xl relative flex flex-col gap-5 animate-in slide-in-from-bottom-8 duration-300"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-black text-slate-800 tracking-tight flex items-center gap-2">
                Edit Task Details
              </h3>
              <button
                type="button"
                onClick={() => setShowEditTaskModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-semibold">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="Enter task title..."
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-semibold">Priority</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {['low', 'medium', 'high'].map((p) => {
                    const colors = {
                      low: 'border-emerald-100 text-emerald-600 bg-emerald-50/50',
                      medium: 'border-amber-100 text-amber-600 bg-amber-50/50',
                      high: 'border-red-100 text-red-600 bg-red-50/50'
                    }[p];
                    const activeColors = {
                      low: 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20',
                      medium: 'bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-500/20',
                      high: 'bg-red-500 border-red-500 text-white shadow-sm shadow-red-500/20'
                    }[p];
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setSelectedTask({ ...selectedTask, priority: p })}
                        className={`py-2 rounded-xl text-xs font-bold border capitalize transition-all cursor-pointer ${
                          selectedTask.priority === p ? activeColors : colors
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-semibold">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {['Frontend', 'Backend', 'Documentation', 'ML', 'Testing', 'Research', 'Design'].map((cat) => {
                    const isActive = selectedTask.categories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => {
                          if (isActive) {
                            setSelectedTask({
                              ...selectedTask,
                              categories: selectedTask.categories.filter(c => c !== cat)
                            });
                          } else {
                            setSelectedTask({
                              ...selectedTask,
                              categories: [...selectedTask.categories, cat]
                            });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-semibold">Due Date</label>
                  <input
                    type="text"
                    value={selectedTask.date}
                    onChange={(e) => setSelectedTask({ ...selectedTask, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-semibold">Assignee</label>
                  <select
                    value={selectedTask.assignee}
                    onChange={(e) => setSelectedTask({ ...selectedTask, assignee: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-slate-700 cursor-pointer"
                  >
                    <option value="AR">AR - Ahmed Raza</option>
                    <option value="FK">FK - Fatima Khan</option>
                    <option value="UA">UA - Usman Ali</option>
                    <option value="AM">AM - Ayesha Malik</option>
                  </select>
                </div>
              </div>

              {selectedTask.progress !== undefined && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-semibold">Progress ({selectedTask.progress}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedTask.progress}
                    onChange={(e) => setSelectedTask({ ...selectedTask, progress: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowEditTaskModal(false)}
                className="flex-1 py-3 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-[#2563eb] text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Interactive Success Toast Overlay */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white rounded-2xl px-5 py-3.5 shadow-xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />
          </div>
          <span className="text-xs font-bold tracking-tight pr-1">{toast}</span>
        </div>
      )}
    </div>
  );
};

export default TaskManager;


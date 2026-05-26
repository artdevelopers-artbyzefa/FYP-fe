import apiClient from '../api/apiClient';
import {
  ADMIN_DASHBOARD_STATS_URL,
  ADMIN_GET_USERS_URL,
  ADMIN_CREATE_USER_URL,
  ADMIN_RESET_PASSWORD_URL,
  ADMIN_TOGGLE_USER_STATUS_URL,
  ADMIN_GET_RBAC_URL,
  ADMIN_GET_AUDIT_LOGS_URL,
  ADMIN_SYSTEM_HEALTH_URL,
  ADMIN_TRIGGER_BACKUP_URL,
  ADMIN_CLEAR_CACHE_URL,
  ADMIN_NOTIFICATIONS_URL,
} from '../utils/constants/api-url.constant';

// ============================================================================
// BACKEND DEVELOPER INSTRUCTIONS
// ============================================================================
// Currently, these services use a "try/catch" fallback mechanism. 
// They attempt to hit the real API endpoint first. Because the backend is not 
// yet connected, the request fails, and the catch block returns the DEMO DATA.
// 
// WHEN BACKEND IS READY:
// 1. Ensure the API URLs in `api-url.constant.js` match your backend routes.
// 2. The `try` blocks will automatically succeed and use dynamic data.
// 3. You can then safely DELETE all the DEMO_ objects below and remove the 
//    `try/catch` wrappers to let errors propagate naturally.
// ============================================================================

// ─── Demo Data (Safe to delete after API integration) ──────────────────────────

const DEMO_STATS = {
  totalUsers: 512,
  activeRoles: 6,
  auditLogEntries: '12.4k',
  systemHealth: '99.9%',
};

const DEMO_USERS = [
  { id: 'U001', name: 'Dr. Ali Hassan',     email: 'supervisor@cuiatd.edu.pk',  role: 'Faculty Supervisor',    status: 'Active' },
  { id: 'U002', name: 'Dr. Sara Malik',     email: 'incharge@cuiatd.edu.pk',    role: 'FYP Office In-charge',  status: 'Active' },
  { id: 'U003', name: 'Noman Abbasi',       email: 'assistant@cuiatd.edu.pk',   role: 'FYP Office Assistant',  status: 'Active' },
  { id: 'U004', name: 'Engr. Kamran Shah',  email: 'industry@cuiatd.edu.pk',    role: 'Industry Supervisor',   status: 'Active' },
  { id: 'U005', name: 'Prof. Asad Khalil',  email: 'hod@cuiatd.edu.pk',         role: 'HOD',                   status: 'Active' },
  { id: 'U006', name: 'Tariq Mehmood',      email: 'admin@cuiatd.edu.pk',       role: 'System Administrator',  status: 'Active' },
];

const DEMO_RBAC = [
  { role: 'FYP Office Assistant',  permissions: 'User creation, student management, faculty profiles, committee locking, results view',           users: 3,  status: 'Enforced' },
  { role: 'FYP Office In-charge',  permissions: 'Rubric builder (100% validation), academic session lock, supervision requests, grievance SLAs',  users: 2,  status: 'Enforced' },
  { role: 'Faculty Supervisor',    permissions: 'Research tags, availability grid, proposal workflows, weekly logs, committee scoring',             users: 42, status: 'Enforced' },
  { role: 'HOD',                   permissions: 'Executive dashboard, escalated grievances (binding rulings), faculty workload oversight',          users: 1,  status: 'Enforced' },
  { role: 'System Administrator',  permissions: 'User account management, RBAC checklists, system audit logs, database backups',                  users: 2,  status: 'Enforced' },
  { role: 'Industry Supervisor',   permissions: 'View assigned projects, download thesis documents, submit external rubric scorecard',             users: 8,  status: 'Enforced' },
];

const DEMO_AUDIT_LOGS = [
  { timestamp: '2026-05-17 15:30:12', user: 'admin@cuiatd.edu.pk',     action: 'DB_BACKUP',       entity: 'Full System Snapshot (Success)',         ip: '192.168.1.10'  },
  { timestamp: '2026-05-17 14:32:10', user: 'incharge@cuiatd.edu.pk',  action: 'RUBRIC_UPDATE',   entity: 'Proposal Evaluation Rubric v4.0',         ip: '192.168.1.45'  },
  { timestamp: '2026-05-17 11:15:02', user: 'assistant@cuiatd.edu.pk', action: 'COMMITTEE_LOCK',  entity: 'FEC-FYP1-A (15% Evaluated)',              ip: '192.168.1.112' },
  { timestamp: '2026-05-16 10:20:05', user: 'admin@cuiatd.edu.pk',     action: 'ACCOUNT_CREATE',  entity: 'User: Engr. Kamran Shah (Industry)',      ip: '192.168.1.10'  },
  { timestamp: '2026-05-16 09:05:33', user: 'supervisor@cuiatd.edu.pk',action: 'USER_AUTH',       entity: 'Login Success — Dr. Ali Hassan',          ip: '192.168.1.88'  },
];

const DEMO_HEALTH = {
  cpuLoad: 14.2,
  ramUsed: 4.1,
  ramTotal: 16,
  dbUsed: 18.5,
  dbTotal: 100,
  uptime: '99.98% (42 Days)',
};

const DEMO_NOTIFICATIONS = [
  {
    id: 'an1',
    icon: 'database',
    title: 'Database Backup Completed',
    body: 'Automated full snapshot backup completed successfully at 04:00 AM.',
    time: '6 hours ago',
    read: false,
    color: 'rose',
  },
];

// ─── Service Functions ──────────────────────────────────────────────────────────

/** Get admin dashboard overview stats */
export const getAdminStats = async () => {
  try {
    const res = await apiClient.get(ADMIN_DASHBOARD_STATS_URL);
    return res.data;
  } catch (error) {
    return DEMO_STATS;
  }
};

/** Get full user accounts list */
export const getAdminUsers = async () => {
  try {
    const res = await apiClient.get(ADMIN_GET_USERS_URL);
    return res.data;
  } catch (error) {
    return DEMO_USERS;
  }
};

/**
 * Create a new user account
 * @param {{ name: string, email: string, role: string }} payload
 */
export const createAdminUser = async (payload) => {
  try {
    const res = await apiClient.post(ADMIN_CREATE_USER_URL, payload);
    return res.data;
  } catch (error) {
    return { success: true, message: 'User created (demo mode).' };
  }
};

/**
 * Send password reset email to a user
 * @param {string} userId
 */
export const resetUserPassword = async (userId) => {
  try {
    const res = await apiClient.post(ADMIN_RESET_PASSWORD_URL.replace(':id', userId));
    return res.data;
  } catch (error) {
    return { success: true, message: 'Password reset email sent (demo mode).' };
  }
};

/**
 * Toggle user account active/inactive status
 * @param {string} userId
 */
export const toggleUserStatus = async (userId) => {
  try {
    const res = await apiClient.post(ADMIN_TOGGLE_USER_STATUS_URL.replace(':id', userId));
    return res.data;
  } catch (error) {
    return { success: true, message: 'User status updated (demo mode).' };
  }
};

/** Get RBAC role permission matrix */
export const getRbacMatrix = async () => {
  try {
    const res = await apiClient.get(ADMIN_GET_RBAC_URL);
    return res.data;
  } catch (error) {
    return DEMO_RBAC;
  }
};

/** Get audit log entries */
export const getAuditLogs = async () => {
  try {
    const res = await apiClient.get(ADMIN_GET_AUDIT_LOGS_URL);
    return res.data;
  } catch (error) {
    return DEMO_AUDIT_LOGS;
  }
};

/** Get system health metrics */
export const getSystemHealth = async () => {
  try {
    const res = await apiClient.get(ADMIN_SYSTEM_HEALTH_URL);
    return res.data;
  } catch (error) {
    return DEMO_HEALTH;
  }
};

/** Trigger a database backup */
export const triggerDatabaseBackup = async () => {
  try {
    const res = await apiClient.post(ADMIN_TRIGGER_BACKUP_URL);
    return res.data;
  } catch (error) {
    return { success: true, message: 'Database backup initiated (demo mode).' };
  }
};

/** Clear application cache */
export const clearApplicationCache = async () => {
  try {
    const res = await apiClient.post(ADMIN_CLEAR_CACHE_URL);
    return res.data;
  } catch (error) {
    return { success: true, message: 'Application cache cleared (demo mode).' };
  }
};

/** Get admin notifications */
export const getAdminNotifications = async () => {
  try {
    const res = await apiClient.get(ADMIN_NOTIFICATIONS_URL);
    return res.data;
  } catch (error) {
    return DEMO_NOTIFICATIONS;
  }
};

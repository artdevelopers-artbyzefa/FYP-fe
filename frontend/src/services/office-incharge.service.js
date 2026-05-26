import apiClient from '../api/apiClient';
import {
  INCHARGE_DASHBOARD_API_URL,
  INCHARGE_RUBRICS_API_URL,
  INCHARGE_SESSIONS_API_URL,
  INCHARGE_SUPERVISION_REQS_API_URL,
  INCHARGE_COMMITTEE_OVERSIGHT_API_URL,
  INCHARGE_GRIEVANCES_API_URL,
  INCHARGE_FACULTY_REPORTS_API_URL,
  INCHARGE_STUDENT_REPORTS_API_URL,
  INCHARGE_AUDIT_LOG_API_URL
} from '../utils/constants/api-url.constant';

const DEMO_DASHBOARD_STATS = {
  activeRubrics: 4,
  pendingSupervisionReqs: 2,
  openGrievances: 3,
  slaBreaches: 1,
  activeSession: 'SP26'
};

const DEMO_RUBRICS = [
  { version: 'Proposal Rubric v3.0', date: 'Jan 10, 2026', status: 'Archived' },
  { version: 'FYP Evaluation Rubric v2.1', date: 'Sep 15, 2025', status: 'Archived' }
];

const DEMO_SESSIONS = {
  sessionName: 'Spring 2026 (SP26)',
  duration: 'Feb 01, 2026 - Jul 15, 2026',
  repeats: [
    { name: 'Faizan Ali', regNo: 'SP21-BCS-031', status: 'Failing Grade (FYP-1)' }
  ]
};

const DEMO_SUPERVISION_REQS = [
  { faculty: 'Dr. Ali Hassan', designation: 'Associate Professor', load: 4, requested: 1, justification: 'Exceptional AI traffic signal optimization project.' },
  { faculty: 'Dr. Fatima Khan', designation: 'Assistant Professor', load: 4, requested: 2, justification: 'Cybersecurity groups transferred from departing faculty.' }
];

const DEMO_COMMITTEE_OVERSIGHT = {
  boards: [
    { name: 'PEC-1 (AI & Vision)', head: 'Dr. Ali Hassan', members: 4, schedule: 'Published (May 15)' },
    { name: 'FEC-FYP2-B', head: 'Dr. Sara Malik', members: 3, schedule: 'Upcoming (Jun 10)' }
  ],
  requests: [
    { title: 'FEC-FYP2-B Head Re-assignment', description: 'Request from Dr. Sara Malik to transfer committee head responsibilities to Dr. Fatima Khan.' }
  ]
};

const DEMO_GRIEVANCES = [
  { id: 'GRV-089', student: 'Ahmed Farooq (SP21-BCS-001)', category: 'Evaluation Dispute', date: 'May 02, 2026', status: 'Under Investigation', sla: 'SLA Breach (15 Days)', desc: 'Calculation error in CLO-2 summation.' },
  { id: 'GRV-090', student: 'Aima Khalid (SP21-BCS-019)', category: 'Supervision Dispute', date: 'May 15, 2026', status: 'New Filing', sla: 'SLA Warning (2 Days Left)', desc: 'Supervisor has not responded for 3 weeks.' }
];

const DEMO_FACULTY_REPORTS = [
  { name: 'Dr. Ali Hassan', dept: 'Computer Science', groups: 4, workload: '100%', evalScore: '4.8/5.0' }
];

const DEMO_STUDENT_REPORTS = [
  { name: 'Ahmed Farooq', regNo: 'SP21-BCS-001', progress: 25, group: 'G-042', supervisor: 'Dr. Ali Hassan', score: '8.5 / 10 (A)' }
];

const DEMO_AUDIT_LOGS = [
  { time: '2026-05-17 14:32:10', user: 'incharge@cuiatd.edu.pk', type: 'RUBRIC_UPDATE', entity: 'Proposal Evaluation Rubric v4.0', ip: '192.168.1.45' },
  { time: '2026-05-17 11:15:02', user: 'assistant@cuiatd.edu.pk', type: 'COMMITTEE_LOCK', entity: 'FEC-FYP1-A (15% Evaluated)', ip: '192.168.1.112' },
  { time: '2026-05-16 09:00:15', user: 'supervisor@cuiatd.edu.pk', type: 'USER_AUTH', entity: 'Session Login (Success)', ip: '119.156.72.18' }
];

export const getInchargeDashboardStats = async () => {
  try {
    const res = await apiClient.get(INCHARGE_DASHBOARD_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_DASHBOARD_STATS };
  }
};

export const getInchargeRubrics = async () => {
  try {
    const res = await apiClient.get(INCHARGE_RUBRICS_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_RUBRICS };
  }
};

export const getInchargeSessions = async () => {
  try {
    const res = await apiClient.get(INCHARGE_SESSIONS_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_SESSIONS };
  }
};

export const getInchargeSupervisionReqs = async () => {
  try {
    const res = await apiClient.get(INCHARGE_SUPERVISION_REQS_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_SUPERVISION_REQS };
  }
};

export const getInchargeCommitteeOversight = async () => {
  try {
    const res = await apiClient.get(INCHARGE_COMMITTEE_OVERSIGHT_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_COMMITTEE_OVERSIGHT };
  }
};

export const getInchargeGrievances = async () => {
  try {
    const res = await apiClient.get(INCHARGE_GRIEVANCES_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_GRIEVANCES };
  }
};

export const getInchargeFacultyReports = async () => {
  try {
    const res = await apiClient.get(INCHARGE_FACULTY_REPORTS_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_FACULTY_REPORTS };
  }
};

export const getInchargeStudentReports = async () => {
  try {
    const res = await apiClient.get(INCHARGE_STUDENT_REPORTS_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_STUDENT_REPORTS };
  }
};

export const getInchargeAuditLogs = async () => {
  try {
    const res = await apiClient.get(INCHARGE_AUDIT_LOG_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_AUDIT_LOGS };
  }
};

export const getPhases = async () => {
  return await apiClient.get('/phases');
};

export const updateActivePhase = async (key) => {
  return await apiClient.put('/phases/active', { key });
};

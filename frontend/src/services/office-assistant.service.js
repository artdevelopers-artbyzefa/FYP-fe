import apiClient from '../api/apiClient';
import {
  OFFICE_DASHBOARD_API_URL,
  OFFICE_USERS_API_URL,
  OFFICE_STUDENTS_API_URL,
  OFFICE_FACULTY_API_URL,
  OFFICE_PROJECTS_API_URL,
  OFFICE_CONTENT_API_URL,
  OFFICE_EXTERNAL_API_URL,
  OFFICE_RESULTS_API_URL,
  OFFICE_CREATE_STUDENT_API_URL,
  OFFICE_CREATE_FACULTY_API_URL
} from '../utils/constants/api-url.constant';

const DEMO_DASHBOARD_STATS = {
  totalUsers: 142,
  activeUsers: 'Active',
  fypStudents: 284,
  studentsStatus: 'Enrolled',
  activeProjects: 76,
  projectsStatus: 'Assigned',
  committees: 8,
  committeesStatus: 'Operational'
};

const DEMO_USERS = [
  { id: 'AH', name: 'Dr. Ali Hassan', roleDetail: 'Faculty Supervisor', email: 'supervisor@cuiatd.edu.pk', roles: ['Faculty Supervisor'], status: 'Active' },
  { id: 'FK', name: 'Dr. Fatima Khan', roleDetail: 'Faculty Supervisor', email: 'fatima@cuiatd.edu.pk', roles: ['Faculty Supervisor'], status: 'Locked' },
  { id: 'SM', name: 'Dr. Sara Malik', roleDetail: 'FYP Office In-charge', email: 'incharge@cuiatd.edu.pk', roles: ['FYP Office In-charge'], status: 'Active' },
  { id: 'UQ', name: 'Dr. Usman Qureshi', roleDetail: 'Industry Supervisor', email: 'evaluator@cuiatd.edu.pk', roles: ['Industry Supervisor'], status: 'Deactivated' }
];

const DEMO_STUDENTS = [
  { id: 'SP21-BCS-001', name: 'Ahmed Farooq', status: 'FYP-1', project: 'AI-Powered Traffic Management System Using Computer Vision', progress: '25%', supervisor: 'Dr. Ali Hassan' },
  { id: 'SP21-BCS-019', name: 'Aima Khalid', status: 'FYP-2', project: 'Federated Learning for Medical Diagnosis', progress: '75%', supervisor: 'Dr. Sara Malik' },
  { id: 'SP21-BCS-031', name: 'Faizan Ali', status: 'FYP-1 Repeat', project: 'None', progress: '0%', supervisor: 'Unassigned' },
  { id: 'SP21-BCS-007', name: 'Sana Mehmood', status: 'Completed', project: 'NLP-Based Legal Document Summarization', progress: '100%', supervisor: 'Dr. Ali Hassan' }
];

const DEMO_FACULTY = [
  { id: 'AH', name: 'Dr. Ali Hassan', designation: 'Associate Professor', proposed: 6, inProgress: '4 (Max)', completed: 28, research: ['Artificial Intelligence', 'Machine Learning', 'Computer Vision'], schedule: ['Mon 10:00-12:00', 'Tue 10:00-12:00', 'Wed 10:00-12:00'] },
  { id: 'SM', name: 'Dr. Sara Malik', designation: 'Senior Lecturer - In-charge', proposed: 4, inProgress: 3, completed: 19, research: ['Software Engineering', 'Federated Learning'], schedule: ['Thu 14:00-16:00', 'Fri 10:00-12:00'] },
  { id: 'FK', name: 'Dr. Fatima Khan', designation: 'Assistant Professor', proposed: 5, inProgress: 1, completed: 14, research: ['IoT Systems', 'Cybersecurity'], schedule: ['Mon 09:00-11:00', 'Wed 14:00-16:00'] }
];

const DEMO_PROJECTS = [
  { id: 1, title: 'AI-Powered Traffic Management System Using Computer Vision', leader: 'Ahmed Farooq', supervisor: 'Dr. Ali Hassan', status: 'Approved', stack: 'Computer Vision, Deep Learning, YOLOv8', desc: 'The project aims to optimize urban traffic signals...' },
  { id: 2, title: 'Federated Learning for Privacy-Preserving Medical Diagnosis', leader: 'Aima Khalid', supervisor: 'Dr. Sara Malik', status: 'Approved', stack: 'Python, PyTorch, Federated Learning', desc: 'A privacy-preserving framework for training diagnostic AI models...' },
  { id: 3, title: 'Smart Energy Management System Using IoT', leader: 'Zain Ali', supervisor: 'Dr. Fatima Khan', status: 'Pending', stack: 'ESP32, AWS IoT, React', desc: 'An IoT-based smart grid monitoring system designed to reduce electricity wastage...' }
];

const DEMO_CONTENT = [
  { id: 'PT', title: 'Presentation Template', currentVersion: 'v3.1', date: 'May 10, 2026', size: '4.2 MB', history: [{ version: 'v3.0', date: 'Apr 12, 2026' }, { version: 'v2.5', date: 'Jan 05, 2026' }] },
  { id: 'TT', title: 'Thesis Template', currentVersion: 'v2.4', date: 'May 16, 2026', size: '1.8 MB', history: [{ version: 'v2.3', date: 'Mar 20, 2026' }] },
  { id: 'RT', title: 'Report Template', currentVersion: 'v1.9', date: 'Apr 02, 2026', size: '2.5 MB', history: [{ version: 'v1.8', date: 'Feb 14, 2026' }] }
];

const DEMO_EXTERNAL = [
  { id: 1, name: 'Engr. Bilal Ahmed', email: 'industry@cuiatd.edu.pk', window: 'May 10 – May 25, 2026', project: 'AI-Powered Traffic Management System', status: 'Allocated' },
  { id: 2, name: 'Dr. Usman Qureshi', email: 'evaluator@cuiatd.edu.pk', window: 'Jun 01 – Jun 15, 2026', project: 'Unassigned', status: 'Pending Assignment' }
];

const DEMO_RESULTS = [
  { id: 'SP21-BCS-001', name: 'Ahmed Farooq', project: 'AI-Powered Traffic Management System', m10: '8.5 / 10', m30: '26.0 / 30', m60: '53.5 / 60', m100: '89.0 / 100', final: '89.0% (A)' },
  { id: 'SP21-BCS-019', name: 'Aima Khalid', project: 'Federated Learning for Medical Diagnosis', m10: '9.0 / 10', m30: '28.0 / 30', m60: '55.0 / 60', m100: '92.0 / 100', final: '92.0% (A)' }
];

export const getOfficeDashboardStats = async () => {
  try {
    const res = await apiClient.get(OFFICE_DASHBOARD_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_DASHBOARD_STATS };
  }
};

export const getOfficeUsers = async (page = 1, limit = 20) => {
  try {
    const res = await apiClient.get(OFFICE_USERS_API_URL, { params: { page, limit } });
    return res.data;
  } catch (error) {
    return { data: DEMO_USERS, total: DEMO_USERS.length, page: 1, limit: 20, totalPages: 1 };
  }
};

export const getOfficeStudents = async (page = 1, limit = 20) => {
  const res = await apiClient.get(OFFICE_STUDENTS_API_URL, { params: { page, limit } });
  return res.data;
};

export const getOfficeFaculty = async () => {
  try {
    const res = await apiClient.get(OFFICE_FACULTY_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_FACULTY };
  }
};

export const getOfficeProjects = async () => {
  try {
    const res = await apiClient.get(OFFICE_PROJECTS_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_PROJECTS };
  }
};

export const getOfficeContent = async () => {
  try {
    const res = await apiClient.get(OFFICE_CONTENT_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_CONTENT };
  }
};

export const getOfficeExternal = async () => {
  try {
    const res = await apiClient.get(OFFICE_EXTERNAL_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_EXTERNAL };
  }
};

export const getOfficeResults = async () => {
  try {
    const res = await apiClient.get(OFFICE_RESULTS_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_RESULTS };
  }
};

export const createOfficeStudent = async (payload) => {
  try {
    const res = await apiClient.post(OFFICE_CREATE_STUDENT_API_URL, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteOfficeUser = async (id) => {
  const res = await apiClient.delete(OFFICE_USERS_API_URL + '/' + id);
  return res.data;
};

export const deleteOfficeStudent = async (id) => {
  const res = await apiClient.delete(OFFICE_STUDENTS_API_URL + '/' + id);
  return res.data;
};

export const createOfficeFaculty = async (payload) => {
  const res = await apiClient.post(OFFICE_CREATE_FACULTY_API_URL, payload);
  return res.data;
};

import apiClient from '../api/apiClient';
import {
  HOD_DASHBOARD_API_URL,
  HOD_ESCALATIONS_API_URL,
  HOD_FACULTY_API_URL,
  HOD_GOVERNANCE_API_URL,
  HOD_ANALYTICS_API_URL
} from '../utils/constants/api-url.constant';

const DEMO_DASHBOARD_STATS = {
  totalGroups: 128,
  escalatedGrievances: 1,
  activeFaculty: 42,
  cloAttainmentAvg: '84.2%'
};

const DEMO_ESCALATIONS = [
  {
    id: 'GRV-089',
    student: 'Ahmed Farooq',
    regNo: 'SP21-BCS-001',
    category: 'Committee Evaluation Dispute',
    date: 'May 16, 2026',
    details: 'Our group was awarded 8.5/10 in the 10% milestone evaluation, but the committee rubric scorecard contained a calculation error in the CLO-2 summation.',
    inchargeNote: 'The committee head (Dr. Ali Hassan) insists the score is final, while the student evidence shows a clear discrepancy in the rubric Excel summation formula. Escalating for HOD binding decision on whether to mandate a formal re-evaluation.',
    escalatedBy: 'Dr. Sara Malik (FYP Office In-charge)'
  }
];

const DEMO_FACULTY_WORKLOAD = [
  {
    id: 1,
    name: 'Dr. Ali Hassan',
    designation: 'Associate Professor',
    slots: '4 / 4 Slots (Max)',
    research: ['AI & Vision', 'Machine Learning'],
    compliance: '100% Compliance'
  },
  {
    id: 2,
    name: 'Dr. Fatima Khan',
    designation: 'Assistant Professor',
    slots: '3 / 4 Slots',
    research: ['Cybersecurity', 'Networks'],
    compliance: '95% Compliance'
  }
];

const DEMO_GOVERNANCE_DATA = {
  committees: [
    { id: 1, name: 'PEC-1 (AI & Vision)', head: 'Dr. Ali Hassan', members: 4, status: 'Active Board' },
    { id: 2, name: 'FEC-FYP2-B (Software Eng)', head: 'Dr. Sara Malik', members: 3, status: 'Active Board' }
  ],
  rubrics: [
    { id: 1, name: 'Official Proposal Rubric v4.0', status: 'Locked', validation: 'Total Accumulation: 100% (Validated)' },
    { id: 2, name: 'CLO-Based FYP Final Rubric v3.5', status: 'Locked', validation: 'Total Accumulation: 100% (Validated)' }
  ]
};

const DEMO_ANALYTICS_DATA = {
  passRate: '96.4%',
  repeatRate: '3.6%',
  grades: [
    { grade: 'Grade A (85% - 100%)', percentage: 45 },
    { grade: 'Grade B (70% - 84%)', percentage: 38 },
    { grade: 'Grade C (60% - 69%)', percentage: 13.4 }
  ],
  clos: [
    { name: 'CLO-1 (Problem Identification)', average: 88.5 },
    { name: 'CLO-2 (Design & Methodology)', average: 82.1 },
    { name: 'CLO-3 (Modern Tool Usage)', average: 85.3 }
  ]
};

export const getHodDashboardStats = async () => {
  try {
    const res = await apiClient.get(HOD_DASHBOARD_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_DASHBOARD_STATS };
  }
};

export const getEscalations = async () => {
  try {
    const res = await apiClient.get(HOD_ESCALATIONS_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_ESCALATIONS };
  }
};

export const getFacultyWorkload = async () => {
  try {
    const res = await apiClient.get(HOD_FACULTY_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_FACULTY_WORKLOAD };
  }
};

export const getGovernanceData = async () => {
  try {
    const res = await apiClient.get(HOD_GOVERNANCE_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_GOVERNANCE_DATA };
  }
};

export const getAnalyticsData = async () => {
  try {
    const res = await apiClient.get(HOD_ANALYTICS_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_ANALYTICS_DATA };
  }
};


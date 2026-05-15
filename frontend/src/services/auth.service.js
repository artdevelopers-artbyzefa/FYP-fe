import { postRequest } from '../api/apiClient';
import { LOGIN_API_URL } from '../utils/constants/api-url.constant';
import { setAccessToken, setUserInfo, clearLocalStorage, getUserInfo } from '../utils/app.utils';

/**
 * ── Demo User Database ────────────────────────────────────────────
 * Standard accounts for development and testing.
 */
const FYP_USERS = [
  {
    id: 'S001', role: 'Student', name: 'Ahmed Farooq',
    email: 'student@cuiatd.edu.pk', password: 'Student@123',
    regNo: 'SP21-BCS-001', department: 'Computer Science',
    semester: '8th', avatar: 'AF',
    group: {
      id: 'G-042',
      title: 'AI-Powered Traffic Management System Using Computer Vision',
      members: 3, progress: 25, phase: 'proposal',
      supervisor: 'Dr. Ali Hassan'
    }
  },
  {
    id: 'F001', role: 'Faculty Supervisor', name: 'Dr. Ali Hassan',
    email: 'supervisor@cuiatd.edu.pk', password: 'Super@123',
    designation: 'Associate Professor',
    department: 'Computer Science',
    specialization: 'Artificial Intelligence · Machine Learning · Computer Vision',
    office: 'CS-205', officeHours: 'Mon–Wed  10:00 AM – 12:00 PM',
    phone: '+92-992-383591', avatar: 'AH', projects: 4
  },
  {
    id: 'C001', role: 'FYP Office', name: 'Dr. Sara Malik',
    email: 'coordinator@cuiatd.edu.pk', password: 'Coord@123',
    designation: 'FYP Coordinator · Senior Lecturer',
    department: 'Computer Science', avatar: 'SM'
  },
  {
    id: 'E001', role: 'Evaluator', name: 'Dr. Usman Qureshi',
    email: 'evaluator@cuiatd.edu.pk', password: 'Eval@123',
    designation: 'External Evaluator · Associate Professor',
    department: 'Computer Science', avatar: 'UQ'
  }
];

export const loginUser = async (credentials) => {
  const { email, password, role } = credentials;

  /**
   * 1. Check Demo Database
   * Allows login for demo accounts without a backend connection.
   */
  const demoUser = FYP_USERS.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && 
    u.password === password &&
    u.role === role
  );

  if (demoUser) {
    const mockResponse = {
      token: 'demo-token-12345',
      user: { ...demoUser }
    };
    // Don't leak password into storage
    delete mockResponse.user.password;
    
    setAccessToken(mockResponse.token);
    setUserInfo(mockResponse.user);
    
    return mockResponse;
  }

  /**
   * 2. Production API Fallback
   */
  try {
    const response = await postRequest(LOGIN_API_URL, credentials);
    const { token, user } = response.data;
    
    if (token) setAccessToken(token);
    if (user) setUserInfo(user);
    
    return response.data;
  } catch (error) {
    throw error.mappedError || { title: 'Login Failed', message: 'Invalid credentials' };
  }
};

export const logoutUser = () => {
  clearLocalStorage();
};

export const getCurrentUser = () => {
  return getUserInfo();
};

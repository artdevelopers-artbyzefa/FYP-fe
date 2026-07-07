import { Routes, Route, Navigate } from "react-router-dom";
import Process from "../pages/Process";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";
import Team from "../pages/Team";
import StudentPortal from "../pages/StudentPortal";
import Guidelines from "../pages/Guidelines";
import Eligibility from "../pages/Eligibility";
import Login from "../pages/Login";
import SetPassword from "../pages/SetPassword";
import ForgotPassword from "../pages/ForgotPassword";
import StudentLayout from "../pages/student/StudentLayout";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentProfile from "../pages/student/StudentProfile";

import FYPGroup from "../pages/student/FYPGroup";

import SupervisorSelection from "../pages/student/SupervisorSelection";
import TaskManager from "../pages/student/TaskManager";
import GroupIdeas from "../pages/student/GroupIdeas";
import StudentPastProjects from "../pages/student/StudentPastProjects";
import StudentSuggestions from "../pages/student/StudentSuggestions";
import StudentCommittee from "../pages/student/StudentCommittee";
import MyPresentations from "../pages/shared/MyPresentations";
import HodLayout from '../components/hod/HodLayout';
import HodDashboard from '../pages/hod/HodDashboard';
import HodEscalations from '../pages/hod/HodEscalations';
import HodFacultyOversight from '../pages/hod/HodFacultyOversight';
import HodGovernance from '../pages/hod/HodGovernance';
import HodAnalytics from '../pages/hod/HodAnalytics';
import HodStudents from '../pages/hod/HodStudents';
import HodCommittees from '../pages/hod/HodCommittees';
import HodFaculty from '../pages/hod/HodFaculty';
import HodProjects from '../pages/hod/HodProjects';
import AssistantLayout from '../components/office-assistant/AssistantLayout';
import AssistantDashboard from '../pages/office-assistant/AssistantDashboard';
import AssistantUsers from '../pages/office-assistant/AssistantUsers';
import AssistantStudents from '../pages/office-assistant/AssistantStudents';
import AssistantFaculty from '../pages/office-assistant/AssistantFaculty';
import SupervisorDetail from '../pages/office-assistant/SupervisorDetail';
import AssistantProjects from '../pages/office-assistant/AssistantProjects';
import AssistantEvalCommittees from '../pages/office-assistant/AssistantEvalCommittees';
import AssistantExternal from '../pages/office-assistant/AssistantExternal';
import AssistantResults from '../pages/office-assistant/AssistantResults';
import AssistantPastProjects from '../pages/office-assistant/AssistantPastProjects';
import FacultyLayout from '../components/faculty/FacultyLayout';
import FacultyDashboard from '../pages/faculty/FacultyDashboard';
import FacultyProfile from '../pages/faculty/FacultyProfile';
import FacultyAvailability from '../pages/faculty/FacultyAvailability';
import FacultyProposals from '../pages/faculty/FacultyProposals';
import FacultyGroupProposals from '../pages/faculty/FacultyGroupProposals';
import FacultySupervision from '../pages/faculty/FacultySupervision';
import FacultyMessaging from '../pages/faculty/FacultyMessaging';
import FacultyEvaluations from '../pages/faculty/FacultyEvaluations';
import FacultyHeadDuties from '../pages/faculty/FacultyHeadDuties';
import FacultySuggestions from '../pages/faculty/FacultySuggestions';
import FacultyPhase1Evaluation from '../pages/faculty/FacultyPhase1Evaluation';
import FacultyCommitteePhase1 from '../pages/faculty/FacultyCommitteePhase1';
import FacultyPhase2Evaluation from '../pages/faculty/FacultyPhase2Evaluation';
import FacultyCommitteePhase2 from '../pages/faculty/FacultyCommitteePhase2';
import StudentPhase1Remarks from '../pages/student/StudentPhase1Remarks';
import StudentPhase2Remarks from '../pages/student/StudentPhase2Remarks';
import InchargePhase1Marks from '../pages/office-incharge/InchargePhase1Marks';
import InchargePhase2Marks from '../pages/office-incharge/InchargePhase2Marks';
import AssistantPhase1Marks from '../pages/office-assistant/AssistantPhase1Marks';
import AssistantPhase2Marks from '../pages/office-assistant/AssistantPhase2Marks';
import InchargeLayout from '../components/office-incharge/InchargeLayout';
import InchargeDashboard from '../pages/office-incharge/InchargeDashboard';
import InchargePhaseControl from '../pages/office-incharge/InchargePhaseControl';
import InchargeRubrics from '../pages/office-incharge/InchargeRubrics';
import InchargeSessions from '../pages/office-incharge/InchargeSessions';
import InchargeCommitteeOversight from '../pages/office-incharge/InchargeCommitteeOversight';
import TimetableManagement from '../pages/office-incharge/TimetableManagement';
import InchargeGrievances from '../pages/office-incharge/InchargeGrievances';
import InchargeFacultyReports from '../pages/office-incharge/InchargeFacultyReports';
import InchargeStudentReports from '../pages/office-incharge/InchargeStudentReports';
import InchargeAuditLog from '../pages/office-incharge/InchargeAuditLog';
import InchargeForwardedProposals from '../pages/office-incharge/InchargeForwardedProposals';
// Placeholder components


const NotFound = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <h1 className="text-6xl font-black text-[#1e3a8a] mb-4">404</h1>
        <p className="text-xl text-black mb-8 font-medium">Oops! The page you're looking for doesn't exist.</p>
        <a href="/" className="px-6 py-3 bg-[#2563eb] text-white font-bold rounded-xl hover:bg-[#1d4ed8] transition-colors">
            Go Back Home
        </a>
    </div>
);

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/process" element={<Process />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/team" element={<Team />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/eligibility" element={<Eligibility />} />
            <Route path="/login" element={<Login />} />
            <Route path="/student-portal" element={<StudentPortal />} />
            <Route path="/set-password" element={<SetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Student Portal Routes */}
            <Route element={<StudentLayout />}>
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/profile" element={<StudentProfile />} />
                <Route path="/fyp-group" element={<FYPGroup />} />
                <Route path="/supervisor-selection" element={<SupervisorSelection />} />
                <Route path="/project/new" element={<GroupIdeas />} />
                <Route path="/task-manager" element={<TaskManager />} />
                <Route path="/past-projects" element={<StudentPastProjects />} />
                <Route path="/suggestions" element={<StudentSuggestions />} />
                <Route path="/committee" element={<StudentCommittee />} />
                <Route path="/phase1-remarks" element={<StudentPhase1Remarks />} />
                <Route path="/phase2-remarks" element={<StudentPhase2Remarks />} />
                <Route path="/my-presentations" element={<MyPresentations />} />
            </Route>

            {/* HOD Portal Routes */}
            <Route path="/hod" element={<HodLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<HodDashboard />} />
                <Route path="escalations" element={<HodEscalations />} />
                <Route path="faculty-oversight" element={<HodFacultyOversight />} />
                <Route path="governance" element={<HodGovernance />} />
                <Route path="analytics" element={<HodAnalytics />} />
                <Route path="students" element={<HodStudents />} />
                <Route path="committees" element={<HodCommittees />} />
                <Route path="faculty" element={<HodFaculty />} />
                <Route path="projects" element={<HodProjects />} />
            </Route>

            {/* Office Assistant Layout Routes */}
            <Route path="/office-assistant" element={<AssistantLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AssistantDashboard />} />
                <Route path="users" element={<AssistantUsers />} />
                <Route path="students" element={<AssistantStudents />} />
                <Route path="faculty" element={<AssistantFaculty />} />
                <Route path="faculty/:id" element={<SupervisorDetail />} />
                <Route path="projects" element={<AssistantProjects />} />
                <Route path="committee-oversight" element={<InchargeCommitteeOversight />} />
                <Route path="timetable" element={<TimetableManagement />} />
                <Route path="eval-committee" element={<AssistantEvalCommittees />} />
                <Route path="external" element={<AssistantExternal />} />
                <Route path="results" element={<AssistantResults />} />
                <Route path="past-projects" element={<AssistantPastProjects />} />
                <Route path="forwarded-proposals" element={<InchargeForwardedProposals />} />
                <Route path="phase1-marks" element={<AssistantPhase1Marks />} />
                <Route path="phase2-marks" element={<AssistantPhase2Marks />} />
            </Route>

            {/* Faculty Supervisor Layout Routes */}
            <Route path="/faculty" element={<FacultyLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<FacultyDashboard />} />
                <Route path="profile" element={<FacultyProfile />} />
                <Route path="availability" element={<FacultyAvailability />} />
                <Route path="proposals" element={<FacultyProposals />} />
                <Route path="group-proposals" element={<FacultyGroupProposals />} />
                <Route path="supervision" element={<FacultySupervision />} />
                <Route path="messaging" element={<FacultyMessaging />} />
                <Route path="evaluations" element={<FacultyEvaluations />} />
                <Route path="head-duties" element={<FacultyHeadDuties />} />
                <Route path="suggestions" element={<FacultySuggestions />} />
                <Route path="phase1-evaluation" element={<FacultyPhase1Evaluation />} />
                <Route path="committee-phase1" element={<FacultyCommitteePhase1 />} />
                <Route path="phase2-evaluation" element={<FacultyPhase2Evaluation />} />
                <Route path="committee-phase2" element={<FacultyCommitteePhase2 />} />
                <Route path="my-presentations" element={<MyPresentations />} />
            </Route>

            {/* FYP Office In-charge Layout Routes */}
            <Route path="/office-incharge" element={<InchargeLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<InchargeDashboard />} />
                <Route path="phases" element={<InchargePhaseControl />} />
                <Route path="rubrics" element={<InchargeRubrics />} />
                <Route path="sessions" element={<InchargeSessions />} />
                <Route path="projects" element={<AssistantProjects />} />
                <Route path="eval-committee" element={<AssistantEvalCommittees />} />
                <Route path="committee-oversight" element={<InchargeCommitteeOversight />} />
                <Route path="timetable" element={<TimetableManagement />} />
                <Route path="grievances" element={<InchargeGrievances />} />
                <Route path="faculty-reports" element={<InchargeFacultyReports />} />
                <Route path="student-reports" element={<InchargeStudentReports />} />
                <Route path="audit-log" element={<InchargeAuditLog />} />
                <Route path="forwarded-proposals" element={<InchargeForwardedProposals />} />
                <Route path="phase1-marks" element={<InchargePhase1Marks />} />
                <Route path="phase2-marks" element={<InchargePhase2Marks />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;

import { Routes, Route, Navigate } from "react-router-dom";
import Process from "../pages/Process";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";
import Team from "../pages/Team";
import Guidelines from "../pages/Guidelines";
import Eligibility from "../pages/Eligibility";
import Login from "../pages/Login";
import SetPassword from "../pages/SetPassword";
import StudentLayout from "../pages/student/StudentLayout";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentProfile from "../pages/student/StudentProfile";
import IncomingRequests from "../pages/student/IncomingRequests";
import ApprovedIdeas from "../pages/student/ApprovedIdeas";
import NewRequest from "../pages/student/NewRequest";
import NewIdea from "../pages/student/NewIdea";
import SupervisorSelection from "../pages/student/SupervisorSelection";
import TaskManager from "../pages/student/TaskManager";
import HodLayout from '../components/hod/HodLayout';
import HodDashboard from '../pages/hod/HodDashboard';
import HodEscalations from '../pages/hod/HodEscalations';
import HodFacultyOversight from '../pages/hod/HodFacultyOversight';
import HodGovernance from '../pages/hod/HodGovernance';
import HodAnalytics from '../pages/hod/HodAnalytics';
import AssistantLayout from '../components/office-assistant/AssistantLayout';
import AssistantDashboard from '../pages/office-assistant/AssistantDashboard';
import AssistantUsers from '../pages/office-assistant/AssistantUsers';
import AssistantStudents from '../pages/office-assistant/AssistantStudents';
import AssistantFaculty from '../pages/office-assistant/AssistantFaculty';
import AssistantProjects from '../pages/office-assistant/AssistantProjects';
import AssistantContent from '../pages/office-assistant/AssistantContent';
import AssistantProposalCommittees from '../pages/office-assistant/AssistantProposalCommittees';
import AssistantEvalCommittees from '../pages/office-assistant/AssistantEvalCommittees';
import AssistantExternal from '../pages/office-assistant/AssistantExternal';
import AssistantResults from '../pages/office-assistant/AssistantResults';
import FacultyLayout from '../components/faculty/FacultyLayout';
import FacultyDashboard from '../pages/faculty/FacultyDashboard';
import FacultyProfile from '../pages/faculty/FacultyProfile';
import FacultyAvailability from '../pages/faculty/FacultyAvailability';
import FacultyProposals from '../pages/faculty/FacultyProposals';
import FacultySupervision from '../pages/faculty/FacultySupervision';
import FacultyMessaging from '../pages/faculty/FacultyMessaging';
import FacultyEvaluations from '../pages/faculty/FacultyEvaluations';
import FacultyHeadDuties from '../pages/faculty/FacultyHeadDuties';
import InchargeLayout from '../components/office-incharge/InchargeLayout';
import InchargeDashboard from '../pages/office-incharge/InchargeDashboard';
import InchargePhaseControl from '../pages/office-incharge/InchargePhaseControl';
import InchargeRubrics from '../pages/office-incharge/InchargeRubrics';
import InchargeSessions from '../pages/office-incharge/InchargeSessions';
import InchargeSupervisionRequests from '../pages/office-incharge/InchargeSupervisionRequests';
import InchargeCommitteeOversight from '../pages/office-incharge/InchargeCommitteeOversight';
import InchargeGrievances from '../pages/office-incharge/InchargeGrievances';
import InchargeFacultyReports from '../pages/office-incharge/InchargeFacultyReports';
import InchargeStudentReports from '../pages/office-incharge/InchargeStudentReports';
import InchargeAuditLog from '../pages/office-incharge/InchargeAuditLog';

// Placeholder components
const ProjectIdea = () => <div className="p-6 bg-white rounded-2xl shadow-sm border border-black"> <h1 className="text-2xl font-black text-navy mb-4">Project Ideas</h1> <p className="text-black">Project idea submission page coming soon.</p> </div>;

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
            <Route path="/set-password" element={<SetPassword />} />

            {/* Student Portal Routes */}
            <Route element={<StudentLayout />}>
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/profile" element={<StudentProfile />} />
                <Route path="/partners/new" element={<NewRequest />} />
                <Route path="/partners/requests" element={<IncomingRequests />} />
                <Route path="/supervisor-selection" element={<SupervisorSelection />} />
                <Route path="/project/new" element={<NewIdea />} />
                <Route path="/project/approved" element={<ApprovedIdeas />} />
                <Route path="/project/*" element={<ProjectIdea />} />
                <Route path="/task-manager" element={<TaskManager />} />
            </Route>

            {/* HOD Portal Routes */}
            <Route path="/hod" element={<HodLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<HodDashboard />} />
                <Route path="escalations" element={<HodEscalations />} />
                <Route path="faculty-oversight" element={<HodFacultyOversight />} />
                <Route path="governance" element={<HodGovernance />} />
                <Route path="analytics" element={<HodAnalytics />} />
            </Route>

            {/* Office Assistant Layout Routes */}
            <Route path="/office-assistant" element={<AssistantLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AssistantDashboard />} />
                <Route path="users" element={<AssistantUsers />} />
                <Route path="students" element={<AssistantStudents />} />
                <Route path="faculty" element={<AssistantFaculty />} />
                <Route path="projects" element={<AssistantProjects />} />
                <Route path="content" element={<AssistantContent />} />
                <Route path="proposal-committee" element={<AssistantProposalCommittees />} />
                <Route path="eval-committee" element={<AssistantEvalCommittees />} />
                <Route path="external" element={<AssistantExternal />} />
                <Route path="results" element={<AssistantResults />} />
            </Route>

            {/* Faculty Supervisor Layout Routes */}
            <Route path="/faculty" element={<FacultyLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<FacultyDashboard />} />
                <Route path="profile" element={<FacultyProfile />} />
                <Route path="availability" element={<FacultyAvailability />} />
                <Route path="proposals" element={<FacultyProposals />} />
                <Route path="supervision" element={<FacultySupervision />} />
                <Route path="messaging" element={<FacultyMessaging />} />
                <Route path="evaluations" element={<FacultyEvaluations />} />
                <Route path="head-duties" element={<FacultyHeadDuties />} />
            </Route>

            {/* FYP Office In-charge Layout Routes */}
            <Route path="/office-incharge" element={<InchargeLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<InchargeDashboard />} />
                <Route path="phases" element={<InchargePhaseControl />} />
                <Route path="rubrics" element={<InchargeRubrics />} />
                <Route path="sessions" element={<InchargeSessions />} />
                <Route path="supervision-requests" element={<InchargeSupervisionRequests />} />
                <Route path="committee-oversight" element={<InchargeCommitteeOversight />} />
                <Route path="grievances" element={<InchargeGrievances />} />
                <Route path="faculty-reports" element={<InchargeFacultyReports />} />
                <Route path="student-reports" element={<InchargeStudentReports />} />
                <Route path="audit-log" element={<InchargeAuditLog />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;

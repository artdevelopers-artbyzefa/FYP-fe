import { Routes, Route } from "react-router-dom";

import Process from "../pages/Process";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";
import Team from "../pages/Team";
import Guidelines from "../pages/Guidelines";
<<<<<<< Updated upstream
=======
import Eligibility from "../pages/Eligibility";
import Login from "../pages/Login";

import StudentLayout from "../pages/student/StudentLayout";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentProfile from "../pages/student/StudentProfile";
import IncomingRequests from "../pages/student/IncomingRequests";
import ApprovedIdeas from "../pages/student/ApprovedIdeas";
import NewRequest from "../pages/student/NewRequest";
import NewIdea from "../pages/student/NewIdea";
import SupervisorSelection from "../pages/student/SupervisorSelection";
import TaskManager from "../pages/student/TaskManager";

import InchargeLayout from "../pages/Incharge/InchargeLayout";
import InchargeDashboard from "../pages/Incharge/Dashboard";
import RubricBuilder from "../pages/Incharge/RubricBuilder";
import AcademicSessions from "../pages/Incharge/AcademicSessions";
import SupervisionRequests from "../pages/Incharge/SupervisionRequests";
import CommitteeOversight from "../pages/Incharge/CommitteeOversight";
import Grievances from "../pages/Incharge/Grievances";
import FacultyReports from "../pages/Incharge/FacultyReports";
import StudentReports from "../pages/Incharge/StudentReports";
import AuditLogs from "../pages/Incharge/AuditLogs";

// Placeholder components for new pages
const FYPPartners = () => <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100"> <h1 className="text-2xl font-black text-navy mb-4">FYP Partners</h1> <p className="text-gray-500">Partner management page coming soon.</p> </div>;

const ProjectIdea = () => <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100"> <h1 className="text-2xl font-black text-navy mb-4">Project Ideas</h1> <p className="text-gray-500">Project idea submission page coming soon.</p> </div>;
>>>>>>> Stashed changes

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/process" element={<Process />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/team" element={<Team />} />
            <Route path="/guidelines" element={<Guidelines />} />
<<<<<<< Updated upstream
=======
            <Route path="/eligibility" element={<Eligibility />} />
            <Route path="/login" element={<Login />} />
            
            {/* Student Portal Routes (Authenticated) */}
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

            {/* Incharge Portal Routes (Authenticated) */}
            <Route path="/incharge" element={<InchargeLayout />}>
                <Route path="dashboard" element={<InchargeDashboard />} />
                <Route path="rubrics" element={<RubricBuilder />} />
                <Route path="sessions" element={<AcademicSessions />} />
                <Route path="supervision-requests" element={<SupervisionRequests />} />
                <Route path="committee-oversight" element={<CommitteeOversight />} />
                <Route path="grievances" element={<Grievances />} />
                <Route path="faculty-reports" element={<FacultyReports />} />
                <Route path="student-reports" element={<StudentReports />} />
                <Route path="audit-logs" element={<AuditLogs />} />
                <Route path="" element={<Navigate to="/incharge/dashboard" replace />} />
            </Route>
            
            {/* Catch-all route to redirect back home if path is unknown, prevents blank page */}
            <Route path="*" element={<Navigate to="/" replace />} />
>>>>>>> Stashed changes
        </Routes>
    );
};

export default AppRoutes;
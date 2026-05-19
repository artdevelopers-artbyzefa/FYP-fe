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
import StudentLayout from "../pages/student/StudentLayout";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentProfile from "../pages/student/StudentProfile";
import IncomingRequests from "../pages/student/IncomingRequests";
import ApprovedIdeas from "../pages/student/ApprovedIdeas";
import NewRequest from "../pages/student/NewRequest";
import NewIdea from "../pages/student/NewIdea";
import SupervisorSelection from "../pages/student/SupervisorSelection";
import TaskManager from "../pages/student/TaskManager";

// Faculty Supervisor Portal Routes are imported from facultyRoutes.jsx

import { facultyRoutes } from "./facultyRoutes";

// Placeholder components for new pages
const FYPPartners = () => <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100"> <h1 className="text-2xl font-black text-navy mb-4">FYP Partners</h1> <p className="text-gray-500">Partner management page coming soon.</p> </div>;

const ProjectIdea = () => <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100"> <h1 className="text-2xl font-black text-navy mb-4">Project Ideas</h1> <p className="text-gray-500">Project idea submission page coming soon.</p> </div>;

const GroupDetails = () => <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100"> <h1 className="text-2xl font-black text-navy mb-4">Group Details</h1> <p className="text-gray-500">Group details management coming soon.</p> </div>;

const NotFound = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-6xl font-black text-[#1e3a8a] mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8 font-medium">Oops! The page you're looking for doesn't exist.</p>
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
            
            {/* Faculty Supervisor Portal Routes (Authenticated) */}
            {facultyRoutes}
            
            {/* Added requested routes mapping */}
            <Route element={<StudentLayout />}>
                 <Route path="/groups/:id" element={<GroupDetails />} />
            </Route>
            
            <Route path="/supervision" element={<Navigate to="/faculty/dashboard" replace />} />
            <Route path="/messages" element={<Navigate to="/faculty/messages" replace />} />
            <Route path="/evaluations" element={<Navigate to="/faculty/evaluations" replace />} />
            <Route path="/head-management" element={<Navigate to="/faculty/head-management" replace />} />
            
            {/* Redirect unknown routes to a 404 page */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;

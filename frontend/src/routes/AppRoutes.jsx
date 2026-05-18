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
import Dashboard from "../pages/Dashboard";
import DashboardLayout from "../components/DashboardLayout";
import IncomingRequests from "../pages/IncomingRequests";
import ApprovedIdeas from "../pages/ApprovedIdeas";
import NewRequest from "../pages/NewRequest";
import NewIdea from "../pages/NewIdea";
import SupervisorSelection from "../pages/SupervisorSelection";
import TaskManager from "../pages/TaskManager";
import Profile from "../pages/Profile";

// Placeholder components for new pages
const FYPPartners = () => <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100"> <h1 className="text-2xl font-black text-navy mb-4">FYP Partners</h1> <p className="text-gray-500">Partner management page coming soon.</p> </div>;

const ProjectIdea = () => <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100"> <h1 className="text-2xl font-black text-navy mb-4">Project Ideas</h1> <p className="text-gray-500">Project idea submission page coming soon.</p> </div>;

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
            
            {/* Portal Routes (Authenticated) */}
            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/partners/new" element={<NewRequest />} />
                <Route path="/partners/requests" element={<IncomingRequests />} />
                <Route path="/supervisor-selection" element={<SupervisorSelection />} />
                <Route path="/project/new" element={<NewIdea />} />
                <Route path="/project/approved" element={<ApprovedIdeas />} />
                <Route path="/project/*" element={<ProjectIdea />} />
                <Route path="/task-manager" element={<TaskManager />} />
            </Route>
            
            {/* Catch-all route to redirect back home if path is unknown, prevents blank page */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;

import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";

import CandidateDashboard from "./pages/CandidateDashboard";
import CandidateJobs from "./pages/CandidateJobs";
import CandidateApplications from "./pages/CandidateApplications";
import CandidateResume from "./pages/CandidateResume";

import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterJobs from "./pages/RecruiterJobs";
import RecruiterApplications from "./pages/Recruiterapplications";

import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* ================= AUTH ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= CANDIDATE ROUTES ================= */}
      <Route
        path="/candidate/dashboard"
        element={
          <ProtectedRoute allowedRoles={["CANDIDATE"]}>
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/jobs"
        element={
          <ProtectedRoute allowedRoles={["CANDIDATE"]}>
            <CandidateJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/applications"
        element={
          <ProtectedRoute allowedRoles={["CANDIDATE"]}>
            <CandidateApplications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/resume"
        element={
          <ProtectedRoute allowedRoles={["CANDIDATE"]}>
            <CandidateResume />
          </ProtectedRoute>
        }
      />

      {/* ================= RECRUITER ROUTES ================= */}
      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/jobs"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <RecruiterJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/applications"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <RecruiterApplications />
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN ROUTES ================= */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= DEFAULT ================= */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
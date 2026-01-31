import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";

import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RecruiterJobs from "./pages/RecruiterJobs";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ RECRUITER DASHBOARD (MISSING BEFORE) */}
      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />

      {/* Recruiter Jobs */}
      <Route
        path="/recruiter/jobs"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <RecruiterJobs />
          </ProtectedRoute>
        }
      />

      {/* Candidate */}
      <Route
        path="/candidate/dashboard"
        element={
          <ProtectedRoute allowedRoles={["CANDIDATE"]}>
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);

    // SUPPORT BOTH formats
    const role =
      decoded.role ||
      (decoded.authorities && decoded.authorities[0]?.replace("ROLE_", ""));

    if (!allowedRoles.includes(role)) {
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
}

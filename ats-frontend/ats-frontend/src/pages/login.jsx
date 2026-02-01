import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);

      const token = res.data.token || res.data;
      localStorage.setItem("token", token);

      // 🔐 Decode JWT to get role
      const decoded = jwtDecode(token);
      const role = decoded.role;

      // Show success notification
      setShowSuccess(true);

      // 🎯 Role-based redirect
      setTimeout(() => {
        if (role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (role === "RECRUITER") {
          navigate("/recruiter/dashboard");
        } else {
          navigate("/candidate/dashboard");
        }
      }, 1200);
    } catch (err) {
      setLoading(false);

      // Handle different error types
      if (err.response?.status === 400) {
        const errorData = err.response.data;

        // If it has validation errors (field-specific)
        if (errorData.errors && typeof errorData.errors === "object") {
          setErrors(errorData.errors);
        } else if (errorData.message) {
          // Generic error message (invalid credentials, account locked, etc)
          setErrors({ general: errorData.message });
        } else {
          setErrors({ general: "Login failed. Please try again." });
        }
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setErrors({ general: "Invalid email or password" });
      } else if (err.response?.status === 500) {
        setErrors({ general: "Server error. Please try again later." });
      } else {
        setErrors({ general: "Network error. Please check your connection." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showSuccess && (
        <div className="success-notification">
          <div className="success-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="success-content">
            <h3>Login Successful!</h3>
            <p>Welcome back to CVortex</p>
          </div>
        </div>
      )}

      <div className="auth-container login-layout">
        <div className="auth-image-section">
          <img src="/login-img.png" alt="Professional business handshake" />
        </div>

        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <div className="logo-wrapper">
              <h1>CVortex</h1>
              <p>Application Tracking System</p>
            </div>

            <form onSubmit={handleLogin}>
              <h2>Welcome Back</h2>
              <p className="form-subtitle">Sign in to continue to CVortex</p>

              {/* General Error Message */}
              {errors.general && (
                <div className="error-alert">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="error-title">Error</p>
                    <p className="error-message">{errors.general}</p>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "input-error" : ""}
                  required
                />
                {errors.email && (
                  <span className="field-error">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "input-error" : ""}
                  required
                />
                {errors.password && (
                  <span className="field-error">{errors.password}</span>
                )}
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <div className="auth-footer">
                Don't have an account?{" "}
                <Link to="/register">Create account</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CANDIDATE",
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await api.post("/auth/register", formData);

      // Show success notification
      setShowSuccess(true);

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "CANDIDATE",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      setLoading(false);

      // Handle different error types
      if (err.response?.status === 400) {
        const errorData = err.response.data;

        // If it has validation errors (field-specific)
        if (errorData.errors && typeof errorData.errors === "object") {
          setErrors(errorData.errors);
        } else if (errorData.message) {
          // If it's a generic error message
          setErrors({ general: errorData.message });
        } else {
          setErrors({ general: "Registration failed. Please try again." });
        }
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
            <h3>Registration Successful!</h3>
            <p>Redirecting to login page...</p>
          </div>
        </div>
      )}

      <div className="auth-container register-layout">
        {/* Form Section (Left) */}
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <div className="logo-wrapper">
              <h1>CVortex</h1>
              <p>Application Tracking System</p>
            </div>

            <form onSubmit={handleRegister}>
              <h2>Create Account</h2>
              <p className="form-subtitle">
                Join CVortex to streamline your hiring process
              </p>

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
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "input-error" : ""}
                  required
                />
                {errors.name && (
                  <span className="field-error">{errors.name}</span>
                )}
              </div>

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
                  placeholder="Create a password (min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char)"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "input-error" : ""}
                  required
                />
                {errors.password && (
                  <span className="field-error">{errors.password}</span>
                )}
                <small className="password-hint">
                  Password must contain: uppercase, lowercase, digit, and special character
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="role">I am a</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={errors.role ? "input-error" : ""}
                >
                  <option value="CANDIDATE">Candidate</option>
                  <option value="RECRUITER">Recruiter</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {errors.role && (
                  <span className="field-error">{errors.role}</span>
                )}
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="auth-footer">
                Already have an account? <Link to="/login">Sign in</Link>
              </div>
            </form>
          </div>
        </div>

        {/* Image Section (Right) */}
        <div className="auth-image-section">
          <img src="/register-img.png" alt="Professional business meeting" />
          <div className="glass-card glass-panel">
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", fontWeight: 700 }}>
              Start Your Journey
            </h3>
            <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>
              Create an account today and connect with top talent or find your dream job.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
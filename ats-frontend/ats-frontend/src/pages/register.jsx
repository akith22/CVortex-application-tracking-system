import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CANDIDATE");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      // Show success notification
      setShowSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <>
      {showSuccess && (
        <div className="success-notification">
          <div className="success-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
              <p className="form-subtitle">Join CVortex to streamline your hiring process</p>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">I am a</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="CANDIDATE">Candidate</option>
                  <option value="RECRUITER">Recruiter</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <button type="submit">Create Account</button>

              <div className="auth-footer">
                Already have an account? <Link to="/login">Sign in</Link>
              </div>
            </form>
          </div>
        </div>

        {/* Image Section (Right) */}
        <div className="auth-image-section">
          <img src="/register-img.png" alt="Professional business meeting" />
        </div>
      </div>
    </>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const showSuccessNotification = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.token || res.data;
      localStorage.setItem("token", token);

      // 🔐 Decode JWT to get role
      const decoded = jwtDecode(token);
      const role = decoded.role;

      showSuccessNotification();

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
      alert("Login failed");
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
              <p className="form-subtitle">
                Sign in to continue to CVortex
              </p>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit">Sign In</button>

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

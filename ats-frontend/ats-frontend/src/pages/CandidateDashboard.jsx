import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import CandidateLayout from "../components/CandidateLayout";

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editName, setEditName] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= FETCH PROFILE ON MOUNT ================= */
  useEffect(() => {
    fetchCandidateProfile();
  }, []);

  const fetchCandidateProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/candidate/profile");
      setProfile(res.data);
      setEditName(res.data.name);
      setLoading(false);
    } catch (err) {
      setLoading(false);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Unauthorized. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(err.response?.data?.message || "Failed to load profile");
      }
    }
  };

  /* ================= UPDATE PROFILE ================= */
  const updateName = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!editName.trim()) {
        setError("Name cannot be empty");
        setLoading(false);
        return;
      }

      const res = await api.put("/candidate/profile", {
        name: editName,
      });

      setProfile(res.data);
      setShowProfile(false);
      setSuccess("Profile updated successfully!");

      setTimeout(() => setSuccess(""), 3000);
      setLoading(false);
    } catch (err) {
      setLoading(false);

      if (err.response?.status === 400) {
        setError(err.response.data?.message || "Invalid input");
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Unauthorized. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(err.response?.data?.message || "Failed to update profile");
      }
    }
  };

  /* ================= LOADING STATE ================= */
  if (loading && !profile) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <CandidateLayout
      profile={profile}
      showProfile={showProfile}
      setShowProfile={setShowProfile}
      editName={editName}
      setEditName={setEditName}
      updateName={updateName}
    >
      {/* ================= ALERTS ================= */}
      {error && (
        <div style={styles.alertError}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p style={styles.alertTitle}>Error</p>
            <p style={styles.alertMessage}>{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div style={styles.alertSuccess}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <div>
            <p style={styles.alertTitle}>Success</p>
            <p style={styles.alertMessage}>{success}</p>
          </div>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div style={styles.header}>
        <div>
          <h1>Welcome back, {profile?.name}</h1>
          <p style={styles.subtitle}>Candidate Dashboard</p>
        </div>
      </div>

      {/* ================= QUICK STATS ================= */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📋</div>
          <div>
            <p style={styles.statLabel}>Applications</p>
            <p style={styles.statValue}>0</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>⭐</div>
          <div>
            <p style={styles.statLabel}>Saved Jobs</p>
            <p style={styles.statValue}>0</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>📄</div>
          <div>
            <p style={styles.statLabel}>Resume Status</p>
            <p style={styles.statValue}>Pending</p>
          </div>
        </div>
      </div>

      {/* ================= PROFILE CARD ================= */}
      {profile && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2>Your Profile</h2>
            <button
              style={styles.editBtn}
              onClick={() => setShowProfile(true)}
            >
              Edit Profile
            </button>
          </div>

          <div style={styles.profileInfo}>
            <div style={styles.infoGroup}>
              <label style={styles.infoLabel}>Full Name</label>
              <p style={styles.infoValue}>{profile.name}</p>
            </div>

            <div style={styles.infoGroup}>
              <label style={styles.infoLabel}>Email</label>
              <p style={styles.infoValue}>{profile.email}</p>
            </div>

            <div style={styles.infoGroup}>
              <label style={styles.infoLabel}>Role</label>
              <p style={{ ...styles.infoValue, ...styles.roleBadge }}>
                {profile.role}
              </p>
            </div>

            <div style={styles.infoGroup}>
              <label style={styles.infoLabel}>Member Since</label>
              <p style={styles.infoValue}>
                {new Date(profile.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= GETTING STARTED ================= */}
      <div style={styles.card}>
        <h2>Getting Started</h2>
        <div style={styles.checklist}>
          <div style={styles.checkItem}>
            <span style={styles.checkIcon}>✓</span>
            <div>
              <p style={styles.checkTitle}>Complete Your Profile</p>
              <p style={styles.checkDescription}>You're on track!</p>
            </div>
          </div>

          <div style={styles.checkItem}>
            <span style={styles.checkIcon}>⭘</span>
            <div>
              <p style={styles.checkTitle}>Upload Your Resume</p>
              <p style={styles.checkDescription}>
                Add your resume to apply for jobs
              </p>
            </div>
          </div>

          <div style={styles.checkItem}>
            <span style={styles.checkIcon}>⭘</span>
            <div>
              <p style={styles.checkTitle}>Browse Jobs</p>
              <p style={styles.checkDescription}>
                Find and apply to job positions
              </p>
            </div>
          </div>

          <div style={styles.checkItem}>
            <span style={styles.checkIcon}>⭘</span>
            <div>
              <p style={styles.checkTitle}>Track Applications</p>
              <p style={styles.checkDescription}>
                Monitor your application status
              </p>
            </div>
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
}

/* ================= STYLES ================= */
const styles = {
  loadingPage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
    gap: "20px",
  },

  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(255,255,255,0.3)",
    borderTop: "4px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  /* ===== ALERTS ===== */
  alertError: {
    display: "flex",
    gap: "12px",
    padding: "16px",
    background: "#fee",
    border: "1px solid #fcc",
    borderRadius: "8px",
    marginBottom: "24px",
    color: "#c00",
    alignItems: "flex-start",
  },

  alertSuccess: {
    display: "flex",
    gap: "12px",
    padding: "16px",
    background: "#efe",
    border: "1px solid #cfc",
    borderRadius: "8px",
    marginBottom: "24px",
    color: "#060",
    alignItems: "flex-start",
  },

  alertTitle: {
    fontWeight: 600,
    margin: "0 0 4px 0",
  },

  alertMessage: {
    margin: 0,
    fontSize: "14px",
  },

  /* ===== HEADER ===== */
  header: {
    marginBottom: "2rem",
  },

  header: {
    marginBottom: "2rem",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "0.5rem",
  },

  /* ===== STATS GRID ===== */
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "2rem",
  },

  statCard: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    display: "flex",
    gap: "16px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    alignItems: "center",
  },

  statIcon: {
    fontSize: "40px",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    background: "#f3f4f6",
  },

  statLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  statValue: {
    margin: "8px 0 0 0",
    fontSize: "28px",
    fontWeight: 700,
    color: "#1f2937",
  },

  /* ===== CARDS ===== */
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "2rem",
    marginBottom: "2rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #e5e7eb",
  },

  editBtn: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s",
  },

  /* ===== PROFILE INFO ===== */
  profileInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
  },

  infoGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  infoLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  infoValue: {
    margin: 0,
    fontSize: "16px",
    color: "#1f2937",
    fontWeight: 500,
  },

  roleBadge: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    width: "fit-content",
    fontSize: "14px",
  },

  /* ===== CHECKLIST ===== */
  checklist: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  checkItem: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
    padding: "1rem",
    borderRadius: "8px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
  },

  checkIcon: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#667eea",
    width: "30px",
    textAlign: "center",
  },

  checkTitle: {
    margin: 0,
    fontWeight: 600,
    color: "#1f2937",
    fontSize: "15px",
  },

  checkDescription: {
    margin: "4px 0 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },
};
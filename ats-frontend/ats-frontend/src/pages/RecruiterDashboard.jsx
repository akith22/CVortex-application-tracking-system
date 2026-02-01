import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import RecruiterLayout from "../components/RecruiterLayout";

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showProfile, setShowProfile] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  const [editName, setEditName] = useState("");
  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    type: "",
    description: "",
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchRecruiterData();
  }, []);

  const fetchRecruiterData = async () => {
    try {
      setLoading(true);
      setError("");

      const profileRes = await api.get("/recruiter/profile");
      setProfile(profileRes.data);
      setEditName(profileRes.data.name);

      const jobsRes = await api.get("/recruiter/jobs");
      setJobs(jobsRes.data);

      setLoading(false);
    } catch (err) {
      setLoading(false);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Unauthorized. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(err.response?.data?.message || "Failed to load dashboard");
      }
    }
  };

  /* ================= ACTIONS ================= */
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

      const res = await api.put("/recruiter/profile", { name: editName });
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

  const postJob = async () => {
    try {
      setError("");
      setSuccess("");

      if (!newJob.title.trim() || !newJob.location.trim() || !newJob.type.trim()) {
        setError("Please fill in all required fields");
        return;
      }

      await api.post("/recruiter/jobs", newJob);
      setShowPostModal(false);
      setNewJob({ title: "", location: "", type: "", description: "" });
      setSuccess("Job posted successfully!");

      const res = await api.get("/recruiter/jobs");
      setJobs(res.data);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job");
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
    <RecruiterLayout
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
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ width: "24px", height: "24px" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
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
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ width: "24px", height: "24px" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
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
          <p style={styles.subtitle}>Recruiter Dashboard</p>
        </div>
        <button
          style={styles.primaryBtn}
          onClick={() => setShowPostModal(true)}
        >
          + Post a Vacancy
        </button>
      </div>

      {/* ================= QUICK STATS ================= */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📋</div>
          <div>
            <p style={styles.statLabel}>Total Vacancies</p>
            <p style={styles.statValue}>{jobs.length}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>📨</div>
          <div>
            <p style={styles.statLabel}>Applications</p>
            <p style={styles.statValue}>0</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div>
            <p style={styles.statLabel}>Active Candidates</p>
            <p style={styles.statValue}>0</p>
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

      

      {/* ================= POST JOB MODAL ================= */}
      {showPostModal && (
        <Modal title="Post a Vacancy" onClose={() => setShowPostModal(false)}>
          <input
            style={styles.input}
            placeholder="Job Title *"
            value={newJob.title}
            onChange={(e) =>
              setNewJob({ ...newJob, title: e.target.value })
            }
          />
          <input
            style={styles.input}
            placeholder="Location *"
            value={newJob.location}
            onChange={(e) =>
              setNewJob({ ...newJob, location: e.target.value })
            }
          />
          <input
            style={styles.input}
            placeholder="Job Type (e.g., Full-time, Part-time) *"
            value={newJob.type}
            onChange={(e) =>
              setNewJob({ ...newJob, type: e.target.value })
            }
          />
          <textarea
            style={styles.textarea}
            placeholder="Job Description"
            value={newJob.description}
            onChange={(e) =>
              setNewJob({ ...newJob, description: e.target.value })
            }
          />

          <div style={styles.modalActions}>
            <button
              style={styles.secondaryBtn}
              onClick={() => setShowPostModal(false)}
            >
              Cancel
            </button>
            <button style={styles.primaryBtnModal} onClick={postJob}>
              Post Job
            </button>
          </div>
        </Modal>
      )}
    </RecruiterLayout>
  );
}

/* ================= MODAL ================= */
function Modal({ title, children, onClose }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button style={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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

  primaryBtn: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s",
    fontSize: "14px",
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

  

  /* ===== MODAL ===== */
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },

  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: "28px",
    cursor: "pointer",
    color: "#6b7280",
    padding: "0",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    transition: "all 0.2s",
  },

  input: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    transition: "border-color 0.2s",
  },

  textarea: {
    minHeight: "100px",
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    resize: "vertical",
    transition: "border-color 0.2s",
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    marginTop: "0.5rem",
  },

  secondaryBtn: {
    background: "#f3f4f6",
    color: "#1f2937",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s",
  },

  primaryBtnModal: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s",
  },
};
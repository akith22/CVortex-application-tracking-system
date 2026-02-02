import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import CandidateLayout from "../components/CandidateLayout";

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [editName, setEditName] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  /* ================= CLOCK UPDATE ================= */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ================= FETCH PROFILE & APPLICATIONS ON MOUNT ================= */
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch profile
      const profileRes = await api.get("/candidate/profile");
      setProfile(profileRes.data);
      setEditName(profileRes.data.name);

      // Fetch applications
      const appsRes = await api.get("/candidate/applications");
      setApplications(appsRes.data);

      setLoading(false);
    } catch (err) {
      setLoading(false);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Unauthorized. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(err.response?.data?.message || "Failed to load dashboard data");
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

  /* ================= COMPUTE STATS FROM APPLICATIONS ================= */
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(
    (app) => app.status === "APPLIED"
  ).length;
  const shortlistedApplications = applications.filter(
    (app) => app.status === "SHORTLISTED"
  ).length;
  const resumesUploaded = applications.filter((app) => app.resumeUploaded).length;

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

      {/* ================= HEADER WITH CLOCK ================= */}
      <div style={styles.header}>
        <div>
          <h1>Welcome back, {profile?.name}</h1>
          <p style={styles.subtitle}>Candidate Dashboard</p>
        </div>
        <div style={styles.clockCard}>
          <div style={styles.clockIcon}>🕐</div>
          <div>
            <p style={styles.clockTime}>
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
            <p style={styles.clockDate}>
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* ================= QUICK STATS (REAL DATA) ================= */}
      <div style={styles.statsGrid}>
        <div
          style={styles.statCard}
          onClick={() => navigate("/candidate/applications")}
        >
          <div style={{ ...styles.statIcon, background: "#dbeafe" }}>📋</div>
          <div>
            <p style={styles.statLabel}>Total Applications</p>
            <p style={styles.statValue}>{totalApplications}</p>
          </div>
        </div>

        <div
          style={styles.statCard}
          onClick={() => navigate("/candidate/applications")}
        >
          <div style={{ ...styles.statIcon, background: "#fef3c7" }}>⏳</div>
          <div>
            <p style={styles.statLabel}>Pending Review</p>
            <p style={styles.statValue}>{pendingApplications}</p>
          </div>
        </div>

        <div
          style={styles.statCard}
          onClick={() => navigate("/candidate/applications")}
        >
          <div style={{ ...styles.statIcon, background: "#d1fae5" }}>⭐</div>
          <div>
            <p style={styles.statLabel}>Shortlisted</p>
            <p style={styles.statValue}>{shortlistedApplications}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#e0e7ff" }}>📄</div>
          <div>
            <p style={styles.statLabel}>Resumes Uploaded</p>
            <p style={styles.statValue}>
              {resumesUploaded}/{totalApplications || 0}
            </p>
          </div>
        </div>
      </div>

      {/* ================= RECENT APPLICATIONS ================= */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2>Recent Applications</h2>
          <button
            style={styles.viewAllBtn}
            onClick={() => navigate("/candidate/applications")}
          >
            View All
          </button>
        </div>

        {applications.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <p style={styles.emptyTitle}>No Applications Yet</p>
            <p style={styles.emptyDescription}>
              Start by browsing available jobs and applying to positions that
              match your skills.
            </p>
            <button
              style={styles.browseBtn}
              onClick={() => navigate("/candidate/jobs")}
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div style={styles.recentList}>
            {applications.slice(0, 3).map((app) => (
              <div key={app.applicationId} style={styles.recentItem}>
                <div style={styles.recentInfo}>
                  <h4 style={styles.recentJobTitle}>{app.jobTitle}</h4>
                  <p style={styles.recentMeta}>
                    <span style={styles.recentIcon}>📍</span>
                    {app.jobLocation} · {app.recruiterName}
                  </p>
                  <p style={styles.recentDate}>
                    Applied on{" "}
                    {new Date(app.appliedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span style={getStatusBadgeStyle(app.status)}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
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

      {/* ================= QUICK ACTIONS ================= */}
      <div style={styles.card}>
        <h2 style={{ marginBottom: "1.5rem" }}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          <button
            style={styles.actionCard}
            onClick={() => navigate("/candidate/jobs")}
          >
            <div style={styles.actionIcon}>🔍</div>
            <div>
              <p style={styles.actionTitle}>Browse Jobs</p>
              <p style={styles.actionDescription}>
                Find new opportunities
              </p>
            </div>
          </button>

          <button
            style={styles.actionCard}
            onClick={() => navigate("/candidate/applications")}
          >
            <div style={styles.actionIcon}>📊</div>
            <div>
              <p style={styles.actionTitle}>Track Applications</p>
              <p style={styles.actionDescription}>
                Monitor your progress
              </p>
            </div>
          </button>

          <button
            style={styles.actionCard}
            onClick={() => setShowProfile(true)}
          >
            <div style={styles.actionIcon}>⚙️</div>
            <div>
              <p style={styles.actionTitle}>Update Profile</p>
              <p style={styles.actionDescription}>
                Keep your info current
              </p>
            </div>
          </button>
        </div>
      </div>
    </CandidateLayout>
  );
}

/* ================= HELPER FUNCTIONS ================= */
function getStatusBadgeStyle(status) {
  const baseStyle = {
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
  };

  switch (status) {
    case "APPLIED":
      return {
        ...baseStyle,
        background: "#dbeafe",
        color: "#1e40af",
      };
    case "SHORTLISTED":
      return {
        ...baseStyle,
        background: "#d1fae5",
        color: "#065f46",
      };
    case "REJECTED":
      return {
        ...baseStyle,
        background: "#fee2e2",
        color: "#991b1b",
      };
    case "HIRED":
      return {
        ...baseStyle,
        background: "#fef3c7",
        color: "#92400e",
      };
    default:
      return {
        ...baseStyle,
        background: "#f3f4f6",
        color: "#374151",
      };
  }
}

/* ================= STYLES ================= */
const styles = {
  loadingPage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
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

  /* ===== HEADER WITH CLOCK ===== */
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "1rem",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "0.5rem",
  },

  clockCard: {
    background: "#fff",
    padding: "0.75rem 1.25rem",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    border: "1px solid #e5e7eb",
  },

  clockIcon: {
    fontSize: "32px",
  },

  clockTime: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    color: "#1f2937",
    fontFamily: "monospace",
  },

  clockDate: {
    margin: "4px 0 0 0",
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: 500,
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
    cursor: "pointer",
    transition: "all 0.3s",
    border: "2px solid transparent",
  },

  statIcon: {
    fontSize: "40px",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
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
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #e5e7eb",
  },

  viewAllBtn: {
    background: "transparent",
    color: "#1e40af",
    border: "2px solid #1e40af",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.3s",
  },

  editBtn: {
    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s",
  },

  /* ===== EMPTY STATE ===== */
  emptyState: {
    textAlign: "center",
    padding: "2rem",
  },

  emptyIcon: {
    fontSize: "64px",
    marginBottom: "1rem",
  },

  emptyTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#1f2937",
    margin: "0 0 0.5rem 0",
  },

  emptyDescription: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0 0 1.5rem 0",
  },

  browseBtn: {
    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
    color: "#fff",
    border: "none",
    padding: "0.75rem 2rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.3s",
  },

  /* ===== RECENT APPLICATIONS ===== */
  recentList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  recentItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    background: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    gap: "1rem",
  },

  recentInfo: {
    flex: 1,
  },

  recentJobTitle: {
    margin: "0 0 0.5rem 0",
    fontSize: "16px",
    fontWeight: 700,
    color: "#1f2937",
  },

  recentMeta: {
    margin: "0 0 0.25rem 0",
    fontSize: "13px",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },

  recentIcon: {
    fontSize: "12px",
  },

  recentDate: {
    margin: 0,
    fontSize: "12px",
    color: "#9ca3af",
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
    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
    color: "#fff",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    width: "fit-content",
    fontSize: "14px",
  },

  /* ===== QUICK ACTIONS ===== */
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
  },

  actionCard: {
    background: "#f9fafb",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    padding: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    cursor: "pointer",
    transition: "all 0.3s",
    textAlign: "left",
  },

  actionIcon: {
    fontSize: "36px",
  },

  actionTitle: {
    margin: "0 0 0.25rem 0",
    fontSize: "14px",
    fontWeight: 700,
    color: "#1f2937",
  },

  actionDescription: {
    margin: 0,
    fontSize: "12px",
    color: "#6b7280",
  },
};
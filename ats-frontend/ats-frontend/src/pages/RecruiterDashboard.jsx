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
  const [currentTime, setCurrentTime] = useState(new Date());

  const [showProfile, setShowProfile] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  const [editName, setEditName] = useState("");
  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    type: "",
    description: "",
  });

  /* ================= CLOCK UPDATE ================= */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      const jobsData = jobsRes.data;

      // Fetch applications for each job to get statistics
      const jobsWithApplications = await Promise.all(
        jobsData.map(async (job) => {
          try {
            const appsRes = await api.get(`/recruiter/jobs/${job.jobsId}/applicants`);
            return {
              ...job,
              applications: appsRes.data || [],
            };
          } catch (err) {
            console.error(`Failed to load applicants for job ${job.jobsId}`, err);
            return {
              ...job,
              applications: [],
            };
          }
        })
      );

      setJobs(jobsWithApplications);
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

      await api.put("/recruiter/profile", { name: editName });

      // Refresh profile
      const profileRes = await api.get("/recruiter/profile");
      setProfile(profileRes.data);

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

      // Refresh jobs
      await fetchRecruiterData();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job");
    }
  };

  /* ================= COMPUTE STATS FROM JOBS & APPLICATIONS ================= */
  const totalJobs = jobs.length;
  const openJobs = jobs.filter((job) => job.status === "OPEN").length;

  // Flatten all applications from all jobs
  const allApplications = jobs.flatMap((job) => job.applications || []);
  const totalApplications = allApplications.length;

  const pendingApplications = allApplications.filter(
    (app) => app.status === "APPLIED"
  ).length;

  const shortlistedApplications = allApplications.filter(
    (app) => app.status === "SHORTLISTED"
  ).length;

  const hiredCount = allApplications.filter(
    (app) => app.status === "HIRED"
  ).length;

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

      {/* ================= HEADER WITH CLOCK ================= */}
      <div style={styles.header}>
        <div>
          <h1>Welcome back, {profile?.name}</h1>
          <p style={styles.subtitle}>Recruiter Dashboard</p>
        </div>
        <div style={styles.headerRight}>
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
          <button
            style={styles.primaryBtn}
            onClick={() => setShowPostModal(true)}
          >
            + Post Vacancy
          </button>
        </div>
      </div>

      {/* ================= QUICK STATS (REAL DATA) ================= */}
      <div style={styles.statsGrid}>
        <div
          style={styles.statCard}
          onClick={() => navigate("/recruiter/jobs")}
        >
          <div style={{ ...styles.statIcon, background: "#dbeafe" }}>📋</div>
          <div>
            <p style={styles.statLabel}>Total Vacancies</p>
            <p style={styles.statValue}>{totalJobs}</p>
            <p style={styles.statSubtext}>{openJobs} Open</p>
          </div>
        </div>

        <div
          style={styles.statCard}
          onClick={() => navigate("/recruiter/applications")}
        >
          <div style={{ ...styles.statIcon, background: "#fef3c7" }}>📨</div>
          <div>
            <p style={styles.statLabel}>Total Applications</p>
            <p style={styles.statValue}>{totalApplications}</p>
            <p style={styles.statSubtext}>{pendingApplications} Pending</p>
          </div>
        </div>

        <div
          style={styles.statCard}
          onClick={() => navigate("/recruiter/applications")}
        >
          <div style={{ ...styles.statIcon, background: "#d1fae5" }}>⭐</div>
          <div>
            <p style={styles.statLabel}>Shortlisted</p>
            <p style={styles.statValue}>{shortlistedApplications}</p>
            <p style={styles.statSubtext}>Candidates</p>
          </div>
        </div>

        <div
          style={styles.statCard}
          onClick={() => navigate("/recruiter/applications")}
        >
          <div style={{ ...styles.statIcon, background: "#e0e7ff" }}>✅</div>
          <div>
            <p style={styles.statLabel}>Hired</p>
            <p style={styles.statValue}>{hiredCount}</p>
            <p style={styles.statSubtext}>Candidates</p>
          </div>
        </div>
      </div>

      {/* ================= RECENT JOBS ================= */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2>Recent Job Postings</h2>
          <button
            style={styles.viewAllBtn}
            onClick={() => navigate("/recruiter/jobs")}
          >
            View All Jobs
          </button>
        </div>

        {jobs.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <p style={styles.emptyTitle}>No Jobs Posted Yet</p>
            <p style={styles.emptyDescription}>
              Create your first job posting to start receiving applications from talented candidates.
            </p>
            <button
              style={styles.browseBtn}
              onClick={() => setShowPostModal(true)}
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          <div style={styles.recentList}>
            {jobs.slice(0, 3).map((job) => (
              <div key={job.jobsId} style={styles.recentItem}>
                <div style={styles.recentInfo}>
                  <div style={styles.jobTitleRow}>
                    <h4 style={styles.recentJobTitle}>{job.title}</h4>
                    <span
                      style={{
                        ...styles.jobStatusBadge,
                        background: job.status === "OPEN" ? "#10b981" : "#6b7280",
                      }}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p style={styles.recentMeta}>
                    <span style={styles.recentIcon}>📍</span>
                    {job.location}
                    {job.type && (
                      <>
                        <span style={styles.recentSeparator}>•</span>
                        <span style={styles.recentIcon}>💼</span>
                        {job.type}
                      </>
                    )}
                  </p>
                  <div style={styles.applicantStats}>
                    <span style={styles.applicantBadge}>
                      📨 {job.applications?.length || 0} Applications
                    </span>
                    {job.applications && job.applications.filter((a) => a.status === "SHORTLISTED").length > 0 && (
                      <span style={styles.shortlistBadge}>
                        ⭐ {job.applications.filter((a) => a.status === "SHORTLISTED").length} Shortlisted
                      </span>
                    )}
                  </div>
                </div>
                <button
                  style={styles.viewJobBtn}
                  onClick={() => navigate("/recruiter/applications")}
                >
                  View Applications
                </button>
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
            onClick={() => setShowPostModal(true)}
          >
            <div style={styles.actionIcon}>➕</div>
            <div>
              <p style={styles.actionTitle}>Post New Job</p>
              <p style={styles.actionDescription}>
                Create a vacancy
              </p>
            </div>
          </button>

          <button
            style={styles.actionCard}
            onClick={() => navigate("/recruiter/applications")}
          >
            <div style={styles.actionIcon}>👥</div>
            <div>
              <p style={styles.actionTitle}>Review Applications</p>
              <p style={styles.actionDescription}>
                Manage candidates
              </p>
            </div>
          </button>

          <button
            style={styles.actionCard}
            onClick={() => navigate("/recruiter/jobs")}
          >
            <div style={styles.actionIcon}>📋</div>
            <div>
              <p style={styles.actionTitle}>Manage Jobs</p>
              <p style={styles.actionDescription}>
                View all postings
              </p>
            </div>
          </button>
        </div>
      </div>

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

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },

  clockCard: {
    background: "#fff",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
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

  statSubtext: {
    margin: "4px 0 0 0",
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: 500,
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

  primaryBtn: {
    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s",
    fontSize: "14px",
    whiteSpace: "nowrap",
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

  /* ===== RECENT JOBS LIST ===== */
  recentList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  recentItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.25rem",
    background: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    gap: "1rem",
  },

  recentInfo: {
    flex: 1,
  },

  jobTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "0.5rem",
  },

  recentJobTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 700,
    color: "#1f2937",
  },

  jobStatusBadge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "1rem",
    color: "#fff",
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  recentMeta: {
    margin: "0 0 0.75rem 0",
    fontSize: "13px",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    flexWrap: "wrap",
  },

  recentIcon: {
    fontSize: "12px",
  },

  recentSeparator: {
    color: "#d1d5db",
  },

  applicantStats: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },

  applicantBadge: {
    background: "#dbeafe",
    color: "#1e40af",
    padding: "0.25rem 0.75rem",
    borderRadius: "1rem",
    fontSize: "11px",
    fontWeight: 600,
  },

  shortlistBadge: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "0.25rem 0.75rem",
    borderRadius: "1rem",
    fontSize: "11px",
    fontWeight: 600,
  },

  viewJobBtn: {
    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.25rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
    transition: "all 0.3s",
    whiteSpace: "nowrap",
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
    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s",
  },
};
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AdminLayout from "../components/AdminLayout";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentTime, setCurrentTime] = useState(new Date());

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showProfile, setShowProfile] = useState(false);
  const [editName, setEditName] = useState("");

  /* ================= CLOCK UPDATE ================= */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch admin profile
      const profileRes = await api.get("/admin/profile");
      setProfile(profileRes.data);
      setEditName(profileRes.data.name);

      // Fetch dashboard stats
      const statsRes = await api.get("/admin/dashboard/stats");
      setStats(statsRes.data);

      // Fetch all users
      const usersRes = await api.get("/admin/users");
      setUsers(usersRes.data);

      // Fetch all jobs
      const jobsRes = await api.get("/admin/jobs");
      setJobs(jobsRes.data);

      setLoading(false);
    } catch (err) {
      setLoading(false);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Unauthorized. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(err.response?.data?.message || "Failed to load admin data");
      }
    }
  };

  /* ================= UPDATE NAME ================= */
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

      await api.put("/admin/profile", { name: editName });

      // Refresh profile
      const profileRes = await api.get("/admin/profile");
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

  /* ================= LOADING STATE ================= */
  if (loading && !stats) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner}></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      profile={profile}
      showProfile={showProfile}
      setShowProfile={setShowProfile}
      editName={editName}
      setEditName={setEditName}
      updateName={updateName}
    >
      {/* ================= ERROR ALERT ================= */}
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

      {/* ================= SUCCESS ALERT ================= */}
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

      {/* ================= DASHBOARD TAB ================= */}
      {activeTab === "dashboard" && (
        <>
          {/* ================= HEADER WITH CLOCK ================= */}
          <div style={styles.header}>
            <div>
              <h1>Welcome Back, {profile?.name}</h1>
              <p style={styles.subtitle}>Admin Dashboard</p>
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

          {/* ================= STATS GRID ================= */}
          {stats && (
            <div style={styles.statsGrid}>
              <div
                style={styles.statCard}
                onClick={() => setActiveTab("users")}
              >
                <div style={{ ...styles.statIcon, background: "#dbeafe" }}>
                  👥
                </div>
                <div>
                  <p style={styles.statLabel}>Total Users</p>
                  <p style={styles.statValue}>{stats.totalUsers}</p>
                  <p style={styles.statSubtext}>In the system</p>
                </div>
              </div>

              <div
                style={styles.statCard}
                onClick={() => setActiveTab("users")}
              >
                <div style={{ ...styles.statIcon, background: "#fef3c7" }}>
                  💼
                </div>
                <div>
                  <p style={styles.statLabel}>Recruiters</p>
                  <p style={styles.statValue}>{stats.recruiters}</p>
                  <p style={styles.statSubtext}>Active recruiters</p>
                </div>
              </div>

              <div
                style={styles.statCard}
                onClick={() => setActiveTab("users")}
              >
                <div style={{ ...styles.statIcon, background: "#d1fae5" }}>
                  🎯
                </div>
                <div>
                  <p style={styles.statLabel}>Candidates</p>
                  <p style={styles.statValue}>{stats.candidates}</p>
                  <p style={styles.statSubtext}>Job seekers</p>
                </div>
              </div>

              <div
                style={styles.statCard}
                onClick={() => setActiveTab("jobs")}
              >
                <div style={{ ...styles.statIcon, background: "#e0e7ff" }}>
                  📋
                </div>
                <div>
                  <p style={styles.statLabel}>Total Jobs</p>
                  <p style={styles.statValue}>{stats.totalJobs}</p>
                  <p style={styles.statSubtext}>
                    {stats.openJobs} Open, {stats.closedJobs} Closed
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= QUICK OVERVIEW ================= */}
          <div style={styles.overviewGrid}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2>Recent Users</h2>
                <button
                  style={styles.viewAllBtn}
                  onClick={() => setActiveTab("users")}
                >
                  View All
                </button>
              </div>
              {users.length === 0 ? (
                <p style={styles.empty}>No users available</p>
              ) : (
                <div style={styles.userList}>
                  {users.slice(0, 5).map((user, index) => (
                    <div key={index} style={styles.userRow}>
                      <div style={styles.userInfo}>
                        <div style={styles.userAvatar}>
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p style={styles.userName}>{user.name}</p>
                          <p style={styles.userEmail}>{user.email}</p>
                        </div>
                      </div>
                      <span
                        style={{
                          ...styles.roleBadge,
                          background:
                            user.role === "RECRUITER"
                              ? "#fef3c7"
                              : user.role === "CANDIDATE"
                              ? "#d1fae5"
                              : "#e0e7ff",
                          color:
                            user.role === "RECRUITER"
                              ? "#92400e"
                              : user.role === "CANDIDATE"
                              ? "#065f46"
                              : "#3730a3",
                        }}
                      >
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2>Recent Jobs</h2>
                <button
                  style={styles.viewAllBtn}
                  onClick={() => setActiveTab("jobs")}
                >
                  View All
                </button>
              </div>
              {jobs.length === 0 ? (
                <p style={styles.empty}>No jobs available</p>
              ) : (
                <div style={styles.jobList}>
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job.jobId} style={styles.jobRow}>
                      <div>
                        <p style={styles.jobTitle}>{job.title}</p>
                        <p style={styles.jobMeta}>
                          <span style={styles.jobIcon}>📍</span>
                          {job.location}
                          <span style={styles.separator}>•</span>
                          <span style={styles.jobIcon}>👤</span>
                          {job.recruiterName}
                        </p>
                      </div>
                      <span
                        style={{
                          ...styles.statusBadge,
                          background:
                            job.status === "OPEN" ? "#10b981" : "#6b7280",
                        }}
                      >
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ================= USERS TAB ================= */}
      {activeTab === "users" && (
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2>All Users ({users.length})</h2>
            <div style={styles.filterBadges}>
              <span style={styles.filterBadge}>
                💼 {users.filter((u) => u.role === "RECRUITER").length}{" "}
                Recruiters
              </span>
              <span style={styles.filterBadge}>
                🎯 {users.filter((u) => u.role === "CANDIDATE").length}{" "}
                Candidates
              </span>
            </div>
          </div>

          {users.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>👥</div>
              <p style={styles.emptyTitle}>No Users Found</p>
              <p style={styles.emptyDescription}>
                No users are registered in the system yet.
              </p>
            </div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Name</th>
                    <th style={styles.tableHeader}>Email</th>
                    <th style={styles.tableHeader}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index} style={styles.tableRow}>
                      <td style={styles.tableCell}>
                        <div style={styles.userInfo}>
                          <div style={styles.userAvatarSmall}>
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <span style={styles.userName}>{user.name}</span>
                        </div>
                      </td>
                      <td style={styles.tableCell}>{user.email}</td>
                      <td style={styles.tableCell}>
                        <span
                          style={{
                            ...styles.roleBadge,
                            background:
                              user.role === "RECRUITER"
                                ? "#fef3c7"
                                : user.role === "CANDIDATE"
                                ? "#d1fae5"
                                : "#e0e7ff",
                            color:
                              user.role === "RECRUITER"
                                ? "#92400e"
                                : user.role === "CANDIDATE"
                                ? "#065f46"
                                : "#3730a3",
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ================= JOBS TAB ================= */}
      {activeTab === "jobs" && (
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2>All Job Posts ({jobs.length})</h2>
            <div style={styles.filterBadges}>
              <span style={styles.filterBadge}>
                ✅ {jobs.filter((j) => j.status === "OPEN").length} Open
              </span>
              <span style={styles.filterBadge}>
                🔒 {jobs.filter((j) => j.status === "CLOSED").length} Closed
              </span>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📋</div>
              <p style={styles.emptyTitle}>No Jobs Found</p>
              <p style={styles.emptyDescription}>
                No job postings are available in the system yet.
              </p>
            </div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Job Title</th>
                    <th style={styles.tableHeader}>Location</th>
                    <th style={styles.tableHeader}>Recruiter</th>
                    <th style={styles.tableHeader}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.jobId} style={styles.tableRow}>
                      <td style={styles.tableCell}>
                        <div style={styles.jobTitleCell}>
                          <span style={styles.jobTitleText}>{job.title}</span>
                          <span style={styles.jobId}>ID: {job.jobId}</span>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={styles.locationText}>
                          📍 {job.location}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.recruiterCell}>
                          <span style={styles.recruiterName}>
                            {job.recruiterName}
                          </span>
                          <span style={styles.recruiterEmail}>
                            {job.recruiterEmail}
                          </span>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            background:
                              job.status === "OPEN" ? "#10b981" : "#6b7280",
                          }}
                        >
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </AdminLayout>
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

  alertTitle: {
    fontWeight: 600,
    margin: "0 0 4px 0",
  },

  alertMessage: {
    margin: 0,
    fontSize: "14px",
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
    flexWrap: "wrap",
    gap: "1rem",
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

  filterBadges: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },

  filterBadge: {
    background: "#f3f4f6",
    color: "#1f2937",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
  },

  /* ===== OVERVIEW GRID ===== */
  overviewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
    gap: "1.5rem",
  },

  /* ===== USER LIST ===== */
  userList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  userRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    background: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },

  userAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "16px",
  },

  userAvatarSmall: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "13px",
  },

  userName: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 600,
    color: "#1f2937",
  },

  userEmail: {
    margin: "2px 0 0 0",
    fontSize: "12px",
    color: "#6b7280",
  },

  roleBadge: {
    padding: "0.35rem 0.75rem",
    borderRadius: "1rem",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  /* ===== JOB LIST ===== */
  jobList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  jobRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    background: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },

  jobTitle: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 700,
    color: "#1f2937",
  },

  jobMeta: {
    margin: "4px 0 0 0",
    fontSize: "12px",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    flexWrap: "wrap",
  },

  jobIcon: {
    fontSize: "12px",
  },

  separator: {
    color: "#d1d5db",
  },

  statusBadge: {
    padding: "0.35rem 0.75rem",
    borderRadius: "1rem",
    color: "#fff",
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  /* ===== TABLE ===== */
  tableContainer: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  tableHeaderRow: {
    background: "#f9fafb",
    borderBottom: "2px solid #e5e7eb",
  },

  tableHeader: {
    padding: "1rem",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  tableRow: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background 0.2s",
  },

  tableCell: {
    padding: "1rem",
    fontSize: "14px",
    color: "#1f2937",
  },

  jobTitleCell: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },

  jobTitleText: {
    fontWeight: 600,
    color: "#1f2937",
  },

  jobId: {
    fontSize: "11px",
    color: "#9ca3af",
  },

  locationText: {
    color: "#6b7280",
  },

  recruiterCell: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },

  recruiterName: {
    fontWeight: 600,
    color: "#1f2937",
  },

  recruiterEmail: {
    fontSize: "12px",
    color: "#6b7280",
  },

  /* ===== EMPTY STATE ===== */
  emptyState: {
    textAlign: "center",
    padding: "3rem 2rem",
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
    margin: 0,
  },

  empty: {
    color: "#6b7280",
    marginTop: "1rem",
    textAlign: "center",
  },
};
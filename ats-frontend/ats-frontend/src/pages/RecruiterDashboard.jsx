import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function RecruiterDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [profile, setProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [editName, setEditName] = useState("");

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    api.get("/recruiter/profile")
      .then((res) => {
        setProfile(res.data);
        setEditName(res.data.name);
      })
      .catch(() => {
        logout(); // token invalid / expired
      });
  }, []);

  /* ================= UPDATE NAME ================= */
  const updateName = async () => {
    try {
      await api.put("/recruiter/profile", { name: editName });
      setProfile({ ...profile, name: editName });
      setShowProfile(false);
    } catch {
      alert("Failed to update name");
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!profile) return null;

  return (
    <div style={styles.page}>
      {/* ================= SIDEBAR ================= */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>CVortex</h2>

        <nav style={styles.nav}>
          <button style={navBtn(activeTab === "jobs")} onClick={() => setActiveTab("jobs")}>
            Job Posts
          </button>
          <button
            style={navBtn(activeTab === "applications")}
            onClick={() => setActiveTab("applications")}
          >
            Applications
          </button>
        </nav>

        {/* ===== Bottom Area ===== */}
        <div style={styles.sidebarBottom}>
          <button style={styles.profileBtn} onClick={() => setShowProfile(true)}>
            {profile.name}
          </button>
          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1>Welcome, {profile.name} </h1>
          <h2>Recruiter Dashboard</h2>
        </header>

        {activeTab === "jobs" && (
          <section style={styles.card}>
            <h3>My Job Posts</h3>
            {jobs.length === 0 ? (
              <p style={styles.empty}>No job posts created yet</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} style={styles.row}>
                  <span>{job.title}</span>
                  <button style={styles.primaryBtn}>View</button>
                </div>
              ))
            )}
          </section>
        )}

        {activeTab === "applications" && (
          <section style={styles.card}>
            <h3>Candidate Applications</h3>
            {applications.length === 0 ? (
              <p style={styles.empty}>No applications received</p>
            ) : (
              applications.map((app) => (
                <div key={app.id} style={styles.row}>
                  <span>{app.candidateName}</span>
                  <select style={styles.select}>
                    <option>Applied</option>
                    <option>Shortlisted</option>
                    <option>Rejected</option>
                  </select>
                </div>
              ))
            )}
          </section>
        )}
      </main>

      {/* ================= PROFILE MODAL ================= */}
      {showProfile && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>My Profile</h3>

            <label>Name</label>
            <input
              style={styles.input}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <label>Email</label>
            <input style={styles.input} value={profile.email} disabled />

            <div style={styles.modalActions}>
              <button style={styles.secondaryBtn} onClick={() => setShowProfile(false)}>
                Cancel
              </button>
              <button style={styles.primaryBtn} onClick={updateName}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
    background: "#f9fafb",
  },
  sidebar: {
    width: "260px",
    background: "#1e40af",
    color: "#fff",
    padding: "2rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "1.6rem",
    marginBottom: "2rem",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  sidebarBottom: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  profileBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "0.6rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: 600,
  },
  logoutBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "0.6rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: 600,
  },
  main: {
    flex: 1,
    padding: "2.5rem",
  },
  header: {
    marginBottom: "2rem",
  },
  card: {
    background: "#fff",
    borderRadius: "0.75rem",
    padding: "1.75rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "1rem 0",
    borderBottom: "1px solid #e5e7eb",
  },
  primaryBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: 600,
  },
  secondaryBtn: {
    background: "#e5e7eb",
    border: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
  },
  empty: {
    color: "#6b7280",
    marginTop: "1rem",
  },
  select: {
    padding: "0.4rem",
    borderRadius: "0.4rem",
  },

  /* ===== Modal ===== */
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "0.75rem",
    width: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "0.4rem",
    border: "1px solid #d1d5db",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    marginTop: "1rem",
  },
};

const navBtn = (active) => ({
  background: active ? "#2563eb" : "transparent",
  color: "#fff",
  border: "none",
  textAlign: "left",
  padding: "0.7rem 1rem",
  borderRadius: "0.5rem",
  cursor: "pointer",
});

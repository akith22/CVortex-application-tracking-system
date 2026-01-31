import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // api.get("/admin/users")
    // api.get("/admin/jobs")
  }, []);

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>CVortex</h2>

        <nav style={styles.nav}>
          <button style={navBtn(activeTab === "users")} onClick={() => setActiveTab("users")}>
            Users
          </button>
          <button style={navBtn(activeTab === "jobs")} onClick={() => setActiveTab("jobs")}>
            Jobs
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1>Admin Dashboard</h1>
          <p>System overview and management</p>
        </header>

        {activeTab === "users" && (
          <section style={styles.card}>
            <h3>All Users</h3>

            {users.length === 0 ? (
              <p style={styles.empty}>No users available</p>
            ) : (
              users.map((u) => (
                <div key={u.id} style={styles.row}>
                  <span>{u.email}</span>
                  <span>{u.role}</span>
                </div>
              ))
            )}
          </section>
        )}

        {activeTab === "jobs" && (
          <section style={styles.card}>
            <h3>All Job Posts</h3>

            {jobs.length === 0 ? (
              <p style={styles.empty}>No job posts available</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} style={styles.row}>
                  <span>{job.title}</span>
                  <span>{job.status}</span>
                </div>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}

/* ================= STYLES (same as Candidate) ================= */

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
  },
  logo: {
    marginBottom: "2rem",
    fontSize: "1.6rem",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
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
  empty: {
    color: "#6b7280",
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

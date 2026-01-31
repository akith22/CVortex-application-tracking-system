import { useEffect, useState } from "react";
import api from "../api/axios";

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState("jobs");

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // api.get("/recruiter/jobs")
    // api.get("/recruiter/applications")
  }, []);

  return (
    <div style={styles.page}>
      {/* Sidebar */}
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
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1>Recruiter Dashboard</h1>
          <p>Manage job postings and candidates</p>
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
  primaryBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: 600,
  },
  empty: {
    color: "#6b7280",
    marginTop: "1rem",
  },
  select: {
    padding: "0.4rem",
    borderRadius: "0.4rem",
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

import { useEffect, useState } from "react";
import api from "../api/axios";

export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState("jobs");
  const [resume, setResume] = useState(null);

  // API-ready placeholders (NO mock data)
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Backend integration later
    // api.get("/candidate/jobs")
    // api.get("/candidate/applications")
  }, []);

  const handleResumeUpload = async () => {
    if (!resume) return alert("Please select a resume");

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      // await api.post("/candidate/upload-resume", formData);
      alert("Resume upload endpoint ready");
    } catch {
      alert("Resume upload failed");
    }
  };

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>CVortex</h2>

        <nav style={styles.nav}>
          <button style={navBtn(activeTab === "jobs")} onClick={() => setActiveTab("jobs")}>
            Browse Jobs
          </button>
          <button style={navBtn(activeTab === "applications")} onClick={() => setActiveTab("applications")}>
            Applications
          </button>
          <button style={navBtn(activeTab === "resume")} onClick={() => setActiveTab("resume")}>
            Resume
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1>Candidate Dashboard</h1>
          <p>Manage your job applications</p>
        </header>

        {/* Browse Jobs */}
        {activeTab === "jobs" && (
          <section style={styles.card}>
            <h3>Open Positions</h3>

            {jobs.length === 0 ? (
              <p style={styles.empty}>No job listings available</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} style={styles.jobCard}>
                  <div>
                    <strong>{job.title}</strong>
                    <p>{job.company}</p>
                  </div>
                  <button style={styles.primaryBtn}>Apply</button>
                </div>
              ))
            )}
          </section>
        )}

        {/* Applications */}
        {activeTab === "applications" && (
          <section style={styles.card}>
            <h3>My Applications</h3>

            {applications.length === 0 ? (
              <p style={styles.empty}>You haven't applied to any jobs yet</p>
            ) : (
              applications.map((app) => (
                <div key={app.id} style={styles.appRow}>
                  <span>{app.jobTitle}</span>
                  <span style={statusBadge(app.status)}>{app.status}</span>
                </div>
              ))
            )}
          </section>
        )}

        {/* Resume */}
        {activeTab === "resume" && (
          <section style={styles.card}>
            <h3>Upload Resume</h3>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              style={styles.file}
            />

            <button style={styles.primaryBtn} onClick={handleResumeUpload}>
              Upload Resume
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

/* ===================== STYLES ===================== */

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
  jobCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    borderBottom: "1px solid #e5e7eb",
  },
  appRow: {
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
  file: {
    margin: "1rem 0",
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

const statusBadge = (status) => ({
  padding: "0.3rem 0.7rem",
  borderRadius: "999px",
  background: "#e5e7eb",
  fontSize: "0.8rem",
});

import { useEffect, useState } from "react";
import api from "../api/axios";
import RecruiterLayout from "../components/RecruiterLayout";

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch profile for the layout
    api.get("/recruiter/profile")
      .then((res) => setProfile(res.data))
      .catch(() => console.error("Failed to load profile"));

    // Fetch jobs
    api.get("/recruiter/jobs")
      .then((res) => setJobs(res.data))
      .catch(() => console.error("Failed to load jobs"));
  }, []);

  const updateStatus = async (jobId, newStatus) => {
    try {
      await api.put(
        `/recruiter/jobs/${jobId}/status`,
        null,
        { params: { status: newStatus } }
      );

      setJobs((prev) =>
        prev.map((job) =>
          job.jobsId === jobId ? { ...job, status: newStatus } : job
        )
      );
    } catch (err) {
      console.error("Failed to update job status", err);
      alert("Failed to update job status");
    }
  };

  if (!profile) {
    return (
      <div style={{ padding: "2rem", fontFamily: "Inter, sans-serif" }}>
        Loading...
      </div>
    );
  }

  return (
    <RecruiterLayout profile={profile}>
      {/* ================= TOP BAR ================= */}
      <div style={styles.topBar}>
        <div>
          <h1>My Job Vacancies</h1>
          <p style={styles.subText}>Manage all your posted jobs</p>
        </div>
      </div>

      {/* ================= JOBS LIST ================= */}
      {jobs.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No jobs posted yet</p>
          <p style={styles.subText}>Create a vacancy from the dashboard to get started</p>
        </div>
      ) : (
        <div style={styles.jobsGrid}>
          {jobs.map((job) => (
            <div key={job.jobsId} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.jobTitle}>{job.title}</h3>
                <span style={{
                  ...styles.statusBadge,
                  background: job.status === "OPEN" ? "#10b981" : "#6b7280",
                }}>
                  {job.status}
                </span>
              </div>

              <div style={styles.cardContent}>
                <p style={styles.location}>📍 {job.location}</p>
                {job.type && <p style={styles.jobType}>💼 {job.type}</p>}
                {job.description && (
                  <p style={styles.description}>{job.description}</p>
                )}
              </div>

              <div style={styles.cardFooter}>
                <label style={styles.label}>Update Status:</label>
                <select
                  style={styles.select}
                  value={job.status}
                  onChange={(e) => updateStatus(job.jobsId, e.target.value)}
                >
                  <option value="OPEN">OPEN</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </RecruiterLayout>
  );
}

/* ================= STYLES ================= */

const styles = {
  topBar: {
    marginBottom: "2rem",
  },
  subText: {
    color: "#6b7280",
    fontSize: "0.95rem",
    marginTop: "0.25rem",
  },
  emptyState: {
    background: "#fff",
    padding: "3rem",
    borderRadius: "0.75rem",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  jobsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "0.75rem",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
    },
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
  },
  jobTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#1f2937",
    margin: 0,
  },
  statusBadge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "1rem",
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
  },
  cardContent: {
    marginBottom: "1rem",
  },
  location: {
    color: "#4b5563",
    fontSize: "0.95rem",
    marginBottom: "0.5rem",
  },
  jobType: {
    color: "#4b5563",
    fontSize: "0.95rem",
    marginBottom: "0.5rem",
  },
  description: {
    color: "#6b7280",
    fontSize: "0.9rem",
    lineHeight: "1.5",
    marginTop: "0.75rem",
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    paddingTop: "1rem",
    borderTop: "1px solid #e5e7eb",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#374151",
  },
  select: {
    flex: 1,
    padding: "0.5rem 0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    background: "#fff",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "border-color 0.2s",
    ":focus": {
      outline: "none",
      borderColor: "#2563eb",
    },
  },
};

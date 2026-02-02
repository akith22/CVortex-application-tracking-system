import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import CandidateLayout from "../components/CandidateLayout";

export default function CandidateJobs() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= FETCH DATA ON MOUNT ================= */
  useEffect(() => {
    fetchProfileAndJobs();
  }, []);

  const fetchProfileAndJobs = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch profile
      const profileRes = await api.get("/candidate/profile");
      setProfile(profileRes.data);
      setEditName(profileRes.data.name);

      // Fetch all open jobs
      const jobsRes = await api.get("/candidate/jobs");
      setJobs(jobsRes.data);

      setLoading(false);
    } catch (err) {
      setLoading(false);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Unauthorized. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(err.response?.data?.message || "Failed to load data");
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

  /* ================= VIEW JOB DETAILS ================= */
  const viewJobDetails = async (jobId) => {
    try {
      setError("");
      const res = await api.get(`/candidate/jobs/${jobId}`);
      setSelectedJob(res.data);
      setShowJobModal(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Job not found");
      } else if (err.response?.status === 403) {
        setError("This job is no longer available");
      } else {
        setError(err.response?.data?.message || "Failed to load job details");
      }
    }
  };

  /* ================= APPLY FOR JOB - REDIRECT TO APPLICATIONS PAGE ================= */
  const handleApplyClick = () => {
    // Navigate to applications page with the selected job data
    navigate("/candidate/applications", {
      state: {
        applyToJob: selectedJob,
        candidateInfo: profile,
      },
    });
  };

  /* ================= LOADING STATE ================= */
  if (loading && !profile) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner}></div>
        <p>Loading jobs...</p>
      </div>
    );
  }

  /* ================= FILTER JOBS BY SEARCH ================= */
  const filteredJobs = jobs.filter((job) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower) ||
      job.recruiterName.toLowerCase().includes(searchLower) ||
      (job.description && job.description.toLowerCase().includes(searchLower))
    );
  });

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

      {/* ================= HEADER ================= */}
      <div style={styles.header}>
        <div>
          <h1>Browse Jobs</h1>
          <p style={styles.subtitle}>Find and apply to job positions</p>
        </div>
        <div style={styles.statsInfo}>
          <span style={styles.statsText}>
            {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"} Available
          </span>
        </div>
      </div>

      {/* ================= SEARCH BAR ================= */}
      <div style={styles.searchContainer}>
        <div style={styles.searchWrapper}>
          <svg
            style={styles.searchIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by job title, location, or recruiter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button style={styles.clearBtn} onClick={() => setSearchQuery("")}>
              ×
            </button>
          )}
        </div>
        {searchQuery && (
          <p style={styles.searchResults}>
            Found {filteredJobs.length}{" "}
            {filteredJobs.length === 1 ? "job" : "jobs"} matching "{searchQuery}
            "
          </p>
        )}
      </div>

      {/* ================= JOBS LIST ================= */}
      {filteredJobs.length === 0 ? (
        <div style={styles.card}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💼</div>
            <p style={styles.emptyTitle}>No Jobs Available</p>
            <p style={styles.emptyDescription}>
              {searchQuery
                ? `No jobs found matching "${searchQuery}"`
                : "Check back later for new job opportunities"}
            </p>
          </div>
        </div>
      ) : (
        <div style={styles.jobsGrid}>
          {filteredJobs.map((job) => (
            <div key={job.jobsId} style={styles.jobCard}>
              <div style={styles.jobHeader}>
                <h3 style={styles.jobTitle}>{job.title}</h3>
                <span style={styles.statusBadge}>{job.status}</span>
              </div>

              <div style={styles.jobInfo}>
                <div style={styles.infoItem}>
                  <span style={styles.infoIcon}>📍</span>
                  <span style={styles.infoText}>{job.location}</span>
                </div>

                <div style={styles.infoItem}>
                  <span style={styles.infoIcon}>👤</span>
                  <span style={styles.infoText}>{job.recruiterName}</span>
                </div>

                <div style={styles.infoItem}>
                  <span style={styles.infoIcon}>📅</span>
                  <span style={styles.infoText}>
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p style={styles.jobDescription}>
                {job.description
                  ? job.description.substring(0, 150) + "..."
                  : "No description available"}
              </p>

              <button
                style={styles.viewBtn}
                onClick={() => viewJobDetails(job.jobsId)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= JOB DETAILS MODAL ================= */}
      {showJobModal && selectedJob && (
        <div style={styles.overlay} onClick={() => setShowJobModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0 }}>{selectedJob.title}</h2>
              <button
                style={styles.closeBtn}
                onClick={() => setShowJobModal(false)}
              >
                ×
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.modalSection}>
                <div style={styles.modalInfoGrid}>
                  <div style={styles.modalInfoItem}>
                    <label style={styles.modalLabel}>Location</label>
                    <p style={styles.modalValue}>
                      <span style={styles.infoIcon}>📍</span>
                      {selectedJob.location}
                    </p>
                  </div>

                  <div style={styles.modalInfoItem}>
                    <label style={styles.modalLabel}>Status</label>
                    <p style={styles.modalValue}>
                      <span style={styles.statusBadgeModal}>
                        {selectedJob.status}
                      </span>
                    </p>
                  </div>

                  <div style={styles.modalInfoItem}>
                    <label style={styles.modalLabel}>Recruiter</label>
                    <p style={styles.modalValue}>
                      <span style={styles.infoIcon}>👤</span>
                      {selectedJob.recruiterName}
                    </p>
                  </div>

                  <div style={styles.modalInfoItem}>
                    <label style={styles.modalLabel}>Contact</label>
                    <p style={styles.modalValue}>
                      <span style={styles.infoIcon}>📧</span>
                      {selectedJob.recruiterEmail}
                    </p>
                  </div>

                  <div style={styles.modalInfoItem}>
                    <label style={styles.modalLabel}>Posted Date</label>
                    <p style={styles.modalValue}>
                      <span style={styles.infoIcon}>📅</span>
                      {new Date(selectedJob.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div style={styles.modalSection}>
                <label style={styles.modalLabel}>Job Description</label>
                <p style={styles.descriptionText}>
                  {selectedJob.description || "No description available"}
                </p>
              </div>

              <div style={styles.modalActions}>
                <button
                  style={styles.secondaryBtn}
                  onClick={() => setShowJobModal(false)}
                >
                  Close
                </button>
                <button style={styles.applyBtn} onClick={handleApplyClick}>
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "0.5rem",
  },

  statsInfo: {
    background: "#fff",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },

  statsText: {
    fontWeight: 600,
    color: "#667eea",
    fontSize: "14px",
  },

  /* ===== SEARCH BAR ===== */
  searchContainer: {
    marginBottom: "2rem",
  },

  searchWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    border: "2px solid #e5e7eb",
    transition: "all 0.3s",
  },

  searchIcon: {
    position: "absolute",
    left: "1rem",
    width: "20px",
    height: "20px",
    color: "#9ca3af",
    pointerEvents: "none",
  },

  searchInput: {
    width: "100%",
    padding: "1rem 1rem 1rem 3rem",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    outline: "none",
    fontFamily: "Inter, sans-serif",
  },

  clearBtn: {
    position: "absolute",
    right: "1rem",
    background: "#f3f4f6",
    border: "none",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "20px",
    color: "#6b7280",
    transition: "all 0.2s",
  },

  searchResults: {
    marginTop: "0.75rem",
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: 500,
  },

  /* ===== JOBS GRID ===== */
  jobsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "1.5rem",
  },

  jobCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "all 0.3s",
    border: "1px solid #e5e7eb",
    cursor: "pointer",
  },

  jobHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
    gap: "1rem",
  },

  jobTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "#1f2937",
    lineHeight: "1.4",
  },

  statusBadge: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "0.25rem 0.75rem",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  jobInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "1rem",
  },

  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },

  infoIcon: {
    fontSize: "14px",
  },

  infoText: {
    fontSize: "14px",
    color: "#6b7280",
  },

  jobDescription: {
    fontSize: "14px",
    color: "#4b5563",
    lineHeight: "1.6",
    marginBottom: "1rem",
  },

  viewBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    padding: "0.75rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.3s",
  },

  /* ===== EMPTY STATE ===== */
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "3rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },

  emptyState: {
    textAlign: "center",
    padding: "2rem",
  },

  emptyIcon: {
    fontSize: "64px",
    marginBottom: "1rem",
  },

  emptyTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#1f2937",
    margin: "0 0 0.5rem 0",
  },

  emptyDescription: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
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
    borderRadius: "12px",
    width: "90%",
    maxWidth: "700px",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 1,
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

  modalContent: {
    padding: "1.5rem",
  },

  modalSection: {
    marginBottom: "1.5rem",
  },

  modalInfoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
  },

  modalInfoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  modalLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  modalValue: {
    margin: 0,
    fontSize: "14px",
    color: "#1f2937",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },

  statusBadgeModal: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "0.25rem 0.75rem",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
  },

  descriptionText: {
    fontSize: "14px",
    color: "#4b5563",
    lineHeight: "1.8",
    margin: "0.5rem 0 0 0",
    whiteSpace: "pre-wrap",
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    marginTop: "1.5rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid #e5e7eb",
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

  applyBtn: {
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
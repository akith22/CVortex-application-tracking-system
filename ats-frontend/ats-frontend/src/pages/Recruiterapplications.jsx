import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import RecruiterLayout from "../components/RecruiterLayout";

export default function RecruiterApplications() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicantModal, setShowApplicantModal] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch profile
      const profileRes = await api.get("/recruiter/profile");
      setProfile(profileRes.data);

      // Fetch jobs with applicants
      const jobsRes = await api.get("/recruiter/jobs");
      const jobsData = jobsRes.data;

      // For each job, fetch its applicants
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
      console.error("Error fetching data:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Unauthorized. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(err.response?.data?.message || "Failed to load applications");
      }
    }
  };

  /* ================= ACTIONS ================= */
  const viewApplicant = (applicant) => {
    setSelectedApplicant(applicant);
    setShowApplicantModal(true);
  };

  const downloadResume = async (resumeId) => {
    try {
      const response = await api.get(`/recruiter/resumes/${resumeId}/download`, {
        responseType: 'blob',
      });

      // Create blob and open in new tab
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');

      // Clean up
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error("Resume download error:", err);
      setError("Failed to open resume");
      setTimeout(() => setError(""), 3000);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      setError("");
      setSuccess("");

      await api.put(`/recruiter/applications/${applicationId}/status`, {
        status: newStatus,
      });

      // Update local state
      setJobs((prevJobs) =>
        prevJobs.map((job) => ({
          ...job,
          applications: job.applications.map((app) =>
            (app.applicationId || app.id) === applicationId
              ? { ...app, status: newStatus }
              : app
          ),
        }))
      );

      // Update modal if open
      if (selectedApplicant && (selectedApplicant.applicationId || selectedApplicant.id) === applicationId) {
        setSelectedApplicant((prev) => ({
          ...prev,
          status: newStatus,
        }));
      }

      setSuccess("Application status updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Status update error:", err);
      setError(err.response?.data?.message || "Failed to update status");
      setTimeout(() => setError(""), 3000);
    }
  };

  /* ================= HELPER FUNCTIONS ================= */
  // Flexible field access to handle different DTO structures
  const getField = (obj, ...fields) => {
    for (let field of fields) {
      if (obj && obj[field] !== undefined && obj[field] !== null) {
        return obj[field];
      }
    }
    return null;
  };

  const getApplicantId = (app) => getField(app, 'applicationId', 'id');
  const getApplicantName = (app) => getField(app, 'applicantName', 'name', 'candidateName', 'userName');
  const getApplicantEmail = (app) => getField(app, 'applicantEmail', 'email', 'candidateEmail', 'userEmail');
  const getApplicantPhone = (app) => getField(app, 'applicantPhone', 'phone', 'candidatePhone', 'phoneNumber', 'contactNumber');
  const getResumeId = (app) => getField(app, 'resumeId', 'resume_id', 'resumeID');
  const getCoverLetter = (app) => getField(app, 'coverLetter', 'cover_letter', 'message');
  const getAppliedDate = (app) => getField(app, 'appliedAt', 'applied_at', 'createdAt', 'applicationDate', 'submittedAt');
  const getStatus = (app) => getField(app, 'status', 'applicationStatus') || 'APPLIED';
  const getCandidateId = (app) => getField(app, 'candidateId', 'candidate_id', 'userId', 'user_id');

  /* ================= LOADING STATE ================= */
  if (loading && !profile) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner}></div>
        <p>Loading applications...</p>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <RecruiterLayout profile={profile}>
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
          <h1>Applications Management</h1>
          <p style={styles.subtitle}>Review and manage applicants for your job postings</p>
        </div>
      </div>

      {/* ================= JOBS & APPLICATIONS ================= */}
      {jobs.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📭</div>
          <h3>No Jobs Posted Yet</h3>
          <p style={styles.emptyText}>
            Post a job vacancy to start receiving applications
          </p>
        </div>
      ) : (
        <div style={styles.jobsContainer}>
          {jobs.map((job) => (
            <div key={job.jobsId} style={styles.jobSection}>
              {/* Job Header */}
              <div style={styles.jobHeader}>
                <div>
                  <h2 style={styles.jobTitle}>{job.title}</h2>
                  <div style={styles.jobMeta}>
                    <span style={styles.metaItem}>📍 {job.location}</span>
                    {job.type && <span style={styles.metaItem}>💼 {job.type}</span>}
                    <span
                      style={{
                        ...styles.statusBadge,
                        background: job.status === "OPEN" ? "#10b981" : "#6b7280",
                      }}
                    >
                      {job.status}
                    </span>
                  </div>
                </div>
                <div style={styles.applicantCount}>
                  <span style={styles.countNumber}>{job.applications?.length || 0}</span>
                  <span style={styles.countLabel}>Applicants</span>
                </div>
              </div>

              {/* Applications List */}
              {!job.applications || job.applications.length === 0 ? (
                <div style={styles.noApplications}>
                  <p>No applications received yet for this position</p>
                </div>
              ) : (
                <div style={styles.applicationsGrid}>
                  {job.applications.map((app) => {
                    const appId = getApplicantId(app);
                    const appName = getApplicantName(app);
                    const appEmail = getApplicantEmail(app);
                    const appPhone = getApplicantPhone(app);
                    const appStatus = getStatus(app);
                    const appliedDate = getAppliedDate(app);

                    return (
                      <div key={appId} style={styles.applicationCard}>
                        <div style={styles.applicantInfo}>
                          <div style={styles.applicantAvatar}>
                            {appName?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div style={styles.applicantDetails}>
                            <h4 style={styles.applicantName}>
                              {appName || "Name not available"}
                            </h4>
                            <p style={styles.applicantEmail}>
                              {appEmail || "Email not available"}
                            </p>
                            {appPhone && (
                              <p style={styles.applicantPhone}>📞 {appPhone}</p>
                            )}
                            {appliedDate ? (
                              <p style={styles.appliedDate}>
                                Applied: {new Date(appliedDate).toLocaleDateString()}
                              </p>
                            ) : (
                              <p style={styles.appliedDate}>Applied: Date not available</p>
                            )}
                          </div>
                        </div>

                        <div style={styles.cardActions}>
                          <div style={styles.statusSection}>
                            <label style={styles.statusLabel}>Status:</label>
                            <select
                              style={{
                                ...styles.statusSelect,
                                color: getStatusColor(appStatus),
                              }}
                              value={appStatus}
                              onChange={(e) =>
                                updateApplicationStatus(appId, e.target.value)
                              }
                            >
                              <option value="APPLIED">APPLIED</option>
                              <option value="SHORTLISTED">SHORTLISTED</option>
                              <option value="REJECTED">REJECTED</option>
                              <option value="HIRED">HIRED</option>
                            </select>
                          </div>
                          <button
                            style={styles.viewBtn}
                            onClick={() => viewApplicant(app)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= APPLICANT DETAILS MODAL ================= */}
      {showApplicantModal && selectedApplicant && (
        <div style={styles.overlay} onClick={() => setShowApplicantModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Applicant Details</h3>
              <button
                style={styles.closeBtn}
                onClick={() => setShowApplicantModal(false)}
              >
                ×
              </button>
            </div>

            <div style={styles.modalContent}>
              {/* Applicant Avatar */}
              <div style={styles.modalAvatar}>
                {getApplicantName(selectedApplicant)?.charAt(0).toUpperCase() || "?"}
              </div>

              {/* Personal Information */}
              <div style={styles.detailsGrid}>
                {getApplicantName(selectedApplicant) && (
                  <div style={styles.detailItem}>
                    <label style={styles.detailLabel}>Full Name</label>
                    <p style={styles.detailValue}>{getApplicantName(selectedApplicant)}</p>
                  </div>
                )}

                {getApplicantEmail(selectedApplicant) && (
                  <div style={styles.detailItem}>
                    <label style={styles.detailLabel}>Email</label>
                    <p style={styles.detailValue}>{getApplicantEmail(selectedApplicant)}</p>
                  </div>
                )}

                {getApplicantPhone(selectedApplicant) && (
                  <div style={styles.detailItem}>
                    <label style={styles.detailLabel}>Phone</label>
                    <p style={styles.detailValue}>{getApplicantPhone(selectedApplicant)}</p>
                  </div>
                )}

                {getAppliedDate(selectedApplicant) && (
                  <div style={styles.detailItem}>
                    <label style={styles.detailLabel}>Applied Date</label>
                    <p style={styles.detailValue}>
                      {new Date(getAppliedDate(selectedApplicant)).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}

                <div style={styles.detailItem}>
                  <label style={styles.detailLabel}>Application Status</label>
                  <span
                    style={{
                      ...styles.statusBadgeModal,
                      background: getStatusBackground(getStatus(selectedApplicant)),
                    }}
                  >
                    {getStatus(selectedApplicant)}
                  </span>
                </div>

                {getCandidateId(selectedApplicant) && (
                  <div style={styles.detailItem}>
                    <label style={styles.detailLabel}>Candidate ID</label>
                    <p style={styles.detailValue}>{getCandidateId(selectedApplicant)}</p>
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              {getCoverLetter(selectedApplicant) && (
                <div style={styles.coverLetterSection}>
                  <label style={styles.detailLabel}>Cover Letter</label>
                  <p style={styles.coverLetterText}>{getCoverLetter(selectedApplicant)}</p>
                </div>
              )}

              {/* Actions */}
              <div style={styles.modalActions}>
                {getResumeId(selectedApplicant) ? (
                  <button
                    style={styles.resumeBtn}
                    onClick={() => downloadResume(getResumeId(selectedApplicant))}
                  >
                    📄 View Resume
                  </button>
                ) : (
                  <div style={styles.noResume}>
                    <p>⚠️ Resume not available</p>
                  </div>
                )}

                <div style={styles.statusUpdateSection}>
                  <label style={styles.detailLabel}>Update Status:</label>
                  <select
                    style={styles.statusSelectModal}
                    value={getStatus(selectedApplicant)}
                    onChange={(e) =>
                      updateApplicationStatus(
                        getApplicantId(selectedApplicant),
                        e.target.value
                      )
                    }
                  >
                    <option value="APPLIED">APPLIED</option>
                    <option value="SHORTLISTED">SHORTLISTED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="HIRED">HIRED</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </RecruiterLayout>
  );
}


/* ================= HELPER FUNCTIONS ================= */
function getStatusColor(status) {
  switch (status) {
    case "APPLIED":
      return "#3b82f6";
    case "SHORTLISTED":
      return "#10b981";
    case "REJECTED":
      return "#ef4444";
    case "HIRED":
      return "#8b5cf6";
    default:
      return "#6b7280";
  }
}

function getStatusBackground(status) {
  switch (status) {
    case "APPLIED":
      return "#3b82f6";
    case "SHORTLISTED":
      return "#10b981";
    case "REJECTED":
      return "#ef4444";
    case "HIRED":
      return "#8b5cf6";
    default:
      return "#6b7280";
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

  /* ===== HEADER ===== */
  header: {
    marginBottom: "2rem",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "0.5rem",
    fontSize: "1rem",
  },

  /* ===== EMPTY STATE ===== */
  emptyState: {
    background: "#fff",
    padding: "4rem 2rem",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },

  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },

  emptyText: {
    color: "#6b7280",
    fontSize: "1rem",
  },

  /* ===== JOBS CONTAINER ===== */
  jobsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },

  jobSection: {
    background: "#fff",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },

  jobHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.5rem",
    paddingBottom: "1.5rem",
    borderBottom: "2px solid #e5e7eb",
  },

  jobTitle: {
    margin: "0 0 0.75rem 0",
    fontSize: "1.5rem",
    color: "#1f2937",
  },

  jobMeta: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    flexWrap: "wrap",
  },

  metaItem: {
    color: "#6b7280",
    fontSize: "0.95rem",
  },

  statusBadge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "1rem",
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
  },

  applicantCount: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
    color: "#fff",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
  },

  countNumber: {
    fontSize: "2rem",
    fontWeight: 700,
  },

  countLabel: {
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  /* ===== NO APPLICATIONS ===== */
  noApplications: {
    padding: "2rem",
    textAlign: "center",
    color: "#6b7280",
    background: "#f9fafb",
    borderRadius: "8px",
  },

  /* ===== APPLICATIONS GRID ===== */
  applicationsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "1.25rem",
  },

  applicationCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "1.25rem",
    background: "#fafbfc",
    transition: "all 0.3s",
    cursor: "pointer",
  },

  applicantInfo: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
  },

  applicantAvatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    fontWeight: 700,
    flexShrink: 0,
  },

  applicantDetails: {
    flex: 1,
  },

  applicantName: {
    margin: "0 0 0.25rem 0",
    fontSize: "1.1rem",
    color: "#1f2937",
  },

  applicantEmail: {
    margin: "0 0 0.25rem 0",
    fontSize: "0.9rem",
    color: "#6b7280",
  },

  applicantPhone: {
    margin: "0 0 0.25rem 0",
    fontSize: "0.85rem",
    color: "#6b7280",
  },

  appliedDate: {
    margin: "0.5rem 0 0 0",
    fontSize: "0.8rem",
    color: "#9ca3af",
  },

  cardActions: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    paddingTop: "1rem",
    borderTop: "1px solid #e5e7eb",
  },

  statusSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },

  statusLabel: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#4b5563",
  },

  statusSelect: {
    flex: 1,
    padding: "0.5rem",
    borderRadius: "6px",
    border: "2px solid #d1d5db",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    background: "#fff",
  },

  viewBtn: {
    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
    color: "#fff",
    border: "none",
    padding: "0.75rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
    transition: "all 0.3s",
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
    maxWidth: "650px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "2px solid #e5e7eb",
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
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  modalAvatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.5rem",
    fontWeight: 700,
    margin: "0 auto",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
  },

  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  detailLabel: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  detailValue: {
    margin: 0,
    fontSize: "1rem",
    color: "#1f2937",
    fontWeight: 500,
  },

  statusBadgeModal: {
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    color: "#fff",
    fontSize: "0.85rem",
    fontWeight: 600,
    textTransform: "uppercase",
    width: "fit-content",
  },

  coverLetterSection: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },

  coverLetterText: {
    margin: 0,
    padding: "1rem",
    background: "#f9fafb",
    borderRadius: "8px",
    fontSize: "0.95rem",
    color: "#4b5563",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
  },

  modalActions: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    paddingTop: "1rem",
    borderTop: "2px solid #e5e7eb",
  },

  resumeBtn: {
    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
    color: "#fff",
    border: "none",
    padding: "1rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "1rem",
    transition: "all 0.3s",
  },

  noResume: {
    padding: "1rem",
    background: "#fef3c7",
    borderRadius: "8px",
    textAlign: "center",
    color: "#92400e",
  },

  statusUpdateSection: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  statusSelectModal: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "2px solid #d1d5db",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    background: "#fff",
  },
};
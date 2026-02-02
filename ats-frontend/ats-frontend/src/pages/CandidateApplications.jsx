import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import CandidateLayout from "../components/CandidateLayout";

export default function CandidateApplications() {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Apply modal state
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobToApply, setJobToApply] = useState(null);

  /* ================= HANDLE NAVIGATION FROM JOBS PAGE ================= */
  useEffect(() => {
    if (location.state?.applyToJob) {
      setJobToApply(location.state.applyToJob);
      setShowApplyModal(true);
      // Clear the state so refresh doesn't re-open the modal
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  /* ================= FETCH DATA ON MOUNT ================= */
  useEffect(() => {
    fetchProfileAndApplications();
  }, []);

  const fetchProfileAndApplications = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch profile
      const profileRes = await api.get("/candidate/profile");
      setProfile(profileRes.data);
      setEditName(profileRes.data.name);

      // Fetch all applications
      const appsRes = await api.get("/candidate/applications");
      setApplications(appsRes.data);

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
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  /* ================= HANDLE FILE SELECTION ================= */
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      setSelectedFile(null);
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  /* ================= SUBMIT APPLICATION ================= */
  const submitApplication = async () => {
    try {
      setApplying(true);
      setError("");

      if (!selectedFile) {
        setError("Please select a resume file");
        setApplying(false);
        return;
      }

      // Create FormData for multipart request
      const formData = new FormData();
      formData.append("jobId", jobToApply.jobsId);
      formData.append("file", selectedFile);

      const res = await api.post("/candidate/applications", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(`Successfully applied to ${jobToApply.title}!`);
      setShowApplyModal(false);
      setSelectedFile(null);
      setJobToApply(null);

      // Refresh applications list
      await fetchProfileAndApplications();

      setTimeout(() => setSuccess(""), 5000);
      setApplying(false);
    } catch (err) {
      setApplying(false);

      if (err.response?.status === 404) {
        setError("Job not found");
      } else if (err.response?.status === 403) {
        setError(
          err.response.data?.message || "You cannot apply to this job"
        );
      } else if (err.response?.status === 409) {
        setError("You have already applied to this job");
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || "Invalid file or request");
      } else {
        setError(err.response?.data?.message || "Failed to submit application");
      }
    }
  };

  /* ================= CLOSE MODAL ================= */
  const closeApplyModal = () => {
    setShowApplyModal(false);
    setSelectedFile(null);
    setJobToApply(null);
    setError("");
  };

  /* ================= LOADING STATE ================= */
  if (loading && !profile) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner}></div>
        <p>Loading your applications...</p>
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

      {/* ================= HEADER ================= */}
      <div style={styles.header}>
        <div>
          <h1>My Applications</h1>
          <p style={styles.subtitle}>Track your job applications</p>
        </div>
        <div style={styles.statsInfo}>
          <span style={styles.statsText}>
            {applications.length}{" "}
            {applications.length === 1 ? "Application" : "Applications"}
          </span>
        </div>
      </div>

      {/* ================= APPLICATIONS LIST ================= */}
      {applications.length === 0 ? (
        <div style={styles.card}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📋</div>
            <p style={styles.emptyTitle}>No Applications Yet</p>
            <p style={styles.emptyDescription}>
              You haven't applied to any jobs yet. Browse available jobs and
              apply!
            </p>
            <button
              style={styles.browseBtn}
              onClick={() => navigate("/candidate/jobs")}
            >
              Browse Jobs
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.applicationsGrid}>
          {applications.map((app) => (
            <div key={app.applicationId} style={styles.applicationCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.jobTitle}>{app.jobTitle}</h3>
                  <div style={styles.jobMeta}>
                    <span style={styles.metaItem}>
                      <span style={styles.icon}>📍</span>
                      {app.jobLocation}
                    </span>
                    <span style={styles.metaItem}>
                      <span style={styles.icon}>👤</span>
                      {app.recruiterName}
                    </span>
                  </div>
                </div>
                <span style={getStatusBadgeStyle(app.status)}>
                  {app.status}
                </span>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.infoRow}>
                  <label style={styles.label}>Applied On</label>
                  <p style={styles.value}>
                    {new Date(app.appliedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div style={styles.infoRow}>
                  <label style={styles.label}>Resume</label>
                  <p style={styles.value}>
                    {app.resumeUploaded ? (
                      <span style={styles.resumeBadge}>✓ Uploaded</span>
                    ) : (
                      <span style={styles.resumeBadgeWarning}>
                        ⚠ Not uploaded
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= APPLY MODAL ================= */}
      {showApplyModal && jobToApply && (
        <div style={styles.overlay} onClick={closeApplyModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0 }}>Apply for Job</h2>
              <button style={styles.closeBtn} onClick={closeApplyModal}>
                ×
              </button>
            </div>

            <div style={styles.modalContent}>
              {/* Job Info */}
              <div style={styles.modalSection}>
                <h3 style={styles.sectionTitle}>Job Details</h3>
                <div style={styles.jobInfoBox}>
                  <div style={styles.jobInfoRow}>
                    <span style={styles.jobInfoLabel}>Position:</span>
                    <span style={styles.jobInfoValue}>{jobToApply.title}</span>
                  </div>
                  <div style={styles.jobInfoRow}>
                    <span style={styles.jobInfoLabel}>Location:</span>
                    <span style={styles.jobInfoValue}>
                      {jobToApply.location}
                    </span>
                  </div>
                  <div style={styles.jobInfoRow}>
                    <span style={styles.jobInfoLabel}>Recruiter:</span>
                    <span style={styles.jobInfoValue}>
                      {jobToApply.recruiterName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Candidate Info */}
              <div style={styles.modalSection}>
                <h3 style={styles.sectionTitle}>Your Information</h3>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Full Name</label>
                  <input
                    type="text"
                    value={profile?.name || ""}
                    disabled
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Email</label>
                  <input
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Resume Upload */}
              <div style={styles.modalSection}>
                <h3 style={styles.sectionTitle}>Upload Resume</h3>
                <div style={styles.fileUploadArea}>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    style={styles.fileInput}
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" style={styles.fileLabel}>
                    {selectedFile ? (
                      <div style={styles.fileSelected}>
                        <span style={styles.fileIcon}>📄</span>
                        <span style={styles.fileName}>{selectedFile.name}</span>
                        <span style={styles.fileSize}>
                          ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    ) : (
                      <div style={styles.filePrompt}>
                        <span style={styles.uploadIcon}>📁</span>
                        <span style={styles.uploadText}>
                          Click to select PDF resume
                        </span>
                        <span style={styles.uploadHint}>
                          Maximum file size: 5MB
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div style={styles.modalActions}>
                <button
                  style={styles.secondaryBtn}
                  onClick={closeApplyModal}
                  disabled={applying}
                >
                  Cancel
                </button>
                <button
                  style={{
                    ...styles.submitBtn,
                    ...(applying ? styles.submitBtnDisabled : {}),
                  }}
                  onClick={submitApplication}
                  disabled={applying || !selectedFile}
                >
                  {applying ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CandidateLayout>
  );
}

/* ================= HELPER FUNCTIONS ================= */
function getStatusBadgeStyle(status) {
  const baseStyle = {
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontSize: "12px",
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
    color: "#1e40af",
    fontSize: "14px",
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

  /* ===== APPLICATIONS GRID ===== */
  applicationsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: "1.5rem",
  },

  applicationCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "1rem",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #e5e7eb",
  },

  jobTitle: {
    margin: "0 0 0.5rem 0",
    fontSize: "18px",
    fontWeight: 700,
    color: "#1f2937",
  },

  jobMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },

  metaItem: {
    fontSize: "13px",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },

  icon: {
    fontSize: "12px",
  },

  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  value: {
    margin: 0,
    fontSize: "14px",
    color: "#1f2937",
    fontWeight: 500,
  },

  resumeBadge: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "0.25rem 0.75rem",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
  },

  resumeBadgeWarning: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "0.25rem 0.75rem",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
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
    padding: "1rem",
  },

  modal: {
    background: "#fff",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "600px",
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
  },

  modalContent: {
    padding: "1.5rem",
  },

  modalSection: {
    marginBottom: "1.5rem",
  },

  sectionTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: "1rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  jobInfoBox: {
    background: "#f9fafb",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },

  jobInfoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 0",
    borderBottom: "1px solid #e5e7eb",
  },

  jobInfoLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#6b7280",
  },

  jobInfoValue: {
    fontSize: "13px",
    color: "#1f2937",
    fontWeight: 500,
  },

  formGroup: {
    marginBottom: "1rem",
  },

  formLabel: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "0.5rem",
  },

  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    background: "#f9fafb",
    color: "#6b7280",
  },

  fileUploadArea: {
    position: "relative",
  },

  fileInput: {
    display: "none",
  },

  fileLabel: {
    display: "block",
    padding: "2rem",
    border: "2px dashed #d1d5db",
    borderRadius: "8px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s",
    background: "#f9fafb",
  },

  filePrompt: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
  },

  uploadIcon: {
    fontSize: "48px",
  },

  uploadText: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
  },

  uploadHint: {
    fontSize: "12px",
    color: "#9ca3af",
  },

  fileSelected: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    flexWrap: "wrap",
  },

  fileIcon: {
    fontSize: "32px",
  },

  fileName: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1f2937",
  },

  fileSize: {
    fontSize: "12px",
    color: "#6b7280",
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
    fontSize: "14px",
  },

  submitBtn: {
    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.3s",
  },

  submitBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};
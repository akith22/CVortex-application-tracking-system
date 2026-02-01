import { useState, useEffect } from "react";
import CandidateLayout from "../components/CandidateLayout";

export default function CandidateResume() {
  const [profile, setProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch profile data here
  }, []);

  const updateName = async () => {
    // Update profile logic
  };

  const handleResumeUpload = async () => {
    if (!resume) return alert("Please select a resume");

    setLoading(true);
    // Upload resume logic here
    setLoading(false);
  };

  return (
    <CandidateLayout
      profile={profile}
      showProfile={showProfile}
      setShowProfile={setShowProfile}
      editName={editName}
      setEditName={setEditName}
      updateName={updateName}
    >
      <div style={styles.header}>
        <h1>Upload Resume</h1>
        <p style={styles.subtitle}>Add your resume to apply for jobs</p>
      </div>

      <div style={styles.card}>
        <div style={styles.uploadArea}>
          <div style={styles.uploadIcon}>📄</div>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
            style={styles.fileInput}
          />
          <p style={styles.uploadText}>
            {resume ? resume.name : "Select a PDF, DOC, or DOCX file"}
          </p>
          <button
            style={styles.uploadBtn}
            onClick={handleResumeUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Resume"}
          </button>
        </div>
      </div>
    </CandidateLayout>
  );
}

const styles = {
  header: { marginBottom: "2rem" },
  subtitle: { color: "#6b7280" },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  uploadArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 2rem",
    gap: "1rem",
    border: "2px dashed #d1d5db",
    borderRadius: "8px",
    textAlign: "center",
  },
  uploadIcon: {
    fontSize: "48px",
  },
  fileInput: {
    display: "none",
  },
  uploadText: {
    color: "#6b7280",
    margin: "0.5rem 0",
  },
  uploadBtn: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    marginTop: "1rem",
  },
};
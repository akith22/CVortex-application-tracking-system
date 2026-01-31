import { useEffect, useState } from "react";
import api from "../api/axios";
import RecruiterLayout from "../components/RecruiterLayout";

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);

  const [showProfile, setShowProfile] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  const [editName, setEditName] = useState("");
  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    type: "",
    description: "",
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    api.get("/recruiter/profile")
      .then((res) => {
        setProfile(res.data);
        setEditName(res.data.name);
      })
      .catch(() => {
        console.error("Failed to load profile");
      });

    api.get("/recruiter/jobs")
      .then((res) => setJobs(res.data))
      .catch(() => {
        console.error("Failed to load jobs");
      });
  }, []);

  /* ================= ACTIONS ================= */
  const updateName = async () => {
    await api.put("/recruiter/profile", { name: editName });
    setProfile({ ...profile, name: editName });
    setShowProfile(false);
  };

  const postJob = async () => {
    await api.post("/recruiter/jobs", newJob);
    setShowPostModal(false);
    setNewJob({ title: "", location: "", type: "", description: "" });

    const res = await api.get("/recruiter/jobs");
    setJobs(res.data);
  };

  /* ✅ CRITICAL FIX */
  if (!profile) {
    return (
      <div style={{ padding: "2rem", fontFamily: "Inter, sans-serif" }}>
        Loading recruiter dashboard...
      </div>
    );
  }

  return (
    <RecruiterLayout
      profile={profile}
      showProfile={showProfile}
      setShowProfile={setShowProfile}
      editName={editName}
      setEditName={setEditName}
      updateName={updateName}
    >
      {/* ================= TOP BAR ================= */}
      <div style={styles.topBar}>
        <div>
          <h1>Welcome back, {profile.name}</h1>
          <p style={styles.subText}>Recruiter Dashboard</p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            style={styles.primaryBtn}
            onClick={() => setShowPostModal(true)}
          >
            + Post a Vacancy
          </button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <section style={styles.stats}>
        <div style={styles.statCard}>
          <h3>{jobs.length}</h3>
          <p>Total Job Vacancies</p>
        </div>
      </section>

      {/* Profile modal is now handled in RecruiterLayout */}

      {/* ================= POST JOB MODAL ================= */}
      {showPostModal && (
        <Modal title="Post a Vacancy">
          <input
            style={styles.input}
            placeholder="Job Title"
            onChange={(e) =>
              setNewJob({ ...newJob, title: e.target.value })
            }
          />
          <input
            style={styles.input}
            placeholder="Location"
            onChange={(e) =>
              setNewJob({ ...newJob, location: e.target.value })
            }
          />
          <input
            style={styles.input}
            placeholder="Job Type"
            onChange={(e) =>
              setNewJob({ ...newJob, type: e.target.value })
            }
          />
          <textarea
            style={styles.textarea}
            placeholder="Description"
            onChange={(e) =>
              setNewJob({ ...newJob, description: e.target.value })
            }
          />

          <div style={styles.modalActions}>
            <button
              style={styles.secondaryBtn}
              onClick={() => setShowPostModal(false)}
            >
              Cancel
            </button>
            <button style={styles.primaryBtn} onClick={postJob}>
              Post
            </button>
          </div>
        </Modal>
      )}
    </RecruiterLayout>
  );
}

/* ================= MODAL ================= */
function Modal({ title, children }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  subText: { color: "#6b7280" },
  stats: { display: "flex", gap: "1rem" },
  statCard: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "0.75rem",
    width: 240,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
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
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "0.75rem",
    width: 420,
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "0.4rem",
    border: "1px solid #d1d5db",
  },
  textarea: {
    minHeight: 80,
    padding: "0.5rem",
    borderRadius: "0.4rem",
    border: "1px solid #d1d5db",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.85rem",
    marginTop: "1rem",
  },
};

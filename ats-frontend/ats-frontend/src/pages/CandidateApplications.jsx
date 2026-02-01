import { useState, useEffect } from "react";
import CandidateLayout from "../components/CandidateLayout";

export default function CandidateApplications() {
  const [profile, setProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    // Fetch profile data here
  }, []);

  const updateName = async () => {
    // Update profile logic
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
        <h1>My Applications</h1>
        <p style={styles.subtitle}>Track your job applications</p>
      </div>

      <div style={styles.card}>
        <p style={styles.placeholder}>You haven't applied to any jobs yet</p>
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
  placeholder: {
    color: "#9ca3af",
    textAlign: "center",
    padding: "2rem",
  },
};
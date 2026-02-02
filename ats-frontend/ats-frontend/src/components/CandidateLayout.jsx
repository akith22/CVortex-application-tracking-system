import { Link, useNavigate } from "react-router-dom";

export default function CandidateLayout({
  children,
  profile,
  showProfile,
  setShowProfile,
  editName,
  setEditName,
  updateName,
}) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          <h2 style={styles.logo}>CVortex</h2>

          <nav style={styles.nav}>
            <Link to="/candidate/dashboard" style={styles.link}>
              <button style={styles.navBtn}>Dashboard</button>
            </Link>

            <Link to="/candidate/jobs" style={styles.link}>
              <button style={styles.navBtn}>Browse Jobs</button>
            </Link>

            <Link to="/candidate/applications" style={styles.link}>
              <button style={styles.navBtn}>Applications</button>
            </Link>
          </nav>
        </div>

        <div style={styles.sidebarBottom}>
          <button
            style={styles.profileBtn}
            onClick={() => setShowProfile?.(true)}
          >
            {profile?.name}
          </button>
          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main style={styles.main}>{children}</main>

      {/* ================= PROFILE MODAL ================= */}
      {showProfile && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>My Profile</h3>

            <label>Name</label>
            <input
              style={styles.input}
              value={editName}
              onChange={(e) => setEditName?.(e.target.value)}
            />

            <label>Email</label>
            <input style={styles.input} value={profile?.email} disabled />

            <div style={styles.modalActions}>
              <button
                style={styles.secondaryBtn}
                onClick={() => setShowProfile?.(false)}
              >
                Cancel
              </button>
              <button style={styles.primaryBtn} onClick={updateName}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* styles with glassmorphism effect */
const styles = {
  page: { display: "flex", minHeight: "100vh", background: "#f4f6fb" },
  sidebar: {
    width: 260,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    padding: "2rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  },
  logo: {
    fontSize: "1.7rem",
    marginBottom: "1.5rem",
    fontWeight: 700,
    letterSpacing: "0.5px",
  },
  nav: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  navBtn: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    textAlign: "left",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    fontWeight: 500,
    fontSize: "14px",
  },
  link: { textDecoration: "none" },
  sidebarBottom: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  profileBtn: {
    background: "rgba(255, 255, 255, 0.15)",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: 600,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    fontSize: "14px",
  },
  logoutBtn: {
    background: "rgba(220, 38, 38, 0.9)",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: 600,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    fontSize: "14px",
  },
  main: { flex: 1, padding: "2.5rem" },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "0.75rem",
    width: 420,
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    fontFamily: "inherit",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    marginTop: "1rem",
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.3s ease",
  },
  secondaryBtn: {
    background: "#e5e7eb",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.3s ease",
  },
};
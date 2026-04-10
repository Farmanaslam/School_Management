import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { adminInfo, doLogout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const handleLogout = () => {
    doLogout();
    nav("/login");
  };

  const isActive = (path) => loc.pathname === path;

  return (
    <nav style={styles.bar}>
      <div style={styles.brand}>SchoolDesk</div>
      {adminInfo && (
        <div style={styles.links}>
          <Link to="/dashboard" style={{ ...styles.link, ...(isActive("/dashboard") ? styles.active : {}) }}>
            Dashboard
          </Link>
          <Link to="/students" style={{ ...styles.link, ...(isActive("/students") ? styles.active : {}) }}>
            Students
          </Link>
          <Link to="/tasks" style={{ ...styles.link, ...(isActive("/tasks") ? styles.active : {}) }}>
            Tasks
          </Link>
          <span style={styles.user}>Hi, {adminInfo.username}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  bar: {
    background: "#1e293b",
    color: "#f1f5f9",
    padding: "0 24px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  brand: { fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.5px" },
  links: { display: "flex", alignItems: "center", gap: "8px" },
  link: {
    color: "#94a3b8",
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "0.9rem",
    transition: "background 0.15s",
  },
  active: { background: "#334155", color: "#f1f5f9" },
  user: { color: "#64748b", fontSize: "0.85rem", marginLeft: "8px" },
  logoutBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    marginLeft: "8px",
  },
};

export default Navbar;

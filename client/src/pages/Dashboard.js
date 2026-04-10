import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStudents, fetchTasks } from "../api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { adminInfo } = useAuth();
  const [stuCount, setStuCount] = useState(0);
  const [taskStats, setTaskStats] = useState({ total: 0, done: 0, pending: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);

  useEffect(() => {
    fetchStudents()
      .then((r) => {
        setStuCount(r.data.length);
        setRecentStudents(r.data.slice(0, 4));
      })
      .catch(() => {});

    fetchTasks()
      .then((r) => {
        const all = r.data;
        const done = all.filter((t) => t.isDone).length;
        setTaskStats({ total: all.length, done, pending: all.length - done });
        setRecentTasks(all.slice(0, 5));
      })
      .catch(() => {});
  }, []);

  const statCards = [
    {
      label: "Total Students",
      val: stuCount,
      color: "#2563eb",
      bg: "#dbeafe",
      icon: "👨‍🎓",
      path: "/students",
    },
    {
      label: "Total Tasks",
      val: taskStats.total,
      color: "#7c3aed",
      bg: "#ede9fe",
      icon: "📋",
      path: "/tasks",
    },
    {
      label: "Completed",
      val: taskStats.done,
      color: "#16a34a",
      bg: "#dcfce7",
      icon: "✅",
      path: "/tasks",
    },
    {
      label: "Pending",
      val: taskStats.pending,
      color: "#d97706",
      bg: "#fef9c3",
      icon: "⏳",
      path: "/tasks",
    },
  ];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.heading}>Welcome back, {adminInfo?.username}</h1>
          <p style={s.sub}>Here's what's happening in your school today.</p>
        </div>
        <div style={s.headerActions}>
          <Link to="/students" style={s.actionBtn}>
            + Add Student
          </Link>
          <Link to="/tasks" style={{ ...s.actionBtn, background: "#7c3aed" }}>
            + Assign Task
          </Link>
        </div>
      </div>

      {/* stat cards */}
      <div style={s.grid}>
        {statCards.map((c) => (
          <Link to={c.path} key={c.label} style={{ textDecoration: "none" }}>
            <div style={s.card}>
              <div style={{ ...s.iconBox, background: c.bg }}>
                <span style={s.icon}>{c.icon}</span>
              </div>
              <div style={s.cardRight}>
                <div style={{ ...s.num, color: c.color }}>{c.val}</div>
                <div style={s.cardLabel}>{c.label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={s.twoCol}>
        {/* students */}
        <div style={s.panel}>
          <div style={s.panelHead}>
            <span style={s.panelTitle}>Recent Students</span>
            <Link to="/students" style={s.viewAll}>
              View all →
            </Link>
          </div>
          {recentStudents.length === 0 ? (
            <p style={s.empty}>No students yet.</p>
          ) : (
            recentStudents.map((stu) => (
              <div key={stu._id} style={s.listRow}>
                <div style={s.avatar}>
                  {stu.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={s.rowName}>{stu.fullName}</div>
                  <div style={s.rowSub}>
                    {stu.classSection} · Roll {stu.rollNo}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* tasks */}
        <div style={s.panel}>
          <div style={s.panelHead}>
            <span style={s.panelTitle}>Recent Tasks</span>
            <Link to="/tasks" style={s.viewAll}>
              View all 
            </Link>
          </div>
          {recentTasks.length === 0 ? (
            <p style={s.empty}>No tasks assigned yet.</p>
          ) : (
            recentTasks.map((t) => (
              <div key={t._id} style={s.listRow}>
                <span style={s.taskDot(t.isDone)} />
                <div>
                  <div
                    style={{
                      ...s.rowName,
                      textDecoration: t.isDone ? "line-through" : "none",
                      color: t.isDone ? "#94a3b8" : "#1e293b",
                    }}
                  >
                    {t.title}
                  </div>
                  <div style={s.rowSub}>
                    {t.subject} · {t.assignedTo?.fullName}
                  </div>
                </div>
                <span
                  style={{
                    ...s.badge,
                    background: t.isDone ? "#dcfce7" : "#fef9c3",
                    color: t.isDone ? "#166534" : "#854d0e",
                    marginLeft: "auto",
                  }}
                >
                  {t.isDone ? "Done" : "Pending"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { padding: "28px 24px", maxWidth: "1000px", margin: "0 auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  },
  heading: { fontSize: "1.5rem", color: "#1e293b", margin: "0 0 4px", fontWeight: 700 },
  sub: { color: "#64748b", margin: 0, fontSize: "0.875rem" },
  headerActions: { display: "flex", gap: "10px" },
  actionBtn: {
    background: "#2563eb",
    color: "#fff",
    padding: "9px 18px",
    borderRadius: "7px",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: 600,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px",
    marginBottom: "24px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    cursor: "pointer",
  },
  iconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  icon: { fontSize: "1.5rem" },
  cardRight: {},
  num: { fontSize: "2rem", fontWeight: 700, lineHeight: 1 },
  cardLabel: { color: "#64748b", fontSize: "0.8rem", marginTop: "4px" },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  panel: {
    background: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
  },
  panelHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  panelTitle: { fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" },
  viewAll: { color: "#2563eb", textDecoration: "none", fontSize: "0.8rem" },
  empty: { color: "#94a3b8", fontSize: "0.875rem", margin: "16px 0" },
  listRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "9px 0",
    borderBottom: "1px solid #f1f5f9",
  },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#dbeafe",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "0.85rem",
    flexShrink: 0,
  },
  rowName: { fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" },
  rowSub: { fontSize: "0.77rem", color: "#94a3b8", marginTop: "2px" },
  taskDot: (done) => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: done ? "#16a34a" : "#d97706",
    flexShrink: 0,
  }),
  badge: {
    fontSize: "0.72rem",
    padding: "3px 9px",
    borderRadius: "20px",
    fontWeight: 600,
    flexShrink: 0,
  },
};

export default Dashboard;

import React, { useEffect, useState } from "react";
import {
  fetchTasks,
  fetchStudents,
  createTask,
  toggleTask,
  deleteTask,
} from "../api";

const blankTask = {
  title: "",
  description: "",
  subject: "",
  dueDate: "",
  assignedTo: "",
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(blankTask);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState({ text: "", type: "ok" });
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("all");
  const [stuFilter, setStuFilter] = useState("");

  const reloadTasks = () =>
    fetchTasks()
      .then((r) => setTasks(r.data))
      .catch(() => {});

  useEffect(() => {
    reloadTasks();
    fetchStudents()
      .then((r) => setStudents(r.data))
      .catch(() => {});
  }, []);

  const flash = (text, type = "ok") => {
    setNotice({ text, type });
    setTimeout(() => setNotice({ text: "", type: "ok" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await createTask(form);
      flash("Task assigned successfully.");
      setForm(blankTask);
      setShowForm(false);
      reloadTasks();
    } catch (err) {
      flash(err.response?.data?.msg || "Failed to assign task.", "err");
    } finally {
      setBusy(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleTask(id);
      reloadTasks();
    } catch {
      flash("Could not update task status.", "err");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      flash("Task deleted.");
      reloadTasks();
    } catch {
      flash("Delete failed.", "err");
    }
  };

  // apply filters
  let displayed = [...tasks];
  if (filter === "done") displayed = displayed.filter((t) => t.isDone);
  if (filter === "pending") displayed = displayed.filter((t) => !t.isDone);
  if (stuFilter) displayed = displayed.filter((t) => t.assignedTo?._id === stuFilter);

  const doneCount = tasks.filter((t) => t.isDone).length;
  const pendingCount = tasks.length - doneCount;

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <div>
          <h1 style={s.heading}>Tasks & Assignments</h1>
          <p style={s.sub}>
            {tasks.length} total · {doneCount} done · {pendingCount} pending
          </p>
        </div>
        {!showForm && (
          <button style={s.addBtn} onClick={() => setShowForm(true)}>
            + Assign Task
          </button>
        )}
      </div>

      {notice.text && (
        <div style={notice.type === "err" ? s.errBox : s.okBox}>
          {notice.text}
        </div>
      )}

      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formHeading}>Assign New Task</h3>
          <form onSubmit={handleSubmit} style={s.formGrid}>
            <div>
              <label style={s.lbl}>
                Task Title <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                style={s.inp}
                placeholder="e.g. Chapter 5 Exercise"
              />
            </div>
            <div>
              <label style={s.lbl}>
                Subject <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
                style={s.inp}
                placeholder="e.g. Mathematics"
              />
            </div>
            <div>
              <label style={s.lbl}>
                Assign To <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                value={form.assignedTo}
                onChange={(e) =>
                  setForm({ ...form, assignedTo: e.target.value })
                }
                required
                style={s.inp}
              >
                <option value="">-- Select Student --</option>
                {students.map((stu) => (
                  <option key={stu._id} value={stu._id}>
                    {stu.fullName} ({stu.classSection})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={s.lbl}>Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                style={s.inp}
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={s.lbl}>Description (optional)</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                style={{ ...s.inp, resize: "vertical" }}
                placeholder="Any additional instructions..."
              />
            </div>
            <div style={{ gridColumn: "span 2", display: "flex", gap: "10px" }}>
              <button type="submit" disabled={busy} style={s.saveBtn}>
                {busy ? "Saving..." : "Assign Task"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm(blankTask);
                }}
                style={s.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* filter bar */}
      <div style={s.filterBar}>
        <div style={s.filterBtns}>
          {["all", "pending", "done"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...s.filterBtn,
                ...(filter === f ? s.filterActive : {}),
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={stuFilter}
          onChange={(e) => setStuFilter(e.target.value)}
          style={s.stuSelect}
        >
          <option value="">All Students</option>
          {students.map((stu) => (
            <option key={stu._id} value={stu._id}>
              {stu.fullName}
            </option>
          ))}
        </select>
        <span style={s.count}>{displayed.length} task(s)</span>
      </div>

      {displayed.length === 0 ? (
        <div style={s.emptyState}>
          <p style={s.emptyText}>No tasks found for the selected filters.</p>
        </div>
      ) : (
        <div style={s.taskList}>
          {displayed.map((t) => (
            <div
              key={t._id}
              style={{ ...s.taskCard, opacity: t.isDone ? 0.72 : 1 }}
            >
              <div style={s.taskMain}>
                <input
                  type="checkbox"
                  checked={t.isDone}
                  onChange={() => handleToggle(t._id)}
                  style={s.checkbox}
                  title="Mark complete / incomplete"
                />
                <div style={s.taskBody}>
                  <div
                    style={{
                      ...s.taskTitle,
                      textDecoration: t.isDone ? "line-through" : "none",
                      color: t.isDone ? "#94a3b8" : "#1e293b",
                    }}
                  >
                    {t.title}
                  </div>
                  <div style={s.taskMeta}>
                    <span>{t.subject}</span>
                    <span style={s.sep}>·</span>
                    <span>
                       {t.assignedTo?.fullName} ({t.assignedTo?.classSection})
                    </span>
                    {t.dueDate && (
                      <>
                        <span style={s.sep}>·</span>
                        <span>
                          Due:{" "}
                          {new Date(t.dueDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </>
                    )}
                  </div>
                  {t.description && (
                    <p style={s.taskDesc}>{t.description}</p>
                  )}
                </div>
              </div>
              <div style={s.taskActions}>
                <span
                  style={{
                    ...s.badge,
                    background: t.isDone ? "#dcfce7" : "#fef9c3",
                    color: t.isDone ? "#166534" : "#854d0e",
                  }}
                >
                  {t.isDone ? "✓ Done" : "Pending"}
                </span>
                <button
                  onClick={() => handleDelete(t._id)}
                  style={s.delBtn}
                  title="Delete task"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const s = {
  page: { padding: "28px 24px", maxWidth: "960px", margin: "0 auto" },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "18px",
  },
  heading: { fontSize: "1.5rem", color: "#1e293b", margin: "0 0 2px", fontWeight: 700 },
  sub: { color: "#64748b", margin: 0, fontSize: "0.875rem" },
  addBtn: {
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  okBox: {
    background: "#dcfce7",
    color: "#166534",
    padding: "10px 14px",
    borderRadius: "6px",
    marginBottom: "14px",
    fontSize: "0.875rem",
  },
  errBox: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "10px 14px",
    borderRadius: "6px",
    marginBottom: "14px",
    fontSize: "0.875rem",
  },
  formCard: {
    background: "#fff",
    padding: "24px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    marginBottom: "20px",
  },
  formHeading: { margin: "0 0 20px", color: "#1e293b", fontSize: "1rem" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  lbl: {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "5px",
  },
  inp: {
    width: "100%",
    padding: "9px 11px",
    border: "1.5px solid #d1d5db",
    borderRadius: "6px",
    boxSizing: "border-box",
    fontSize: "0.9rem",
    outline: "none",
  },
  saveBtn: {
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    padding: "10px 22px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  cancelBtn: {
    background: "#e2e8f0",
    color: "#475569",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  filterBar: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "14px",
    flexWrap: "wrap",
  },
  filterBtns: { display: "flex", gap: "6px" },
  filterBtn: {
    padding: "6px 16px",
    border: "1.5px solid #d1d5db",
    borderRadius: "20px",
    cursor: "pointer",
    background: "#fff",
    fontSize: "0.82rem",
    fontWeight: 500,
  },
  filterActive: {
    background: "#1e293b",
    color: "#fff",
    border: "1.5px solid #1e293b",
  },
  stuSelect: {
    padding: "6px 10px",
    border: "1.5px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "0.82rem",
    outline: "none",
    background: "#fff",
  },
  count: { marginLeft: "auto", color: "#94a3b8", fontSize: "0.82rem" },
  emptyState: { textAlign: "center", paddingTop: "60px" },
  emptyText: { color: "#94a3b8" },
  taskList: { display: "flex", flexDirection: "column", gap: "10px" },
  taskCard: {
    background: "#fff",
    padding: "16px 20px",
    borderRadius: "9px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  taskMain: { display: "flex", gap: "14px", alignItems: "flex-start", flex: 1 },
  checkbox: { marginTop: "3px", width: "16px", height: "16px", cursor: "pointer", flexShrink: 0 },
  taskBody: { flex: 1 },
  taskTitle: { fontWeight: 600, fontSize: "0.95rem", marginBottom: "4px" },
  taskMeta: {
    fontSize: "0.78rem",
    color: "#64748b",
    display: "flex",
    gap: "4px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  sep: { color: "#cbd5e1" },
  taskDesc: {
    fontSize: "0.8rem",
    color: "#94a3b8",
    margin: "6px 0 0",
    lineHeight: 1.4,
  },
  taskActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },
  badge: {
    fontSize: "0.72rem",
    padding: "4px 10px",
    borderRadius: "20px",
    fontWeight: 700,
  },
  delBtn: {
    background: "#fee2e2",
    border: "none",
    width: "30px",
    height: "30px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default Tasks;

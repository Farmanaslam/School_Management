import React, { useEffect, useState } from "react";
import {
  fetchStudents,
  createStudent,
  editStudent,
  deleteStudent,
} from "../api";

const blankForm = {
  fullName: "",
  rollNo: "",
  classSection: "",
  parentContact: "",
  email: "",
};

const Students = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState({ text: "", type: "ok" });
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");

  const loadStudents = () =>
    fetchStudents()
      .then((r) => setList(r.data))
      .catch(() => {});

  useEffect(() => {
    loadStudents();
  }, []);

  const showNotice = (text, type = "ok") => {
    setNotice({ text, type });
    setTimeout(() => setNotice({ text: "", type: "ok" }), 3000);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (editId) {
        await editStudent(editId, form);
        showNotice("Student details updated successfully.");
      } else {
        await createStudent(form);
        showNotice("New student added successfully.");
      }
      setForm(blankForm);
      setEditId(null);
      setShowForm(false);
      loadStudents();
    } catch (err) {
      showNotice(err.response?.data?.msg || "Operation failed.", "err");
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (stu) => {
    setForm({
      fullName: stu.fullName,
      rollNo: stu.rollNo,
      classSection: stu.classSection,
      parentContact: stu.parentContact || "",
      email: stu.email || "",
    });
    setEditId(stu._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name} from the system?`)) return;
    try {
      await deleteStudent(id);
      showNotice("Student removed.");
      loadStudents();
    } catch {
      showNotice("Could not delete student.", "err");
    }
  };

  const cancelForm = () => {
    setForm(blankForm);
    setEditId(null);
    setShowForm(false);
  };

  const filtered = list.filter(
    (stu) =>
      stu.fullName.toLowerCase().includes(search.toLowerCase()) ||
      stu.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      stu.classSection.toLowerCase().includes(search.toLowerCase())
  );

  const fields = [
    { name: "fullName", label: "Full Name", type: "text", required: true, placeholder: "e.g. Rahul Sharma" },
    { name: "rollNo", label: "Roll Number", type: "text", required: true, placeholder: "e.g. 101" },
    { name: "classSection", label: "Class & Section", type: "text", required: true, placeholder: "e.g. Class 10-A" },
    { name: "parentContact", label: "Parent Contact", type: "text", required: false, placeholder: "Phone number" },
    { name: "email", label: "Email", type: "email", required: false, placeholder: "student@example.com" },
  ];

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <div>
          <h1 style={s.heading}>Students</h1>
          <p style={s.sub}>{list.length} student(s) enrolled</p>
        </div>
        {!showForm && (
          <button style={s.addBtn} onClick={() => setShowForm(true)}>
            + Add Student
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
          <h3 style={s.formHeading}>
            {editId ? "✏️ Edit Student" : "➕ New Student"}
          </h3>
          <form onSubmit={handleSubmit} style={s.formGrid}>
            {fields.map(({ name, label, type, required, placeholder }) => (
              <div key={name}>
                <label style={s.lbl}>
                  {label}
                  {required && <span style={{ color: "#ef4444" }}> *</span>}
                </label>
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  required={required}
                  style={s.inp}
                  placeholder={placeholder}
                />
              </div>
            ))}
            <div style={s.formActions}>
              <button type="submit" disabled={busy} style={s.saveBtn}>
                {busy ? "Saving..." : editId ? "Update Student" : "Add Student"}
              </button>
              <button type="button" onClick={cancelForm} style={s.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={s.searchRow}>
        <input
          style={s.searchInp}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, roll no, or class..."
        />
      </div>

      {filtered.length === 0 ? (
        <div style={s.emptyState}>
          <p style={s.emptyText}>
            {search ? "No students match your search." : "No students added yet."}
          </p>
        </div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr style={s.theadRow}>
                {["#", "Name", "Roll No", "Class", "Contact", "Email", "Actions"].map(
                  (h) => (
                    <th key={h} style={s.th}>
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((stu, i) => (
                <tr
                  key={stu._id}
                  style={{
                    ...s.tr,
                    background: i % 2 === 0 ? "#fff" : "#f8fafc",
                  }}
                >
                  <td style={s.td}>
                    <div style={s.avatar}>
                      {stu.fullName.charAt(0).toUpperCase()}
                    </div>
                  </td>
                  <td style={{ ...s.td, fontWeight: 600 }}>{stu.fullName}</td>
                  <td style={s.td}>{stu.rollNo}</td>
                  <td style={s.td}>{stu.classSection}</td>
                  <td style={s.td}>{stu.parentContact || "—"}</td>
                  <td style={s.td}>{stu.email || "—"}</td>
                  <td style={s.td}>
                    <button
                      onClick={() => startEdit(stu)}
                      style={s.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(stu._id, stu.fullName)}
                      style={s.delBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const s = {
  page: { padding: "28px 24px", maxWidth: "1050px", margin: "0 auto" },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "18px",
  },
  heading: { fontSize: "1.5rem", color: "#1e293b", margin: "0 0 2px", fontWeight: 700 },
  sub: { color: "#64748b", margin: 0, fontSize: "0.875rem" },
  addBtn: {
    background: "#2563eb",
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
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
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
  formActions: {
    gridColumn: "span 2",
    display: "flex",
    gap: "10px",
    paddingTop: "4px",
  },
  saveBtn: {
    background: "#2563eb",
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
  searchRow: { marginBottom: "14px" },
  searchInp: {
    padding: "9px 14px",
    border: "1.5px solid #d1d5db",
    borderRadius: "7px",
    width: "100%",
    maxWidth: "360px",
    fontSize: "0.875rem",
    outline: "none",
    boxSizing: "border-box",
  },
  emptyState: { textAlign: "center", paddingTop: "60px" },
  emptyText: { color: "#94a3b8" },
  tableWrap: {
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  theadRow: { background: "#1e293b" },
  th: {
    color: "#f1f5f9",
    padding: "12px 14px",
    textAlign: "left",
    fontSize: "0.8rem",
    fontWeight: 600,
    letterSpacing: "0.3px",
  },
  tr: {},
  td: {
    padding: "11px 14px",
    fontSize: "0.875rem",
    color: "#374151",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#dbeafe",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "0.85rem",
  },
  editBtn: {
    background: "#dbeafe",
    color: "#1d4ed8",
    border: "none",
    padding: "5px 13px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "6px",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  delBtn: {
    background: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    padding: "5px 13px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
};

export default Students;

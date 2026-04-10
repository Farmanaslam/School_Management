import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", password: "" });
  const [errMsg, setErrMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const { doLogin, doRegister } = useAuth();
  const nav = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setBusy(true);
    try {
      if (mode === "login") await doLogin(form.username, form.password);
      else await doRegister(form.username, form.password);
      nav("/dashboard");
    } catch (err) {
      setErrMsg(err.response?.data?.msg || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setErrMsg("");
    setForm({ username: "", password: "" });
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <h2 style={s.title}>SchoolDesk</h2>
        <p style={s.sub}>
          {mode === "login" ? "Admin Login" : "Create Admin Account"}
        </p>

        {errMsg && <div style={s.err}>{errMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.lbl}>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              style={s.inp}
              placeholder="Enter username"
              autoComplete="username"
              required
            />
          </div>
          <div style={s.field}>
            <label style={s.lbl}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              style={s.inp}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" style={s.btn} disabled={busy}>
            {busy
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        <p style={s.toggle}>
          {mode === "login" ? "No account? " : "Already registered? "}
          <span style={s.link} onClick={switchMode}>
            {mode === "login" ? "Register here" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

const s = {
  wrap: {
    minHeight: "calc(100vh - 56px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f1f5f9",
  },
  card: {
    background: "#fff",
    padding: "40px 36px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.09)",
  },
  logo: { textAlign: "center", fontSize: "2.8rem", marginBottom: "4px" },
  title: {
    margin: "0 0 4px",
    fontSize: "1.5rem",
    color: "#1e293b",
    textAlign: "center",
    fontWeight: 700,
  },
  sub: {
    textAlign: "center",
    color: "#64748b",
    margin: "0 0 24px",
    fontSize: "0.875rem",
  },
  err: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "10px 12px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "0.875rem",
  },
  field: { marginBottom: "16px" },
  lbl: {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "6px",
  },
  inp: {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "0.95rem",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.15s",
  },
  btn: {
    width: "100%",
    padding: "11px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: 600,
    marginTop: "6px",
    opacity: 1,
  },
  toggle: {
    textAlign: "center",
    marginTop: "20px",
    color: "#6b7280",
    fontSize: "0.875rem",
  },
  link: { color: "#2563eb", cursor: "pointer", fontWeight: 600 },
};

export default Login;

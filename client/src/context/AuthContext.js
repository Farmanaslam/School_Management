import React, { createContext, useContext, useState, useEffect } from "react";
import { loginReq, registerReq } from "../api";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("smAdmin");
    if (stored) setAdminInfo(JSON.parse(stored));
    setLoading(false);
  }, []);

  const doLogin = async (username, password) => {
    const { data } = await loginReq({ username, password });
    localStorage.setItem("smToken", data.token);
    localStorage.setItem("smAdmin", JSON.stringify(data.admin));
    setAdminInfo(data.admin);
  };

  const doRegister = async (username, password) => {
    const { data } = await registerReq({ username, password });
    localStorage.setItem("smToken", data.token);
    localStorage.setItem("smAdmin", JSON.stringify(data.admin));
    setAdminInfo(data.admin);
  };

  const doLogout = () => {
    localStorage.removeItem("smToken");
    localStorage.removeItem("smAdmin");
    setAdminInfo(null);
  };

  return (
    <AuthCtx.Provider value={{ adminInfo, doLogin, doRegister, doLogout, loading }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);

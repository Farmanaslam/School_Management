import axios from "axios";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((cfg) => {
  const tok = localStorage.getItem("smToken");
  if (tok) cfg.headers.Authorization = `Bearer ${tok}`;
  return cfg;
});

// student helpers
export const fetchStudents = () => api.get("/students");
export const createStudent = (data) => api.post("/students", data);
export const editStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// task helpers
export const fetchTasks = () => api.get("/tasks");
export const fetchTasksByStudent = (sid) => api.get(`/tasks/student/${sid}`);
export const createTask = (data) => api.post("/tasks", data);
export const toggleTask = (id) => api.patch(`/tasks/${id}/toggle`);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// auth helpers
export const loginReq = (data) => api.post("/auth/login", data);
export const registerReq = (data) => api.post("/auth/register", data);

export default api;

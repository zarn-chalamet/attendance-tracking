import api from "./api";

export const sessionService = {
  getSessions: () => api.get("/sessions"),
  getSessionById: (sessionId) => api.get(`/sessions/${sessionId}`),
  createSession: (data) => api.post("/sessions", data),
  updateSession: (sessionId, data) => api.put(`/sessions/${sessionId}`, data),
  deleteSession: (sessionId) => api.delete(`/sessions/${sessionId}`),
};

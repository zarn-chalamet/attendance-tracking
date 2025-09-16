import api from "./api";

export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (formData) =>
    api.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getCurrentUser: () => api.get("/users/profile"),
  getOffices: () => api.get("/auth/offices"),
};

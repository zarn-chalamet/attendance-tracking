import api from "./api";

export const officeService = {
  getOffices: () => api.get("/offices"),
  getOfficeById: (officeId) => api.get(`/offices/${officeId}`),
  createOffice: (data) => api.post("/offices/create", data),
  updateOffice: (officeId, data) => api.put(`/offices/${officeId}`, data),
  deleteOffice: (officeId) => api.delete(`/offices/${officeId}`),
};

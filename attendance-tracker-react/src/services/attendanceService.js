import api from "./api";

export const attendanceService = {
  clockIn: (data) => api.post("/attendance/clock-in", data),
  clockOut: (data) => api.post("/attendance/clock-out", data),
  verifyLocation: (data) => api.post("/attendance/verify", data),
};

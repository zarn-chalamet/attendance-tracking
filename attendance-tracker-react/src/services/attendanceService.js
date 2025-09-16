import api from "./api";

export const attendanceService = {
  clockIn: (data) =>
    api.post("/attendance/clock-in", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  clockOut: (data) =>
    api.post("/attendance/clock-out", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  verifyLocation: (data) => api.post("/attendance/verify", data),
};

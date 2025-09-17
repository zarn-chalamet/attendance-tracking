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
  getUserReport: (userId) => api.get(`/attendance/users/${userId}/report`),
  getOfficeReport: (officeId) =>
    api.get(`/attendance/offices/${officeId}/report`),
  getOfficesSummaryReport: () => api.get("/attendance/offices/report"),
  getCurrentAttendanceRecord: () => api.get("/attendance/current"),
  getAttendanceRecordBySessionType: (sessionType) =>
    api.get(`/attendance/sessions?sessionType=${sessionType}`),
};

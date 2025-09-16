import React, { useEffect, useState } from "react";
import { attendanceService } from "../../services/attendanceService";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { Clock, MapPin, User } from "lucide-react";
import dayjs from "dayjs";

const HistoryPage = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchAttendance();
  }, [user]);

  const fetchAttendance = async () => {
    try {
      const res = await attendanceService.getUserReport(user.id);
      setAttendance(res.data);
    } catch (err) {
      toast.error("Failed to fetch attendance history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Attendance History</h1>
        <p className="text-gray-500">Your daily attendance records</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : attendance.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No attendance records found</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {attendance.map((record) => (
            <div
              key={record.id}
              className="bg-white shadow rounded-xl p-5 hover:shadow-lg transition flex flex-col justify-between"
            >
              <div className="flex items-center mb-3 space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-800">{record.username}</h3>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-500">Email: {record.email}</p>
                <p className="text-sm text-gray-500">Office: {record.officeName || "N/A"}</p>
                <p className="text-sm text-gray-500">Session: {record.sessionType || "N/A"}</p>
              </div>

              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Clock-in: {record.clockInTime ? dayjs(record.clockInTime).format('HH:mm, MMM D') : "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Clock-out: {record.clockOutTime ? dayjs(record.clockOutTime).format('HH:mm, MMM D') : "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>Location: {record.clockInLat && record.clockInLng ? `${record.clockInLat}, ${record.clockInLng}` : "-"}</span>
                </div>
              </div>

              <div className="mt-auto">
                <span
                  className={`inline-block text-xs px-2 py-1 rounded-full ${
                    record.status === "PRESENT"
                      ? "bg-green-100 text-green-800"
                      : record.status === "ABSENT"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {record.status || "N/A"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;

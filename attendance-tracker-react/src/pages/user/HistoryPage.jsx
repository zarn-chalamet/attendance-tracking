import React, { useEffect, useState } from "react";
import { attendanceService } from "../../services/attendanceService";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { Clock, MapPin, User, Building2 } from "lucide-react";
import dayjs from "dayjs";
import OfficeModal from "../../components/history/OfficeModal";

const HistoryPage = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffice, setSelectedOffice] = useState(null);

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {attendance.map((record) => (
            <div
              key={record.id}
              className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition flex flex-col justify-between"
            >
              <div className="flex items-center mb-3 space-x-3">
                <User className="w-6 h-6 text-gray-400" />
                <h3 className="font-semibold text-gray-800">{record.username}</h3>
              </div>

              <div className="mb-4 space-y-1 text-sm text-gray-500">
                <p>Email: {record.email}</p>
                <p>
                  {record.officeName ? (
                    <button
                      className="text-blue-600 hover:underline flex items-center gap-1"
                      onClick={() =>
                        setSelectedOffice({
                          id: record.officeId,
                          name: record.officeName,
                          latitude: record.officeLatitude,
                          longitude: record.officeLongitude,
                        })
                      }
                    >
                      <Building2 className="w-4 h-4" /> {record.officeName}
                    </button>
                  ) : (
                    "N/A"
                  )}
                </p>
                <p>Session: {record.sessionType || "N/A"}</p>
              </div>

              <div className="flex flex-col gap-2 mb-4 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    Clock-in: {record.clockInTime ? dayjs(record.clockInTime).format("HH:mm, MMM D") : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    Clock-out: {record.clockOutTime ? dayjs(record.clockOutTime).format("HH:mm, MMM D") : "-"}
                  </span>
                </div>
              </div>

              <div className="mt-auto">
                <span
                  className={`inline-block text-xs px-3 py-1 rounded-full ${
                    record.status === "OK" && record.clockOutTime
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {record.status === "OK" && record.clockOutTime ? "PRESENT" : "MISSING"}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}

      {selectedOffice && (
        <OfficeModal office={selectedOffice} onClose={() => setSelectedOffice(null)} />
      )}
    </div>
  );
};

export default HistoryPage;

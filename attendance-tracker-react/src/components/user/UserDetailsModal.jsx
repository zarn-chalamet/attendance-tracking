import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { attendanceService } from "../../services/attendanceService";

const UserDetailsModal = ({ selectedUser, setSelectedUser }) => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  useEffect(() => {
    if (selectedUser) {
      const fetchHistory = async () => {
        try {
          const res = await attendanceService.getUserReport(selectedUser.id);
          setAttendanceHistory(res.data);
        } catch (err) {
          toast.error("Failed to fetch attendance history");
        }
      };
      fetchHistory();
    }
  }, [selectedUser]);

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "-";
    return new Date(dateTime).toLocaleString();
  };

  return (
    <>
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">{selectedUser.username}</h2>
              <button
                className="text-white hover:text-gray-200 text-2xl"
                onClick={() => setSelectedUser(null)}
              >
                ✕
              </button>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <p>
                  <span className="font-semibold text-gray-700">Email:</span>{" "}
                  {selectedUser.email}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Role:</span>{" "}
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {selectedUser.role}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Office:</span>{" "}
                  {selectedUser.office_name || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">
                    Active Sessions:
                  </span>{" "}
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {selectedUser.activeSessions || 0}
                  </span>
                </p>
              </div>
            </div>

            {/* Attendance History */}
            <div className="p-6 overflow-y-auto max-h-[55vh]">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Attendance History
              </h3>
              {attendanceHistory.length === 0 ? (
                <p className="text-gray-500 text-sm">No records found</p>
              ) : (
                <div className="space-y-4">
                  {attendanceHistory.map((record) => (
                    <div
                      key={record.id}
                      className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {record.sessionType}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            record.status === "PRESENT"
                              ? "bg-green-100 text-green-800"
                              : record.status === "LATE"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>Clock-in:</strong>{" "}
                        {formatDateTime(record.clockInTime)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Clock-out:</strong>{" "}
                        {formatDateTime(record.clockOutTime)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDetailsModal;

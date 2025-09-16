import React, { useEffect, useState } from "react";
import { Users, Clock, Building2, Activity } from "lucide-react";
import { attendanceService } from "../../services/attendanceService";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await attendanceService.getOfficesSummaryReport();
      setSummary(res.data);
    } catch (err) {
      toast.error("Failed to fetch office report");
    }
  };

  if (!summary) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading report...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Company-wide attendance overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Employees</p>
            <p className="text-xl font-bold">{summary.totalEmployees}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Present Today</p>
            <p className="text-xl font-bold">{summary.totalPresentToday}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Absent Today</p>
            <p className="text-xl font-bold">{summary.totalAbsentToday}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Offices</p>
            <p className="text-xl font-bold">{summary.totalOffices}</p>
          </div>
        </div>
      </div>

      {/* Attendance Rate */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Overall Attendance Rate</h2>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full"
            style={{
              width: `${
                (summary.totalPresentToday / summary.totalEmployees) * 100
              }%`,
            }}
          ></div>
        </div>
        <p className="text-right text-sm text-gray-600 mt-2">
          {(
            (summary.totalPresentToday / summary.totalEmployees) *
            100
          ).toFixed(1)}
          %
        </p>
      </div>

      {/* Office-wise Breakdown */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Office Attendance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.officeSummaries.map((office) => (
            <div
              key={office.officeId}
              className="p-4 border rounded-lg hover:shadow-md transition"
            >
              <h3 className="font-semibold">{office.officeName}</h3>
              <p className="text-sm text-gray-500 mb-2">
                Employees: {office.totalEmployees}
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium">
                  Present: {office.presentCount}
                </span>
                <span className="text-red-600 font-medium">
                  Absent: {office.absentCount}
                </span>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${office.attendanceRate}%` }}
                ></div>
              </div>
              <p className="text-right text-xs text-gray-500 mt-1">
                {office.attendanceRate.toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

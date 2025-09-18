import React from "react";
import { Bell, Info, AlertTriangle, Shield } from "lucide-react";

const mockAnnouncements = [
  {
    id: 1,
    type: "info",
    title: "Welcome to the Attendance Tracker Project",
    message:
      "This is a mock version of our attendance tracker. You can explore features, test functionalities, and see the UI in action.",
  },
  {
    id: 2,
    type: "warning",
    title: "Important Notice",
    message:
      "Please do NOT use real confidential data. This version is for testing and demonstration purposes only.",
  },
  {
    id: 3,
    type: "info",
    title: "Features Available",
    message:
      "You can check dashboards, office reports, user attendance history, and active sessions to explore the functionalities.",
  },
];

const Announcement = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
      <p className="text-gray-500">
        Here you can see all the important announcements about the project.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className={`p-6 rounded-xl shadow-md border-l-4 transition hover:shadow-lg ${
              announcement.type === "info"
                ? "border-blue-500 bg-blue-50"
                : "border-yellow-500 bg-yellow-50"
            }`}
          >
            <div className="flex items-center mb-2 space-x-2">
              {announcement.type === "info" ? (
                <Info className="text-blue-500 w-5 h-5" />
              ) : (
                <AlertTriangle className="text-yellow-500 w-5 h-5" />
              )}
              <h2 className="text-lg font-semibold text-gray-900">
                {announcement.title}
              </h2>
            </div>
            <p className="text-gray-700">{announcement.message}</p>
          </div>
        ))}

        {/* New Admin Credentials Card */}
        <div className="p-6 rounded-xl shadow-md border-l-4 border-green-500 bg-green-50 hover:shadow-lg transition">
          <div className="flex items-center mb-2 space-x-2">
            <Shield className="text-green-600 w-5 h-5" />
            <h2 className="text-lg font-semibold text-gray-900">
              Test Admin Credentials
            </h2>
          </div>
          <p className="text-gray-700 mb-2">
            Use the following credentials to explore the Admin Dashboard:
          </p>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm space-y-2">
            <p className="text-sm">
              <span className="font-semibold text-gray-800">Email:</span>{" "}
              admin@gmail.com
            </p>
            <p className="text-sm">
              <span className="font-semibold text-gray-800">Password:</span>{" "}
              123456
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-100 rounded-xl shadow-inner flex items-center space-x-4">
        <Bell className="w-6 h-6 text-gray-500" />
        <p className="text-gray-600">
          Remember: This is a <strong>mock version</strong>. Do not enter any
          real sensitive or confidential information.
        </p>
      </div>
    </div>
  );
};

export default Announcement;

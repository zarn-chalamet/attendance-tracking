import React from "react";
import { MapPin } from "lucide-react";

const CurrentSection = ({ currentSection, office, activity, openCameraModal }) => {
  if (!currentSection) {
    return <p className="text-gray-500 mb-6">No active section right now</p>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Today's Section</h1>
      {currentSection ? (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">
              {currentSection.sessionType}
            </h2>
            <span className="text-gray-500">
              {currentSection.startTime} - {currentSection.endTime}
            </span>
          </div>
          {office && (
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin size={16} className="mr-1" />
              <span>{office.name}</span>
            </div>
          )}

          <p className="text-gray-600 mb-4">Active section right now</p>

          <div className="space-y-2 mb-4">
            {activity.filter(
              (a) => a.sessionType === currentSection.sessionType
            ).length > 0 ? (
              activity
                .filter((a) => a.sessionType === currentSection.sessionType)
                .map((act, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 bg-gray-100 rounded-xl"
                  >
                    <span>Clock In: {act.clock_in}</span>
                    <span>Clock Out: {act.clock_out || "-"}</span>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No activity yet</p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => openCameraModal("clockIn")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium"
            >
              Clock In
            </button>
            <button
              onClick={() => openCameraModal("clockOut")}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-medium"
            >
              Clock Out
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mb-6">No active section right now</p>
      )}
    </>
  );
};

export default CurrentSection;
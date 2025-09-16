import React from "react";
import { MapPin, Clock } from "lucide-react";
import dayjs from "dayjs";

const CurrentSection = ({ currentSection, office, currentRecord, openCameraModal }) => {
  const formatTime = (time) => (time ? dayjs(time).format("hh:mm A") : "-");

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Today's Section</h1>

      {currentSection ? (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">{currentSection.sessionType}</h2>
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

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-xl">
              <Clock className="text-green-600 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Clock In</p>
                <p className="font-medium text-gray-800">{formatTime(currentRecord.clockInTime)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-xl">
              <Clock className="text-red-600 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Clock Out</p>
                <p className="font-medium text-gray-800">{formatTime(currentRecord.clockOutTime)}</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => openCameraModal("clockIn")}
              disabled={!!currentRecord.clockInTime}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition
              ${currentRecord.clockInTime 
                ? "bg-green-400 text-white cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              Clock In
            </button>
            <button
              onClick={() => openCameraModal("clockOut")}
              disabled={!!currentRecord.clockOutTime}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition
                ${currentRecord.clockOutTime
                  ? "bg-red-300 text-white cursor-not-allowed" // disabled style
                  : "bg-red-600 hover:bg-red-700 text-white"   // active style
                }`}
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

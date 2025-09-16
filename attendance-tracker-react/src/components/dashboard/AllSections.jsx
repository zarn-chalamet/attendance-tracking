import React from "react";
import { Camera } from "lucide-react";

const AllSections = ({ sections }) => {
  const getSectionStatus = (section) => {
    const [startH, startM, startS] = section.startTime.split(":").map(Number);
    const [endH, endM, endS] = section.endTime.split(":").map(Number);
    const now = new Date();
    const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const startSeconds = startH * 3600 + startM * 60 + startS;
    const endSeconds = endH * 3600 + endM * 60 + endS;

    let status = "upcoming";
    if (endSeconds < startSeconds) {
      if (nowSeconds >= startSeconds || nowSeconds <= endSeconds) status = "active";
      else if (nowSeconds > endSeconds && nowSeconds < startSeconds) status = "finished";
    } else {
      if (nowSeconds >= startSeconds && nowSeconds <= endSeconds) status = "active";
      else if (nowSeconds > endSeconds) status = "finished";
    }

    return status;
  };

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-4">All Sections</h2>
      <div className="space-y-3">
        {sections.map((section) => {
          const status = getSectionStatus(section);
          
          return (
            <div
              key={section.id}
              className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm"
            >
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">{section.sessionType}</h3>
                  <p className="text-gray-500">
                    {section.startTime} - {section.endTime}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status === "active"
                    ? "bg-green-100 text-green-800"
                    : status === "finished"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {status}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AllSections;
import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { attendanceService } from "../services/attendanceService";
import { sessionService } from "../services/sessionService";
import { officeService } from "../services/officeService";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(null);
  const [activity, setActivity] = useState([]);
  const [office, setOffice] = useState(null);
  const {user} = useAuth();

  // Fetch sessions and office location
  useEffect(() => {
    const fetchData = async () => {
      try {

        if(!user) return;

        const res = await sessionService.getSessions();
        console.log(res);
        setSections(res.data);

        // If office location endpoint exists
        const officeRes = await officeService.getOfficeById(user.officeId);
        console.log(officeRes);
        setOffice(officeRes.data)
      } catch (error) {
        toast.error("Failed to fetch sessions or office location");
      }
    };
    fetchData();
  }, [user]);

  // Calculate current section
  useEffect(() => {
    if (sections.length === 0) return;
    const now = new Date();
    const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    const activeSection = sections.find((section) => {
      const [startH, startM, startS] = section.startTime.split(":").map(Number);
      const [endH, endM, endS] = section.endTime.split(":").map(Number);
      const startSeconds = startH * 3600 + startM * 60 + startS;
      const endSeconds = endH * 3600 + endM * 60 + endS;

      if (endSeconds < startSeconds) return nowSeconds >= startSeconds || nowSeconds <= endSeconds;
      return nowSeconds >= startSeconds && nowSeconds <= endSeconds;
    });

    setCurrentSection(activeSection);
  }, [sections]);

  // Verify user's location via backend
  const verifyLocation = async (lat, lng) => {
    try {
      const res = await attendanceService.verifyLocation({ lat, lng });
      return res.data.withinRadius;
    } catch (error) {
      toast.error("Location verification failed");
      return false;
    }
  };

  // Clock in
  const handleClockIn = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const withinRadius = await verifyLocation(position.coords.latitude, position.coords.longitude);
      console.log(withinRadius);
      if (!withinRadius) {
        toast.error("You are not within the office area!");
        return;
      }
      // try {
      //   await attendanceService.clockIn({ sectionId: currentSection.id });
      //   toast.success("Clocked in successfully!");
      //   setActivity((prev) => [
      //     ...prev,
      //     { section_type: currentSection.section_type, clock_in: new Date().toLocaleTimeString(), clock_out: null },
      //   ]);
      // } catch (error) {
      //   toast.error("Clock in failed");
      // }
    });
  };

  // Clock out
  const handleClockOut = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const withinRadius = await verifyLocation(position.coords.latitude, position.coords.longitude);
      if (!withinRadius) {
        toast.error("You are not within the office area!");
        return;
      }
      // try {
      //   await attendanceService.clockOut({ sectionId: currentSection.id });
      //   toast.success("Clocked out successfully!");
      //   setActivity((prev) =>
      //     prev.map((act) =>
      //       act.section_type === currentSection.section_type
      //         ? { ...act, clock_out: new Date().toLocaleTimeString() }
      //         : act
      //     )
      //   );
      // } catch (error) {
      //   toast.error("Clock out failed");
      // }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Today's Section</h1>

      {currentSection ? (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">{currentSection.sessionType}</h2>
            <span className="text-gray-500">
              {currentSection.startTime} - {currentSection.endTime}
            </span>
          </div>
          <span>
              {office.name}
            </span>
          <p className="text-gray-600 mb-4">Active section right now</p>

          <div className="space-y-2 mb-4">
            {activity.filter((a) => a.sessionType === currentSection.sessionType).length > 0 ? (
              activity
                .filter((a) => a.sessionType === currentSection.sessionType)
                .map((act, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-100 rounded-xl">
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
              onClick={handleClockIn}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200"
            >
              Clock In
            </button>
            <button
              onClick={handleClockOut}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200"
            >
              Clock Out
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mb-6">No active section right now</p>
      )}

      <h2 className="text-xl font-bold text-gray-900 mb-4">All Sections</h2>
      <div className="space-y-3">
        {sections.map((section) => {
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

          return (
            <div key={section.id} className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-500" />
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
    </div>
  );
};

export default Dashboard;

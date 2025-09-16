import React, { useState, useEffect, useRef } from "react";
import { MapPin, Camera, CheckCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import { attendanceService } from "../../services/attendanceService";
import { sessionService } from "../../services/sessionService";
import { officeService } from "../../services/officeService";
import { useAuth } from "../../contexts/AuthContext";
import CurrentSection from "../../components/dashboard/CurrentSection";
import AllSections from "../../components/dashboard/AllSections";

/** ---------- Utility: Distance Calculation ---------- **/
const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Dashboard = () => {
  const { user } = useAuth();

  /** ---------- State ---------- **/
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(null);
  // const [activity, setActivity] = useState([]);
  const [currentRecord, setCurrentRecord] = useState([]);
  const [office, setOffice] = useState(null);

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // "clockIn" | "clockOut"
  const [cameraError, setCameraError] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedFile, setCapturedFile] = useState(null);
  const [pendingLocation, setPendingLocation] = useState(null);

  const [loading, setLoading] = useState(false);

  /** ---------- Refs ---------- **/
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  /** ---------- Fetch data ---------- **/
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;

        const res = await sessionService.getSessions();
        setSections(res.data);

        const officeRes = await officeService.getOfficeById(user.officeId);
        setOffice(officeRes.data);
      } catch (error) {
        toast.error("Failed to fetch sessions or office location");
      }
    };

    const getCurrentActiveRecord = async () => {
    try {
      const response = await attendanceService.getCurrentAttendanceRecord();
      console.log(response);
      setCurrentRecord(response.data);
    } catch (error) {
      toast.error("Error fetching current active record");
    }
  }

    fetchData();
    getCurrentActiveRecord();
  }, [user]);

  /** ---------- Cleanup camera ---------- **/
  useEffect(() => {
    return () => stopCamera();
  }, []);

  /** ---------- Current section ---------- **/
  useEffect(() => {
    if (sections.length === 0) return;
    const now = new Date();
    const nowSeconds =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    const activeSection = sections.find((section) => {
      const [startH, startM, startS] = section.startTime.split(":").map(Number);
      const [endH, endM, endS] = section.endTime.split(":").map(Number);
      const startSeconds = startH * 3600 + startM * 60 + startS;
      const endSeconds = endH * 3600 + endM * 60 + endS;

      if (endSeconds < startSeconds)
        return nowSeconds >= startSeconds || nowSeconds <= endSeconds;
      return nowSeconds >= startSeconds && nowSeconds <= endSeconds;
    });

    setCurrentSection(activeSection);
  }, [sections]);

  /** ---------- Camera ---------- **/
  const startCamera = async () => {
    try {
      setCameraError(false);

      if (!navigator.mediaDevices?.getUserMedia) {
        toast.error("Your browser does not support camera access");
        setCameraError(true);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError(true);
      toast.error("Cannot access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  /** ---------- Capture ---------- **/
  const captureFace = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      toast.error("Camera not ready. Please try again.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      setCapturedImage(URL.createObjectURL(blob));
      setCapturedFile(new File([blob], "face.jpg", { type: "image/jpeg" }));
      stopCamera();
      toast.success("Face captured successfully!");
    }, "image/jpeg");
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCapturedFile(null);
    startCamera();
  };

  

  /** ---------- Submit ---------- **/
  const handleSubmitAttendance = async () => {
    if (!capturedFile) {
      toast.error("No face captured");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", capturedFile, "face.jpg");
      formData.append("sessionType", currentSection?.sessionType || "");
      formData.append("lat", pendingLocation.lat);
      formData.append("lng", pendingLocation.lng);
      formData.append("action", pendingAction);

      if (pendingAction === "clockIn") {
        console.log(formData);
        const response = await attendanceService.clockIn(formData);
        console.log(response);
        toast.success("Clocked in successfully!");
        // setActivity((prev) => [
        //   ...prev,
        //   {
        //     sessionType: currentSection.sessionType,
        //     clock_in: new Date().toLocaleTimeString(),
        //     clock_out: null,
        //   },
        // ]);

        // getCurrentActiveRecord();
      } else {
        console.log(formData);
        const response = await attendanceService.clockOut(formData);
        console.log(response);
        toast.success("Clocked out successfully!");

        //set activity
        // setActivity((prev) =>
        //   prev.map((act) =>
        //     act.sessionType === currentSection.sessionType
        //       ? { ...act, clock_out: new Date().toLocaleTimeString() }
        //       : act
        //   )
        // );

        // getCurrentActiveRecord();
      }

      setShowCameraModal(false);
      setCapturedImage(null);
      setCapturedFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Attendance failed");
    } finally {
      setLoading(false);
    }
  };

  /** ---------- Open modal with location check ---------- **/
  const openCameraModal = (action) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setPendingLocation(location);

        if (!office) {
          toast.error("Office location not set");
          return;
        }

        const distance = getDistanceInMeters(
          location.lat,
          location.lng,
          office.lat,
          office.lng
        );

        if (distance > 200) {
          toast.error(`Too far from office! (${Math.round(distance)}m)`);
          return;
        }

        setPendingAction(action);
        setShowCameraModal(true);
        setCapturedImage(null);
        setCapturedFile(null);
        startCamera();
      },
      (err) => {
        console.error("Geolocation error:", err);
        toast.error("Failed to get your location");
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50 rounded-xl">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white font-medium">Submitting...</p>
          </div>
        </div>
      )}
      
      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {pendingAction === "clockIn" ? "Clock In" : "Clock Out"} - Face
                Verification
              </h2>
              <button
                onClick={() => {
                  stopCamera();
                  setShowCameraModal(false);
                }}
              >
                <X size={22} />
              </button>
            </div>

            {!capturedImage ? (
              <div className="space-y-4">
                {cameraError ? (
                  <p className="text-red-500">
                    Camera access failed. Please retry.
                  </p>
                ) : (
                  <div className="relative bg-gray-100 rounded-xl overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-64 object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                )}
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      stopCamera();
                      setShowCameraModal(false);
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={captureFace}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                  >
                    Capture
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="relative mx-auto w-48 h-48 bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={capturedImage}
                    alt="Captured face"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                </div>
                <p className="text-green-600 font-medium">
                  Face captured successfully!
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={retakePhoto}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg"
                  >
                    Retake
                  </button>
                  <button
                    onClick={handleSubmitAttendance}
                    disabled={!capturedFile}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg disabled:bg-gray-300"
                  >
                    Confirm {pendingAction === "clockIn" ? "Clock In" : "Clock Out"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Current Section */}
      <CurrentSection 
        currentSection={currentSection}
        office={office}
        currentRecord={currentRecord}
        openCameraModal={openCameraModal}
      />

      {/* All Sections */}
      <AllSections sections={sections}/>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { sessionService } from "../../services/sessionService";

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [filterType, setFilterType] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null); // null = create

  // Form states
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [sessionType, setSessionType] = useState("");

  // Fetch sessions from API
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await sessionService.getSessions();
      setSessions(res.data);
      setFilteredSessions(res.data);
    } catch (err) {
      toast.error("Failed to fetch sessions");
    }
  };

  // Filter sessions
  useEffect(() => {
    let temp = [...sessions];

    if (filterType) {
      temp = temp.filter((s) => s.sessionType === filterType);
    }

    setFilteredSessions(temp);
  }, [filterType, sessions]);

  // CRUD Handlers
  const openCreateModal = () => {
    setEditingSession(null);
    setStartTime("");
    setEndTime("");
    setSessionType("");
    setShowModal(true);
  };

  const openEditModal = (session) => {
    setEditingSession(session);
    setStartTime(session.startTime);
    setEndTime(session.endTime);
    setSessionType(session.sessionType);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;
    try {
      await sessionService.deleteSession(id);
      setSessions(sessions.filter((s) => s.id !== id));
      toast.success("Session deleted");
    } catch (err) {
      toast.error("Failed to delete session");
    }
  };

  const handleSave = async () => {
    if (!startTime || !endTime || !sessionType) {
      toast.error("All fields are required");
      return;
    }

    try {
      if (editingSession) {
        // Update
        const res = await sessionService.updateSession(editingSession.id, {
          startTime,
          endTime,
          sessionType,
        });
        setSessions(
          sessions.map((s) => (s.id === editingSession.id ? res.data : s))
        );
        toast.success("Session updated");
      } else {
        // Create
        console.log(startTime)
        console.log(endTime)
        console.log(sessionType)
        const payload = {
          sessionType: sessionType.toUpperCase(), // "MORNING" | "LUNCH" | "AFTERNOON" | "EVENING"
          startTime: startTime, // "08:00:00"
          endTime: endTime      // "12:00:00"
        };
        const res = await sessionService.createSession(payload);
        setSessions([...sessions, res.data]);
        toast.success("Session created");
      }

      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  // Unique session types for filter
  const typeOptions = [...new Set(sessions.map((s) => s.sessionType))];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sessions</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="mr-2 w-4 h-4" /> Create Session
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">ALL TYPES</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Start Time</th>
              <th className="px-4 py-2">End Time</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No sessions found
                </td>
              </tr>
            ) : (
              filteredSessions.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{s.startTime}</td>
                  <td className="px-4 py-2">{s.endTime}</td>
                  <td className="px-4 py-2">{s.sessionType}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => openEditModal(s)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editingSession ? "Edit Session" : "Create Session"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="time"
                placeholder="Start Time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full"
              />
              <input
                type="time"
                placeholder="End Time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full"
              />
              <input
                type="text"
                placeholder="Session Type"
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                {editingSession ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsPage;

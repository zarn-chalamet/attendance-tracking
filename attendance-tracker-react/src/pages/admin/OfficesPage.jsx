import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";
import { officeService } from "../../services/officeService";

const OfficesPage = () => {
  const [offices, setOffices] = useState([]);
  const [expandedOfficeId, setExpandedOfficeId] = useState(null);
  const [officeUsers, setOfficeUsers] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ id: null, name: "", latitude: "", longitude: "" });

  // Fetch offices
  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      const res = await officeService.getOffices();
      setOffices(res.data);
    } catch (err) {
      toast.error("Failed to fetch offices");
    }
  };

  // CRUD handlers
  const handleCreate = () => {
    setModalData({ id: null, name: "", latitude: "", longitude: "" });
    setModalOpen(true);
  };

  const handleEdit = (office) => {
    setModalData({
      id: office.id,
      name: office.name,
      latitude: office.latitude,
      longitude: office.longitude,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this office?")) return;
    try {
      await officeService.deleteOffice(id);
      setOffices(offices.filter((o) => o.id !== id));
      toast.success("Office deleted");
    } catch (err) {
      toast.error("Failed to delete office");
    }
  };

  const handleModalSave = async () => {
    try {
      if (modalData.id) {
        // update
        await officeService.updateOffice(modalData.id, modalData);
        toast.success("Office updated");
      } else {
        // create
        await officeService.createOffice(modalData);
        toast.success("Office created");
      }
      setModalOpen(false);
      fetchOffices();
    } catch (err) {
      toast.error("Failed to save office");
    }
  };

  // Toggle showing users
  const toggleUsers = async (officeId) => {
    if (expandedOfficeId === officeId) {
      setExpandedOfficeId(null);
      return;
    }
    if (!officeUsers[officeId]) {
      try {
        const res = await officeService.getOfficeUserList(officeId);
        setOfficeUsers((prev) => ({ ...prev, [officeId]: res.data }));
      } catch (err) {
        toast.error("Failed to fetch office users");
      }
    }
    setExpandedOfficeId(officeId);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Offices</h1>
        <button
          onClick={handleCreate}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="mr-2 w-4 h-4" /> Create Office
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Latitude</th>
              <th className="px-4 py-2">Longitude</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              offices.map((office) => (
                <React.Fragment key={office.id}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{office.name}</td>
                    <td className="px-4 py-2">{office.latitude}</td>
                    <td className="px-4 py-2">{office.longitude}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button
                        onClick={() => handleEdit(office)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(office.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleUsers(office.id)}
                        className="bg-gray-500 text-white px-2 py-1 rounded-lg hover:bg-gray-600 transition flex items-center"
                      >
                        <Users className="w-4 h-4 mr-1" /> Users
                      </button>
                    </td>
                  </tr>
                  
                  {expandedOfficeId === office.id && officeUsers[office.id] && (
                      <tr className="bg-gray-50">
                        <td colSpan="4" className="px-4 py-4">
                          <strong>Users in this office:</strong>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                            {officeUsers[office.id].length === 0 ? (
                              <div className="text-gray-500 col-span-full">No users found</div>
                            ) : (
                              officeUsers[office.id].map((u) => (
                                <div
                                  key={u.id}
                                  className="flex items-center p-3 bg-white rounded-lg shadow hover:shadow-md transition"
                                >
                                  <div>
                                    <div className="font-semibold text-gray-800">{u.username}</div>
                                    <div className="text-sm text-gray-500">{u.email}</div>
                                    <div className="text-xs text-gray-400">{u.role}</div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </td>
                      </tr>
                    )}

                </React.Fragment>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">{modalData.id ? "Edit Office" : "Create Office"}</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Name"
                value={modalData.name}
                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                className="border px-3 py-2 rounded-lg"
              />
              <input
                type="number"
                placeholder="Latitude"
                value={modalData.latitude}
                onChange={(e) => setModalData({ ...modalData, latitude: e.target.value })}
                className="border px-3 py-2 rounded-lg"
              />
              <input
                type="number"
                placeholder="Longitude"
                value={modalData.longitude}
                onChange={(e) => setModalData({ ...modalData, longitude: e.target.value })}
                className="border px-3 py-2 rounded-lg"
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={handleModalSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficesPage;

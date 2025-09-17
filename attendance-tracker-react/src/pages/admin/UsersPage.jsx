import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { userService } from "../../services/userService";
import UserDetailsModal from "../../components/user/UserDetailsModal";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await userService.getUsers();
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const handleUserClick = async (user) => {
    setSelectedUser(user);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      (u.office_name && u.office_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or office"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Office</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => handleUserClick(user)}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{user.username}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.office_name || "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
    </div>
  );
};

export default UsersPage;

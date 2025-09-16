import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown, Bell, Search, Menu, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const ANavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

 
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Sidebar toggle and search */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition mr-2"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Right: profile */}
          <div className="flex items-center space-x-4">

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-50"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user.username.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-800">{user.username}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <p className="text-xs text-indigo-600 mt-1">Administrator</p>
                  </div>

                  <div className="py-1">
                    <button className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4 mr-2" />
                      Profile Settings
                    </button>
                  </div>

                  <div className="py-1 border-t border-gray-100">
                    <button
                      onClick={() => logout()}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ANavbar;
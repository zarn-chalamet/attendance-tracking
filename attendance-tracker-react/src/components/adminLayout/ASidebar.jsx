// Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Building, Users, BarChart2, Settings } from "lucide-react";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Sessions", href: "/admin/sessions", icon: Calendar },
    { name: "Offices", href: "/admin/offices", icon: Building },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Reports", href: "/admin/reports", icon: BarChart2 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      } flex flex-col h-full`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <span className={`font-bold text-lg text-indigo-600 ${!isOpen && "hidden"}`}>
          AdminPanel
        </span>
        <span className={`text-indigo-600 text-lg font-bold ${isOpen ? "hidden" : ""}`}>
          A
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.href)
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              {isOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;

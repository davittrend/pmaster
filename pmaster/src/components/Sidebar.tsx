import React from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, Calendar, Clock, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export function Sidebar() {
  const { auth } = useAuthStore();

  if (!auth) return null;

  return (
    <div className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        <NavLink
          to="/accounts"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-md transition-colors ${
              isActive ? 'bg-pink-50 text-pink-600' : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <Settings className="h-5 w-5" />
          <span>Account Management</span>
        </NavLink>
        <NavLink
          to="/schedulepins"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-md transition-colors ${
              isActive ? 'bg-pink-50 text-pink-600' : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <Calendar className="h-5 w-5" />
          <span>Schedule Pins</span>
        </NavLink>
        <NavLink
          to="/scheduled"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-md transition-colors ${
              isActive ? 'bg-pink-50 text-pink-600' : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <Clock className="h-5 w-5" />
          <span>Scheduled Pins</span>
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-md transition-colors ${
              isActive ? 'bg-pink-50 text-pink-600' : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </NavLink>
      </nav>
    </div>
  );
}
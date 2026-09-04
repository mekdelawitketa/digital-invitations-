// frontend/src/features/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 2,
    totalEvents: 3,
    weddingEvents: 1,
    birthdayEvents: 1,
    graduationEvents: 1,
    totalRSVPs: 1,
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
          <div className="text-sm text-gray-500">Total Users</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.totalEvents}</div>
          <div className="text-sm text-gray-500">Total Events</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-pink-600">{stats.weddingEvents}</div>
          <div className="text-sm text-gray-500">Weddings</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.birthdayEvents}</div>
          <div className="text-sm text-gray-500">Birthdays</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.graduationEvents}</div>
          <div className="text-sm text-gray-500">Graduations</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.totalRSVPs}</div>
          <div className="text-sm text-gray-500">Total RSVPs</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link to="/admin/users" className="block text-blue-600 hover:underline">👥 Manage Users</Link>
            <Link to="/admin/events" className="block text-blue-600 hover:underline">📋 Manage Events</Link>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <p className="text-gray-500 text-sm">No recent activity</p>
        </div>
      </div>
    </div>
  );
};
// frontend/src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login, Register, ProtectedRoute } from '../features/auth';
import { InvitationPage } from '../features/invitation';
import { MyEvents, EventEditor, EventDetail, OwnerDashboard } from '../features/owner';
import { AdminDashboard } from '../features/admin';

// Home Component
const Home = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
      <h1 className="text-4xl font-bold text-gray-800">🎉 Digital Invitations</h1>
      <p className="text-gray-600 mt-2">Create beautiful digital invitations for your special moments</p>
      <div className="mt-4 flex gap-4 justify-center">
        <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Login
        </a>
        <a href="/register" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300">
          Register
        </a>
      </div>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/invitation/:slug" element={<InvitationPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Owner Routes */}
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/my-events/dashboard" element={<OwnerDashboard />} />
        <Route path="/my-events/create" element={<EventEditor />} />
        <Route path="/my-events/:id" element={<EventDetail />} />
        <Route path="/my-events/:id/edit" element={<EventEditor />} />
        <Route path="/my-events/:id/rsvp" element={<div>RSVP Manager</div>} />
        <Route path="/my-events/:id/gallery" element={<div>Gallery Manager</div>} />
        <Route path="/my-events/:id/songs" element={<div>Song Suggestions</div>} />
        <Route path="/my-events/:id/guestbook" element={<div>Guestbook Manager</div>} />
        <Route path="/my-events/:id/wedding-party" element={<div>Wedding Party</div>} />
        <Route path="/my-events/:id/schedule" element={<div>Schedule Manager</div>} />
        <Route path="/my-events/:id/settings" element={<div>Event Settings</div>} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<div>Admin Users</div>} />
        <Route path="/admin/events" element={<div>Admin Events</div>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
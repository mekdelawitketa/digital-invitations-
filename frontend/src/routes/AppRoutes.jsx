// frontend/src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login, Register, ProtectedRoute, AdminRoute, OwnerRoute } from '../features/auth';
import { InvitationPage } from '../features/invitation';
import { OwnerDashboard, MyEvents, EventEditor, EventDetail } from '../features/owner';
import { AdminDashboard, AdminUsers, AdminEvents } from '../features/admin';
import { RSVPManager } from '../features/rsvp';
import { GalleryManager } from '../features/gallery';
import { ScheduleManager } from '../features/schedule';

// Home Page Component (we'll create this later)
const Home = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Digital Invitations</h1>
      <p className="text-gray-600 mb-8">Create beautiful digital invitations for your special moments</p>
      <div className="flex gap-4 justify-center">
        <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Get Started
        </a>
        <a href="/register" className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
          Create Account
        </a>
      </div>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - No auth required */}
        <Route path="/" element={<Home />} />
        <Route path="/invitation/:slug" element={<InvitationPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - Auth required */}
        <Route element={<ProtectedRoute />}>
          <Route element={<OwnerRoute />}>
            <Route path="/my-events/dashboard" element={<OwnerDashboard />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/my-events/create" element={<EventEditor />} />
            <Route path="/my-events/:id" element={<EventDetail />} />
            <Route path="/my-events/:id/edit" element={<EventEditor />} />
            <Route path="/my-events/:id/gallery" element={<GalleryManager />} />
            <Route path="/my-events/:id/videos" element={<div>Videos Manager</div>} />
            <Route path="/my-events/:id/schedule" element={<div>Schedule Manager</div>} />
            <Route path="/my-events/:id/rsvp" element={<RSVPManager />} />
            <Route path="/my-events/:id/guestbook" element={<div>Guestbook Manager</div>} />
            <Route path="/my-events/:id/songs" element={<div>Song Suggestions</div>} />
            <Route path="/my-events/:id/wedding-party" element={<div>Wedding Party</div>} />
            <Route path="/my-events/:id/settings" element={<div>Event Settings</div>} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/themes" element={<div>Admin Themes</div>} />
            <Route path="/admin/media" element={<div>Admin Media</div>} />
            <Route path="/admin/settings" element={<div>Admin Settings</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
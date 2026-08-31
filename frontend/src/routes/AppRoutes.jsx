// frontend/src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../components/layout';
import { DashboardLayout } from '../components/layout';
import { ProtectedRoute } from '../features/auth';
import { AdminRoute } from '../features/auth';
import { InvitationPage } from '../features/invitation';
import { Login, Register } from '../features/auth';
import { EventList, EventCreate, EventDetail } from '../features/events';
import { AdminDashboard, AdminUsers, AdminEvents } from '../features/admin';
import { OwnerDashboard, MyEvents, EventEditor } from '../features/owner';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - No auth required */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<EventList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/invitation/:slug" element={<InvitationPage />} />
        </Route>

        {/* Protected Routes - Auth required */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Owner Routes */}
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/my-events/create" element={<EventCreate />} />
            <Route path="/my-events/:id" element={<EventDetail />} />
            <Route path="/my-events/:id/edit" element={<EventEditor />} />
            <Route path="/my-events/:id/gallery" element={<div>Gallery</div>} />
            <Route path="/my-events/:id/videos" element={<div>Videos</div>} />
            <Route path="/my-events/:id/schedule" element={<div>Schedule</div>} />
            <Route path="/my-events/:id/rsvp" element={<div>RSVP</div>} />
            <Route path="/my-events/:id/guestbook" element={<div>Guestbook</div>} />
            <Route path="/my-events/:id/songs" element={<div>Songs</div>} />
            <Route path="/my-events/:id/wedding-party" element={<div>Wedding Party</div>} />
            <Route path="/my-events/:id/settings" element={<div>Settings</div>} />

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/themes" element={<div>Themes</div>} />
              <Route path="/admin/media" element={<div>Media</div>} />
              <Route path="/admin/settings" element={<div>Settings</div>} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
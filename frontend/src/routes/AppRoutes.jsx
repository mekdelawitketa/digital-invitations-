// frontend/src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login, Register, ProtectedRoute, AdminRoute, OwnerRoute } from '../features/auth';
import { InvitationPage } from '../features/invitation';
// Placeholder components (we'll create these later)
const Home = () => <div>Home Page</div>;
const MyEvents = () => <div>My Events</div>;
const EventCreate = () => <div>Create Event</div>;
const EventDetail = () => <div>Event Detail</div>;
const InvitationPage = () => <div>Invitation Page</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - No auth required */}
        <Route path="/" element={<Home />} />
        <Route path="/invitation/:slug" element={<InvitationPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/invitation/:slug" element={<InvitationPage />} />

        {/* Protected Routes - Auth required */}
        <Route element={<ProtectedRoute />}>
          <Route element={<OwnerRoute />}>
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/my-events/create" element={<EventCreate />} />
            <Route path="/my-events/:id" element={<EventDetail />} />
            <Route path="/my-events/:id/edit" element={<div>Edit Event</div>} />
            <Route path="/my-events/:id/gallery" element={<div>Gallery</div>} />
            <Route path="/my-events/:id/videos" element={<div>Videos</div>} />
            <Route path="/my-events/:id/schedule" element={<div>Schedule</div>} />
            <Route path="/my-events/:id/rsvp" element={<div>RSVP</div>} />
            <Route path="/my-events/:id/guestbook" element={<div>Guestbook</div>} />
            <Route path="/my-events/:id/songs" element={<div>Songs</div>} />
            <Route path="/my-events/:id/wedding-party" element={<div>Wedding Party</div>} />
            <Route path="/my-events/:id/settings" element={<div>Settings</div>} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<div>Admin Users</div>} />
            <Route path="/admin/events" element={<div>Admin Events</div>} />
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
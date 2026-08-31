// frontend/src/features/auth/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Role } from '../../types';

export const AdminRoute = () => {
  const { user } = useAuthStore();
  
  if (!user || user.role !== Role.ADMIN) {
    return <Navigate to="/my-events" replace />;
  }
  
  return <Outlet />;
};
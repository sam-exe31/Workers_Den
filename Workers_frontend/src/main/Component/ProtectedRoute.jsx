import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const normalizedRole = user.role ? user.role.replace('ROLE_', '') : null;

  if (allowedRoles && !allowedRoles.includes(normalizedRole)) {
    const fallbackPath = normalizedRole === 'WORKER'
      ? '/worker/dashboard'
      : normalizedRole === 'ADMIN'
        ? '/admin/categories'
        : '/customer/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  return children ? children : <Outlet />;
}

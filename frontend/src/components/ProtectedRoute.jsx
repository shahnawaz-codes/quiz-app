import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    const target = role === 'admin' ? '/admin/dashboard' : '/dashboard';
    return <Navigate to={target} replace />;
  }

  return children;
};

export default ProtectedRoute;

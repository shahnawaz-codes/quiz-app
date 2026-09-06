import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role, initializing } = useAuth();

  if (initializing) {
    return <LoadingSpinner />;
  }

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

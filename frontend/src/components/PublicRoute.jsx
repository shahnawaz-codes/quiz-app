import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SkeletonLoader from './common/SkeletonLoader';

/**
 * Route wrapper for guest/public authentication pages (Login, Register, AdminLogin).
 * Shows SkeletonLoader while session rehydration is active to prevent page flickers.
 */
const PublicRoute = ({ children }) => {
  const { user, role, initializing } = useAuth();

  if (initializing) {
    return <SkeletonLoader />;
  }

  if (user) {
    const target = role === 'admin' ? '/admin/dashboard' : '/dashboard';
    return <Navigate to={target} replace />;
  }

  return children;
};

export default PublicRoute;

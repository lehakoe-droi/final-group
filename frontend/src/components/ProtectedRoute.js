import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 * Props:
 * - allowedRoles: array of roles allowed to access the child component (optional)
 * - children: the component to render when access is allowed
 */
const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { currentUser } = useAuth();

  // If no authenticated user, redirect to login
  if (!currentUser || !currentUser.uid) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles provided, check the user's role
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const role = currentUser.userType || (typeof window !== 'undefined' ? localStorage.getItem('userType') : null);
    if (!role || !allowedRoles.includes(role)) {
      // Not authorized
      return <Navigate to="/login" replace />;
    }
  }

  // Authorized
  return children;
};

export default ProtectedRoute;

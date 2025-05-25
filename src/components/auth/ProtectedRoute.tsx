import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAdmin?: boolean;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiresAdmin = false,
  requiredRole,
}) => {
  const { user, profile, loading, isAdmin, hasRole } = useAuth();
  const location = useLocation();
  // Handle the loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-100 border-t-indigo-600 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading...</h2>
          <p className="mt-2 text-sm text-gray-500">Setting up your secure session</p>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if profile exists
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-800">Loading Profile...</div>
        <div className="mt-4 text-gray-600">Please wait while we set up your account.</div>
      </div>
    );
  }

  // Check for admin requirement
  if (requiresAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Check for specific role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

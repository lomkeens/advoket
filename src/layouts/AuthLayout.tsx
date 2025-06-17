import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scale } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Log auth state on mount and changes
  useEffect(() => {
    console.log('[AuthLayout] Current state:', { 
      path: location.pathname,
      authenticated: !!user,
      loading 
    });
  }, [user, loading, location]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex space-x-2">
          <span className="h-3 w-3 bg-blue-800 rounded-full animate-bounce [animation-delay:-0.32s]"></span>
          <span className="h-3 w-3 bg-blue-800 rounded-full animate-bounce [animation-delay:-0.16s]"></span>
          <span className="h-3 w-3 bg-blue-800 rounded-full animate-bounce"></span>
        </div>
      </div>
    );
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    console.log('[AuthLayout] User already authenticated, redirecting to dashboard');
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Scale className="h-12 w-12 text-blue-800" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Advoket
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Case Management for Law Firms
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
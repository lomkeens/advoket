import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Clients from './pages/clients/Clients';
import ClientDetails from './pages/clients/ClientDetails';
import Cases from './pages/cases/Cases';
import CaseDetails from './pages/cases/CaseDetails';
import Calendar from './pages/Calendar/Calendar';
import Documents from './pages/Documents/Documents';
import Billing from './pages/Billing/Billing';
import Settings from './pages/Settings/Settings';
import NotFound from './pages/NotFound';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FirmProvider } from './context/FirmContext';

function App() {
  useEffect(() => {
    // This helps catch any global unhandled errors
    const handleError = (event: ErrorEvent) => {
      console.error('[App] Unhandled error:', event.error);
      // Only show error toast for non-extension errors
      if (!event.error?.message?.includes('Could not establish connection') &&
          !event.error?.message?.includes('message port closed')) {
        toast.error('An unexpected error occurred');
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <FirmProvider>
          <Router>
            <Toaster 
              position="top-right"
              toastOptions={{
                // Prevent error toasts from stacking up
                error: { duration: 4000 },
                // Add some styling
                className: 'shadow-lg',
              }} 
            />
            <Routes>
              <Route path="/login" element={<AuthLayout />}>
                <Route index element={<Login />} />
              </Route>
              <Route path="/register" element={<AuthLayout />}>
                <Route index element={<Register />} />
              </Route>
              
              {/* Protected dashboard routes */}
              <Route element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="clients" element={<Clients />} />
                <Route path="clients/:id" element={<ClientDetails />} />
                <Route path="cases" element={<Cases />} />
                <Route path="cases/:id" element={<CaseDetails />} />
                <Route path="calendar" element={<Calendar />} />                <Route path="documents" element={<Documents />} />
                <Route path="billing" element={<Billing />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </FirmProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
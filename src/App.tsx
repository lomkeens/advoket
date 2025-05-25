import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

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
import OrganizationSettings from './pages/Settings/OrganizationSettings';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FirmProvider } from './context/FirmContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FirmProvider>
          <Router>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
              <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
              
              {/* Dashboard routes - Protected by DashboardLayout */}
              <Route element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="clients" element={<Clients />} />
                <Route path="clients/:id" element={<ClientDetails />} />
                <Route path="cases" element={<Cases />} />
                <Route path="cases/:id" element={<CaseDetails />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="documents" element={<Documents />} />
                <Route path="billing" element={<Billing />} />
                <Route path="settings" element={<Settings />} />
                <Route path="settings/organization" element={<OrganizationSettings />} />
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
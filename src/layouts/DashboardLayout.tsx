import { useState } from 'react';
import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFirm } from '../context/FirmContext';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';
import CreateClientModal from '../components/clients/CreateClientModal';

export default function DashboardLayout() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { loading: firmLoading } = useFirm();

  const handleNewClient = () => {
    setIsClientModalOpen(true);
  };

  const handleClientCreated = () => {
    setIsClientModalOpen(false);
    navigate('/clients');
  };

  // Show loading state while auth or firm settings are loading
  if (authLoading || firmLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onNewClient={handleNewClient} />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
        <CreateClientModal 
          isOpen={isClientModalOpen}
          onClose={() => setIsClientModalOpen(false)}
          onClientCreated={handleClientCreated}
        />
      </div>
    </div>
  );
}
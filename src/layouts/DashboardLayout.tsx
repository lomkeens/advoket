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
  const { error: firmError } = useFirm();

  const handleNewClient = () => {
    setIsClientModalOpen(true);
  };

  const handleClientCreated = () => {
    setIsClientModalOpen(false);
    navigate('/clients');
  };

  // First render - show minimal loading state
  if (authLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="space-y-6 text-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-indigo-500 animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // After auth check - redirect if no user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Main layout - always render once we have user
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header onNewClient={handleNewClient} />
        
        {/* Show errors in a non-intrusive way */}
        {firmError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{firmError}</p>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-auto bg-white">
          <Outlet />
        </main>

        <CreateClientModal 
          isOpen={isClientModalOpen}
          onClose={() => setIsClientModalOpen(false)}
          onClientCreated={handleClientCreated}
        />
      </div>
    </div>
  );
}
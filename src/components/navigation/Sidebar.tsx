import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Users,
  FolderOpen,
  FileText,
  Calendar,
  Bell,
  BarChart,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  Search
} from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: Home },
    { to: '/clients', label: 'Clients', icon: Users },
    { to: '/cases', label: 'Cases', icon: FolderOpen },
    { to: '/documents', label: 'Documents', icon: FileText },
    { to: '/calendar', label: 'Calendar', icon: Calendar },
  ];

  const toolLinks = [
    { to: '/reports', label: 'Reports', icon: BarChart },
    { to: '/billing', label: 'Billing', icon: CreditCard },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className={`sidebar bg-white text-gray-700 shadow-lg relative flex flex-col ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          {!isCollapsed && (
            <span className="font-bold text-xl text-indigo-600">Advoket</span>
          )}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`text-gray-500 hover:text-indigo-600 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="relative">
            {!isCollapsed && (
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
            <Search className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'absolute left-3 top-2.5'} text-gray-400`} />
          </div>
        </div>

        <nav className="mt-2">
          <div className="px-0">
            {!isCollapsed && (
              <div className="py-2 pl-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Navigation</div>
            )}
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center pl-6 pr-4 py-2 rounded-lg mx-2 mt-1 ${
                  isActivePath(to) ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">{label}</span>}
              </Link>
            ))}
          </div>

          <div className="px-0 mt-6">
            {!isCollapsed && (
              <div className="py-2 pl-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tools</div>
            )}
            {toolLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center pl-6 pr-4 py-2 rounded-lg mx-2 mt-1 ${
                  isActivePath(to) ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">{label}</span>}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className="mt-auto">
        {user && (
          <div>
            {/* User Quick Actions - Keeping Notifications link here */}
            <div className="px-3 py-2">
              {!isCollapsed && (
                <nav className="space-y-1">
                  <Link
                    to="/notifications"
                    className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-indigo-50 hover:text-indigo-600 group"
                  >
                    <Bell className="h-4 w-4 mr-3" />
                    Notifications
                    <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full group-hover:bg-red-600 group-hover:text-white">
                      3
                    </span>
                  </Link>
                </nav>
              )}
            </div>

            {/* User Profile Section - Made clickable */}
            <div className="border-t mt-2">
              <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 cursor-pointer" onClick={() => navigate('/settings/profile')}>
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-lg">
                      {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    {!isCollapsed && (
                      <div className="ml-3 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {profile?.full_name || user.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {profile?.role === 'admin' ? 'Administrator' : 'Standard User'}
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center justify-center h-9 w-9 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors ${
                      isCollapsed ? 'mx-auto mt-2' : ''
                    }`}
                    title="Sign out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, Users, Briefcase, Calendar, FileText, DollarSign, Settings, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { user } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Cases', href: '/cases', icon: Briefcase },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Billing', href: '/billing', icon: DollarSign },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`${
          isOpen ? 'fixed inset-0 z-40 flex' : 'hidden'
        } md:hidden`}
        role="dialog"
        aria-modal="true"
      >
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75" 
          aria-hidden="true"
          onClick={onClose}
        ></div>
        
        {/* Sidebar panel */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-primary">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onClose}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-shrink-0 flex items-center px-4">
            <img src="/advoket-logo.png" alt="Advoket" className="h-8" />
          </div>
          
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => 
                    `${isActive ? 'bg-primary-dark text-white' : 'text-blue-100 hover:bg-primary-light'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`
                  }
                  onClick={onClose}
                >
                  <item.icon className="mr-4 h-6 w-6 flex-shrink-0" aria-hidden="true" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          
          {user && (
            <div className="flex-shrink-0 flex border-t border-primary-light p-4">
              <div className="flex-shrink-0 group block">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-white font-medium">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className={`hidden md:flex md:flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex flex-col w-full">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary">
              <img src="/advoket-logo.png" alt="Advoket" className={`transition-all duration-300 ${isCollapsed ? 'w-8' : 'w-32'}`} />
              <button
                onClick={onToggleCollapse}
                className="ml-auto text-white hover:text-gray-200"
              >
                <ChevronLeft className={`h-6 w-6 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 bg-primary space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) => 
                      `${isActive ? 'bg-primary-dark text-white' : 'text-blue-100 hover:bg-primary-light'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`
                    }
                  >
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} aria-hidden="true" />
                    {!isCollapsed && item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
            
            {user && !isCollapsed && (
              <div className="flex-shrink-0 flex border-t border-primary-light p-4 bg-primary">
                <div className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-primary-light flex items-center justify-center text-white font-medium">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
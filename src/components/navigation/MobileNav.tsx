import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Calendar, FileText } from 'lucide-react';

const MobileNav: React.FC = () => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Cases', href: '/cases', icon: Briefcase },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Documents', href: '/documents', icon: FileText },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-10">
      {navigation.slice(0, 5).map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          className={({ isActive }) => 
            `${isActive ? 'text-blue-800' : 'text-gray-500'
            } flex flex-col items-center justify-center text-xs w-full`
          }
        >
          <item.icon className="h-6 w-6 mb-1" aria-hidden="true" />
          <span>{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;
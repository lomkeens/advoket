import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  linkText?: string;
  linkUrl?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  icon, 
  children, 
  linkText, 
  linkUrl 
}) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2 text-blue-800">
            {icon}
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        </div>
        {linkText && linkUrl && (
          <Link 
            to={linkUrl} 
            className="text-sm text-blue-800 hover:text-blue-900 flex items-center"
          >
            {linkText}
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        )}
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
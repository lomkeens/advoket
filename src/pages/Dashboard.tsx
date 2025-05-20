import React from 'react';
import { Clock, Calendar, AlertCircle, TrendingUp, FilePlus, UserPlus } from 'lucide-react';
import DashboardCard from '../components/dashboard/DashboardCard';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';
import RecentCases from '../components/dashboard/RecentCases';
import StatCard from '../components/dashboard/StatCard';

const Dashboard: React.FC = () => {
  // Sample data
  const stats = [
    { id: 1, name: 'Active Cases', value: '28', icon: FilePlus, change: '+2', changeType: 'increase' },
    { id: 2, name: 'Active Clients', value: '43', icon: UserPlus, change: '+5', changeType: 'increase' },
    { id: 3, name: 'Billable Hours', value: '124', icon: Clock, change: '+12%', changeType: 'increase' },
    { id: 4, name: 'Collections', value: '$18,402', icon: TrendingUp, change: '+8%', changeType: 'increase' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back! Here's an overview of your caseload and upcoming events.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Priority alerts */}
      <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              You have <span className="font-medium">3 deadlines</span> coming up in the next 48 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent cases */}
        <DashboardCard title="Recent Cases" icon={<FilePlus className="h-5 w-5" />} linkText="View All Cases" linkUrl="/cases">
          <RecentCases />
        </DashboardCard>

        {/* Upcoming events */}
        <DashboardCard title="Upcoming Events" icon={<Calendar className="h-5 w-5" />} linkText="View Calendar" linkUrl="/calendar">
          <UpcomingEvents />
        </DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
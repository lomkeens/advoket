import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatProps {
  id: number;
  name: string;
  value: string;
  icon: LucideIcon;
  change: string;
  changeType: 'increase' | 'decrease';
}

interface StatCardProps {
  stat: StatProps;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
            <stat.icon className="h-6 w-6 text-blue-800" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{stat.value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <span
            className={`font-medium ${
              stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {stat.change}
          </span>{' '}
          <span className="text-gray-500">from last month</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';

const RecentCases: React.FC = () => {
  // Sample data
  const cases = [
    { 
      id: 1, 
      title: 'Smith v. Johnson Corp', 
      client: 'Robert Smith', 
      type: 'Corporate Litigation',
      priority: 'High',
      nextDate: '2025-03-15',
      daysAgo: 2
    },
    { 
      id: 2, 
      title: 'Estate of Williams', 
      client: 'Emily Williams',
      type: 'Estate Planning',
      priority: 'Medium',
      nextDate: '2025-03-20',
      daysAgo: 5
    },
    { 
      id: 3, 
      title: 'Thompson Divorce', 
      client: 'Jessica Thompson',
      type: 'Family Law',
      priority: 'Medium',
      nextDate: '2025-03-18',
      daysAgo: 7
    },
    { 
      id: 4, 
      title: 'Zhang IP Dispute', 
      client: 'Zhang Technologies',
      type: 'Intellectual Property',
      priority: 'High',
      nextDate: '2025-03-22',
      daysAgo: 1
    },
  ];

  return (
    <div className="flow-root">
      <ul className="-my-5 divide-y divide-gray-200">
        {cases.map((caseItem) => (
          <li key={caseItem.id} className="py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  caseItem.priority === 'High' 
                    ? 'bg-red-100 text-red-800' 
                    : caseItem.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {caseItem.priority.charAt(0)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/cases/${caseItem.id}`} className="text-sm font-medium text-blue-800 hover:text-blue-900 block">
                  {caseItem.title}
                </Link>
                <p className="text-sm text-gray-500 truncate">
                  {caseItem.client} • {caseItem.type}
                </p>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(caseItem.nextDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-500">
                  <Clock className="h-4 w-4 inline mr-1" />
                  {caseItem.daysAgo} days ago
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentCases;
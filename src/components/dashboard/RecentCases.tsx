import React from 'react';
import { Link } from 'react-router-dom';

interface Case {
  id: string;
  caseNumber: string;
  status: 'Active' | 'Pending' | 'Urgent';
  title: string;
  type: string;
  assignedTo: string;
  nextHearing?: string;
}

const cases: Case[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    caseNumber: 'LLF/045/CT/2023',
    status: 'Active',
    title: 'Johnson vs. State Corporation',
    type: 'Civil Tort - Personal Injury',
    assignedTo: 'Sarah Johnson',
    nextHearing: 'May 15, 2023'
  },
  {
    id: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
    caseNumber: 'LLF/112/DV/2023',
    status: 'Pending',
    title: 'Smith Divorce Case',
    type: 'Family Law - Divorce',
    assignedTo: 'Michael Brown',
    nextHearing: 'May 20, 2023'
  },
  {
    id: 'c3d4e5f6-g7h8-9012-cdef-345678901234',
    caseNumber: 'LLF/089/CR/2023',
    status: 'Urgent',
    title: 'State vs. Robert Wilson',
    type: 'Criminal - Fraud',
    assignedTo: 'David Miller',
    nextHearing: 'May 10, 2023'
  }
];

const statusColors = {
  Active: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Urgent: 'bg-red-100 text-red-800'
};

const RecentCases: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-lg">Recent Cases</h2>
        <Link to="/cases" className="text-sm text-indigo-600 hover:text-indigo-800">
          View All
        </Link>
      </div>

      <div className="divide-y">
        {cases.map((caseItem) => (
          <div key={caseItem.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-indigo-100 text-indigo-800">
                    {caseItem.caseNumber}
                  </span>
                  <span className={`ml-2 inline-block px-2 py-1 text-xs font-semibold rounded ${statusColors[caseItem.status]}`}>
                    {caseItem.status}
                  </span>
                </div>
                <h3 className="mt-2 font-medium">{caseItem.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{caseItem.type}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Assigned to</p>
                <p className="font-medium">{caseItem.assignedTo}</p>
                {caseItem.nextHearing && (
                  <p className="text-xs text-gray-500 mt-1">Next hearing: {caseItem.nextHearing}</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex space-x-3">
              <Link
                to={`/cases/${caseItem.id}`}
                className="text-xs px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100"
              >
                View Details
              </Link>
              <button className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                Documents
              </button>
              <button className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                Timeline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentCases;
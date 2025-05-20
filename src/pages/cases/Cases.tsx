import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const Cases = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cases</h1>
        <button
          onClick={() => navigate('/cases/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Case
        </button>
      </div>

      {/* Cases list placeholder - to be implemented */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300">
            No cases found. Create a new case to get started.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cases;
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

const Calendar = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Calendar</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <CalendarIcon className="h-5 w-5 mr-2" />
          New Event
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="min-h-[600px] p-6">
          {/* Calendar content will be implemented later */}
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">Calendar implementation coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
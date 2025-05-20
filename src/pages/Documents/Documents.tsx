import React from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { FileText, Upload, Folder, Search } from 'lucide-react';

const Documents = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documents</h1>
        <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Upload className="w-5 h-5 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Search and filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white">
          <option value="">All Types</option>
          <option value="pdf">PDF</option>
          <option value="doc">Word</option>
          <option value="image">Images</option>
        </select>
      </div>

      {/* Document grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Example document card */}
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center w-full h-32 mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FileText className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Contract Agreement.pdf</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Added on Jan 15, 2025</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">2.4 MB</span>
            <button className="text-primary hover:text-primary/80">Download</button>
          </div>
        </div>

        {/* Example folder card */}
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center w-full h-32 mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Folder className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Case Documents</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">15 items</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Folder</span>
            <button className="text-primary hover:text-primary/80">Open</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
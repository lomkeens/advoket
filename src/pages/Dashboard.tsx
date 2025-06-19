import React from 'react';
import { Clock, Calendar, Gavel, FileText, BarChart, FolderOpen, Download, Share2, User, MapPin } from 'lucide-react';
import DashboardCard from '../components/dashboard/DashboardCard';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';
import ConnectionTest from '../components/debug/ConnectionTest';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { DashboardCardSkeleton, CaseListSkeleton } from '../components/ui/SkeletonLoader';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { stats, recentCases, upcomingHearings, recentDocuments, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-full">
        {/* Modern loading state with skeletons */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <LoadingSpinner size="sm" />
            <span className="text-lg font-medium text-gray-600">Loading your dashboard...</span>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>

        {/* Main content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <CaseListSkeleton />
            <CaseListSkeleton />
          </div>
          <div className="flex flex-col gap-6">
            <CaseListSkeleton />
            <CaseListSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-full">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Dashboard Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
        
        {/* Show connection test when there's an error */}
        <ConnectionTest />
      </div>
    );
  }

  const formatChange = (change: number, type: 'percentage' | 'count' = 'percentage') => {
    if (type === 'percentage') {
      const sign = change > 0 ? '+' : '';
      return `${sign}${change}% from last month`;
    } else {
      const sign = change > 0 ? '+' : '';
      return `${sign}${change} this week`;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Welcome message */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening with your cases today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <DashboardCard
          title="Total Cases"
          value={stats?.total_cases?.toString() || '0'}
          icon={FolderOpen}
          change={formatChange(stats?.cases_change || 0)}
          isPositive={(stats?.cases_change || 0) >= 0}
        />
        <DashboardCard
          title="Active Cases"
          value={stats?.active_cases?.toString() || '0'}
          icon={BarChart}
          change={formatChange(stats?.active_cases_change || 0)}
          isPositive={(stats?.active_cases_change || 0) >= 0}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <DashboardCard
          title="Upcoming Hearings"
          value={stats?.upcoming_hearings?.toString() || '0'}
          icon={Gavel}
          change={formatChange(stats?.hearings_change || 0, 'count')}
          isPositive={(stats?.hearings_change || 0) >= 0}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <DashboardCard
          title="Documents"
          value={stats?.total_documents?.toString() || '0'}
          icon={FileText}
          change={formatChange(stats?.documents_change || 0)}
          isPositive={(stats?.documents_change || 0) >= 0}
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Cases and Upcoming Hearings */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Recent Cases */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-lg">Recent Cases</h2>
              <Link to="/cases" className="text-sm text-indigo-600 hover:text-indigo-800">
                View All
              </Link>
            </div>

            <div className="divide-y">
              {recentCases.length > 0 ? (
                recentCases.map((caseItem) => (
                  <div key={caseItem.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-indigo-100 text-indigo-800">
                            {caseItem.case_type || 'General'}
                          </span>
                          <span className={`ml-2 inline-block px-2 py-1 text-xs font-semibold rounded ${
                            caseItem.status === 'open' 
                              ? 'bg-green-100 text-green-800'
                              : caseItem.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                          </span>
                        </div>
                        <h3 className="mt-2 font-medium">{caseItem.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">Client: {caseItem.client_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {caseItem.assigned_to_name ? `Assigned to ${caseItem.assigned_to_name}` : 'Unassigned'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created: {new Date(caseItem.created_at).toLocaleDateString()}
                        </p>
                        {caseItem.due_date && (
                          <p className="text-xs text-gray-500">
                            Due: {new Date(caseItem.due_date).toLocaleDateString()}
                          </p>
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
                      <Link
                        to={`/clients/${caseItem.client_id}`}
                        className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                      >
                        View Client
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No cases found. <Link to="/cases" className="text-indigo-600 hover:underline">Create your first case</Link>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Hearings Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-lg">Upcoming Hearings</h2>
              <Link to="/calendar" className="text-sm text-indigo-600 hover:text-indigo-800">View Calendar</Link>
            </div>
            <div className="divide-y">
              {upcomingHearings.length > 0 ? (
                upcomingHearings.map((hearing) => (
                  <div key={hearing.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-red-600 mr-4">
                        <Gavel className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{hearing.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {hearing.case_title ? `Case: ${hearing.case_title}` : 'General hearing'}
                        </p>
                        {hearing.client_name && (
                          <p className="text-sm text-gray-500">Client: {hearing.client_name}</p>
                        )}
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>{new Date(hearing.start_date).toLocaleString()}</span>
                          {hearing.location && (
                            <>
                              <span className="mx-2">•</span>
                              <MapPin className="mr-2 h-4 w-4" />
                              <span>{hearing.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No upcoming hearings scheduled. <Link to="/calendar" className="text-indigo-600 hover:underline">Schedule a hearing</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Case Timeline and Recent Documents */}
        <div className="flex flex-col gap-6">
          {/* Case Timeline Section */}
          <UpcomingEvents />

          {/* Recent Documents Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-lg">Recent Documents</h2>
              <Link to="/documents" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
            </div>
            <div className="divide-y">
              {recentDocuments.length > 0 ? (
                recentDocuments.map((document) => (
                  <div key={document.id} className="p-6 hover:bg-gray-50 transition-colors duration-200 document-card relative">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{document.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {document.case_title ? `Case: ${document.case_title}` : 'General document'}
                        </p>
                        {document.client_name && (
                          <p className="text-sm text-gray-500">Client: {document.client_name}</p>
                        )}
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <User className="mr-2 h-4 w-4" />
                          <span>Uploaded by {document.uploaded_by_name || 'Unknown'}</span>
                          <span className="mx-2">•</span>
                          <Clock className="mr-2 h-4 w-4" />
                          <span>{new Date(document.uploaded_at).toLocaleDateString()}</span>
                        </div>
                        {document.size && (
                          <p className="text-xs text-gray-400 mt-1">
                            {formatFileSize(document.size)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="document-actions absolute right-6 top-6 opacity-0 transition-opacity duration-200 flex space-x-2">
                      <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No documents uploaded yet. <Link to="/documents" className="text-indigo-600 hover:underline">Upload your first document</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
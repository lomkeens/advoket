import React from 'react';
import { Clock, Calendar, Gavel, FileText, BarChart, FolderOpen, Download, Share2, User, MapPin } from 'lucide-react';
import DashboardCard from '../components/dashboard/DashboardCard';
import UpcomingEvents from '../components/dashboard/UpcomingEvents'; // This component seems to be the Case Timeline
import RecentCases from '../components/dashboard/RecentCases';

// Note: A dedicated RecentDocuments component could be created for better organization,
// but for now, the structure is added directly here to match the HTML reference.

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <DashboardCard
          title="Total Cases"
          value="142"
          icon={FolderOpen}
          change="+12% from last month"
          isPositive={true}
        />
        <DashboardCard
          title="Active Cases"
          value="87"
          icon={BarChart} // Using BarChart as a placeholder for tasks icon
          change="-5% from last month"
          isPositive={false}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <DashboardCard
          title="Upcoming Hearings"
          value="14"
          icon={Gavel}
          change="+3 this week"
          isPositive={true}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <DashboardCard
          title="Documents"
          value="1,247"
          icon={FileText}
          change="+32% from last month"
          isPositive={true}
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      {/* Main dashboard content: Recent Cases, Upcoming Hearings, Case Timeline, Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Cases and Upcoming Hearings */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <RecentCases />

          {/* Upcoming Hearings Section - Matches structure from reference */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-lg">Upcoming Hearings</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">View Calendar</button>
            </div>
            <div className="divide-y">
              {/* Hearing Item 1 */}
              <div className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-red-600 mr-4">
                    <Gavel className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Johnson vs. State Corporation</h3>
                    <p className="text-sm text-gray-500 mt-1">Civil Tort - Personal Injury</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>May 15, 2023 • 10:30 AM</span>
                      <span className="mx-2">•</span>
                      <MapPin className="mr-2 h-4 w-4" /> {/* Using MapPin for location */}
                      <span>District Court Room 4B</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Hearing Item 2 */}
              <div className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                    <Gavel className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">State vs. Robert Wilson</h3>
                    <p className="text-sm text-gray-500 mt-1">Criminal - Fraud</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>May 10, 2023 • 2:15 PM</span>
                      <span className="mx-2">•</span>
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>Criminal Court Room 2A</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Hearing Item 3 */}
              <div className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
                    <Gavel className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Smith Divorce Case</h3>
                    <p className="text-sm text-gray-500 mt-1">Family Law - Divorce</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>May 20, 2023 • 9:00 AM</span>
                      <span className="mx-2">•</span>
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>Family Court Room 5C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Case Timeline and Recent Documents */}
        <div className="flex flex-col gap-6">
          {/* Case Timeline Section - Uses UpcomingEvents component */}
          <UpcomingEvents />

          {/* Recent Documents Section - Matches structure from reference */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-lg">Recent Documents</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
            </div>
            <div className="divide-y">
              {/* Document Item 1 */}
              <div className="p-6 hover:bg-gray-50 transition-colors duration-200 document-card relative">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Affidavit of John Johnson.pdf</h3>
                    <p className="text-sm text-gray-500 mt-1">Johnson vs. State Corporation</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <User className="mr-2 h-4 w-4" /> {/* Using User for uploaded by */}
                      <span>Uploaded by Sarah Johnson</span>
                      <span className="mx-2">•</span>
                      <Clock className="mr-2 h-4 w-4" /> {/* Using Clock for time */}
                      <span>Today, 10:45 AM</span>
                    </div>
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
              {/* Document Item 2 */}
              <div className="p-6 hover:bg-gray-50 transition-colors duration-200 document-card relative">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mr-4">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Motion to Dismiss.docx</h3>
                    <p className="text-sm text-gray-500 mt-1">State vs. Robert Wilson</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                       <User className="mr-2 h-4 w-4" />
                      <span>Uploaded by David Miller</span>
                      <span className="mx-2">•</span>
                       <Clock className="mr-2 h-4 w-4" />
                      <span>Yesterday, 4:30 PM</span>
                    </div>
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
              {/* Document Item 3 */}
              <div className="p-6 hover:bg-gray-50 transition-colors duration-200 document-card relative">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Evidence Photo 1.jpg</h3>
                    <p className="text-sm text-gray-500 mt-1">Smith Divorce Case</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                       <User className="mr-2 h-4 w-4" />
                      <span>Uploaded by Michael Brown</span>
                      <span className="mx-2">•</span>
                       <Clock className="mr-2 h-4 w-4" />
                      <span>May 2, 2023, 11:15 AM</span>
                    </div>
                  </div>
                </div>
                <div className="document-actions absolute right-6 top-6 opacity-0 transition-opacity duration-200 flex space-x-2">
                  <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Edit, Trash2, Clock, Calendar, FileText, Users } from 'lucide-react';

const CaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [caseData, setCaseData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCase();
    }
  }, [id]);

  async function fetchCase() {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          client:clients(id, name, email, phone, company),
          assigned_to:profiles!cases_assigned_to_fkey(id, full_name, email),
          created_by:profiles!cases_created_by_fkey(id, full_name, email)
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      setCaseData(data);
    } catch (error) {
      console.error('Error fetching case:', error);
      setError('Failed to load case details');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-800"></div>
        <p className="mt-2 text-gray-500">Loading case details...</p>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-5">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error || 'Case not found'}</p>
            </div>
          </div>
        </div>
        <Link
          to="/cases"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Cases
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/cases"
          className="inline-flex items-center text-sm text-blue-800 hover:text-blue-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to cases
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Case Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Details and related information.
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Trash2 className="h-4 w-4 mr-1 text-red-600" />
              Delete
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{caseData.title}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Client</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <Link to={`/clients/${caseData.client.id}`} className="text-blue-800 hover:underline">
                  {caseData.client.name}
                </Link>
                {caseData.client.company && (
                  <span className="text-gray-500 ml-2">({caseData.client.company})</span>
                )}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${caseData.status === 'open' 
                    ? 'bg-green-100 text-green-800'
                    : caseData.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}
                </span>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Priority</dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${caseData.priority === 'high'
                    ? 'bg-red-100 text-red-800'
                    : caseData.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                  }`}>
                  {caseData.priority.charAt(0).toUpperCase() + caseData.priority.slice(1)}
                </span>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Case Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {caseData.case_type || <span className="text-gray-500">Not specified</span>}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {caseData.description || <span className="text-gray-500">No description provided</span>}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {caseData.assigned_to ? (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{caseData.assigned_to.full_name}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Not assigned</span>
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Due Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {caseData.due_date ? (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {new Date(caseData.due_date).toLocaleDateString()}
                  </div>
                ) : (
                  <span className="text-gray-500">No due date set</span>
                )}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created By</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  {caseData.created_by.full_name} on {new Date(caseData.created_at).toLocaleDateString()}
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Additional sections like Documents, Time Entries, etc. can be added here */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Documents section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Documents</h3>
              <p className="mt-1 text-sm text-gray-500">Case-related files and documents.</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FileText className="h-4 w-4 mr-1" />
              Upload
            </button>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
              No documents uploaded yet.
            </div>
          </div>
        </div>

        {/* Time Entries section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Time Entries</h3>
              <p className="mt-1 text-sm text-gray-500">Billable hours and activities.</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Clock className="h-4 w-4 mr-1" />
              Add Time
            </button>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
              No time entries recorded yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Search, UserPlus, Mail, Phone, MapPin, CreditCard, CalendarDays, FileText, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronLast, ChevronFirst, Filter, Eye, Bell, User } from 'lucide-react'; // Added Bell, MapPin, User
import ClientForm from '../../components/clients/ClientForm';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(5); // Matching the reference showing 5 clients

  // State for sorting (optional, based on reference structure)
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/login', { replace: true });
      return;
    }

    if (user) {
      fetchClients();
    }
  }, [user, authLoading, navigate]);

  // Effect to open modal if state is passed
  useEffect(() => {
    if (location.state?.openClientModal) {
      setShowAddModal(true);
      // Clear the state so the modal doesn't reopen on subsequent visits
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  async function fetchClients() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  }

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddClient = async (newClient: any) => {
    try {
      if (!user) {
        toast.error('Please sign in to add clients');
        navigate('/login');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        toast.error('Profile not found. Please try logging out and back in.');
        return;
      }

      // Get organization settings
      const { data: settings, error: settingsError } = await supabase
        .from('organization_settings')
        .select('organization_prefix')
        .eq('user_id', user.id)
        .single();      if (settingsError || !settings) {
        toast.error('Please set your organization prefix in Firm Settings before adding clients');
        navigate('/settings');
        return;
      }

      // Get next sequence number for this organization
      const { data: maxSeq } = await supabase
        .from('clients')
        .select('sequential_number')
        .eq('organization_prefix', settings.organization_prefix)
        .order('sequential_number', { ascending: false })
        .limit(1)
        .single();

      const nextSeq = (maxSeq?.sequential_number || 0) + 1;
      
      const clientData = {
        ...newClient,
        created_by: user.id,
        organization_prefix: settings.organization_prefix,
        sequential_number: nextSeq
      };

      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();
      
      if (error) {
        throw error;
      }

      setClients(prevClients => [...prevClients, data]);
      setShowAddModal(false);
      toast.success('Client added successfully');
    } catch (error: any) {
      console.error('Error adding client:', error);
      toast.error('Error adding client: ' + error.message);
    }
  };

  // Pagination logic
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Sorting logic (basic example)
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Use sortedClients for rendering if sorting is implemented, otherwise use currentClients for pagination
  const clientsToDisplay = sortColumn ? sortedClients.slice(indexOfFirstClient, indexOfLastClient) : currentClients;

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-800"></div>
        <p className="ml-2 text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header section - Matches reference */}
      <div className="mb-6 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Client Management</h1>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
           {/* Notification Bell - Matches reference */}
           <div className="relative">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </button>
          </div>
          {/* Create New Dropdown - Matches reference */}
          <div className="relative">
            <button
              // onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Assuming dropdown state is handled in Header component
              className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
            >
              <Plus className="h-5 w-5" />
              <span>Create New</span>
            </button>
             {/* Dropdown menu content would go here if needed locally */}
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Client
          </button>
        </div>
      </div>

      {/* Filters and Search - Matches reference */}
      <div className="mb-6 flex items-center space-x-4">
         {/* Filters button */}
         <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Filter className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
            Filters
         </button>
         {/* Search bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search clients..."
          />
        </div>
      </div>

      {/* Client list table - Matches reference structure and content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-800"></div>
          <p className="ml-2 text-gray-500">Loading clients...</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {clientsToDisplay.length === 0 ? (
            <div className="text-center py-10">
              <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new client.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add Client
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID / Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cases
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Active Cases
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientsToDisplay.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                             <User className="h-6 w-6" /> {/* Using User as placeholder for user icon */}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                            <div className="text-sm text-gray-500">{client.organization_prefix || 'LLF'}/{client.id}</div> {/* Assuming organization_prefix and id form the client ID */}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center"><Mail className="mr-2 h-4 w-4 text-gray-500" />{client.email}</div>
                        <div className="text-sm text-gray-500 flex items-center"><Phone className="mr-2 h-4 w-4 text-gray-500" />{client.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.total_cases || 0} {/* Assuming a total_cases field */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {client.active_cases || 0} {/* Assuming an active_cases field */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {client.last_activity ? new Date(client.last_activity).toLocaleDateString() : 'N/A'} {/* Assuming a last_activity field */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/clients/${client.id}`} className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end">
                          View <Eye className="ml-2 h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pagination - Matches reference */}
      {filteredClients.length > clientsPerPage && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-md shadow-sm">
          <div className="flex-1 flex justify-between sm:hidden">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Previous</button>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Next</button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstClient + 1}</span> to <span className="font-medium">{Math.min(indexOfLastClient, filteredClients.length)}</span> of <span className="font-medium">{filteredClients.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  <span className="sr-only">First</span>
                  <ChevronFirst className="h-5 w-5" aria-hidden="true" />
                </button>
                 <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {/* Page numbers - simplified */}
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    aria-current={currentPage === index + 1 ? 'page' : undefined}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === index + 1
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                 <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
                 <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  <span className="sr-only">Last</span>
                  <ChevronLast className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <ClientForm onClose={() => setShowAddModal(false)} onSubmit={handleAddClient} />
      )}
    </div>
  );
};

export default Clients;
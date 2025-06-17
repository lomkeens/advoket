import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { X, Loader2 } from 'lucide-react';
import { useFirm } from '../../context/FirmContext';

interface ClientFormProps {
  initialData?: {
    name: string;
    email: string;
    phone: string;
    notes: string;
    client_number?: string;
  };
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSubmit, onClose }) => {
  const { user } = useAuth();
  const { firmSettings } = useFirm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const organizationPrefix = firmSettings?.organization_prefix || '';

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    notes: initialData?.notes || '',
    client_number: initialData?.client_number || '',
    created_by: user?.id || null,
    organization_prefix: '',
  });

  // Update client number preview when organization prefix changes
  useEffect(() => {
    if (!initialData?.client_number && organizationPrefix) {
      // Fetch the next sequence number for preview
      (async () => {
        const { data: maxSeq } = await supabase
          .from('clients')
          .select('sequential_number')
          .eq('organization_prefix', organizationPrefix)
          .order('sequential_number', { ascending: false })
          .limit(1)
          .single();
        const nextSeq = (maxSeq?.sequential_number || 0) + 1;
        const paddedSequence = String(nextSeq).padStart(3, '0');
        setFormData(prev => ({
          ...prev,
          client_number: `${organizationPrefix}/${paddedSequence}`,
        }));
      })();
    }
  }, [initialData, organizationPrefix]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Client name is required');
      return false;
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      toast.error('Either email or phone number is required');
      return false;
    }
    if (!organizationPrefix) {
      toast.error('Organization prefix must be set in Firm Settings before creating clients');
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Modal will be closed by the parent component on success
    } catch (error) {
      console.error('Submission error:', error);
      // Error toast is handled in the parent component (Clients.tsx)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {initialData ? 'Edit Client' : 'Add New Client'}
          </h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body - Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {!organizationPrefix && (
            <div className="mb-4 text-red-600 text-sm">
              Please set your Organization Prefix in Firm Settings before adding clients.
            </div>
          )}
          {organizationPrefix && (
            <div className="mb-4">
              <label htmlFor="client_number" className="block text-sm font-medium text-gray-700">
                Client Number
              </label>
              <input
                type="text"
                name="client_number"
                id="client_number"
                value={formData.client_number}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm"
                readOnly
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          {/* Modal Footer - Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {initialData ? 'Save Changes' : 'Create Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
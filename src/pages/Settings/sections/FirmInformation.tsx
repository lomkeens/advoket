import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useFirm } from '../../../context/FirmContext';
import toast from 'react-hot-toast';

const FirmInformation = () => {
  const { firmSettings, loading, updateFirmSettings, uploadLogo } = useFirm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firm_name: '',
    city: '',
    phone: '',
    email: '',
    website: '',
    logo_url: '',
    organization_prefix: ''
  });

  useEffect(() => {
    if (firmSettings) {
      setFormData({
        firm_name: firmSettings.firm_name || '',
        city: firmSettings.city || '',
        phone: firmSettings.phone || '',
        email: firmSettings.email || '',
        website: firmSettings.website || '',
        logo_url: firmSettings.logo_url || '',
        organization_prefix: firmSettings.organization_prefix || ''
      });
    } else {
      // Reset form data if firmSettings becomes null (e.g., on logout or error)
      setFormData({
        firm_name: '',
        city: '',
        phone: '',
        email: '',
        website: '',
        logo_url: '',
        organization_prefix: ''
      });
    }
  }, [firmSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'organization_prefix') {
      // Convert to uppercase and limit to 5 characters
      setFormData(prev => ({ ...prev, [name]: value.toUpperCase().slice(0, 5) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!formData.firm_name.trim()) {
      toast.error('Firm name is required');
      return false;
    }
    
    if (formData.organization_prefix && formData.organization_prefix.length > 5) {
      toast.error('Organization prefix must be 5 characters or less');
      return false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (formData.website && !/^https?:\/\/.*/.test(formData.website)) {
      toast.error('Website URL must start with http:// or https://');
      return false;
    }

    return true;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo file size must be less than 5MB');
        return;
      }
      const publicUrl = await uploadLogo(file);
      setFormData(prev => ({ ...prev, logo_url: publicUrl }));
      toast.success('Logo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload logo');
      console.error('Error uploading logo:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await updateFirmSettings(formData);
      toast.success('Firm information saved successfully');
    } catch (error) {
      toast.error('Failed to save firm information');
      console.error('Error updating firm settings:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Firm Information</h2>
      {/* If no firmSettings, prompt user to create info instead of loading spinner or error */}
      {!firmSettings && (
        <p className="text-sm text-blue-600 mb-4">No firm information found. Please fill out the form below to create your firm profile.</p>
      )}

      {/* Logo Upload Section */}
      <div className="flex items-center space-x-6">
        {formData.logo_url && (
          <img
            src={formData.logo_url}
            alt="Firm Logo"
            className="h-24 w-24 object-cover rounded"
          />
        )}
        <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
          <Upload className="h-5 w-5 mr-2" />
          Upload Logo
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleLogoUpload}
          />
        </label>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firm_name" className="block text-sm font-medium text-gray-700">
            Firm Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firm_name"
            name="firm_name"
            required
            value={formData.firm_name}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="organization_prefix" className="block text-sm font-medium text-gray-700">
            Organization Prefix (max 5 characters)
          </label>
          <input
            type="text"
            id="organization_prefix"
            name="organization_prefix"
            value={formData.organization_prefix}
            onChange={handleChange}
            maxLength={5}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm uppercase"
            placeholder="e.g., ABC"
          />
          <p className="mt-1 text-xs text-gray-500">
            This prefix will be used for client and case numbering
          </p>
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
            Website
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default FirmInformation;

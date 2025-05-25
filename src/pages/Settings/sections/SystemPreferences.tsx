import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const SystemPreferences = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    timeZone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    weekStartsOn: 'Sunday',
    caseCategories: [
      'Civil',
      'Criminal',
      'Family',
      'Corporate'
    ],
    documentCategories: [
      'Pleadings',
      'Evidence',
      'Contracts',
      'Correspondence'
    ]
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryRemove = (type: 'case' | 'document', category: string) => {
    const field = type === 'case' ? 'caseCategories' : 'documentCategories';
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(c => c !== category)
    }));
  };

  const handleCategoryAdd = (type: 'case' | 'document', newCategory: string) => {
    if (!newCategory.trim()) return;

    const field = type === 'case' ? 'caseCategories' : 'documentCategories';
    if (formData[field].includes(newCategory)) {
      toast.error('Category already exists');
      return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], newCategory]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('system_preferences')
        .upsert([
          {
            user_id: user?.id,
            ...formData
          }
        ]);

      if (error) throw error;

      toast.success('System preferences updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error updating preferences');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900">System Preferences</h2>
      <p className="mt-1 text-sm text-gray-500">
        Configure default system settings and behavior
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700">
              Time Zone
            </label>
            <select
              name="timeZone"
              id="timeZone"
              value={formData.timeZone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
            </select>
          </div>

          <div>
            <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
              Date Format
            </label>
            <select
              name="dateFormat"
              id="dateFormat"
              value={formData.dateFormat}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700">
              Time Format
            </label>
            <select
              name="timeFormat"
              id="timeFormat"
              value={formData.timeFormat}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="12">12-hour</option>
              <option value="24">24-hour</option>
            </select>
          </div>

          <div>
            <label htmlFor="weekStartsOn" className="block text-sm font-medium text-gray-700">
              Week Starts On
            </label>
            <select
              name="weekStartsOn"
              id="weekStartsOn"
              value={formData.weekStartsOn}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900">Default Case Categories</h3>
          <div className="mt-2 space-y-2">
            {formData.caseCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{category}</span>
                <button
                  type="button"
                  onClick={() => handleCategoryRemove('case', category)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newCategory = window.prompt('Enter new case category:');
                if (newCategory) handleCategoryAdd('case', newCategory);
              }}
              className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-500"
            >
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900">Default Document Categories</h3>
          <div className="mt-2 space-y-2">
            {formData.documentCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{category}</span>
                <button
                  type="button"
                  onClick={() => handleCategoryRemove('document', category)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newCategory = window.prompt('Enter new document category:');
                if (newCategory) handleCategoryAdd('document', newCategory);
              }}
              className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-500"
            >
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemPreferences;

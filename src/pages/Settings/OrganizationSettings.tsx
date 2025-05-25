import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

const OrganizationSettings: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    organization_prefix: '',
  });

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  async function loadSettings() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organization_settings')
        .select('organization_prefix')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error: any) {
      toast.error('Error loading settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!settings.organization_prefix) {
      toast.error('Organization abbreviation is required');
      return;
    }

    if (settings.organization_prefix.length > 5) {
      toast.error('Organization abbreviation must be 5 characters or less');
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase
        .from('organization_settings')
        .upsert({
          user_id: user?.id,
          organization_prefix: settings.organization_prefix.toUpperCase(),
        });

      if (error) {
        throw error;
      }

      toast.success('Settings saved successfully');
    } catch (error: any) {
      toast.error('Error saving settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-800"></div>
        <p className="ml-2 text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Organization Settings</h2>
      
      <form onSubmit={saveSettings} className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <label htmlFor="organization_prefix" className="block text-sm font-medium text-gray-700 mb-1">
            Client Number Prefix <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="organization_prefix"
            name="organization_prefix"
            value={settings.organization_prefix}
            onChange={(e) => setSettings(prev => ({ ...prev, organization_prefix: e.target.value.toUpperCase() }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm uppercase"
            maxLength={5}
            placeholder="AAK"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            This abbreviation will be used in client numbering (e.g., AAK/001). Maximum 5 characters.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrganizationSettings;

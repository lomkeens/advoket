import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface FirmSettings {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  website: string;
  tax_id: string;
  logo_url: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

interface FirmContextType {
  firmSettings: FirmSettings | null;
  loading: boolean;
  error: string | null;
  updateFirmSettings: (settings: Partial<FirmSettings>) => Promise<void>;
  uploadLogo: (file: File) => Promise<string>;
}

const FirmContext = createContext<FirmContextType | undefined>(undefined);

export const FirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [firmSettings, setFirmSettings] = useState<FirmSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    console.log('FirmContext useEffect: user changed', user);
    if (user) {
      fetchFirmSettings();
      // Fallback: if loading takes more than 10 seconds, stop loading
      timeout = setTimeout(() => {
        if (loading) {
          setLoading(false);
          setError('Timeout loading firm settings. Please refresh or contact support.');
        }
      }, 10000);
    } else {
      setFirmSettings(null);
      setLoading(false);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [user]);

  const fetchFirmSettings = async () => {
    if (!user?.id) {
      console.log('No user ID available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching firm settings for organization_id:', user.id);

      const { data, error } = await supabase
        .from('firm_settings')
        .select('*')
        .eq('organization_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, create default settings
          const { data: newSettings, error: createError } = await supabase
            .from('firm_settings')
            .insert([{
              name: '',
              organization_id: user.id
            }])
            .select()
            .single();

          if (createError) throw createError;
          
          console.log('Created default firm settings:', newSettings);
          setFirmSettings(newSettings);
          return;
        }
        throw error;
      }

      console.log('Firm settings fetched successfully:', data);
      setFirmSettings(data);
    } catch (error: any) {
      console.error('Error in firm settings operation:', error);
      setError(error.message);
      toast.error('Failed to load firm settings');
    } finally {
      console.log('Firm settings operation finished. Loading:', false);
      setLoading(false);
    }
  };

  const updateFirmSettings = async (settings: Partial<FirmSettings>) => {
    try {
      setLoading(true);
      setError(null);

      if (!user) throw new Error('No authenticated user');

      if (!firmSettings?.id) {
        // Create new settings
        const { data, error } = await supabase
          .from('firm_settings')
          .insert([{
            ...settings,
            organization_id: user.id
          }])
          .select()
          .single();

        if (error) throw error;
        setFirmSettings(data);
        toast.success('Firm settings created successfully');
      } else {
        // Update existing settings
        const { data, error } = await supabase
          .from('firm_settings')
          .update(settings)
          .eq('id', firmSettings.id)
          .select()
          .single();

        if (error) throw error;
        setFirmSettings(data);
        toast.success('Firm settings updated successfully');
      }
    } catch (error: any) {
      console.error('Error updating firm settings:', error);
      setError(error.message);
      toast.error('Failed to update firm settings');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const uploadLogo = async (file: File): Promise<string> => {
    try {
      if (!user) throw new Error('No authenticated user');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  };

  const value = {
    firmSettings,
    loading,
    error,
    updateFirmSettings,
    uploadLogo
  };

  return <FirmContext.Provider value={value}>{children}</FirmContext.Provider>;
};

export const useFirm = () => {
  const context = useContext(FirmContext);
  if (context === undefined) {
    throw new Error('useFirm must be used within a FirmProvider');
  }
  return context;
};

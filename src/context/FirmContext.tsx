import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface FirmSettings {
  id: string;
  firm_name: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  logo_url: string;
  organization_id: string;
  organization_prefix: string;
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
  const [loading, setLoading] = useState(false); // Start with false to avoid blocking
  const [error, setError] = useState<string | null>(null);

  const fetchFirmSettings = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('firm_settings')
        .select('*')
        .eq('organization_id', user.id)
        .single();

      if (error) {
        // If no settings exist (PGRST116), that's okay - don't treat it as an error
        if (error.code === 'PGRST116') {
          setFirmSettings(null);
          setError(null);
          return;
        }
        throw error;
      }

      setFirmSettings(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching firm settings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFirmSettings();
    } else {
      setFirmSettings(null);
      setLoading(false);
      setError(null);
    }
  }, [user]);

  const updateFirmSettings = async (settings: Partial<FirmSettings>) => {
    try {
      setLoading(true);
      setError(null);

      if (!user) throw new Error('No authenticated user');

      if (!firmSettings?.id) {
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
    } catch (err: any) {
      console.error('FirmContext updateFirmSettings: Error:', err);
      setError(err.message);
      toast.error('Failed to update firm settings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadLogo = async (file: File): Promise<string> => {
    if (!user) throw new Error('No authenticated user');

    try {
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
    } catch (err: any) {
      console.error('Error uploading logo:', err);
      throw err;
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
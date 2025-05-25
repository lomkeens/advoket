import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Session } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  email: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  supabase: SupabaseClient;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  isAdmin: () => boolean;
  hasRole: (role: string) => boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Reset profile when signing out
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          return;
        }
        
        // Check and create profile if it doesn't exist
        if (session?.user) {
          const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();          if (fetchError || !profile) {
            console.log('Creating new profile for user:', session.user.id);
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([{
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.email?.split('@')[0] || null,
                role: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }]);
              
            if (profileError) {
              console.error('Error creating profile:', profileError);
              toast.error('Failed to create user profile');
            } else {
              // Fetch the newly created profile
              const { data: newProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (newProfile) {
                setProfile(newProfile);
              }
            }
          } else {
            // Set the existing profile
            setProfile(profile);
          }
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        toast.error(error.message);
      }
    } catch (error) {
      const message = 'An unexpected error occurred';
      setError(message);
      toast.error(message);
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        setError(error.message);
        toast.error(error.message);
      } else if (data.user) {
        toast.success('Account created successfully! Please check your email to confirm your account.');
      }
    } catch (error) {
      const message = 'An unexpected error occurred';
      setError(message);
      toast.error(message);
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        // Clear user and session state
        setUser(null);
        setSession(null);
        toast.success('Signed out successfully');
      }
    } catch (error) {
      const message = 'An unexpected error occurred';
      setError(message);
      toast.error(message);
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };
  // Helper function to fetch profile
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  };

  // Role-based access control helpers
  const isAdmin = () => {
    return profile?.role === 'admin';
  };

  const hasRole = (role: string) => {
    return profile?.role === role;
  };

  // Profile update function
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) {
        throw new Error('No user logged in');
      }

      // Don't allow updating sensitive fields
      const safeUpdates = {
        ...updates,
        id: undefined,
        email: undefined,
        role: undefined, // Only admins can update roles
        created_at: undefined,
      };

      const { error } = await supabase
        .from('profiles')
        .update({
          ...safeUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Fetch updated profile
      const updatedProfile = await fetchProfile(user.id);
      if (updatedProfile) {
        setProfile(updatedProfile);
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      const message = error.message || 'Failed to update profile';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    session,
    supabase,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAdmin,
    hasRole,
    loading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
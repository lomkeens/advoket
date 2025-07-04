import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Session } from '@supabase/supabase-js';

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
    console.log('[AuthContext] Current state:', { 
      user: user?.id, 
      loading, 
      error,
      profile: profile?.id 
    });
  }, [user, loading, error, profile]);

  useEffect(() => {
    let mounted = true;
    
    // Fallback: clear loading after 10 seconds no matter what
    const loadingTimeout = setTimeout(() => {
      if (mounted) {
        console.log('[AuthContext] Loading timeout reached, forcing loading to false');
        setLoading(false);
      }
    }, 10000);

    const init = async () => {
      try {
        console.log('[AuthContext] Initializing session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (!mounted) return;

        if (sessionError) {
          console.error('[AuthContext] Session error:', sessionError);
          throw sessionError;
        }

        if (session) {
          console.log('[AuthContext] Session found:', session.user.id);
          setSession(session);
          setUser(session.user);
          await fetchProfile(session.user);
        } else {
          console.log('[AuthContext] No session found');
          // If no session, explicitly set states to null to avoid loading state
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (error: any) {
        if (!mounted) return;
        console.error('[AuthContext] Session init error:', error);
        setError(error.message);
        // Clear any partial state on error
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        if (mounted) {
          console.log('[AuthContext] Initialization complete, setting loading to false');
          setLoading(false);
        }
      }
    };

    // Start initialization
    init();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] Auth state change:', event, session?.user?.id);

      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setProfile(null);
      }
    });

    // Cleanup subscription and prevent state updates after unmount
    return () => {
      mounted = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array since we want this to run once on mount

  const fetchProfile = async (user: User) => {
    try {
      console.log('[AuthContext] Fetching profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Handle the case where no profile exists (PGRST116 error)
      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found - this is expected for new users
          console.log('[AuthContext] No profile found for user, setting profile to null');
          setProfile(null);
          return;
        }
        console.error('[AuthContext] Profile fetch error:', error);
        throw error;
      }
      
      console.log('[AuthContext] Profile fetched successfully:', data.id);
      setProfile(data);
    } catch (error: any) {
      console.error('[AuthContext] Profile fetch error:', error);
      setError(error.message);
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      console.log('[AuthContext] Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      if (error) {
        console.error('[AuthContext] Sign in error from Supabase:', error);
        setError(error.message || 'Failed to sign in');
        throw error;
      }
      if (!data.user || !data.session) {
        const msg = 'No user or session data returned from Supabase';
        console.error('[AuthContext]', msg);
        setError(msg);
        throw new Error(msg);
      }
      // The rest of the state (user, profile, etc) will be handled by onAuthStateChange
      console.log('[AuthContext] Sign in successful');
    } catch (err) {
      console.error('[AuthContext] Sign in error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      setUser(null);
      setSession(null);
      setProfile(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('[AuthContext] Attempting sign up for:', email);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error('[AuthContext] Sign up error:', error);
        setError(error.message);
      } else {
        console.log('[AuthContext] Sign up successful');
      }
    } catch (error) {
      console.error('[AuthContext] Sign up error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[AuthContext] Attempting sign out');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[AuthContext] Sign out error:', error);
        throw error;
      }
      // Proactively clear state (onAuthStateChange will also handle this)
      setUser(null);
      setSession(null);
      setProfile(null);
      console.log('[AuthContext] Sign out successful, state cleared');
    } catch (error: any) {
      console.error('[AuthContext] Sign out error:', error);
      setError(error.message || 'An unexpected error occurred during sign out');
      // Even on error, we should clear the state to prevent issues
      setUser(null);
      setSession(null);
      setProfile(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => {
    return profile?.role === 'admin';
  };

  const hasRole = (role: string) => {
    return profile?.role === role;
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setError(null);
      if (!user?.id) {
        throw new Error('No user logged in');
      }
      const safeUpdates = {
        ...updates,
        id: undefined,
        email: undefined,
        role: undefined,
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
      await fetchProfile(user); // just update profile
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
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

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
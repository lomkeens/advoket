import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface DashboardStats {
  total_cases: number;
  active_cases: number;
  total_documents: number;
  upcoming_hearings: number;
  cases_change: number;
  active_cases_change: number;
  documents_change: number;
  hearings_change: number;
  cases_last_month: number;
  active_cases_last_month: number;
  documents_last_month: number;
  hearings_last_week: number;
}

export interface RecentCase {
  id: string;
  title: string;
  status: string;
  priority: string;
  case_type: string;
  client_name: string;
  client_id: string;
  assigned_to_name: string;
  created_at: string;
  due_date: string;
}

export interface UpcomingHearing {
  id: string;
  title: string;
  description: string;
  start_date: string;
  location: string;
  case_title: string;
  case_id: string;
  client_name: string;
}

export interface RecentDocument {
  id: string;
  name: string;
  description: string;
  file_type: string;
  size: number;
  uploaded_at: string;
  case_title: string;
  case_id: string;
  client_name: string;
  uploaded_by_name: string;
}

export const useDashboardStats = () => {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCases, setRecentCases] = useState<RecentCase[]>([]);
  const [upcomingHearings, setUpcomingHearings] = useState<UpcomingHearing[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<RecentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[useDashboardStats] Effect triggered:', { 
      authLoading, 
      user: user?.id, 
      userEmail: user?.email 
    });

    // Don't start loading if auth is still loading
    if (authLoading) {
      console.log('[useDashboardStats] Auth still loading, waiting...');
      return;
    }

    // If no user after auth loading is complete, stop loading
    if (!user) {
      console.log('[useDashboardStats] No user found after auth loading complete');
      setLoading(false);
      setError('Please log in to view dashboard');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        console.log('[useDashboardStats] Starting dashboard data fetch for user:', user.id);
        setLoading(true);
        setError(null);

        // First, ensure user has a profile
        console.log('[useDashboardStats] Checking user profile...');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          // Create profile if it doesn't exist
          console.log('[useDashboardStats] Creating profile for user...');
          const { error: createError } = await supabase
            .from('profiles')
            .insert([{
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              role: 'attorney'
            }]);

          if (createError) {
            console.error('[useDashboardStats] Failed to create profile:', createError);
            throw new Error(`Failed to create profile: ${createError.message}`);
          }
          console.log('[useDashboardStats] Profile created successfully');
        } else if (profileError) {
          console.error('[useDashboardStats] Profile error:', profileError);
          throw profileError;
        } else {
          console.log('[useDashboardStats] Profile found:', profile);
        }

        // Try to fetch dashboard statistics with fallback
        console.log('[useDashboardStats] Fetching dashboard stats...');
        let statsData = null;
        try {
          const { data, error: statsError } = await supabase
            .rpc('get_dashboard_stats', { user_id: user.id });

          if (statsError) {
            console.warn('[useDashboardStats] Dashboard stats function failed:', statsError);
            // Fallback to manual queries
            statsData = await getFallbackStats(user.id);
          } else {
            console.log('[useDashboardStats] Dashboard stats retrieved:', data);
            statsData = data;
          }
        } catch (funcError) {
          console.warn('[useDashboardStats] Dashboard function not available:', funcError);
          statsData = await getFallbackStats(user.id);
        }

        setStats(statsData);

        // Fetch recent cases with fallback
        console.log('[useDashboardStats] Fetching recent cases...');
        let casesData = [];
        try {
          const { data, error: casesError } = await supabase
            .rpc('get_recent_cases', { user_id: user.id, limit_count: 5 });

          if (casesError) {
            console.warn('[useDashboardStats] Recent cases function failed:', casesError);
            casesData = await getFallbackRecentCases(user.id);
          } else {
            console.log('[useDashboardStats] Recent cases retrieved:', data);
            casesData = data || [];
          }
        } catch (funcError) {
          console.warn('[useDashboardStats] Recent cases function not available:', funcError);
          casesData = await getFallbackRecentCases(user.id);
        }

        setRecentCases(casesData);

        // Fetch upcoming hearings with fallback
        console.log('[useDashboardStats] Fetching upcoming hearings...');
        let hearingsData = [];
        try {
          const { data, error: hearingsError } = await supabase
            .rpc('get_upcoming_hearings', { user_id: user.id, limit_count: 5 });

          if (hearingsError) {
            console.warn('[useDashboardStats] Upcoming hearings function failed:', hearingsError);
            hearingsData = await getFallbackUpcomingHearings(user.id);
          } else {
            console.log('[useDashboardStats] Upcoming hearings retrieved:', data);
            hearingsData = data || [];
          }
        } catch (funcError) {
          console.warn('[useDashboardStats] Upcoming hearings function not available:', funcError);
          hearingsData = await getFallbackUpcomingHearings(user.id);
        }

        setUpcomingHearings(hearingsData);

        // Fetch recent documents with fallback
        console.log('[useDashboardStats] Fetching recent documents...');
        let documentsData = [];
        try {
          const { data, error: documentsError } = await supabase
            .rpc('get_recent_documents', { user_id: user.id, limit_count: 5 });

          if (documentsError) {
            console.warn('[useDashboardStats] Recent documents function failed:', documentsError);
            documentsData = await getFallbackRecentDocuments(user.id);
          } else {
            console.log('[useDashboardStats] Recent documents retrieved:', data);
            documentsData = data || [];
          }
        } catch (funcError) {
          console.warn('[useDashboardStats] Recent documents function not available:', funcError);
          documentsData = await getFallbackRecentDocuments(user.id);
        }

        setRecentDocuments(documentsData);

        console.log('[useDashboardStats] Dashboard data fetch completed successfully');

      } catch (err: any) {
        console.error('[useDashboardStats] Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, authLoading]);

  // Fallback functions for when database functions aren't available
  const getFallbackStats = async (userId: string): Promise<DashboardStats> => {
    console.log('[useDashboardStats] Using fallback stats for user:', userId);
    try {
      // Get basic counts
      const { count: totalCases } = await supabase
        .from('cases')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', userId);

      const { count: activeCases } = await supabase
        .from('cases')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', userId)
        .eq('status', 'open');

      const { count: totalDocuments } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('uploaded_by', userId);

      const { count: upcomingHearings } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', userId)
        .eq('event_type', 'hearing')
        .gte('start_date', new Date().toISOString());

      console.log('[useDashboardStats] Fallback stats calculated:', {
        totalCases,
        activeCases,
        totalDocuments,
        upcomingHearings
      });

      return {
        total_cases: totalCases || 0,
        active_cases: activeCases || 0,
        total_documents: totalDocuments || 0,
        upcoming_hearings: upcomingHearings || 0,
        cases_change: 0,
        active_cases_change: 0,
        documents_change: 0,
        hearings_change: 0,
        cases_last_month: 0,
        active_cases_last_month: 0,
        documents_last_month: 0,
        hearings_last_week: 0
      };
    } catch (error) {
      console.error('[useDashboardStats] Fallback stats failed:', error);
      return {
        total_cases: 0,
        active_cases: 0,
        total_documents: 0,
        upcoming_hearings: 0,
        cases_change: 0,
        active_cases_change: 0,
        documents_change: 0,
        hearings_change: 0,
        cases_last_month: 0,
        active_cases_last_month: 0,
        documents_last_month: 0,
        hearings_last_week: 0
      };
    }
  };

  const getFallbackRecentCases = async (userId: string): Promise<RecentCase[]> => {
    console.log('[useDashboardStats] Using fallback recent cases for user:', userId);
    try {
      const { data, error } = await supabase
        .from('cases')
        .select(`
          id,
          title,
          status,
          priority,
          case_type,
          created_at,
          due_date,
          client:clients(id, name),
          assigned_to:profiles!cases_assigned_to_fkey(full_name)
        `)
        .eq('created_by', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('[useDashboardStats] Fallback recent cases error:', error);
        throw error;
      }

      console.log('[useDashboardStats] Fallback recent cases retrieved:', data);

      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        status: item.status,
        priority: item.priority,
        case_type: item.case_type,
        client_name: item.client?.name || 'Unknown Client',
        client_id: item.client?.id || '',
        assigned_to_name: item.assigned_to?.full_name || '',
        created_at: item.created_at,
        due_date: item.due_date
      }));
    } catch (error) {
      console.error('[useDashboardStats] Fallback recent cases failed:', error);
      return [];
    }
  };

  const getFallbackUpcomingHearings = async (userId: string): Promise<UpcomingHearing[]> => {
    console.log('[useDashboardStats] Using fallback upcoming hearings for user:', userId);
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          title,
          description,
          start_date,
          location,
          case:cases(id, title, client:clients(name))
        `)
        .eq('created_by', userId)
        .eq('event_type', 'hearing')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(5);

      if (error) {
        console.error('[useDashboardStats] Fallback upcoming hearings error:', error);
        throw error;
      }

      console.log('[useDashboardStats] Fallback upcoming hearings retrieved:', data);

      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        start_date: item.start_date,
        location: item.location,
        case_title: item.case?.title || '',
        case_id: item.case?.id || '',
        client_name: item.case?.client?.name || ''
      }));
    } catch (error) {
      console.error('[useDashboardStats] Fallback upcoming hearings failed:', error);
      return [];
    }
  };

  const getFallbackRecentDocuments = async (userId: string): Promise<RecentDocument[]> => {
    console.log('[useDashboardStats] Using fallback recent documents for user:', userId);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          id,
          name,
          description,
          file_type,
          size,
          uploaded_at,
          case:cases(id, title, client:clients(name)),
          uploaded_by:profiles!documents_uploaded_by_fkey(full_name)
        `)
        .eq('uploaded_by', userId)
        .order('uploaded_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('[useDashboardStats] Fallback recent documents error:', error);
        throw error;
      }

      console.log('[useDashboardStats] Fallback recent documents retrieved:', data);

      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        file_type: item.file_type,
        size: item.size,
        uploaded_at: item.uploaded_at,
        case_title: item.case?.title || '',
        case_id: item.case?.id || '',
        client_name: item.case?.client?.name || '',
        uploaded_by_name: item.uploaded_by?.full_name || 'Unknown'
      }));
    } catch (error) {
      console.error('[useDashboardStats] Fallback recent documents failed:', error);
      return [];
    }
  };

  const refreshStats = async () => {
    if (!user) return;

    try {
      setError(null);
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_dashboard_stats', { user_id: user.id });

      if (statsError) {
        const fallbackStats = await getFallbackStats(user.id);
        setStats(fallbackStats);
      } else {
        setStats(statsData);
      }
    } catch (err: any) {
      console.error('[useDashboardStats] Error refreshing stats:', err);
      setError(err.message || 'Failed to refresh statistics');
    }
  };

  return {
    stats,
    recentCases,
    upcomingHearings,
    recentDocuments,
    loading,
    error,
    refreshStats
  };
};
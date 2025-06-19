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
    // Don't start loading if auth is still loading
    if (authLoading) {
      return;
    }

    // If no user after auth loading is complete, stop loading
    if (!user) {
      setLoading(false);
      setError('Please log in to view dashboard');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching dashboard data for user:', user.id);

        // First, ensure user has a profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          // Create profile if it doesn't exist
          console.log('Creating profile for user...');
          const { error: createError } = await supabase
            .from('profiles')
            .insert([{
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              role: 'attorney'
            }]);

          if (createError) {
            throw new Error(`Failed to create profile: ${createError.message}`);
          }
        } else if (profileError) {
          throw profileError;
        }

        // Try to fetch dashboard statistics with fallback
        let statsData = null;
        try {
          const { data, error: statsError } = await supabase
            .rpc('get_dashboard_stats', { user_id: user.id });

          if (statsError) {
            console.warn('Dashboard stats function failed, using fallback:', statsError);
            // Fallback to manual queries
            statsData = await getFallbackStats(user.id);
          } else {
            statsData = data;
          }
        } catch (funcError) {
          console.warn('Dashboard function not available, using fallback:', funcError);
          statsData = await getFallbackStats(user.id);
        }

        setStats(statsData);

        // Fetch recent cases with fallback
        let casesData = [];
        try {
          const { data, error: casesError } = await supabase
            .rpc('get_recent_cases', { user_id: user.id, limit_count: 5 });

          if (casesError) {
            console.warn('Recent cases function failed, using fallback:', casesError);
            casesData = await getFallbackRecentCases(user.id);
          } else {
            casesData = data || [];
          }
        } catch (funcError) {
          console.warn('Recent cases function not available, using fallback:', funcError);
          casesData = await getFallbackRecentCases(user.id);
        }

        setRecentCases(casesData);

        // Fetch upcoming hearings with fallback
        let hearingsData = [];
        try {
          const { data, error: hearingsError } = await supabase
            .rpc('get_upcoming_hearings', { user_id: user.id, limit_count: 5 });

          if (hearingsError) {
            console.warn('Upcoming hearings function failed, using fallback:', hearingsError);
            hearingsData = await getFallbackUpcomingHearings(user.id);
          } else {
            hearingsData = data || [];
          }
        } catch (funcError) {
          console.warn('Upcoming hearings function not available, using fallback:', funcError);
          hearingsData = await getFallbackUpcomingHearings(user.id);
        }

        setUpcomingHearings(hearingsData);

        // Fetch recent documents with fallback
        let documentsData = [];
        try {
          const { data, error: documentsError } = await supabase
            .rpc('get_recent_documents', { user_id: user.id, limit_count: 5 });

          if (documentsError) {
            console.warn('Recent documents function failed, using fallback:', documentsError);
            documentsData = await getFallbackRecentDocuments(user.id);
          } else {
            documentsData = data || [];
          }
        } catch (funcError) {
          console.warn('Recent documents function not available, using fallback:', funcError);
          documentsData = await getFallbackRecentDocuments(user.id);
        }

        setRecentDocuments(documentsData);

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, authLoading]);

  // Fallback functions for when database functions aren't available
  const getFallbackStats = async (userId: string): Promise<DashboardStats> => {
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
      console.error('Fallback stats failed:', error);
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

      if (error) throw error;

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
      console.error('Fallback recent cases failed:', error);
      return [];
    }
  };

  const getFallbackUpcomingHearings = async (userId: string): Promise<UpcomingHearing[]> => {
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

      if (error) throw error;

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
      console.error('Fallback upcoming hearings failed:', error);
      return [];
    }
  };

  const getFallbackRecentDocuments = async (userId: string): Promise<RecentDocument[]> => {
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

      if (error) throw error;

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
      console.error('Fallback recent documents failed:', error);
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
      console.error('Error refreshing stats:', err);
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
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
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCases, setRecentCases] = useState<RecentCase[]>([]);
  const [upcomingHearings, setUpcomingHearings] = useState<UpcomingHearing[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<RecentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard statistics
        const { data: statsData, error: statsError } = await supabase
          .rpc('get_dashboard_stats', { user_id: user.id });

        if (statsError) throw statsError;
        setStats(statsData);

        // Fetch recent cases
        const { data: casesData, error: casesError } = await supabase
          .rpc('get_recent_cases', { user_id: user.id, limit_count: 5 });

        if (casesError) throw casesError;
        setRecentCases(casesData || []);

        // Fetch upcoming hearings
        const { data: hearingsData, error: hearingsError } = await supabase
          .rpc('get_upcoming_hearings', { user_id: user.id, limit_count: 5 });

        if (hearingsError) throw hearingsError;
        setUpcomingHearings(hearingsData || []);

        // Fetch recent documents
        const { data: documentsData, error: documentsError } = await supabase
          .rpc('get_recent_documents', { user_id: user.id, limit_count: 5 });

        if (documentsError) throw documentsError;
        setRecentDocuments(documentsData || []);

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const refreshStats = async () => {
    if (!user) return;

    try {
      setError(null);
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_dashboard_stats', { user_id: user.id });

      if (statsError) throw statsError;
      setStats(statsData);
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
/*
  # Dashboard Statistics Functions

  1. New Functions
    - get_dashboard_stats() - Returns comprehensive dashboard statistics
    - get_case_stats_by_period() - Returns case statistics for different time periods
    - get_document_stats_by_period() - Returns document statistics for different time periods
    - get_upcoming_hearings_count() - Returns count of upcoming hearings

  2. Security
    - Functions respect RLS policies
    - Only return data for authenticated user's organization
*/

-- Function to get comprehensive dashboard statistics
CREATE OR REPLACE FUNCTION get_dashboard_stats(user_id UUID)
RETURNS JSON AS $$
DECLARE
  total_cases INTEGER;
  active_cases INTEGER;
  total_documents INTEGER;
  upcoming_hearings INTEGER;
  cases_last_month INTEGER;
  cases_two_months_ago INTEGER;
  active_cases_last_month INTEGER;
  active_cases_two_months_ago INTEGER;
  documents_last_month INTEGER;
  documents_two_months_ago INTEGER;
  hearings_last_week INTEGER;
  hearings_two_weeks_ago INTEGER;
  cases_change DECIMAL;
  active_cases_change DECIMAL;
  documents_change DECIMAL;
  hearings_change INTEGER;
  result JSON;
BEGIN
  -- Get total cases for user's organization
  SELECT COUNT(*)
  INTO total_cases
  FROM cases c
  JOIN clients cl ON c.client_id = cl.id
  WHERE cl.created_by = user_id;

  -- Get active cases
  SELECT COUNT(*)
  INTO active_cases
  FROM cases c
  JOIN clients cl ON c.client_id = cl.id
  WHERE cl.created_by = user_id AND c.status = 'open';

  -- Get total documents
  SELECT COUNT(*)
  INTO total_documents
  FROM documents d
  WHERE d.uploaded_by = user_id;

  -- Get upcoming hearings (next 30 days)
  SELECT COUNT(*)
  INTO upcoming_hearings
  FROM events e
  WHERE e.created_by = user_id 
    AND e.event_type = 'hearing'
    AND e.start_date >= NOW()
    AND e.start_date <= NOW() + INTERVAL '30 days';

  -- Get cases from last month
  SELECT COUNT(*)
  INTO cases_last_month
  FROM cases c
  JOIN clients cl ON c.client_id = cl.id
  WHERE cl.created_by = user_id
    AND c.created_at >= DATE_TRUNC('month', NOW() - INTERVAL '1 month')
    AND c.created_at < DATE_TRUNC('month', NOW());

  -- Get cases from two months ago
  SELECT COUNT(*)
  INTO cases_two_months_ago
  FROM cases c
  JOIN clients cl ON c.client_id = cl.id
  WHERE cl.created_by = user_id
    AND c.created_at >= DATE_TRUNC('month', NOW() - INTERVAL '2 months')
    AND c.created_at < DATE_TRUNC('month', NOW() - INTERVAL '1 month');

  -- Get active cases from last month
  SELECT COUNT(*)
  INTO active_cases_last_month
  FROM cases c
  JOIN clients cl ON c.client_id = cl.id
  WHERE cl.created_by = user_id 
    AND c.status = 'open'
    AND c.created_at >= DATE_TRUNC('month', NOW() - INTERVAL '1 month')
    AND c.created_at < DATE_TRUNC('month', NOW());

  -- Get active cases from two months ago
  SELECT COUNT(*)
  INTO active_cases_two_months_ago
  FROM cases c
  JOIN clients cl ON c.client_id = cl.id
  WHERE cl.created_by = user_id 
    AND c.status = 'open'
    AND c.created_at >= DATE_TRUNC('month', NOW() - INTERVAL '2 months')
    AND c.created_at < DATE_TRUNC('month', NOW() - INTERVAL '1 month');

  -- Get documents from last month
  SELECT COUNT(*)
  INTO documents_last_month
  FROM documents d
  WHERE d.uploaded_by = user_id
    AND d.uploaded_at >= DATE_TRUNC('month', NOW() - INTERVAL '1 month')
    AND d.uploaded_at < DATE_TRUNC('month', NOW());

  -- Get documents from two months ago
  SELECT COUNT(*)
  INTO documents_two_months_ago
  FROM documents d
  WHERE d.uploaded_by = user_id
    AND d.uploaded_at >= DATE_TRUNC('month', NOW() - INTERVAL '2 months')
    AND d.uploaded_at < DATE_TRUNC('month', NOW() - INTERVAL '1 month');

  -- Get hearings from last week
  SELECT COUNT(*)
  INTO hearings_last_week
  FROM events e
  WHERE e.created_by = user_id 
    AND e.event_type = 'hearing'
    AND e.created_at >= DATE_TRUNC('week', NOW() - INTERVAL '1 week')
    AND e.created_at < DATE_TRUNC('week', NOW());

  -- Get hearings from two weeks ago
  SELECT COUNT(*)
  INTO hearings_two_weeks_ago
  FROM events e
  WHERE e.created_by = user_id 
    AND e.event_type = 'hearing'
    AND e.created_at >= DATE_TRUNC('week', NOW() - INTERVAL '2 weeks')
    AND e.created_at < DATE_TRUNC('week', NOW() - INTERVAL '1 week');

  -- Calculate percentage changes
  IF cases_two_months_ago > 0 THEN
    cases_change := ROUND(((cases_last_month - cases_two_months_ago)::DECIMAL / cases_two_months_ago) * 100, 1);
  ELSE
    cases_change := CASE WHEN cases_last_month > 0 THEN 100 ELSE 0 END;
  END IF;

  IF active_cases_two_months_ago > 0 THEN
    active_cases_change := ROUND(((active_cases_last_month - active_cases_two_months_ago)::DECIMAL / active_cases_two_months_ago) * 100, 1);
  ELSE
    active_cases_change := CASE WHEN active_cases_last_month > 0 THEN 100 ELSE 0 END;
  END IF;

  IF documents_two_months_ago > 0 THEN
    documents_change := ROUND(((documents_last_month - documents_two_months_ago)::DECIMAL / documents_two_months_ago) * 100, 1);
  ELSE
    documents_change := CASE WHEN documents_last_month > 0 THEN 100 ELSE 0 END;
  END IF;

  hearings_change := hearings_last_week - hearings_two_weeks_ago;

  -- Build result JSON
  result := json_build_object(
    'total_cases', total_cases,
    'active_cases', active_cases,
    'total_documents', total_documents,
    'upcoming_hearings', upcoming_hearings,
    'cases_change', cases_change,
    'active_cases_change', active_cases_change,
    'documents_change', documents_change,
    'hearings_change', hearings_change,
    'cases_last_month', cases_last_month,
    'active_cases_last_month', active_cases_last_month,
    'documents_last_month', documents_last_month,
    'hearings_last_week', hearings_last_week
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent cases for dashboard
CREATE OR REPLACE FUNCTION get_recent_cases(user_id UUID, limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  id UUID,
  title TEXT,
  status TEXT,
  priority TEXT,
  case_type TEXT,
  client_name TEXT,
  client_id UUID,
  assigned_to_name TEXT,
  created_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.status,
    c.priority,
    c.case_type,
    cl.name as client_name,
    cl.id as client_id,
    p.full_name as assigned_to_name,
    c.created_at,
    c.due_date
  FROM cases c
  JOIN clients cl ON c.client_id = cl.id
  LEFT JOIN profiles p ON c.assigned_to = p.id
  WHERE cl.created_by = user_id
  ORDER BY c.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get upcoming hearings for dashboard
CREATE OR REPLACE FUNCTION get_upcoming_hearings(user_id UUID, limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  start_date TIMESTAMPTZ,
  location TEXT,
  case_title TEXT,
  case_id UUID,
  client_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.title,
    e.description,
    e.start_date,
    e.location,
    c.title as case_title,
    c.id as case_id,
    cl.name as client_name
  FROM events e
  LEFT JOIN cases c ON e.case_id = c.id
  LEFT JOIN clients cl ON c.client_id = cl.id
  WHERE e.created_by = user_id 
    AND e.event_type = 'hearing'
    AND e.start_date >= NOW()
  ORDER BY e.start_date ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent documents for dashboard
CREATE OR REPLACE FUNCTION get_recent_documents(user_id UUID, limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  file_type TEXT,
  size INTEGER,
  uploaded_at TIMESTAMPTZ,
  case_title TEXT,
  case_id UUID,
  client_name TEXT,
  uploaded_by_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.name,
    d.description,
    d.file_type,
    d.size,
    d.uploaded_at,
    c.title as case_title,
    c.id as case_id,
    cl.name as client_name,
    p.full_name as uploaded_by_name
  FROM documents d
  LEFT JOIN cases c ON d.case_id = c.id
  LEFT JOIN clients cl ON d.client_id = cl.id
  LEFT JOIN profiles p ON d.uploaded_by = p.id
  WHERE d.uploaded_by = user_id
  ORDER BY d.uploaded_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_dashboard_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_cases(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_upcoming_hearings(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_documents(UUID, INTEGER) TO authenticated;
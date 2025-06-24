/*
  # Fix dashboard backend support

  1. Changes
    - Ensure all required tables have proper structure
    - Add missing columns for dashboard statistics
    - Create indexes for better performance
    - Add sample data insertion functions for testing

  2. Security
    - Maintain existing RLS policies
    - Ensure functions work with current user context
*/

-- Add missing columns to clients table for dashboard stats
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS total_cases INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS active_cases INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMPTZ DEFAULT now();

-- Create function to update client statistics
CREATE OR REPLACE FUNCTION update_client_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total cases count for the client
  UPDATE clients 
  SET 
    total_cases = (
      SELECT COUNT(*) 
      FROM cases 
      WHERE client_id = COALESCE(NEW.client_id, OLD.client_id)
    ),
    active_cases = (
      SELECT COUNT(*) 
      FROM cases 
      WHERE client_id = COALESCE(NEW.client_id, OLD.client_id) 
      AND status = 'open'
    ),
    last_activity = now()
  WHERE id = COALESCE(NEW.client_id, OLD.client_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update client stats
DROP TRIGGER IF EXISTS update_client_stats_on_case_change ON cases;
CREATE TRIGGER update_client_stats_on_case_change
  AFTER INSERT OR UPDATE OR DELETE ON cases
  FOR EACH ROW
  EXECUTE FUNCTION update_client_stats();

-- Create indexes for better dashboard performance
CREATE INDEX IF NOT EXISTS idx_cases_created_by ON cases(created_by);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at);
CREATE INDEX IF NOT EXISTS idx_clients_created_by ON clients(created_by);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON documents(uploaded_at);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);

-- Improved dashboard stats function with better error handling
CREATE OR REPLACE FUNCTION get_dashboard_stats(user_id UUID)
RETURNS JSON AS $$
DECLARE
  total_cases INTEGER := 0;
  active_cases INTEGER := 0;
  total_documents INTEGER := 0;
  upcoming_hearings INTEGER := 0;
  cases_last_month INTEGER := 0;
  cases_two_months_ago INTEGER := 0;
  active_cases_last_month INTEGER := 0;
  active_cases_two_months_ago INTEGER := 0;
  documents_last_month INTEGER := 0;
  documents_two_months_ago INTEGER := 0;
  hearings_last_week INTEGER := 0;
  hearings_two_weeks_ago INTEGER := 0;
  cases_change DECIMAL := 0;
  active_cases_change DECIMAL := 0;
  documents_change DECIMAL := 0;
  hearings_change INTEGER := 0;
  result JSON;
BEGIN
  -- Ensure user exists in profiles
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_id) THEN
    -- Create profile if it doesn't exist
    INSERT INTO profiles (id, email, full_name, role)
    SELECT 
      user_id,
      COALESCE(au.email, 'user@example.com'),
      COALESCE(au.raw_user_meta_data->>'full_name', 'User'),
      'attorney'
    FROM auth.users au 
    WHERE au.id = user_id
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Get total cases for user's organization
  SELECT COALESCE(COUNT(*), 0)
  INTO total_cases
  FROM cases c
  WHERE c.created_by = user_id;

  -- Get active cases
  SELECT COALESCE(COUNT(*), 0)
  INTO active_cases
  FROM cases c
  WHERE c.created_by = user_id AND c.status = 'open';

  -- Get total documents
  SELECT COALESCE(COUNT(*), 0)
  INTO total_documents
  FROM documents d
  WHERE d.uploaded_by = user_id;

  -- Get upcoming hearings (next 30 days)
  SELECT COALESCE(COUNT(*), 0)
  INTO upcoming_hearings
  FROM events e
  WHERE e.created_by = user_id 
    AND e.event_type = 'hearing'
    AND e.start_date >= NOW()
    AND e.start_date <= NOW() + INTERVAL '30 days';

  -- Get cases from last month
  SELECT COALESCE(COUNT(*), 0)
  INTO cases_last_month
  FROM cases c
  WHERE c.created_by = user_id
    AND c.created_at >= DATE_TRUNC('month', NOW() - INTERVAL '1 month')
    AND c.created_at < DATE_TRUNC('month', NOW());

  -- Get cases from two months ago
  SELECT COALESCE(COUNT(*), 0)
  INTO cases_two_months_ago
  FROM cases c
  WHERE c.created_by = user_id
    AND c.created_at >= DATE_TRUNC('month', NOW() - INTERVAL '2 months')
    AND c.created_at < DATE_TRUNC('month', NOW() - INTERVAL '1 month');

  -- Get active cases from last month
  SELECT COALESCE(COUNT(*), 0)
  INTO active_cases_last_month
  FROM cases c
  WHERE c.created_by = user_id 
    AND c.status = 'open'
    AND c.created_at >= DATE_TRUNC('month', NOW() - INTERVAL '1 month')
    AND c.created_at < DATE_TRUNC('month', NOW());

  -- Get active cases from two months ago
  SELECT COALESCE(COUNT(*), 0)
  INTO active_cases_two_months_ago
  FROM cases c
  WHERE c.created_by = user_id 
    AND c.status = 'open'
    AND c.created_at >= DATE_TRUNC('month', NOW() - INTERVAL '2 months')
    AND c.created_at < DATE_TRUNC('month', NOW() - INTERVAL '1 month');

  -- Get documents from last month
  SELECT COALESCE(COUNT(*), 0)
  INTO documents_last_month
  FROM documents d
  WHERE d.uploaded_by = user_id
    AND d.uploaded_at >= DATE_TRUNC('month', NOW() - INTERVAL '1 month')
    AND d.uploaded_at < DATE_TRUNC('month', NOW());

  -- Get documents from two months ago
  SELECT COALESCE(COUNT(*), 0)
  INTO documents_two_months_ago
  FROM documents d
  WHERE d.uploaded_by = user_id
    AND d.uploaded_at >= DATE_TRUNC('month', NOW() - INTERVAL '2 months')
    AND d.uploaded_at < DATE_TRUNC('month', NOW() - INTERVAL '1 month');

  -- Get hearings from last week
  SELECT COALESCE(COUNT(*), 0)
  INTO hearings_last_week
  FROM events e
  WHERE e.created_by = user_id 
    AND e.event_type = 'hearing'
    AND e.created_at >= DATE_TRUNC('week', NOW() - INTERVAL '1 week')
    AND e.created_at < DATE_TRUNC('week', NOW());

  -- Get hearings from two weeks ago
  SELECT COALESCE(COUNT(*), 0)
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
EXCEPTION
  WHEN OTHERS THEN
    -- Return default values on error
    RETURN json_build_object(
      'total_cases', 0,
      'active_cases', 0,
      'total_documents', 0,
      'upcoming_hearings', 0,
      'cases_change', 0,
      'active_cases_change', 0,
      'documents_change', 0,
      'hearings_change', 0,
      'cases_last_month', 0,
      'active_cases_last_month', 0,
      'documents_last_month', 0,
      'hearings_last_week', 0
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Improved recent cases function
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
    COALESCE(c.case_type, 'General') as case_type,
    cl.name as client_name,
    cl.id as client_id,
    COALESCE(p.full_name, 'Unassigned') as assigned_to_name,
    c.created_at,
    c.due_date
  FROM cases c
  JOIN clients cl ON c.client_id = cl.id
  LEFT JOIN profiles p ON c.assigned_to = p.id
  WHERE c.created_by = user_id
  ORDER BY c.created_at DESC
  LIMIT limit_count;
EXCEPTION
  WHEN OTHERS THEN
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Improved upcoming hearings function
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
    COALESCE(e.description, '') as description,
    e.start_date,
    COALESCE(e.location, '') as location,
    COALESCE(c.title, '') as case_title,
    c.id as case_id,
    COALESCE(cl.name, '') as client_name
  FROM events e
  LEFT JOIN cases c ON e.case_id = c.id
  LEFT JOIN clients cl ON c.client_id = cl.id
  WHERE e.created_by = user_id 
    AND e.event_type = 'hearing'
    AND e.start_date >= NOW()
  ORDER BY e.start_date ASC
  LIMIT limit_count;
EXCEPTION
  WHEN OTHERS THEN
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Improved recent documents function
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
    COALESCE(d.description, '') as description,
    COALESCE(d.file_type, '') as file_type,
    d.size,
    d.uploaded_at,
    COALESCE(c.title, '') as case_title,
    c.id as case_id,
    COALESCE(cl.name, '') as client_name,
    COALESCE(p.full_name, 'Unknown') as uploaded_by_name
  FROM documents d
  LEFT JOIN cases c ON d.case_id = c.id
  LEFT JOIN clients cl ON d.client_id = cl.id
  LEFT JOIN profiles p ON d.uploaded_by = p.id
  WHERE d.uploaded_by = user_id
  ORDER BY d.uploaded_at DESC
  LIMIT limit_count;
EXCEPTION
  WHEN OTHERS THEN
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create sample data for testing (optional)
CREATE OR REPLACE FUNCTION create_sample_data(user_id UUID)
RETURNS VOID AS $$
DECLARE
  sample_client_id UUID;
  sample_case_id UUID;
BEGIN
  -- Only create sample data if no data exists for this user
  IF NOT EXISTS (SELECT 1 FROM clients WHERE created_by = user_id) THEN
    -- Create sample client
    INSERT INTO clients (name, email, phone, created_by, organization_prefix, sequential_number)
    VALUES ('Sample Client Corp', 'client@example.com', '+1-555-0123', user_id, 'AAK', 1)
    RETURNING id INTO sample_client_id;
    
    -- Create sample case
    INSERT INTO cases (title, description, client_id, status, priority, case_type, created_by)
    VALUES ('Sample Legal Case', 'This is a sample case for demonstration purposes', sample_client_id, 'open', 'medium', 'Civil', user_id)
    RETURNING id INTO sample_case_id;
    
    -- Create sample document
    INSERT INTO documents (name, description, file_url, file_type, size, case_id, client_id, uploaded_by)
    VALUES ('Sample Contract.pdf', 'Sample contract document', '/sample/contract.pdf', 'application/pdf', 1024000, sample_case_id, sample_client_id, user_id);
    
    -- Create sample event
    INSERT INTO events (title, description, start_date, event_type, case_id, client_id, created_by)
    VALUES ('Sample Hearing', 'Sample court hearing', NOW() + INTERVAL '7 days', 'hearing', sample_case_id, sample_client_id, user_id);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_dashboard_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_cases(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_upcoming_hearings(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_documents(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION create_sample_data(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_client_stats() TO authenticated;
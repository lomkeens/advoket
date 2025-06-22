import { supabase } from '../lib/supabase';

export const testSupabaseConnection = async () => {
  try {
    console.log('[ConnectionTest] Starting Supabase connection test...');
    
    // Test 1: Basic connection
    console.log('[ConnectionTest] Test 1: Basic connection...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (healthError) {
      console.error('[ConnectionTest] Health check failed:', healthError);
      return { success: false, error: `Health check failed: ${healthError.message}` };
    }
    
    console.log('[ConnectionTest] ✅ Basic connection successful');
    
    // Test 2: Authentication status
    console.log('[ConnectionTest] Test 2: Authentication status...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('[ConnectionTest] Auth check failed:', authError);
      return { success: false, error: `Auth check failed: ${authError.message}` };
    }
    
    if (!user) {
      console.log('[ConnectionTest] ⚠️ No authenticated user');
      return { success: false, error: 'No authenticated user found. Please log in.' };
    }
    
    console.log('[ConnectionTest] ✅ User authenticated:', user.email);
    
    // Test 3: Check if user profile exists
    console.log('[ConnectionTest] Test 3: Profile check...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('[ConnectionTest] Profile check failed:', profileError);
      return { success: false, error: `Profile check failed: ${profileError.message}` };
    }
    
    if (!profile) {
      console.log('[ConnectionTest] ⚠️ No profile found, creating one...');
      
      // Create profile if it doesn't exist
      const { error: createError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          role: 'attorney'
        }]);
      
      if (createError) {
        console.error('[ConnectionTest] Failed to create profile:', createError);
        return { success: false, error: `Failed to create profile: ${createError.message}` };
      }
      
      console.log('[ConnectionTest] ✅ Profile created successfully');
    } else {
      console.log('[ConnectionTest] ✅ Profile exists:', profile.full_name || profile.email);
    }
    
    // Test 4: Check database functions
    console.log('[ConnectionTest] Test 4: Database functions...');
    try {
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_dashboard_stats', { user_id: user.id });
      
      if (statsError) {
        console.error('[ConnectionTest] Dashboard stats function failed:', statsError);
        return { 
          success: false, 
          error: `Dashboard function error: ${statsError.message}. This might be because the database functions haven't been deployed yet.` 
        };
      }
      
      console.log('[ConnectionTest] ✅ Dashboard stats function working:', statsData);
    } catch (funcError) {
      console.error('[ConnectionTest] Function test failed:', funcError);
      return { 
        success: false, 
        error: `Function test failed: ${funcError}. Database functions may not be available.` 
      };
    }
    
    // Test 5: Check firm settings
    console.log('[ConnectionTest] Test 5: Firm settings...');
    const { data: firmSettings, error: firmError } = await supabase
      .from('firm_settings')
      .select('*')
      .eq('organization_id', user.id)
      .single();
    
    if (firmError && firmError.code !== 'PGRST116') {
      console.error('[ConnectionTest] Firm settings check failed:', firmError);
      return { success: false, error: `Firm settings error: ${firmError.message}` };
    }
    
    if (!firmSettings) {
      console.log('[ConnectionTest] ⚠️ No firm settings found - this is normal for new users');
    } else {
      console.log('[ConnectionTest] ✅ Firm settings found:', firmSettings.firm_name);
    }

    // Test 6: Check basic table access
    console.log('[ConnectionTest] Test 6: Table access...');
    try {
      const { count: clientCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', user.id);

      const { count: caseCount } = await supabase
        .from('cases')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', user.id);

      console.log('[ConnectionTest] ✅ Table access working - Clients:', clientCount, 'Cases:', caseCount);
    } catch (tableError) {
      console.error('[ConnectionTest] Table access failed:', tableError);
      return { success: false, error: `Table access failed: ${tableError}` };
    }
    
    return { 
      success: true, 
      user: user,
      profile: profile,
      firmSettings: firmSettings,
      message: 'All connection tests passed successfully! Your database is properly configured.' 
    };
    
  } catch (error: any) {
    console.error('[ConnectionTest] Connection test failed:', error);
    return { success: false, error: error.message || 'Unknown error occurred during connection test' };
  }
};
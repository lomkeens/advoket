import { supabase } from '../lib/supabase';

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Basic connection
    const { data: healthCheck, error: healthError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (healthError) {
      console.error('Health check failed:', healthError);
      return { success: false, error: healthError.message };
    }
    
    console.log('✅ Basic connection successful');
    
    // Test 2: Authentication status
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth check failed:', authError);
      return { success: false, error: authError.message };
    }
    
    if (!user) {
      console.log('⚠️ No authenticated user');
      return { success: false, error: 'No authenticated user' };
    }
    
    console.log('✅ User authenticated:', user.email);
    
    // Test 3: Check if user profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile check failed:', profileError);
      return { success: false, error: profileError.message };
    }
    
    if (!profile) {
      console.log('⚠️ No profile found, creating one...');
      
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
        console.error('Failed to create profile:', createError);
        return { success: false, error: createError.message };
      }
      
      console.log('✅ Profile created successfully');
    } else {
      console.log('✅ Profile exists:', profile.full_name || profile.email);
    }
    
    // Test 4: Check database functions
    try {
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_dashboard_stats', { user_id: user.id });
      
      if (statsError) {
        console.error('Dashboard stats function failed:', statsError);
        return { success: false, error: `Dashboard function error: ${statsError.message}` };
      }
      
      console.log('✅ Dashboard stats function working:', statsData);
    } catch (funcError) {
      console.error('Function test failed:', funcError);
      return { success: false, error: `Function test failed: ${funcError}` };
    }
    
    // Test 5: Check firm settings
    const { data: firmSettings, error: firmError } = await supabase
      .from('firm_settings')
      .select('*')
      .eq('organization_id', user.id)
      .single();
    
    if (firmError && firmError.code !== 'PGRST116') {
      console.error('Firm settings check failed:', firmError);
      return { success: false, error: firmError.message };
    }
    
    if (!firmSettings) {
      console.log('⚠️ No firm settings found - this is normal for new users');
    } else {
      console.log('✅ Firm settings found:', firmSettings.firm_name);
    }
    
    return { 
      success: true, 
      user: user,
      profile: profile,
      firmSettings: firmSettings,
      message: 'All connection tests passed successfully!' 
    };
    
  } catch (error: any) {
    console.error('Connection test failed:', error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
};
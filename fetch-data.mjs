import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vzizefrkiwewfibmenxg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6aXplZnJraXdld2ZpYm1lbnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDc3NDQsImV4cCI6MjA4Nzc4Mzc0NH0.8bcnwNN1H0hK4P-_VNdHJlzY36Xu_07ou-9xyPUhTIQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    const { data: reportData, error: reportError } = await supabase.from('Report 1').select('*').limit(5);
    console.log('Report Data:', JSON.stringify(reportData, null, 2));
    console.log('Report Error:', reportError);
}
check();

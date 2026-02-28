import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vzizefrkiwewfibmenxg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6aXplZnJraXdld2ZpYm1lbnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDc3NDQsImV4cCI6MjA4Nzc4Mzc0NH0.8bcnwNN1H0hK4P-_VNdHJlzY36Xu_07ou-9xyPUhTIQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    const { data: binsData, error: binsError } = await supabase.from('Bin Data').insert([
        {
            latitude: 9.9252,
            longitude: 78.1198,
            fill_level: 'Low',
            area: 'Test Area'
        }
    ]).select();

    console.log('Inserted Data:', JSON.stringify(binsData, null, 2));
    console.log('Insert Error:', binsError);
}
check();

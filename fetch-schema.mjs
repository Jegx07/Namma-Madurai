import fs from 'fs';

async function fetchSchema() {
    const url = "https://vzizefrkiwewfibmenxg.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6aXplZnJraXdld2ZpYm1lbnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDc3NDQsImV4cCI6MjA4Nzc4Mzc0NH0.8bcnwNN1H0hK4P-_VNdHJlzY36Xu_07ou-9xyPUhTIQ";
    const response = await fetch(url);
    const data = await response.json();
    const tables = Object.keys(data.definitions || {});
    console.log("Tables:", tables);
}
fetchSchema();

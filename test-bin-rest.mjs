const url = "https://vzizefrkiwewfibmenxg.supabase.co/rest/v1/Bin%20Data?select=*";
const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6aXplZnJraXdld2ZpYm1lbnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDc3NDQsImV4cCI6MjA4Nzc4Mzc0NH0.8bcnwNN1H0hK4P-_VNdHJlzY36Xu_07ou-9xyPUhTIQ";

async function run() {
    const res = await fetch(url, {
        headers: {
            apikey,
            Authorization: `Bearer ${apikey}`
        }
    });
    const data = await res.text();
    console.log("Status:", res.status);
    console.log("Data:", data);
}
run();

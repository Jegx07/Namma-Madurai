import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, ArrowRight, SlidersHorizontal, ArrowUpRight, ArrowDownRight, Users, Bell, Search, Activity, FileText, TrendingUp, CheckCircle, MapPin, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const binIcon = new L.Icon({
  iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Report {
  id: string;
  user_id: string;
  user_name: string;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string | null;
  status: string;
  created_at: string;
}

interface Bin {
  id: string;
  latitude: number;
  longitude: number;
  fill_level: string;
  area: string;
  last_collected: string | null;
  created_at: string;
}

interface UserScore {
  id: string;
  user_id: string;
  user_name: string;
  email: string;
  score: number;
  reports_submitted: number;
}
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";

// Data generation
const reportingTrendsData = [
  { name: 'Jan', value: 20 }, { name: 'Feb', value: 35 }, { name: 'Mar', value: 30 },
  { name: 'Apr', value: 45 }, { name: 'May', value: 40 }, { name: 'Jun', value: 65 },
  { name: 'Jul', value: 60 }, { name: 'Aug', value: 80 },
];

const miniBarData = Array.from({ length: 15 }).map(() => ({ value: Math.random() * 100 }));

const areaReportTrends = Array.from({ length: 60 }).map((_, i) => {
  const type = i < 35 ? 'Resolved' : i < 48 ? 'Progress' : 'Pending';
  const value = type === 'Resolved' ? Math.random() * 30 + 70
    : type === 'Progress' ? Math.random() * 30 + 40
      : Math.random() * 30 + 10;
  return { name: `Day ${i + 1}`, value, type };
});

const gaugeData = [
  { name: 'Completed', value: 51, fill: '#10b981' },
  { name: 'Remaining', value: 49, fill: '#f3f4f6' }
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const CustomMiniTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-gray-800 text-xs px-2 py-1 rounded shadow-lg border border-gray-100 font-medium">
        {Math.round(payload[0].value)} units
      </div>
    );
  }
  return null;
};

  const [reports, setReports] = useState<Report[]>([]);
  const [bins, setBins] = useState<Bin[]>([]);
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's reports
        const { data: reportsData, error: reportsError } = await supabase
          .from('Report 1')
          .select('*')
          .eq('user_id', user?.id || '')
          .order('created_at', { ascending: false });

        if (reportsError) {
          console.error("Error fetching 'Report 1':", reportsError);
          throw reportsError;
        }
        console.log("Fetched 'Report 1' Data:", reportsData);
        setReports(reportsData?.map(r => ({
          ...r,
          latitude: parseFloat(r.latitude as unknown as string) || 0,
          longitude: parseFloat(r.longitude as unknown as string) || 0
        })) || []);

        // Fetch bins
        const { data: binsData, error: binsError } = await supabase
          .from('Bin Data')
          .select('*');

        if (binsError) {
          console.error("Error fetching 'Bin Data':", binsError);
        } else if (binsData) {
          console.log("Fetched 'Bin Data':", binsData);
          setBins(binsData.map(b => ({
            ...b,
            id: b.Bin_ID || b.id,
            latitude: parseFloat(b.latitude as unknown as string) || 0,
            longitude: parseFloat(b.longitude as unknown as string) || 0
          })));
        }

        // Fetch user's score
        const { data: scoreData, error: scoreError } = await supabase
          .from('User Dashboard')
          .select('*')
          .eq('user_id', user?.id || '')
          .single();

        if (scoreError) {
          console.error("Error fetching 'User Dashboard' score:", scoreError);
        } else if (scoreData) {
          console.log("Fetched 'User Dashboard' Score Data:", scoreData);
          setUserScore(scoreData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    } else {
      setLoading(false);
    }

    // Real-time subscription for reports
    const channel = supabase
      .channel('user-dashboard-reports')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Report 1' }, () => {
        if (user?.id) fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'User Dashboard' }, () => {
        if (user?.id) fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Calculate stats from live data
  const myReportsCount = reports.length;
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;
  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const cleanScore = userScore?.score || 0;

  // Transform reports to recent activity format
  const recentActivity = reports.slice(0, 3).map(report => ({
    id: report.id,
    type: report.type,
    title: `${report.type.charAt(0).toUpperCase() + report.type.slice(1)} reported`,
    location: report.address || `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`,
    status: report.status
  }));

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-800 p-6 lg:p-8 font-sans flex flex-col gap-6">

      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-light tracking-widest text-gray-900 uppercase">Dashboard</h1>
            <div className="hidden md:flex items-center gap-1.5 opacity-50">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* Stat 1 */}
            <div className="flex items-center gap-3">
              <div className="text-3xl font-medium text-gray-900 leading-none">{loading ? <Loader2 className="h-6 w-6 animate-spin text-emerald-500" /> : myReportsCount}</div>
              <div className="flex flex-col">
                <div className="h-4 w-16 mb-0.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={miniBarData}>
                      <Bar dataKey="value" fill="#10b981" radius={[1, 1, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Total Reports</span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3">
              <div className="text-3xl font-medium text-gray-900 leading-none">{loading ? <Loader2 className="h-6 w-6 animate-spin text-amber-500" /> : resolvedCount}</div>
              <div className="flex flex-col">
                <div className="h-4 w-16 mb-0.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={miniBarData}>
                      <Bar dataKey="value" fill="#f59e0b" radius={[1, 1, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Resolved</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3">
              <div className="text-3xl font-medium text-gray-900 leading-none">{loading ? <Loader2 className="h-6 w-6 animate-spin text-orange-500" /> : pendingCount}</div>
              <div className="flex flex-col">
                <div className="h-4 w-16 mb-0.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={miniBarData}>
                      <Bar dataKey="value" fill="#ea580c" radius={[1, 1, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">In Progress</span>
              </div>
            </div>
          </div>
        </div>

        <Button variant="outline" className="rounded-full bg-transparent border-gray-300 text-gray-700 hover:bg-white px-6 font-medium tracking-wide">
          <Search className="w-4 h-4 mr-2" />
          Analytics
        </Button>
      </div>

      {/* Main Grid: 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column (Span 3) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Card 1: Clean Score Gauge */}
          <Card className="rounded-[20px] border-none shadow-sm bg-white overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">Active Score</span>
              </div>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                <div className="w-24 h-24 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gaugeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={44}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={4}
                      >
                        {gaugeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-gray-500 font-medium uppercase mt-2">Score</span>
                    <span className="text-lg font-bold text-gray-900 leading-none">{loading ? <Loader2 className="h-4 w-4 animate-spin text-gray-400" /> : `${cleanScore}%`}</span>
                  </div>
                </div>
              </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Reporting Trends */}
          <Card className="rounded-[20px] border-none shadow-sm bg-white flex-1 flex flex-col font-sans">
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Reporting Trends</h3>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </div>

              <div className="space-y-4 mb-8">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-[#63F148]" />
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="text-center py-4 text-[#7f8a9e] text-sm">
                    No reports yet. Start by reporting an issue!
                  </div>
                ) : (
                  recentActivity.map((item) => (
                    <div key={item.id} className="flex flex-col gap-1 border-b border-white/5 pb-3">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-white truncate max-w-[180px]">{item.title}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${item.status === 'resolved' ? 'bg-[#63F148]/20 text-[#63F148]' : 'bg-[#FF9900]/20 text-[#FF9900]'}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#7f8a9e] flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {item.location}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Custom Bar Chart Graphic matches image spacing */}
              <div className="mt-auto">
                <div className="flex h-[80px] items-end justify-between border-l border-b border-white/10 pb-2 pl-3 pr-2 relative">
                  {/* Y-axis labels */}
                  <div className="absolute -left-7 bottom-2 flex flex-col justify-between h-full text-[9px] text-[#7f8a9e] py-0">
                    <span>30</span>
                    <span>15</span>
                    <span>0</span>
                  </div>
                </div>
                <div className="absolute right-0 bottom-1">
                  <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-transparent border-t-emerald-500"></div>
                </div>
              </div>

        {/* Middle Column: Interactive Bin Map */}
        <div className="lg:col-span-5 relative group">
          <Card className="bg-[#1b1f27] border-white/5 rounded-[1.5rem] shadow-xl h-full overflow-hidden relative min-h-[400px]">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#181c25]">
                <Loader2 className="h-8 w-8 animate-spin text-white/50" />
              </div>
            ) : (
              <MapContainer
                center={[9.9252, 78.1198]} // Madurai coordinates
                zoom={13}
                className="h-full w-full absolute inset-0 z-10"
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Dark theme tile layer to match UI
                />

                {bins.map((bin) => (
                  <Marker
                    key={bin.id}
                    position={[bin.latitude, bin.longitude]}
                    icon={binIcon}
                  >
                    <Popup className="custom-popup">
                      <div className="font-sans">
                        <h4 className="font-semibold text-sm mb-1">{bin.area}</h4>
                        <div className="text-xs space-y-1 text-slate-600">
                          <p><span className="font-medium">Fill Level:</span> {bin.fill_level}</p>
                          <p><span className="font-medium">Lat / Lng:</span> {bin.latitude.toFixed(4)}, {bin.longitude.toFixed(4)}</p>
                          {bin.last_collected && (
                            <p><span className="font-medium">Last Collected:</span> {new Date(bin.last_collected).toLocaleDateString()}</p>
                          )}
                          {bin.created_at && (
                            <p><span className="font-medium">Added:</span> {new Date(bin.created_at).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}

            {/* Bottom right labels (overlay on top of map) */}
            <div className="absolute bottom-6 right-6 z-20 flex gap-6 text-left bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div>
                <p className="text-[10px] text-[#7f8a9e] mb-1">Total Reports</p>
                <p className="text-xl font-light text-white">4.2K</p>
              </div>
              <div>
                <p className="text-[10px] text-[#7f8a9e] mb-1">Active Users</p>
                <p className="text-xl font-light text-white">1,400</p>
              </div>
              <div>
                <p className="text-[10px] text-[#7f8a9e] mb-1">Resolved</p>
                <p className="text-xl font-light text-white">3.1K</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Column (Span 6) - 3D Wireframe / Map area */}
        <Card className="lg:col-span-6 rounded-[20px] border-none shadow-sm bg-white overflow-hidden relative min-h-[460px]">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>

          {/* Map Overlay Graphic (Abstract Representation) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none z-0">
            <div className="w-4/5 h-4/5 border border-emerald-100/50 rounded-3xl relative" style={{ perspective: '1000px', transformStyle: 'preserve-3d', transform: 'rotateX(50deg) rotateZ(-20deg) scale(1.1)' }}>
              {/* Grid planes to simulate 3D */}
              <div className="absolute inset-0 border border-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.1)] rounded-3xl overflow-hidden" style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              <div className="absolute inset-4 border border-emerald-300/40 rounded-2xl bg-white/20 backdrop-blur-sm" style={{ transform: 'translateZ(40px)' }}></div>
              <div className="absolute inset-12 border border-emerald-400/50 rounded-xl bg-emerald-50/30 backdrop-blur-md" style={{ transform: 'translateZ(80px)' }}></div>

              {/* 3D Pillars/Data points */}
              <div className="absolute top-[20%] left-[30%] w-6 h-24 bg-gradient-to-t from-emerald-500/20 to-emerald-400/80 border-t border-l border-emerald-300 shadow-xl" style={{ transform: 'translateZ(48px)', transformOrigin: 'bottom' }}></div>
              <div className="absolute top-[50%] left-[60%] w-8 h-32 bg-gradient-to-t from-emerald-600/20 to-emerald-500/90 border-t border-l border-emerald-200" style={{ transform: 'translateZ(64px)', transformOrigin: 'bottom' }}></div>
              <div className="absolute top-[70%] left-[40%] w-5 h-16 bg-gradient-to-t from-amber-500/20 to-amber-400/80 border-t border-l border-amber-300" style={{ transform: 'translateZ(32px)', transformOrigin: 'bottom' }}></div>
            </div>
          </div>

          <CardContent className="p-8 relative z-20 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start w-full">
              <Button variant="outline" className="bg-white/80 backdrop-blur shadow-sm border-gray-100 rounded-lg text-xs font-semibold h-8 text-gray-600">
                <MapPin className="w-3 h-3 mr-1.5" /> 742 Anna Nagar, Madurai <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </div>

            <div className="w-full flex justify-between items-end">
              <div className="flex gap-8">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Reports Tracked</p>
                  <p className="text-xl font-bold text-gray-900">2.5K</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Clean Score</p>
                  <p className="text-xl font-bold text-gray-900 leading-none flex items-center gap-1.5">
                    88.4 <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">↑</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Daily Value</p>
                  <p className="text-xl font-bold text-gray-900 leading-none">1.2K</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column (Span 3) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Card 4: AI Assistant (Themed Green) */}
          <Card className="rounded-[20px] border-none shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)] bg-gradient-to-br from-[#064e3b] via-[#0f766e] to-[#042f2e] text-white flex-1 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at top right, #34d399, transparent 60%)' }}></div>
            <CardContent className="p-6 relative z-10 flex flex-col h-full justify-between">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20">
                <Mic className="w-4 h-4 text-emerald-100" />
              </div>

              <div className="mb-4">
                <h3 className="text-[11px] font-bold text-emerald-200/80 uppercase tracking-widest leading-relaxed mb-4">
                  I'm here <span className="text-white">To make managing your reports easier.</span> <br />
                  How can I <span className="text-white">Assist you</span> today?
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/10 hover:bg-white/20 cursor-pointer backdrop-blur-sm border border-white/10 rounded-lg p-2.5 flex items-center gap-2 transition-colors">
                    <Zap className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="text-[10px] font-medium text-emerald-50">Risk Analysis</span>
                  </div>
                  <div className="bg-white/10 hover:bg-white/20 cursor-pointer backdrop-blur-sm border border-white/10 rounded-lg p-2.5 flex items-center gap-2 transition-colors">
                    <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="text-[10px] font-medium text-emerald-50">Area Tracking</span>
                  </div>
                  <div className="bg-white/10 hover:bg-white/20 cursor-pointer backdrop-blur-sm border border-white/10 rounded-lg p-2.5 flex items-center gap-2 transition-colors">
                    <div className="w-3.5 h-3.5 rounded bg-emerald-300/30 border border-emerald-300/50 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-emerald-300 rounded-sm"></div></div>
                    <span className="text-[10px] font-medium text-emerald-50">Report Status</span>
                  </div>
                  <div className="bg-white/10 hover:bg-white/20 cursor-pointer backdrop-blur-sm border border-white/10 rounded-lg p-2.5 flex items-center gap-2 transition-colors">
                    <ArrowUp className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="text-[10px] font-medium text-emerald-50">Market Trends</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Input
                  placeholder="Message AI Assistant"
                  className="bg-white/10 border-white/20 text-white placeholder:text-emerald-100/50 h-10 rounded-xl pr-10 text-xs focus-visible:ring-emerald-400/50"
                  style={{ backdropFilter: 'blur(8px)' }}
                />
                <button className="absolute right-1 top-1 w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <ArrowUp className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Card 5: Community Forum */}
          <Card className="rounded-[20px] border-none shadow-[0_10px_30px_-10px_rgba(20,83,45,0.3)] bg-gradient-to-br from-[#064e3b] via-[#14532d] to-[#022c22] text-white flex-1 relative overflow-hidden">
            <CardContent className="p-6 relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-[11px] font-bold text-emerald-100/90 uppercase tracking-widest mb-1">Community Forum</h3>
                <p className="text-[9px] text-emerald-300/60 font-medium tracking-wide">Updated 09/27/26 at 11:00 AM</p>

                <div className="flex items-center gap-1 mt-4">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full border border-white/20 bg-emerald-800 flex items-center justify-center text-[8px]">U1</div>
                    <div className="w-6 h-6 rounded-full border border-white/20 bg-teal-800 flex items-center justify-center text-[8px]">U2</div>
                    <div className="w-6 h-6 rounded-full border border-white/20 bg-cyan-800 flex items-center justify-center text-[8px]">U3</div>
                  </div>
                  <div className="bg-white/20 text-[9px] font-bold px-1.5 py-0.5 rounded ml-1">+2K</div>
                </div>
              </div>

              <div className="flex items-end justify-between mt-6">
                <p className="text-xs font-semibold text-white uppercase tracking-wider leading-relaxed">
                  Connect with<br /><span className="text-emerald-300">Experts on</span><br />Civic Duty and<br />City Insights!
                </p>
                <div className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-emerald-100" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Bottom Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">

        {/* Card 6: Conditional Liabilities -> Issue Breakdown */}
        <Card className="lg:col-span-4 rounded-[20px] border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6 h-[220px] flex flex-col relative">
            <div className="flex justify-between items-start w-full relative z-10">
              <div>
                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Issue Status Breakdowns</h3>
                <p className="text-[10px] font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">Active</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </div>

            <div className="flex-1 mt-6 flex relative">
              <div className="absolute left-0 top-2 flex flex-col gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Resolved</p>
                  <p className="text-xl font-bold text-gray-900 leading-none">18<span className="text-xs font-bold text-gray-400">/37</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending</p>
                  <p className="text-xl font-bold text-gray-900 leading-none">19<span className="text-xs font-bold text-gray-400">/37</span></p>
                </div>
              </div>

              <div className="absolute right-0 bottom-0 w-[140px] h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: 51, fill: '#10b981' }, { value: 49, fill: '#f59e0b' }]}
                      cx="100%"
                      cy="100%"
                      startAngle={180}
                      endAngle={90}
                      innerRadius={110}
                      outerRadius={118}
                      dataKey="value"
                      stroke="none"
                      isAnimationActive={false}
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Dots on the arc */}
                <div className="absolute -left-1 bottom-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-[3px] border-white shadow-sm"></div>
                <div className="absolute right-[54px] top-[14px] w-2.5 h-2.5 rounded-full bg-[#f59e0b] border-[3px] border-white shadow-sm"></div>

                <div className="absolute top-[40%] left-[30%] bg-[#a3e635] text-[#166534] font-bold text-[10px] px-1.5 py-0.5 rounded shadow-sm">51%</div>
                <div className="absolute top-[65%] left-[20%] font-bold text-gray-900 text-xs shadow-sm bg-white/80 rounded px-1">18<span className="text-[10px] text-gray-400">/37</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 7: Mortgage Rate Trends -> Area Reporting Trends */}
        <Card className="lg:col-span-8 rounded-[20px] border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6 h-[220px] flex flex-col">
            <div className="flex justify-between items-start w-full">
              <div>
                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Area Report Trends</h3>
                <p className="text-[10px] font-medium text-gray-400">This month</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </div>

            <div className="flex-1 mt-4 flex">
              <div className="w-24 flex flex-col gap-6 justify-center bg-white z-10 relative">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Average</p>
                  <p className="text-2xl font-bold text-gray-900 leading-none">44</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Highest</p>
                  <p className="text-lg font-bold text-gray-900 leading-none">10</p>
                </div>
              </div>

              <div className="flex-1 h-full flex flex-col pl-4 border-l border-gray-100">
                <div className="flex justify-between w-full px-2 mb-2">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Resolved</p>
                    <p className="text-sm font-bold text-gray-900 leading-none">63%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">In Progress</p>
                    <p className="text-sm font-bold text-gray-900 leading-none">19%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending</p>
                    <p className="text-sm font-bold text-gray-900 leading-none">18%</p>
                  </div>
                </div>

                <div className="flex-1 w-full mx-2 -mb-2 mt-2 border-l border-b border-gray-100 relative pt-2">
                  <div className="absolute right-0 bottom-[-16px] text-[8px] text-gray-400 font-bold">100</div>
                  <div className="absolute left-[-4px] bottom-[-16px] text-[8px] text-gray-400 font-bold">0</div>
                  <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={areaReportTrends} barCategoryGap="20%">
                      <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                        {areaReportTrends.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={
                            entry.type === 'Resolved' ? '#9ca3af' :
                              entry.type === 'Progress' ? '#10b981' :
                                entry.type === 'Pending' ? '#f59e0b' : '#fcd34d'
                          } />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default UserDashboard;

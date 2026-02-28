import fs from 'fs';
import path from 'path';

const file = 'src/pages/user/UserDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Chunk 1: Imports
content = content.replace(
    /<<<<<<< HEAD\r?\nimport { Mic, ArrowRight[\s\S]*?reports_submitted: number;\r?\n}\r?\n=======\r?\n([\s\S]*?)>>>>>>> [a-f0-9]+/,
    `import { Mic, ArrowRight, SlidersHorizontal, ArrowUpRight, ArrowDownRight, Users, Bell, Search, Activity, FileText, TrendingUp, CheckCircle, MapPin, Clock, Loader2, ArrowUp, Zap } from "lucide-react";
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
$1`
);

// Chunk 2: Component State
content = content.replace(
    /<<<<<<< HEAD\r?\n([\s\S]*?recentActivity =[\s\S]*?status\r?\n  \}?\)?;\r?\n\r?\n)=======\r?\n>>>>>>> [a-f0-9]+/,
    `$1`
);

// Chunk 3: Stat 1
content = content.replace(
    /<<<<<<< HEAD\r?\n            \{loading \? \([\s\S]*?My Reports<\/span>\r?\n            <\/div>\r?\n          <\/div>\r?\n\r?\n          <div className="flex items-center gap-4">\r?\n            \{loading \? \([\s\S]*?<\/div>(\r?\n)*=======\r?\n([\s\S]*?124<\/div>)\r?\n([\s\S]*?)>>>>>>> [a-f0-9]+/,
    `            <h1 className="text-3xl font-light tracking-widest text-gray-900 uppercase">Dashboard</h1>
            <div className="hidden md:flex items-center gap-1.5 opacity-50">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* Stat 1 */}
            <div className="flex items-center gap-3">
              <div className="text-3xl font-medium text-gray-900 leading-none">
                {loading ? <Loader2 className="h-6 w-6 animate-spin text-emerald-500" /> : myReportsCount}
              </div>
$4`
);

// Chunk 4: Stat 2 & 3
content = content.replace(
    /<<<<<<< HEAD\r?\n          <div className="hidden xl:flex items-center gap-4">[\s\S]*?\]\)\}\r?\n=======(\r?\n[\s\S]*?82<\/div>)/,
    `$1`
);
content = content.replace(/82<\/div>/, `{loading ? <Loader2 className="h-6 w-6 animate-spin text-amber-500" /> : resolvedCount}</div>`);
content = content.replace(/42<\/div>/, `{loading ? <Loader2 className="h-6 w-6 animate-spin text-orange-500" /> : pendingCount}</div>`);
content = content.replace(/\r?\n>>>>>>> [a-f0-9]+/, '');

// Chunk 5: Gauge
content = content.replace(
    /<<<<<<< HEAD\r?\n              <div className="flex justify-between items-end mt-4">[\s\S]*?\}?\)\}\r?\n=======(\r?\n              <div className="absolute right-6 top-1\/2[\s\S]*?82%)<\/span>\r?\n>>>>>>> [a-f0-9]+/,
    `$1\`$\{cleanScore}%\`\}</span>`
);

// Chunk 6: Trends (keep both mapped reports and recharts)
content = content.replace(
    /<<<<<<< HEAD\r?\n              <div className="space-y-4 mb-8">[\s\S]*?\}\)\r?\n                \)\}\r?\n=======(\r?\n              <div className="flex justify-between items-end mb-8 relative">[\s\S]*?)\r?\n>>>>>>> [a-f0-9]+/,
    `$1`
);

// Chunk 7: Map (keep mapping from HEAD)
content = content.replace(
    /<<<<<<< HEAD\r?\n        \{\/\* Middle Column: Interactive Bin Map \*\/\}[\s\S]*?<\/Card>\r?\n        <\/div>\r?\n\r?\n        \{\/\* Right Column \*\/\}[\s\S]*?<\/CardContent>\r?\n          <\/Card>\r?\n=======[\s\S]*?88\.4 [\s\S]*?<\/Card>\r?\n\r?\n        \{\/\* Right Column \(Span 3\) \*\/\}[\s\S]*?<\/CardContent>\r?\n          <\/Card>\r?\n>>>>>>> [a-f0-9]+/,
    `        {/* Middle Column: Interactive Bin Map */}
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
            </div>
          </Card>
        </div>

        {/* Right Column (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
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
`
);

fs.writeFileSync(file, content);
console.log("Merge conflicts in UserDashboard.tsx have been resolved!");

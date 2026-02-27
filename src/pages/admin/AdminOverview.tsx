import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { FileText, AlertTriangle, CheckCircle, Trash2, MapPin, TrendingUp, Clock, Activity, ShieldAlert } from "lucide-react";
import { mockAreaScores } from "@/data/mockData";
import { motion } from "framer-motion";

const recentAlerts = [
  { id: 1, message: "Sector 7: Overflow Detected", location: "South Masi St", time: "5 min ago", type: "urgent" },
  { id: 2, message: "New Anomaly: Unauthorized Bio-Waste", location: "Vilakkuthoon", time: "12 min ago", type: "new" },
  { id: 3, message: "Unit 04 Deployed to RPT-005", location: "KK Nagar", time: "25 min ago", type: "info" },
  { id: 4, message: "RPT-003 Neutralized", location: "Sellur", time: "1 hour ago", type: "resolved" },
];

const alertStyles: Record<string, string> = {
  urgent: "border-l-destructive text-destructive bg-destructive/10 shadow-[inset_4px_0_0_0_rgba(239,68,68,1)] backdrop-blur-sm",
  new: "border-l-accent text-accent bg-accent/10 shadow-[inset_4px_0_0_0_rgba(250,204,21,1)] backdrop-blur-sm",
  info: "border-l-primary text-primary bg-primary/10 shadow-[inset_4px_0_0_0_rgba(74,222,128,1)] backdrop-blur-sm",
  resolved: "border-l-muted-foreground text-slate-300 bg-white/5 shadow-[inset_4px_0_0_0_rgba(148,163,184,1)] backdrop-blur-sm",
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const AdminOverview = () => {
  return (
    <div className="bg-[#13161c] min-h-screen text-slate-200">
      <div className="relative z-10 p-6 lg:p-8">
        <motion.div
          initial="hidden" animate="visible" variants={slideUp} transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-primary/20 pb-4"
        >
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
              Central Command
            </h1>
            <p className="text-slate-400 font-mono tracking-wider mt-1 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary animate-pulse" />
              SYSTEM STATUS: NOMINAL
            </p>
          </div>
          <div className="hidden md:flex gap-4 font-mono text-xs mt-4 md:mt-0">
            <div className="bg-black/50 border border-primary/30 px-3 py-1.5 rounded text-primary shadow-[inset_0_0_10px_rgba(74,222,128,0.2)]">UPTIME: 99.98%</div>
            <div className="bg-black/50 border border-accent/30 px-3 py-1.5 rounded text-accent shadow-[inset_0_0_10px_rgba(250,204,21,0.2)]">SEC: ENCRYPTED</div>
          </div>
        </motion.div>

        {/* HUD Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <motion.div variants={slideUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <Card className="bg-black/50 backdrop-blur-xl border-primary/20 shadow-[0_0_20px_rgba(74,222,128,0.05)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
              <CardContent className="flex items-center gap-4 pt-6 pb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded bg-primary/10 border border-primary/30 relative">
                  <FileText className="h-6 w-6 text-primary drop-shadow-[0_0_8px_rgba(74,222,128,0.8)] z-10" />
                  <div className="absolute inset-0 bg-primary/20 blur-md rounded" />
                </div>
                <div>
                  <p className="text-3xl font-bold font-mono text-white">156</p>
                  <p className="text-[10px] tracking-[0.2em] font-bold text-primary uppercase">Daily Reports</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={slideUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <Card className="bg-black/50 backdrop-blur-xl border-accent/20 shadow-[0_0_20px_rgba(250,204,21,0.05)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
              <CardContent className="flex items-center gap-4 pt-6 pb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded bg-accent/10 border border-accent/30 relative">
                  <AlertTriangle className="h-6 w-6 text-accent drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] z-10" />
                  <div className="absolute inset-0 bg-accent/20 blur-md rounded animate-pulse" />
                </div>
                <div>
                  <p className="text-3xl font-bold font-mono text-white">23</p>
                  <p className="text-[10px] tracking-[0.2em] font-bold text-accent uppercase">Pending Ops</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={slideUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
            <Card className="bg-black/50 backdrop-blur-xl border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
              <CardContent className="flex items-center gap-4 pt-6 pb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded bg-white/5 border border-white/20 relative">
                  <CheckCircle className="h-6 w-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] z-10" />
                </div>
                <div>
                  <p className="text-3xl font-bold font-mono text-white">118</p>
                  <p className="text-[10px] tracking-[0.2em] font-bold text-slate-400 uppercase">Resolved</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={slideUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
            <Card className="bg-black/50 backdrop-blur-xl border-destructive/30 shadow-[0_0_30px_rgba(239,68,68,0.15)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-destructive/5 animate-pulse rounded-lg" />
              <CardContent className="flex items-center gap-4 pt-6 pb-6 relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded bg-destructive/20 border border-destructive/50 relative">
                  <ShieldAlert className="h-6 w-6 text-destructive drop-shadow-[0_0_12px_rgba(239,68,68,1)] z-10" />
                  <div className="absolute inset-0 bg-destructive/20 blur-md rounded animate-pulse" />
                </div>
                <div>
                  <p className="text-3xl font-bold font-mono text-white">3</p>
                  <p className="text-[10px] tracking-[0.2em] font-bold text-destructive uppercase">Critical Alerts</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Tactical Chart */}
          <motion.div variants={slideUp} initial="hidden" animate="visible" transition={{ delay: 0.5 }} className="lg:col-span-2">
            <Card className="bg-black/40 backdrop-blur-xl border-white/10 h-full flex flex-col relative overflow-hidden drop-shadow-2xl">
              <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none z-0">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0H40V1H0V0Z" fill="#4ade80" />
                  <path d="M40 0V40H39V0H40Z" fill="#4ade80" />
                  <path d="M0 39H40V40H0V39Z" fill="#4ade80" />
                  <path d="M1 0V40H0V0H1Z" fill="#4ade80" />
                </svg>
              </div>
              <CardHeader className="border-b border-white/5 bg-black/20 font-mono relative z-10">
                <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest text-primary drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Sector Activity Matrix
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex-1 min-h-[300px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockAreaScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="area" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(74,222,128,0.3)",
                        borderRadius: "4px",
                        color: "#fff",
                        fontFamily: "monospace",
                        boxShadow: "0 0 15px rgba(74,222,128,0.2)"
                      }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="reports" stroke="#4ade80" strokeWidth={2} fillOpacity={1} fill="url(#colorReports)" name="Anomalies" />
                    <Area type="monotone" dataKey="resolved" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" name="Contained" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Live Alerts */}
          <motion.div variants={slideUp} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
            <Card className="bg-black/40 backdrop-blur-xl border-white/10 h-full flex flex-col drop-shadow-2xl">
              <CardHeader className="border-b border-white/5 bg-black/20 font-mono">
                <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest text-accent drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
                  <AlertTriangle className="h-4 w-4" />
                  Live Comms Intel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {recentAlerts.map((alert, i) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className={`rounded border-l-2 p-3 ${alertStyles[alert.type]} group hover:bg-white/10 transition-colors`}
                  >
                    <p className="text-xs font-bold font-mono tracking-wide uppercase drop-shadow-sm">{alert.message}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono opacity-80">
                      <span className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                        <MapPin className="h-3 w-3" />
                        {alert.location}
                      </span>
                      <span className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                        <Clock className="h-3 w-3" />
                        {alert.time}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tactical Map */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" transition={{ delay: 0.8 }} className="mt-6">
          <Card className="bg-black/40 backdrop-blur-xl border-white/10 border-primary/20 overflow-hidden relative group drop-shadow-2xl">
            {/* Scanning Line Animation */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-[10%] w-full animate-[scan_4s_ease-in-out_infinite] z-20 pointer-events-none" />

            <CardHeader className="border-b border-primary/20 bg-primary/5 font-mono relative z-30 backdrop-blur-sm">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm uppercase tracking-widest text-primary">
                <div className="flex items-center gap-2 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
                  <MapPin className="h-4 w-4" />
                  Geospatial Threat Map
                </div>
                <div className="flex gap-4 text-[10px]">
                  <span className="flex items-center gap-1 px-2 py-1 rounded bg-black/50 border border-primary/30 shadow-[inset_0_0_8px_rgba(74,222,128,0.1)]">
                    <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_5px_rgba(74,222,128,1)] animate-pulse" /> Low
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 rounded bg-black/50 border border-accent/30 shadow-[inset_0_0_8px_rgba(250,204,21,0.1)]">
                    <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_5px_rgba(250,204,21,1)] animate-pulse" /> Med
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 rounded bg-black/50 border border-destructive/30 shadow-[inset_0_0_8px_rgba(239,68,68,0.1)]">
                    <span className="h-2 w-2 rounded-full bg-destructive shadow-[0_0_5px_rgba(239,68,68,1)] animate-pulse" /> High
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 relative z-10">
              {/* 3D Wireframe Map Mockup */}
              <div className="h-[300px] sm:h-[400px] w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black relative flex items-center justify-center overflow-hidden">

                {/* 3D Perspective Grid */}
                <div className="absolute inset-0 [transform:rotateX(60deg)_translateY(50px)] [transform-origin:center_center] opacity-40">
                  <div className="absolute inset-x-0 bottom-0 h-[200%] w-full bg-[linear-gradient(to_right,#4ade80_1px,transparent_1px),linear-gradient(to_bottom,#4ade80_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:linear-gradient(to_bottom,transparent,black)] animate-[grid_10s_linear_infinite]" />
                </div>

                {/* Center Hologram Element */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-40 h-40 rounded-full border border-primary/30 flex items-center justify-center relative shadow-[inset_0_0_50px_rgba(74,222,128,0.2)] bg-black/40 backdrop-blur-sm">
                    <div className="absolute inset-0 border-2 border-t-primary border-r-transparent border-b-primary/50 border-l-transparent rounded-full animate-spin [animation-duration:3s]" />
                    <div className="absolute inset-4 border border-t-transparent border-r-accent border-b-transparent border-l-accent rounded-full animate-spin [animation-duration:4s] [animation-direction:reverse]" />
                    <div className="absolute inset-8 border border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full animate-spin [animation-duration:6s] opacity-50" />
                    <MapPin className="h-12 w-12 text-primary drop-shadow-[0_0_20px_rgba(74,222,128,1)]" />
                  </div>
                  <p className="mt-8 text-primary font-mono text-xs tracking-[0.3em] animate-pulse drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
                    [ INITIALIZING SPATIAL DATA ]
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(1000%); opacity: 0; }
        }
        @keyframes grid {
          0% { background-position: 0 0; }
          100% { background-position: 0 3rem; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(74, 222, 128, 0.4);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(74, 222, 128, 0.8);
        }
      `}} />
    </div>
  );
};

export default AdminOverview;

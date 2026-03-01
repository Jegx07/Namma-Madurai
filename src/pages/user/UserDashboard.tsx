import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowUpRight,
  Search,
  MapPin,
  Loader2,
  Zap,
  MessageSquare,
  AlertTriangle,
  Droplets,
  Construction,
  Eye,
  Send,
  Sparkles,
  Shield,
  Clock,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

// ──────────────────────────────────────────────
// Interfaces
// ──────────────────────────────────────────────
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

// ──────────────────────────────────────────────
// Recharts imports
// ──────────────────────────────────────────────
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

// ──────────────────────────────────────────────
// Design Tokens
// ──────────────────────────────────────────────
const COLORS = {
  bgPrimary: "#000000",
  bgCard: "#101A18",
  bgCardHover: "#142420",
  borderCard: "rgba(26,242,193,0.12)",
  borderCardHover: "rgba(26,242,193,0.25)",
  teal: "#1AF2C1",
  tealMuted: "rgba(26,242,193,0.4)",
  lime: "#A2F21A",
  limeMuted: "rgba(162,242,26,0.4)",
  gold: "#F2C41A",
  red: "#F2441A",
  offWhite: "#E8F0ED",
  textMuted: "rgba(232,240,237,0.45)",
  textSecondary: "rgba(232,240,237,0.65)",
  glassGlow: "inset 0 1px 0 0 rgba(26,242,193,0.08), 0 0 30px -10px rgba(26,242,193,0.1)",
};

// Shared card style
const glassCard =
  "rounded-[18px] border shadow-lg overflow-hidden backdrop-blur-sm transition-all duration-300";
const glassCardStyle = {
  background: `linear-gradient(145deg, ${COLORS.bgCard} 0%, rgba(10,18,14,0.95) 100%)`,
  borderColor: COLORS.borderCard,
  boxShadow: COLORS.glassGlow,
};

// ──────────────────────────────────────────────
// Chart Data
// ──────────────────────────────────────────────
const reportingTrendsData = [
  { name: "Jul", high: 1.55, low: 1.35 },
  { name: "", high: 1.93, low: 1.47 },
  { name: "", high: 2.12, low: 1.73 },
  { name: "", high: 0.95, low: 0.93 },
  { name: "", high: 1.47, low: 1.37 },
  { name: "Aug", high: 4.82, low: 3.62 },
  { name: "", high: 1.47, low: 1.47 },
  { name: "", high: 3.62, low: 1.73 },
  { name: "Sep", high: 1.47, low: 1.47 },
];

const sparklineData = Array.from({ length: 12 }).map(() => ({
  value: Math.random() * 100 + 20,
}));

const engagementGaugeData = [
  { name: "Completed", value: 78, fill: COLORS.lime },
  { name: "Remaining", value: 22, fill: "rgba(26,242,193,0.08)" },
];

// ──────────────────────────────────────────────
// Custom Tooltip
// ──────────────────────────────────────────────
interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="text-xs px-3 py-1.5 rounded-lg shadow-xl font-semibold"
        style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.borderCard}`,
          color: COLORS.teal,
        }}
      >
        {Math.round(payload[0].value * 100) / 100}k
      </div>
    );
  }
  return null;
};

// ──────────────────────────────────────────────
// Sparkline Component
// ──────────────────────────────────────────────
const Sparkline = ({ color, data }: { color: string; data: typeof sparklineData }) => (
  <div className="h-4 w-16">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <Bar dataKey="value" fill={color} radius={[1, 1, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// ──────────────────────────────────────────────
// Animated Number
// ──────────────────────────────────────────────
const AnimatedNum = ({ value, loading }: { value: number; loading: boolean }) => {
  if (loading) return <Loader2 className="h-5 w-5 animate-spin" style={{ color: COLORS.teal }} />;
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {value.toLocaleString()}
    </motion.span>
  );
};

// ──────────────────────────────────────────────
// Get time ago helper
// ──────────────────────────────────────────────
const getTimeAgo = (dateStr: string) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

// Get report icon by type
const getReportIcon = (type: string) => {
  const lower = type.toLowerCase();
  if (lower.includes("pothole") || lower.includes("road")) return Construction;
  if (lower.includes("sewer") || lower.includes("water") || lower.includes("leak")) return Droplets;
  if (lower.includes("danger") || lower.includes("electric")) return AlertTriangle;
  return Eye;
};

// ──────────────────────────────────────────────
// Community sentiment mock data
// ──────────────────────────────────────────────
const communityPosts = [
  {
    id: 1,
    text: "New waste segregation drive discussed",
    time: "10m ago",
    users: ["S", "R", "K"],
    sentiment: "positive",
  },
  {
    id: 2,
    text: "Streetlight outage in Ward 12 — resolved!",
    time: "32m ago",
    users: ["A", "M"],
    sentiment: "resolved",
  },
  {
    id: 3,
    text: "Drainage overflow reported near Anna Nagar",
    time: "1h ago",
    users: ["P", "V", "D"],
    sentiment: "alert",
  },
];

// ╔══════════════════════════════════════════════╗
// ║           MAIN DASHBOARD COMPONENT          ║
// ╚══════════════════════════════════════════════╝
const UserDashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [bins, setBins] = useState<Bin[]>([]);
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiMessage, setAiMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: reportsData, error: reportsError } = await supabase
          .from("Report 1")
          .select("*")
          .eq("user_id", user?.id || "")
          .order("created_at", { ascending: false });

        if (reportsError) {
          console.error("Error fetching 'Report 1':", reportsError);
          throw reportsError;
        }
        setReports(
          reportsData?.map((r) => ({
            ...r,
            latitude: parseFloat(r.latitude as unknown as string) || 0,
            longitude: parseFloat(r.longitude as unknown as string) || 0,
          })) || []
        );

        const { data: binsData, error: binsError } = await supabase
          .from("Bin Data")
          .select("*");

        if (binsError) {
          console.error("Error fetching 'Bin Data':", binsError);
        } else if (binsData) {
          setBins(
            binsData.map((b) => ({
              ...b,
              id: b.Bin_ID || b.id,
              latitude: parseFloat(b.latitude as unknown as string) || 0,
              longitude: parseFloat(b.longitude as unknown as string) || 0,
            }))
          );
        }

        const { data: scoreData, error: scoreError } = await supabase
          .from("User Dashboard")
          .select("*")
          .eq("user_id", user?.id || "")
          .single();

        if (scoreError) {
          console.error("Error fetching 'User Dashboard' score:", scoreError);
        } else if (scoreData) {
          setUserScore(scoreData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    } else {
      setLoading(false);
    }

    const channel = supabase
      .channel("user-dashboard-reports")
      .on("postgres_changes", { event: "*", schema: "public", table: "Report 1" }, () => {
        if (user?.id) fetchData();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "User Dashboard" }, () => {
        if (user?.id) fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Computed Stats
  const myReportsCount = reports.length;
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;
  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const inProgressCount = reports.filter(
    (r) => r.status === "in_progress" || r.status === "in progress"
  ).length;
  const cleanScore = userScore?.score || 0;
  const mapCenter: [number, number] = [9.9252, 78.1198];
  const recentReports = reports.slice(0, 3);

  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────
  return (
    <div
      className="min-h-screen text-white p-4 lg:p-5 font-['Inter',sans-serif] flex flex-col gap-4"
      style={{ background: COLORS.bgPrimary }}
    >
      {/* ══════════ TIER 1: EXECUTIVE SUMMARY ══════════ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        {/* Title + KPI Strip */}
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex items-center gap-3">
            <h1
              className="text-2xl md:text-3xl font-extralight tracking-[0.3em] uppercase"
              style={{ color: COLORS.offWhite }}
            >
              Dashboard
            </h1>
            <div className="hidden md:flex items-center gap-1 opacity-30">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.teal }} />
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.teal }} />
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.teal }} />
            </div>
          </div>

          {/* ─── Unified Real-Time Status Bar ─── */}
          <div
            className={`${glassCard} flex items-center gap-6 md:gap-8 px-5 py-3`}
            style={glassCardStyle}
          >
            {/* Total Reports */}
            <div className="flex items-center gap-3">
              <div className="text-2xl md:text-3xl font-semibold leading-none" style={{ color: COLORS.offWhite }}>
                <AnimatedNum value={myReportsCount} loading={loading} />
              </div>
              <div className="flex flex-col">
                <Sparkline color={COLORS.teal} data={sparklineData} />
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.12em] mt-0.5"
                  style={{ color: COLORS.teal }}
                >
                  Total Reports
                </span>
              </div>
            </div>

            <div className="w-px h-8 opacity-20" style={{ background: COLORS.teal }} />

            {/* Resolved */}
            <div className="flex items-center gap-3">
              <div className="text-2xl md:text-3xl font-semibold leading-none" style={{ color: COLORS.teal }}>
                <AnimatedNum value={resolvedCount} loading={loading} />
              </div>
              <div className="flex flex-col">
                <Sparkline color={COLORS.lime} data={sparklineData} />
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.12em] mt-0.5"
                  style={{ color: COLORS.lime }}
                >
                  Resolved
                </span>
              </div>
            </div>

            <div className="w-px h-8 opacity-20" style={{ background: COLORS.teal }} />

            {/* In Progress */}
            <div className="flex items-center gap-3">
              <div
                className="text-2xl md:text-3xl font-semibold leading-none"
                style={{ color: COLORS.textSecondary }}
              >
                <AnimatedNum value={inProgressCount + pendingCount} loading={loading} />
              </div>
              <div className="flex flex-col">
                <Sparkline color={COLORS.gold} data={sparklineData} />
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.12em] mt-0.5"
                  style={{ color: COLORS.textMuted }}
                >
                  In Progress
                </span>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="rounded-full px-5 font-medium tracking-wide text-sm h-9 transition-all duration-300"
          style={{
            background: "transparent",
            borderColor: COLORS.borderCard,
            color: COLORS.teal,
          }}
        >
          <Search className="w-4 h-4 mr-2" />
          Analytics
        </Button>
      </motion.div>

      {/* ══════════ TIER 2: WAR ROOM GRID ══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* ──── Left Column (Span 3) ──── */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Community Satisfaction Meter */}
          <Card className={glassCard} style={glassCardStyle}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: COLORS.lime }}
                />
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.15em]"
                  style={{ color: COLORS.lime }}
                >
                  Active Score
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold uppercase tracking-wide" style={{ color: COLORS.offWhite }}>
                    Community
                  </h2>
                  <h2 className="text-base font-bold uppercase tracking-wide" style={{ color: COLORS.offWhite }}>
                    Satisfaction
                  </h2>
                  <p className="text-[10px] font-medium mt-1" style={{ color: COLORS.tealMuted }}>
                    #NMA82030
                  </p>
                </div>

                <div className="w-[95px] h-[95px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={engagementGaugeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={34}
                        outerRadius={42}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={5}
                      >
                        {engagementGaugeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold leading-none" style={{ color: COLORS.lime }}>
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" style={{ color: COLORS.lime }} />
                      ) : (
                        `${cleanScore || 78}%`
                      )}
                    </span>
                    <span className="text-[7px] font-bold uppercase mt-1" style={{ color: COLORS.textMuted }}>
                      Engagement
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reporting Trends Card */}
          <Card className={`${glassCard} flex-1 flex flex-col`} style={glassCardStyle}>
            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3
                  className="text-[10px] font-bold uppercase tracking-[0.15em]"
                  style={{ color: COLORS.textMuted }}
                >
                  Reporting Trends
                </h3>
                <ArrowUpRight className="w-4 h-4" style={{ color: COLORS.tealMuted }} />
              </div>

              <div className="flex items-start gap-6 mb-4">
                <div>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: COLORS.textMuted }}
                  >
                    High Priority
                  </span>
                  <p className="text-2xl font-bold mt-1" style={{ color: COLORS.lime }}>
                    4.82k
                  </p>
                  <p className="text-[10px]" style={{ color: COLORS.textMuted }}>
                    <span style={{ color: COLORS.lime }}>↑</span> 3.2k this month{" "}
                    <span style={{ color: COLORS.lime }}>+0.24%</span>
                  </p>
                </div>
                <div>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: COLORS.textMuted }}
                  >
                    Low Priority
                  </span>
                  <p className="text-2xl font-bold mt-1" style={{ color: COLORS.teal }}>
                    1.47k <span className="text-sm" style={{ color: COLORS.red }}>↓</span>
                  </p>
                  <p className="text-[10px]" style={{ color: COLORS.textMuted }}>
                    950 this month <span style={{ color: COLORS.red }}>-0.18%</span>
                  </p>
                </div>
              </div>

              <div className="flex-1 mt-auto">
                <div className="h-[115px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportingTrendsData} barCategoryGap="15%">
                      <XAxis
                        dataKey="name"
                        tick={{ fill: COLORS.textMuted, fontSize: 9, fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="high" fill={COLORS.lime} radius={[2, 2, 0, 0]} />
                      <Bar dataKey="low" fill="rgba(26,242,193,0.25)" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ──── Center: 3D War Room Grid Visualization (Span 6) ──── */}
        <Card
          className={`lg:col-span-6 ${glassCard} relative min-h-[460px]`}
          style={glassCardStyle}
        >
          {/* Location Header Overlay */}
          <div className="absolute top-4 left-4 z-30">
            <Button
              variant="outline"
              className="rounded-lg text-[11px] font-semibold h-8 shadow-lg backdrop-blur-md"
              style={{
                background: "rgba(16,26,24,0.85)",
                borderColor: COLORS.borderCard,
                color: COLORS.teal,
              }}
            >
              <MapPin className="w-3 h-3 mr-1.5" style={{ color: COLORS.teal }} />
              742 Anna Nagar, Madurai
              <ArrowUpRight className="w-3 h-3 ml-1" style={{ color: COLORS.tealMuted }} />
            </Button>
          </div>

          {/* Legend */}
          <div className="absolute top-4 right-4 z-30 flex gap-2">
            {[
              { label: "Critical", color: COLORS.red },
              { label: "Active", color: COLORS.gold },
              { label: "Resolved", color: COLORS.teal },
              { label: "Bins", color: COLORS.lime },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider backdrop-blur-md"
                style={{
                  background: "rgba(16,26,24,0.8)",
                  border: `1px solid ${COLORS.borderCard}`,
                  color: item.color,
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                {item.label}
              </div>
            ))}
          </div>

          {/* ─── 3D Wireframe Grid Background ─── */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Base dark gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 50% 50%, rgba(16,26,24,0.6) 0%, ${COLORS.bgPrimary} 70%)`,
              }}
            />

            {/* Perspective Grid */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ perspective: "800px" }}
            >
              <div
                className="w-[90%] h-[85%] relative"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(55deg) rotateZ(-15deg) scale(1.05)",
                }}
              >
                {/* Main Grid Layer */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(26,242,193,0.06) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(26,242,193,0.06) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                    border: "1px solid rgba(26,242,193,0.08)",
                  }}
                />

                {/* Inner Grid Layer (elevated) */}
                <div
                  className="absolute inset-6 rounded-xl"
                  style={{
                    transform: "translateZ(30px)",
                    backgroundImage: `
                      linear-gradient(rgba(162,242,26,0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(162,242,26,0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: "30px 30px",
                    border: "1px solid rgba(26,242,193,0.05)",
                  }}
                />

                {/* ─── Heatmap Glow Zones ─── */}
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute rounded-full"
                  style={{
                    top: "30%", left: "35%",
                    width: "180px", height: "180px",
                    background: `radial-gradient(circle, ${COLORS.lime}20 0%, transparent 70%)`,
                    transform: "translateZ(10px)",
                    filter: "blur(20px)",
                  }}
                />
                <motion.div
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute rounded-full"
                  style={{
                    top: "55%", left: "55%",
                    width: "140px", height: "140px",
                    background: `radial-gradient(circle, ${COLORS.teal}18 0%, transparent 70%)`,
                    transform: "translateZ(10px)",
                    filter: "blur(15px)",
                  }}
                />
                <motion.div
                  animate={{ opacity: [0.15, 0.35, 0.15] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute rounded-full"
                  style={{
                    top: "15%", left: "60%",
                    width: "100px", height: "100px",
                    background: `radial-gradient(circle, ${COLORS.gold}15 0%, transparent 70%)`,
                    transform: "translateZ(10px)",
                    filter: "blur(12px)",
                  }}
                />

                {/* ─── 3D Data Pillars ─── */}
                {[
                  { top: "25%", left: "30%", h: 80, color: COLORS.lime, delay: 0 },
                  { top: "45%", left: "55%", h: 100, color: COLORS.teal, delay: 0.2 },
                  { top: "60%", left: "35%", h: 50, color: COLORS.gold, delay: 0.4 },
                  { top: "35%", left: "65%", h: 70, color: COLORS.lime, delay: 0.1 },
                  { top: "50%", left: "25%", h: 40, color: COLORS.teal, delay: 0.3 },
                  { top: "20%", left: "50%", h: 60, color: COLORS.gold, delay: 0.5 },
                  { top: "70%", left: "50%", h: 45, color: COLORS.lime, delay: 0.15 },
                  { top: "40%", left: "75%", h: 55, color: COLORS.teal, delay: 0.35 },
                ].map((pillar, i) => (
                  <motion.div
                    key={`pillar-${i}`}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: pillar.delay + 0.3, duration: 0.6, ease: "easeOut" }}
                    className="absolute"
                    style={{
                      top: pillar.top,
                      left: pillar.left,
                      width: "6px",
                      height: `${pillar.h}px`,
                      background: `linear-gradient(to top, ${pillar.color}10, ${pillar.color}80)`,
                      borderTop: `2px solid ${pillar.color}`,
                      borderLeft: `1px solid ${pillar.color}40`,
                      transform: `translateZ(${pillar.h / 2}px)`,
                      transformOrigin: "bottom",
                      boxShadow: `0 0 12px ${pillar.color}30`,
                    }}
                  />
                ))}

                {/* ─── Animated Scatter Data Points ─── */}
                {[
                  { top: "28%", left: "32%", color: COLORS.lime, size: 8, delay: 0 },
                  { top: "42%", left: "58%", color: COLORS.teal, size: 10, delay: 0.1 },
                  { top: "55%", left: "38%", color: COLORS.gold, size: 7, delay: 0.2 },
                  { top: "38%", left: "68%", color: COLORS.lime, size: 6, delay: 0.3 },
                  { top: "62%", left: "52%", color: COLORS.teal, size: 9, delay: 0.15 },
                  { top: "22%", left: "55%", color: COLORS.red, size: 8, delay: 0.25 },
                  { top: "48%", left: "28%", color: COLORS.lime, size: 7, delay: 0.35 },
                  { top: "68%", left: "48%", color: COLORS.gold, size: 6, delay: 0.4 },
                  { top: "32%", left: "45%", color: COLORS.teal, size: 8, delay: 0.05 },
                  { top: "75%", left: "62%", color: COLORS.lime, size: 7, delay: 0.45 },
                  { top: "18%", left: "42%", color: COLORS.gold, size: 6, delay: 0.5 },
                  { top: "58%", left: "72%", color: COLORS.teal, size: 9, delay: 0.12 },
                  { top: "45%", left: "40%", color: COLORS.lime, size: 10, delay: 0.22 },
                  { top: "30%", left: "75%", color: COLORS.gold, size: 7, delay: 0.32 },
                  { top: "52%", left: "65%", color: COLORS.lime, size: 8, delay: 0.18 },
                ].map((dot, i) => (
                  <motion.div
                    key={`dot-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: dot.delay + 0.6, duration: 0.4 }}
                    className="absolute"
                    style={{
                      top: dot.top,
                      left: dot.left,
                      transform: "translateZ(50px)",
                    }}
                  >
                    {/* Outer glow */}
                    <motion.div
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute rounded-full"
                      style={{
                        width: `${dot.size * 4}px`,
                        height: `${dot.size * 4}px`,
                        top: `${-(dot.size * 1.5)}px`,
                        left: `${-(dot.size * 1.5)}px`,
                        background: `radial-gradient(circle, ${dot.color}25 0%, transparent 70%)`,
                      }}
                    />
                    {/* Core dot */}
                    <div
                      className="rounded-full shadow-lg"
                      style={{
                        width: `${dot.size}px`,
                        height: `${dot.size}px`,
                        background: dot.color,
                        boxShadow: `0 0 ${dot.size}px ${dot.color}60, 0 0 ${dot.size * 2}px ${dot.color}20`,
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Top & bottom gradient fade */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(to bottom, ${COLORS.bgPrimary} 0%, transparent 18%, transparent 82%, ${COLORS.bgPrimary} 100%)`,
              }}
            />
            {/* Side fades */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(to right, ${COLORS.bgPrimary} 0%, transparent 12%, transparent 88%, ${COLORS.bgPrimary} 100%)`,
              }}
            />
          </div>

          {/* ─── Critical Alert Callouts ─── */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {recentReports.slice(0, 2).map((report, idx) => {
              const ReportIcon = getReportIcon(report.type);
              const isResolved = report.status === "resolved";
              const isPending = report.status === "pending";
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, scale: 0.9, x: idx === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: idx * 0.3 + 0.8, duration: 0.5, ease: "easeOut" }}
                  className="absolute backdrop-blur-lg rounded-xl px-3.5 py-2 shadow-xl"
                  style={{
                    top: idx === 0 ? "25%" : "55%",
                    left: idx === 0 ? "10%" : "54%",
                    background: isPending
                      ? "linear-gradient(135deg, rgba(242,68,26,0.15), rgba(242,196,26,0.1))"
                      : isResolved
                        ? "linear-gradient(135deg, rgba(26,242,193,0.15), rgba(162,242,26,0.08))"
                        : "linear-gradient(135deg, rgba(242,196,26,0.12), rgba(26,242,193,0.08))",
                    border: `1px solid ${isPending
                      ? "rgba(242,68,26,0.3)"
                      : isResolved
                        ? "rgba(26,242,193,0.25)"
                        : "rgba(242,196,26,0.25)"
                      }`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <ReportIcon
                      className="w-3.5 h-3.5"
                      style={{
                        color: isPending ? COLORS.red : isResolved ? COLORS.teal : COLORS.gold,
                      }}
                    />
                    <p className="text-[10px] font-semibold capitalize" style={{ color: COLORS.offWhite }}>
                      {report.type}{" "}
                      {isResolved ? "fixed" : isPending ? "critical" : "scheduled"} –{" "}
                      {getTimeAgo(report.created_at)}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* Static demo callouts when no live data */}
            {recentReports.length === 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute backdrop-blur-lg rounded-xl px-3.5 py-2 shadow-xl"
                  style={{
                    top: "28%", left: "12%",
                    background: "linear-gradient(135deg, rgba(26,242,193,0.15), rgba(162,242,26,0.08))",
                    border: "1px solid rgba(26,242,193,0.25)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5" style={{ color: COLORS.teal }} />
                    <p className="text-[10px] font-semibold" style={{ color: COLORS.offWhite }}>Main sewer leak fixed – 2h ago</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                  className="absolute backdrop-blur-lg rounded-xl px-3.5 py-2 shadow-xl"
                  style={{
                    top: "52%", left: "48%",
                    background: "linear-gradient(135deg, rgba(242,196,26,0.12), rgba(26,242,193,0.08))",
                    border: "1px solid rgba(242,196,26,0.25)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Construction className="w-3.5 h-3.5" style={{ color: COLORS.gold }} />
                    <p className="text-[10px] font-semibold" style={{ color: COLORS.offWhite }}>Pothole repair scheduled – 10 AM</p>
                  </div>
                </motion.div>
              </>
            )}
          </div>

          {/* Bottom Stats Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex gap-6">
            <div
              className="flex gap-6 px-4 py-2.5 rounded-xl backdrop-blur-md"
              style={{
                background: "rgba(16,26,24,0.75)",
                border: `1px solid ${COLORS.borderCard}`,
              }}
            >
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Reports Tracked</p>
                <p className="text-lg font-bold" style={{ color: COLORS.offWhite }}>2.5K</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Clean Score</p>
                <p className="text-lg font-bold flex items-center gap-1" style={{ color: COLORS.offWhite }}>
                  88.4 <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${COLORS.teal}15`, color: COLORS.teal }}>↑</span>
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Active Zones</p>
                <p className="text-lg font-bold" style={{ color: COLORS.offWhite }}>15</p>
              </div>
            </div>
          </div>
        </Card>

        {/* ──── Right Column (Span 3) ──── */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* AI Assistant Card */}
          <Card className={`${glassCard} flex-1 relative overflow-hidden`} style={glassCardStyle}>
            {/* Radial glow */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: `radial-gradient(circle at top right, ${COLORS.teal}, transparent 60%)`,
              }}
            />
            <CardContent className="p-5 relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4" style={{ color: COLORS.teal }} />
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.12em]"
                    style={{ color: COLORS.teal }}
                  >
                    AI Assistant
                  </span>
                </div>

                <h3
                  className="text-[11px] font-bold uppercase tracking-wide leading-relaxed mb-4"
                  style={{ color: COLORS.textSecondary }}
                >
                  I'm here{" "}
                  <span style={{ color: COLORS.offWhite }}>to make managing your reports easier.</span>
                  <br />
                  How can I <span style={{ color: COLORS.offWhite }}>assist you today?</span>
                </h3>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { icon: Zap, label: "Risk Analysis" },
                    { icon: MapPin, label: "Area Tracking" },
                    { icon: Eye, label: "View my latest reports" },
                    { icon: Shield, label: "Check safety in area..." },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.03, borderColor: COLORS.borderCardHover }}
                      className="cursor-pointer rounded-lg p-2.5 flex items-center gap-2 transition-all duration-200"
                      style={{
                        background: "rgba(26,242,193,0.05)",
                        border: `1px solid ${COLORS.borderCard}`,
                      }}
                    >
                      <item.icon className="w-3.5 h-3.5" style={{ color: COLORS.teal }} />
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: COLORS.textSecondary }}
                      >
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Input
                  placeholder="Message AI Assistant"
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  className="h-10 rounded-xl pr-20 text-xs"
                  style={{
                    background: "rgba(26,242,193,0.04)",
                    borderColor: COLORS.borderCard,
                    color: COLORS.offWhite,
                    backdropFilter: "blur(8px)",
                  }}
                />
                <div className="absolute right-1 top-1 flex items-center gap-1">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-[10px] font-bold"
                    style={{
                      background: "rgba(26,242,193,0.1)",
                      color: COLORS.teal,
                    }}
                  >
                    AI
                  </button>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                    style={{ background: COLORS.teal }}
                  >
                    <Send className="w-3.5 h-3.5" style={{ color: COLORS.bgPrimary }} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Citizen Pulse / Community Forum */}
          <Card className={`${glassCard} relative overflow-hidden`} style={glassCardStyle}>
            <CardContent className="p-5 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" style={{ color: COLORS.teal }} />
                    <h3
                      className="text-[10px] font-bold uppercase tracking-[0.15em]"
                      style={{ color: COLORS.offWhite }}
                    >
                      Live Citizen Pulse
                    </h3>
                  </div>
                  <p
                    className="text-[9px] font-medium tracking-wide mt-0.5"
                    style={{ color: COLORS.textMuted }}
                  >
                    Sentiment Feed • Updated live
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: COLORS.teal }} />
                  <span className="text-[8px] font-bold uppercase" style={{ color: COLORS.teal }}>
                    Live
                  </span>
                </div>
              </div>

              {/* Sentiment Posts */}
              <div className="space-y-2.5 mb-4">
                {communityPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: post.id * 0.1 }}
                    className="rounded-lg p-2.5"
                    style={{
                      background:
                        post.sentiment === "alert"
                          ? "rgba(242,68,26,0.06)"
                          : post.sentiment === "resolved"
                            ? "rgba(26,242,193,0.06)"
                            : "rgba(162,242,26,0.06)",
                      border: `1px solid ${post.sentiment === "alert"
                        ? "rgba(242,68,26,0.15)"
                        : post.sentiment === "resolved"
                          ? "rgba(26,242,193,0.12)"
                          : "rgba(162,242,26,0.12)"
                        }`,
                    }}
                  >
                    <p className="text-[10px] leading-relaxed" style={{ color: COLORS.textSecondary }}>
                      {post.text}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-1">
                        <div className="flex -space-x-1.5">
                          {post.users.map((u, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-bold"
                              style={{
                                background:
                                  i === 0
                                    ? "rgba(26,242,193,0.2)"
                                    : i === 1
                                      ? "rgba(162,242,26,0.2)"
                                      : "rgba(242,196,26,0.2)",
                                border: `1px solid ${COLORS.borderCard}`,
                                color: COLORS.offWhite,
                              }}
                            >
                              {u}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" style={{ color: COLORS.textMuted }} />
                        <span className="text-[8px] font-medium" style={{ color: COLORS.textMuted }}>
                          {post.time}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chat bubble */}
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.lime})`,
                    boxShadow: `0 4px 20px -4px ${COLORS.tealMuted}`,
                  }}
                >
                  <MessageSquare className="w-5 h-5" style={{ color: COLORS.bgPrimary }} />
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

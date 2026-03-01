import { useState } from "react";
import {
  Trophy, TrendingUp, Users, CheckCircle2, Trash2, TreePine, Megaphone, Camera,
  Calendar, Clock, ChevronRight, Target, Award, Flame, Zap, BarChart3,
  ArrowUp, ArrowDown, Star
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ── Design Tokens ──
const C = {
  bg: "#000000",
  card: "#101A18",
  cardBorder: "rgba(26,242,193,0.12)",
  cardGlow: "inset 0 1px 0 0 rgba(26,242,193,0.08), 0 0 30px -10px rgba(26,242,193,0.1)",
  teal: "#1AF2C1",
  lime: "#A2F21A",
  gold: "#F2C41A",
  purple: "#B47AFF",
  orange: "#EA7B1A",
  red: "#F2441A",
  offWhite: "#E8F0ED",
  muted: "rgba(232,240,237,0.4)",
  secondary: "rgba(232,240,237,0.6)",
};

const glassCard = "rounded-[16px] border backdrop-blur-sm transition-all duration-300";
const cardStyle = {
  background: `linear-gradient(145deg, ${C.card} 0%, rgba(10,18,14,0.95) 100%)`,
  borderColor: C.cardBorder,
  boxShadow: C.cardGlow,
};

// ── Mock Data ──
const kpis = [
  { label: "Total Points", value: "750", icon: Trophy, color: C.teal, change: "+120 this month", up: true },
  { label: "City Rank", value: "#4", icon: Award, color: C.gold, change: "Up 2 places", up: true },
  { label: "Resolved Reports", value: "87%", icon: CheckCircle2, color: C.lime, change: "+5% from last month", up: true },
  { label: "Active Members", value: "156", icon: Users, color: C.purple, change: "12 new this week", up: true },
  { label: "Waste Cleared", value: "2.4T", icon: Trash2, color: C.orange, change: "~2,400 kg total", up: true },
];

const statisticsData = [
  { time: "7 am", points: 15 },
  { time: "8 am", points: 25 },
  { time: "9 am", points: 40 },
  { time: "10 am", points: 35 },
  { time: "11 am", points: 55 },
  { time: "12 am", points: 65 },
  { time: "1 pm", points: 80 },
  { time: "2 pm", points: 70 },
  { time: "3 pm", points: 95 },
  { time: "4 pm", points: 85 },
  { time: "5 pm", points: 110 },
  { time: "6 pm", points: 90 },
  { time: "7 pm", points: 75 },
  { time: "8 pm", points: 60 },
];

const calendarDays = [
  { day: "01", label: "Sat" },
  { day: "02", label: "Sun" },
  { day: "03", label: "Mon" },
  { day: "04", label: "Tue" },
  { day: "05", label: "Wed" },
  { day: "06", label: "Thu" },
  { day: "07", label: "Fri" },
  { day: "08", label: "Sat" },
  { day: "09", label: "Sun" },
  { day: "10", label: "Mon", active: true },
  { day: "11", label: "Tue" },
  { day: "12", label: "Wed" },
  { day: "13", label: "Thu" },
];

const ongoingActivities = [
  {
    name: "Sophia Hayes", role: "Cleanup Lead",
    timer: "01:54:38", reports: 34, duration: "2h 45m",
    mentor: "David Barr", teamSize: 2,
    id: "ID 35774", dotColors: [C.lime, C.gold, C.teal, C.purple, C.lime, C.gold, C.teal, C.lime],
  },
  {
    name: "Owen Darnell", role: "Tree Planter",
    timer: "01:54:38", reports: 10, duration: "3h 10m",
    mentor: "Kilian S.", teamSize: 4,
    id: "ID 98745", dotColors: [C.gold, C.lime, C.purple, C.teal, C.lime, C.gold, C.teal, C.lime],
  },
  {
    name: "Emma Larkin", role: "Awareness Campaigner",
    timer: "01:51:43", reports: 29, duration: "6h 29m",
    mentor: "Jörgen P.", teamSize: 8,
    id: "ID 85427", dotColors: [C.purple, C.teal, C.lime, C.gold, C.purple, C.lime, C.gold, C.teal],
  },
];

const startingActivities = [
  { name: "Liam Grayson", avatar: "LG" },
  { name: "Mia Jennings", avatar: "MJ" },
];

const onBreak = [
  { name: "Jack Linton", reason: "Lunch break", time: "00:17", avatar: "JL" },
  { name: "Samuel Waters", reason: "Lunch break", time: "00:19", avatar: "SW" },
  { name: "Henry Mercer", reason: "Lunch break", time: "10:51", avatar: "HM" },
  { name: "Amelia Rowann", reason: "Short break", time: "10:42", avatar: "AR" },
];

const scoringRules = [
  { action: "Waste Report Submitted", points: 5, icon: Trash2 },
  { action: "Validated Report", points: 10, icon: CheckCircle2 },
  { action: "Cleanup Drive", points: 50, icon: Trash2 },
  { action: "Awareness Campaign", points: 40, icon: Megaphone },
  { action: "Tree Plantation", points: 30, icon: TreePine },
  { action: "Unresolved Complaint", points: -5, icon: Clock },
];

const badges = [
  { name: "First Report", earned: true },
  { name: "10 Reports", earned: true },
  { name: "Cleanup Hero", earned: true },
  { name: "Green Champion", earned: false },
  { name: "100 Reports", earned: false },
];

// ── Custom Tooltip ──
const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div
        className="text-xs px-3 py-2 rounded-lg shadow-xl font-semibold"
        style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.purple }}
      >
        <p className="font-bold mb-0.5" style={{ color: C.offWhite }}>{label}</p>
        <p>{payload[0].value} pts</p>
      </div>
    );
  }
  return null;
};

// ╔══════════════════════════════════════════════╗
// ║         YOUTH DASHBOARD COMPONENT           ║
// ╚══════════════════════════════════════════════╝
const YouthDashboard = () => {
  const [selectedDay, setSelectedDay] = useState("10");
  const [monthlyTarget] = useState({ current: 750, target: 1000 });
  const [streak] = useState(12);
  const [timeRange, setTimeRange] = useState<"Days" | "Weeks" | "Months">("Days");
  const progress = (monthlyTarget.current / monthlyTarget.target) * 100;

  return (
    <div
      className="p-4 lg:p-5 min-h-screen font-['Inter',sans-serif] text-white"
      style={{ background: C.bg }}
    >
      {/* ── Header Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5"
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: C.offWhite }}>
            Institution Dashboard
          </h1>
          <p className="text-xs mt-1 font-medium" style={{ color: C.muted }}>
            Govt. Higher Secondary School, Madurai • Ward 15
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(234,123,26,0.1)", border: "1px solid rgba(234,123,26,0.2)" }}
          >
            <Flame className="h-4 w-4" style={{ color: C.orange }} />
            <span className="text-sm font-bold" style={{ color: C.orange }}>{streak}-day streak</span>
          </div>
          <div
            className="px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(26,242,193,0.08)", border: `1px solid ${C.cardBorder}` }}
          >
            <span className="text-sm font-bold" style={{ color: C.teal }}>Code: NM-SCH-A3F2K9</span>
          </div>
        </div>
      </motion.div>

      {/* ── KPI Cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5"
      >
        {kpis.map((kpi, i) => (
          <Card key={kpi.label} className={`${glassCard} group`} style={{ ...cardStyle, borderColor: `${kpi.color}20` }}>
            <CardContent className="p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg" style={{ background: `${kpi.color}12` }}>
                  <kpi.icon className="h-4 w-4" style={{ color: kpi.color }} />
                </div>
                <ArrowUp className="h-3.5 w-3.5" style={{ color: C.teal }} />
              </div>
              <p className="text-2xl font-bold leading-none" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="text-[10px] font-semibold mt-1" style={{ color: C.muted }}>{kpi.label}</p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: C.teal }}>{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* ── Main Grid: Statistics + Right Sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-5">
        {/* Statistics (Span 9) */}
        <Card className={`lg:col-span-9 ${glassCard}`} style={cardStyle}>
          <CardContent className="p-4">
            {/* Header + Range Toggle */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold" style={{ color: C.offWhite }}>Statistics</h2>
              <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: "rgba(26,242,193,0.04)", border: `1px solid ${C.cardBorder}` }}>
                {(["Days", "Weeks", "Months"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className="px-3 py-1 rounded-md text-[11px] font-semibold transition-all"
                    style={{
                      background: timeRange === range ? `${C.purple}20` : "transparent",
                      color: timeRange === range ? C.purple : C.muted,
                      border: timeRange === range ? `1px solid ${C.purple}40` : "1px solid transparent",
                    }}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Day Selector */}
            <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
              {calendarDays.map((d) => (
                <motion.button
                  key={d.day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDay(d.day)}
                  className="flex flex-col items-center px-3 py-2 rounded-xl min-w-[48px] transition-all"
                  style={{
                    background: selectedDay === d.day
                      ? `linear-gradient(135deg, ${C.purple}, ${C.purple}80)`
                      : "rgba(26,242,193,0.03)",
                    border: `1px solid ${selectedDay === d.day ? `${C.purple}60` : C.cardBorder}`,
                    boxShadow: selectedDay === d.day ? `0 4px 20px ${C.purple}30` : "none",
                  }}
                >
                  <span
                    className="text-sm font-bold"
                    style={{ color: selectedDay === d.day ? "#fff" : C.offWhite }}
                  >
                    {d.day}
                  </span>
                  <span
                    className="text-[9px] font-semibold"
                    style={{ color: selectedDay === d.day ? "rgba(255,255,255,0.7)" : C.muted }}
                  >
                    {d.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Area Chart */}
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={statisticsData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.purple} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={C.purple} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(26,242,193,0.05)" />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: C.muted, fontWeight: 500 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: C.muted }}
                    tickFormatter={(v) => `${v}`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="points"
                    stroke={C.purple}
                    strokeWidth={2.5}
                    fill="url(#purpleGradient)"
                    dot={false}
                    activeDot={{ r: 5, fill: C.purple, stroke: C.offWhite, strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar (Span 3) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Starting Activities */}
          <Card className={glassCard} style={cardStyle}>
            <CardContent className="p-4">
              <h3 className="text-sm font-bold mb-3" style={{ color: C.offWhite }}>Starting Activities</h3>
              <div className="space-y-2.5">
                {startingActivities.map((person) => (
                  <div key={person.name} className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: `${C.purple}20`, color: C.purple, border: `1px solid ${C.purple}30` }}
                    >
                      {person.avatar}
                    </div>
                    <span className="text-sm font-medium" style={{ color: C.offWhite }}>{person.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* On Break */}
          <Card className={`${glassCard} flex-1`} style={cardStyle}>
            <CardContent className="p-4">
              <h3 className="text-sm font-bold mb-3" style={{ color: C.offWhite }}>On Break</h3>
              <div className="space-y-2.5">
                {onBreak.map((person) => (
                  <div key={person.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold"
                        style={{ background: `${C.gold}15`, color: C.gold, border: `1px solid ${C.gold}25` }}
                      >
                        {person.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: C.offWhite }}>{person.name}</p>
                        <p className="text-[9px]" style={{ color: C.muted }}>{person.reason}</p>
                      </div>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                      style={{ background: `${C.red}15`, color: C.red, border: `1px solid ${C.red}20` }}
                    >
                      {person.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Outsourced Members */}
          <Card
            className={`${glassCard} relative overflow-hidden`}
            style={{
              ...cardStyle,
              background: `linear-gradient(135deg, ${C.purple}20, ${C.orange}15)`,
              borderColor: `${C.purple}30`,
            }}
          >
            <CardContent className="p-4 relative z-10">
              <p className="text-4xl font-bold" style={{ color: C.teal }}>+278k</p>
              <p className="text-xs font-semibold mt-1" style={{ color: C.secondary }}>Youth volunteers</p>
            </CardContent>
            <div
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: `radial-gradient(circle at bottom right, ${C.purple}, transparent 70%)` }}
            />
          </Card>
        </div>
      </div>

      {/* ── Ongoing Activities ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-5"
      >
        <h2 className="text-base font-bold mb-3" style={{ color: C.offWhite }}>Ongoing Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ongoingActivities.map((activity, i) => (
            <Card key={activity.id} className={glassCard} style={cardStyle}>
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={{
                      background: `${[C.teal, C.purple, C.lime][i]}15`,
                      color: [C.teal, C.purple, C.lime][i],
                      border: `1px solid ${[C.teal, C.purple, C.lime][i]}30`,
                    }}
                  >
                    {activity.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: C.offWhite }}>{activity.name}</p>
                    <p className="text-[10px]" style={{ color: C.muted }}>{activity.role}</p>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-1 rounded-lg"
                    style={{ background: `${C.teal}10`, color: C.teal, border: `1px solid ${C.cardBorder}` }}
                  >
                    {activity.timer}
                  </span>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" style={{ color: C.gold }} />
                    <span className="text-xs font-bold" style={{ color: C.gold }}>{activity.reports}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" style={{ color: C.secondary }} />
                    <span className="text-xs font-medium" style={{ color: C.secondary }}>{activity.duration}</span>
                  </div>
                </div>

                {/* Mentor Row */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold"
                    style={{ background: `${C.purple}20`, color: C.purple }}
                  >
                    {activity.mentor[0]}
                  </div>
                  <span className="text-[10px]" style={{ color: C.secondary }}>{activity.mentor}</span>
                  <div className="flex items-center gap-1 ml-auto">
                    <Users className="w-3 h-3" style={{ color: C.muted }} />
                    <span className="text-[10px] font-semibold" style={{ color: C.muted }}>{activity.teamSize}</span>
                  </div>
                </div>

                {/* Activity Dots */}
                <div className="flex items-center gap-1 mb-3">
                  {activity.dotColors.map((color, j) => (
                    <motion.div
                      key={j}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: j * 0.05 + i * 0.15 }}
                      className="w-3 h-3 rounded-full"
                      style={{ background: color, boxShadow: `0 0 6px ${color}40` }}
                    />
                  ))}
                </div>

                {/* Footer */}
                <div
                  className="flex items-center justify-between pt-2"
                  style={{ borderTop: `1px solid ${C.cardBorder}` }}
                >
                  <span className="text-[10px] font-bold" style={{ color: C.muted }}>{activity.id}</span>
                  <div className="flex gap-2">
                    {["≡", "≊", "⊞"].map((sym, k) => (
                      <span key={k} className="text-[10px]" style={{ color: C.muted }}>{sym}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* ── Bottom Row: Scoring + Badges ── */}
      <div className="grid lg:grid-cols-2 gap-4 mb-5">
        {/* Scoring System */}
        <Card className={glassCard} style={cardStyle}>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold mb-3" style={{ color: C.offWhite }}>Scoring System</h3>
            <div className="space-y-2">
              {scoringRules.map((rule) => (
                <div
                  key={rule.action}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors"
                  style={{ background: "rgba(26,242,193,0.03)", border: `1px solid ${C.cardBorder}` }}
                >
                  <div className="flex items-center gap-2.5">
                    <rule.icon className="h-3.5 w-3.5" style={{ color: C.muted }} />
                    <span className="text-xs font-medium" style={{ color: C.secondary }}>{rule.action}</span>
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{ color: rule.points > 0 ? C.teal : C.red }}
                  >
                    {rule.points > 0 ? "+" : ""}{rule.points} pts
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Target + Badges */}
        <div className="flex flex-col gap-4">
          {/* Monthly Target */}
          <Card className={glassCard} style={cardStyle}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" style={{ color: C.teal }} />
                  <h3 className="text-sm font-bold" style={{ color: C.offWhite }}>Monthly Target</h3>
                </div>
                <span className="text-xs font-bold" style={{ color: C.teal }}>
                  {monthlyTarget.current} / {monthlyTarget.target}
                </span>
              </div>
              <div
                className="w-full h-2.5 rounded-full overflow-hidden"
                style={{ background: "rgba(26,242,193,0.08)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${C.teal}90, ${C.lime})`,
                    boxShadow: `0 0 10px ${C.teal}40`,
                  }}
                />
              </div>
              <p className="text-[10px] mt-2" style={{ color: C.muted }}>
                {(100 - progress).toFixed(0)}% remaining to reach your monthly goal
              </p>
            </CardContent>
          </Card>

          {/* Achievement Badges */}
          <Card className={`${glassCard} flex-1`} style={cardStyle}>
            <CardContent className="p-4">
              <h3 className="text-sm font-bold mb-3" style={{ color: C.offWhite }}>Achievement Badges</h3>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <motion.div
                    key={badge.name}
                    whileHover={{ scale: badge.earned ? 1.05 : 1 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all"
                    style={{
                      background: badge.earned ? `${C.teal}10` : "rgba(26,242,193,0.03)",
                      border: `1px solid ${badge.earned ? `${C.teal}30` : C.cardBorder}`,
                      color: badge.earned ? C.teal : C.muted,
                    }}
                  >
                    <Star
                      className="h-3 w-3"
                      style={{ color: badge.earned ? C.gold : C.muted }}
                      fill={badge.earned ? C.gold : "none"}
                    />
                    {badge.name}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default YouthDashboard;

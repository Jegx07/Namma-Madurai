import { useState } from "react";
import {
  Trophy, TrendingUp, TrendingDown, BarChart3, Activity, ArrowUp, ArrowDown,
  Minus, Search, AlertTriangle, Zap, Target, Star, Sparkles, PieChart,
  Users, ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, Cell
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
  pink: "#F21AC4",
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

// ── Ward Data ──
const wardData = [
  { rank: 1, name: "Anna Nagar", cri: 94.2, weeklyChange: 3.1, prevRank: 1, movement: 0 },
  { rank: 2, name: "KK Nagar", cri: 91.8, weeklyChange: 4.5, prevRank: 4, movement: 2 },
  { rank: 3, name: "Teppakulam", cri: 89.5, weeklyChange: 2.4, prevRank: 3, movement: 0 },
  { rank: 4, name: "Goripalayam", cri: 86.0, weeklyChange: -1.2, prevRank: 2, movement: -2 },
  { rank: 5, name: "Simmakkal", cri: 84.1, weeklyChange: 1.8, prevRank: 6, movement: 1 },
  { rank: 6, name: "SS Colony", cri: 80.2, weeklyChange: 5.6, prevRank: 9, movement: 3 },
  { rank: 7, name: "Thirunagar", cri: 72.4, weeklyChange: 1.5, prevRank: 7, movement: 0 },
  { rank: 8, name: "Vilangudi", cri: 69.4, weeklyChange: 3.2, prevRank: 10, movement: 2 },
  { rank: 9, name: "Tallakulam", cri: 67.0, weeklyChange: -2.8, prevRank: 5, movement: -4 },
  { rank: 10, name: "Arasaradi", cri: 61.2, weeklyChange: 0.8, prevRank: 11, movement: 1 },
  { rank: 11, name: "Periyar", cri: 54.6, weeklyChange: -3.1, prevRank: 8, movement: -3 },
  { rank: 12, name: "Bibikulam", cri: 48.8, weeklyChange: -1.5, prevRank: 12, movement: 0 },
  { rank: 13, name: "Mattuthavani", cri: 42.6, weeklyChange: 1.0, prevRank: 14, movement: 1 },
  { rank: 14, name: "Palanganatham", cri: 38.6, weeklyChange: -2.2, prevRank: 13, movement: -1 },
];

const kpis = [
  { label: "Leading Ward", value: "Anna Nagar", sub: "CRI: 94.2 • #1", icon: Trophy, color: C.gold },
  { label: "Most Improved", value: "SS Colony", sub: "+5.6% • ↑3", icon: TrendingUp, color: C.teal },
  { label: "Lowest Ranked", value: "Palanganatham", sub: "CRI: 38.6", icon: AlertTriangle, color: C.red },
  { label: "City Avg CRI", value: "70.0", sub: "14 wards", icon: BarChart3, color: C.purple },
  { label: "Avg Weekly Δ", value: "+0.9%", sub: "Week of Feb 24", icon: Activity, color: C.lime },
];

// Chart data derived from ward data
const barChartData = wardData.slice(0, 8).map((w) => ({
  name: w.name.length > 8 ? w.name.substring(0, 8) + "." : w.name,
  cri: w.cri,
  change: w.weeklyChange,
}));

const trendData = [
  { month: "Jan", cri: 62 },
  { month: "Feb", cri: 58 },
  { month: "Mar", cri: 64 },
  { month: "Dec", cri: 60 },
  { month: "Nov", cri: 66 },
  { month: "Apr", cri: 68 },
  { month: "May", cri: 65 },
  { month: "Jun", cri: 70 },
  { month: "Jul", cri: 72 },
];

const statusLabel = (rank: number, movement: number) => {
  if (rank <= 3) return { text: "Leading", color: C.teal };
  if (movement >= 0) return { text: "Stable", color: C.lime };
  return { text: "Needs Improvement", color: C.orange };
};

// ── Custom Tooltips ──
const BarTip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div
        className="text-xs px-3 py-2 rounded-lg shadow-xl font-semibold"
        style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.teal }}
      >
        <p className="font-bold mb-0.5" style={{ color: C.offWhite }}>{label}</p>
        <p>CRI: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// ╔══════════════════════════════════════════════╗
// ║       PERFORMANCE BOARD COMPONENT           ║
// ╚══════════════════════════════════════════════╝
const PerformanceBoard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Leading" | "Declining">("All");

  const filtered = wardData.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "Leading") return matchesSearch && w.rank <= 5;
    if (activeTab === "Declining") return matchesSearch && w.weeklyChange < 0;
    return matchesSearch;
  });

  const improvingCount = wardData.filter((w) => w.weeklyChange > 0).length;
  const decliningCount = wardData.filter((w) => w.weeklyChange < 0).length;

  return (
    <div
      className="p-4 lg:p-5 min-h-screen font-['Inter',sans-serif] text-white"
      style={{ background: C.bg }}
    >
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: C.offWhite }}>
          Performance Board
        </h1>
        <p className="text-xs mt-1 font-medium" style={{ color: C.muted }}>
          Ward-level civic performance transparency — Week of Feb 24, 2026
        </p>
      </motion.div>

      {/* ── Bento Grid: Top Row ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-12 gap-4 mb-5"
      >
        {/* Puzzlebot-style insight card */}
        <Card className={`col-span-12 md:col-span-3 ${glassCard} relative overflow-hidden`} style={cardStyle}>
          <div
            className="absolute inset-0 opacity-15"
            style={{ backgroundImage: `radial-gradient(circle at 30% 40%, ${C.pink}, transparent 60%)` }}
          />
          <CardContent className="p-5 relative z-10">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 mb-4 flex items-center justify-center"
            >
              <Sparkles className="w-10 h-10" style={{ color: C.pink }} />
            </motion.div>

            <h3 className="text-lg font-bold mb-3" style={{ color: C.offWhite }}>
              CivicBot
            </h3>

            <div className="space-y-2">
              {["Auto ward scoring", "AI categorization", "Smart alerts"].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: C.teal }} />
                  <span className="text-xs font-medium" style={{ color: C.secondary }}>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Highlights Card */}
        <Card className={`col-span-12 md:col-span-5 ${glassCard}`} style={cardStyle}>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4" style={{ color: C.teal }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.teal }}>
                This Week's Highlights
              </span>
            </div>

            <h3 className="text-base font-bold mb-4" style={{ color: C.offWhite }}>
              Your February performance summary
            </h3>

            {/* Mini KPI Row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl p-3" style={{ background: "rgba(26,242,193,0.05)", border: `1px solid ${C.cardBorder}` }}>
                <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: C.muted }}>City Average CRI</p>
                <p className="text-xl font-bold" style={{ color: C.teal }}>70.0</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: "rgba(26,242,193,0.05)", border: `1px solid ${C.cardBorder}` }}>
                <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Improvement Rate</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold" style={{ color: C.lime }}>+0.9%</p>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: `${C.teal}15`, color: C.teal }}
                  >
                    ↑
                  </span>
                </div>
              </div>
            </div>

            {/* Equation-style summary */}
            <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
              <span className="px-2 py-1 rounded" style={{ background: `${C.teal}12`, color: C.teal }}>
                {improvingCount} improving
              </span>
              <span style={{ color: C.muted }}>=</span>
              <span className="px-2 py-1 rounded" style={{ background: `${C.lime}12`, color: C.lime }}>
                {improvingCount} wards ↑
              </span>
              <span style={{ color: C.muted }}>~</span>
              <span className="px-2 py-1 rounded" style={{ background: `${C.red}12`, color: C.red }}>
                {decliningCount} wards ↓
              </span>
            </div>
          </CardContent>
        </Card>

        {/* About / Ward Info Card */}
        <Card className={`col-span-12 md:col-span-4 ${glassCard}`} style={cardStyle}>
          <CardContent className="p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: C.offWhite }}>
              Ward Performance Profile
            </h3>

            <div className="space-y-3">
              {[
                { label: "Leading Ward", value: "Anna Nagar", color: C.gold },
                { label: "Most Improved", value: "SS Colony", color: C.teal },
                { label: "Lowest", value: "Palanganatham", color: C.red },
                { label: "Total Wards", value: "14", color: C.purple },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: C.muted }}>
                    {item.label}
                  </p>
                  <div
                    className="rounded-lg px-3 py-2 text-sm font-semibold"
                    style={{
                      background: "rgba(26,242,193,0.04)",
                      border: `1px solid ${C.cardBorder}`,
                      color: item.color,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── KPI Strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5"
      >
        {kpis.map((kpi) => (
          <Card key={kpi.label} className={`${glassCard} group`} style={{ ...cardStyle, borderColor: `${kpi.color}20` }}>
            <CardContent className="p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg" style={{ background: `${kpi.color}12` }}>
                  <kpi.icon className="h-4 w-4" style={{ color: kpi.color }} />
                </div>
              </div>
              <p className="text-lg font-bold leading-tight" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="text-[10px] font-semibold mt-0.5" style={{ color: C.muted }}>{kpi.label}</p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: `${kpi.color}90` }}>{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* ── Charts Row ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-12 gap-4 mb-5"
      >
        {/* Bar Chart */}
        <Card className={`col-span-12 lg:col-span-7 ${glassCard}`} style={cardStyle}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full" style={{ background: C.teal }} />
                <h3 className="text-xs font-bold" style={{ color: C.offWhite }}>Ward CRI Comparison</h3>
              </div>
              <div className="flex items-center gap-3 text-[9px] font-bold uppercase" style={{ color: C.muted }}>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm" style={{ background: C.teal }} /> CRI</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm" style={{ background: C.gold }} /> Change</div>
              </div>
            </div>

            <div className="h-[220px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 5, right: 5, left: -25, bottom: 30 }} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(26,242,193,0.05)" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: C.muted, fontWeight: 600 }}
                    angle={-40}
                    textAnchor="end"
                    dy={8}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: C.muted }} />
                  <Tooltip content={<BarTip />} />
                  <Bar dataKey="cri" radius={[3, 3, 0, 0]} barSize={20}>
                    {barChartData.map((entry, i) => (
                      <Cell key={i} fill={i < 3 ? C.teal : i < 6 ? C.lime : C.gold} />
                    ))}
                  </Bar>
                  <Bar dataKey="change" radius={[3, 3, 0, 0]} barSize={12}>
                    {barChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.change >= 0 ? `${C.lime}60` : `${C.red}60`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trend Line + ARR-style */}
        <Card className={`col-span-12 lg:col-span-5 ${glassCard}`} style={cardStyle}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-4 rounded-full" style={{ background: C.purple }} />
              <h3 className="text-xs font-bold" style={{ color: C.offWhite }}>CRI Trend (City Average)</h3>
            </div>

            <div className="h-[220px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(26,242,193,0.05)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: C.muted, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: C.muted }} domain={[50, 80]} />
                  <Tooltip content={<BarTip />} />
                  <Line type="monotone" dataKey="cri" stroke={C.purple} strokeWidth={2.5}
                    dot={{ fill: C.purple, r: 3, stroke: C.card, strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: C.purple, stroke: C.offWhite, strokeWidth: 2 }}
                    strokeDasharray="8 4"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Tab Filter ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex items-center gap-3 mb-4"
      >
        <div
          className="flex items-center p-0.5 rounded-xl"
          style={{ background: "rgba(26,242,193,0.04)", border: `1px solid ${C.cardBorder}` }}
        >
          {(["All", "Leading", "Declining"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
              style={{
                background: activeTab === tab ? `${C.teal}15` : "transparent",
                color: activeTab === tab ? C.teal : C.muted,
                border: activeTab === tab ? `1px solid ${C.teal}30` : "1px solid transparent",
              }}
            >
              {tab === "All" ? "All Wards" : tab === "Leading" ? "Top 5" : "Declining"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: C.muted }} />
          <input
            type="text"
            placeholder="Search ward..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium focus:outline-none"
            style={{
              background: "rgba(26,242,193,0.04)",
              border: `1px solid ${C.cardBorder}`,
              color: C.offWhite,
            }}
          />
        </div>
      </motion.div>

      {/* ── Ranking Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-5"
      >
        <Card className={glassCard} style={cardStyle}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
                    {["Rank", "Ward Name", "CRI", "Weekly Change", "Movement", "Status"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em]"
                        style={{ color: C.muted }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ward, i) => {
                    const status = statusLabel(ward.rank, ward.movement);
                    return (
                      <motion.tr
                        key={ward.rank}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 + 0.35 }}
                        className="transition-colors hover:bg-[rgba(26,242,193,0.03)]"
                        style={{ borderBottom: `1px solid rgba(26,242,193,0.06)` }}
                      >
                        {/* Rank */}
                        <td className="px-4 py-3">
                          <div
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-bold"
                            style={{
                              background:
                                ward.rank === 1 ? `${C.gold}18` :
                                  ward.rank === 2 ? "rgba(192,192,192,0.12)" :
                                    ward.rank === 3 ? `${C.orange}15` :
                                      "rgba(26,242,193,0.06)",
                              color:
                                ward.rank === 1 ? C.gold :
                                  ward.rank === 2 ? "#C0C0C0" :
                                    ward.rank === 3 ? C.orange :
                                      C.muted,
                              border: `1px solid ${ward.rank === 1 ? `${C.gold}30` :
                                  ward.rank === 2 ? "rgba(192,192,192,0.2)" :
                                    ward.rank === 3 ? `${C.orange}30` :
                                      C.cardBorder
                                }`,
                            }}
                          >
                            {ward.rank}
                          </div>
                        </td>

                        {/* Name */}
                        <td className="px-4 py-3 text-sm font-semibold" style={{ color: C.offWhite }}>
                          {ward.name}
                        </td>

                        {/* CRI with mini bar */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold w-8" style={{ color: C.offWhite }}>{ward.cri}</span>
                            <div className="h-1.5 w-16 rounded-full overflow-hidden" style={{ background: "rgba(26,242,193,0.08)" }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${ward.cri}%` }}
                                transition={{ delay: i * 0.04 + 0.4, duration: 0.5 }}
                                className="h-full rounded-full"
                                style={{
                                  background:
                                    ward.cri >= 85 ? C.teal :
                                      ward.cri >= 70 ? C.lime :
                                        ward.cri >= 50 ? C.gold : C.red,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Weekly Change */}
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center gap-1 text-xs font-bold"
                            style={{ color: ward.weeklyChange >= 0 ? C.teal : C.red }}
                          >
                            {ward.weeklyChange >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                            {ward.weeklyChange >= 0 ? "+" : ""}{ward.weeklyChange}%
                          </span>
                        </td>

                        {/* Movement */}
                        <td className="px-4 py-3">
                          {ward.movement > 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: C.teal }}>
                              <ArrowUp className="h-3 w-3" /> +{ward.movement}
                            </span>
                          ) : ward.movement < 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: C.red }}>
                              <ArrowDown className="h-3 w-3" /> {ward.movement}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: C.muted }}>
                              <Minus className="h-3 w-3" /> —
                            </span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                            style={{
                              background: `${status.color}12`,
                              color: status.color,
                              border: `1px solid ${status.color}25`,
                            }}
                          >
                            {status.text}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Bottom Row: Instant Metrics + Categories + Alerts ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-12 gap-4"
      >
        {/* Categories */}
        <Card className={`col-span-12 md:col-span-4 ${glassCard}`} style={cardStyle}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: C.teal }} />
                <span className="text-xs font-bold" style={{ color: C.offWhite }}>
                  Improving ({improvingCount} Wards)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: C.red }} />
                <span className="text-xs font-bold" style={{ color: C.offWhite }}>
                  Declining ({decliningCount} Wards)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {wardData.filter(w => w.weeklyChange > 2).map((w) => (
                <span
                  key={w.name}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold"
                  style={{ background: `${C.teal}10`, color: C.teal, border: `1px solid ${C.teal}25` }}
                >
                  {w.name}
                </span>
              ))}
              {wardData.filter(w => w.weeklyChange < -2).map((w) => (
                <span
                  key={w.name}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold"
                  style={{ background: `${C.red}10`, color: C.red, border: `1px solid ${C.red}25` }}
                >
                  {w.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Alerts */}
        <Card className={`col-span-12 md:col-span-5 ${glassCard}`} style={cardStyle}>
          <CardContent className="p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: C.offWhite }}>
              Performance Observations
            </h3>
            <div className="space-y-2">
              {wardData.filter(w => w.weeklyChange < -2).map((ward) => (
                <div
                  key={ward.name}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg"
                  style={{ background: `${C.red}06`, border: `1px solid ${C.red}15` }}
                >
                  <TrendingDown className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: C.red }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: C.offWhite }}>
                      Decline — {ward.name}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: C.muted }}>
                      {Math.abs(ward.weeklyChange)}% decrease
                      {ward.movement < 0 && `, down ${Math.abs(ward.movement)} positions`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instant Metrics */}
        <Card className={`col-span-12 md:col-span-3 ${glassCard}`} style={cardStyle}>
          <CardContent className="p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: C.offWhite }}>
              Instant Metrics
            </h3>
            <div className="space-y-4">
              {[
                { label: "of wards improving", value: `${Math.round((improvingCount / wardData.length) * 100)}%`, color: C.teal },
                { label: "avg CRI finalized", value: "70.0", color: C.purple },
              ].map((metric) => (
                <div key={metric.label} className="flex items-center gap-3">
                  <div className="relative w-12 h-12">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(26,242,193,0.08)" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="14" fill="none"
                        stroke={metric.color}
                        strokeWidth="3"
                        strokeDasharray={`${parseFloat(metric.value) * 0.88} 88`}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: C.offWhite }}>{metric.value}</p>
                    <p className="text-[9px] font-medium" style={{ color: C.muted }}>{metric.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PerformanceBoard;

import { useState } from "react";
import {
  ArrowUp, ArrowDown, Minus, TrendingUp, TrendingDown, Sparkles,
  Zap, BarChart3, Target, Users, ChevronRight, ArrowUpRight
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
const wardMovement = [
  { name: "Anna Nagar", prevRank: 1, currRank: 1, change: 0, weeklyChange: 3.1, cri: 94.2 },
  { name: "KK Nagar", prevRank: 4, currRank: 2, change: 2, weeklyChange: 4.5, cri: 91.8 },
  { name: "Teppakulam", prevRank: 3, currRank: 3, change: 0, weeklyChange: 2.4, cri: 89.5 },
  { name: "Goripalayam", prevRank: 2, currRank: 4, change: -2, weeklyChange: -1.2, cri: 86.0 },
  { name: "Simmakkal", prevRank: 6, currRank: 5, change: 1, weeklyChange: 1.8, cri: 84.1 },
  { name: "SS Colony", prevRank: 9, currRank: 6, change: 3, weeklyChange: 5.6, cri: 80.2 },
  { name: "Thirunagar", prevRank: 7, currRank: 7, change: 0, weeklyChange: 1.5, cri: 72.4 },
  { name: "Vilangudi", prevRank: 10, currRank: 8, change: 2, weeklyChange: 3.2, cri: 69.4 },
  { name: "Tallakulam", prevRank: 5, currRank: 9, change: -4, weeklyChange: -2.8, cri: 67.0 },
  { name: "Arasaradi", prevRank: 11, currRank: 10, change: 1, weeklyChange: 0.8, cri: 61.2 },
  { name: "Periyar", prevRank: 8, currRank: 11, change: -3, weeklyChange: -3.1, cri: 54.6 },
  { name: "Bibikulam", prevRank: 12, currRank: 12, change: 0, weeklyChange: -1.5, cri: 48.8 },
  { name: "Mattuthavani", prevRank: 14, currRank: 13, change: 1, weeklyChange: 1.0, cri: 42.6 },
  { name: "Palanganatham", prevRank: 13, currRank: 14, change: -1, weeklyChange: -2.2, cri: 38.6 },
];

const criTrend = [
  { month: "Jan", avg: 62, best: 88 },
  { month: "Feb", avg: 58, best: 90 },
  { month: "Mar", avg: 64, best: 85 },
  { month: "Apr", avg: 68, best: 92 },
  { month: "May", avg: 65, best: 89 },
  { month: "Jun", avg: 70, best: 94 },
  { month: "Jul", avg: 72, best: 92 },
];

const movementBarData = wardMovement.slice(0, 8).map((w) => ({
  name: w.name.length > 8 ? w.name.substring(0, 8) + "." : w.name,
  change: w.change,
  weeklyChange: w.weeklyChange,
}));

const improved = wardMovement.filter(w => w.change > 0);
const declined = wardMovement.filter(w => w.change < 0);
const stable = wardMovement.filter(w => w.change === 0);

// ── Custom Tooltip ──
const ChartTip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div
        className="text-xs px-3 py-2 rounded-lg shadow-xl font-semibold"
        style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.teal }}
      >
        <p className="font-bold mb-0.5" style={{ color: C.offWhite }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const MovementTracker = () => {
  const [filter, setFilter] = useState<"all" | "improved" | "declined" | "stable">("all");

  const filtered = wardMovement.filter((w) => {
    if (filter === "improved") return w.change > 0;
    if (filter === "declined") return w.change < 0;
    if (filter === "stable") return w.change === 0;
    return true;
  });

  const filterBtns = [
    { id: "all" as const, label: "All Wards", count: wardMovement.length, color: C.teal },
    { id: "improved" as const, label: "↑ Improved", count: improved.length, color: C.lime },
    { id: "declined" as const, label: "↓ Declined", count: declined.length, color: C.red },
    { id: "stable" as const, label: "— Stable", count: stable.length, color: C.muted },
  ];

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
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="h-5 w-5" style={{ color: C.teal }} />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: C.offWhite }}>
            Ward Movement Tracker
          </h1>
        </div>
        <p className="text-xs font-medium" style={{ color: C.muted }}>
          Weekly rank and CRI changes across all wards
        </p>
      </motion.div>

      {/* ── Top Bento Row ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-12 gap-4 mb-5"
      >
        {/* AI Insights Card */}
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
            <h3 className="text-lg font-bold mb-3" style={{ color: C.offWhite }}>MomentumAI</h3>
            <div className="space-y-2">
              {["Auto rank tracking", "Pattern detection", "Alert forecasting"].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: C.teal }} />
                  <span className="text-xs font-medium" style={{ color: C.secondary }}>{f}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* This Week's Movement Overview */}
        <Card className={`col-span-12 md:col-span-5 ${glassCard}`} style={cardStyle}>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4" style={{ color: C.teal }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.teal }}>
                Weekly Movement Summary
              </span>
            </div>
            <h3 className="text-base font-bold mb-4" style={{ color: C.offWhite }}>
              Your ward movement highlights
            </h3>

            {/* 3 mini KPI boxes */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="rounded-xl p-3 text-center" style={{ background: `${C.teal}08`, border: `1px solid ${C.teal}20` }}>
                <p className="text-xl font-bold" style={{ color: C.teal }}>{improved.length}</p>
                <p className="text-[9px] font-bold uppercase mt-0.5" style={{ color: C.muted }}>Improved</p>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: `${C.red}08`, border: `1px solid ${C.red}20` }}>
                <p className="text-xl font-bold" style={{ color: C.red }}>{declined.length}</p>
                <p className="text-[9px] font-bold uppercase mt-0.5" style={{ color: C.muted }}>Declined</p>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: "rgba(26,242,193,0.04)", border: `1px solid ${C.cardBorder}` }}>
                <p className="text-xl font-bold" style={{ color: C.secondary }}>{stable.length}</p>
                <p className="text-[9px] font-bold uppercase mt-0.5" style={{ color: C.muted }}>Stable</p>
              </div>
            </div>

            {/* Equation-style */}
            <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
              <span className="px-2 py-1 rounded" style={{ background: `${C.lime}12`, color: C.lime }}>
                With Momentum ({improved.length} Steps)
              </span>
              <span className="px-2 py-1 rounded" style={{ background: `${C.red}12`, color: C.red }}>
                Without Momentum ({declined.length + stable.length} steps)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Ward Profile */}
        <Card className={`col-span-12 md:col-span-4 ${glassCard}`} style={cardStyle}>
          <CardContent className="p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: C.offWhite }}>
              Movement Snapshot
            </h3>
            <div className="space-y-3">
              {[
                { label: "Biggest Riser", value: "SS Colony (+3)", color: C.teal },
                { label: "Biggest Drop", value: "Tallakulam (−4)", color: C.red },
                { label: "Best CRI", value: "Anna Nagar (94.2)", color: C.gold },
                { label: "Most Improved %", value: "SS Colony (+5.6%)", color: C.lime },
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

      {/* ── Charts Row ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-12 gap-4 mb-5"
      >
        {/* Movement Bar Chart */}
        <Card className={`col-span-12 lg:col-span-7 ${glassCard}`} style={cardStyle}>
          <CardContent className="p-4">
            {/* Header row with 3 summary KPIs */}
            <div className="flex items-center gap-6 mb-4">
              {[
                { label: "Total Movement", value: `${improved.length + declined.length}`, sub: "shifts" },
                { label: "Avg CRI Change", value: "+0.9%", sub: "weekly" },
                { label: "Tracked Since", value: "Nov '24", sub: "(18 months)" },
              ].map((kpi) => (
                <div key={kpi.label}>
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>{kpi.label}</p>
                  <p className="text-base font-bold" style={{ color: C.offWhite }}>
                    {kpi.value}{" "}
                    <span className="text-[9px] font-medium" style={{ color: C.muted }}>{kpi.sub}</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 text-[9px] font-bold uppercase mb-2" style={{ color: C.muted }}>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm" style={{ background: C.teal }} /> CRI Change</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm" style={{ background: C.gold }} /> Position</div>
            </div>

            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={movementBarData} margin={{ top: 5, right: 5, left: -25, bottom: 30 }} barGap={2}>
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
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="weeklyChange" name="Weekly %" radius={[3, 3, 0, 0]} barSize={18}>
                    {movementBarData.map((entry, i) => (
                      <Cell key={i} fill={entry.weeklyChange >= 0 ? C.teal : C.red} />
                    ))}
                  </Bar>
                  <Bar dataKey="change" name="Position" radius={[3, 3, 0, 0]} barSize={12}>
                    {movementBarData.map((entry, i) => (
                      <Cell key={i} fill={entry.change >= 0 ? `${C.gold}90` : `${C.pink}70`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* CRI Trend */}
        <Card className={`col-span-12 lg:col-span-5 ${glassCard}`} style={cardStyle}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 rounded-full" style={{ background: C.purple }} />
              <h3 className="text-xs font-bold" style={{ color: C.offWhite }}>CRI Trend (City Average)</h3>
            </div>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={criTrend} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(26,242,193,0.05)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: C.muted, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: C.muted }} domain={[40, 100]} />
                  <Tooltip content={<ChartTip />} />
                  <Line
                    type="monotone" dataKey="best" name="Best CRI" stroke={C.teal} strokeWidth={2}
                    dot={{ fill: C.teal, r: 3, stroke: C.card, strokeWidth: 2 }}
                    strokeDasharray="6 3"
                  />
                  <Line
                    type="monotone" dataKey="avg" name="Avg CRI" stroke={C.purple} strokeWidth={2.5}
                    dot={{ fill: C.purple, r: 3, stroke: C.card, strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: C.purple, stroke: C.offWhite, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Filter Tabs ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center p-0.5 rounded-xl mb-5 w-fit"
        style={{ background: "rgba(26,242,193,0.04)", border: `1px solid ${C.cardBorder}` }}
      >
        {filterBtns.map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
            style={{
              background: filter === btn.id ? `${btn.color}15` : "transparent",
              color: filter === btn.id ? (btn.id === "stable" ? C.offWhite : btn.color) : C.muted,
              border: filter === btn.id ? `1px solid ${btn.color}30` : "1px solid transparent",
            }}
          >
            {btn.label}{" "}
            <span className="opacity-50 ml-0.5">({btn.count})</span>
          </button>
        ))}
      </motion.div>

      {/* ── Movement Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        {filtered.map((ward, i) => {
          const isUp = ward.change > 0;
          const isDown = ward.change < 0;
          const accentColor = isUp ? C.teal : isDown ? C.red : C.muted;

          return (
            <motion.div
              key={ward.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 + 0.25 }}
            >
              <Card
                className={`${glassCard} group hover:scale-[1.01]`}
                style={{ ...cardStyle, borderColor: `${accentColor}20` }}
              >
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold" style={{ color: C.offWhite }}>{ward.name}</h3>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                      style={{
                        background: `${accentColor}10`,
                        color: accentColor,
                        border: `1px solid ${accentColor}25`,
                      }}
                    >
                      CRI: {ward.cri}
                    </span>
                  </div>

                  {/* Rank Movement Visual */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      {/* Previous */}
                      <div className="text-center">
                        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>Prev</p>
                        <p className="text-lg font-bold" style={{ color: C.muted }}>#{ward.prevRank}</p>
                      </div>

                      {/* Arrow */}
                      <motion.div
                        initial={{ x: -3 }}
                        animate={{ x: 3 }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                      >
                        <ArrowUpRight className="w-4 h-4" style={{ color: C.muted }} />
                      </motion.div>

                      {/* Current */}
                      <div className="text-center">
                        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>Now</p>
                        <p className="text-lg font-bold" style={{ color: C.offWhite }}>#{ward.currRank}</p>
                      </div>
                    </div>

                    {/* Movement Badge */}
                    <div className="ml-auto text-right">
                      <div className="flex items-center gap-1 justify-end" style={{ color: accentColor }}>
                        {isUp ? <ArrowUp className="h-4 w-4" /> : isDown ? <ArrowDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                        <span className="text-xl font-bold">
                          {isUp ? `+${ward.change}` : ward.change === 0 ? "0" : ward.change}
                        </span>
                      </div>
                      <p className="text-[9px] font-medium" style={{ color: C.muted }}>positions</p>
                    </div>
                  </div>

                  {/* Weekly CRI Change Bar */}
                  <div
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                    style={{
                      background: `${ward.weeklyChange >= 0 ? C.teal : C.red}06`,
                      border: `1px solid ${ward.weeklyChange >= 0 ? C.teal : C.red}15`,
                    }}
                  >
                    <span className="text-[10px] font-medium" style={{ color: C.secondary }}>Weekly CRI Change</span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: ward.weeklyChange >= 0 ? C.teal : C.red }}
                    >
                      {ward.weeklyChange >= 0 ? "+" : ""}{ward.weeklyChange}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ── Bottom: Category Tags + Instant Metrics ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-12 gap-4"
      >
        {/* Category tags */}
        <Card className={`col-span-12 md:col-span-5 ${glassCard}`} style={cardStyle}>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { label: "Top Performers", color: C.teal },
                { label: "Rising Wards", color: C.lime },
              ].map((tag) => (
                <span
                  key={tag.label}
                  className="px-3.5 py-1.5 rounded-lg text-[11px] font-bold"
                  style={{ background: `${tag.color}10`, color: tag.color, border: `1px solid ${tag.color}30` }}
                >
                  {tag.label}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {improved.map((w) => (
                <span
                  key={w.name}
                  className="px-2.5 py-1 rounded-md text-[10px] font-semibold"
                  style={{ background: `${C.teal}08`, color: C.teal, border: `1px solid ${C.teal}18` }}
                >
                  {w.name} <span style={{ color: C.lime }}>+{w.change}</span>
                </span>
              ))}
              {declined.map((w) => (
                <span
                  key={w.name}
                  className="px-2.5 py-1 rounded-md text-[10px] font-semibold"
                  style={{ background: `${C.red}08`, color: C.red, border: `1px solid ${C.red}18` }}
                >
                  {w.name} {w.change}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Momentum Metrics */}
        <Card className={`col-span-12 md:col-span-4 ${glassCard}`} style={cardStyle}>
          <CardContent className="p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: C.offWhite }}>
              Instant Metrics
            </h3>
            <div className="space-y-3">
              {[
                { label: "of wards improving", value: Math.round((improved.length / wardMovement.length) * 100), color: C.teal },
                { label: "avg movement score", value: 55, color: C.purple },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(26,242,193,0.08)" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="14" fill="none"
                        stroke={m.color}
                        strokeWidth="3"
                        strokeDasharray={`${m.value * 0.88} 88`}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: C.offWhite }}>{m.value}%</p>
                    <p className="text-[9px] font-medium" style={{ color: C.muted }}>{m.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Big stat card */}
        <Card
          className={`col-span-12 md:col-span-3 ${glassCard} relative overflow-hidden flex items-center justify-center`}
          style={{
            ...cardStyle,
            background: `linear-gradient(135deg, ${C.purple}20, ${C.teal}15)`,
            borderColor: `${C.purple}30`,
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: `radial-gradient(circle at bottom right, ${C.teal}, transparent 70%)` }}
          />
          <CardContent className="p-4 relative z-10 text-center">
            <p className="text-4xl font-bold" style={{ color: C.teal }}>14</p>
            <p className="text-xs font-semibold mt-1" style={{ color: C.secondary }}>Wards Tracked</p>
            <p className="text-[10px] mt-1" style={{ color: C.muted }}>Week of Feb 24, 2026</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MovementTracker;

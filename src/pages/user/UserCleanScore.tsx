import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import { Activity, TrendingUp, MapPin, Trophy, Download, ChevronRight } from "lucide-react";
import { mockAreaScores, mockTrendData } from "@/data/mockData";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

// ── Design Tokens (matching dashboard palette) ──
const C = {
  bg: "#000000",
  card: "#101A18",
  cardBorder: "rgba(26,242,193,0.12)",
  cardGlow: "inset 0 1px 0 0 rgba(26,242,193,0.08), 0 0 30px -10px rgba(26,242,193,0.1)",
  teal: "#1AF2C1",
  lime: "#A2F21A",
  gold: "#F2C41A",
  orange: "#EA7B1A",
  offWhite: "#E8F0ED",
  muted: "rgba(232,240,237,0.4)",
  secondary: "rgba(232,240,237,0.6)",
  gridLine: "rgba(26,242,193,0.06)",
};

const glassCard = "rounded-[16px] border backdrop-blur-sm transition-all duration-300";
const cardStyle = {
  background: `linear-gradient(145deg, ${C.card} 0%, rgba(10,18,14,0.95) 100%)`,
  borderColor: C.cardBorder,
  boxShadow: C.cardGlow,
};

const topZones = [...mockAreaScores].sort((a, b) => b.score - a.score).slice(0, 5);

// ── Custom Tooltips ──
const BarTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div
        className="text-xs px-3 py-2 rounded-lg shadow-xl font-semibold"
        style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.teal }}
      >
        <p className="font-bold mb-0.5" style={{ color: C.offWhite }}>{label}</p>
        <p>Score: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const LineTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div
        className="text-xs px-3 py-2 rounded-lg shadow-xl font-semibold"
        style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.orange }}
      >
        <p className="font-bold mb-0.5" style={{ color: C.offWhite }}>{label}</p>
        <p>Score: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// ── Main Component ──
const UserCleanScore = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "CITY CLEAN SCORE",
      value: "82",
      icon: Activity,
      color: C.teal,
      gradient: `linear-gradient(135deg, rgba(26,242,193,0.12) 0%, rgba(26,242,193,0.04) 100%)`,
    },
    {
      title: "WEEKLY CHANGE",
      value: "+8%",
      icon: TrendingUp,
      color: C.lime,
      gradient: `linear-gradient(135deg, rgba(162,242,26,0.12) 0%, rgba(162,242,26,0.04) 100%)`,
    },
    {
      title: "AREAS TRACKED",
      value: "24",
      icon: MapPin,
      color: C.teal,
      gradient: `linear-gradient(135deg, rgba(26,242,193,0.12) 0%, rgba(26,242,193,0.04) 100%)`,
    },
    {
      title: "CLEANEST AREA",
      value: "Downtown",
      icon: Trophy,
      color: C.gold,
      gradient: `linear-gradient(135deg, rgba(242,196,26,0.12) 0%, rgba(242,196,26,0.04) 100%)`,
    },
  ];

  return (
    <div
      className="p-4 lg:p-6 min-h-screen font-['Inter',sans-serif]"
      style={{ background: C.bg }}
    >
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: C.offWhite }}>
          City Clean Score Dashboard
        </h1>
        <p className="text-xs mt-1 font-medium italic" style={{ color: C.teal }}>
          Real-time cleanliness analytics for city management.
        </p>
      </motion.div>

      {/* ── Quick Stats ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-5 grid gap-4 grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, i) => (
          <Card
            key={i}
            className={`${glassCard} group hover:scale-[1.02] cursor-default`}
            style={{
              ...cardStyle,
              borderColor: `${stat.color}20`,
            }}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p
                  className="text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5"
                  style={{ color: C.muted }}
                >
                  {stat.title}
                </p>
                <p className="text-2xl md:text-3xl font-bold leading-none" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-2.5 rounded-xl"
                style={{ background: stat.gradient }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </motion.div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* ── Charts Row ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-5 grid gap-4 lg:grid-cols-2"
      >
        {/* Area-wise Bar Chart */}
        <Card className={glassCard} style={cardStyle}>
          <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-1 h-4 rounded-full"
                style={{ background: C.teal }}
              />
              <CardTitle className="text-xs font-bold" style={{ color: C.offWhite }}>
                Area-wise Clean Score
              </CardTitle>
            </div>
            <button
              className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-md transition-colors"
              style={{
                color: C.teal,
                background: "rgba(26,242,193,0.06)",
                border: `1px solid ${C.cardBorder}`,
              }}
            >
              View Details <ChevronRight className="h-3 w-3" />
            </button>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockAreaScores}
                  margin={{ top: 10, right: 10, left: -25, bottom: 30 }}
                  barSize={28}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={C.gridLine}
                  />
                  <XAxis
                    dataKey="area"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: C.muted, fontWeight: 600 }}
                    angle={-40}
                    textAnchor="end"
                    dy={8}
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: C.muted }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(26,242,193,0.04)" }}
                    content={<BarTooltip />}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {mockAreaScores.map((_, index) => (
                      <motion.rect
                        key={index}
                        fill={C.teal}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: index * 0.08 }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Trend */}
        <Card className={glassCard} style={cardStyle}>
          <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-1 h-4 rounded-full"
                style={{ background: C.orange }}
              />
              <CardTitle className="text-xs font-bold" style={{ color: C.offWhite }}>
                7-Day Trend
              </CardTitle>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: C.orange }} />
              <span className="text-[10px] font-semibold" style={{ color: C.secondary }}>
                Score Trend
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockTrendData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={C.gridLine}
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: C.muted, fontWeight: 600 }}
                    dy={5}
                  />
                  <YAxis
                    domain={[60, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: C.muted }}
                  />
                  <Tooltip content={<LineTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={C.orange}
                    strokeWidth={2.5}
                    dot={{ fill: C.orange, r: 4, stroke: C.card, strokeWidth: 2 }}
                    activeDot={{
                      r: 7,
                      fill: C.orange,
                      stroke: C.offWhite,
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Top 5 Clean Zones Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className={glassCard} style={cardStyle}>
          <CardHeader className="p-4 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2.5">
              <div
                className="p-1.5 rounded-lg"
                style={{ background: "rgba(242,196,26,0.12)" }}
              >
                <Trophy className="h-4 w-4" style={{ color: C.gold }} />
              </div>
              <span className="text-sm font-bold" style={{ color: C.offWhite }}>
                Top 5 Clean Zones
              </span>
            </CardTitle>
            <button
              className="flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded-md transition-colors"
              style={{
                color: C.secondary,
                background: "rgba(26,242,193,0.04)",
                border: `1px solid ${C.cardBorder}`,
              }}
            >
              <Download className="h-3 w-3" />
              Export Data
            </button>
          </CardHeader>
          <CardContent className="p-0 pb-2">
            <Table>
              <TableHeader>
                <TableRow
                  className="border-b hover:bg-transparent"
                  style={{ borderColor: C.cardBorder }}
                >
                  <TableHead
                    className="w-16 text-[10px] font-bold uppercase tracking-[0.12em] py-3 px-4"
                    style={{ color: C.muted }}
                  >
                    Rank
                  </TableHead>
                  <TableHead
                    className="text-[10px] font-bold uppercase tracking-[0.12em] py-3"
                    style={{ color: C.muted }}
                  >
                    Area Name
                  </TableHead>
                  <TableHead
                    className="text-[10px] font-bold uppercase tracking-[0.12em] py-3"
                    style={{ color: C.muted }}
                  >
                    Cleanliness Score
                  </TableHead>
                  <TableHead
                    className="text-right text-[10px] font-bold uppercase tracking-[0.12em] py-3 pr-4"
                    style={{ color: C.muted }}
                  >
                    Status Label
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topZones.map((zone, i) => {
                  const statusColor =
                    zone.score >= 90
                      ? C.teal
                      : zone.score >= 85
                        ? C.lime
                        : zone.score >= 80
                          ? C.gold
                          : C.orange;
                  const statusText =
                    zone.score >= 90
                      ? "Excellent"
                      : zone.score >= 85
                        ? "Good"
                        : zone.score >= 80
                          ? "Good"
                          : "Average";

                  return (
                    <motion.tr
                      key={zone.area}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 + 0.4 }}
                      className="border-b transition-colors hover:bg-[rgba(26,242,193,0.03)]"
                      style={{ borderColor: "rgba(26,242,193,0.06)" }}
                    >
                      <TableCell className="py-3.5 px-4">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold"
                          style={{
                            background:
                              i === 0
                                ? "rgba(242,196,26,0.15)"
                                : "rgba(26,242,193,0.08)",
                            color: i === 0 ? C.gold : C.teal,
                            border: `1px solid ${i === 0 ? "rgba(242,196,26,0.3)" : C.cardBorder
                              }`,
                          }}
                        >
                          0{i + 1}
                        </div>
                      </TableCell>
                      <TableCell
                        className="py-3.5 text-sm font-semibold"
                        style={{ color: C.offWhite }}
                      >
                        {zone.area}
                      </TableCell>
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-3">
                          <span
                            className="text-sm font-bold w-7"
                            style={{ color: C.offWhite }}
                          >
                            {zone.score}
                          </span>
                          <div
                            className="h-2 w-24 overflow-hidden rounded-full"
                            style={{ background: "rgba(26,242,193,0.08)" }}
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${zone.score}%` }}
                              transition={{
                                delay: i * 0.1 + 0.5,
                                duration: 0.6,
                                ease: "easeOut",
                              }}
                              className="h-full rounded-full"
                              style={{
                                background: `linear-gradient(90deg, ${statusColor}90, ${statusColor})`,
                                boxShadow: `0 0 8px ${statusColor}40`,
                              }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-3.5 pr-4">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            background: `${statusColor}12`,
                            color: statusColor,
                            border: `1px solid ${statusColor}25`,
                          }}
                        >
                          {statusText}
                        </span>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserCleanScore;

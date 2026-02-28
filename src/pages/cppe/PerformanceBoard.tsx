import { useState } from "react";
import {
  Trophy, TrendingUp, TrendingDown, BarChart3, Activity, ArrowUp, ArrowDown,
  Minus, ChevronDown, Search, Medal, AlertTriangle
} from "lucide-react";

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
  { label: "Leading Ward", value: "Anna Nagar", sub: "CRI: 94.2 • Rank #1", icon: Trophy, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  { label: "Most Improved", value: "SS Colony", sub: "+5.6% • Up 3 positions", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  { label: "Lowest Ranked", value: "Palanganatham", sub: "CRI: 38.6 • -2.2%", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
  { label: "City Average CRI", value: "70.0", sub: "Across 14 wards", icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  { label: "Avg Weekly Movement", value: "+0.9%", sub: "Week of Feb 24", icon: Activity, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
];

const getStatusLabel = (rank: number, movement: number) => {
  if (rank <= 3) return { label: "Leading", color: "bg-emerald-50 text-emerald-700 border-emerald-100" };
  if (movement >= 0) return { label: "Stable", color: "bg-blue-50 text-blue-700 border-blue-100" };
  return { label: "Needs Improvement", color: "bg-amber-50 text-amber-700 border-amber-100" };
};

const getRankAccent = (rank: number, total: number) => {
  if (rank === 1) return "bg-amber-50/40 border-l-4 border-l-amber-400";
  if (rank === 2) return "bg-gray-50/40 border-l-4 border-l-gray-300";
  if (rank === 3) return "bg-orange-50/40 border-l-4 border-l-orange-300";
  if (rank > total - 3) return "bg-red-50/20 border-l-4 border-l-red-200";
  return "";
};

const PerformanceBoard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = wardData.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Performance Board</h1>
        <p className="text-sm text-gray-500 mt-0.5">Ward-level civic performance transparency — Week of Feb 24, 2026</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`bg-white rounded-xl border ${kpi.border} p-4 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </div>
            <p className="text-lg font-bold text-gray-900 leading-tight">{kpi.value}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{kpi.label}</p>
            <p className={`text-[11px] mt-1 font-medium ${kpi.color}`}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="Search ward..."
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
      </div>

      {/* Ranking Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Rank</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ward Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">CRI</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Weekly Change</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Movement</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ward) => {
                const status = getStatusLabel(ward.rank, ward.movement);
                const accent = getRankAccent(ward.rank, wardData.length);
                return (
                  <tr key={ward.rank} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${accent}`}>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${
                        ward.rank === 1 ? "bg-amber-100 text-amber-700 border border-amber-200" :
                        ward.rank === 2 ? "bg-gray-100 text-gray-600 border border-gray-200" :
                        ward.rank === 3 ? "bg-orange-100 text-orange-700 border border-orange-200" :
                        "bg-gray-50 text-gray-600 border border-gray-100"
                      }`}>
                        {ward.rank}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{ward.name}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-bold text-gray-900">{ward.cri}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-sm font-semibold ${ward.weeklyChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {ward.weeklyChange >= 0 ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
                        {ward.weeklyChange >= 0 ? "+" : ""}{ward.weeklyChange}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {ward.movement > 0 ? (
                          <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                            <ArrowUp className="h-3.5 w-3.5" /> +{ward.movement}
                          </span>
                        ) : ward.movement < 0 ? (
                          <span className="flex items-center gap-1 text-sm font-semibold text-red-500">
                            <ArrowDown className="h-3.5 w-3.5" /> {ward.movement}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-sm font-medium text-gray-400">
                            <Minus className="h-3.5 w-3.5" /> —
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decline Alerts */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Performance Observations</h2>
        {wardData.filter(w => w.weeklyChange < -2).map(ward => (
          <div key={ward.name} className="bg-white rounded-xl border border-red-100 p-4 shadow-sm flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-50 mt-0.5">
              <TrendingDown className="h-4 w-4 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Performance Decline — {ward.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {ward.name} decreased by {Math.abs(ward.weeklyChange)}% compared to last week
                {ward.movement < 0 ? ` and moved down ${Math.abs(ward.movement)} position${Math.abs(ward.movement) > 1 ? "s" : ""}` : ""}.
                Increased community participation is recommended.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceBoard;

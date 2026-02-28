import { useState } from "react";
import {
  Trophy, Search, ChevronDown, TrendingUp, ArrowUp, ArrowDown, Filter,
  Building2, Medal
} from "lucide-react";

const wardData = [
  { rank: 1, name: "Anna Nagar", cleanScore: 96, resolution: 94, participation: 91, cri: 94.2, trend: 3.1 },
  { rank: 2, name: "KK Nagar", cleanScore: 92, resolution: 93, participation: 89, cri: 91.8, trend: 1.8 },
  { rank: 3, name: "Teppakulam", cleanScore: 90, resolution: 91, participation: 86, cri: 89.5, trend: 2.4 },
  { rank: 4, name: "Goripalayam", cleanScore: 87, resolution: 88, participation: 82, cri: 86.0, trend: 1.2 },
  { rank: 5, name: "Simmakkal", cleanScore: 85, resolution: 86, participation: 80, cri: 84.1, trend: -0.5 },
  { rank: 6, name: "SS Colony", cleanScore: 82, resolution: 80, participation: 78, cri: 80.2, trend: 2.8 },
  { rank: 7, name: "Thirunagar", cleanScore: 76, resolution: 72, participation: 68, cri: 72.4, trend: 1.5 },
  { rank: 8, name: "Vilangudi", cleanScore: 72, resolution: 70, participation: 65, cri: 69.4, trend: 3.2 },
  { rank: 9, name: "Tallakulam", cleanScore: 70, resolution: 68, participation: 62, cri: 67.0, trend: -1.2 },
  { rank: 10, name: "Arasaradi", cleanScore: 65, resolution: 60, participation: 58, cri: 61.2, trend: 0.8 },
  { rank: 11, name: "Periyar", cleanScore: 58, resolution: 55, participation: 50, cri: 54.6, trend: -2.1 },
  { rank: 12, name: "Bibikulam", cleanScore: 52, resolution: 48, participation: 45, cri: 48.8, trend: -3.0 },
  { rank: 13, name: "Mattuthavani", cleanScore: 45, resolution: 42, participation: 40, cri: 42.6, trend: 1.0 },
  { rank: 14, name: "Palanganatham", cleanScore: 40, resolution: 38, participation: 36, cri: 38.6, trend: -1.5 },
];

const getStatusBadge = (cri: number) => {
  if (cri >= 80) return { label: "High Reputation", color: "bg-emerald-50 text-emerald-700 border-emerald-100" };
  if (cri >= 50) return { label: "Moderate", color: "bg-amber-50 text-amber-700 border-amber-100" };
  return { label: "Needs Improvement", color: "bg-red-50 text-red-700 border-red-100" };
};

const getRankStyle = (rank: number) => {
  if (rank === 1) return "bg-amber-50/50 border-amber-100";
  if (rank === 2) return "bg-gray-50/50 border-gray-100";
  if (rank === 3) return "bg-orange-50/50 border-orange-100";
  return "";
};

const getRankBadge = (rank: number) => {
  if (rank === 1) return "bg-amber-100 text-amber-700 border-amber-200";
  if (rank === 2) return "bg-gray-100 text-gray-700 border-gray-200";
  if (rank === 3) return "bg-orange-100 text-orange-700 border-orange-200";
  return "bg-gray-50 text-gray-600 border-gray-100";
};

const WardRankings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "high" | "moderate" | "low">("all");

  const filtered = wardData
    .filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(w => {
      if (statusFilter === "high") return w.cri >= 80;
      if (statusFilter === "moderate") return w.cri >= 50 && w.cri < 80;
      if (statusFilter === "low") return w.cri < 50;
      return true;
    });

  const filterBtns = [
    { id: "all", label: "All Wards" },
    { id: "high", label: "🟢 High" },
    { id: "moderate", label: "🟡 Moderate" },
    { id: "low", label: "🔴 Low" },
  ] as const;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            Ward Rankings
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Civic Reputation Index — All {wardData.length} wards</p>
        </div>
      </div>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {wardData.slice(0, 3).map((ward, i) => {
          const colors = [
            { ring: "ring-amber-300", icon: "text-amber-500", bg: "bg-amber-50", label: "1st" },
            { ring: "ring-gray-300", icon: "text-gray-400", bg: "bg-gray-50", label: "2nd" },
            { ring: "ring-orange-300", icon: "text-orange-400", bg: "bg-orange-50", label: "3rd" },
          ][i];
          return (
            <div key={ward.rank} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className={`mx-auto w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center ring-2 ${colors.ring} mb-3`}>
                <Medal className={`h-6 w-6 ${colors.icon}`} />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{colors.label} Place</p>
              <h3 className="font-bold text-gray-900">{ward.name}</h3>
              <div className="mt-3 flex items-center justify-center gap-4">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{ward.cri}</p>
                  <p className="text-xs text-gray-400">CRI Score</p>
                </div>
                <div className="h-8 w-px bg-gray-100" />
                <div>
                  <p className={`text-sm font-bold ${ward.trend > 0 ? "text-emerald-600" : "text-red-500"} flex items-center gap-0.5`}>
                    {ward.trend > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {ward.trend > 0 ? "+" : ""}{ward.trend}%
                  </p>
                  <p className="text-xs text-gray-400">Trend</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search ward..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterBtns.map((btn) => (
            <button key={btn.id} onClick={() => setStatusFilter(btn.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${statusFilter === btn.id
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Rank</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ward Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Clean Score</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resolution %</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Participation %</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">CRI <ChevronDown className="h-3 w-3" /></span>
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ward) => {
                const status = getStatusBadge(ward.cri);
                return (
                  <tr key={ward.rank} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${ward.rank <= 3 ? getRankStyle(ward.rank) : ""}`}>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-bold ${getRankBadge(ward.rank)}`}>
                        {ward.rank}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{ward.name}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-400 rounded-full" style={{ width: `${ward.cleanScore}%` }} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{ward.cleanScore}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${ward.resolution}%` }} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{ward.resolution}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: `${ward.participation}%` }} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{ward.participation}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-gray-900">{ward.cri}</span>
                        <span className={`text-xs font-medium ${ward.trend > 0 ? "text-emerald-600" : "text-red-500"}`}>
                          {ward.trend > 0 ? "+" : ""}{ward.trend}%
                        </span>
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
    </div>
  );
};

export default WardRankings;

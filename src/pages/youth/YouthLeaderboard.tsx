import { useState } from "react";
import {
  Trophy, Medal, Filter, Building2, GraduationCap, Users, Search, ChevronDown,
  TrendingUp, CheckCircle2, Award
} from "lucide-react";

type FilterType = "all" | "school" | "college" | "ngo";

const leaderboardData = [
  { rank: 1, name: "St. Mary's Higher Secondary School", type: "School", points: 1250, resolved: 95, badge: "🥇 Gold" },
  { rank: 2, name: "American College", type: "College", points: 1180, resolved: 92, badge: "🥈 Silver" },
  { rank: 3, name: "Clean Madurai Foundation", type: "NGO", points: 1100, resolved: 90, badge: "🥉 Bronze" },
  { rank: 4, name: "Govt. Higher Secondary School", type: "School", points: 750, resolved: 87, badge: "⭐ Star" },
  { rank: 5, name: "Lady Doak College", type: "College", points: 720, resolved: 85, badge: "⭐ Star" },
  { rank: 6, name: "Thiagarajar College of Engineering", type: "College", points: 680, resolved: 83, badge: "⭐ Star" },
  { rank: 7, name: "Youth For Change NGO", type: "NGO", points: 640, resolved: 80, badge: "🌱 Rising" },
  { rank: 8, name: "Meenakshi Govt. Arts College", type: "College", points: 590, resolved: 78, badge: "🌱 Rising" },
  { rank: 9, name: "TVS Matriculation School", type: "School", points: 550, resolved: 75, badge: "🌱 Rising" },
  { rank: 10, name: "Green Earth Initiative", type: "NGO", points: 510, resolved: 72, badge: "🌱 Rising" },
  { rank: 11, name: "Sourashtra Higher Secondary", type: "School", points: 480, resolved: 70, badge: "Participant" },
  { rank: 12, name: "Fatima College", type: "College", points: 440, resolved: 68, badge: "Participant" },
];

const filterOptions: { label: string; value: FilterType; icon: any }[] = [
  { label: "All Institutions", value: "all", icon: Building2 },
  { label: "Schools", value: "school", icon: GraduationCap },
  { label: "Colleges", value: "college", icon: Building2 },
  { label: "NGOs", value: "ngo", icon: Users },
];

const YouthLeaderboard = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = leaderboardData
    .filter(item => filter === "all" || item.type.toLowerCase() === filter)
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200";
    if (rank === 2) return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200";
    if (rank === 3) return "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200";
    return "bg-white border-gray-100";
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-amber-100 text-amber-700 border-amber-200";
    if (rank === 2) return "bg-gray-100 text-gray-700 border-gray-200";
    if (rank === 3) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-gray-50 text-gray-600 border-gray-100";
  };

  const getTypeColor = (type: string) => {
    if (type === "School") return "bg-blue-50 text-blue-700 border-blue-100";
    if (type === "College") return "bg-purple-50 text-purple-700 border-purple-100";
    return "bg-teal-50 text-teal-700 border-teal-100";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            City Leaderboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Rankings across all participating institutions</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
            <span className="text-sm font-bold text-emerald-600">{leaderboardData.length} Institutions</span>
          </div>
        </div>
      </div>

      {/* Top 3 Highlight */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {leaderboardData.slice(0, 3).map((item, i) => {
          const colors = [
            { ring: "ring-amber-300", icon: "text-amber-500", bg: "bg-amber-50", label: "1st Place" },
            { ring: "ring-gray-300", icon: "text-gray-400", bg: "bg-gray-50", label: "2nd Place" },
            { ring: "ring-orange-300", icon: "text-orange-400", bg: "bg-orange-50", label: "3rd Place" },
          ][i];
          return (
            <div key={item.rank} className={`relative bg-white rounded-xl border border-gray-100 p-5 shadow-sm text-center hover:shadow-md transition-shadow`}>
              <div className={`mx-auto w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center ring-2 ${colors.ring} mb-3`}>
                <Medal className={`h-6 w-6 ${colors.icon}`} />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{colors.label}</p>
              <h3 className="font-bold text-gray-900 text-sm leading-tight">{item.name}</h3>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold border ${getTypeColor(item.type)}`}>{item.type}</span>
              <div className="mt-3 flex items-center justify-center gap-4">
                <div>
                  <p className="text-xl font-bold text-emerald-600">{item.points}</p>
                  <p className="text-xs text-gray-400">Points</p>
                </div>
                <div className="h-8 w-px bg-gray-100" />
                <div>
                  <p className="text-xl font-bold text-blue-600">{item.resolved}%</p>
                  <p className="text-xs text-gray-400">Resolved</p>
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
          <input type="text" placeholder="Search institution..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((opt) => (
            <button key={opt.value} onClick={() => setFilter(opt.value)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${filter === opt.value
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              <opt.icon className="h-3.5 w-3.5" />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Rank</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Institution</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">Points <ChevronDown className="h-3 w-3" /></span>
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resolved %</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Badge</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.rank} className={`border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50/50 ${item.rank <= 3 ? getRankStyle(item.rank) : ""}`}>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-bold ${getRankBadge(item.rank)}`}>
                      {item.rank}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{item.name}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${getTypeColor(item.type)}`}>{item.type}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-bold text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />{item.points}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${item.resolved}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">{item.resolved}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm">{item.badge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default YouthLeaderboard;

import { useState } from "react";
import {
  Trophy, TrendingUp, Users, CheckCircle2, Trash2, TreePine, Megaphone, Camera,
  Calendar, Clock, ChevronRight, Target, Award, Flame
} from "lucide-react";

// Mock data
const kpis = [
  { label: "Total Points", value: "750", icon: Trophy, color: "text-emerald-600", bg: "bg-emerald-50", change: "+120 this month" },
  { label: "City Rank", value: "#4", icon: Award, color: "text-amber-600", bg: "bg-amber-50", change: "Up 2 places" },
  { label: "Resolved Reports", value: "87%", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50", change: "+5% from last month" },
  { label: "Active Members", value: "156", icon: Users, color: "text-purple-600", bg: "bg-purple-50", change: "12 new this week" },
  { label: "Waste Cleared", value: "2.4 T", icon: Trash2, color: "text-rose-600", bg: "bg-rose-50", change: "~2,400 kg total" },
];

const scoringRules = [
  { action: "Waste Report Submitted", points: 5, icon: Trash2 },
  { action: "Validated Report", points: 10, icon: CheckCircle2 },
  { action: "Cleanup Drive", points: 50, icon: Trash2 },
  { action: "Awareness Campaign", points: 40, icon: Megaphone },
  { action: "Tree Plantation", points: 30, icon: TreePine },
  { action: "Unresolved Complaint", points: -5, icon: Clock },
];

const recentActivities = [
  { type: "Cleanup Drive", date: "2026-02-27", points: 50, status: "approved" },
  { type: "Awareness Campaign", date: "2026-02-25", points: 40, status: "approved" },
  { type: "Tree Plantation", date: "2026-02-23", points: 30, status: "pending" },
  { type: "Waste Report", date: "2026-02-22", points: 10, status: "approved" },
  { type: "Cleanup Drive", date: "2026-02-20", points: 50, status: "pending" },
  { type: "Awareness Campaign", date: "2026-02-18", points: 40, status: "approved" },
];

const activityButtons = [
  { label: "Submit Cleanup Drive", icon: Trash2, color: "bg-emerald-600 hover:bg-emerald-700" },
  { label: "Upload Before/After", icon: Camera, color: "bg-blue-600 hover:bg-blue-700" },
  { label: "Log Awareness Campaign", icon: Megaphone, color: "bg-amber-600 hover:bg-amber-700" },
  { label: "Tree Plantation Drive", icon: TreePine, color: "bg-teal-600 hover:bg-teal-700" },
];

const badges = [
  { name: "First Report", earned: true },
  { name: "10 Reports", earned: true },
  { name: "Cleanup Hero", earned: true },
  { name: "Green Champion", earned: false },
  { name: "100 Reports", earned: false },
];

const YouthDashboard = () => {
  const [monthlyTarget] = useState({ current: 750, target: 1000 });
  const [streak] = useState(12);
  const progress = (monthlyTarget.current / monthlyTarget.target) * 100;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Institution Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Govt. Higher Secondary School, Madurai • Ward 15</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-bold text-orange-600">{streak}-day streak</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
            <span className="text-sm font-bold text-emerald-600">Code: NM-SCH-A3F2K9</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{kpi.label}</p>
            <p className="text-xs text-emerald-600 mt-1 font-medium">{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Monthly Target Progress */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-600" />
            <h2 className="font-bold text-gray-900">Monthly Target Progress</h2>
          </div>
          <span className="text-sm font-bold text-emerald-600">{monthlyTarget.current} / {monthlyTarget.target} Points</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-gray-500 mt-2">{(100 - progress).toFixed(0)}% remaining to reach your monthly goal</p>
      </div>

      {/* Activity Buttons + Scoring Rules */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Log Activity */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Log Activity</h2>
          <div className="grid grid-cols-2 gap-3">
            {activityButtons.map((btn) => (
              <button key={btn.label}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm ${btn.color}`}>
                <btn.icon className="h-4 w-4" />
                <span className="text-left text-xs sm:text-sm leading-tight">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scoring Rules */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Scoring System</h2>
          <div className="space-y-2.5">
            {scoringRules.map((rule) => (
              <div key={rule.action} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2.5">
                  <rule.icon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{rule.action}</span>
                </div>
                <span className={`text-sm font-bold ${rule.points > 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {rule.points > 0 ? "+" : ""}{rule.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4">Achievement Badges</h2>
        <div className="flex flex-wrap gap-3">
          {badges.map((badge) => (
            <div key={badge.name}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${badge.earned
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-gray-50 border-gray-200 text-gray-400"}`}>
              <Award className={`h-3.5 w-3.5 ${badge.earned ? "text-emerald-500" : "text-gray-300"}`} />
              {badge.name}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Activities</h2>
          <button className="text-sm text-emerald-600 font-semibold hover:underline flex items-center gap-1">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Activity Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Points</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((activity, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{activity.type}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />{activity.date}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-bold text-emerald-600">+{activity.points}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${activity.status === "approved"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-amber-50 text-amber-700 border border-amber-100"}`}>
                      {activity.status === "approved" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {activity.status === "approved" ? "Approved" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default YouthDashboard;

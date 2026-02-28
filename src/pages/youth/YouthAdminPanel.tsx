import { useState } from "react";
import {
  Shield, CheckCircle2, XCircle, Clock, Building2, Search, Download,
  Eye, Edit3, MoreHorizontal, Filter, ChevronDown, Activity,
  TrendingUp, Users, FileText, Calendar, AlertTriangle
} from "lucide-react";

// Mock data
const institutions = [
  { id: 1, name: "St. Mary's Higher Secondary School", type: "School", ward: "Ward 5", status: "approved", date: "2026-02-15", points: 1250 },
  { id: 2, name: "American College", type: "College", ward: "Ward 12", status: "approved", date: "2026-02-14", points: 1180 },
  { id: 3, name: "Green Earth Initiative", type: "NGO", ward: "Ward 8", status: "pending", date: "2026-02-27", points: 0 },
  { id: 4, name: "Govt. Higher Secondary School", type: "School", ward: "Ward 15", status: "approved", date: "2026-02-10", points: 750 },
  { id: 5, name: "Eco Warriors Foundation", type: "NGO", ward: "Ward 22", status: "rejected", date: "2026-02-25", points: 0 },
  { id: 6, name: "Fatima College", type: "College", ward: "Ward 3", status: "pending", date: "2026-02-26", points: 0 },
];

const pendingActivities = [
  { id: 1, institution: "Govt. Higher Secondary School", type: "Cleanup Drive", date: "2026-02-27", points: 50, evidence: true },
  { id: 2, institution: "American College", type: "Tree Plantation", date: "2026-02-26", points: 30, evidence: true },
  { id: 3, institution: "St. Mary's School", type: "Awareness Campaign", date: "2026-02-25", points: 40, evidence: false },
  { id: 4, institution: "Lady Doak College", type: "Waste Report", date: "2026-02-25", points: 10, evidence: true },
];

const activityLogs = [
  { time: "2 min ago", action: "Approved institution registration", target: "Green Earth Initiative", user: "Admin" },
  { time: "15 min ago", action: "Approved cleanup drive", target: "American College", user: "Admin" },
  { time: "1 hr ago", action: "Adjusted points (+20)", target: "St. Mary's School", user: "Admin" },
  { time: "2 hrs ago", action: "Rejected registration", target: "Invalid NGO Submission", user: "Admin" },
  { time: "3 hrs ago", action: "Exported monthly report", target: "February 2026", user: "Admin" },
];

const adminKpis = [
  { label: "Total Institutions", value: "47", icon: Building2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Pending Approvals", value: "3", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Active Activities", value: "128", icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Total Points Issued", value: "24.5K", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
];

const YouthAdminPanel = () => {
  const [activeTab, setActiveTab] = useState<"institutions" | "activities" | "logs">("institutions");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
      pending: "bg-amber-50 text-amber-700 border-amber-100",
      rejected: "bg-red-50 text-red-700 border-red-100",
    };
    const icons = { approved: CheckCircle2, pending: Clock, rejected: XCircle };
    const Icon = icons[status as keyof typeof icons] || Clock;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredInstitutions = institutions.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const tabs = [
    { id: "institutions", label: "Institutions", icon: Building2 },
    { id: "activities", label: "Activity Submissions", icon: FileText },
    { id: "logs", label: "Activity Logs", icon: Activity },
  ] as const;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-600" />
            Admin Oversight Panel
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage institutions, activities, and program performance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 shadow-sm transition-colors">
          <Download className="h-4 w-4" /> Export Monthly Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {adminKpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === tab.id
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"}`}>
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Institutions Tab */}
      {activeTab === "institutions" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search institutions..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50">
              <Filter className="h-3.5 w-3.5" /> Filter <ChevronDown className="h-3 w-3" />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Institution</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ward</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Points</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInstitutions.map((inst) => (
                    <tr key={inst.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{inst.name}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{inst.type}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{inst.ward}</td>
                      <td className="px-5 py-3.5">{getStatusBadge(inst.status)}</td>
                      <td className="px-5 py-3.5 text-sm font-bold text-emerald-600">{inst.points || "–"}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          {inst.status === "pending" && (
                            <>
                              <button className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors" title="Approve">
                                <CheckCircle2 className="h-4 w-4" />
                              </button>
                              <button className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Reject">
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="View">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="Edit">
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Activity Submissions Tab */}
      {activeTab === "activities" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Pending Activity Approvals</h2>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-xs font-bold text-amber-600">
              {pendingActivities.length} pending
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Institution</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Points</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Evidence</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingActivities.map((act) => (
                  <tr key={act.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{act.institution}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{act.type}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />{act.date}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-bold text-emerald-600">+{act.points}</td>
                    <td className="px-5 py-3.5">
                      {act.evidence ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" /> Uploaded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                          <AlertTriangle className="h-3 w-3" /> Missing
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors" title="Approve">
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Reject">
                          <XCircle className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors" title="More">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Logs Tab */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">Recent Activity Logs</h2>
          <div className="space-y-3">
            {activityLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="p-1.5 rounded-lg bg-white border border-gray-100 mt-0.5">
                  <Activity className="h-3.5 w-3.5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{log.action}</span>
                    <span className="text-gray-500"> — {log.target}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{log.time} • by {log.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default YouthAdminPanel;

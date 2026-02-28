import {
  Trophy, AlertTriangle, BarChart3, TrendingUp, Building2, Info, ChevronRight,
  Target, Award, ArrowUp, ArrowDown
} from "lucide-react";

const topWards = [
  { rank: 1, name: "Anna Nagar", cri: 94.2, trend: "+3.1%" },
  { rank: 2, name: "KK Nagar", cri: 91.8, trend: "+1.8%" },
  { rank: 3, name: "Teppakulam", cri: 89.5, trend: "+2.4%" },
];

const kpis = [
  { label: "Highest Ranked Ward", value: "Anna Nagar", sub: "CRI: 94.2", icon: Trophy, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  { label: "Lowest Ranked Ward", value: "Palanganatham", sub: "CRI: 38.6", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
  { label: "City Average CRI", value: "72.4", sub: "Out of 100", icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  { label: "Monthly Improvement", value: "+4.2%", sub: "vs. January 2026", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  { label: "Wards Evaluated", value: "72", sub: "All wards active", icon: Building2, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
];

const recentChanges = [
  { ward: "SS Colony", from: 61, to: 74, change: "+13" },
  { ward: "Vilangudi", from: 55, to: 68, change: "+13" },
  { ward: "Bibikulam", from: 72, to: 66, change: "-6" },
  { ward: "Thirunagar", from: 48, to: 59, change: "+11" },
  { ward: "Tallakulam", from: 80, to: 77, change: "-3" },
];

const CRIOverview = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Civic Reputation Index</h1>
        <p className="text-sm text-gray-500 mt-0.5">Ward-level performance scoring for Madurai Corporation</p>
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
            <p className="text-xl font-bold text-gray-900 leading-tight">{kpi.value}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{kpi.label}</p>
            <p className={`text-xs mt-1 font-medium ${kpi.color}`}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Formula + Top 3 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* CRI Formula */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-emerald-600" />
            <h2 className="font-bold text-gray-900">CRI Calculation Formula</h2>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 font-mono text-sm">
            <p className="text-gray-600 mb-3 font-sans text-xs uppercase tracking-wider font-semibold">Civic Reputation Index (CRI)</p>
            <div className="space-y-1.5 text-gray-800">
              <p className="font-bold text-base">CRI =</p>
              <p className="pl-4">(Resolution Efficiency × <span className="text-emerald-600 font-bold">0.4</span>) +</p>
              <p className="pl-4">(Citizen Participation × <span className="text-blue-600 font-bold">0.3</span>) +</p>
              <p className="pl-4">(Clean Score × <span className="text-purple-600 font-bold">0.3</span>)</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <p className="text-lg font-bold text-emerald-700">40%</p>
              <p className="text-xs text-emerald-600 font-medium">Resolution</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-lg font-bold text-blue-700">30%</p>
              <p className="text-xs text-blue-600 font-medium">Participation</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-lg font-bold text-purple-700">30%</p>
              <p className="text-xs text-purple-600 font-medium">Clean Score</p>
            </div>
          </div>
        </div>

        {/* Top 3 Wards */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <h2 className="font-bold text-gray-900">Top Performing Wards</h2>
            </div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Feb 2026</span>
          </div>
          <div className="space-y-3">
            {topWards.map((ward) => {
              const accents = [
                { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "🥇" },
                { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-600", badge: "🥈" },
                { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", badge: "🥉" },
              ];
              const a = accents[ward.rank - 1];
              return (
                <div key={ward.rank} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl ${a.bg} border ${a.border}`}>
                  <span className="text-xl">{a.badge}</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{ward.name}</p>
                    <p className="text-xs text-gray-500">Rank #{ward.rank}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${a.text}`}>{ward.cri}</p>
                    <p className="text-xs text-emerald-600 font-medium flex items-center justify-end gap-0.5">
                      <ArrowUp className="h-3 w-3" />{ward.trend}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ward of the Month + Recent Changes */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Ward of the Month */}
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h2 className="font-bold text-gray-900">Ward of the Month</h2>
            <span className="ml-auto px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700">🏆 Civic Excellence</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center border border-emerald-200">
              <Target className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Anna Nagar</h3>
              <p className="text-sm text-gray-500">Ward 15 • South Zone</p>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <p className="text-xs text-gray-400">CRI Score</p>
                  <p className="text-lg font-bold text-emerald-600">94.2</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div>
                  <p className="text-xs text-gray-400">Improvement</p>
                  <p className="text-lg font-bold text-emerald-600">+3.1%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent CRI Changes */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-bold text-gray-900">Recent CRI Changes</h2>
            <button className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-0.5">
              View All <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentChanges.map((item) => (
              <div key={item.ward} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors">
                <span className="text-sm font-medium text-gray-900">{item.ward}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{item.from} → {item.to}</span>
                  <span className={`flex items-center gap-0.5 text-xs font-bold ${Number(item.change) > 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {Number(item.change) > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRIOverview;

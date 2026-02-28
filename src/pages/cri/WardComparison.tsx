import { useState } from "react";
import { ArrowLeftRight, ArrowUp, ArrowDown, BarChart3, Target } from "lucide-react";

const wardsData: Record<string, { cleanScore: number; resolution: number; participation: number; cri: number; monthlyChange: number }> = {
  "Anna Nagar": { cleanScore: 96, resolution: 94, participation: 91, cri: 94.2, monthlyChange: 3.1 },
  "KK Nagar": { cleanScore: 92, resolution: 93, participation: 89, cri: 91.8, monthlyChange: 1.8 },
  "Teppakulam": { cleanScore: 90, resolution: 91, participation: 86, cri: 89.5, monthlyChange: 2.4 },
  "Goripalayam": { cleanScore: 87, resolution: 88, participation: 82, cri: 86.0, monthlyChange: 1.2 },
  "Simmakkal": { cleanScore: 85, resolution: 86, participation: 80, cri: 84.1, monthlyChange: -0.5 },
  "SS Colony": { cleanScore: 82, resolution: 80, participation: 78, cri: 80.2, monthlyChange: 2.8 },
  "Thirunagar": { cleanScore: 76, resolution: 72, participation: 68, cri: 72.4, monthlyChange: 1.5 },
  "Vilangudi": { cleanScore: 72, resolution: 70, participation: 65, cri: 69.4, monthlyChange: 3.2 },
  "Tallakulam": { cleanScore: 70, resolution: 68, participation: 62, cri: 67.0, monthlyChange: -1.2 },
  "Arasaradi": { cleanScore: 65, resolution: 60, participation: 58, cri: 61.2, monthlyChange: 0.8 },
  "Periyar": { cleanScore: 58, resolution: 55, participation: 50, cri: 54.6, monthlyChange: -2.1 },
  "Bibikulam": { cleanScore: 52, resolution: 48, participation: 45, cri: 48.8, monthlyChange: -3.0 },
  "Palanganatham": { cleanScore: 40, resolution: 38, participation: 36, cri: 38.6, monthlyChange: -1.5 },
};

const wardNames = Object.keys(wardsData);

const metrics = [
  { key: "cleanScore" as const, label: "Clean Score", color: "bg-purple-500", lightColor: "bg-purple-100" },
  { key: "resolution" as const, label: "Resolution %", color: "bg-emerald-500", lightColor: "bg-emerald-100" },
  { key: "participation" as const, label: "Participation %", color: "bg-blue-500", lightColor: "bg-blue-100" },
  { key: "cri" as const, label: "CRI Score", color: "bg-amber-500", lightColor: "bg-amber-100" },
  { key: "monthlyChange" as const, label: "Monthly Change", color: "", lightColor: "" },
];

const WardComparison = () => {
  const [wardA, setWardA] = useState("Anna Nagar");
  const [wardB, setWardB] = useState("Palanganatham");

  const dataA = wardsData[wardA];
  const dataB = wardsData[wardB];

  const getStatusColor = (cri: number) => {
    if (cri >= 80) return "text-emerald-600";
    if (cri >= 50) return "text-amber-600";
    return "text-red-600";
  };

  const getStatusLabel = (cri: number) => {
    if (cri >= 80) return "High Reputation";
    if (cri >= 50) return "Moderate";
    return "Needs Improvement";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <ArrowLeftRight className="h-6 w-6 text-emerald-600" />
          Ward Comparison
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Compare CRI performance between two wards</p>
      </div>

      {/* Ward Selectors */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Ward A</label>
          <select value={wardA} onChange={(e) => setWardA(e.target.value)}
            className="w-full rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
            {wardNames.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 border border-gray-200 mt-4 sm:mt-5">
          <ArrowLeftRight className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex-1 w-full">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Ward B</label>
          <select value={wardB} onChange={(e) => setWardB(e.target.value)}
            className="w-full rounded-xl border border-blue-200 bg-blue-50/50 px-4 py-3 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            {wardNames.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[{ name: wardA, data: dataA, accent: "emerald" }, { name: wardB, data: dataB, accent: "blue" }].map((ward) => (
          <div key={ward.name} className={`bg-white rounded-xl border border-gray-100 p-5 shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">{ward.name}</h3>
              <span className={`text-xs font-semibold ${getStatusColor(ward.data.cri)}`}>{getStatusLabel(ward.data.cri)}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${ward.accent === "emerald" ? "bg-emerald-50" : "bg-blue-50"}`}>
                <Target className={`h-7 w-7 ${ward.accent === "emerald" ? "text-emerald-600" : "text-blue-600"}`} />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{ward.data.cri}</p>
                <p className={`text-sm font-medium flex items-center gap-0.5 ${ward.data.monthlyChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {ward.data.monthlyChange >= 0 ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
                  {ward.data.monthlyChange >= 0 ? "+" : ""}{ward.data.monthlyChange}% this month
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Comparison */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-gray-400" />
          Metric Comparison
        </h2>
        <div className="space-y-5">
          {metrics.map((metric) => {
            const valA = dataA[metric.key];
            const valB = dataB[metric.key];
            const isChange = metric.key === "monthlyChange";
            const winner = valA > valB ? "A" : valA < valB ? "B" : "tie";

            return (
              <div key={metric.key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">{metric.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Ward A value */}
                  <div className={`text-right w-16 ${winner === "A" ? "font-bold" : "font-medium"}`}>
                    <span className={`text-sm ${isChange ? (valA >= 0 ? "text-emerald-600" : "text-red-500") : winner === "A" ? "text-emerald-600" : "text-gray-600"}`}>
                      {isChange ? (valA >= 0 ? "+" : "") : ""}{valA}{isChange ? "%" : ""}
                    </span>
                  </div>
                  {/* Progress bars */}
                  {!isChange ? (
                    <div className="flex-1 flex gap-1 items-center">
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex justify-end">
                        <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${valA}%` }} />
                      </div>
                      <div className="w-px h-6 bg-gray-300" />
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${valB as number}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center gap-4">
                      <div className={`px-3 py-1 rounded-lg text-xs font-bold ${valA >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                        {wardA}: {valA >= 0 ? "+" : ""}{valA}%
                      </div>
                      <span className="text-gray-300">vs</span>
                      <div className={`px-3 py-1 rounded-lg text-xs font-bold ${(valB as number) >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                        {wardB}: {(valB as number) >= 0 ? "+" : ""}{valB}%
                      </div>
                    </div>
                  )}
                  {/* Ward B value */}
                  <div className={`w-16 ${winner === "B" ? "font-bold" : "font-medium"}`}>
                    <span className={`text-sm ${isChange ? ((valB as number) >= 0 ? "text-emerald-600" : "text-red-500") : winner === "B" ? "text-blue-600" : "text-gray-600"}`}>
                      {isChange ? ((valB as number) >= 0 ? "+" : "") : ""}{valB}{isChange ? "%" : ""}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-gray-500">{wardA}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <span className="text-xs font-medium text-gray-500">{wardB}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardComparison;

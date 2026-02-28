import { useState } from "react";
import { TrendingUp, BarChart3, ArrowUp, ArrowDown, Calendar } from "lucide-react";

const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
const cityWideData = [64, 66, 68, 70, 71, 72.4];
const wardTrends: Record<string, number[]> = {
  "Anna Nagar": [82, 85, 88, 90, 91, 94.2],
  "KK Nagar": [80, 83, 86, 88, 90, 91.8],
  "Teppakulam": [75, 78, 82, 85, 87, 89.5],
  "Goripalayam": [70, 73, 76, 80, 83, 86.0],
  "SS Colony": [60, 63, 67, 72, 74, 80.2],
  "Palanganatham": [42, 40, 39, 38, 40, 38.6],
};

const wardNames = Object.keys(wardTrends);

const TrendAnalytics = () => {
  const [selectedWard, setSelectedWard] = useState("Anna Nagar");
  const [period, setPeriod] = useState<"6m" | "3m">("6m");
  const displayMonths = period === "3m" ? months.slice(-3) : months;

  const maxCRI = 100;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
            Trend Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">CRI performance trends over time</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPeriod("3m")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${period === "3m" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-gray-200 text-gray-600"}`}>
            3 Months
          </button>
          <button onClick={() => setPeriod("6m")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${period === "6m" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-gray-200 text-gray-600"}`}>
            6 Months
          </button>
        </div>
      </div>

      {/* City-wide CRI Progress */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            <h2 className="font-bold text-gray-900">City-wide CRI Progress</h2>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100">
            <ArrowUp className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-600">+{(cityWideData[cityWideData.length - 1] - cityWideData[0]).toFixed(1)}</span>
          </div>
        </div>
        {/* Bar chart */}
        <div className="flex items-end gap-3 h-48">
          {(period === "3m" ? cityWideData.slice(-3) : cityWideData).map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-gray-700">{val}</span>
              <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: `${(val / maxCRI) * 100}%` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg" />
              </div>
              <span className="text-xs font-medium text-gray-500">{displayMonths[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ward-specific Trend */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h2 className="font-bold text-gray-900">Ward CRI Trend</h2>
          <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 max-w-xs">
            {wardNames.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>

        {/* Line chart visualization */}
        <div className="relative h-52">
          <div className="absolute inset-0 flex items-end gap-1">
            {(period === "3m" ? wardTrends[selectedWard].slice(-3) : wardTrends[selectedWard]).map((val, i, arr) => (
              <div key={i} className="flex-1 flex flex-col items-center relative">
                {/* Point */}
                <div className="absolute" style={{ bottom: `${(val / maxCRI) * 100}%` }}>
                  <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-600 whitespace-nowrap">{val}</span>
                </div>
                {/* Bar behind */}
                <div className="w-full max-w-[40px] mx-auto rounded-t-lg opacity-20" 
                  style={{ height: `${(val / maxCRI) * 100}%`, background: 'linear-gradient(to top, #3b82f6, #60a5fa)' }} />
                <span className="text-xs font-medium text-gray-500 mt-2">{displayMonths[i]}</span>
              </div>
            ))}
          </div>
          {/* Grid lines */}
          {[25, 50, 75, 100].map(line => (
            <div key={line} className="absolute w-full border-t border-dashed border-gray-100"
              style={{ bottom: `${line}%` }}>
              <span className="absolute -left-0 -top-3 text-[10px] text-gray-300 font-medium">{line}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ward Comparison Bars */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-5">Ward Comparison — Current CRI</h2>
        <div className="space-y-3">
          {wardNames.map(name => {
            const current = wardTrends[name][wardTrends[name].length - 1];
            const prev = wardTrends[name][wardTrends[name].length - 2];
            const trend = current - prev;
            return (
              <div key={name} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-32 truncate">{name}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden relative">
                  <div className={`h-full rounded-full transition-all duration-500 ${current >= 80 ? "bg-emerald-400" : current >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                    style={{ width: `${current}%` }} />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600">{current}</span>
                </div>
                <span className={`text-xs font-bold w-12 text-right flex items-center justify-end gap-0.5 ${trend >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {trend >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {trend >= 0 ? "+" : ""}{trend.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrendAnalytics;

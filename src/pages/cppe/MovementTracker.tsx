import { ArrowUp, ArrowDown, Minus, TrendingUp, Filter } from "lucide-react";
import { useState } from "react";

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

const getMomentumColor = (change: number) => {
  if (change > 0) return { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600" };
  if (change < 0) return { bg: "bg-red-50", border: "border-red-100", text: "text-red-500" };
  return { bg: "bg-gray-50", border: "border-gray-100", text: "text-gray-400" };
};

const MovementTracker = () => {
  const [filter, setFilter] = useState<"all" | "improved" | "declined" | "stable">("all");

  const filtered = wardMovement.filter(w => {
    if (filter === "improved") return w.change > 0;
    if (filter === "declined") return w.change < 0;
    if (filter === "stable") return w.change === 0;
    return true;
  });

  const filterBtns = [
    { id: "all" as const, label: "All Wards", count: wardMovement.length },
    { id: "improved" as const, label: "↑ Improved", count: wardMovement.filter(w => w.change > 0).length },
    { id: "declined" as const, label: "↓ Declined", count: wardMovement.filter(w => w.change < 0).length },
    { id: "stable" as const, label: "— Stable", count: wardMovement.filter(w => w.change === 0).length },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-emerald-600" />
          Ward Movement Tracker
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Weekly rank and CRI changes across all wards</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-700">{wardMovement.filter(w => w.change > 0).length}</p>
          <p className="text-xs font-semibold text-emerald-600 mt-0.5">Wards Improved</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-100 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{wardMovement.filter(w => w.change < 0).length}</p>
          <p className="text-xs font-semibold text-red-500 mt-0.5">Wards Declined</p>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-600">{wardMovement.filter(w => w.change === 0).length}</p>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">Wards Stable</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filterBtns.map(btn => (
          <button key={btn.id} onClick={() => setFilter(btn.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${filter === btn.id
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}>
            {btn.label} <span className="text-xs opacity-60 ml-1">({btn.count})</span>
          </button>
        ))}
      </div>

      {/* Movement Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(ward => {
          const mc = getMomentumColor(ward.change);
          return (
            <div key={ward.name} className={`bg-white rounded-xl border ${mc.border} p-5 shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-sm">{ward.name}</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${mc.bg} ${mc.text} border ${mc.border}`}>
                  CRI: {ward.cri}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-3">
                {/* Previous → Current Rank */}
                <div className="flex items-center gap-2">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 font-medium">Prev</p>
                    <p className="text-lg font-bold text-gray-400">#{ward.prevRank}</p>
                  </div>
                  <div className="text-gray-300">→</div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 font-medium">Now</p>
                    <p className="text-lg font-bold text-gray-900">#{ward.currRank}</p>
                  </div>
                </div>

                <div className="ml-auto text-right">
                  {/* Movement */}
                  <div className={`flex items-center gap-1 justify-end ${mc.text}`}>
                    {ward.change > 0 ? <ArrowUp className="h-4 w-4" /> : ward.change < 0 ? <ArrowDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                    <span className="text-lg font-bold">
                      {ward.change > 0 ? `+${ward.change}` : ward.change === 0 ? "0" : ward.change}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">positions</p>
                </div>
              </div>

              {/* Weekly CRI Change */}
              <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${mc.bg}`}>
                <span className="text-xs font-medium text-gray-600">Weekly CRI Change</span>
                <span className={`text-sm font-bold ${ward.weeklyChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {ward.weeklyChange >= 0 ? "+" : ""}{ward.weeklyChange}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MovementTracker;

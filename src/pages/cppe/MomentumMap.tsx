import { Map, ArrowUp, ArrowDown, Minus, Info } from "lucide-react";

const wardMomentum = [
  { name: "Anna Nagar", rank: 1, prevRank: 1, cri: 94.2, weeklyChange: 3.1, tier: "Top" },
  { name: "KK Nagar", rank: 2, prevRank: 4, cri: 91.8, weeklyChange: 4.5, tier: "Top" },
  { name: "Teppakulam", rank: 3, prevRank: 3, cri: 89.5, weeklyChange: 2.4, tier: "Top" },
  { name: "Goripalayam", rank: 4, prevRank: 2, cri: 86.0, weeklyChange: -1.2, tier: "Top" },
  { name: "Simmakkal", rank: 5, prevRank: 6, cri: 84.1, weeklyChange: 1.8, tier: "Middle" },
  { name: "SS Colony", rank: 6, prevRank: 9, cri: 80.2, weeklyChange: 5.6, tier: "Middle" },
  { name: "Thirunagar", rank: 7, prevRank: 7, cri: 72.4, weeklyChange: 1.5, tier: "Middle" },
  { name: "Vilangudi", rank: 8, prevRank: 10, cri: 69.4, weeklyChange: 3.2, tier: "Middle" },
  { name: "Tallakulam", rank: 9, prevRank: 5, cri: 67.0, weeklyChange: -2.8, tier: "Middle" },
  { name: "Arasaradi", rank: 10, prevRank: 11, cri: 61.2, weeklyChange: 0.8, tier: "Middle" },
  { name: "Periyar", rank: 11, prevRank: 8, cri: 54.6, weeklyChange: -3.1, tier: "Bottom" },
  { name: "Bibikulam", rank: 12, prevRank: 12, cri: 48.8, weeklyChange: -1.5, tier: "Bottom" },
  { name: "Mattuthavani", rank: 13, prevRank: 14, cri: 42.6, weeklyChange: 1.0, tier: "Bottom" },
  { name: "Palanganatham", rank: 14, prevRank: 13, cri: 38.6, weeklyChange: -2.2, tier: "Bottom" },
];

const tierConfig = {
  Top: { color: "bg-emerald-500", label: "Top 30%", textColor: "text-emerald-700", bgLight: "bg-emerald-50", border: "border-emerald-100" },
  Middle: { color: "bg-amber-400", label: "Middle 40%", textColor: "text-amber-700", bgLight: "bg-amber-50", border: "border-amber-100" },
  Bottom: { color: "bg-red-400", label: "Bottom 30%", textColor: "text-red-600", bgLight: "bg-red-50", border: "border-red-100" },
};

const MomentumMap = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Map className="h-6 w-6 text-emerald-600" />
            Momentum Map
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Visual performance tiers for all wards</p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3">
          {Object.entries(tierConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${config.color}`} />
              <span className="text-xs font-medium text-gray-500">{config.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-800">Momentum Map Layer</p>
          <p className="text-xs text-blue-600 mt-0.5">
            Enable this layer in the Smart Map page for an interactive ward boundary view with color-coded performance tiers. 
            This page provides a summary view of all ward momentum data.
          </p>
        </div>
      </div>

      {/* Tier Sections */}
      {(["Top", "Middle", "Bottom"] as const).map(tier => {
        const config = tierConfig[tier];
        const wards = wardMomentum.filter(w => w.tier === tier);
        return (
          <div key={tier}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${config.color}`} />
              <h2 className={`text-sm font-bold uppercase tracking-wider ${config.textColor}`}>{config.label}</h2>
              <span className="text-xs text-gray-400 font-medium">({wards.length} wards)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {wards.map(ward => {
                const movement = ward.rank - ward.prevRank;
                return (
                  <div key={ward.name} className={`bg-white rounded-xl border ${config.border} p-4 shadow-sm hover:shadow-md transition-shadow`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${config.bgLight} flex items-center justify-center font-bold text-lg ${config.textColor}`}>
                          {ward.rank}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{ward.name}</h3>
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${config.bgLight} ${config.textColor}`}>{config.label}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{ward.cri}</p>
                        <p className="text-[10px] text-gray-400 font-medium">CRI Score</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-[10px] text-gray-400 font-medium">Prev Rank</p>
                          <p className="text-sm font-bold text-gray-500">#{ward.prevRank}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-medium">Current</p>
                          <p className="text-sm font-bold text-gray-900">#{ward.rank}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 font-medium">Movement</p>
                          <p className={`text-sm font-bold flex items-center gap-0.5 justify-end ${movement < 0 ? "text-emerald-600" : movement > 0 ? "text-red-500" : "text-gray-400"}`}>
                            {movement < 0 ? <ArrowUp className="h-3 w-3" /> : movement > 0 ? <ArrowDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                            {movement === 0 ? "—" : Math.abs(movement)}
                          </p>
                        </div>
                        <div className="h-6 w-px bg-gray-200" />
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 font-medium">Weekly</p>
                          <p className={`text-sm font-bold ${ward.weeklyChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {ward.weeklyChange >= 0 ? "+" : ""}{ward.weeklyChange}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MomentumMap;

import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, BarChart3, Activity, Sparkles, Info } from "lucide-react";

const insights = [
  { type: "improvement", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100",
    title: "SS Colony — Strongest Improvement",
    text: "SS Colony improved by 5.6% this week and moved up 3 positions to Rank #6. Increased community participation and waste segregation contributed to this progress." },
  { type: "improvement", icon: ArrowUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100",
    title: "KK Nagar — Rank Advancement",
    text: "KK Nagar moved up 2 positions to Rank #2 with a 4.5% weekly CRI increase. Resolution efficiency improved significantly." },
  { type: "improvement", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100",
    title: "Vilangudi — Upward Trend",
    text: "Vilangudi gained 2 positions with a 3.2% improvement. Continued momentum may bring this ward into the top quartile." },
  { type: "decline", icon: TrendingDown, color: "text-red-500", bg: "bg-red-50", border: "border-red-100",
    title: "Tallakulam — Significant Decline",
    text: "Tallakulam decreased by 2.8% and dropped 4 positions from Rank #5 to #9. Focused intervention in participation rate is recommended." },
  { type: "decline", icon: ArrowDown, color: "text-red-500", bg: "bg-red-50", border: "border-red-100",
    title: "Periyar — Continued Decline",
    text: "Periyar declined by 3.1% and dropped 3 positions. This marks the second consecutive week of decline. Community outreach may help reverse this trend." },
  { type: "citywide", icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100",
    title: "City-wide Resolution Efficiency",
    text: "City-wide resolution efficiency increased by 8% this week. 9 out of 14 wards showed positive weekly movement, indicating an overall upward civic trend." },
  { type: "citywide", icon: Activity, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100",
    title: "Participation Rate Update",
    text: "Average citizen participation across all wards rose to 68.4%, up from 65.1% last week. Digital report submissions increased by 12%." },
  { type: "milestone", icon: Sparkles, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100",
    title: "Anna Nagar — Consistency Award",
    text: "Anna Nagar has maintained Rank #1 for 6 consecutive weeks with a sustained CRI above 90. This ward sets the benchmark for civic excellence." },
];

const weeklyStats = [
  { label: "Wards with Positive Movement", value: "9 / 14", color: "text-emerald-600" },
  { label: "Average CRI Change", value: "+0.9%", color: "text-emerald-600" },
  { label: "Biggest Rank Jump", value: "SS Colony (+3)", color: "text-emerald-600" },
  { label: "Biggest Rank Drop", value: "Tallakulam (-4)", color: "text-red-500" },
];

const WeeklyHighlights = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-amber-500" />
          Weekly Highlights
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Automated civic insights — Week of February 24, 2026</p>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-gray-400" />
          <h2 className="font-bold text-gray-900 text-sm">Week Summary</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {weeklyStats.map(stat => (
            <div key={stat.label} className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insight Cards */}
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className={`bg-white rounded-xl border ${insight.border} p-5 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow`}>
            <div className={`p-2.5 rounded-xl ${insight.bg} mt-0.5 flex-shrink-0`}>
              <insight.icon className={`h-5 w-5 ${insight.color}`} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{insight.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{insight.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-center">
        <p className="text-xs text-gray-400 font-medium">
          Insights are automatically generated based on weekly civic data. All comparisons are intended to promote positive engagement and constructive improvement.
        </p>
      </div>
    </div>
  );
};

export default WeeklyHighlights;

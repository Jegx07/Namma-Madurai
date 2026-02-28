import { useState } from "react";
import {
  Award, Trophy, Star, Download, X, Building2, GraduationCap, Users, Sparkles,
  Medal, Leaf, TreePine
} from "lucide-react";

const awardCategories = [
  {
    title: "Cleanest School",
    icon: GraduationCap,
    winner: "St. Mary's Higher Secondary School",
    score: 1250,
    badge: "🏫 Excellence in School Cleanliness",
    color: "from-emerald-500 to-green-600",
    lightBg: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  {
    title: "Cleanest College",
    icon: Building2,
    winner: "American College",
    score: 1180,
    badge: "🎓 Top College Contributor",
    color: "from-blue-500 to-indigo-600",
    lightBg: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    title: "Cleanest NGO",
    icon: Users,
    winner: "Clean Madurai Foundation",
    score: 1100,
    badge: "🤝 Outstanding NGO Impact",
    color: "from-purple-500 to-violet-600",
    lightBg: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    title: "Most Active Institution",
    icon: Sparkles,
    winner: "Lady Doak College",
    score: 960,
    badge: "⚡ Most Active Participant",
    color: "from-amber-500 to-orange-600",
    lightBg: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    title: "Green Innovation Award",
    icon: TreePine,
    winner: "Thiagarajar College of Engineering",
    score: 890,
    badge: "🌿 Innovation in Sustainability",
    color: "from-teal-500 to-emerald-600",
    lightBg: "bg-teal-50",
    borderColor: "border-teal-200",
  },
];

const YouthAwards = () => {
  const [selectedAward, setSelectedAward] = useState<typeof awardCategories[0] | null>(null);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 mb-4">
          <Trophy className="h-3.5 w-3.5 text-amber-600" />
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">February 2026</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Awards & Recognition</h1>
        <p className="mt-2 text-sm text-gray-500">Celebrating outstanding contributions to civic cleanliness</p>
      </div>

      {/* Award Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {awardCategories.map((award) => (
          <div key={award.title}
            className={`group relative bg-white rounded-xl border ${award.borderColor} p-6 shadow-sm hover:shadow-md transition-all cursor-pointer`}
            onClick={() => setSelectedAward(award)}>
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${award.lightBg}`}>
                <award.icon className="h-5 w-5 text-gray-600" />
              </div>
              <Medal className="h-5 w-5 text-amber-400" />
            </div>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{award.title}</p>
            <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2">{award.winner}</h3>

            <div className="flex items-center gap-2 mb-4">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs text-gray-500">{award.badge}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="text-lg font-bold text-gray-900">{award.score}</span>
                <span className="text-xs text-gray-400 ml-1">points</span>
              </div>
              <button className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors opacity-0 group-hover:opacity-100">
                <Download className="h-3.5 w-3.5" /> Certificate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Preview Modal */}
      {selectedAward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Close button */}
            <button onClick={() => setSelectedAward(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <X className="h-4 w-4 text-gray-600" />
            </button>

            {/* Certificate Content */}
            <div className="p-8 sm:p-12 text-center border-8 border-double border-emerald-100 m-4 rounded-xl">
              {/* Header Ornament */}
              <div className="flex justify-center mb-4">
                <div className="flex items-center gap-1">
                  <Leaf className="h-4 w-4 text-emerald-400 rotate-[-30deg]" />
                  <div className="w-16 h-px bg-emerald-300" />
                  <Trophy className="h-6 w-6 text-amber-500" />
                  <div className="w-16 h-px bg-emerald-300" />
                  <Leaf className="h-4 w-4 text-emerald-400 rotate-[30deg]" />
                </div>
              </div>

              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.2em] mb-1">Namma Madurai</p>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-1">Certificate of Achievement</h2>
              <p className="text-xs text-gray-400 mb-6">Youth Civic Impact Program • February 2026</p>

              <div className="space-y-4 mb-6">
                <p className="text-sm text-gray-500">This certificate is proudly awarded to</p>
                <h3 className="text-xl sm:text-2xl font-bold text-emerald-700">{selectedAward.winner}</h3>
                <p className="text-sm text-gray-500">in recognition of outstanding contribution as</p>
                <p className="text-lg font-bold text-gray-800">{selectedAward.title}</p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 mb-6">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-bold text-amber-700">{selectedAward.score} Points Achieved</span>
              </div>

              <div className="flex justify-center gap-12 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="w-24 h-px bg-gray-300 mb-2" />
                  <p className="text-xs text-gray-400">Commissioner</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-px bg-gray-300 mb-2" />
                  <p className="text-xs text-gray-400">Program Director</p>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 shadow-sm transition-colors">
                <Download className="h-4 w-4" /> Download Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouthAwards;

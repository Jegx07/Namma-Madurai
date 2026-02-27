import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Shield, Star, Medal, Loader2 } from "lucide-react";
import { badgeColors } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { supabaseUserScores } from "@/lib/supabase";

interface UserScore {
  id: string;
  user_id: string;
  user_name: string;
  email: string;
  score: number;
  reports_submitted: number;
  created_at: string;
  updated_at: string;
}

const badgeIcons: Record<string, typeof Trophy> = {
  "Green Warrior": Shield,
  "Civic Guardian": Award,
  "Street Hero": Star,
  "Segregation Star": Trophy,
};

const getBadgeForScore = (score: number): string => {
  if (score >= 2000) return "Green Warrior";
  if (score >= 1000) return "Civic Guardian";
  if (score >= 500) return "Street Hero";
  return "Segregation Star";
};

const UserLeaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<UserScore[]>([]);
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scores = await supabaseUserScores.getLeaderboard(10);
        setLeaderboard(scores || []);

        if (user) {
          const myScore = await supabaseUserScores.getUserScore(user.id);
          setUserScore(myScore);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to real-time changes
    const subscription = supabaseUserScores.subscribeToChanges(() => {
      fetchData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const getUserRank = () => {
    if (!userScore) return "-";
    const rank = leaderboard.findIndex(s => s.user_id === user?.id) + 1;
    return rank > 0 ? rank : "-";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-[#f3f4f6] min-h-screen text-slate-800 font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Civic Leaderboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Top contributors making Madurai cleaner. Keep reporting to climb the ranks!
        </p>
      </div>

      {/* Your Rank Card */}
      <Card className="mb-8 bg-emerald-50 border border-emerald-100 shadow-sm rounded-xl">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between py-6 gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white shadow-sm">
              {user?.avatar || "U"}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name || "You"}</p>
              <p className="text-sm text-gray-500">Your current ranking</p>
            </div>
          </div>
          <div className="flex items-center gap-8 bg-white/60 px-6 py-3 rounded-lg border border-emerald-100/50">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">#{getUserRank()}</p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Rank</p>
            </div>
            <div className="w-px h-8 bg-emerald-200/50"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{userScore?.score || 0}</p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Points</p>
            </div>
            <div className="w-px h-8 bg-emerald-200/50"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{userScore?.reports_submitted || 0}</p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Reports</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="mb-10 flex items-end justify-center gap-2 sm:gap-6 mt-12">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 border-4 border-white shadow-sm text-xl font-bold text-slate-600 z-10">
              {leaderboard[1]?.user_name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex h-28 w-24 sm:w-32 flex-col items-center justify-center rounded-t-xl bg-slate-200/80 border-t border-slate-300 shadow-inner">
              <Medal className="h-6 w-6 text-slate-500 mb-1" />
              <p className="text-sm font-semibold text-slate-800 text-center px-1 truncate w-full">{leaderboard[1]?.user_name.split(" ")[0]}</p>
              <p className="text-xs font-medium text-slate-500">{leaderboard[1]?.score} pts</p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <div className="absolute -top-6 text-amber-500 animate-pulse">
              <Trophy className="h-8 w-8 fill-amber-500/20" />
            </div>
            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 border-4 border-white shadow-md text-2xl font-bold text-amber-600 z-10 relative">
              {leaderboard[0]?.user_name.substring(0, 2).toUpperCase()}
              <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">1ST</div>
            </div>
            <div className="flex h-36 w-28 sm:w-36 flex-col items-center justify-center rounded-t-xl bg-amber-100/80 border-t border-amber-200 shadow-inner relative">
              <Trophy className="h-7 w-7 text-amber-600 mb-1" />
              <p className="font-semibold text-amber-900 text-center px-1 truncate w-full">{leaderboard[0]?.user_name.split(" ")[0]}</p>
              <p className="text-sm font-medium text-amber-700/80">{leaderboard[0]?.score} pts</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 border-4 border-white shadow-sm text-lg font-bold text-orange-700 z-10">
              {leaderboard[2]?.user_name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex h-24 w-24 sm:w-32 flex-col items-center justify-center rounded-t-xl bg-orange-100/60 border-t border-orange-200 shadow-inner">
              <Medal className="h-5 w-5 text-orange-500 mb-1" />
              <p className="text-sm font-semibold text-orange-900 text-center px-1 truncate w-full">{leaderboard[2]?.user_name.split(" ")[0]}</p>
              <p className="text-xs font-medium text-orange-700">{leaderboard[2]?.score} pts</p>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <Card className="bg-white border-none shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              const badge = getBadgeForScore(entry.score);
              const Icon = badgeIcons[badge] || Trophy;
              const avatar = entry.user_name.substring(0, 2).toUpperCase();

              const isTop3 = rank <= 3;

              return (
                <div key={entry.id} className="flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    <div className="w-6 text-center font-bold text-gray-400 group-hover:text-gray-600">
                      {rank}
                    </div>
                    <div
                      className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full text-sm font-bold shadow-sm ${rank === 1 ? "bg-amber-100 text-amber-700" :
                          rank === 2 ? "bg-slate-200 text-slate-700" :
                            rank === 3 ? "bg-orange-100 text-orange-700" :
                              "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{entry.user_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Icon className={`h-3.5 w-3.5 ${isTop3 ? 'text-amber-500' : 'text-emerald-500'}`} />
                        <span className="text-xs font-medium text-gray-500">{badge}</span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-12 text-right">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Reports</p>
                      <p className="font-semibold text-gray-700">{entry.reports_submitted}</p>
                    </div>
                    <div className="w-24">
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Points</p>
                      <p className="font-bold text-gray-900">{entry.score.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Mobile score display */}
                  <div className="sm:hidden text-right">
                    <p className="font-bold text-gray-900">{entry.score.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">pts</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLeaderboard;

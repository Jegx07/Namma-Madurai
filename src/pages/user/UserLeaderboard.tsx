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
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Civic Leaderboard</h1>
        <p className="text-muted-foreground">
          Top contributors making Madurai cleaner. Keep reporting to climb the ranks!
        </p>
      </div>

      {/* Your Rank Card */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardContent className="flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {user?.avatar || "U"}
            </div>
            <div>
              <p className="font-semibold text-foreground">{user?.name || "You"}</p>
              <p className="text-sm text-muted-foreground">Your current ranking</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">#{getUserRank()}</p>
              <p className="text-xs text-muted-foreground">Rank</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{userScore?.score || 0}</p>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{userScore?.reports_submitted || 0}</p>
              <p className="text-xs text-muted-foreground">Reports</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
      <div className="mb-8 flex items-end justify-center gap-4">
        {/* 2nd Place */}
        <div className="flex flex-col items-center">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-xl font-bold text-slate-700">
            {leaderboard[1]?.user_name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex h-24 w-28 flex-col items-center justify-center rounded-t-lg bg-slate-200">
            <Medal className="h-6 w-6 text-slate-500" />
            <p className="mt-1 text-sm font-semibold">{leaderboard[1]?.user_name.split(" ")[0]}</p>
            <p className="text-xs text-muted-foreground">{leaderboard[1]?.score} pts</p>
          </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center">
          <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground">
            {leaderboard[0]?.user_name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-t-lg bg-accent">
            <Trophy className="h-8 w-8 text-accent-foreground" />
            <p className="mt-1 font-semibold text-accent-foreground">{leaderboard[0]?.user_name.split(" ")[0]}</p>
            <p className="text-sm text-accent-foreground/80">{leaderboard[0]?.score} pts</p>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-800">
            {leaderboard[2]?.user_name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex h-20 w-28 flex-col items-center justify-center rounded-t-lg bg-amber-100">
            <Medal className="h-5 w-5 text-amber-600" />
            <p className="mt-1 text-sm font-semibold text-amber-800">{leaderboard[2]?.user_name.split(" ")[0]}</p>
            <p className="text-xs text-amber-600">{leaderboard[2]?.score} pts</p>
          </div>
        </div>
      </div>
      )}

      {/* Full Leaderboard */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {leaderboard.map((entry, index) => {
          const rank = index + 1;
          const badge = getBadgeForScore(entry.score);
          const Icon = badgeIcons[badge] || Trophy;
          const avatar = entry.user_name.substring(0, 2).toUpperCase();
          return (
            <Card
              key={entry.id}
              className={`transition-all hover:shadow-md ${rank <= 3 ? "border-accent/30" : ""}`}
            >
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${
                      rank === 1
                        ? "bg-accent text-accent-foreground"
                        : rank === 2
                        ? "bg-slate-200 text-slate-700"
                        : rank === 3
                        ? "bg-amber-100 text-amber-800"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{entry.user_name}</p>
                    <p className="text-xs text-muted-foreground">Rank #{rank}</p>
                  </div>
                </div>
                <div className="mb-3 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-accent" />
                  <Badge className={badgeColors[badge]}>{badge}</Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Points</span>
                    <span className="font-semibold text-foreground">{entry.score.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reports</span>
                    <span className="font-semibold text-foreground">{entry.reports_submitted}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UserLeaderboard;

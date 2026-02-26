import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Shield, Star } from "lucide-react";
import { mockLeaderboard, badgeColors } from "@/data/mockData";

const badgeIcons: Record<string, typeof Trophy> = {
  "Green Warrior": Shield,
  "Civic Guardian": Award,
  "Street Hero": Star,
  "Segregation Star": Trophy,
};

const Leaderboard = () => {
  return (
    <div className="container py-10">
      <h1 className="mb-2 text-3xl font-bold text-foreground">Civic Leaderboard</h1>
      <p className="mb-8 text-muted-foreground">Top contributors making Madurai cleaner.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockLeaderboard.map((user) => {
          const Icon = badgeIcons[user.badge] || Trophy;
          return (
            <Card key={user.rank} className={`transition-shadow hover:shadow-md ${user.rank <= 3 ? "border-accent/40" : ""}`}>
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">Rank #{user.rank}</p>
                  </div>
                </div>
                <div className="mb-3 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-accent" />
                  <Badge className={badgeColors[user.badge]}>{user.badge}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Points</span>
                  <span className="font-semibold text-foreground">{user.points.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reports</span>
                  <span className="font-semibold text-foreground">{user.reports}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;

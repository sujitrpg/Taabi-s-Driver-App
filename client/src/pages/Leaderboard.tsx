import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LeaderboardItem } from "@/components/LeaderboardItem";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLeaderboard, useDriverRank } from "@/lib/hooks/useDriver";
import { Skeleton } from "@/components/ui/skeleton";
import prakharImage from "@/assets/images/prakhar.jpeg";
import shubhamImage from "@/assets/images/shubham.jpeg";

type Period = "daily" | "weekly" | "monthly";

const CURRENT_DRIVER_ID = "default-driver-1";

const driverAvatars: Record<string, string> = {
  "driver-3": shubhamImage,
  "default-driver-1": prakharImage
};

export default function Leaderboard() {
  const [period, setPeriod] = useState<Period>("weekly");

  const periods: { id: Period; label: string }[] = [
    { id: "daily", label: "Daily" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
  ];

  const { data: leaderboardData, isLoading } = useLeaderboard(period);
  const { data: rankData } = useDriverRank(CURRENT_DRIVER_ID);

  // Enhance leaderboard data with avatar URLs
  const enhancedLeaderboardData = leaderboardData?.map(driver => ({
    ...driver,
    avatarUrl: driver.avatarUrl || driverAvatars[driver.id]
  }));

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-[30vh] bg-gradient-to-br from-yellow-500/20 via-taabi-blue/20 to-purple-500/20 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">Compete with the best drivers</p>
          <p className="text-xs text-muted-foreground/60 mt-2">Rankings powered by taabi.ai</p>
        </div>
      </div>

      <div className="p-4 -mt-8 space-y-4">
        <Card className="p-2 bg-muted/50">
          <div className="flex gap-2">
            {periods.map((p) => (
              <Button
                key={p.id}
                variant={period === p.id ? "default" : "ghost"}
                className={cn(
                  "flex-1",
                  period === p.id && "bg-card shadow-sm"
                )}
                onClick={() => setPeriod(p.id)}
                data-testid={`button-period-${p.id}`}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-taabi-blue/10 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground">Your Rank</div>
              <div className="text-3xl font-bold text-taabi-blue">
                #{rankData?.rank || "-"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Your Points</div>
              <div className="text-3xl font-bold">
                {leaderboardData?.find(d => d.id === CURRENT_DRIVER_ID)?.totalPoints.toLocaleString() || "0"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-lime-green" />
            <span>Keep climbing the ranks!</span>
          </div>
        </Card>

        <div>
          <h2 className="text-xl font-bold mb-4">Top Performers</h2>
          <Card className="p-4 space-y-2">
            {isLoading ? (
              <>
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </>
            ) : (
                enhancedLeaderboardData?.slice(0, 10).map((driver, index) => (
                <LeaderboardItem 
                  key={driver.id} 
                  rank={index + 1}
                  name={driver.name}
                  avatarUrl={driver.avatarUrl || undefined}
                  points={driver.totalPoints}
                  level={driver.level}
                  isCurrentUser={driver.id === CURRENT_DRIVER_ID}
                />
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

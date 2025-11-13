import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardItemProps {
  rank: number;
  name: string;
  avatarUrl?: string;
  points: number;
  level: string;
  isCurrentUser?: boolean;
}

export function LeaderboardItem({ rank, name, avatarUrl, points, level, isCurrentUser }: LeaderboardItemProps) {
  const getRankBadge = () => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
    return null;
  };

  const getRankColor = () => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/20 to-transparent";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/20 to-transparent";
    if (rank === 3) return "bg-gradient-to-r from-amber-700/20 to-transparent";
    return "";
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg hover-elevate",
        getRankColor(),
        isCurrentUser && "bg-primary/5 border border-primary/20"
      )}
      data-testid={`leaderboard-item-${rank}`}
    >
      <div className="flex items-center justify-center w-8">
        {getRankBadge() || (
          <span className="text-lg font-bold text-muted-foreground" data-testid={`text-rank-${rank}`}>
            {rank}
          </span>
        )}
      </div>
      
      <Avatar className="w-12 h-12">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="font-semibold" data-testid={`text-driver-name-${rank}`}>{name}</div>
        <div className="text-sm text-muted-foreground">{level}</div>
      </div>
      
      <div className="text-right">
        <div className="font-bold text-taabi-blue" data-testid={`text-points-${rank}`}>
          {points.toLocaleString()}
        </div>
        <div className="text-xs text-muted-foreground">points</div>
      </div>
    </div>
  );
}

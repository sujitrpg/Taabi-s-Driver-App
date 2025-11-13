import { Award, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeDisplayProps {
  name: string;
  description: string;
  iconName: string;
  isUnlocked: boolean;
  earnedDate?: string;
}

export function BadgeDisplay({ name, description, iconName, isUnlocked, earnedDate }: BadgeDisplayProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-2xl min-w-[100px] transition-all",
        isUnlocked 
          ? "bg-gradient-to-br from-lime-green/20 to-transparent border border-lime-green/30" 
          : "bg-muted/30 border border-border opacity-60"
      )}
      data-testid={`badge-${name.toLowerCase().replace(/\s/g, '-')}`}
    >
      <div 
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center",
          isUnlocked 
            ? "bg-lime-green text-white shadow-lg shadow-lime-green/50" 
            : "bg-muted text-muted-foreground"
        )}
      >
        {isUnlocked ? (
          <Award className="w-8 h-8" />
        ) : (
          <Lock className="w-8 h-8" />
        )}
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold" data-testid={`text-badge-name-${name.toLowerCase().replace(/\s/g, '-')}`}>
          {name}
        </div>
        {earnedDate && isUnlocked && (
          <div className="text-xs text-muted-foreground">{earnedDate}</div>
        )}
      </div>
    </div>
  );
}

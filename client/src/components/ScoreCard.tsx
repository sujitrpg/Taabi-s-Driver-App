import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ScoreCardProps {
  grade: "A" | "B" | "C";
  fuelScore: number;
  safetyScore: number;
  timeScore: number;
  efficiencyScore: number;
  date?: string;
}

export function ScoreCard({ grade, fuelScore, safetyScore, timeScore, efficiencyScore, date }: ScoreCardProps) {
  const getGradeColor = () => {
    switch (grade) {
      case "A": return "border-grade-a bg-gradient-to-br from-grade-a/10 to-transparent";
      case "B": return "border-grade-b bg-gradient-to-br from-grade-b/10 to-transparent";
      case "C": return "border-grade-c bg-gradient-to-br from-grade-c/10 to-transparent";
    }
  };

  const getGradeTextColor = () => {
    switch (grade) {
      case "A": return "text-grade-a";
      case "B": return "text-grade-b";
      case "C": return "text-grade-c";
    }
  };

  const metrics = [
    { label: "Fuel", value: fuelScore, icon: "⛽" },
    { label: "Safety", value: safetyScore, icon: "🛡️" },
    { label: "Time", value: timeScore, icon: "⏱️" },
    { label: "Efficiency", value: efficiencyScore, icon: "⚡" },
  ];

  return (
    <Card className={`p-6 border-2 ${getGradeColor()}`} data-testid="card-scorecard">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Performance Grade</h3>
          <div className={`text-7xl font-bold ${getGradeTextColor()}`} data-testid="text-grade">
            {grade}
          </div>
        </div>
        {date && (
          <div className="text-xs text-muted-foreground">{date}</div>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="text-center" data-testid={`metric-${metric.label.toLowerCase()}`}>
            <div className="text-2xl mb-1">{metric.icon}</div>
            <div className="text-sm font-semibold" data-testid={`value-${metric.label.toLowerCase()}`}>
              {metric.value}%
            </div>
            <div className="text-xs text-muted-foreground">{metric.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

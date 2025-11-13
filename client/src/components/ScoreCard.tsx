import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Fuel, Shield, Clock, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ScoreCardProps {
  grade: "A" | "B" | "C";
  fuelScore: number;
  safetyScore: number;
  timeScore: number;
  efficiencyScore: number;
  date?: string;
}

export function ScoreCard({ grade, fuelScore, safetyScore, timeScore, efficiencyScore, date }: ScoreCardProps) {
  const [expanded, setExpanded] = useState(false);

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
    { label: "Fuel", value: fuelScore, icon: Fuel, tips: "Maintain steady speed, avoid harsh acceleration" },
    { label: "Safety", value: safetyScore, icon: Shield, tips: "No harsh braking, maintain safe distance" },
    { label: "Time", value: timeScore, icon: Clock, tips: "On-time delivery, efficient route planning" },
    { label: "Efficiency", value: efficiencyScore, icon: Zap, tips: "Optimal speed, minimal idle time" },
  ];

  const overallScore = Math.round((fuelScore + safetyScore + timeScore + efficiencyScore) / 4);

  return (
    <Card className={`p-6 border-2 ${getGradeColor()} hover-elevate transition-all duration-300`} data-testid="card-scorecard">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Performance Grade</h3>
          <div className={`text-7xl font-bold ${getGradeTextColor()} animate-in fade-in duration-500`} data-testid="text-grade">
            {grade}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Overall: {overallScore}%
          </div>
        </div>
        <div className="text-right">
          {date && (
            <div className="text-xs text-muted-foreground mb-2">{date}</div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="text-xs"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="text-center" data-testid={`metric-${metric.label.toLowerCase()}`}>
              <div className="flex justify-center mb-1">
                <Icon className="w-6 h-6 text-taabi-blue" />
              </div>
              <div className="text-sm font-semibold" data-testid={`value-${metric.label.toLowerCase()}`}>
                {metric.value}%
              </div>
              <div className="text-xs text-muted-foreground">{metric.label}</div>
              {expanded && (
                <div className="mt-2">
                  <Progress value={metric.value} className="h-1" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {expanded && (
        <div className="mt-6 space-y-3 pt-4 border-t animate-in slide-in-from-top duration-300">
          <h4 className="text-sm font-semibold">Performance Tips</h4>
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="flex gap-2 text-xs items-start">
                <Icon className="w-4 h-4 text-taabi-blue flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">{metric.label}:</span>{" "}
                  <span className="text-muted-foreground">{metric.tips}</span>
                </div>
              </div>
            );
          })}
          <div className="text-xs text-muted-foreground pt-2">
            Powered by taabi.ai analytics
          </div>
        </div>
      )}
    </Card>
  );
}

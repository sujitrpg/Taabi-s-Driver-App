import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreCard } from "@/components/ScoreCard";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Coins,
  Share2,
  Home,
  MapPin,
  Clock,
  Fuel,
  Shield
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function TripSummary() {
  const [, setLocation] = useLocation();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const tripDetails = {
    origin: "Mumbai, MH",
    destination: "Pune, MH",
    distance: 148,
    duration: 180,
    startTime: "08:30 AM",
    endTime: "11:30 AM",
  };

  const metrics = {
    fuelEfficiency: 92,
    safetyScore: 88,
    timeScore: 95,
    efficiencyScore: 90,
  };

  const pointsBreakdown = [
    { label: "On-Time Delivery", points: 50, icon: Clock },
    { label: "Good Driving Score", points: 20, icon: Shield },
    { label: "Fuel Efficiency Bonus", points: 15, icon: Fuel },
  ];

  const totalPoints = pointsBreakdown.reduce((sum, item) => sum + item.points, 0);

  const newBadges = [
    { name: "Safety Star", description: "Zero harsh braking", iconName: "shield", isUnlocked: true, earnedDate: "Just now" },
    { name: "On-Time Hero", description: "On-time delivery", iconName: "clock", isUnlocked: true, earnedDate: "Just now" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <div className="confetti-animation">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                  backgroundColor: i % 3 === 0 ? "#0072CE" : i % 3 === 1 ? "#84CC16" : "#22C55E",
                  animation: `confetti-fall ${2 + Math.random() * 2}s linear forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="relative h-[30vh] bg-gradient-to-br from-lime-green/20 via-taabi-blue/20 to-emerald-500/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-lime-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-lime-green/50">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Trip Completed!</h1>
          <p className="text-muted-foreground">Excellent work, driver</p>
        </div>
      </div>

      <div className="p-4 -mt-8 space-y-6">
        <ScoreCard
          grade="A"
          fuelScore={metrics.fuelEfficiency}
          safetyScore={metrics.safetyScore}
          timeScore={metrics.timeScore}
          efficiencyScore={metrics.efficiencyScore}
          date="Just now"
        />

        <Card className="p-6 bg-gradient-to-br from-lime-green to-lime-green/80 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Coins className="w-10 h-10" />
              <div>
                <div className="text-sm opacity-90">Points Earned</div>
                <div className="text-4xl font-bold" data-testid="text-points-earned">+{totalPoints}</div>
              </div>
            </div>
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            {pointsBreakdown.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-white/20">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="font-semibold">+{item.points}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Trip Details</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-taabi-blue mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Route</div>
                <div className="font-semibold">{tripDetails.origin} → {tripDetails.destination}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Distance</div>
                <div className="font-semibold">{tripDetails.distance} km</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="font-semibold">{Math.floor(tripDetails.duration / 60)}h {tripDetails.duration % 60}m</div>
              </div>
            </div>
          </div>
        </Card>

        {newBadges.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-yellow-500" />
              <h3 className="font-bold text-lg">New Achievements Unlocked!</h3>
            </div>
            <div className="flex gap-3">
              {newBadges.map((badge) => (
                <BadgeDisplay key={badge.name} {...badge} />
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" data-testid="button-share-achievement">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button 
            className="flex-1 bg-taabi-blue hover:bg-taabi-blue/90"
            onClick={() => setLocation("/")}
            data-testid="button-back-home"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

import { useState } from "react";
import { PointsWallet } from "@/components/PointsWallet";
import { ScoreCard } from "@/components/ScoreCard";
import { ProgressRing } from "@/components/ProgressRing";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { LeaderboardItem } from "@/components/LeaderboardItem";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Map, MapPin, Gift, Users, TrendingUp, Award, AlertTriangle, Phone } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import shubhamImage from "@/assets/images/shubham.jpeg";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [sosDialogOpen, setSosDialogOpen] = useState(false);
  const { toast } = useToast();

  const quickActions = [
    { icon: Map, label: "Start Route", path: "/route", color: "bg-taabi-blue text-white" },
    { icon: MapPin, label: "Nearby", path: "/nearby", color: "bg-emerald-500 text-white" },
    { icon: Gift, label: "Rewards", path: "/rewards", color: "bg-lime-green text-white" },
    { icon: Users, label: "Community", path: "/community", color: "bg-purple-500 text-white" },
  ];

  const recentBadges = [
    { name: "Safety Star", description: "Zero harsh braking", iconName: "shield", isUnlocked: true, earnedDate: "Today" },
    { name: "On-Time Hero", description: "On-time delivery", iconName: "clock", isUnlocked: true, earnedDate: "Yesterday" },
    { name: "Eco Driver", description: "Fuel efficient", iconName: "leaf", isUnlocked: true, earnedDate: "2 days ago" },
    { name: "Gold Driver", description: "7-day safe streak", iconName: "trophy", isUnlocked: false },
    { name: "Fleet Legend", description: "Top 10 weekly", iconName: "crown", isUnlocked: false },
  ];

  const topDrivers = [
    { rank: 1, name: "Sujit Soni", score: 98, points: 3450, avatarUrl: undefined, level: "Fleet Legend" },
    { rank: 2, name: "Shubham Agarwal", score: 95, points: 3200, avatarUrl: shubhamImage, level: "Pro Driver" },
    { rank: 3, name: "Sumandeep Singh", score: 92, points: 2980, avatarUrl: undefined, level: "Pro Driver" },
  ];

  const handleSOS = () => {
    setSosDialogOpen(true);
  };

  const handleConfirmSOS = () => {
    setSosDialogOpen(false);
    toast({
      title: "SOS Alert Sent!",
      description: "Emergency services notified. Help is on the way. Hotline: 1800-TAABI-SOS",
      duration: 10000,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome Back Prakhar!</h1>
            <p className="text-muted-foreground">Let's make today count</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Powered by taabi.ai</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-lime-green/20 border border-lime-green/30">
              <TrendingUp className="w-4 h-4 text-lime-green" />
              <span className="text-sm font-semibold text-lime-green">Day 12 Streak</span>
            </div>
            <Button 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 text-white gap-2"
              onClick={handleSOS}
              data-testid="button-sos"
            >
              <AlertTriangle className="w-4 h-4" />
              SOS
            </Button>
          </div>
        </div>

        <PointsWallet points={2450} recentEarnings={120} onRedeem={() => setLocation("/rewards")} />

        <ScoreCard 
          grade="A" 
          fuelScore={92} 
          safetyScore={88} 
          timeScore={95} 
          efficiencyScore={90}
          date="Last Trip - Today"
        />

        <div>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  className={`h-24 flex flex-col gap-2 ${action.color} border-0 hover-elevate`}
                  onClick={() => setLocation(action.path)}
                  data-testid={`button-${action.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <Icon className="w-8 h-8" />
                  <span className="font-semibold">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
          <Card className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <ProgressRing value={92} label="Fuel Efficiency" />
              <ProgressRing value={88} label="Safety Score" />
            </div>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Achievements</h2>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/profile")} data-testid="button-view-all-badges">
              View All
            </Button>
          </div>
          <ScrollArea className="w-full">
            <div className="flex gap-3 pb-4">
              {recentBadges.map((badge) => (
                <BadgeDisplay key={badge.name} {...badge} />
              ))}
            </div>
          </ScrollArea>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Top Drivers</h2>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/leaderboard")} data-testid="button-view-full-leaderboard">
              Full Leaderboard
            </Button>
          </div>
          <Card className="p-4 space-y-2">
            {topDrivers.map((driver) => (
              <LeaderboardItem key={driver.rank} {...driver} />
            ))}
          </Card>
        </div>

        <AlertDialog open={sosDialogOpen} onOpenChange={setSosDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Emergency SOS Alert
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <p>This will immediately notify:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Your fleet manager</li>
                  <li>Emergency services</li>
                  <li>Nearest support team</li>
                </ul>
                <p className="font-semibold">Are you sure you want to send an SOS?</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmSOS}
                className="bg-red-600 hover:bg-red-700"
              >
                <Phone className="w-4 h-4 mr-2" />
                Send SOS
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
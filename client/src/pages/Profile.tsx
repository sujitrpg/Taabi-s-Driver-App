import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  TrendingUp, 
  Award, 
  MapPin, 
  Clock, 
  Target,
  Settings,
  LogOut,
  Heart,
  Zap
} from "lucide-react";

export default function Profile() {
  const driver = {
    name: "Deepak Yadav",
    phoneNumber: "+91 98765 43210",
    level: "Pro Driver",
    totalPoints: 2450,
    currentStreak: 12,
    totalTrips: 145,
    joinedDate: "Jan 2024",
  };

  const stats = [
    { label: "Total Trips", value: "145", icon: MapPin },
    { label: "Safe Hours", value: "1,240", icon: Clock },
    { label: "Avg Score", value: "88%", icon: Target },
    { label: "Days Active", value: "89", icon: Zap },
  ];

  const allBadges = [
    { name: "Safety Star", description: "Zero harsh braking", iconName: "shield", isUnlocked: true, earnedDate: "Today" },
    { name: "On-Time Hero", description: "On-time delivery", iconName: "clock", isUnlocked: true, earnedDate: "Yesterday" },
    { name: "Eco Driver", description: "Fuel efficient", iconName: "leaf", isUnlocked: true, earnedDate: "2 days ago" },
    { name: "Gold Driver", description: "7-day safe streak", iconName: "trophy", isUnlocked: true, earnedDate: "1 week ago" },
    { name: "Fleet Legend", description: "Top 10 weekly", iconName: "crown", isUnlocked: false },
    { name: "Contributor", description: "Community active", iconName: "users", isUnlocked: true, earnedDate: "2 weeks ago" },
    { name: "Long Hauler", description: "1000km trip", iconName: "truck", isUnlocked: false },
    { name: "Night Owl", description: "Night driving", iconName: "moon", isUnlocked: false },
  ];

  const levelProgress = 65;
  const nextLevel = "Fleet Legend";
  const pointsToNextLevel = 1550;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-[25vh] bg-gradient-to-br from-taabi-blue to-taabi-blue/80 flex items-center justify-center">
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="icon" className="text-white" data-testid="button-settings">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="px-4 -mt-16 space-y-6 pb-6">
        <Card className="p-6">
          <div className="flex flex-col items-center -mt-20 mb-4">
            <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
              <AvatarFallback className="text-4xl bg-taabi-blue text-white">
                {driver.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold mt-4" data-testid="text-driver-name">{driver.name}</h1>
            <p className="text-muted-foreground">{driver.phoneNumber}</p>
            <Badge className="mt-2 bg-taabi-blue/20 text-taabi-blue border-taabi-blue/30">
              {driver.level}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress to {nextLevel}</span>
              <span className="font-semibold">{levelProgress}%</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
            <div className="text-xs text-muted-foreground text-center">
              {pointsToNextLevel.toLocaleString()} more points to level up
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-taabi-blue/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-taabi-blue" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-6 bg-gradient-to-br from-lime-green/10 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-lime-green" />
              <div>
                <div className="text-sm text-muted-foreground">Current Streak</div>
                <div className="text-3xl font-bold">{driver.currentStreak} days</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Points</div>
              <div className="text-3xl font-bold text-taabi-blue" data-testid="text-total-points">
                {driver.totalPoints.toLocaleString()}
              </div>
            </div>
          </div>
        </Card>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Award className="w-6 h-6" />
              Badge Collection
            </h2>
            <Badge variant="secondary">
              {allBadges.filter(b => b.isUnlocked).length}/{allBadges.length}
            </Badge>
          </div>
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {allBadges.map((badge) => (
                <BadgeDisplay key={badge.name} {...badge} />
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start gap-3" data-testid="button-wellness-tips">
            <Heart className="w-5 h-5" />
            Wellness Tips
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3 text-destructive" data-testid="button-logout">
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

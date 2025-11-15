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
import { Map, MapPin, Gift, Users, TrendingUp, Award, AlertTriangle, Phone, Heart, HandHeart, GraduationCap, ClipboardCheck, Zap, Star, Truck, Calendar, MapPinned } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { UpcomingTrip, DeliveryPoint } from "@shared/schema";
import { format } from "date-fns";
import shubhamImage from "@/assets/images/shubham.jpeg";
import prakharPhotoAttached from "/attached_assets/1586702192238_1763053351246.jpeg";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [sosDialogOpen, setSosDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: upcomingTrips = [], isLoading: tripsLoading } = useQuery<UpcomingTrip[]>({
    queryKey: ["/api/upcoming-trips/driver/default-driver-1"],
  });

  const { data: allDeliveryPoints = [] } = useQuery<DeliveryPoint[]>({
    queryKey: ["/api/delivery-points"],
    enabled: upcomingTrips.length > 0,
  });

  const getDeliveryPointCount = (tripId: string) => {
    return allDeliveryPoints.filter(p => p.tripId === tripId).length;
  };

  const quickActions = [
    { icon: Heart, label: "Wellness", path: "/wellness", gradient: "from-pink-500 to-rose-500" },
    { icon: HandHeart, label: "Support Hub", path: "/support", gradient: "from-orange-500 to-red-500" },
    { icon: GraduationCap, label: "Learning", path: "/learning", gradient: "from-indigo-500 to-purple-500" },
    { icon: ClipboardCheck, label: "Checklist", path: "/checklist", gradient: "from-cyan-500 to-blue-500" },
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
    { rank: 3, name: "Prakhar Raghuvansh", score: 92, points: 3000, avatarUrl: prakharPhotoAttached, level: "Pro Driver" },
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20">
      <div className="p-4 space-y-5">
        {/* Hero Header with Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-taabi-blue via-blue-600 to-cyan-500 p-6 text-white shadow-xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm mb-3">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-semibold">Day 12 Streak</span>
              </div>
              <h1 className="text-3xl font-bold mb-1">Welcome Back, Prakhar!</h1>
              <p className="text-white/90 text-base">Let's make today count</p>
              <p className="text-xs text-white/60 mt-2">Powered by taabi.ai</p>
            </div>
            <Button 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 text-white gap-2 shadow-lg"
              onClick={handleSOS}
              data-testid="button-sos"
            >
              <AlertTriangle className="w-4 h-4" />
              SOS
            </Button>
          </div>
        </div>

        {/* Points Wallet */}
        <PointsWallet points={2450} recentEarnings={120} onRedeem={() => setLocation("/rewards")} />

        {/* Score Card */}
        <ScoreCard 
          grade="A" 
          fuelScore={92} 
          safetyScore={88} 
          timeScore={95} 
          efficiencyScore={90}
          date="Last Trip - Today"
        />

        {/* Upcoming Trips */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-taabi-blue" />
              <h2 className="text-xl font-bold">Upcoming Trips</h2>
            </div>
          </div>
          {tripsLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2].map((i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="h-20 bg-muted rounded-md"></div>
                </Card>
              ))}
            </div>
          ) : upcomingTrips.length === 0 ? (
            <Card className="p-6 text-center">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No upcoming trips scheduled</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {upcomingTrips.slice(0, 2).map((trip) => {
                const stopCount = getDeliveryPointCount(trip.id);
                const statusColors = {
                  upcoming: "from-blue-500 to-cyan-500",
                  in_progress: "from-green-500 to-emerald-500",
                  completed: "from-gray-500 to-slate-500",
                };
                const statusLabels = {
                  upcoming: "Upcoming",
                  in_progress: "In Progress",
                  completed: "Completed",
                };

                return (
                  <Card
                    key={trip.id}
                    className="overflow-hidden hover-elevate cursor-pointer transition-all"
                    onClick={() => setLocation(`/trip/${trip.id}`)}
                    data-testid={`card-trip-${trip.id}`}
                  >
                    <div className={`h-2 bg-gradient-to-r ${statusColors[trip.status]}`}></div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1" data-testid={`text-trip-title-${trip.id}`}>
                            {trip.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span data-testid={`text-trip-time-${trip.id}`}>
                              {format(new Date(trip.scheduledTime), "MMM dd, h:mm a")}
                            </span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${statusColors[trip.status]} text-white`}>
                          {statusLabels[trip.status]}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPinned className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium" data-testid={`text-trip-start-${trip.id}`}>{trip.startLocation}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium" data-testid={`text-trip-end-${trip.id}`}>{trip.endLocation}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span data-testid={`text-trip-stops-${trip.id}`}>{stopCount} stops</span>
                        </div>
                        <Button size="sm" variant="ghost" data-testid={`button-view-trip-${trip.id}`}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Driver Center - Modern Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Star className="w-5 h-5 text-taabi-blue" />
              Driver Center
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => setLocation(action.path)}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${action.gradient} p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
                  data-testid={`button-${action.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
                  <div className="relative flex flex-col items-center gap-2">
                    <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-sm text-center">{action.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Performance Metrics - Enhanced */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-taabi-blue" />
            <h2 className="text-xl font-bold">Performance Metrics</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-6 hover-elevate">
              <ProgressRing value={92} label="Fuel Efficiency" />
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-6 hover-elevate">
              <ProgressRing value={88} label="Safety Score" />
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-taabi-blue" />
              <h2 className="text-xl font-bold">Recent Achievements</h2>
            </div>
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

        {/* Top Drivers - Enhanced */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-taabi-blue" />
              <h2 className="text-xl font-bold">Top Drivers</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/leaderboard")} data-testid="button-view-full-leaderboard">
              Full Leaderboard
            </Button>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border/50 p-4 space-y-2 shadow-sm">
            {topDrivers.map((driver) => (
              <LeaderboardItem key={driver.rank} {...driver} />
            ))}
          </div>
        </div>

        {/* SOS Dialog */}
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
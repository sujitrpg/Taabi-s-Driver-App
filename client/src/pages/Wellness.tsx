import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Droplets, Clock, Activity, Coffee, Eye, Footprints, AlertCircle, CheckCircle, MapPin, Utensils } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { FatigueCheckIn } from "@shared/schema";

const DEFAULT_DRIVER_ID = "default-driver-1";

export default function Wellness() {
  const { toast } = useToast();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInResponses, setCheckInResponses] = useState({
    feelingSleepy: false,
    tookBreak: false,
    hadMeal: false,
  });

  const { data: recentCheckIns } = useQuery<FatigueCheckIn[]>({
    queryKey: ["/api/fatigue-checkins/driver", DEFAULT_DRIVER_ID],
  });

  const checkInMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/fatigue-checkins", {
        driverId: DEFAULT_DRIVER_ID,
        ...checkInResponses,
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/fatigue-checkins/driver", DEFAULT_DRIVER_ID] });
      queryClient.invalidateQueries({ queryKey: ["/api/driver"] });
      setShowCheckIn(false);
      
      if (data.recommendations && data.recommendations.length > 0) {
        toast({
          title: "Safety Alert",
          description: data.warning || "Please take a break soon. We found nearby rest stops for you.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check-in Complete!",
          description: "Great! Keep up the safe driving.",
        });
      }
      
      setCheckInResponses({ feelingSleepy: false, tookBreak: false, hadMeal: false });
    },
  });
  const tips = [
    {
      id: 1,
      title: "Take Regular Breaks",
      content: "Stop every 2 hours for a 15-minute break. Walk around, stretch your legs, and refresh your mind. This improves concentration and reduces fatigue.",
      category: "safety",
      icon: Clock,
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Stay Hydrated",
      content: "Keep a water bottle handy and sip regularly. Dehydration causes fatigue and reduces alertness. Aim for at least 2-3 liters per day.",
      category: "hydration",
      icon: Droplets,
      color: "bg-cyan-500",
    },
    {
      id: 3,
      title: "Maintain Good Posture",
      content: "Adjust your seat to support your lower back. Keep your hands at 9 and 3 o'clock position. Good posture prevents back pain and improves control.",
      category: "posture",
      icon: Activity,
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Avoid Heavy Meals",
      content: "Eat light, frequent meals instead of heavy ones. Heavy meals make you drowsy. Opt for fruits, nuts, and protein-rich snacks.",
      category: "health",
      icon: Coffee,
      color: "bg-orange-500",
    },
    {
      id: 5,
      title: "Protect Your Eyes",
      content: "Use sunglasses during daytime. Take eye breaks by looking at distant objects. Blink frequently to prevent dry eyes.",
      category: "health",
      icon: Eye,
      color: "bg-emerald-500",
    },
    {
      id: 6,
      title: "Stretch Exercises",
      content: "Do simple stretches during breaks: neck rolls, shoulder shrugs, and leg stretches. Keeps muscles relaxed and blood flowing.",
      category: "posture",
      icon: Footprints,
      color: "bg-pink-500",
    },
    {
      id: 7,
      title: "Quality Sleep is Essential",
      content: "Aim for 7-8 hours of sleep before long trips. Never drive when drowsy. If you feel sleepy, pull over safely and rest.",
      category: "safety",
      icon: Heart,
      color: "bg-indigo-500",
    },
    {
      id: 8,
      title: "Monitor Your Health",
      content: "Regular health checkups are crucial. Monitor blood pressure, sugar levels, and overall fitness. Keep emergency medications handy.",
      category: "health",
      icon: Activity,
      color: "bg-red-500",
    },
    {
      id: 9,
      title: "Mind Your Mental Health",
      content: "Long drives can be mentally exhausting. Listen to music, podcasts, or audiobooks. Stay connected with family through calls during breaks.",
      category: "health",
      icon: Heart,
      color: "bg-rose-500",
    },
  ];

  const reminders = [
    "You've been driving for 90 minutes. Consider taking a short break soon.",
    "Don't forget to drink water! Stay hydrated.",
    "Great job maintaining good posture today!",
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-[30vh] bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Driver Wellness</h1>
          <p className="text-muted-foreground">Take care of yourself on the road</p>
          <p className="text-xs text-muted-foreground/60 mt-2">Health tips powered by taabi.ai</p>
        </div>
      </div>

      <div className="p-4 -mt-8 space-y-6">
        {!showCheckIn ? (
          <Card className="p-6 bg-gradient-to-br from-taabi-blue/10 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Fatigue Check-In</h3>
              <Badge className="bg-lime-green/20 text-lime-green border-lime-green/30">
                Long Trip Safety
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Taking a quick check-in helps us ensure your safety on long trips. Answer a few quick questions.
            </p>
            <Button 
              className="w-full" 
              onClick={() => setShowCheckIn(true)}
              data-testid="button-start-checkin"
            >
              Start Check-In
            </Button>
          </Card>
        ) : (
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">How are you feeling?</h3>
            <div className="space-y-4">
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer hover-elevate ${
                  checkInResponses.feelingSleepy ? "border-red-500 bg-red-500/10" : "border-border"
                }`}
                onClick={() => setCheckInResponses(prev => ({ ...prev, feelingSleepy: !prev.feelingSleepy }))}
                data-testid="checkbox-sleepy"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className={checkInResponses.feelingSleepy ? "text-red-500" : "text-muted-foreground"} />
                    <div>
                      <p className="font-medium">Feeling sleepy?</p>
                      <p className="text-sm text-muted-foreground">It's important to be honest</p>
                    </div>
                  </div>
                  {checkInResponses.feelingSleepy && <CheckCircle className="text-red-500" />}
                </div>
              </div>

              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer hover-elevate ${
                  checkInResponses.tookBreak ? "border-lime-green bg-lime-green/10" : "border-border"
                }`}
                onClick={() => setCheckInResponses(prev => ({ ...prev, tookBreak: !prev.tookBreak }))}
                data-testid="checkbox-break"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className={checkInResponses.tookBreak ? "text-lime-green" : "text-muted-foreground"} />
                    <div>
                      <p className="font-medium">Did you take a rest break?</p>
                      <p className="text-sm text-muted-foreground">In the last 2 hours</p>
                    </div>
                  </div>
                  {checkInResponses.tookBreak && <CheckCircle className="text-lime-green" />}
                </div>
              </div>

              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer hover-elevate ${
                  checkInResponses.hadMeal ? "border-lime-green bg-lime-green/10" : "border-border"
                }`}
                onClick={() => setCheckInResponses(prev => ({ ...prev, hadMeal: !prev.hadMeal }))}
                data-testid="checkbox-meal"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Utensils className={checkInResponses.hadMeal ? "text-lime-green" : "text-muted-foreground"} />
                    <div>
                      <p className="font-medium">Have you eaten?</p>
                      <p className="text-sm text-muted-foreground">Stay energized</p>
                    </div>
                  </div>
                  {checkInResponses.hadMeal && <CheckCircle className="text-lime-green" />}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowCheckIn(false);
                  setCheckInResponses({ feelingSleepy: false, tookBreak: false, hadMeal: false });
                }}
                data-testid="button-cancel-checkin"
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                disabled={checkInMutation.isPending}
                onClick={() => checkInMutation.mutate()}
                data-testid="button-submit-checkin"
              >
                {checkInMutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>

            {checkInResponses.feelingSleepy && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-500 mb-1">Safety Alert</p>
                  <p className="text-sm text-muted-foreground">
                    If you're feeling sleepy, please find a safe place to rest immediately. We'll show you nearby parking and rest areas.
                  </p>
                </div>
              </div>
            )}
          </Card>
        )}

        {recentCheckIns && recentCheckIns.length > 0 && (
          <Card className="p-4">
            <h3 className="font-medium mb-3">Recent Check-Ins</h3>
            <div className="space-y-2">
              {recentCheckIns.slice(0, 3).map((checkIn) => (
                <div key={checkIn.id} className="flex items-center justify-between text-sm p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">
                    {new Date(checkIn.checkInTime).toLocaleString("en-IN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {checkIn.feelingSleepy ? (
                    <Badge variant="destructive" className="text-xs">Sleepy</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs bg-lime-green/20 text-lime-green">OK</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-6 bg-gradient-to-br from-taabi-blue/10 to-transparent">
          <h3 className="font-bold text-lg mb-4">Today's Reminders</h3>
          <div className="space-y-2">
            {reminders.map((reminder, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-card">
                <div className="w-2 h-2 rounded-full bg-taabi-blue mt-2 flex-shrink-0" />
                <p className="text-sm">{reminder}</p>
              </div>
            ))}
          </div>
        </Card>

        <div>
          <h2 className="text-xl font-bold mb-4">Health & Safety Tips</h2>
          <div className="space-y-4">
            {tips.map((tip) => {
              const Icon = tip.icon;
              return (
                <Card key={tip.id} className="p-6" data-testid={`card-tip-${tip.id}`}>
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${tip.color} text-white flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{tip.title}</h3>
                        <Badge variant="secondary" className="capitalize">
                          {tip.category}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {tip.content}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="p-6 bg-gradient-to-br from-lime-green/10 to-transparent">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-6 h-6 text-lime-green" />
            <h3 className="font-bold text-lg">Quick Stretch Routine</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p>1. Neck rolls - 10 rotations each direction</p>
            <p>2. Shoulder shrugs - 15 repetitions</p>
            <p>3. Arm stretches - Hold each for 15 seconds</p>
            <p>4. Leg stretches - 20 seconds per leg</p>
            <p>5. Back twists - 10 each side</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Droplets, Clock, Activity, Coffee, Eye, Footprints } from "lucide-react";

export default function Wellness() {
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
        </div>
      </div>

      <div className="p-4 -mt-8 space-y-6">
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

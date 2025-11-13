import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MapPin, Navigation, Plus, X, Clock, Route, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RoutePlanner() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const [optimize, setOptimize] = useState(false);
  const [navigating, setNavigating] = useState(false);

  const addWaypoint = () => {
    setWaypoints([...waypoints, ""]);
  };

  const removeWaypoint = (index: number) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  const updateWaypoint = (index: number, value: string) => {
    const updated = [...waypoints];
    updated[index] = value;
    setWaypoints(updated);
  };

  const handleStartNavigation = () => {
    setNavigating(true);
  };

  const RouteAnimation = () => {
    const allPoints = [origin, ...waypoints, destination].filter(Boolean);
    
    return (
      <div className="relative bg-gradient-to-br from-taabi-blue/5 to-emerald-500/5 rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative z-10">
          {allPoints.map((point, index) => (
            <div key={index} className="mb-8 last:mb-0">
              <div className="flex items-center gap-4 animate-in slide-in-from-left duration-700" style={{ animationDelay: `${index * 200}ms` }}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg animate-in zoom-in duration-500 ${
                  index === 0 ? 'bg-taabi-blue' : 
                  index === allPoints.length - 1 ? 'bg-grade-c' : 
                  'bg-emerald-500'
                }`} style={{ animationDelay: `${index * 200 + 100}ms` }}>
                  {index === 0 ? 'A' : index === allPoints.length - 1 ? 'B' : index}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">{point}</div>
                  <div className="text-sm text-muted-foreground">
                    {index === 0 ? 'Starting Point' : 
                     index === allPoints.length - 1 ? 'Destination' : 
                     `Waypoint ${index}`}
                  </div>
                </div>
                {index < allPoints.length - 1 && (
                  <div className="text-xs text-muted-foreground">
                    {Math.floor(Math.random() * 50 + 20)} km
                  </div>
                )}
              </div>
              {index < allPoints.length - 1 && (
                <div className="ml-6 my-2">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-taabi-blue to-emerald-500 animate-in fade-in duration-1000" style={{ animationDelay: `${index * 200 + 300}ms` }} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 text-center text-xs text-muted-foreground animate-in fade-in duration-1000" style={{ animationDelay: '1200ms' }}>
          Route optimized by taabi.ai
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-[40vh] bg-gradient-to-br from-taabi-blue/20 to-emerald-500/20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-taabi-blue rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-emerald-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="text-center relative z-10">
          <Navigation className="w-16 h-16 text-taabi-blue mx-auto mb-4 animate-in zoom-in duration-500" />
          <h1 className="text-2xl font-bold animate-in slide-in-from-bottom duration-500">Plan Your Route</h1>
          <p className="text-muted-foreground animate-in slide-in-from-bottom duration-700">Smart navigation for efficient deliveries</p>
          <p className="text-xs text-muted-foreground/60 mt-2 animate-in fade-in duration-1000">Powered by taabi.ai</p>
        </div>
      </div>

      <div className="p-4 -mt-8 space-y-4">
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="origin">Origin</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-taabi-blue" />
              <Input
                id="origin"
                placeholder="Enter starting point"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="pl-11"
                data-testid="input-origin"
              />
            </div>
          </div>

          {waypoints.map((waypoint, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`waypoint-${index}`}>Waypoint {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWaypoint(index)}
                  data-testid={`button-remove-waypoint-${index}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="relative">
                <Route className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <Input
                  id={`waypoint-${index}`}
                  placeholder="Enter stop location"
                  value={waypoint}
                  onChange={(e) => updateWaypoint(index, e.target.value)}
                  className="pl-11"
                  data-testid={`input-waypoint-${index}`}
                />
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full"
            onClick={addWaypoint}
            data-testid="button-add-waypoint"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Waypoint
          </Button>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grade-c" />
              <Input
                id="destination"
                placeholder="Enter final destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-11"
                data-testid="input-destination"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-taabi-blue/20 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-taabi-blue" />
              </div>
              <div>
                <div className="font-semibold">Optimize Route</div>
                <div className="text-sm text-muted-foreground">Auto-arrange for efficiency</div>
              </div>
            </div>
            <Switch checked={optimize} onCheckedChange={setOptimize} data-testid="switch-optimize-route" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-taabi-blue/10 to-transparent">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Estimated Distance</div>
              <div className="text-2xl font-bold">245 km</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Estimated Time</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                4h 30m
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mb-4">
            <Badge variant="secondary">3 Stops</Badge>
            <Badge variant="secondary" className="bg-lime-green/20 text-lime-green border-lime-green/30">
              Optimized
            </Badge>
          </div>
          <Button 
            className="w-full bg-taabi-blue hover:bg-taabi-blue/90" 
            size="lg" 
            onClick={handleStartNavigation}
            disabled={!origin || !destination || navigating}
            data-testid="button-start-navigation"
          >
            <Play className="w-5 h-5 mr-2" />
            {navigating ? "Navigating..." : "Start Navigation"}
          </Button>
        </Card>

        {navigating && origin && destination && (
          <Card className="p-6 animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Route className="w-5 h-5 text-taabi-blue" />
                Your Optimized Route
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setNavigating(false)}
                data-testid="button-close-navigation"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <RouteAnimation />
          </Card>
        )}
      </div>
    </div>
  );
}

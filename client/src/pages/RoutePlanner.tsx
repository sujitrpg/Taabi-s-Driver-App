import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MapPin, Navigation, Plus, X, Clock, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RoutePlanner() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const [optimize, setOptimize] = useState(false);

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

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-[40vh] bg-gradient-to-br from-taabi-blue/20 to-emerald-500/20 flex items-center justify-center">
        <div className="text-center">
          <Navigation className="w-16 h-16 text-taabi-blue mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Plan Your Route</h1>
          <p className="text-muted-foreground">Smart navigation for efficient deliveries</p>
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
          <Button className="w-full bg-taabi-blue hover:bg-taabi-blue/90" size="lg" data-testid="button-start-navigation">
            <Navigation className="w-5 h-5 mr-2" />
            Start Navigation
          </Button>
        </Card>
      </div>
    </div>
  );
}

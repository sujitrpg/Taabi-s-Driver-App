
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Calendar, MapPin, MapPinned, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { UpcomingTrip, DeliveryPoint } from "@shared/schema";
import { format } from "date-fns";

export default function MyTrips() {
  const [, setLocation] = useLocation();

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-taabi-blue via-blue-600 to-cyan-500 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">My Trips</h1>
            <p className="text-white/90 text-sm">All assigned trips</p>
          </div>
          <Truck className="w-8 h-8 opacity-80" />
        </div>
      </div>

      {/* Trips List */}
      <div className="p-4 space-y-4">
        {tripsLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="h-32 bg-muted rounded-md"></div>
              </Card>
            ))}
          </div>
        ) : upcomingTrips.length === 0 ? (
          <Card className="p-8 text-center">
            <Truck className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">No Trips Assigned</h2>
            <p className="text-muted-foreground">You don't have any trips assigned yet.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {upcomingTrips.map((trip) => {
              const stopCount = getDeliveryPointCount(trip.id);

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
    </div>
  );
}

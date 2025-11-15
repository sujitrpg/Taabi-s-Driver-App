import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { UpcomingTrip, DeliveryPoint } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Calendar, Truck, Navigation, Phone, MapPinned, CheckCircle2, Circle, Factory, Home, Store, Warehouse } from "lucide-react";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const locationIcons = {
  warehouse: Warehouse,
  factory: Factory,
  shop: Store,
  home: Home,
};

export default function TripDetails() {
  const [, params] = useRoute("/trip/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const tripId = params?.id;

  const { data: trip, isLoading: tripLoading } = useQuery<UpcomingTrip>({
    queryKey: [`/api/upcoming-trips/${tripId}`],
    enabled: !!tripId,
  });

  const { data: deliveryPoints = [], isLoading: pointsLoading } = useQuery<DeliveryPoint[]>({
    queryKey: [`/api/delivery-points/trip/${tripId}`],
    enabled: !!tripId,
  });

  const startTripMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("PUT", `/api/upcoming-trips/${tripId}/start`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/upcoming-trips/${tripId}`] });
      toast({
        title: "Trip Started!",
        description: "Navigate to your first stop",
        duration: 2000,
      });
      setLocation(`/navigate/${tripId}`);
    },
  });

  if (tripLoading || pointsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="space-y-4 animate-pulse">
          <div className="h-20 bg-muted rounded-xl"></div>
          <div className="h-40 bg-muted rounded-xl"></div>
          <div className="h-96 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 flex items-center justify-center">
        <Card className="p-8 text-center">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Trip Not Found</h2>
          <p className="text-muted-foreground mb-4">The trip you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation("/")} data-testid="button-back-to-dashboard">
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const completedCount = deliveryPoints.filter(p => p.status === "completed").length;
  const progress = deliveryPoints.length > 0 ? (completedCount / deliveryPoints.length) * 100 : 0;

  const statusColors: Record<string, string> = {
    upcoming: "from-blue-500 to-cyan-500",
    in_progress: "from-green-500 to-emerald-500",
    completed: "from-gray-500 to-slate-500",
  };

  const statusLabels: Record<string, string> = {
    upcoming: "Upcoming",
    in_progress: "In Progress",
    completed: "Completed",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${statusColors[trip.status]} text-white p-4 sticky top-0 z-10 shadow-lg`}>
        <div className="flex items-center gap-3 mb-3">
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
            <h1 className="text-xl font-bold" data-testid="text-trip-title">{trip.title}</h1>
            <div className="flex items-center gap-2 text-sm text-white/90">
              <Calendar className="w-4 h-4" />
              <span data-testid="text-trip-time">{format(new Date(trip.scheduledTime), "EEEE, MMM dd 'at' h:mm a")}</span>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm`}>
            {statusLabels[trip.status]}
          </div>
        </div>

        {/* Progress Bar */}
        {trip.status !== "upcoming" && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span data-testid="text-progress-count">{completedCount} of {deliveryPoints.length} stops</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${progress}%` }}
                data-testid="progress-bar"
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Route Overview */}
        <Card className="p-4 space-y-3">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Truck className="w-5 h-5 text-taabi-blue" />
            Route Overview
          </h2>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <MapPinned className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Start Location</p>
                <p className="font-medium" data-testid="text-start-location">{trip.startLocation}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">End Location</p>
                <p className="font-medium" data-testid="text-end-location">{trip.endLocation}</p>
              </div>
            </div>
          </div>

          {trip.status === "upcoming" && (
            <Button
              className="w-full gap-2"
              onClick={() => startTripMutation.mutate()}
              disabled={startTripMutation.isPending}
              data-testid="button-start-trip"
            >
              <Navigation className="w-4 h-4" />
              {startTripMutation.isPending ? "Starting..." : "Start Trip"}
            </Button>
          )}

          {trip.status === "in_progress" && (
            <Button
              className="w-full gap-2"
              onClick={() => setLocation(`/navigate/${tripId}`)}
              data-testid="button-navigate"
            >
              <Navigation className="w-4 h-4" />
              Navigate
            </Button>
          )}
        </Card>

        {/* Delivery Points */}
        <div className="space-y-3">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-taabi-blue" />
            Delivery Points ({deliveryPoints.length})
          </h2>

          <div className="space-y-3">
            {deliveryPoints.map((point, index) => {
              const Icon = locationIcons[point.locationType as keyof typeof locationIcons] || Store;
              const isCompleted = point.status === "completed";
              const isCurrent = trip.currentStopIndex === index && trip.status === "in_progress";

              return (
                <Card
                  key={point.id}
                  className={`p-4 transition-all ${isCurrent ? "ring-2 ring-taabi-blue shadow-lg" : ""} ${isCompleted ? "opacity-60" : ""}`}
                  data-testid={`card-delivery-point-${index}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? "bg-green-100 text-green-600" :
                      isCurrent ? "bg-blue-100 text-blue-600" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="font-bold text-sm">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold" data-testid={`text-point-name-${index}`}>{point.name}</h3>
                          {isCurrent && (
                            <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mt-1">
                              Current Stop
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground flex-shrink-0">
                          <Icon className="w-4 h-4" />
                          <span className="capitalize">{point.locationType}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2" data-testid={`text-point-address-${index}`}>
                        {point.address}
                      </p>

                      {point.instructions && (
                        <p className="text-sm bg-muted/50 p-2 rounded-md mb-2" data-testid={`text-point-instructions-${index}`}>
                          {point.instructions}
                        </p>
                      )}

                      {point.contactPhone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <a
                            href={`tel:${point.contactPhone}`}
                            className="hover:text-foreground transition-colors"
                            data-testid={`link-phone-${index}`}
                          >
                            {point.contactPhone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

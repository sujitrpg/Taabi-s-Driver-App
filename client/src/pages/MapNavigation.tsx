import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { UpcomingTrip, DeliveryPoint } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Phone, 
  CheckCircle2, 
  Clock,
  MapPinned,
  ChevronUp,
  Factory,
  Home,
  Store,
  Warehouse
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const locationIcons = {
  warehouse: Warehouse,
  factory: Factory,
  shop: Store,
  home: Home,
};

export default function MapNavigation() {
  const [, params] = useRoute("/navigate/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const tripId = params?.id;

  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [isNearDestination, setIsNearDestination] = useState(false);

  const { data: trip } = useQuery<UpcomingTrip>({
    queryKey: [`/api/upcoming-trips/${tripId}`],
    enabled: !!tripId,
  });

  const { data: deliveryPoints = [] } = useQuery<DeliveryPoint[]>({
    queryKey: [`/api/delivery-points/trip/${tripId}`],
    enabled: !!tripId,
  });

  const completeStopMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("PUT", `/api/upcoming-trips/${tripId}/complete-stop`);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: [`/api/upcoming-trips/${tripId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/delivery-points/trip/${tripId}`] });
      
      if (data.allCompleted) {
        toast({
          title: "Trip Completed!",
          description: "All delivery points have been completed.",
          duration: 5000,
        });
        setTimeout(() => {
          setLocation("/");
        }, 2000);
      } else {
        toast({
          title: "Stop Completed!",
          description: "Moving to next delivery point...",
        });
        setSimulatedProgress(0);
      }
    },
  });

  const currentPoint = deliveryPoints[trip?.currentStopIndex ?? 0];
  const nextPoint = deliveryPoints[(trip?.currentStopIndex ?? 0) + 1];
  const Icon = currentPoint ? locationIcons[currentPoint.locationType as keyof typeof locationIcons] || Store : Store;

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedProgress((prev) => {
        if (prev >= 100) {
          setIsNearDestination(true);
          return 100;
        }
        // Consider "near" when progress is > 90%
        if (prev >= 90) {
          setIsNearDestination(true);
        }
        return prev + 0.5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [trip?.currentStopIndex]);

  // Reset proximity when moving to next stop
  useEffect(() => {
    setIsNearDestination(false);
    setSimulatedProgress(0);
  }, [trip?.currentStopIndex]);

  if (!trip || !currentPoint) {
    return (
      <div className="h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="p-8 text-center">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">No Active Navigation</h2>
          <Button onClick={() => setLocation("/")} data-testid="button-back-home">
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const completedCount = deliveryPoints.filter(p => p.status === "completed").length;
  const totalStops = deliveryPoints.length;

  return (
    <div className="h-screen relative overflow-hidden bg-slate-100">
      {/* Google Maps Style Background */}
      <div className="absolute inset-0 bg-gray-100">
        {/* Street Grid */}
        <svg className="absolute inset-0 w-full h-full">
          {/* Horizontal streets */}
          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((y) => (
            <line
              key={`h-${y}`}
              x1="0"
              y1={`${y}%`}
              x2="100%"
              y2={`${y}%`}
              stroke="#e5e7eb"
              strokeWidth="8"
            />
          ))}
          
          {/* Vertical streets */}
          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((x) => (
            <line
              key={`v-${x}`}
              x1={`${x}%`}
              y1="0"
              x2={`${x}%`}
              y2="100%"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
          ))}
          
          {/* Street labels */}
          <text x="5%" y="22%" fill="#9ca3af" fontSize="10" fontWeight="500">Main St</text>
          <text x="5%" y="42%" fill="#9ca3af" fontSize="10" fontWeight="500">Park Ave</text>
          <text x="5%" y="62%" fill="#9ca3af" fontSize="10" fontWeight="500">Oak Rd</text>
          
          {/* Buildings */}
          {Array.from({ length: 30 }).map((_, idx) => {
            const gridX = (idx % 8) * 11 + 2;
            const gridY = Math.floor(idx / 8) * 11 + 2;
            return (
              <rect
                key={`building-${idx}`}
                x={`${gridX}%`}
                y={`${gridY}%`}
                width="6%"
                height="6%"
                fill="#d1d5db"
                stroke="#9ca3af"
                strokeWidth="0.5"
              />
            );
          })}
        </svg>

        {/* Active Route */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Route path with turns */}
          <path
            d="M 50 85 L 50 70 L 40 70 L 40 50 L 30 50 L 30 30 L 50 30 L 50 20"
            fill="none"
            stroke="#1967D2"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Progress indicator */}
          <motion.path
            d="M 50 85 L 50 70 L 40 70 L 40 50 L 30 50 L 30 30 L 50 30 L 50 20"
            fill="none"
            stroke="#4285F4"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="400"
            initial={{ strokeDashoffset: 400 }}
            animate={{ strokeDashoffset: 400 - (simulatedProgress * 4) }}
            transition={{ duration: 0.5 }}
          />
        </svg>

        {/* Current Location Pin */}
        <motion.div
          className="absolute"
          style={{
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            left: simulatedProgress < 15 ? '50%' :
                  simulatedProgress < 35 ? '50%' :
                  simulatedProgress < 55 ? '40%' :
                  simulatedProgress < 75 ? '30%' :
                  simulatedProgress < 90 ? '50%' : '50%',
            top: simulatedProgress < 15 ? '85%' :
                 simulatedProgress < 35 ? '70%' :
                 simulatedProgress < 55 ? '50%' :
                 simulatedProgress < 75 ? '30%' :
                 simulatedProgress < 90 ? '30%' : '20%',
          }}
          transition={{ duration: 0.5, ease: "linear" }}
        >
          <div className="relative">
            <div className="absolute -inset-3 bg-blue-500/20 rounded-full"></div>
            <div className="w-8 h-8 bg-blue-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
              <Navigation className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Destination Pin */}
        <div 
          className="absolute" 
          style={{
            left: '50%',
            top: '20%',
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="relative">
            <MapPin className="w-10 h-10 text-red-600" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-4">
        <div className="flex items-center gap-3 text-white">
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={() => setLocation(`/trip/${tripId}`)}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm opacity-90">
              <Clock className="w-4 h-4" />
              <span>ETA: ~15 min</span>
            </div>
            <div className="font-bold text-lg" data-testid="text-trip-progress">
              Stop {completedCount + 1} of {totalStops}
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Progress Bar */}
      <div className="absolute top-20 left-4 right-4 z-20">
        <Card className="p-3 backdrop-blur-sm bg-white/90 shadow-lg">
          <div className="flex items-center gap-3">
            <MapPinned className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">En route to</p>
              <p className="font-bold text-sm truncate" data-testid="text-destination-name">{currentPoint.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Distance</p>
              <p className="font-bold text-sm">2.4 km</p>
            </div>
          </div>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${simulatedProgress}%` }}
              transition={{ duration: 0.3 }}
              data-testid="progress-route"
            />
          </div>
        </Card>
      </div>

      {/* Bottom Sheet */}
      <AnimatePresence>
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-30"
          initial={{ y: "80%" }}
          animate={{ y: isBottomSheetExpanded ? 0 : "calc(100% - 220px)" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          <Card className="rounded-t-3xl shadow-2xl overflow-hidden">
            {/* Drag Handle */}
            <button
              className="w-full py-3 flex justify-center hover:bg-muted/50 transition-colors"
              onClick={() => setIsBottomSheetExpanded(!isBottomSheetExpanded)}
              data-testid="button-expand-sheet"
            >
              <motion.div
                animate={{ rotate: isBottomSheetExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronUp className="w-6 h-6 text-muted-foreground" />
              </motion.div>
            </button>

            <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto pb-6">
              {/* Current Stop Details */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        Current Stop
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {currentPoint.locationType}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold mb-1" data-testid="text-current-stop-name">
                      {currentPoint.name}
                    </h2>
                    <p className="text-sm text-muted-foreground" data-testid="text-current-stop-address">
                      {currentPoint.address}
                    </p>
                  </div>
                </div>

                {currentPoint.instructions && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-amber-900" data-testid="text-instructions">
                      {currentPoint.instructions}
                    </p>
                  </div>
                )}

                {currentPoint.contactPhone && (
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => window.location.href = `tel:${currentPoint.contactPhone}`}
                    data-testid="button-call-contact"
                  >
                    <Phone className="w-4 h-4" />
                    Call {currentPoint.contactPhone}
                  </Button>
                )}

                <Button
                  className="w-full gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                  onClick={() => completeStopMutation.mutate()}
                  disabled={!isNearDestination || completeStopMutation.isPending}
                  data-testid="button-complete-stop"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {completeStopMutation.isPending 
                    ? "Completing..." 
                    : isNearDestination 
                      ? "Complete Stop" 
                      : "Arrive at Location First"}
                </Button>
                {!isNearDestination && (
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Navigate closer to the delivery point to complete this stop
                  </p>
                )}
              </div>

              {/* Next Stop Preview */}
              {nextPoint && (
                <div className="pt-4 border-t space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Next Stop</p>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" data-testid="text-next-stop-name">{nextPoint.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{nextPoint.address}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Trip Overview */}
              {isBottomSheetExpanded && (
                <div className="pt-4 border-t space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Trip Overview</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold" data-testid="text-completed-count">{completedCount}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Remaining</p>
                      <p className="text-2xl font-bold" data-testid="text-remaining-count">{totalStops - completedCount}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

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
  Warehouse,
  Camera,
  X
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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
  
  // E-Proof of Delivery states
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [proofStep, setProofStep] = useState<'otp' | 'camera'>('otp');
  const [otpValue, setOtpValue] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState(false);

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
      
      // Reset proof dialog
      setShowProofDialog(false);
      setProofStep('otp');
      setOtpValue('');
      setCapturedPhoto(false);
      
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
  
  const handleCompleteStopClick = () => {
    setShowProofDialog(true);
    setProofStep('otp');
    setOtpValue('');
    setCapturedPhoto(false);
  };
  
  const handleOtpSubmit = () => {
    if (otpValue.length === 4) {
      setProofStep('camera');
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 4-digit OTP",
        variant: "destructive",
      });
    }
  };
  
  const handleCameraCapture = () => {
    setCapturedPhoto(true);
    setTimeout(() => {
      completeStopMutation.mutate();
    }, 500);
  };

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
    <div className="h-screen relative overflow-hidden" style={{ backgroundColor: '#1a2332' }}>
      {/* Dark Google Maps Style Background */}
      <div className="absolute inset-0" style={{ backgroundColor: '#1a2332' }}>
        {/* Street Grid - Dark theme */}
        <svg className="absolute inset-0 w-full h-full">
          {/* Horizontal streets */}
          {[15, 30, 45, 60, 75].map((y) => (
            <line
              key={`h-${y}`}
              x1="0"
              y1={`${y}%`}
              x2="100%"
              y2={`${y}%`}
              stroke="#2d3748"
              strokeWidth="2"
            />
          ))}
          
          {/* Vertical streets */}
          {[15, 30, 45, 60, 75].map((x) => (
            <line
              key={`v-${x}`}
              x1={`${x}%`}
              y1="0"
              x2={`${x}%`}
              y2="100%"
              stroke="#2d3748"
              strokeWidth="2"
            />
          ))}
          
          {/* Area labels with dark theme text */}
          <text x="8%" y="25%" fill="#718096" fontSize="11" fontWeight="500">Residential</text>
          <text x="65%" y="55%" fill="#718096" fontSize="11" fontWeight="500">Commercial</text>
        </svg>

        {/* Optimized Route Path - Clean bright blue like Google Maps */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
          {(() => {
            // Define the full optimized route path
            const fullRoutePath = "M 50 85 L 48 80 L 46 75 L 44 70 L 42 65 L 40 60 L 38 55 L 36 50 L 35 45 L 36 40 L 38 35 L 40 30 L 42 27 L 44 24 L 46 22 L 48 21 L 50 20";
            
            // Calculate how much of the route has been completed based on progress
            const totalPathLength = 400; // approximate path length
            const completedLength = (simulatedProgress / 100) * totalPathLength;
            
            return (
              <>
                {/* Full route path - gray (unvisited portion) */}
                <path
                  d={fullRoutePath}
                  fill="none"
                  stroke="#4a5568"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.6"
                />
                
                {/* Active route ahead - bright blue with glow like Google Maps */}
                <motion.path
                  d={fullRoutePath}
                  fill="none"
                  stroke="#1E90FF"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={totalPathLength}
                  strokeDashoffset={-completedLength}
                  style={{ 
                    filter: 'drop-shadow(0 0 8px rgba(30, 144, 255, 0.8))',
                  }}
                  transition={{ duration: 0.3 }}
                />
              </>
            );
          })()}
        </svg>

        {/* Current Location Pin - follows the route */}
        <motion.div
          className="absolute"
          style={{
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
          animate={{
            left: `${50 - (simulatedProgress / 100) * 2}%`,
            top: `${85 - (simulatedProgress / 100) * 65}%`,
          }}
          transition={{ duration: 0.3, ease: "linear" }}
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-500/30 rounded-full animate-pulse"></div>
            <div className="w-10 h-10 bg-white rounded-full border-4 border-blue-500 shadow-xl flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(30, 144, 255, 0.6)' }}>
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
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
            zIndex: 10,
          }}
        >
          <div className="relative">
            <div className="absolute -inset-2 bg-red-500/20 rounded-full"></div>
            <MapPin className="w-12 h-12 text-red-500" fill="currentColor" style={{ filter: 'drop-shadow(0 4px 12px rgba(239, 68, 68, 0.5))' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-lg text-xs font-semibold whitespace-nowrap">
              {currentPoint.name}
            </div>
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

      

      {/* Bottom Sheet */}
      <AnimatePresence>
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-30"
          initial={{ y: "80%" }}
          animate={{ y: isBottomSheetExpanded ? 0 : "calc(100% - 220px)" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          <Card className="rounded-t-3xl shadow-2xl overflow-hidden">
            {/* Drag Handle / Reached Indicator */}
            <button
              className="w-full py-3 flex justify-center hover:bg-muted/50 transition-colors"
              onClick={() => setIsBottomSheetExpanded(!isBottomSheetExpanded)}
              data-testid="button-expand-sheet"
            >
              {isNearDestination ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex items-center justify-center w-20 h-8 bg-green-500 rounded-full shadow-lg"
                >
                  <span className="text-white font-bold text-sm">Reached</span>
                </motion.div>
              ) : (
                <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
              )}
            </button>

            <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto pb-6">
              {/* En Route To Card */}
              <Card className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <div className="flex items-center gap-3 mb-2">
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
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${simulatedProgress}%` }}
                    transition={{ duration: 0.3 }}
                    data-testid="progress-route"
                  />
                </div>
              </Card>

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
                  onClick={handleCompleteStopClick}
                  disabled={!isNearDestination || completeStopMutation.isPending}
                  data-testid="button-complete-stop"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {completeStopMutation.isPending 
                    ? "Completing..." 
                    : "Complete Stop"}
                </Button>
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
      
      {/* E-Proof of Delivery Dialog */}
      <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-proof-delivery">
          <DialogHeader>
            <DialogTitle>
              {proofStep === 'otp' ? 'Enter Delivery OTP' : 'Capture Photo Proof'}
            </DialogTitle>
            <DialogDescription>
              {proofStep === 'otp' 
                ? 'Please ask the recipient for the 4-digit OTP to confirm delivery.'
                : 'Take a photo of the delivered goods as proof of delivery.'}
            </DialogDescription>
          </DialogHeader>
          
          {proofStep === 'otp' ? (
            <div className="space-y-6 py-4">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={4}
                  value={otpValue}
                  onChange={setOtpValue}
                  data-testid="input-otp"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                For demo purposes, enter any 4-digit code
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowProofDialog(false)}
                  className="flex-1"
                  data-testid="button-cancel-otp"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleOtpSubmit}
                  disabled={otpValue.length !== 4}
                  className="flex-1"
                  data-testid="button-submit-otp"
                >
                  Continue
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                {!capturedPhoto ? (
                  <>
                    <motion.div
                      className="relative w-40 h-40 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Camera className="w-20 h-20 text-white" />
                      <div className="absolute inset-0 rounded-2xl border-4 border-white/30 animate-pulse"></div>
                    </motion.div>
                    
                    <Button
                      onClick={handleCameraCapture}
                      size="lg"
                      className="gap-2"
                      data-testid="button-capture-photo"
                    >
                      <Camera className="w-5 h-5" />
                      Capture Photo
                    </Button>
                  </>
                ) : (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="w-40 h-40 rounded-2xl bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="w-20 h-20 text-white" />
                    </div>
                    <p className="text-lg font-semibold text-green-600">Photo Captured!</p>
                    <p className="text-sm text-muted-foreground">Completing delivery...</p>
                  </motion.div>
                )}
              </div>
              
              {!capturedPhoto && (
                <Button
                  variant="outline"
                  onClick={() => setProofStep('otp')}
                  className="w-full"
                  data-testid="button-back-to-otp"
                >
                  Back to OTP
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

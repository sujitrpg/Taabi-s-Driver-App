import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, CircleDot, Octagon, Moon, Siren, Wrench, Package, Play, CheckCircle2, Trophy } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { LearningVideo } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_DRIVER_ID = "default-driver-1";

export default function LearningHub() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: videos, isLoading } = useQuery<LearningVideo[]>({
    queryKey: ["/api/learning-videos", selectedCategory],
    enabled: true,
  });

  const { data: completedVideos } = useQuery<any[]>({
    queryKey: ["/api/learning-videos/driver", DEFAULT_DRIVER_ID, "completed"],
  });

  const completeVideoMutation = useMutation({
    mutationFn: async (videoId: string) => {
      const res = await apiRequest("POST", `/api/learning-videos/${videoId}/complete`, { driverId: DEFAULT_DRIVER_ID });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/learning-videos/driver", DEFAULT_DRIVER_ID, "completed"] });
      queryClient.invalidateQueries({ queryKey: ["/api/driver"] });
      toast({
        title: "Video Completed!",
        description: `You earned ${data.pointsEarned} Taabi points!`,
      });
    },
  });

  const categories = [
    { id: "tyres", label: "Tyres", icon: CircleDot, color: "bg-blue-500" },
    { id: "braking", label: "Braking", icon: Octagon, color: "bg-red-500" },
    { id: "night_driving", label: "Night Driving", icon: Moon, color: "bg-indigo-500" },
    { id: "emergency", label: "Emergency", icon: Siren, color: "bg-orange-500" },
    { id: "maintenance", label: "Maintenance", icon: Wrench, color: "bg-emerald-500" },
  ];

  const filteredVideos = selectedCategory
    ? videos?.filter((v) => v.category === selectedCategory)
    : videos;

  const completedVideoIds = new Set(completedVideos?.map((c) => c.videoId) || []);

  const totalPoints = completedVideos?.reduce((sum, c) => sum + c.pointsEarned, 0) || 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-[35vh] bg-gradient-to-br from-taabi-blue/20 to-purple-500/20 flex items-center justify-center">
        <div className="text-center p-4">
          <GraduationCap className="w-16 h-16 text-taabi-blue mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Safety Learning Hub</h1>
          <p className="text-muted-foreground">Watch, learn, and earn Taabi points</p>
          <p className="text-xs text-muted-foreground/60 mt-2">15-30 sec micro-learning videos</p>
        </div>
      </div>

      <div className="p-4 -mt-8 space-y-6">
        <Card className="p-6 bg-gradient-to-br from-lime-green/10 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-1">Your Learning Progress</h3>
              <p className="text-sm text-muted-foreground">
                {completedVideos?.length || 0} videos completed
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-2xl font-bold text-lime-green">
                <Trophy className="w-6 h-6" />
                {totalPoints}
              </div>
              <p className="text-xs text-muted-foreground">Points Earned</p>
            </div>
          </div>
        </Card>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            className="rounded-full flex-shrink-0"
            onClick={() => setSelectedCategory(null)}
            data-testid="button-filter-all"
          >
            All Topics
          </Button>
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <Button
                key={category.id}
                variant={isSelected ? "default" : "outline"}
                className={`flex items-center gap-2 rounded-full flex-shrink-0 ${
                  isSelected ? `${category.color} text-white border-0` : ""
                }`}
                onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                data-testid={`button-filter-${category.id}`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </Button>
            );
          })}
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </>
          ) : (
            filteredVideos?.map((video) => {
              const iconMap: Record<string, any> = {
                "circle-dot": CircleDot,
                octagon: Octagon,
                moon: Moon,
                siren: Siren,
                wrench: Wrench,
                package: Package,
              };
              const Icon = iconMap[video.iconName] || Play;
              const categoryInfo = categories.find((c) => c.id === video.category);
              const isCompleted = completedVideoIds.has(video.id);

              return (
                <Card key={video.id} className="p-5 hover-elevate" data-testid={`card-video-${video.id}`}>
                  <div className="flex gap-4">
                    <div className={`w-20 h-20 rounded-xl ${categoryInfo?.color || "bg-gray-500"} text-white flex items-center justify-center flex-shrink-0 relative`}>
                      <Icon className="w-8 h-8" />
                      {isCompleted && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-lime-green rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-bold text-lg" data-testid={`text-video-title-${video.id}`}>
                            {video.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{video.duration}s video</p>
                        </div>
                        <Badge className="bg-lime-green/20 text-lime-green border-lime-green/30 flex-shrink-0">
                          +{video.pointsReward} pts
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{video.description}</p>
                      <Button
                        size="sm"
                        variant={isCompleted ? "outline" : "default"}
                        disabled={isCompleted || completeVideoMutation.isPending}
                        onClick={() => completeVideoMutation.mutate(video.id)}
                        data-testid={`button-watch-${video.id}`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Watch & Earn
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

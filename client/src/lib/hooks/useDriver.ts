import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { Driver } from "@shared/schema";

export function useDriver(driverId: string) {
  return useQuery<Driver>({
    queryKey: ["/api/driver", driverId],
    enabled: !!driverId,
  });
}

export function useDriverRank(driverId: string) {
  return useQuery<{ rank: number; totalDrivers: number }>({
    queryKey: ["/api/driver", driverId, "rank"],
    enabled: !!driverId,
  });
}

export function useLeaderboard(period: string = "weekly") {
  return useQuery<Driver[]>({
    queryKey: ["/api/leaderboard", period],
    queryFn: async () => {
      const response = await fetch(`/api/leaderboard?period=${period}`);
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      return response.json();
    },
  });
}

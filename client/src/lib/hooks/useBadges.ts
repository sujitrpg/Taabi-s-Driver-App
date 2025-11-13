import { useQuery } from "@tanstack/react-query";
import type { Badge, DriverBadge } from "@shared/schema";

export function useAllBadges() {
  return useQuery<Badge[]>({
    queryKey: ["/api/badges"],
  });
}

export function useDriverBadges(driverId: string) {
  return useQuery<(DriverBadge & { badge: Badge })[]>({
    queryKey: ["/api/driver-badges", driverId],
    enabled: !!driverId,
  });
}

import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { NearbyPlace } from "@shared/schema";

export function useNearbyPlaces(category?: string) {
  return useQuery<NearbyPlace[]>({
    queryKey: ["/api/nearby-places", category],
    queryFn: async () => {
      const url = category ? `/api/nearby-places?category=${category}` : "/api/nearby-places";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch nearby places");
      return response.json();
    },
  });
}

export function useCreateNearbyPlace() {
  return useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/nearby-places", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nearby-places"] });
    },
  });
}

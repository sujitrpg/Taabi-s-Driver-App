import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { CommunityPost, Driver } from "@shared/schema";

export function useCommunityPosts() {
  return useQuery<(CommunityPost & { driver: Driver })[]>({
    queryKey: ["/api/community/posts"],
  });
}

export function useCreatePost() {
  return useMutation({
    mutationFn: async (data: { driverId: string; content: string; category: string; images?: string[] }) => {
      return apiRequest("POST", "/api/community/posts", data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/driver", variables.driverId] });
    },
  });
}

export function useLikePost() {
  return useMutation({
    mutationFn: async (postId: string) => {
      return apiRequest("POST", `/api/community/posts/${postId}/like`, {});
    },
    onSuccess: () => {
      // Invalidate posts to show updated like count
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
    },
  });
}

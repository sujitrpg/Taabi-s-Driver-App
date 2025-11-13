import { useQuery } from "@tanstack/react-query";
import type { WellnessTip } from "@shared/schema";

export function useWellnessTips() {
  return useQuery<WellnessTip[]>({
    queryKey: ["/api/wellness-tips"],
  });
}

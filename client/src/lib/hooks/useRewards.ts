import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Voucher, Redemption } from "@shared/schema";

export function useVouchers() {
  return useQuery<Voucher[]>({
    queryKey: ["/api/vouchers"],
  });
}

export function useRedemptions(driverId: string) {
  return useQuery<(Redemption & { voucher: Voucher })[]>({
    queryKey: ["/api/redemptions", driverId],
    enabled: !!driverId,
  });
}

export function useRedeemVoucher() {
  return useMutation({
    mutationFn: async (data: { driverId: string; voucherId: string }) => {
      return apiRequest("POST", "/api/rewards/redeem", data);
    },
    onSuccess: (_data, variables) => {
      // Immediately invalidate driver data to refresh points
      queryClient.invalidateQueries({ queryKey: ["/api/driver", variables.driverId] });
      queryClient.invalidateQueries({ queryKey: ["/api/redemptions", variables.driverId] });
      queryClient.invalidateQueries({ queryKey: ["/api/vouchers"] });
    },
  });
}

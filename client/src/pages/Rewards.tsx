import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Gift, Fuel, UtensilsCrossed, Smartphone, QrCode, CheckCircle2, Coins } from "lucide-react";
import { useVouchers, useRedeemVoucher } from "@/lib/hooks/useRewards";
import { useDriver } from "@/lib/hooks/useDriver";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Voucher as VoucherType } from "@shared/schema";

const CURRENT_DRIVER_ID = "default-driver-1";

const getVoucherIcon = (category: string) => {
  switch (category) {
    case "fuel": return Fuel;
    case "food": return UtensilsCrossed;
    case "recharge": return Smartphone;
    default: return Gift;
  }
};

export default function Rewards() {
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherType | null>(null);
  const [redeemedQR, setRedeemedQR] = useState<string | null>(null);
  
  const { data: vouchers, isLoading: vouchersLoading } = useVouchers();
  const { data: driver } = useDriver(CURRENT_DRIVER_ID);
  const redeemMutation = useRedeemVoucher();
  const { toast } = useToast();

  const userPoints = driver?.totalPoints || 0;

  const handleRedeem = async () => {
    if (!selectedVoucher) return;
    
    try {
      const result = await redeemMutation.mutateAsync({
        driverId: CURRENT_DRIVER_ID,
        voucherId: selectedVoucher.id,
      });
      
      setRedeemedQR(result.qrCode);
      toast({
        title: "Voucher Redeemed!",
        description: `You've redeemed ${selectedVoucher.name}`,
      });
      
      setTimeout(() => {
        setRedeemedQR(null);
        setSelectedVoucher(null);
      }, 5000);
    } catch (error: any) {
      toast({
        title: "Redemption Failed",
        description: error.message || "Failed to redeem voucher",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-[30vh] bg-gradient-to-br from-lime-green/20 to-taabi-blue/20 flex items-center justify-center">
        <div className="text-center">
          <Gift className="w-16 h-16 text-lime-green mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Rewards</h1>
          <p className="text-muted-foreground">Redeem your hard-earned points</p>
        </div>
      </div>

      <div className="p-4 -mt-8 space-y-6">
        <Card className="p-6 bg-gradient-to-br from-lime-green to-lime-green/80 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <Coins className="w-5 h-5" />
                <span className="text-sm font-medium">Available Points</span>
              </div>
              <div className="text-4xl font-bold" data-testid="text-available-points">
                {userPoints.toLocaleString()}
              </div>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Coins className="w-8 h-8" />
            </div>
          </div>
        </Card>

        <div>
          <h2 className="text-xl font-bold mb-4">Redeem Points</h2>
          <div className="grid grid-cols-1 gap-4">
            {vouchersLoading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </>
            ) : (
              vouchers?.map((voucher) => {
                const Icon = getVoucherIcon(voucher.category);
                const canAfford = userPoints >= voucher.pointCost;
                
                return (
                  <Card 
                    key={voucher.id} 
                    className={`p-6 ${!canAfford && "opacity-50"}`}
                    data-testid={`card-voucher-${voucher.id}`}
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-taabi-blue/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-8 h-8 text-taabi-blue" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1" data-testid={`text-voucher-name-${voucher.id}`}>
                          {voucher.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {voucher.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-lime-green" />
                            <span className="font-semibold text-lime-green">
                              {voucher.pointCost} points
                            </span>
                          </div>
                          <Button
                            size="sm"
                            disabled={!canAfford || redeemMutation.isPending}
                            onClick={() => setSelectedVoucher(voucher)}
                            className="bg-taabi-blue hover:bg-taabi-blue/90"
                            data-testid={`button-redeem-${voucher.id}`}
                          >
                            {redeemMutation.isPending ? "Redeeming..." : "Redeem"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>

      <Dialog open={selectedVoucher !== null} onOpenChange={() => { setSelectedVoucher(null); setRedeemedQR(null); }}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-redeem">
          {!redeemedQR ? (
            <>
              <DialogHeader>
                <DialogTitle>Confirm Redemption</DialogTitle>
                <DialogDescription>
                  You're about to redeem {selectedVoucher?.pointCost} points for this voucher
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-6">
                {selectedVoucher && (
                  <>
                    <div className="w-20 h-20 rounded-2xl bg-taabi-blue/10 flex items-center justify-center">
                      {(() => {
                        const Icon = getVoucherIcon(selectedVoucher.category);
                        return <Icon className="w-10 h-10 text-taabi-blue" />;
                      })()}
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-xl mb-2">{selectedVoucher.name}</h3>
                      <p className="text-muted-foreground">{selectedVoucher.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-lime-green font-semibold">
                      <Coins className="w-5 h-5" />
                      <span>{selectedVoucher.pointCost} points</span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedVoucher(null)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-taabi-blue hover:bg-taabi-blue/90" onClick={handleRedeem} data-testid="button-confirm-redeem">
                  Confirm
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-20 h-20 rounded-full bg-lime-green/20 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-lime-green" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl mb-2">Voucher Redeemed!</h3>
                <p className="text-muted-foreground mb-6">
                  Show this QR code at the partner location
                </p>
              </div>
              <div className="w-48 h-48 bg-white rounded-2xl border-4 border-taabi-blue flex items-center justify-center">
                <QrCode className="w-32 h-32 text-taabi-blue" />
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Code: {redeemedQR}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

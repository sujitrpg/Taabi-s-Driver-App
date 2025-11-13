import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, TrendingUp } from "lucide-react";

interface PointsWalletProps {
  points: number;
  recentEarnings?: number;
  onRedeem?: () => void;
}

export function PointsWallet({ points, recentEarnings, onRedeem }: PointsWalletProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-taabi-blue to-taabi-blue/80 text-white border-0" data-testid="card-points-wallet">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Taabi Points</span>
          </div>
          <div className="text-4xl font-bold mb-2" data-testid="text-total-points">
            {points.toLocaleString()}
          </div>
          {recentEarnings !== undefined && recentEarnings > 0 && (
            <div className="flex items-center gap-1 text-lime-green text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span data-testid="text-recent-earnings">+{recentEarnings} today</span>
            </div>
          )}
        </div>
        <Button 
          onClick={onRedeem}
          variant="secondary"
          size="lg"
          className="bg-white text-taabi-blue hover:bg-white/90"
          data-testid="button-redeem"
        >
          Redeem
        </Button>
      </div>
    </Card>
  );
}

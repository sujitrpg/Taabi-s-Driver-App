import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, HeartPulse, IndianRupee, LifeBuoy, Truck, Phone, Globe, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SupportResource } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function SupportHub() {
  const { data: resources, isLoading } = useQuery<SupportResource[]>({
    queryKey: ["/api/support-resources"],
  });

  const categories = [
    { id: "accidental_insurance", label: "Accidental Insurance", icon: ShieldCheck, color: "bg-blue-500" },
    { id: "health_insurance", label: "Health Insurance", icon: HeartPulse, color: "bg-pink-500" },
    { id: "loan", label: "Loans & Cash Advance", icon: IndianRupee, color: "bg-emerald-500" },
    { id: "emergency_fund", label: "Emergency Fund", icon: LifeBuoy, color: "bg-red-500" },
  ];

  const groupedResources = categories.map((category) => ({
    ...category,
    items: resources?.filter((r) => r.category === category.id) || [],
  }));

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-[35vh] bg-gradient-to-br from-taabi-blue/20 to-emerald-500/20 flex items-center justify-center">
        <div className="text-center p-4">
          <LifeBuoy className="w-16 h-16 text-taabi-blue mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Driver Support Hub</h1>
          <p className="text-muted-foreground">Insurance, loans & financial assistance</p>
          <p className="text-xs text-muted-foreground/60 mt-2">Verified partners for your safety & security</p>
        </div>
      </div>

      <div className="p-4 -mt-8 space-y-6">
        <Card className="p-6 bg-gradient-to-br from-taabi-blue/10 to-transparent">
          <h3 className="font-bold text-lg mb-2">Your Safety Matters</h3>
          <p className="text-sm text-muted-foreground">
            Access trusted insurance, financial support, and emergency assistance. All partners are verified and driver-friendly.
          </p>
        </Card>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : (
          groupedResources.map((category) => {
            if (category.items.length === 0) return null;
            const Icon = category.icon;
            
            return (
              <div key={category.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg ${category.color} text-white flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">{category.label}</h2>
                </div>

                <div className="space-y-3">
                  {category.items.map((resource) => {
                    const iconMap: Record<string, any> = {
                      "shield-check": ShieldCheck,
                      "heart-pulse": HeartPulse,
                      "indian-rupee": IndianRupee,
                      "life-buoy": LifeBuoy,
                      "truck": Truck,
                    };
                    const ResourceIcon = iconMap[resource.iconName] || ShieldCheck;

                    return (
                      <Card key={resource.id} className="p-5 hover-elevate" data-testid={`card-resource-${resource.id}`}>
                        <div className="flex gap-4">
                          <div className={`w-14 h-14 rounded-xl ${category.color} text-white flex items-center justify-center flex-shrink-0`}>
                            <ResourceIcon className="w-7 h-7" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-bold text-lg" data-testid={`text-resource-title-${resource.id}`}>
                                {resource.title}
                              </h3>
                              {resource.isVerified && (
                                <Badge className="bg-lime-green/20 text-lime-green border-lime-green/30 flex-shrink-0">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                              {resource.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {resource.contactNumber && (
                                <Button size="sm" variant="default" className="flex-1 min-w-[120px]" data-testid={`button-call-${resource.id}`}>
                                  <Phone className="w-4 h-4 mr-2" />
                                  Call Now
                                </Button>
                              )}
                              {resource.website && (
                                <Button size="sm" variant="outline" className="flex-1 min-w-[120px]" data-testid={`button-visit-${resource.id}`}>
                                  <Globe className="w-4 h-4 mr-2" />
                                  Visit Website
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

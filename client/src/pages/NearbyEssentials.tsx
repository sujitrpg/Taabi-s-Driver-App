import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UtensilsCrossed, Fuel, Wrench, ParkingCircle, Search, Star, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNearbyPlaces } from "@/lib/hooks/useNearbyPlaces";
import { Skeleton } from "@/components/ui/skeleton";

type Category = "dhaba" | "fuel" | "mechanic" | "parking";

export default function NearbyEssentials() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "dhaba" as Category, icon: UtensilsCrossed, label: "Dhabas", color: "bg-orange-500" },
    { id: "fuel" as Category, icon: Fuel, label: "Fuel", color: "bg-emerald-500" },
    { id: "mechanic" as Category, icon: Wrench, label: "Mechanic", color: "bg-blue-500" },
    { id: "parking" as Category, icon: ParkingCircle, label: "Parking", color: "bg-purple-500" },
  ];

  const { data: nearbyPlaces, isLoading } = useNearbyPlaces(selectedCategory || undefined);

  const filteredPlaces = nearbyPlaces?.filter((place) => {
    return !searchQuery || place.name.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-[35vh] bg-gradient-to-br from-emerald-500/20 to-taabi-blue/20 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-taabi-blue mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Nearby Essentials</h1>
          <p className="text-muted-foreground">Find what you need along your route</p>
        </div>
      </div>

      <div className="p-4 -mt-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 bg-card rounded-full h-12"
            data-testid="input-search-places"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <Button
                key={category.id}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "flex items-center gap-2 rounded-full flex-shrink-0",
                  isSelected && `${category.color} text-white border-0`
                )}
                onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                data-testid={`button-filter-${category.id}`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </Button>
            );
          })}
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </>
          ) : (
            filteredPlaces.map((place) => {
              const categoryInfo = categories.find((c) => c.id === place.category);
              const Icon = categoryInfo?.icon || MapPin;
              
              return (
                <Card key={place.id} className="p-4 hover-elevate" data-testid={`card-place-${place.id}`}>
                  <div className="flex gap-4">
                    <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0", categoryInfo?.color, "text-white")}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold" data-testid={`text-place-name-${place.id}`}>{place.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{place.address}</span>
                          </div>
                        </div>
                        {place.discount && (
                          <Badge className="bg-lime-green/20 text-lime-green border-lime-green/30 flex-shrink-0">
                            {place.discount}% OFF
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2 flex-wrap mb-3">
                        {place.isVeg && <Badge variant="secondary" className="text-xs">Veg</Badge>}
                        {place.isNonVeg && <Badge variant="secondary" className="text-xs">Non-Veg</Badge>}
                        {place.hasTruckParking && <Badge variant="secondary" className="text-xs">🚛 Parking</Badge>}
                        {place.hygieneRating && (
                          <Badge variant="secondary" className="text-xs">
                            Hygiene: {place.hygieneRating}/5
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1" data-testid={`button-navigate-${place.id}`}>
                          <Navigation className="w-4 h-4 mr-1" />
                          Navigate
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-call-${place.id}`}>
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {!isLoading && filteredPlaces.length === 0 && (
          <Card className="p-12 text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No places found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function Navigation(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

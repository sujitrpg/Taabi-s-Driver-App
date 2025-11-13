import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/BottomNav";
import Dashboard from "@/pages/Dashboard";
import RoutePlanner from "@/pages/RoutePlanner";
import NearbyEssentials from "@/pages/NearbyEssentials";
import Leaderboard from "@/pages/Leaderboard";
import Rewards from "@/pages/Rewards";
import Community from "@/pages/Community";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import TripSummary from "@/pages/TripSummary";
import Wellness from "@/pages/Wellness";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  const hideNavPaths = ["/login", "/trip-summary"];
  const showNav = !hideNavPaths.includes(location);

  return (
    <>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Dashboard} />
        <Route path="/route" component={RoutePlanner} />
        <Route path="/nearby" component={NearbyEssentials} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/rewards" component={Rewards} />
        <Route path="/community" component={Community} />
        <Route path="/profile" component={Profile} />
        <Route path="/trip-summary" component={TripSummary} />
        <Route path="/wellness" component={Wellness} />
        <Route component={NotFound} />
      </Switch>
      {showNav && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Switch, Route, useLocation, Redirect } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/BottomNav";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { RoadAlertsNotifier } from "@/components/RoadAlertsNotifier";
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
import SupportHub from "@/pages/SupportHub";
import LearningHub from "@/pages/LearningHub";
import TruckChecklist from "@/pages/TruckChecklist";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, path }: { component: any; path?: string }) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <Component />;
}

function Router() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const hideNavPaths = ["/login", "/trip-summary"];
  const showNav = !hideNavPaths.includes(location);

  return (
    <>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/">
          <ProtectedRoute component={Dashboard} path="/" />
        </Route>
        <Route path="/route">
          <ProtectedRoute component={RoutePlanner} path="/route" />
        </Route>
        <Route path="/nearby">
          <ProtectedRoute component={NearbyEssentials} path="/nearby" />
        </Route>
        <Route path="/leaderboard">
          <ProtectedRoute component={Leaderboard} path="/leaderboard" />
        </Route>
        <Route path="/rewards">
          <ProtectedRoute component={Rewards} path="/rewards" />
        </Route>
        <Route path="/community">
          <ProtectedRoute component={Community} path="/community" />
        </Route>
        <Route path="/profile">
          <ProtectedRoute component={Profile} path="/profile" />
        </Route>
        <Route path="/trip-summary">
          <ProtectedRoute component={TripSummary} path="/trip-summary" />
        </Route>
        <Route path="/wellness">
          <ProtectedRoute component={Wellness} path="/wellness" />
        </Route>
        <Route path="/support">
          <ProtectedRoute component={SupportHub} path="/support" />
        </Route>
        <Route path="/learning">
          <ProtectedRoute component={LearningHub} path="/learning" />
        </Route>
        <Route path="/checklist">
          <ProtectedRoute component={TruckChecklist} path="/checklist" />
        </Route>
        <Route component={NotFound} />
      </Switch>
      {showNav && <BottomNav />}
      {isAuthenticated && <RoadAlertsNotifier />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

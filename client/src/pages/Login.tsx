import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, User, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    if (username && password) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", username);
      setLocation("/");
    } else {
      setError("Please enter both username and password");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && username && password) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-taabi-blue via-taabi-blue/90 to-taabi-blue/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Truck className="w-12 h-12 text-taabi-blue" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Taabi Drive+</h1>
          <p className="text-white/80 text-lg">Your intelligent driving companion</p>
          <p className="text-white/60 text-sm mt-2">Powered by taabi.ai</p>
        </div>

        <Card className="p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to continue your journey</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  className="pl-11"
                  data-testid="input-username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  className="pl-11"
                  data-testid="input-password"
                />
              </div>
            </div>

            <Button 
              className="w-full bg-taabi-blue hover:bg-taabi-blue/90" 
              size="lg"
              onClick={handleLogin}
              disabled={!username || !password}
              data-testid="button-login"
            >
              Login
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms & Privacy Policy
          </div>
        </Card>

        <div className="text-center text-white/60 text-sm">
          <p>Powered by Taabi Fleet Solutions</p>
          <p className="text-white/40 mt-1">AI-driven logistics by taabi.ai</p>
        </div>
      </div>
    </div>
  );
}

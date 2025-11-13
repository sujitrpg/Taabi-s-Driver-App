import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, Phone, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [, setLocation] = useLocation();

  const handleSendOtp = () => {
    if (phoneNumber.length === 10) {
      setOtpSent(true);
    }
  };

  const handleLogin = () => {
    setLocation("/");
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
        </div>

        <Card className="p-8 space-y-6">
          {!otpSent ? (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Welcome Back</h2>
                <p className="text-muted-foreground">Enter your phone number to continue</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="pl-11"
                      data-testid="input-phone-number"
                    />
                  </div>
                </div>

                <Button 
                  className="w-full bg-taabi-blue hover:bg-taabi-blue/90" 
                  size="lg"
                  onClick={handleSendOtp}
                  disabled={phoneNumber.length !== 10}
                  data-testid="button-send-otp"
                >
                  Send OTP
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                By continuing, you agree to our Terms & Privacy Policy
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Verify OTP</h2>
                <p className="text-muted-foreground">
                  Enter the 6-digit code sent to +91 {phoneNumber}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="text-center text-2xl tracking-widest"
                    data-testid="input-otp"
                  />
                </div>

                <Button 
                  className="w-full bg-taabi-blue hover:bg-taabi-blue/90" 
                  size="lg"
                  onClick={handleLogin}
                  disabled={otp.length !== 6}
                  data-testid="button-verify-otp"
                >
                  Verify & Login
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setOtpSent(false)}
                  data-testid="button-change-number"
                >
                  Change Phone Number
                </Button>
              </div>
            </>
          )}
        </Card>

        <div className="text-center text-white/60 text-sm">
          <p>Powered by Taabi Fleet Solutions</p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Phone, Shield, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Login() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const { sendOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/";

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setMessage("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const result = await sendOTP(phone);
      if (result.success) {
        setStep("otp");
        setMessage(result.message);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setMessage("Please enter a valid OTP");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const result = await verifyOTP(phone, otp);
      if (result.success) {
        setMessage(result.message);
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp("");
    setMessage("");
    setIsLoading(true);

    try {
      const result = await sendOTP(phone);
      setMessage(result.message);
    } catch (error) {
      setMessage("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4">
              {step === "phone" ? (
                <Phone className="h-6 w-6 text-gold" />
              ) : (
                <Shield className="h-6 w-6 text-gold" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {step === "phone" ? "Welcome Back" : "Verify OTP"}
            </CardTitle>
            <p className="text-muted-foreground">
              {step === "phone" 
                ? "Enter your phone number to continue"
                : `We've sent a 6-digit code to ${phone}`
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === "phone" ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative mt-2">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      +91
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-12 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gold hover:bg-gold/90" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-3 border border-border rounded-md text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-gold mt-2"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    For demo, use: 123456
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gold hover:bg-gold/90" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify & Login"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-sm text-gold hover:underline"
                    disabled={isLoading}
                  >
                    Didn't receive code? Resend OTP
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("phone");
                      setOtp("");
                      setMessage("");
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Change phone number
                  </button>
                </div>
              </form>
            )}

            {message && (
              <div className={cn(
                "p-3 rounded-md text-sm",
                message.includes("success") || message.includes("sent")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              )}>
                <div className="flex items-center space-x-2">
                  {message.includes("success") && <CheckCircle className="h-4 w-4" />}
                  <span>{message}</span>
                </div>
              </div>
            )}

            <Separator />

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Don't have an account?{" "}
                <Link to="/register" className="text-gold hover:underline">
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                By continuing, you agree to our{" "}
                <Link to="/terms" className="text-gold hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-gold hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

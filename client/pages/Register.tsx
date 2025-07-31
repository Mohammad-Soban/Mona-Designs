import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, User, Phone, Shield, CheckCircle, Mail, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Register() {
  const [step, setStep] = useState<"details" | "otp">("details");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    mobile: ""
  });
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { registerUser, verifyRegistrationOTP } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Username validation
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Mobile validation
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (formData.mobile.length !== 10) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const result = await registerUser(formData);
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
      const result = await verifyRegistrationOTP(formData.mobile, otp, formData);
      if (result.success) {
        setMessage(result.message);
        setTimeout(() => {
          navigate("/", { replace: true });
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
      const result = await registerUser(formData);
      setMessage(result.message);
    } catch (error) {
      setMessage("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
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
              {step === "details" ? (
                <User className="h-6 w-6 text-gold" />
              ) : (
                <Shield className="h-6 w-6 text-gold" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {step === "details" ? "Create Account" : "Verify Mobile"}
            </CardTitle>
            <p className="text-muted-foreground">
              {step === "details" 
                ? "Join Mona Designs today"
                : `We've sent a 6-digit code to ${formData.mobile}`
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === "details" ? (
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Email Field */}
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative mt-2">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-black",
                        errors.email ? "border-red-500" : "border-border"
                      )}
                      required
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Username Field */}
                <div>
                  <Label htmlFor="username">Username *</Label>
                  <div className="relative mt-2">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-black",
                        errors.username ? "border-red-500" : "border-border"
                      )}
                      required
                    />
                  </div>
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>

                {/* Password Field */}
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative mt-2">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-black",
                        errors.password ? "border-red-500" : "border-border"
                      )}
                      required
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Mobile Field */}
                <div>
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <div className="relative mt-2">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      <span className="text-sm">+91</span>
                    </div>
                    <input
                      id="mobile"
                      type="tel"
                      placeholder="Enter your mobile number"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value.replace(/\D/g, ""))}
                      className={cn(
                        "w-full pl-16 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-black",
                        errors.mobile ? "border-red-500" : "border-border"
                      )}
                      maxLength={10}
                      required
                    />
                  </div>
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gold hover:bg-gold/90" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
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
                  {isLoading ? "Verifying..." : "Verify & Create Account"}
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
                      setStep("details");
                      setOtp("");
                      setMessage("");
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Change details
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
                Already have an account?{" "}
                <Link to="/login" className="text-gold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                By creating an account, you agree to our{" "}
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

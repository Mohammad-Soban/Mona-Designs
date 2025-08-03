import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Shield, Package, Truck } from "lucide-react";

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface OrderData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
}

export default function Checkout() {
  const { state: cartState, getCartTotal, clearCart, closeCart } = useCart();
  const { state: authState } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState<OrderData>({
    firstName: "",
    lastName: "",
    email: authState.user?.email || "",
    phone: authState.user?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "razorpay"
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Close cart sidebar when component mounts
  useEffect(() => {
    closeCart();
  }, []); // Only run once on mount

  // Redirect if cart is empty
  useEffect(() => {
    if (cartState.items.length === 0) {
      navigate("/");
    }
  }, [cartState.items.length, navigate]);

  // Load Razorpay script
  useEffect(() => {
    // Check if script is already loaded
    if (window.Razorpay) {
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay script loaded successfully");
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
    };
    document.body.appendChild(script);

    return () => {
      // Only remove if the script exists
      const scriptElement = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateSubtotal = () => getCartTotal();
  const calculateShipping = () => calculateSubtotal() >= 2999 ? 0 : 99;
  const calculateTotal = () => calculateSubtotal() + calculateShipping();

  const handleInputChange = (field: keyof OrderData, value: string) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!orderData[field as keyof OrderData]) {
        toast({
          title: "Missing Information",
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`,
          variant: "destructive"
        });
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(orderData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return false;
    }

    // Basic phone validation
    if (orderData.phone.length < 10) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid phone number.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleRazorpayPayment = () => {
    if (!window.Razorpay) {
      toast({
        title: "Payment Error",
        description: "Payment system is not available. Please try again later.",
        variant: "destructive"
      });
      return;
    }

    const amount = calculateTotal() * 100; // Razorpay expects amount in paise

    const options = {
      key: "rzp_test_1234567890", // Replace with your actual Razorpay key
      amount: amount,
      currency: "INR",
      name: "Mona Designers",
      description: "Payment for ethnic wear order",
      image: "/static/images/logo.webp",
      handler: function (response: any) {
        // Payment successful
        console.log("Payment successful:", response);
        
        toast({
          title: "Payment Successful!",
          description: `Payment ID: ${response.razorpay_payment_id}`,
        });

        // Clear cart and redirect
        clearCart();
        navigate("/", { replace: true });
      },
      prefill: {
        name: `${orderData.firstName} ${orderData.lastName}`,
        email: orderData.email,
        contact: orderData.phone,
      },
      notes: {
        address: `${orderData.address}, ${orderData.city}, ${orderData.state} - ${orderData.pincode}`,
      },
      theme: {
        color: "#F59E0B", // Gold color
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response: any) {
      console.error("Payment failed:", response.error);
      toast({
        title: "Payment Failed",
        description: response.error.description || "Payment could not be processed. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    });

    rzp.open();
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simulate order creation API call
    setTimeout(() => {
      if (orderData.paymentMethod === "razorpay") {
        handleRazorpayPayment();
      } else {
        // Handle other payment methods (COD, etc.)
        toast({
          title: "Order Placed",
          description: "Your order has been placed successfully!",
        });
        clearCart();
        navigate("/", { replace: true });
        setIsProcessing(false);
      }
    }, 1000);
  };

  if (cartState.items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-serif font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-gold" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <input
                        id="firstName"
                        type="text"
                        value={orderData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-black"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <input
                        id="lastName"
                        type="text"
                        value={orderData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-black"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <input
                      id="email"
                      type="email"
                      value={orderData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-black"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <input
                      id="phone"
                      type="tel"
                      value={orderData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-black"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-gold" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <input
                      id="address"
                      type="text"
                      value={orderData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-black"
                      placeholder="Street address, apartment, etc."
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <input
                        id="city"
                        type="text"
                        value={orderData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-black"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <input
                        id="state"
                        type="text"
                        value={orderData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-black"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <input
                      id="pincode"
                      type="text"
                      value={orderData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-black"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-gold" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg bg-gold/5 border-gold/30">
                      <input
                        type="radio"
                        id="razorpay"
                        name="paymentMethod"
                        value="razorpay"
                        checked={orderData.paymentMethod === "razorpay"}
                        onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                        className="text-gold"
                      />
                      <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Online Payment (Recommended)</span>
                          <div className="flex items-center space-x-1">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-green-600">Secure</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Pay securely with UPI, Cards, NetBanking & Wallets
                        </p>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cartState.items.map((item, index) => (
                    <div key={`${item.id}-${item.size}-${index}`} className="flex space-x-3">
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {item.size}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <p className="font-semibold text-sm">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {calculateShipping() === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        formatPrice(calculateShipping())
                      )}
                    </span>
                  </div>
                  {calculateShipping() === 0 && (
                    <p className="text-xs text-green-600">
                      🎉 You saved ₹99 on shipping!
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>

                <Button
                  onClick={handleSubmitOrder}
                  className="w-full bg-gold hover:bg-gold/90"
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : `Pay ${formatPrice(calculateTotal())}`}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Your payment information is secure and encrypted
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

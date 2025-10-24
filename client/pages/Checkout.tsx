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
    paymentMethod: "razorpay",
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
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
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
      const scriptElement = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
      );
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateSubtotal = () => getCartTotal();
  const calculateShipping = () => (calculateSubtotal() >= 2999 ? 0 : 99);
  const calculateTotal = () => calculateSubtotal() + calculateShipping();

  const handleInputChange = (field: keyof OrderData, value: string) => {
    setOrderData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];
    for (const field of required) {
      if (!orderData[field as keyof OrderData]) {
        toast({
          title: "Missing Information",
          description: `Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()} field.`,
          variant: "destructive",
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
        variant: "destructive",
      });
      return false;
    }

    // Basic phone validation
    if (orderData.phone.length < 10) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return false;
    }

    // Ensure payment method is Razorpay
    if (orderData.paymentMethod !== "razorpay") {
      toast({
        title: "Payment Required",
        description: "You must complete the payment process. No other payment methods are available.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleRazorpayPayment = async () => {
    if (!window.Razorpay) {
      toast({
        title: "Payment Error",
        description: "Payment system is not available. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    try {
      // 1. Create order on server
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const orderResponse = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers,
        body: JSON.stringify({
          amount: calculateTotal(), // Server will convert to paise
          currency: "INR",
          receipt: `order_${Date.now()}`,
          notes: {
            address: `${orderData.address}, ${orderData.city}, ${orderData.state} - ${orderData.pincode}`,
          },
          orderData: {
            ...(authState.user?._id && { userId: authState.user._id }),
            items: cartState.items.map(item => ({
              productId: item.id.toString(),
              title: item.name,
              price: parseInt(item.price.replace(/[₹,]/g, '')),
              qty: item.quantity,
              size: item.size,
              color: item.color,
              options: item.options,
            })),
            shippingAddress: {
              address: orderData.address,
              city: orderData.city,
              state: orderData.state,
              pincode: orderData.pincode,
            },
            billingAddress: {
              address: orderData.address,
              city: orderData.city,
              state: orderData.state,
              pincode: orderData.pincode,
            },
          }
        }),
      });

      console.log('Sending order data:', {
        amount: calculateTotal(),
        orderData: {
          ...(authState.user?._id && { userId: authState.user._id }),
          items: cartState.items.map(item => ({
            productId: item.id.toString(),
            title: item.name,
            price: parseInt(item.price.replace(/[₹,]/g, '')),
            qty: item.quantity,
            size: item.size,
            color: item.color,
            options: item.options,
          })),
          shippingAddress: {
            address: orderData.address,
            city: orderData.city,
            state: orderData.state,
            pincode: orderData.pincode,
          },
          billingAddress: {
            address: orderData.address,
            city: orderData.city,
            state: orderData.state,
            pincode: orderData.pincode,
          },
        }
      });

      if (!orderResponse.ok) {
        // Try to parse returned body for debug
        let errBody: any = null;
        try {
          errBody = await orderResponse.json();
        } catch (e) {
          errBody = await orderResponse.text();
        }
        console.error('Create order failed', orderResponse.status, errBody);
        setIsProcessing(false);
        throw new Error(`Failed to create order: ${orderResponse.status} - ${JSON.stringify(errBody)}`);
      }

      const razorpayOrder = await orderResponse.json();

      // 2. Initialize Razorpay payment
      console.log('Initializing Razorpay with order:', {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: razorpayOrder.key_id
      });

      const options = {
        key: razorpayOrder.key_id, // Key from server
        amount: razorpayOrder.amount, // Already in paise from server
        currency: razorpayOrder.currency,
        name: "Mona Designers",
        description: "Payment for ethnic wear order",
        order_id: razorpayOrder.id,
        image: "", // Remove logo to avoid CORS issues
        handler: async function (response: any) {
          try {
            // 3. Verify payment on server
            // Verify payment on server (send Authorization only if token exists)
            const vtoken = localStorage.getItem("token");
            const vheaders: Record<string, string> = { "Content-Type": "application/json" };
            if (vtoken) vheaders["Authorization"] = `Bearer ${vtoken}`;

            const verifyResponse = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: vheaders,
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              let errBody: any = null;
              try {
                errBody = await verifyResponse.json();
              } catch (e) {
                errBody = await verifyResponse.text();
              }
              console.error('Verify payment failed', verifyResponse.status, errBody);
              throw new Error(`Payment verification failed: ${verifyResponse.status} - ${JSON.stringify(errBody)}`);
            }

            const verificationResult = await verifyResponse.json();

            console.log('Payment verification successful:', verificationResult);

            toast({
              title: "Payment Successful! 🎉",
              description: `Order ID: ${verificationResult.orderId || 'N/A'}`,
            });

            // Clear cart from database if user is logged in
            if (authState.user) {
              try {
                await fetch("/api/orders/cart", {
                  method: "DELETE",
                  headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                  },
                });
                console.log('Cart cleared from database');
              } catch (error) {
                console.warn("Failed to clear cart from database:", error);
              }
            }

            // Clear cart and redirect
            clearCart();
            setIsProcessing(false);
            navigate("/", { replace: true });
          } catch (error) {
            console.error("Payment verification error:", error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support with your order ID",
              variant: "destructive",
            });
            setIsProcessing(false);
          }
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
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", function (response: any) {
        console.log("Full payment failure response:", response);
        console.error("Payment failed with error:", response.error);
        console.log("Error code:", response.error.code);
        console.log("Error description:", response.error.description);
        console.log("Error source:", response.error.source);
        console.log("Error step:", response.error.step);
        console.log("Error reason:", response.error.reason);

        // Handle specific error cases
        let errorMessage = response.error.description || "Payment could not be processed. Please try again.";
        
        if (response.error.reason === "international_transaction_not_allowed") {
          errorMessage = "Please use Indian test cards: 4111 1111 1111 1111 or 5555 5555 5555 4444";
        }

        toast({
          title: "Payment Failed",
          description: errorMessage,
          variant: "destructive",
        });
        setIsProcessing(false);

        // Send detailed failure payload to server for debugging
        try {
          fetch('/api/debug/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'razorpay_payment_failed',
              error: {
                code: response.error.code,
                description: response.error.description,
                source: response.error.source,
                step: response.error.step,
                reason: response.error.reason
              },
              orderDetails: {
                amount: calculateTotal(),
                receipt: `order_${Date.now()}`,
                currency: 'INR'
              },
              metadata: {
                userAgent: window.navigator.userAgent,
                timestamp: new Date().toISOString()
              }
            }),
          }).catch((e) => console.warn('Failed to send debug log:', e));
        } catch (e) {
          console.warn('Debug log error:', e);
        }
      });

      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: "Could not process payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }
  };

  const handleSubmitOrder = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Always use Razorpay payment - no other options
    handleRazorpayPayment();
  };

  if (cartState.items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-serif font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <form
              id="checkout-form"
              onSubmit={handleSubmitOrder}
              className="space-y-6"
            >
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
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
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
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
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
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
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
                      onChange={(e) =>
                        handleInputChange("pincode", e.target.value)
                      }
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
                        onChange={(e) =>
                          handleInputChange("paymentMethod", e.target.value)
                        }
                        className="text-gold"
                        disabled={true}
                      />
                      <Label
                        htmlFor="razorpay"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            Online Payment (Required)
                          </span>
                          <div className="flex items-center space-x-1">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-green-600">
                              Secure
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Pay securely with UPI, Cards, NetBanking & Wallets
                        </p>
                        {process.env.NODE_ENV === 'development' && (
                          <p className="text-xs text-yellow-600 mt-1 font-medium">
                            ⚠️ Payment is mandatory - Use test cards provided below
                          </p>
                        )}
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
                    <div
                      key={`${item.id}-${item.size}-${index}`}
                      className="flex space-x-3"
                    >
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
                  type="submit"
                  form="checkout-form"
                  className="w-full bg-gold hover:bg-gold/90"
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? "Processing..."
                    : `Pay ${formatPrice(calculateTotal())}`}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Your payment information is secure and encrypted
                </p>
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="text-yellow-600 mr-2">⚠️</div>
                      <p className="text-sm font-semibold text-yellow-800">Development Mode - Payment Required</p>
                    </div>
                    <p className="text-xs text-yellow-700 mb-3">
                      You must complete the payment process using the test cards below. No skipping allowed!
                    </p>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm font-semibold text-green-800 mb-2">✅ INDIAN TEST CARDS (Use These):</p>
                        <div className="text-sm space-y-1 text-green-700">
                          <p><strong>Visa:</strong> 4111 1111 1111 1111</p>
                          <p><strong>Mastercard:</strong> 5555 5555 5555 4444</p>
                          <p><strong>Expiry:</strong> 12/25 (or any future date)</p>
                          <p><strong>CVV:</strong> 123 (or any 3 digits)</p>
                          <p><strong>OTP:</strong> 1111</p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm font-semibold text-blue-800 mb-2">💳 More Indian Test Cards:</p>
                        <div className="text-sm space-y-1 text-blue-700">
                          <p>• <strong>Visa:</strong> 4000 0000 0000 0002</p>
                          <p>• <strong>RuPay:</strong> 6073 0000 0000 0000</p>
                          <p>• <strong>UPI:</strong> Use UPI option instead</p>
                        </div>
                      </div>

                      <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                        <p className="text-sm font-semibold text-purple-800 mb-2">📱 UPI Payment (Recommended):</p>
                        <div className="text-sm space-y-1 text-purple-700">
                          <p>• Select <strong>UPI</strong> option in Razorpay</p>
                          <p>• Use any UPI ID: <strong>test@paytm</strong></p>
                          <p>• Or use: <strong>test@upi</strong></p>
                          <p>• This works better than cards for testing</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

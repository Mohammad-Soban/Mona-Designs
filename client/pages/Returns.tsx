import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  RotateCcw, 
  Clock, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Package, 
  CreditCard,
  AlertTriangle,
  Phone,
  Mail
} from "lucide-react";

const returnSteps = [
  {
    step: 1,
    title: "Initiate Return",
    description: "Contact our customer service within 7 days of delivery",
    icon: <Phone className="h-5 w-5" />
  },
  {
    step: 2,
    title: "Return Authorization",
    description: "Receive return authorization and shipping label",
    icon: <Shield className="h-5 w-5" />
  },
  {
    step: 3,
    title: "Package Items",
    description: "Pack items in original packaging with all tags",
    icon: <Package className="h-5 w-5" />
  },
  {
    step: 4,
    title: "Ship Back",
    description: "Use provided shipping label to send items back",
    icon: <RotateCcw className="h-5 w-5" />
  },
  {
    step: 5,
    title: "Refund Processing",
    description: "Receive refund within 5-7 business days after inspection",
    icon: <CreditCard className="h-5 w-5" />
  }
];

const returnableItems = [
  "Unworn items with original tags attached",
  "Items in original packaging",
  "Products without any stains, odors, or damage",
  "Accessories and jewelry in original condition",
  "Items purchased within the last 7 days"
];

const nonReturnableItems = [
  "Custom tailored or altered items",
  "Items worn or used",
  "Products without original tags",
  "Intimate wear and undergarments",
  "Sale items marked as final sale",
  "Items damaged by customer"
];

export default function Returns() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    orderNumber: "",
    email: "",
    phone: "",
    reason: "",
    itemDescription: "",
    additionalNotes: ""
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.orderNumber || !formData.email || !formData.phone || !formData.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Close dialog and show success toast
    setIsDialogOpen(false);

    toast({
      title: "Return Request Submitted",
      description: "Your return request has been raised. We will contact you within the next 48 hours.",
    });

    // Reset form
    setFormData({
      orderNumber: "",
      email: "",
      phone: "",
      reason: "",
      itemDescription: "",
      additionalNotes: ""
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <SectionWrapper variant="hero" padding="lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-gold/10 border-gold/30 text-gold">
              <RotateCcw className="w-3 h-3 mr-1" />
              Easy Returns
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6 bg-gradient-to-r from-foreground via-gold to-foreground bg-clip-text text-transparent">
              Returns & Exchange Policy
            </h1>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              We want you to love your purchase. If you're not completely satisfied, we offer easy returns within 7 days.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* Return Timeline */}
      <SectionWrapper variant="featured" padding="lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">Return Timeline</h2>
            <p className="text-muted-foreground text-lg">Simple steps to return your items</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {returnSteps.map((step, index) => (
                <div key={step.step} className="relative">
                  <Card className="text-center hover:shadow-lg transition-all duration-300 border-gold/20 h-full min-h-[200px] flex flex-col">
                    <CardHeader className="pb-3 flex-shrink-0">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                        {step.icon}
                      </div>
                      <Badge variant="outline" className="mx-auto mb-2">
                        Step {step.step}
                      </Badge>
                      <CardTitle className="text-sm h-10 flex items-center justify-center">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 flex-1 flex items-center">
                      <p className="text-xs text-muted-foreground text-center">{step.description}</p>
                    </CardContent>
                  </Card>
                  
                  {index < returnSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gold/30"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Return Conditions */}
      <SectionWrapper variant="default" padding="lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Returnable Items */}
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  What Can Be Returned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {returnableItems.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Non-Returnable Items */}
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700 dark:text-red-300">
                  <XCircle className="h-5 w-5 mr-2" />
                  What Cannot Be Returned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {nonReturnableItems.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionWrapper>

      {/* Important Notes */}
      <SectionWrapper variant="featured" padding="lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-center mb-8">Important Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center">
                <CardHeader>
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">7-Day Window</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Returns must be initiated within 7 days of delivery
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <RotateCcw className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Free Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We provide free return shipping labels for defective items
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <CreditCard className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Quick Refunds</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Refunds processed within 5-7 business days
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    Exchange Policy
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm mb-3">
                    We currently offer returns with refunds. For size exchanges, please place a new order and return the original item.
                  </p>
                  <ul className="text-yellow-800 dark:text-yellow-200 text-xs space-y-1">
                    <li>• Refunds will be processed to the original payment method</li>
                    <li>• Custom tailored items cannot be returned unless defective</li>
                    <li>• Sale items may have different return conditions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Contact Support */}
      <SectionWrapper variant="newsletter" padding="lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-6 text-white">
              Need Help with Returns?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Our customer service team is here to assist you with any return questions
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <a href="tel:+919876543210" className="block">
                <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 hover:bg-white/30 transition-all duration-300">
                  <Phone className="h-6 w-6 text-white mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-1">Call Us</h3>
                  <p className="text-white/80 text-sm">+91 98765 43210</p>
                  <p className="text-white/60 text-xs mt-1">Mon-Sat: 10 AM - 7 PM</p>
                </div>
              </a>
              
              <a href="mailto:returns@monadesigners.com" className="block">
                <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 hover:bg-white/30 transition-all duration-300">
                  <Mail className="h-6 w-6 text-white mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-1">Email Us</h3>
                  <p className="text-white/80 text-sm">returns@monadesigners.com</p>
                  <p className="text-white/60 text-xs mt-1">Response within 24 hours</p>
                </div>
              </a>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-gold hover:bg-white/90 border-0 shadow-xl transition-all duration-300 hover:scale-105 px-8 py-4 text-lg font-semibold">
                  Start Return Process
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Return Request Form</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitReturn} className="space-y-4">
                  <div>
                    <Label htmlFor="orderNumber">Order Number *</Label>
                    <input
                      id="orderNumber"
                      type="text"
                      value={formData.orderNumber}
                      onChange={(e) => handleInputChange("orderNumber", e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-black"
                      placeholder="Enter your order number"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-black"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-black"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="reason">Reason for Return *</Label>
                    <select
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => handleInputChange("reason", e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-black"
                      required
                    >
                      <option value="">Select a reason</option>
                      <option value="defective">Item is defective</option>
                      <option value="wrong-size">Wrong size</option>
                      <option value="wrong-item">Wrong item received</option>
                      <option value="damaged">Item arrived damaged</option>
                      <option value="not-as-described">Not as described</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="itemDescription">Item Description</Label>
                    <input
                      id="itemDescription"
                      type="text"
                      value={formData.itemDescription}
                      onChange={(e) => handleInputChange("itemDescription", e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-black"
                      placeholder="Describe the item you want to return"
                    />
                  </div>

                  <div>
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <textarea
                      id="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                      rows={3}
                      className="w-full mt-2 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold resize-none text-black"
                      placeholder="Any additional information..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gold hover:bg-gold/90"
                    >
                      Submit Request
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

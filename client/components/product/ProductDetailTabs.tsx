import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Check, 
  Star, 
  User, 
  ThumbsUp, 
  Package,
  Shirt,
  Droplets,
  Shield
} from "lucide-react";
import { Product } from "@/data/products";

interface ProductDetailTabsProps {
  product: Product;
}

// Mock reviews data - in real app this would come from backend
const mockReviews = [
  {
    id: 1,
    user: "Rajesh K.",
    rating: 5,
    date: "2024-01-20",
    title: "Excellent quality!",
    comment: "Beautiful sherwani with excellent craftsmanship. The fabric quality is premium and the fit is perfect. Highly recommended for weddings!",
    verified: true,
    helpful: 12
  },
  {
    id: 2,
    user: "Priya S.",
    rating: 4,
    date: "2024-01-15",
    title: "Good purchase",
    comment: "Nice design and good quality fabric. The delivery was quick and packaging was excellent. Size runs slightly large.",
    verified: true,
    helpful: 8
  },
  {
    id: 3,
    user: "Amit P.",
    rating: 5,
    date: "2024-01-10",
    title: "Perfect for my wedding",
    comment: "Wore this for my wedding ceremony. Got so many compliments! The gold embroidery work is stunning and the comfort is amazing.",
    verified: true,
    helpful: 15
  }
];

const careInstructions = [
  {
    icon: <Droplets className="h-5 w-5" />,
    title: "Dry Clean Only",
    description: "Professional dry cleaning recommended to maintain fabric quality and embroidery"
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Fabric Protection",
    description: "Store in breathable garment bags to prevent dust and moisture damage"
  },
  {
    icon: <Shirt className="h-5 w-5" />,
    title: "Wrinkle Care",
    description: "Steam iron on low heat with cloth protection to avoid direct contact"
  },
  {
    icon: <Package className="h-5 w-5" />,
    title: "Storage",
    description: "Hang on padded hangers or fold carefully with tissue paper between layers"
  }
];

export function ProductDetailTabs({ product }: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-gold fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    const total = mockReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / mockReviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    mockReviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  return (
    <div className="mt-16">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/30">
          <TabsTrigger value="description" className="text-sm font-medium">
            Description
          </TabsTrigger>
          <TabsTrigger value="specifications" className="text-sm font-medium">
            Specifications
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-sm font-medium">
            Reviews ({product.reviews})
          </TabsTrigger>
          <TabsTrigger value="care" className="text-sm font-medium">
            Size & Care
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Product Description</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {product.description || "Experience the perfect blend of traditional craftsmanship and contemporary style with this exquisite piece. Each garment is carefully crafted using premium fabrics and adorned with intricate details that reflect the rich heritage of Indian ethnic wear."}
              </p>
              
              <h4 className="font-semibold mb-4">Key Features</h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-muted-foreground">Premium {product.fabric || 'Fabric'} construction</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-muted-foreground">Traditional design with modern fit</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-muted-foreground">Perfect for {product.occasion || 'special occasions'}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-muted-foreground">Expert craftsmanship and attention to detail</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-muted-foreground">Comfortable and breathable fabric</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">What's Included</h3>
              <div className="space-y-4">
                {product.category === "Sherwanis" && (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Package className="h-5 w-5 text-gold" />
                      <span>Sherwani jacket with intricate embroidery</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Package className="h-5 w-5 text-gold" />
                      <span>Matching churidar pants</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Package className="h-5 w-5 text-gold" />
                      <span>Traditional dupatta (optional)</span>
                    </div>
                  </>
                )}
                {product.category === "Lehengas" && (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Package className="h-5 w-5 text-gold" />
                      <span>Embroidered lehenga skirt</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Package className="h-5 w-5 text-gold" />
                      <span>Matching blouse with detailed work</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Package className="h-5 w-5 text-gold" />
                      <span>Dupatta with border design</span>
                    </div>
                  </>
                )}
                {(product.category === "Kurtas" || product.category === "Suits") && (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Package className="h-5 w-5 text-gold" />
                      <span>Premium {product.category.slice(0, -1).toLowerCase()}</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Package className="h-5 w-5 text-gold" />
                      <span>Matching bottom wear</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-border/50">
                    <span className="font-medium text-muted-foreground">Fabric</span>
                    <span className="font-semibold">{product.fabric || 'Premium Fabric'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border/50">
                    <span className="font-medium text-muted-foreground">Category</span>
                    <span className="font-semibold">{product.category}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border/50">
                    <span className="font-medium text-muted-foreground">Occasion</span>
                    <span className="font-semibold">{product.occasion || 'Special Events'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border/50">
                    <span className="font-medium text-muted-foreground">Fit</span>
                    <span className="font-semibold">Regular Fit</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border/50">
                    <span className="font-medium text-muted-foreground">Care Instructions</span>
                    <span className="font-semibold">Dry Clean Only</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border/50">
                    <span className="font-medium text-muted-foreground">Country of Origin</span>
                    <span className="font-semibold">India</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Size Information</h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    This garment follows standard Indian ethnic wear sizing. Please refer to our size guide for accurate measurements.
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Model Height</span>
                      <span className="font-medium">5'8" (172 cm)</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Model Size</span>
                      <span className="font-medium">Medium</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Fit Type</span>
                      <span className="font-medium">Regular</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Size Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-8">
          <div className="space-y-8">
            {/* Review Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gold mb-2">{getAverageRating()}</div>
                    <div className="flex justify-center mb-2">
                      {renderStarRating(Math.round(parseFloat(getAverageRating())))}
                    </div>
                    <p className="text-muted-foreground">Based on {mockReviews.length} reviews</p>
                  </div>
                  
                  <div className="space-y-2">
                    {Object.entries(getRatingDistribution()).reverse().map(([rating, count]) => (
                      <div key={rating} className="flex items-center space-x-3">
                        <span className="text-sm font-medium w-8">{rating}★</span>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-gold h-2 rounded-full" 
                            style={{ width: `${(count / mockReviews.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Individual Reviews */}
            <div className="space-y-6">
              {mockReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                          <User className="h-5 w-5 text-gold" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{review.user}</span>
                            {review.verified && (
                              <Badge variant="outline" className="text-xs">
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            {renderStarRating(review.rating)}
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold mb-2">{review.title}</h4>
                    <p className="text-muted-foreground mb-4">{review.comment}</p>
                    
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful ({review.helpful})
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="care" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-6">Care Instructions</h3>
              <div className="space-y-4">
                {careInstructions.map((instruction, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center text-gold flex-shrink-0">
                          {instruction.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{instruction.title}</h4>
                          <p className="text-sm text-muted-foreground">{instruction.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6">Size Guide</h3>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">
                    For the perfect fit, please measure yourself and compare with our size chart.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gold/10 rounded-lg">
                      <p className="font-semibold text-gold">Need help with sizing?</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Our customer service team is here to help
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full">
                        View Detailed Size Chart
                      </Button>
                      <Button variant="outline" className="w-full">
                        Contact Size Expert
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Star,
  Heart,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  Sparkles,
  Phone,
  Mail,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HeroVideoCarousel } from "@/components/ui/hero-video-carousel";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

/**
 * Product interface matching the backend Product model
 */
interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  images: Array<{
    url: string;
    alt: string;
    role: string;
  }>;
  categories: Array<{
    name: string;
    rank: number;
  }>;
  metadata?: {
    rating?: number;
    reviews?: number;
  };
  featured?: boolean;
}

// Enhanced category data with better styling
const categories = [
  {
    id: 1,
    name: "Sherwanis",
    description: "Elegant traditional wear for grooms",
    image: "bg-gradient-to-br from-gold/40 via-amber-400/30 to-yellow-500/40",
    count: "120+ Designs",
    href: "/sherwanis",
    icon: "👑"
  },
  {
    id: 2,
    name: "Lehengas",
    description: "Stunning bridal & party wear",
    image: "bg-gradient-to-br from-pink-500/40 via-rose-400/30 to-red-500/40",
    count: "200+ Designs",
    href: "/lehengas",
    icon: "💃"
  },
  {
    id: 3,
    name: "Kurtas",
    description: "Comfortable ethnic essentials",
    image: "bg-gradient-to-br from-blue-500/40 via-indigo-400/30 to-purple-500/40",
    count: "150+ Designs",
    href: "/kurtas",
    icon: "🕺"
  },
  {
    id: 4,
    name: "Suits",
    description: "Contemporary traditional wear",
    image: "bg-gradient-to-br from-emerald-500/40 via-teal-400/30 to-cyan-500/40",
    count: "180+ Designs",
    href: "/suits",
    icon: "🤵"
  }
];

export default function Index() {
  const { state: authState } = useAuth();
  const { toast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  /**
   * Fetch featured products from the API
   * This function retrieves the latest product from each of the 4 main categories
   */
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const response = await fetch('/api/products/featured');
        const data = await response.json();

        if (data.success && data.products) {
          setFeaturedProducts(data.products);
        } else {
          console.warn('Failed to fetch featured products:', data.message);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        toast({
          title: "Error",
          description: "Failed to load featured products. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchFeaturedProducts();
  }, [toast]);

  /**
   * Format price in Indian Rupee format
   */
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  /**
   * Get the primary image for a product
   */
  const getProductImage = (product: Product): string => {
    const heroImage = product.images?.find(img => img.role === 'hero');
    const thumbnailImage = product.images?.find(img => img.role === 'thumbnail');
    return heroImage?.url || thumbnailImage?.url || product.images?.[0]?.url || '/placeholder-product.jpg';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Video Carousel */}
      <HeroVideoCarousel />

      {/* Categories Section */}
      <SectionWrapper variant="featured" padding="xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-gold/10 border-gold/30 text-gold">
              <Sparkles className="w-3 h-3 mr-1" />
              Explore Collections
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6 bg-gradient-to-r from-foreground via-gold to-foreground bg-clip-text text-transparent">
              Shop by Category
            </h2>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Discover our curated collections of premium ethnic wear for every celebration and special moment
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link key={category.id} to={category.href}>
                <Card className="group hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500 overflow-hidden border-0 bg-background/50 backdrop-blur-sm hover:scale-105">
                  <div className={cn("h-56 md:h-64 relative", category.image)}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-500" />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="text-xs bg-white/20 backdrop-blur-sm border-white/30">
                        {category.count}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 text-2xl">
                      {category.icon}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-serif font-bold text-white text-xl mb-1 group-hover:text-gold transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Featured Products */}
      <SectionWrapper variant="default" padding="xl" background="animated">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-gold/10 border-gold/30 text-gold">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Latest Arrivals
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6 bg-gradient-to-r from-foreground via-gold to-foreground bg-clip-text text-transparent">
              Featured Products
            </h2>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Discover our newest premium ethnic wear from each collection, crafted with excellence
            </p>
          </div>

          {isLoadingProducts ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-gold animate-spin" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <Link key={product._id} to={`/product/${product._id}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer h-full">
                      <div className="h-64 relative overflow-hidden bg-muted">
                        <img
                          src={getProductImage(product)}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                        <Badge
                          className="absolute top-3 left-3 bg-gold/90 text-white border-0"
                        >
                          New
                        </Badge>
                        <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Add to wishlist logic here
                            }}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="mb-2">
                          <Badge variant="outline" className="text-xs">
                            {product.categories[0]?.name || 'Featured'}
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-2 line-clamp-1">{product.title}</h3>
                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="h-4 w-4 text-gold fill-current" />
                          <span className="text-sm font-medium">
                            {product.metadata?.rating || 4.5}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({product.metadata?.reviews || 0})
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/collections">
                  <Button size="lg" className="bg-gold hover:bg-gold/90 text-white border-0 shadow-xl hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300 hover:scale-105">
                    View All Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No featured products available at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* Features */}
      <SectionWrapper variant="featured" padding="xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Truck className="h-10 w-10" />,
                title: "Free Shipping",
                description: "On orders above ₹2999",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: <RotateCcw className="h-10 w-10" />,
                title: "Easy Returns",
                description: "7-day return policy",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: <Shield className="h-10 w-10" />,
                title: "Secure Payment",
                description: "100% secure checkout",
                gradient: "from-purple-500 to-violet-500"
              },
              {
                icon: <Headphones className="h-10 w-10" />,
                title: "24/7 Support",
                description: "Always here to help",
                gradient: "from-orange-500 to-red-500"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-all duration-300">
                <div className={cn(
                  "w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300",
                  feature.gradient
                )}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-3 group-hover:text-gold transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Newsletter */}
      <SectionWrapper variant="newsletter" padding="xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 bg-white/20 border-gold/30 text-gold backdrop-blur-sm">
              <Mail className="w-3 h-3 mr-1" />
              Stay Connected
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6 text-foreground dark:text-white">
              Stay Updated with Latest Collections
            </h2>
            <p className="text-foreground/80 dark:text-white/90 text-xl mb-10 leading-relaxed">
              Get exclusive access to new arrivals, special offers, and fashion trends directly on your mobile
            </p>

            {authState.isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Enter your mobile number"
                    className="pl-12 py-4 text-lg bg-white/95 backdrop-blur-sm border-white/30 focus:border-gold"
                  />
                </div>
                <Button size="lg" className="bg-gold hover:bg-gold/90 text-white border-0 shadow-xl hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300 hover:scale-105 px-8 py-4 text-lg">
                  Subscribe
                </Button>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <p className="text-foreground/80 dark:text-white/80 mb-6 text-lg">
                  Please log in to subscribe to our mobile notifications
                </p>
                <Link to="/login">
                  <Button size="lg" className="bg-white text-gold hover:bg-white/90 border-0 shadow-xl transition-all duration-300 hover:scale-105 px-8 py-4 text-lg font-semibold">
                    Login to Subscribe
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

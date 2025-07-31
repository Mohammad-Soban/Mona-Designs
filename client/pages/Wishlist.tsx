import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { 
  Heart, 
  Star, 
  ShoppingCart, 
  X,
  HeartOff,
  ArrowRight,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Wishlist() {
  const { wishlistItems = [], removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);

  useEffect(() => {
    if (wishlistItems.length === 0) {
      setShowEmptyMessage(true);
      const timer = setTimeout(() => {
        setShowEmptyMessage(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [wishlistItems.length]);

  const handleRemoveFromWishlist = (productId: number) => {
    removeItem(productId);
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  const handleAddToCart = (product: any) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: "M", // Default size
      color: "Default",
      quantity: 1,
      category: product.category
    };

    addItem(cartItem);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart with default size.`,
    });
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist.",
    });
  };

  // Safety check for undefined wishlistItems
  if (!wishlistItems) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading wishlist...</p>
        </div>
      </div>
    );
  }

  // Show empty message animation
  if (showEmptyMessage && wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
            <HeartOff className="h-12 w-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-serif font-bold mb-3 text-foreground">
            No items in wishlist
          </h2>
          <p className="text-muted-foreground mb-6">
            Add a few items to get started!
          </p>
          <Link to="/collections">
            <Button className="bg-gold hover:bg-gold/90">
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <SectionWrapper variant="hero" padding="lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4 bg-red-50 border-red-200 text-red-600 dark:bg-red-950/50 dark:border-red-800 dark:text-red-400">
              <Heart className="w-3 h-3 mr-1 fill-current" />
              Your Favorites
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6 bg-gradient-to-r from-foreground via-red-500 to-foreground bg-clip-text text-transparent">
              My Wishlist
            </h1>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Your saved items for later purchase
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* Wishlist Content */}
      <SectionWrapper variant="default" padding="lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Your wishlist is empty</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                Start adding items you love to your wishlist and come back to purchase them later.
              </p>
              <Link to="/collections">
                <Button size="lg" className="bg-gold hover:bg-gold/90">
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Wishlist Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-serif font-bold">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
                  </h2>
                  <p className="text-muted-foreground">
                    Items you've saved for later
                  </p>
                </div>
                {wishlistItems.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleClearWishlist}
                    className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/50"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                  <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative">
                      <div className="aspect-square overflow-hidden bg-muted">
                        <Link to={`/product/${item.id}`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                          />
                        </Link>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                        
                        {/* Remove from wishlist button */}
                        <button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        
                        {/* Add to cart button */}
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button 
                            size="sm" 
                            className="bg-gold hover:bg-gold/90 shadow-lg"
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="font-semibold mb-2 hover:text-gold transition-colors cursor-pointer">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="h-4 w-4 text-gold fill-current" />
                          <span className="text-sm font-medium">{item.rating}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {item.category}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg text-gold">
                            {item.price}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                          >
                            <Heart className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="text-center mt-12">
                <Link to="/collections">
                  <Button size="lg" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
                    Continue Shopping
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </SectionWrapper>
    </div>
  );
}

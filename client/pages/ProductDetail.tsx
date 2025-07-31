import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { getProductById, getProductPricing } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Truck,
  RotateCcw,
  Shield,
  ArrowLeft,
  Check
} from "lucide-react";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { SizeSelector } from "@/components/product/SizeSelector";
import { ColorSelector } from "@/components/product/ColorSelector";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductDetailTabs } from "@/components/product/ProductDetailTabs";
import { useToast } from "@/hooks/use-toast";



export default function ProductDetail() {
  const { id } = useParams();
  const { addItem, openCart } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const product = getProductById(id || "1");
  const isWishlisted = product ? isInWishlist(product.id) : false;

  // Get current pricing based on selected size
  const currentPricing = product ? getProductPricing(product, selectedSize) : null;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/collections">
            <Button>Browse Collections</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart.",
        variant: "destructive"
      });
      return;
    }

    if (!product) return;

    setIsLoading(true);

    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: currentPricing?.price || product.price,
        image: product.image,
        size: selectedSize,
        color: selectedColor || "Default",
        quantity: quantity,
        category: product.category
      };

      addItem(cartItem);

      toast({
        title: "Added to Cart",
        description: `${product.name} (${selectedSize}) has been added to your cart.`,
      });

      openCart();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      rating: product.rating
    };

    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(wishlistItem);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleWhatsAppShare = () => {
    if (!product) return;

    const productUrl = window.location.href;
    const message = `Check out this amazing ${product.name} from Mona Designers! ${product.price} - ${productUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <section className="bg-muted/30 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/collections" className="text-muted-foreground hover:text-foreground">Collections</Link>
            <span className="text-muted-foreground">/</span>
            <Link to={`/${product.category.toLowerCase()}`} className="text-muted-foreground hover:text-foreground">{product.category}</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{product.name}</span>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link to="/collections" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Collections</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <ProductImageGallery
              images={[product.image]}
              productName={product.name}
              badge={product.badge}
            />

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-serif font-bold mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-gold fill-current" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviews} reviews)</span>
                  </div>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold">{currentPricing?.price || product.price}</span>
                  {(currentPricing?.originalPrice || product.originalPrice) && (
                    <span className="text-xl text-muted-foreground line-through">{currentPricing?.originalPrice || product.originalPrice}</span>
                  )}
                  {(currentPricing?.originalPrice || product.originalPrice) && (
                    <Badge variant="destructive">
                      {Math.round((1 - (parseInt((currentPricing?.price || product.price).replace(/[^\d]/g, '')) / parseInt((currentPricing?.originalPrice || product.originalPrice).replace(/[^\d]/g, '')))) * 100)}% OFF
                    </Badge>
                  )}
                </div>
                {selectedSize && product.sizePricing && product.sizePricing[selectedSize] && (
                  <p className="text-sm text-muted-foreground mb-4">
                    <span className="text-gold">✓</span> Price updated for size {selectedSize}
                  </p>
                )}
              </div>

              <Separator />

              {/* Size Selection */}
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSizeSelect={setSelectedSize}
                required={true}
              />

              {/* Color Selection */}
              <ColorSelector
                colors={product.colors}
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />

              {/* Quantity */}
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
                min={1}
                max={10}
                inStock={3}
              />

              {/* Action Buttons */}
              <ProductActions
                onAddToCart={handleAddToCart}
                onWishlistToggle={handleWishlistToggle}
                onShare={handleWhatsAppShare}
                isWishlisted={isWishlisted}
                canAddToCart={!!selectedSize}
                isLoading={isLoading}
              />

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center">
                  <Truck className="h-8 w-8 text-gold mx-auto mb-2" />
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders above ₹2999</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-8 w-8 text-gold mx-auto mb-2" />
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">7-day return policy</p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 text-gold mx-auto mb-2" />
                  <p className="text-sm font-medium">Authentic</p>
                  <p className="text-xs text-muted-foreground">100% genuine products</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <ProductDetailTabs product={product} />
        </div>
      </section>
    </div>
  );
}

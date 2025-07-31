import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductActionsProps {
  onAddToCart: () => void;
  onWishlistToggle: () => void;
  onShare: () => void;
  isWishlisted: boolean;
  canAddToCart: boolean;
  isLoading?: boolean;
}

export function ProductActions({
  onAddToCart,
  onWishlistToggle,
  onShare,
  isWishlisted,
  canAddToCart,
  isLoading = false
}: ProductActionsProps) {
  return (
    <div className="flex space-x-4">
      <Button
        onClick={onAddToCart}
        className="flex-1 bg-gold hover:bg-gold/90 transition-all duration-300"
        size="lg"
        disabled={!canAddToCart || isLoading}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {isLoading ? "Adding..." : "Add to Cart"}
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={onWishlistToggle}
        className={cn(
          "transition-all duration-300 hover:scale-105",
          isWishlisted && "text-red-500 border-red-500 bg-red-50 hover:bg-red-100"
        )}
      >
        <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
      </Button>
      <Button 
        variant="outline" 
        size="lg" 
        onClick={onShare}
        className="hover:scale-105 transition-all duration-300"
      >
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  );
}

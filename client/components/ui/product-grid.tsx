import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { Pagination } from "@/components/ui/pagination";

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  sizes?: string[];
  colors?: string[];
  category: string;
}

interface ProductGridProps {
  products: Product[];
  className?: string;
  showPagination?: boolean;
  itemsPerPage?: number;
}

export function ProductGrid({ products, className, showPagination = false, itemsPerPage = 12 }: ProductGridProps) {
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  const pagination = usePagination({
    data: products,
    itemsPerPage: itemsPerPage
  });

  const displayProducts = showPagination ? pagination.paginatedData : products;

  const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();
    
    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      rating: product.rating
    };
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(wishlistItem);
    }
  };

  return (
    <div className="space-y-6">
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
        {displayProducts.map((product) => {
        const isWishlisted = isInWishlist(product.id);
        return (
          <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="h-64 md:h-72 relative overflow-hidden rounded-lg bg-muted">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.className += " bg-gradient-to-br from-muted to-muted-foreground/20";
                }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
              
              {product.badge && (
                <Badge 
                  className="absolute top-3 left-3" 
                  variant={product.badge === "Sale" ? "destructive" : "secondary"}
                >
                  {product.badge}
                </Badge>
              )}
              
              <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className={cn(
                    "h-8 w-8",
                    isWishlisted && "text-red-500 bg-red-50 border-red-200"
                  )}
                  onClick={(e) => handleWishlistToggle(e, product)}
                >
                  <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
                </Button>
              </div>
              


              {/* Quick view overlay */}
              <Link 
                to={`/product/${product.id}`}
                className="absolute inset-0 z-10"
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="secondary" size="sm">
                    Quick View
                  </Button>
                </div>
              </Link>
            </div>

            <CardContent className="p-4">
              <Link to={`/product/${product.id}`}>
                <h3 className="font-semibold mb-2 hover:text-gold transition-colors">{product.name}</h3>
              </Link>
              
              <div className="flex items-center space-x-1 mb-2">
                <Star className="h-4 w-4 text-gold fill-current" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviews})</span>
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <span className="font-bold text-lg">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {product.originalPrice}
                  </span>
                )}
              </div>

              {product.sizes && (
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="text-xs text-muted-foreground">Sizes:</span>
                  {product.sizes.slice(0, 4).map((size, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {size}
                    </Badge>
                  ))}
                  {product.sizes.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{product.sizes.length - 4} more
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
        })}
      </div>

      {showPagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.goToPage}
          hasNext={pagination.hasNext}
          hasPrevious={pagination.hasPrevious}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          totalItems={pagination.totalItems}
        />
      )}
    </div>
  );
}

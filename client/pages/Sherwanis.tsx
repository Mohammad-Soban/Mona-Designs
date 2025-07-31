import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/ui/product-grid";
import { getProductsByCategory, sortProducts } from "@/data/products";
import { 
  ChevronDown 
} from "lucide-react";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" }
];

export default function Sherwanis() {
  const [sortBy, setSortBy] = useState("featured");

  // Get Sherwanis products and apply sorting
  const sortedProducts = useMemo(() => {
    const sherwanis = getProductsByCategory("Sherwanis");
    return sortProducts(sherwanis, sortBy);
  }, [sortBy]);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-600/20" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Sherwanis Collection
            </h1>
            <p className="text-purple-100 text-lg">
              Royal sherwanis for grooms and special occasions. 
              Traditional craftsmanship meets contemporary elegance.
            </p>
          </div>
        </div>
      </section>

      {/* Sort Bar */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex">
                {sortedProducts.length} Products
              </Badge>
              
              {sortBy !== "featured" && (
                <Badge variant="outline" className="text-xs">
                  Sorted by: {sortOptions.find(opt => opt.value === sortBy)?.label}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-background border border-border rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {sortedProducts.length > 0 ? (
            <>
              <ProductGrid products={sortedProducts} />

              {/* Load More */}
              <div className="text-center mt-12">
                <button className="inline-flex items-center px-6 py-3 border border-border rounded-md text-sm font-medium text-foreground bg-background hover:bg-muted transition-colors">
                  Load More Sherwanis
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-lg font-semibold mb-2">No sherwanis found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or browse other categories.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/ui/product-grid";
import { getProductsByCategory, sortProducts } from "@/data/products";
import { 
  Filter, 
  Grid3X3, 
  List,
  ChevronDown 
} from "lucide-react";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" }
];

export default function Suits() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  // Get Suits products and apply sorting
  const sortedProducts = useMemo(() => {
    const suits = getProductsByCategory("Suits");
    return sortProducts(suits, sortBy);
  }, [sortBy]);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-gray-800/90 to-slate-900/90 flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-slate-800/20" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Suits Collection
            </h1>
            <p className="text-gray-200 text-lg">
              Contemporary ethnic suits and formal wear for the modern gentleman. 
              Perfect for business meetings and special occasions.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Sort Bar */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
              
              <Badge variant="secondary" className="hidden md:flex">
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

              {/* View Mode Toggle */}
              <div className="flex border border-border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="pb-4 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div>
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Under ₹10,000</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>₹10,000 - ₹15,000</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Above ₹15,000</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Style</h3>
                  <div className="space-y-2">
                    {["Bandhgala", "Nehru Jacket", "Blazer", "Tuxedo", "Prince Coat"].map((style) => (
                      <label key={style} className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span>{style}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Fabric</h3>
                  <div className="space-y-2">
                    {["Wool", "Cotton", "Silk", "Linen", "Velvet"].map((fabric) => (
                      <label key={fabric} className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span>{fabric}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Occasion</h3>
                  <div className="space-y-2">
                    {["Wedding", "Formal", "Business", "Party", "Reception"].map((occasion) => (
                      <label key={occasion} className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span>{occasion}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ProductGrid 
            products={sortedProducts} 
            className={cn(
              viewMode === "list" && "grid-cols-1 md:grid-cols-2 gap-4"
            )}
          />

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Suits
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

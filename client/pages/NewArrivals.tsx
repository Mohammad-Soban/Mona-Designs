import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/ui/product-grid";
import {
  allProducts,
  getProductsByCategory,
  sortProducts,
} from "@/data/products";
import { ChevronDown, Star, TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const categories = ["All", "Kurtas", "Sherwanis", "Suits", "Lehengas"];

export default function NewArrivals() {
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter new arrivals (for demo, we'll show all products as new arrivals)
  const newArrivalsProducts = useMemo(() => {
    const categoryProducts = getProductsByCategory(selectedCategory);
    // In a real app, you'd filter by a "new" flag or date
    return categoryProducts;
  }, [selectedCategory]);

  const filteredAndSortedProducts = useMemo(() => {
    return sortProducts(newArrivalsProducts, sortBy);
  }, [newArrivalsProducts, sortBy]);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-72 bg-gradient-to-r from-emerald-600/90 to-teal-600/90 flex items-center mt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/20 to-cyan-700/20" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-6 w-6 text-emerald-200" />
              <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30">
                Fresh Arrivals
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
              New Arrivals
            </h1>
            <p className="text-emerald-100 text-xl mb-8">
              Discover our latest collection of premium ethnic wear. From contemporary 
              designs to traditional masterpieces, explore what's trending now.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-emerald-200">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Updated Weekly</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-200">
                <Star className="h-5 w-5" />
                <span className="text-sm">Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrival Stats */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {filteredAndSortedProducts.length}+
              </div>
              <p className="text-muted-foreground text-sm">New Products</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                4.8★
              </div>
              <p className="text-muted-foreground text-sm">Average Rating</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                Weekly
              </div>
              <p className="text-muted-foreground text-sm">Fresh Updates</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                Premium
              </div>
              <p className="text-muted-foreground text-sm">Quality Assured</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="border-b bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  "whitespace-nowrap pb-2 text-sm font-medium transition-colors",
                  selectedCategory === category
                    ? "border-b-2 border-emerald-600 text-emerald-600"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {category}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category === "All"
                    ? newArrivalsProducts.length
                    : getProductsByCategory(category).length}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sort Bar */}
      <section className="sticky top-20 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex">
                {filteredAndSortedProducts.length} New Products
              </Badge>

              {sortBy !== "newest" && (
                <Badge variant="outline" className="text-xs">
                  Sorted by:{" "}
                  {sortOptions.find((opt) => opt.value === sortBy)?.label}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-background border border-border rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-black"
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
          {filteredAndSortedProducts.length > 0 ? (
            <>
              <ProductGrid products={filteredAndSortedProducts} />

              {/* Load More */}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white">
                  Load More New Arrivals
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-lg font-semibold mb-2">No new arrivals found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back soon for new products.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Shop New Arrivals */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">
              Why Shop New Arrivals?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stay ahead of fashion trends with our carefully curated new arrivals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-600/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Latest Trends</h3>
              <p className="text-muted-foreground">
                Be the first to wear the latest designs fresh from our designers.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-600/10 rounded-full flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                Every new arrival undergoes strict quality checks for perfection.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-600/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Limited Edition</h3>
              <p className="text-muted-foreground">
                Many new arrivals are limited editions - get them before they're gone.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

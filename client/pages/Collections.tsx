import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/ui/product-grid";
import { allProducts, getProductsByCategory, sortProducts } from "@/data/products";
import {
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

const categories = ["All", "Sherwanis", "Kurtas", "Suits", "Lehengas"];

export default function Collections() {
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = getProductsByCategory(selectedCategory);
    return sortProducts(filtered, sortBy);
  }, [selectedCategory, sortBy]);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-gold/90 to-amber-600/90 flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-yellow-600/20" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              All Collections
            </h1>
            <p className="text-amber-100 text-lg">
              Discover our complete range of premium ethnic wear for every celebration. 
              From traditional kurtas to designer lehengas.
            </p>
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
                    ? "border-b-2 border-gold text-gold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {category}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category === "All" ? allProducts.length : getProductsByCategory(category).length}
                </Badge>
              </button>
            ))}
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
                {filteredAndSortedProducts.length} Products
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
                      <span>Under ₹5,000</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>₹5,000 - ₹15,000</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Above ₹15,000</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Size</h3>
                  <div className="space-y-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <label key={size} className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span>{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Occasion</h3>
                  <div className="space-y-2">
                    {["Wedding", "Party", "Festival", "Casual", "Formal"].map((occasion) => (
                      <label key={occasion} className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span>{occasion}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Fabric</h3>
                  <div className="space-y-2">
                    {["Silk", "Cotton", "Velvet", "Brocade", "Georgette"].map((fabric) => (
                      <label key={fabric} className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span>{fabric}</span>
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
          {filteredAndSortedProducts.length > 0 ? (
            <>
              <ProductGrid 
                products={filteredAndSortedProducts} 
                className={cn(
                  viewMode === "list" && "grid-cols-1 md:grid-cols-2 gap-4"
                )}
              />

              {/* Load More */}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Products
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or browse other categories.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

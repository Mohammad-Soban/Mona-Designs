import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/ui/product-grid";
import {
  allProducts,
  getProductsByCategory,
  sortProducts,
} from "@/data/products";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" },
];

const categories = ["All", "Suits", "Sherwanis", "Lehengas", "Kurtas"];

export default function Reception() {
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const receptionProducts = useMemo(() => {
    const categoryProducts = getProductsByCategory(selectedCategory);
    return categoryProducts;
  }, [selectedCategory]);

  const filteredAndSortedProducts = useMemo(() => {
    return sortProducts(receptionProducts, sortBy);
  }, [receptionProducts, sortBy]);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 to-indigo-600/20" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Reception Collection
            </h1>
            <p className="text-purple-100 text-lg">
              Make a statement at your reception with our elegant collection 
              of sophisticated suits, contemporary sherwanis, and graceful lehengas.
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
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {category}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category === "All"
                    ? receptionProducts.length
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
                {filteredAndSortedProducts.length} Products
              </Badge>

              {sortBy !== "featured" && (
                <Badge variant="outline" className="text-xs">
                  Sorted by:{" "}
                  {sortOptions.find((opt) => opt.value === sortBy)?.label}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
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
          {filteredAndSortedProducts.length > 0 ? (
            <>
              <ProductGrid products={filteredAndSortedProducts} />
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

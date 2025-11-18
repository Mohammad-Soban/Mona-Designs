import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/ui/product-grid";
import {
  allProducts,
  getProductsByCategory,
  sortProducts,
} from "@/data/products";
import { 
  ChevronDown 
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" }
];

export default function Suits() {
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsByCategory("suits");
        setProducts(data);
      } catch (error) {
        console.error('Error fetching suit products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get Suits products and apply sorting
  const sortedProducts = useMemo(() => {
    return sortProducts(products, sortBy);
  }, [products, sortBy]);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with extended background */}
      <section className="relative h-72 md:h-80 bg-gradient-to-r from-slate-600/90 to-gray-700/90 flex items-center -mt-20 pt-28">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/20 to-gray-600/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)]" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 scroll-offset drop-shadow-lg">
              Suits Collection
            </h1>
            <p className="text-slate-100 text-lg">
              Sophisticated bandhgala suits and indo-western outfits. 
              Perfect for formal events and contemporary celebrations.
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
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            </div>
          ) : sortedProducts.length > 0 ? (
            <ProductGrid products={sortedProducts} showPagination={true} itemsPerPage={12} />
          ) : (
            <EmptyState 
              title="Suits Coming Soon"
              message="We're preparing an exquisite collection of formal suits. Perfect for weddings and corporate events!"
            />
          )}
        </div>
      </section>
    </div>
  );
}

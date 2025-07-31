// Temporary product images using a placeholder service
const getProductImage = (category: string, color: string, id: number) => {
  // Using picsum.photos for diverse, high-quality placeholder images
  const baseUrl = "https://picsum.photos/400/500";
  const seed = `${category}-${color}-${id}`;
  return `${baseUrl}?random=${seed}`;
};

export interface Product {
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
  description?: string;
  inStock?: boolean;
  fabric?: string;
  occasion?: string;
  sizePricing?: {
    [size: string]: {
      price: string;
      originalPrice?: string;
    };
  };
}

// All products data with temporary images
export const allProducts: Product[] = [
  // Sherwanis
  {
    id: 1,
    name: "Royal Blue Silk Sherwani",
    price: "₹12,999",
    originalPrice: "₹15,999",
    rating: 4.8,
    reviews: 24,
    image: "https://images.unsplash.com/photo-1506629905645-b178a0c90810?w=400&h=500&fit=crop",
    badge: "Bestseller",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Royal Blue", "Navy Blue", "Midnight Blue"],
    category: "Sherwanis",
    description: "Elegant royal blue silk sherwani with intricate embroidery work",
    inStock: true,
    fabric: "Pure Silk",
    occasion: "Wedding",
    sizePricing: {
      "S": { price: "₹12,999", originalPrice: "₹15,999" },
      "M": { price: "₹12,999", originalPrice: "₹15,999" },
      "L": { price: "₹13,499", originalPrice: "₹16,499" },
      "XL": { price: "₹13,999", originalPrice: "₹16,999" },
      "XXL": { price: "₹14,499", originalPrice: "₹17,499" }
    }
  },
  {
    id: 2,
    name: "Maroon Velvet Sherwani",
    price: "₹14,999",
    originalPrice: "₹18,999",
    rating: 4.9,
    reviews: 18,
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=500&fit=crop",
    badge: "New Arrival",
    sizes: ["M", "L", "XL"],
    colors: ["Maroon", "Burgundy", "Wine"],
    category: "Sherwanis",
    description: "Premium maroon velvet sherwani for special occasions",
    inStock: true,
    fabric: "Velvet",
    occasion: "Wedding",
    sizePricing: {
      "M": { price: "₹14,999", originalPrice: "₹18,999" },
      "L": { price: "₹15,499", originalPrice: "₹19,499" },
      "XL": { price: "₹15,999", originalPrice: "₹19,999" }
    }
  },
  {
    id: 9,
    name: "Golden Brocade Sherwani",
    price: "₹16,999",
    originalPrice: "₹21,999",
    rating: 4.7,
    reviews: 32,
    image: "https://images.unsplash.com/photo-1583030200306-33ca486d8e30?w=400&h=500&fit=crop",
    badge: "Premium",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gold", "Cream", "Champagne"],
    category: "Sherwanis",
    description: "Luxurious golden brocade sherwani with traditional patterns",
    inStock: true,
    fabric: "Brocade",
    occasion: "Wedding"
  },
  {
    id: 13,
    name: "Black Bandhgala Sherwani",
    price: "₹15,999",
    originalPrice: "₹19,999",
    rating: 4.9,
    reviews: 21,
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=500&fit=crop&sat=-100",
    badge: "Limited Edition",
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Charcoal", "Midnight"],
    category: "Sherwanis",
    description: "Classic black bandhgala sherwani for formal events",
    inStock: true,
    fabric: "Silk",
    occasion: "Formal"
  },
  
  // Kurtas
  {
    id: 3,
    name: "Ivory Cotton Kurta Set",
    price: "₹2,999",
    originalPrice: "₹4,999",
    rating: 4.7,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?w=400&h=500&fit=crop",
    badge: "Sale",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Ivory", "White", "Cream"],
    category: "Kurtas",
    description: "Comfortable cotton kurta set perfect for daily wear",
    inStock: true,
    fabric: "Cotton",
    occasion: "Casual"
  },
  {
    id: 4,
    name: "Navy Blue Silk Kurta",
    price: "₹3,499",
    originalPrice: "₹4,999",
    rating: 4.6,
    reviews: 32,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=500&fit=crop",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Navy Blue", "Royal Blue", "Prussian Blue"],
    category: "Kurtas",
    description: "Premium silk kurta in elegant navy blue",
    inStock: true,
    fabric: "Silk",
    occasion: "Festival"
  },
  {
    id: 10,
    name: "Mint Green Kurta Pajama",
    price: "₹2,499",
    originalPrice: "₹3,999",
    rating: 4.4,
    reviews: 18,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Mint Green", "Sage", "Sea Green"],
    category: "Kurtas",
    description: "Fresh mint green kurta pajama set",
    inStock: true,
    fabric: "Cotton",
    occasion: "Casual"
  },
  {
    id: 14,
    name: "White Chikankari Kurta",
    price: "₹4,999",
    originalPrice: "₹6,999",
    rating: 4.8,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400&h=500&fit=crop",
    badge: "Handcrafted",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Off-White", "Cream"],
    category: "Kurtas",
    description: "Traditional white chikankari kurta with intricate embroidery",
    inStock: true,
    fabric: "Cotton",
    occasion: "Festival"
  },
  
  // Suits
  {
    id: 5,
    name: "Emerald Green Bandhgala Suit",
    price: "₹8,999",
    originalPrice: "₹12,999",
    rating: 4.8,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=500&fit=crop",
    badge: "Premium",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Emerald", "Forest Green", "Jade"],
    category: "Suits",
    description: "Sophisticated emerald green bandhgala suit",
    inStock: true,
    fabric: "Wool",
    occasion: "Wedding"
  },
  {
    id: 6,
    name: "Charcoal Grey Nehru Suit",
    price: "₹7,999",
    originalPrice: "₹10,999",
    rating: 4.5,
    reviews: 21,
    image: "https://images.unsplash.com/photo-1564463836146-4e40c2e6e3b5?w=400&h=500&fit=crop",
    sizes: ["M", "L", "XL"],
    colors: ["Charcoal", "Slate", "Graphite"],
    category: "Suits",
    description: "Classic charcoal grey Nehru suit for formal occasions",
    inStock: true,
    fabric: "Wool",
    occasion: "Formal"
  },
  {
    id: 11,
    name: "Black Tuxedo Suit",
    price: "₹15,999",
    originalPrice: "₹19,999",
    rating: 4.8,
    reviews: 25,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    badge: "Formal",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Midnight", "Charcoal"],
    category: "Suits",
    description: "Premium black tuxedo suit for special events",
    inStock: true,
    fabric: "Wool",
    occasion: "Formal"
  },
  
  // Lehengas
  {
    id: 7,
    name: "Bridal Red Lehenga",
    price: "₹24,999",
    originalPrice: "₹32,999",
    rating: 4.9,
    reviews: 15,
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e9?w=400&h=500&fit=crop",
    badge: "Bridal Special",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Bridal Red", "Crimson", "Ruby"],
    category: "Lehengas",
    description: "Stunning bridal red lehenga with heavy embroidery",
    inStock: true,
    fabric: "Silk",
    occasion: "Wedding"
  },
  {
    id: 8,
    name: "Pink & Gold Party Lehenga",
    price: "₹18,999",
    originalPrice: "₹24,999",
    rating: 4.7,
    reviews: 22,
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=500&fit=crop&hue=350",
    badge: "Party Wear",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Pink", "Rose Gold", "Blush"],
    category: "Lehengas",
    description: "Elegant pink and gold lehenga perfect for parties",
    inStock: true,
    fabric: "Georgette",
    occasion: "Party"
  },
  {
    id: 12,
    name: "Royal Purple Lehenga",
    price: "₹21,999",
    originalPrice: "₹28,999",
    rating: 4.6,
    reviews: 19,
    image: "https://images.unsplash.com/photo-1583391733975-b8701bd82cd4?w=400&h=500&fit=crop",
    badge: "Designer",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Royal Purple", "Violet", "Plum"],
    category: "Lehengas",
    description: "Majestic royal purple designer lehenga",
    inStock: true,
    fabric: "Silk",
    occasion: "Wedding"
  }
];

// Helper functions
export const getProductsByCategory = (category: string): Product[] => {
  if (category === "All") return allProducts;
  return allProducts.filter(product => product.category === category);
};

export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case "price-low":
      return sortedProducts.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
        const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
        return priceA - priceB;
      });
    
    case "price-high":
      return sortedProducts.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
        const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
        return priceB - priceA;
      });
    
    case "rating":
      return sortedProducts.sort((a, b) => b.rating - a.rating);
    
    case "newest":
      return sortedProducts.sort((a, b) => b.id - a.id);
    
    case "featured":
    default:
      return sortedProducts.sort((a, b) => {
        // Prioritize products with badges
        if (a.badge && !b.badge) return -1;
        if (!a.badge && b.badge) return 1;
        return b.rating - a.rating;
      });
  }
};

export const getProductById = (id: string | number): Product | null => {
  return allProducts.find(product => product.id === parseInt(id.toString())) || null;
};

export const getProductPricing = (product: Product, size?: string): { price: string; originalPrice?: string } => {
  if (!size || !product.sizePricing || !product.sizePricing[size]) {
    return {
      price: product.price,
      originalPrice: product.originalPrice
    };
  }

  return product.sizePricing[size];
};

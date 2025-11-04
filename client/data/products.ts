// Empty products array - data will be loaded from database
export const allProducts: any[] = [];

// This file is kept for compatibility but products are now loaded from the database
// via the API endpoints in the components

export interface Product {
  id: string; // Changed from number to string for MongoDB ObjectId
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

// Transform MongoDB product to frontend Product format
const transformProduct = (dbProduct: any): Product => {
  // Convert price from paise to rupees and format as string
  const priceInRupees = (dbProduct.price / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  });

  // Extract sizes as string array
  const sizes = dbProduct.sizes?.map((size: any) => size.label) || [];

  // Extract colors as string array
  const colors = dbProduct.colors?.map((color: any) => color.label) || [];

  // Get primary category (first one with lowest rank)
  const primaryCategory = dbProduct.categories?.sort((a: any, b: any) => a.rank - b.rank)[0]?.name || 'general';

  // Get hero image or first image
  const heroImage = dbProduct.images?.find((img: any) => img.role === 'hero') ||
                   dbProduct.images?.[0];
  const imageUrl = heroImage?.url ? `${heroImage.url}` : '/placeholder-product.jpg';

  return {
    id: dbProduct._id.toString(), // Use MongoDB ObjectId as string
    name: dbProduct.title,
    price: priceInRupees,
    rating: 4.5, // Default rating since not in DB
    reviews: 0, // Default reviews since not in DB
    image: imageUrl,
    sizes,
    colors,
    category: primaryCategory,
    description: dbProduct.description,
    inStock: dbProduct.stock > 0,
  };
};

// Helper functions - now use API calls instead of local data
export const getProductsByCategory = async (category: string, options?: {
  tag?: string;
  occasion?: string;
  page?: number;
  limit?: number;
}): Promise<Product[]> => {
  try {
    const params = new URLSearchParams();
    if (options?.tag) params.append('tag', options.tag);
    if (options?.occasion) params.append('occasion', options.occasion);
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());

    const queryString = params.toString();
    const url = category === 'All'
      ? `/api/products/all${queryString ? `?${queryString}` : ''}`
      : `/api/products/category/${category}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    const data = await response.json();
    if (data.success && data.products) {
      return data.products.map(transformProduct);
    }
    return [];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

export const getProductsByTag = async (tag: string, options?: {
  category?: string;
  occasion?: string;
  page?: number;
  limit?: number;
}): Promise<Product[]> => {
  try {
    const params = new URLSearchParams();
    if (options?.category) params.append('category', options.category);
    if (options?.occasion) params.append('occasion', options.occasion);
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());

    const queryString = params.toString();
    const url = `/api/products/tag/${tag}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    const data = await response.json();
    if (data.success && data.products) {
      return data.products.map(transformProduct);
    }
    return [];
  } catch (error) {
    console.error('Error fetching products by tag:', error);
    return [];
  }
};

export const getProductsByOccasion = async (occasion: string, options?: {
  category?: string;
  tag?: string;
  page?: number;
  limit?: number;
}): Promise<Product[]> => {
  try {
    const params = new URLSearchParams();
    if (options?.category) params.append('category', options.category);
    if (options?.tag) params.append('tag', options.tag);
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());

    const queryString = params.toString();
    const url = `/api/products/occasion/${occasion}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    const data = await response.json();
    if (data.success && data.products) {
      return data.products.map(transformProduct);
    }
    return [];
  } catch (error) {
    console.error('Error fetching products by occasion:', error);
    return [];
  }
};

export const getAllProducts = async (options?: {
  tag?: string;
  occasion?: string;
  page?: number;
  limit?: number;
}): Promise<Product[]> => {
  try {
    const params = new URLSearchParams();
    if (options?.tag) params.append('tag', options.tag);
    if (options?.occasion) params.append('occasion', options.occasion);
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());

    const queryString = params.toString();
    const url = `/api/products/all${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    const data = await response.json();
    if (data.success && data.products) {
      return data.products.map(transformProduct);
    }
    return [];
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
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
      return sortedProducts.sort((a, b) => b.id.localeCompare(a.id));
    
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

export const getProductById = async (id: string | number): Promise<Product | null> => {
  try {
    const response = await fetch(`/api/products/${id}`);
    const data = await response.json();
    if (data.success && data.product) {
      return transformProduct(data.product);
    }
    return null;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
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
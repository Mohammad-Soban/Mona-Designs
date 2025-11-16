/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  role: 'user' | 'admin';
  profileImage?: {
    url: string;
    public_id: string;
  };
  address?: Array<{
    label: string;
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// Product types
export interface ProductImage {
  url: string;
  public_id: string;
  alt: string;
  role: 'hero' | 'gallery' | 'thumbnail' | 'category';
  position: number;
}

export interface ProductSize {
  label: string;
  qty: number;
}

export interface ProductColor {
  label: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number; // in paise
  currency: string;
  sku?: string;
  stock: number;
  categories: string[];
  tags: string[];
  sizes?: ProductSize[];
  colors?: ProductColor[];
  images: ProductImage[];
  attributes: Record<string, any>;
  isActive: boolean;
  featured: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Cart types
export interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  rating: number;
  quantity: number;
  size?: string;
  color?: string;
  options?: Record<string, any>;
}

export interface Cart {
  items: CartItem[];
  isOpen: boolean;
}

// Order types
export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  qty: number;
  size?: string;
  color?: string;
  options?: Record<string, any>;
}

export interface Address {
  label?: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentDetails {
  provider: string;
  orderId: string;
  paymentId?: string;
  signature?: string;
  method?: string;
  captured: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  status: 'pending' | 'created' | 'paid' | 'failed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment: PaymentDetails;
  receiptId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  success: boolean;
  message?: string;
  order?: Order;
  orders?: Order[];
}

// Payment types
export interface RazorpayOrderResponse {
  success: boolean;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  key_id: string;
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  order?: Order;
  payment?: any;
}

// Admin types
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  lowStockProducts: Product[];
}

export interface AdminResponse {
  success: boolean;
  message?: string;
  stats?: DashboardStats;
  users?: User[];
  orders?: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API Error types
export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

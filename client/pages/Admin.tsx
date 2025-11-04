import { useState, useEffect } from "react";
import { AdminLogin } from "@/components/ui/admin-login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Calendar,
  AlertCircle,
  CheckCircle,
  Upload,
  Save,
  X,
  Star,
  Activity,
  PieChart,
  LineChart,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionWrapper } from "@/components/ui/section-wrapper";

interface Product {
  _id?: string;
  id: string;
  name: string;
  title?: string;
  category: string;
  price: string;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  sales: number;
  rating: number;
  description?: string;
  categories?: Array<{name: string; rank: number}>;
  attributes?: {
    fabric?: string;
    occasion?: string;
    fit?: string;
    careInstructions?: string;
    keyFeatures?: string[];
    whatsIncluded?: string[];
  };
  sizes?: Array<{label: string; qty: number}>;
  colors?: Array<{label: string; hex: string}>;
}

interface NewProduct {
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  fabric: string;
  occasion: string;
  sizes: string;
  colors: string;
  keyFeatures: string[];
  whatsIncluded: string[];
  fit: string;
  careInstructions: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    fabric: "",
    occasion: "",
    sizes: "",
    colors: "",
    keyFeatures: ["", "", "", "", ""],
    whatsIncluded: ["", "", "", ""],
    fit: "",
    careInstructions: ""
  });

  const [stats, setStats] = useState([
    {
      title: "Total Revenue",
      value: "₹0",
      change: "0%",
      icon: IndianRupee,
      trend: "up",
      description: "This month"
    },
    {
      title: "Total Orders",
      value: "0",
      change: "0%",
      icon: ShoppingCart,
      trend: "up",
      description: "This month"
    },
    {
      title: "Total Products",
      value: "0",
      change: "0%",
      icon: Package,
      trend: "up",
      description: "Active products"
    },
    {
      title: "Active Users",
      value: "0",
      change: "0%",
      icon: Users,
      trend: "up",
      description: "This month"
    }
  ]);

  // State for analytics data
  const [analyticsData, setAnalyticsData] = useState<Array<{month: string; revenue: number; orders: number}>>([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

  /**
   * Fetch monthly analytics data from the server
   * Retrieves the last 6 months of revenue and order statistics
   */
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoadingAnalytics(true);
        const response = await fetch('/api/orders/analytics', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('mona-admin-token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setAnalyticsData(data.data);
          }
        } else {
          console.warn('Failed to fetch analytics data');
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, []);

  /**
   * Fetch comprehensive dashboard statistics
   * Fetches products, orders, and user counts with month-over-month growth
   */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch products count first as it's the most important
        const productsRes = await fetch('/api/products?count=true', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('mona-admin-token')}`
          }
        });

        let ordersData = { totalRevenue: 0, totalOrders: 0, revenueChange: 0, ordersChange: 0 };
        let productsData = { total: 0, change: 0 };
        let usersData = { totalUsers: 0, userChange: 0 };

        // Get products data
        if (productsRes.ok) {
          productsData = await productsRes.json();
        }

        // Try to fetch orders stats
        try {
          const ordersRes = await fetch('/api/orders/stats', {
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('mona-admin-token')}`
            }
          });
          if (ordersRes.ok) {
            ordersData = await ordersRes.json();
          }
        } catch (error) {
          console.warn('Orders stats not available yet');
        }

        // Try to fetch users stats
        try {
          const usersRes = await fetch('/api/users/stats', {
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('mona-admin-token')}`
            }
          });
          if (usersRes.ok) {
            usersData = await usersRes.json();
          }
        } catch (error) {
          console.warn('Users stats not available yet');
        }

        setStats([
          {
            title: "Total Revenue",
            value: `₹${ordersData.totalRevenue?.toLocaleString('en-IN') || '0'}`,
            change: `${ordersData.revenueChange || '0'}%`,
            icon: IndianRupee,
            trend: ordersData.revenueChange >= 0 ? "up" : "down",
            description: "This month"
          },
          {
            title: "Total Orders",
            value: ordersData.totalOrders?.toString() || '0',
            change: `${ordersData.ordersChange || '0'}%`,
            icon: ShoppingCart,
            trend: ordersData.ordersChange >= 0 ? "up" : "down",
            description: "This month"
          },
          {
            title: "Total Products",
            value: productsData.total?.toString() || '0',
            change: `${productsData.change || '0'}%`,
            icon: Package,
            trend: productsData.change >= 0 ? "up" : "down",
            description: "Active products"
          },
          {
            title: "Active Users",
            value: usersData.totalUsers?.toString() || '0',
            change: `${usersData.userChange || '0'}%`,
            icon: Users,
            trend: usersData.userChange >= 0 ? "up" : "down",
            description: "This month"
          }
        ]);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('mona-admin-token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.products.map((p: any) => ({
          id: p._id,
          name: p.title,
          category: p.categories[0]?.name || 'Uncategorized',
          price: `₹${p.price.toLocaleString('en-IN')}`,
          stock: p.stock,
          status: p.stock > 10 ? "In Stock" : p.stock > 0 ? "Low Stock" : "Out of Stock",
          sales: p.metadata?.sales || 0,
          rating: p.metadata?.rating || 0
        })));
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // State for recent orders
  interface RecentOrder {
    id: string;
    customer: string;
    amount: string;
    status: string;
    date: string;
  }
  
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  /**
   * Fetch recent orders for the dashboard
   * Retrieves the last 10 orders from the database
   */
  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setIsLoadingOrders(true);
        const response = await fetch('/api/orders/recent?limit=10', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('mona-admin-token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.orders) {
            setRecentOrders(data.orders);
          }
        } else {
          console.warn('Failed to fetch recent orders');
        }
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchRecentOrders();
  }, []);

  // Product CRUD helper functions
  const viewProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      if (data.success) {
        setSelectedProduct(data.product);
      } else {
        setError('Failed to fetch product details');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Error fetching product details');
    }
  };

  const editProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      if (data.success) {
        const product = data.product;
        setNewProduct({
          name: product.title,
          category: product.categories[0]?.name || '',
          price: `₹${product.price.toLocaleString('en-IN')}`,
          stock: product.stock.toString(),
          description: product.description,
          fabric: product.attributes?.fabric || '',
          occasion: Array.isArray(product.attributes?.occasions) 
            ? product.attributes.occasions.join(', ') 
            : (product.attributes?.occasion || ''),
          sizes: product.sizes?.map((s: any) => s.label).join(', ') || '',
          colors: product.colors?.map((c: any) => c.label).join(', ') || '',
          keyFeatures: product.attributes?.keyFeatures || ['', '', '', '', ''],
          whatsIncluded: product.attributes?.whatsIncluded || ['', '', '', ''],
          fit: product.attributes?.fit || '',
          careInstructions: product.attributes?.careInstructions || ''
        });
        setSelectedProduct(product);
        setIsEditing(true);
        setShowAddProduct(true);
      } else {
        setError('Failed to fetch product details');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Error fetching product details');
    }
  };

  const updateProduct = async () => {
    try {
      // Price in rupees (no conversion needed)
      const priceInRupees = Math.round(parseFloat(newProduct.price.replace(/[^0-9.]/g, '')));
      
      const productData = {
        title: newProduct.name,
        description: newProduct.description || `${newProduct.name} - ${newProduct.category}`,
        price: priceInRupees,
        stock: parseInt(newProduct.stock),
        categories: [{
          name: newProduct.category.toLowerCase(),
          rank: 1
        }],
        tags: [newProduct.category.toLowerCase()],
        sizes: newProduct.sizes.split(',').map(size => ({
          label: size.trim(),
          qty: parseInt(newProduct.stock)
        })),
        colors: newProduct.colors.split(',').map(color => ({
          label: color.trim(),
          hex: '#000000'
        })),
        attributes: {
          fabric: newProduct.fabric,
          occasions: newProduct.occasion ? newProduct.occasion.split(',').map(o => o.trim()).filter(o => o) : [],
          fit: newProduct.fit,
          careInstructions: newProduct.careInstructions,
          keyFeatures: newProduct.keyFeatures.filter(f => f.trim()),
          whatsIncluded: newProduct.whatsIncluded.filter(i => i.trim())
        },
        isActive: true
      };

      const response = await fetch(`/api/products/${selectedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchProducts();
        setShowAddProduct(false);
        setIsEditing(false);
        setSelectedProduct(null);
        setNewProduct({
          name: "",
          category: "",
          price: "",
          stock: "",
          description: "",
          fabric: "",
          occasion: "",
          sizes: "",
          colors: "",
          keyFeatures: ["", "", "", "", ""],
          whatsIncluded: ["", "", "", ""],
          fit: "",
          careInstructions: ""
        });
      } else {
        setError(data.message || 'Failed to update product');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Error updating product');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchProducts();
      } else {
        setError(data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Error deleting product');
    }
  };

  // Product add handler
  const { toast } = useToast();

  const handleAddProduct = async () => {
    try {
      setError(null); // Clear any previous errors
      
      // Price in rupees (no conversion needed)
      const priceInRupees = Math.round(parseFloat(newProduct.price.replace(/[^0-9.]/g, '')));
      
      // Validate required fields first
      if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category) {
        setError('Please fill in all required fields: Name, Price, Stock, and Category');
        return;
      }

      // Get auth token
      const token = sessionStorage.getItem('mona-admin-token');
      if (!token) {
        setError('Please log in again to continue');
        sessionStorage.removeItem('mona-admin-auth');
        window.location.reload();
        return;
      }
      
      // Prepare the product data
      const productData = {
        title: newProduct.name,
        description: newProduct.description || `${newProduct.name} - ${newProduct.category}`, // Fallback description
        price: priceInRupees,
        stock: parseInt(newProduct.stock),
        categories: [{
          name: newProduct.category.toLowerCase(),
          rank: 1
        }],
        tags: [newProduct.category.toLowerCase()],
        sizes: newProduct.sizes ? newProduct.sizes.split(',').map(size => ({
          label: size.trim(),
          qty: parseInt(newProduct.stock)
        })) : [],
        colors: newProduct.colors ? newProduct.colors.split(',').map(color => ({
          label: color.trim(),
          hex: '#000000' // You might want to add a color picker in the UI
        })) : [],
        attributes: {
          fabric: newProduct.fabric || '',
          occasions: newProduct.occasion ? newProduct.occasion.split(',').map(o => o.trim()).filter(o => o) : [],
          fit: newProduct.fit || '',
          careInstructions: newProduct.careInstructions || '',
          keyFeatures: newProduct.keyFeatures.filter(f => f.trim()),
          whatsIncluded: newProduct.whatsIncluded.filter(i => i.trim())
        },
        isActive: true,
        metadata: {
          sales: 0,
          rating: 0
        }
      };

      // Send the request with timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        if (response.status === 401) {
          setError('Your session has expired. Please log in again.');
          sessionStorage.removeItem('mona-admin-auth');
          window.location.reload();
          return;
        }
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save product');
        return;
      }

      const data = await response.json();
      await fetchProducts(); // Refresh products list
      setShowAddProduct(false); // Close form
      setNewProduct({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        sizes: '',
        colors: '',
        fabric: '',
        occasion: '',
        fit: '',
        careInstructions: '',
        keyFeatures: ["", "", "", "", ""],
        whatsIncluded: ["", "", "", ""]
      });
      toast({
        title: "Success!",
        description: "Product added successfully"
      });

    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err.message || 'Failed to save product');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Out of Stock":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SectionWrapper variant="hero" padding="lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-foreground via-gold to-foreground bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your store, products, and analytics
            </p>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="default" padding="lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Desktop Tab Navigation */}
            <TabsList className="hidden md:grid w-full grid-cols-4 h-12 bg-muted/30">
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Products</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Inventory</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Orders</span>
              </TabsTrigger>
            </TabsList>

            {/* Mobile Dropdown Navigation */}
            <div className="md:hidden">
              <div className="relative">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="w-full appearance-none bg-background border border-border rounded-md px-4 py-3 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="analytics">📊 Analytics</option>
                  <option value="products">📦 Products</option>
                  <option value="inventory">📈 Inventory</option>
                  <option value="orders">🛒 Orders</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
              </div>
            </div>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 border-gold/20">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          "bg-gradient-to-br from-gold/20 to-amber-500/20"
                        )}>
                          <stat.icon className="h-5 w-5 text-gold" />
                        </div>
                        <div className={cn(
                          "flex items-center space-x-1 text-sm",
                          stat.trend === "up" ? "text-green-600" : "text-red-600"
                        )}>
                          {stat.trend === "up" ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span>{stat.change}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.title}</p>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <LineChart className="h-5 w-5 text-gold" />
                      <span>Revenue Trends (Last 6 Months)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingAnalytics ? (
                      <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                          <Activity className="h-12 w-12 text-gold animate-pulse mx-auto mb-2" />
                          <p className="text-muted-foreground">Loading analytics...</p>
                        </div>
                      </div>
                    ) : analyticsData.length > 0 ? (
                      <div className="space-y-4">
                        {analyticsData.map((data, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{data.month}</span>
                              <div className="text-right">
                                <div className="font-bold text-gold">
                                  ₹{data.revenue.toLocaleString('en-IN')}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {data.orders} orders
                                </div>
                              </div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-gold to-amber-500 h-2 rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${Math.min((data.revenue / Math.max(...analyticsData.map(d => d.revenue))) * 100, 100)}%` 
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                        <div className="text-center">
                          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No analytics data available</p>
                          <p className="text-sm text-muted-foreground">Data will appear as orders are placed</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="h-5 w-5 text-gold" />
                      <span>Category Sales</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { category: "Sherwanis", percentage: 35, sales: "₹85,670" },
                        { category: "Lehengas", percentage: 28, sales: "₹68,990" },
                        { category: "Kurtas", percentage: 22, sales: "₹54,010" },
                        { category: "Suits", percentage: 15, sales: "₹37,000" }
                      ].map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{item.category}</span>
                            <span className="font-medium">{item.sales}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-gold h-2 rounded-full transition-all duration-500"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Product Management</h2>
                <Button onClick={() => setShowAddProduct(true)} className="bg-gold hover:bg-gold/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              </div>

              {showAddProduct && (
                <Card className="border-gold/30">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{isEditing ? 'Edit Product' : 'Add New Product'}</span>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setShowAddProduct(false);
                        setIsEditing(false);
                        setError(null);
                      }}>
                        <X className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {error && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-red-800 dark:text-red-300">Error</h4>
                            <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sherwanis">Sherwanis</SelectItem>
                            <SelectItem value="Kurtas">Kurtas</SelectItem>
                            <SelectItem value="Suits">Suits</SelectItem>
                            <SelectItem value="Lehengas">Lehengas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          placeholder="₹0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock Quantity</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fabric">Fabric</Label>
                        <Input
                          id="fabric"
                          value={newProduct.fabric}
                          onChange={(e) => setNewProduct({...newProduct, fabric: e.target.value})}
                          placeholder="e.g., Silk, Cotton, Velvet"
                        />
                      </div>
                      <div>
                        <Label htmlFor="occasion">Occasions (comma-separated)</Label>
                        <Input
                          id="occasion"
                          value={newProduct.occasion}
                          onChange={(e) => setNewProduct({...newProduct, occasion: e.target.value})}
                          placeholder="e.g., Wedding, Reception, Festival"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sizes">Available Sizes</Label>
                        <Input
                          id="sizes"
                          value={newProduct.sizes}
                          onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value})}
                          placeholder="S, M, L, XL, XXL"
                        />
                      </div>
                      <div>
                        <Label htmlFor="colors">Available Colors</Label>
                        <Input
                          id="colors"
                          value={newProduct.colors}
                          onChange={(e) => setNewProduct({...newProduct, colors: e.target.value})}
                          placeholder="Red, Blue, Green"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        placeholder="Enter product description"
                        rows={3}
                      />
                    </div>

                    {/* Key Features Section */}
                    <div>
                      <Label>Key Features (5 points)</Label>
                      <div className="space-y-2 mt-2">
                        {newProduct.keyFeatures.map((feature, index) => (
                          <Input
                            key={index}
                            value={feature}
                            onChange={(e) => {
                              const updatedFeatures = [...newProduct.keyFeatures];
                              updatedFeatures[index] = e.target.value;
                              setNewProduct({...newProduct, keyFeatures: updatedFeatures});
                            }}
                            placeholder={`Key feature ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* What's Included Section */}
                    <div>
                      <Label>What's Included (1-4 items)</Label>
                      <div className="space-y-2 mt-2">
                        {newProduct.whatsIncluded.map((item, index) => (
                          <Input
                            key={index}
                            value={item}
                            onChange={(e) => {
                              const updatedItems = [...newProduct.whatsIncluded];
                              updatedItems[index] = e.target.value;
                              setNewProduct({...newProduct, whatsIncluded: updatedItems});
                            }}
                            placeholder={`Item ${index + 1} (optional ${index > 0 ? 'for items 2-4' : ''})`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Fit Section */}
                    <div>
                      <Label htmlFor="fit">Fit</Label>
                      <Input
                        id="fit"
                        value={newProduct.fit}
                        onChange={(e) => setNewProduct({...newProduct, fit: e.target.value})}
                        placeholder="e.g., Regular fit, Slim fit, Loose fit"
                      />
                    </div>

                    {/* Care Instructions Section */}
                    <div>
                      <Label htmlFor="careInstructions">Care Instructions</Label>
                      <Textarea
                        id="careInstructions"
                        value={newProduct.careInstructions}
                        onChange={(e) => setNewProduct({...newProduct, careInstructions: e.target.value})}
                        placeholder="Enter care instructions (e.g., Dry clean only, Hand wash with cold water, etc.)"
                        rows={3}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        onClick={isEditing ? updateProduct : handleAddProduct} 
                        className="bg-gold hover:bg-gold/90"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isEditing ? 'Update Product' : 'Save Product'}
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddProduct(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>All Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="border rounded-lg hover:shadow-md transition-all">
                        {/* Desktop Layout */}
                        <div className="hidden md:flex items-center justify-between p-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-right">
                              <p className="font-semibold">{product.price}</p>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-gold fill-current" />
                                <span className="text-xs">{product.rating}</span>
                              </div>
                            </div>
                            <Badge className={getStatusColor(product.status)}>
                              {product.status}
                            </Badge>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => viewProduct(product.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => editProduct(product.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Layout */}
                        <div className="md:hidden p-4 space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                              <p className="text-xs text-muted-foreground">{product.category}</p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold text-sm">{product.price}</span>
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-3 w-3 text-gold fill-current" />
                                    <span className="text-xs">{product.rating}</span>
                                  </div>
                                </div>
                                <Badge className={`${getStatusColor(product.status)} text-xs`}>
                                  {product.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 pt-2 border-t">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-2xl font-semibold">Inventory Management</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                    <Download className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                    <Upload className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Import</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="border-green-200 dark:border-green-800">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">67</p>
                    <p className="text-sm text-muted-foreground">In Stock</p>
                  </CardContent>
                </Card>
                <Card className="border-yellow-200 dark:border-yellow-800">
                  <CardContent className="p-6 text-center">
                    <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">12</p>
                    <p className="text-sm text-muted-foreground">Low Stock</p>
                  </CardContent>
                </Card>
                <Card className="border-red-200 dark:border-red-800">
                  <CardContent className="p-6 text-center">
                    <X className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">10</p>
                    <p className="text-sm text-muted-foreground">Out of Stock</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Stock Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="border rounded-lg">
                        {/* Desktop Layout */}
                        <div className="hidden md:flex items-center justify-between p-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-semibold">{product.stock} units</p>
                              <p className="text-xs text-muted-foreground">{product.sales} sold</p>
                            </div>
                            <Badge className={getStatusColor(product.status)}>
                              {product.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              Update Stock
                            </Button>
                          </div>
                        </div>

                        {/* Mobile Layout */}
                        <div className="md:hidden p-4 space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm truncate">{product.name}</h3>
                              <p className="text-xs text-muted-foreground">{product.category}</p>
                              <div className="flex items-center justify-between mt-2">
                                <div>
                                  <span className="font-semibold text-sm">{product.stock} units</span>
                                  <span className="text-xs text-muted-foreground ml-2">({product.sales} sold)</span>
                                </div>
                                <Badge className={`${getStatusColor(product.status)} text-xs`}>
                                  {product.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end pt-2 border-t">
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                              Update Stock
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Order Management</h2>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingOrders ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <Activity className="h-12 w-12 text-gold animate-pulse mx-auto mb-2" />
                        <p className="text-muted-foreground">Loading recent orders...</p>
                      </div>
                    </div>
                  ) : recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg hover:shadow-md transition-all">
                        {/* Desktop Layout */}
                        <div className="hidden md:flex items-center justify-between p-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-medium">{order.id}</h3>
                              <p className="text-sm text-muted-foreground">{order.customer}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-semibold">{order.amount}</p>
                              <p className="text-xs text-muted-foreground">{order.date}</p>
                            </div>
                            <Badge className={getOrderStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Layout */}
                        <div className="md:hidden p-4 space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm">{order.id}</h3>
                              <p className="text-xs text-muted-foreground truncate">{order.customer}</p>
                              <div className="flex items-center justify-between mt-2">
                                <div>
                                  <span className="font-semibold text-sm">{order.amount}</span>
                                  <span className="text-xs text-muted-foreground ml-2">{order.date}</span>
                                </div>
                                <Badge className={`${getOrderStatusColor(order.status)} text-xs`}>
                                  {order.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 pt-2 border-t">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No orders found</p>
                      <p className="text-sm text-muted-foreground">Orders will appear here once customers place them</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SectionWrapper>
    </div>
  );
};

// Protected Admin Component with Login
function ProtectedAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (token: string) => {
    setIsAuthenticated(true);
    // Store admin token
    sessionStorage.setItem("mona-admin-token", token);
    sessionStorage.setItem("mona-admin-auth", "true");
  };

  // Check for existing admin session on component mount
  useEffect(() => {
    const token = sessionStorage.getItem("mona-admin-token");
    const isAdminAuthenticated = sessionStorage.getItem("mona-admin-auth") === "true" && !!token;
    if (!isAdminAuthenticated) {
      // Clear any stale data
      sessionStorage.removeItem("mona-admin-token");
      sessionStorage.removeItem("mona-admin-auth");
    }
    setIsAuthenticated(isAdminAuthenticated);
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <>
      <AdminDashboard />
      <Toaster />
    </>
  );
}

export default ProtectedAdmin;

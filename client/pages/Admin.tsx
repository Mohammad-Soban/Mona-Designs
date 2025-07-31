import { useState, useEffect } from "react";
import { AdminLogin } from "@/components/ui/admin-login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  LineChart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionWrapper } from "@/components/ui/section-wrapper";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  sales: number;
  rating: number;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
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

  // Mock data for admin dashboard
  const stats = [
    {
      title: "Total Revenue",
      value: "₹2,45,670",
      change: "+12.5%",
      icon: IndianRupee,
      trend: "up",
      description: "This month"
    },
    {
      title: "Total Orders",
      value: "156",
      change: "+8.2%",
      icon: ShoppingCart,
      trend: "up",
      description: "This month"
    },
    {
      title: "Total Products",
      value: "89",
      change: "+3.1%",
      icon: Package,
      trend: "up",
      description: "Active products"
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "+15.3%",
      icon: Users,
      trend: "up",
      description: "This month"
    }
  ];

  const analyticsData = [
    { month: "Jan", revenue: 45000, orders: 32 },
    { month: "Feb", revenue: 52000, orders: 38 },
    { month: "Mar", revenue: 48000, orders: 35 },
    { month: "Apr", revenue: 61000, orders: 42 },
    { month: "May", revenue: 55000, orders: 39 },
    { month: "Jun", revenue: 67000, orders: 45 }
  ];

  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Royal Blue Silk Sherwani",
      category: "Sherwanis",
      price: "₹12,999",
      stock: 15,
      status: "In Stock",
      sales: 24,
      rating: 4.8
    },
    {
      id: 2,
      name: "Maroon Velvet Sherwani",
      category: "Sherwanis",
      price: "₹14,999",
      stock: 3,
      status: "Low Stock",
      sales: 18,
      rating: 4.9
    },
    {
      id: 3,
      name: "Ivory Cotton Kurta Set",
      category: "Kurtas",
      price: "₹2,999",
      stock: 0,
      status: "Out of Stock",
      sales: 45,
      rating: 4.7
    },
    {
      id: 4,
      name: "Navy Blue Silk Kurta",
      category: "Kurtas",
      price: "₹3,499",
      stock: 22,
      status: "In Stock",
      sales: 32,
      rating: 4.6
    }
  ];

  const recentOrders = [
    { id: "ORD001", customer: "Rajesh Kumar", amount: "₹12,999", status: "Processing", date: "2024-01-20" },
    { id: "ORD002", customer: "Priya Sharma", amount: "₹8,999", status: "Shipped", date: "2024-01-19" },
    { id: "ORD003", customer: "Amit Patel", amount: "₹5,498", status: "Delivered", date: "2024-01-18" },
    { id: "ORD004", customer: "Sneha Reddy", amount: "₹15,999", status: "Processing", date: "2024-01-17" }
  ];

  const handleAddProduct = () => {
    // In a real app, this would send data to the backend
    console.log("Adding product:", newProduct);
    setShowAddProduct(false);
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
                      <span>Revenue Trends</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Revenue chart would be here</p>
                        <p className="text-sm text-muted-foreground">Integrate with Chart.js or Recharts</p>
                      </div>
                    </div>
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
                      <span>Add New Product</span>
                      <Button variant="ghost" size="sm" onClick={() => setShowAddProduct(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                        <Label htmlFor="occasion">Occasion</Label>
                        <Input
                          id="occasion"
                          value={newProduct.occasion}
                          onChange={(e) => setNewProduct({...newProduct, occasion: e.target.value})}
                          placeholder="e.g., Wedding, Festival"
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
                      <Button onClick={handleAddProduct} className="bg-gold hover:bg-gold/90">
                        <Save className="h-4 w-4 mr-2" />
                        Save Product
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
                    {mockProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all">
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
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
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
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Inventory Management</h2>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
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
                    {mockProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all">
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
                    ))}
                  </div>
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

  const handleLogin = () => {
    setIsAuthenticated(true);
    // Store admin session (you might want to use a more secure approach in production)
    sessionStorage.setItem("mona-admin-auth", "true");
  };

  // Check for existing admin session on component mount
  useEffect(() => {
    const isAdminAuthenticated = sessionStorage.getItem("mona-admin-auth") === "true";
    setIsAuthenticated(isAdminAuthenticated);
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard />;
}

export default ProtectedAdmin;

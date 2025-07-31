import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Package, 
  CreditCard, 
  Settings, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  FileText,
  Edit,
  Save
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for orders and bills
const mockOrders = [
  {
    id: "ORD001",
    date: "2024-01-15",
    status: "Delivered",
    total: "₹12,999",
    items: [
      {
        id: 1,
        name: "Royal Blue Silk Sherwani",
        size: "L",
        color: "Royal Blue",
        quantity: 1,
        price: "₹12,999",
        image: "https://images.unsplash.com/photo-1506629905645-b178a0c90810?w=100&h=100&fit=crop"
      }
    ]
  },
  {
    id: "ORD002",
    date: "2024-01-20",
    status: "Processing",
    total: "₹8,999",
    items: [
      {
        id: 5,
        name: "Emerald Green Bandhgala Suit",
        size: "M",
        color: "Emerald",
        quantity: 1,
        price: "₹8,999",
        image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=100&h=100&fit=crop"
      }
    ]
  },
  {
    id: "ORD003",
    date: "2024-01-25",
    status: "Shipped",
    total: "₹5,498",
    items: [
      {
        id: 3,
        name: "Ivory Cotton Kurta Set",
        size: "L",
        color: "Ivory",
        quantity: 1,
        price: "₹2,999",
        image: "https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?w=100&h=100&fit=crop"
      },
      {
        id: 4,
        name: "Navy Blue Silk Kurta",
        size: "M",
        color: "Navy Blue",
        quantity: 1,
        price: "₹2,499",
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=100&h=100&fit=crop"
      }
    ]
  }
];

const mockBills = [
  {
    id: "INV001",
    orderId: "ORD001",
    date: "2024-01-15",
    amount: "₹12,999",
    status: "Paid",
    downloadUrl: "#"
  },
  {
    id: "INV002",
    orderId: "ORD002",
    date: "2024-01-20",
    amount: "₹8,999",
    status: "Pending",
    downloadUrl: "#"
  },
  {
    id: "INV003",
    orderId: "ORD003",
    date: "2024-01-25",
    amount: "₹5,498",
    status: "Paid",
    downloadUrl: "#"
  }
];

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "Mohammad Soban Shaikh",
    email: user?.email || "soban@example.com",
    phone: "+91 9876543210",
    address: "123 Fashion Street, Mumbai, Maharashtra 400001",
    city: "Mumbai",
    pincode: "400001"
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const handleSaveProfile = () => {
    // Here you would typically save to your backend
    setIsEditing(false);
    // Show success toast
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">{profileData.name}</h1>
              <p className="text-muted-foreground">{profileData.email}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger value="bills" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Bills</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Addresses</span>
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Order History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-semibold">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(order.date).toLocaleDateString()}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{order.total}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </Badge>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold">{item.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bills Tab */}
          <TabsContent value="bills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Billing History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBills.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-gold" />
                        </div>
                        <div>
                          <p className="font-semibold">Invoice #{bill.id}</p>
                          <p className="text-sm text-muted-foreground">
                            Order: {bill.orderId} | {new Date(bill.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">{bill.amount}</p>
                          <Badge className={getStatusColor(bill.status)}>
                            {bill.status}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Account Information</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      disabled={true}
                      className="bg-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Phone number cannot be changed for security reasons
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Saved Addresses</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">Home</p>
                        <p className="text-muted-foreground">{profileData.address}</p>
                        <p className="text-muted-foreground">{profileData.city} - {profileData.pincode}</p>
                        <p className="text-muted-foreground">{profileData.phone}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Add New Address
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

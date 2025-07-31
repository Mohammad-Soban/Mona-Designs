import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Watch, 
  Crown, 
  Gem, 
  Shield, 
  Star,
  ShoppingCart,
  Heart
} from "lucide-react";

const accessoryCategories = [
  {
    id: "jewelry",
    name: "Traditional Jewelry",
    icon: Crown,
    description: "Exquisite handcrafted jewelry pieces",
    items: ["Necklaces", "Earrings", "Bracelets", "Rings"]
  },
  {
    id: "watches",
    name: "Luxury Watches",
    icon: Watch,
    description: "Premium timepieces for special occasions",
    items: ["Gold Watches", "Silver Watches", "Traditional Watches"]
  },
  {
    id: "gems",
    name: "Precious Stones",
    icon: Gem,
    description: "Authentic gemstones and precious stones",
    items: ["Emeralds", "Rubies", "Sapphires", "Diamonds"]
  },
  {
    id: "accessories",
    name: "Wedding Accessories",
    icon: Shield,
    description: "Complete your wedding look",
    items: ["Kalgi", "Sehra", "Mojari", "Clutches"]
  }
];

const featuredProducts = [
  {
    id: 1,
    name: "Royal Gold Necklace Set",
    price: "₹25,000",
    image: "/placeholder.svg",
    category: "jewelry"
  },
  {
    id: 2,
    name: "Traditional Kundan Earrings",
    price: "₹8,500",
    image: "/placeholder.svg",
    category: "jewelry"
  },
  {
    id: 3,
    name: "Antique Gold Watch",
    price: "₹45,000",
    image: "/placeholder.svg",
    category: "watches"
  },
  {
    id: 4,
    name: "Wedding Kalgi",
    price: "₹3,200",
    image: "/placeholder.svg",
    category: "accessories"
  }
];

export default function Accessories() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-amber-500/90 to-yellow-600/90 flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-amber-600/20" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Accessories Collection
            </h1>
            <p className="text-amber-100 text-lg">
              Complete your ethnic look with our exquisite collection of traditional 
              jewelry, luxury watches, and premium wedding accessories.
            </p>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">
            Browse by Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {accessoryCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.id}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-gold/20"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                      <Icon className="h-8 w-8 text-gold" />
                    </div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">
                      {category.description}
                    </p>
                    <div className="space-y-1">
                      {category.items.map((item, index) => (
                        <div key={index} className="text-xs text-muted-foreground flex items-center">
                          <Star className="h-3 w-3 mr-1 text-gold" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">
            Featured Accessories
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <div className="aspect-square bg-muted rounded-t-lg relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-gold font-bold text-lg mb-3">{product.price}</p>
                  <Button className="w-full bg-gold hover:bg-gold/90">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View All Accessories
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Our Accessories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">
            Why Choose Our Accessories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                <Crown className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                Handcrafted accessories made with the finest materials and traditional techniques.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                <Gem className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Authentic Designs</h3>
              <p className="text-muted-foreground">
                Traditional designs passed down through generations, crafted by skilled artisans.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Perfect Finishing</h3>
              <p className="text-muted-foreground">
                Every piece is meticulously finished to ensure the highest quality and beauty.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

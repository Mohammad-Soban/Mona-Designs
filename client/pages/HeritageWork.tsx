import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductGrid } from "@/components/ui/product-grid";
import { allProducts } from "@/data/products";
import { 
  Palette, 
  Scissors, 
  Award, 
  Users, 
  Clock,
  Star,
  Camera,
  MapPin
} from "lucide-react";

const heritageSkills = [
  {
    id: "embroidery",
    name: "Traditional Embroidery",
    icon: Scissors,
    description: "Intricate handwork passed down through generations",
    techniques: ["Zardozi", "Gota Patti", "Mirror Work", "Thread Embroidery"]
  },
  {
    id: "dyeing",
    name: "Natural Dyeing",
    icon: Palette,
    description: "Authentic colors using traditional methods",
    techniques: ["Bandhani", "Leheria", "Block Printing", "Ajrakh"]
  },
  {
    id: "weaving",
    name: "Handloom Weaving",
    icon: Award,
    description: "Pure handwoven fabrics with traditional patterns",
    techniques: ["Banarasi", "Kanjivaram", "Patola", "Chanderi"]
  },
  {
    id: "craftsmanship",
    name: "Artisan Craftsmanship",
    icon: Users,
    description: "Master craftsmen creating timeless pieces",
    techniques: ["Hand Stitching", "Beadwork", "Sequin Work", "Cutwork"]
  }
];

const artisanStories = [
  {
    id: 1,
    name: "Master Ravi Kumar",
    craft: "Zardozi Embroidery",
    experience: "35 Years",
    location: "Lucknow, UP",
    image: "/placeholder.svg",
    story: "Third generation artisan specializing in royal Zardozi work for bridal wear."
  },
  {
    id: 2,
    name: "Smt. Kamala Devi",
    craft: "Bandhani Dyeing",
    experience: "28 Years",
    location: "Jaipur, Rajasthan",
    image: "/placeholder.svg",
    story: "Expert in traditional Bandhani techniques, creating vibrant patterns."
  },
  {
    id: 3,
    name: "Ustad Ashraf Ali",
    craft: "Block Printing",
    experience: "42 Years",
    location: "Sanganer, Rajasthan",
    image: "/placeholder.svg",
    story: "Master block printer preserving ancient printing techniques."
  }
];

const heritageProcess = [
  {
    step: 1,
    title: "Design Creation",
    description: "Traditional patterns are sketched and refined by master designers",
    icon: Palette
  },
  {
    step: 2,
    title: "Material Selection",
    description: "Premium fabrics and authentic materials are carefully chosen",
    icon: Award
  },
  {
    step: 3,
    title: "Handcrafting",
    description: "Skilled artisans begin the meticulous handwork process",
    icon: Scissors
  },
  {
    step: 4,
    title: "Quality Check",
    description: "Each piece undergoes thorough quality inspection",
    icon: Star
  }
];

export default function HeritageWork() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-slate-700/90 to-gray-800/90 flex items-center mt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-gray-900/20" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
              Heritage Craftsmanship
            </h1>
            <p className="text-slate-100 text-xl mb-8">
              Preserving centuries-old traditions through masterful artisanship. 
              Each piece tells a story of cultural heritage and timeless beauty.
            </p>
            <Button size="lg" className="bg-gold hover:bg-gold/90">
              Explore Our Heritage
            </Button>
          </div>
        </div>
      </section>

      {/* Heritage Skills */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">
              Traditional Crafts
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our artisans master various traditional techniques, each requiring years of training and practice.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {heritageSkills.map((skill) => {
              const Icon = skill.icon;
              return (
                <Card key={skill.id} className="group hover:shadow-xl transition-all duration-300 border-gold/20">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                      <Icon className="h-10 w-10 text-gold" />
                    </div>
                    <CardTitle className="text-xl">{skill.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      {skill.description}
                    </p>
                    <div className="space-y-2">
                      {skill.techniques.map((technique, index) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-2">
                          {technique}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Heritage Products Showcase */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">
              Heritage Crafted Products
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our exquisite collection of heritage products, each piece lovingly crafted
              using traditional techniques and showcasing the finest artisanship.
            </p>
          </div>

          {/* Featured Heritage Products */}
          <ProductGrid products={allProducts.slice(0, 8)} />

          <div className="text-center mt-12">
            <Button size="lg" className="bg-gold hover:bg-gold/90 mr-4">
              Shop Heritage Collection
            </Button>
            <Button variant="outline" size="lg">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Heritage Process */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">
              Our Craft Process
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From concept to creation, every step is guided by traditional methods and modern quality standards.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {heritageProcess.map((process) => {
              const Icon = process.icon;
              return (
                <div key={process.step} className="text-center">
                  <div className="relative mb-6">
                    <div className="mx-auto w-16 h-16 bg-gold rounded-full flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {process.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{process.title}</h3>
                  <p className="text-muted-foreground">{process.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Artisan Stories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">
              Meet Our Master Artisans
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The hands behind our heritage. These master craftsmen have dedicated their lives to preserving traditional arts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {artisanStories.map((artisan) => (
              <Card key={artisan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-muted relative">
                  <img 
                    src={artisan.image} 
                    alt={artisan.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gold text-white">
                      <Clock className="h-3 w-3 mr-1" />
                      {artisan.experience}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{artisan.name}</h3>
                  <p className="text-gold font-medium mb-2">{artisan.craft}</p>
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {artisan.location}
                  </div>
                  <p className="text-muted-foreground text-sm">{artisan.story}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Values */}
      <section className="py-20 bg-gold/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-serif font-bold mb-8">
              Preserving Heritage for Future Generations
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-12">
              We believe in keeping traditional crafts alive by supporting artisan communities, 
              using authentic techniques, and creating pieces that honor our cultural heritage.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold mb-2">500+</div>
                <p className="text-muted-foreground">Artisans Supported</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold mb-2">25+</div>
                <p className="text-muted-foreground">Traditional Techniques</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold mb-2">50+</div>
                <p className="text-muted-foreground">Years of Experience</p>
              </div>
            </div>
            
            <Button size="lg" className="bg-gold hover:bg-gold/90">
              Support Our Artisans
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

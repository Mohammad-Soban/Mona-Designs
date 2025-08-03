import "./global.css";
import HeroVideo from "./components/ui/HeroVideo";
import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { CartSidebar } from "@/components/ui/cart-sidebar";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Sherwanis from "./pages/Sherwanis";
import Kurtas from "./pages/Kurtas";
import Suits from "./pages/Suits";
import Lehengas from "./pages/Lehengas";
import Collections from "./pages/Collections";
import NewArrivals from "./pages/NewArrivals";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import SizeGuide from "./pages/SizeGuide";
import Returns from "./pages/Returns";
import Wishlist from "./pages/Wishlist";
import Accessories from "./pages/Accessories";
import HeritageWork from "./pages/HeritageWork";
import Haldi from "./pages/occasions/Haldi";
import Wedding from "./pages/occasions/Wedding";
import Reception from "./pages/occasions/Reception";
import Mehendi from "./pages/occasions/Mehendi";
import Sangeet from "./pages/occasions/Sangeet";
import General from "./pages/occasions/General";
import Festivals from "./pages/occasions/Festivals";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Placeholder component for upcoming pages
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground">
          This page is coming soon. Continue building with Fusion!
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="mona-design-theme">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ScrollToTop />
                  <div className="min-h-screen flex flex-col">
                    <Navigation />
                    <main className="flex-1">
                      <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/new-arrivals" element={<NewArrivals />} />
                    <Route path="/sherwanis" element={<Sherwanis />} />
                    <Route path="/kurtas" element={<Kurtas />} />
                    <Route path="/suits" element={<Suits />} />
                    <Route path="/lehengas" element={<Lehengas />} />
                    <Route path="/collections" element={<Collections />} />
                        <Route path="/collections/haldi" element={<Haldi />} />
                        <Route
                          path="/collections/wedding"
                          element={<Wedding />}
                        />
                        <Route
                          path="/collections/reception"
                          element={<Reception />}
                        />
                        <Route
                          path="/collections/mehendi"
                          element={<Mehendi />}
                        />
                        <Route
                          path="/collections/sangeet"
                          element={<Sangeet />}
                        />
                        <Route
                          path="/collections/festivals"
                          element={<Festivals />}
                        />
                        <Route
                          path="/collections/general"
                          element={<General />}
                        />
                        <Route path="/accessories" element={<Accessories />} />
                        <Route
                          path="/heritage-work"
                          element={<HeritageWork />}
                        />
                        <Route
                          path="/cart"
                          element={<PlaceholderPage title="Shopping Cart" />}
                        />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                          path="/product/:id"
                          element={<ProductDetail />}
                        />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/size-guide" element={<SizeGuide />} />
                        <Route path="/returns" element={<Returns />} />
                        <Route path="/admin" element={<Admin />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                  <CartSidebar />
                </BrowserRouter>
              </TooltipProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

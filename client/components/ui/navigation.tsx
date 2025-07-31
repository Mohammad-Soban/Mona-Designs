import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Heart,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Sherwanis", href: "/sherwanis" },
  { name: "Kurtas", href: "/kurtas" },
  { name: "Suits", href: "/suits" },
  { name: "Lehengas", href: "/lehengas" },
  { name: "Collections", href: "/collections" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { toggleCart, getCartItemsCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { state: authState, logout } = useAuth();

  const handleWhatsAppClick = () => {
    const message = "Hi, there I am interested in buying products from you";
    const phoneNumber = "917435898915"; // +91 74358 98915
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <header className="fixed top-0 z-50 w-full">
      {/* Transparent navbar with glass effect */}
      <div className="bg-transparent backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Mobile Navbar Layout */}
            <div className="flex w-full items-center justify-between md:hidden">
              {/* Left side - Menu button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="text-gold hover:bg-gold/20 hover:text-gold border border-gold/30"
              >
                {isOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>

              {/* Center - Logo */}
              <Link to="/" className="flex items-center">
                <img
                  src="/static/images/logo.webp"
                  alt="Mona Designs Logo"
                  className="h-16 w-auto drop-shadow-lg"
                />
              </Link>

              {/* Right side - Actions */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleWhatsAppClick}
                  className="p-2 hover:bg-white/20 rounded-md transition-colors border border-white/20"
                  title="Contact us on WhatsApp"
                >
                  <MessageCircle className="h-4 w-4 text-gold" />
                </button>
                <div className="border border-gold/30 rounded-md">
                  <ThemeToggle />
                </div>
                <Link to="/wishlist">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-gold hover:bg-gold/20 hover:text-gold border border-gold/30"
                  >
                    <Heart className="h-4 w-4" />
                    {getWishlistCount() > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs"
                      >
                        {getWishlistCount()}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gold hover:bg-gold/20 hover:text-gold border border-gold/30"
                  onClick={toggleCart}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {getCartItemsCount() > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs"
                    >
                      {getCartItemsCount()}
                    </Badge>
                  )}
                </Button>
                {authState.isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gold hover:bg-gold/20 hover:text-gold border border-gold/30"
                      >
                        <User className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 bg-background/95 backdrop-blur-sm border-white/20"
                    >
                      <DropdownMenuLabel>
                        {authState.user?.name || "My Account"}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={logout}
                        className="flex items-center"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gold hover:bg-gold/20 hover:text-gold border border-gold/30"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex w-full items-center justify-between">
              {/* Logo for desktop */}
              <Link to="/" className="hidden md:flex items-center">
                <img
                  src="/static/images/logo.webp"
                  alt="Mona Designs Logo"
                  className="h-16 w-auto drop-shadow-lg"
                />
              </Link>

              {/* Navigation menu center */}
              <nav className="flex items-center space-x-8 mx-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm font-medium transition-colors text-gold hover:text-gold/80 drop-shadow-sm font-semibold"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Actions on right */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleWhatsAppClick}
                  className="p-2 hover:bg-white/20 rounded-md transition-colors border border-white/20"
                  title="Contact us on WhatsApp"
                >
                  <MessageCircle className="h-5 w-5 text-gold" />
                </button>
                <div className="border border-gold/30 rounded-md">
                  <ThemeToggle />
                </div>
                <Link to="/wishlist">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-gold hover:bg-gold/20 hover:text-gold border border-gold/30"
                  >
                    <Heart className="h-5 w-5" />
                    {getWishlistCount() > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
                      >
                        {getWishlistCount()}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gold hover:bg-gold/20 hover:text-gold border border-gold/30"
                  onClick={toggleCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {getCartItemsCount() > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
                    >
                      {getCartItemsCount()}
                    </Badge>
                  )}
                </Button>
                {authState.isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gold hover:bg-gold/20 hover:text-gold border border-gold/30"
                      >
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 bg-background/95 backdrop-blur-sm border-white/20"
                    >
                      <DropdownMenuLabel>
                        {authState.user?.name || "My Account"}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={logout}
                        className="flex items-center"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gold hover:bg-gold/20 hover:text-gold border border-gold/30"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation - Improved dropdown with glass effect */}
          <div
            className={cn(
              "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
              isOpen
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0 pointer-events-none",
            )}
          >
            <div className="py-4 space-y-2 border-t border-white/20 bg-black/30 backdrop-blur-md rounded-b-lg">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-sm font-medium transition-colors text-gold hover:text-gold/80 hover:bg-white/10 rounded-md mx-2 font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Heart,
  LogOut,
  MessageCircle,
  ChevronDown,
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
  {
    name: "Occasions",
    href: "#",
    dropdown: [
      { name: "Haldi", href: "/collections/haldi" },
      { name: "Wedding", href: "/collections/wedding" },
      { name: "Reception", href: "/collections/reception" },
      { name: "Mehendi", href: "/collections/mehendi" },
      { name: "Sangeet", href: "/collections/sangeet" },
      { name: "General", href: "/collections/general" },
    ],
  },
  {
    name: "Royal Wardrobe",
    href: "#",
    dropdown: [
      { name: "Kurtas", href: "/kurtas" },
      { name: "Sherwanis", href: "/sherwanis" },
      { name: "Suits", href: "/suits" },
      { name: "Lehengas", href: "/lehengas" },
    ],
  },
  { name: "Contact Us", href: "/contact" },
  { name: "Accessories", href: "/accessories" },
  { name: "Heritage Work", href: "/heritage-work" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState<Record<string, boolean>>({});
  const { toggleCart, getCartItemsCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { state: authState, logout } = useAuth();
  const location = useLocation();

  const handleWhatsAppClick = () => {
    const message = "Hi, there I am interested in buying products from you";
    const phoneNumber = "917435898915"; // +91 74358 98915
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const toggleMobileDropdown = (itemName: string) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const isActiveRoute = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
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
                {navigation.map((item) =>
                  item.dropdown ? (
                    <DropdownMenu key={item.name}>
                      <DropdownMenuTrigger asChild>
                        <button className="relative text-sm font-medium transition-colors text-gold hover:text-gold/80 drop-shadow-sm font-semibold flex items-center space-x-1 group">
                          <span className="relative">
                            {item.name}
                            <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full group-hover:left-0 transform -translate-x-1/2 group-hover:translate-x-0"></span>
                          </span>
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-48 bg-background/95 backdrop-blur-sm border-white/20 max-h-80 overflow-y-auto"
                      >
                        {item.dropdown.map((subItem) => (
                          <DropdownMenuItem key={subItem.name} asChild>
                            <Link
                              to={subItem.href}
                              className={cn(
                                "flex items-center",
                                isActiveRoute(subItem.href) ? "bg-gold/20 text-gold" : ""
                              )}
                            >
                              {subItem.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "relative text-sm font-medium transition-colors drop-shadow-sm font-semibold group",
                        isActiveRoute(item.href)
                          ? "text-gold"
                          : "text-gold hover:text-gold/80"
                      )}
                    >
                      <span className="relative">
                        {item.name}
                        <span className={cn(
                          "absolute bottom-0 left-0 h-0.5 bg-gold transition-all duration-300",
                          isActiveRoute(item.href)
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        )}></span>
                      </span>
                    </Link>
                  ),
                )}
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
            <div className="py-4 space-y-2 border-t border-white/20 bg-black/30 backdrop-blur-md rounded-b-lg max-h-80 overflow-y-auto">
              {navigation.map((item) =>
                item.dropdown ? (
                  <div key={item.name} className="mx-2">
                    <button
                      onClick={() => toggleMobileDropdown(item.name)}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-gold/80 font-semibold flex items-center justify-between hover:bg-white/10 rounded-md transition-colors"
                    >
                      {item.name}
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        mobileDropdowns[item.name] ? "rotate-180" : ""
                      )} />
                    </button>
                    <div className={cn(
                      "ml-4 space-y-1 transition-all duration-200 overflow-hidden",
                      mobileDropdowns[item.name] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}>
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className={cn(
                            "block px-3 py-2 text-sm font-medium transition-colors hover:text-gold/80 hover:bg-white/10 rounded-md",
                            isActiveRoute(subItem.href) ? "text-gold bg-gold/10" : "text-gold"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "block px-3 py-2 text-sm font-medium transition-colors hover:text-gold/80 hover:bg-white/10 rounded-md mx-2 font-semibold",
                      isActiveRoute(item.href) ? "text-gold bg-gold/10" : "text-gold"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

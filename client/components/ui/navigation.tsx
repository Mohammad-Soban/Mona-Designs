import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, ShoppingCart, User, Heart, LogOut, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Sherwanis", href: "/sherwanis" },
  { name: "Kurtas", href: "/kurtas" },
  { name: "Suits", href: "/suits" },
  { name: "Lehengas", href: "/lehengas" },
  { name: "Collections", href: "/collections" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { toggleCart, getCartItemsCount } = useCart()
  const { getWishlistCount } = useWishlist()
  const { state: authState, logout } = useAuth()

  const handleWhatsAppClick = () => {
    const message = "Hi, there I am interested in buying products from you"
    const phoneNumber = "917435898915" // +91 74358 98915
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/20 backdrop-blur-md supports-[backdrop-filter]:bg-background/10 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Navbar Layout */}
          <div className="flex w-full items-center justify-between md:hidden">
            {/* Menu on right */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="order-3 ml-auto"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

            {/* Centered Logo */}
            <Link to="/" className="order-1 flex items-center mx-auto">
              <img src="/static/images/logo.webp" alt="Mona Designs Logo" className="h-10 w-auto" />
            </Link>

            {/* WhatsApp and ThemeToggle after logo */}
            <div className="order-2 flex items-center space-x-2">
              <button
                onClick={handleWhatsAppClick}
                className="p-2 hover:bg-muted rounded-md transition-colors"
                title="Contact us on WhatsApp"
              >
                <MessageCircle className="h-5 w-5 text-green-600" />
              </button>
              <ThemeToggle />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex w-full items-center justify-between">
            {/* Logo for desktop */}
            <Link to="/" className="hidden md:flex items-center">
              <img src="/static/images/logo.webp" alt="Mona Designs Logo" className="h-18 w-auto" />
            </Link>

            {/* Navigation menu center */}
            <nav className="flex items-center space-x-8 mx-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions on right */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleWhatsAppClick}
                className="p-2 hover:bg-muted rounded-md transition-colors"
                title="Contact us on WhatsApp"
              >
                <MessageCircle className="h-5 w-5 text-green-600" />
              </button>
              <ThemeToggle />
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                  {getWishlistCount() > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                      {getWishlistCount()}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
                <ShoppingCart className="h-5 w-5" />
                {getCartItemsCount() > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                    {getCartItemsCount()}
                  </Badge>
                )}
              </Button>
              {authState.isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
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
                    <DropdownMenuItem onClick={logout} className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Actions */}
            <div className="flex items-center space-x-2 md:hidden">
              {/* Wishlist */}
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                  {getWishlistCount() > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                      {getWishlistCount()}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
                <ShoppingCart className="h-5 w-5" />
                {getCartItemsCount() > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                    {getCartItemsCount()}
                  </Badge>
                )}
              </Button>

              {/* User Account */}
              {authState.isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
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
                    <DropdownMenuItem onClick={logout} className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Cleaned up dropdown without duplicate buttons */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 ease-in-out",
            isOpen
              ? "max-h-64 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          )}
        >
          <div className="py-4 space-y-2 border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2 space-y-2">
              {authState.isAuthenticated ? (
                <div className="space-y-2">
                  <div className="text-sm text-center">
                    Welcome, {authState.user?.name || "Guest"}
                  </div>
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <Button className="w-full" variant="outline">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button className="w-full" variant="outline" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full" variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    Login / Sign Up
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

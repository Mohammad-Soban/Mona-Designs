import { Link } from "react-router-dom"
import { Instagram, Twitter, Linkedin, Mail, Phone } from "lucide-react"
import { ScrollToTopLink } from "./scroll-to-top-link"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-gold to-amber-600 text-primary-foreground">
                <span className="text-sm font-bold">M</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight leading-none">
                  MONA DESIGNERS
                </span>
                <span className="text-xs text-muted-foreground">
                  Ethnic Fashion
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Discover exquisite ethnic wear for weddings and traditional celebrations.
              From elegant sherwanis to stunning lehengas, we bring you premium quality
              traditional fashion that celebrates Indian heritage.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><ScrollToTopLink to="/sherwanis" className="text-muted-foreground hover:text-primary transition-colors">Sherwanis</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/kurtas" className="text-muted-foreground hover:text-primary transition-colors">Kurtas</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/suits" className="text-muted-foreground hover:text-primary transition-colors">Suits</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/lehengas" className="text-muted-foreground hover:text-primary transition-colors">Lehengas</ScrollToTopLink></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><ScrollToTopLink to="/collections" className="text-muted-foreground hover:text-primary transition-colors">Collections</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/size-guide" className="text-muted-foreground hover:text-primary transition-colors">Size Guide</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/returns" className="text-muted-foreground hover:text-primary transition-colors">Returns</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</ScrollToTopLink></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@monadesigners.com</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 Mona Designers. All rights reserved. | Ethnic Fashion for Every Celebration</p>
        </div>
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom';
import { Building2, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">HomesAway</span>
            </Link>
            <p className="mt-4 text-muted-foreground text-sm">
              Helping students find the perfect accommodation in a new city with smart locality insights.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/listings"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link
                  to="/localities"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  Explore Localities
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/help"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/safety"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  Safety Guide
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  Student Living Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact and Social */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground text-sm">
                Email: support@homesaway.com
              </li>
              <li className="text-muted-foreground text-sm">
                Phone: 8584832125
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} HomesAway. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
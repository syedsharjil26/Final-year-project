import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from '@/components/theme/ModeToggle';
import { Search, Menu, X, Home, Building2, LogOut, User, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Track scroll position to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Get the initials for the avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Generate dashboard link based on user role
  const getDashboardLink = () => {
    const roleToDashboardMap: Record<string, string> = {
      student: '/student-dashboard',
      homeowner: '/homeowner-dashboard',
      admin: '/admin-dashboard',
    };
    if (user && user.role) {
      return roleToDashboardMap[user.role] || '/login';
    }
    return '/login';
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-sm shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">HomesAway</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Home
          </Link>
          <Link
            to="/listings"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              location.pathname.startsWith('/listings') ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Listings
          </Link>
          <Link
            to="/localities"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              location.pathname.startsWith('/localities') ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Localities
          </Link>
          <Link
            to="/map-explorer"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              location.pathname === '/map-explorer' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Map Explorer
          </Link>
          <Link
            to="/about"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              location.pathname === '/about' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            About
          </Link>
        </nav>

        {/* Theme toggle */}
        <ModeToggle />

        {/* User menu or Login/Register */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
                <span className="text-xs text-muted-foreground capitalize">
                  {user.role}
                </span>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={getDashboardLink()} className="w-full cursor-pointer">
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="w-full cursor-pointer">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onClick={logout}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>
        )}

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t py-4">
          <div className="container space-y-4 px-4">
            <Link
              to="/"
              className="flex items-center space-x-2 p-2 hover:bg-secondary rounded-md"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/listings"
              className="flex items-center space-x-2 p-2 hover:bg-secondary rounded-md"
            >
              <Building2 className="h-5 w-5" />
              <span>Listings</span>
            </Link>
            <Link
              to="/localities"
              className="flex items-center space-x-2 p-2 hover:bg-secondary rounded-md"
            >
              <Search className="h-5 w-5" />
              <span>Localities</span>
            </Link>
            <Link
              to="/map-explorer"
              className="flex items-center space-x-2 p-2 hover:bg-secondary rounded-md"
            >
              <MapPin className="h-5 w-5" />
              <span>Map Explorer</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center space-x-2 p-2 hover:bg-secondary rounded-md"
            >
              <User className="h-5 w-5" />
              <span>About</span>
            </Link>
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="flex items-center space-x-2 p-2 hover:bg-secondary rounded-md"
                >
                  <User className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Log out</span>
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
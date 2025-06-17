import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockListings, mockLocalityAura } from '@/lib/mockData';
import { PropertyCard } from '@/components/property/PropertyCard';
import { LocalityAuraCard } from '@/components/property/LocalityAuraCard';
import { useAuth } from '@/contexts/AuthContext';
import { Search, MapPin, Compass, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredListings] = useState(mockListings.slice(0, 3));
  const [savedListingIds, setSavedListingIds] = useState<string[]>([]);

  // Get saved listings from localStorage for the current user
  useEffect(() => {
    if (user) {
      const savedListings = localStorage.getItem(`savedListings-${user.id}`);
      if (savedListings) {
        setSavedListingIds(JSON.parse(savedListings));
      }
    }
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSaveListing = (listingId: string) => {
    if (!user) return;

    setSavedListingIds(prev => {
      const isAlreadySaved = prev.includes(listingId);
      const newSavedListings = isAlreadySaved
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId];
      
      // Save to localStorage
      localStorage.setItem(`savedListings-${user.id}`, JSON.stringify(newSavedListings));
      return newSavedListings;
    });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-r from-primary/5 to-primary/10 flex items-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=1500"
            alt="Student apartment"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              Find Your Perfect Student Home
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
              Discover student-friendly accommodations with smart locality insights to make your college experience the best it can be.
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex w-full max-w-lg gap-2">
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by city, locality or university..."
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-12">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How HomesAway Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-muted-foreground">
                Browse our listings to find the perfect student accommodation that meets your needs and budget.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Compass className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Explore</h3>
              <p className="text-muted-foreground">
                Discover neighborhoods with our Locality Aura scores to find safe, affordable, and student-friendly areas.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book</h3>
              <p className="text-muted-foreground">
                Connect with property owners directly and secure your new student home with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Listings */}
      <section className="py-16 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Listings</h2>
            <Button variant="outline" asChild>
              <Link to="/listings">View All Listings</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map(listing => (
              <PropertyCard
                key={listing.id}
                listing={listing}
                isSaved={savedListingIds.includes(listing.id)}
                onSave={handleSaveListing}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Locality Insights */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Popular Localities</h2>
            <Button variant="outline" asChild>
              <Link to="/localities">Explore All Localities</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockLocalityAura.slice(0, 3).map(aura => (
              <Link key={aura.locality} to={`/localities/${aura.locality}`}>
                <LocalityAuraCard aura={aura} className="h-full transition-transform hover:scale-[1.02]" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              {user?.role === 'homeowner' ? 'List Your Property Today' : 'Find Your Dream Student Home'}
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/80">
              {user?.role === 'homeowner' 
                ? 'Connect with thousands of students looking for quality accommodation.' 
                : 'Join thousands of students who found their perfect accommodation with HomesAway.'}
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              asChild
            >
              <Link to={user?.role === 'homeowner' ? '/homeowner-dashboard/add-listing' : '/listings'}>
                {user?.role === 'homeowner' ? 'Add Your Listing' : 'Start Searching'}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
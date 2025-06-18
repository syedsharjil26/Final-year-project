import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { PropertyCard } from '@/components/property/PropertyCard';
import { useAuth } from '@/contexts/AuthContext';
import { Listing } from '@/types';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

export default function ListingsPage() {
  const location = useLocation();
  const { user } = useAuth();
  
  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [bedrooms, setBedrooms] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [originalListings, setOriginalListings] = useState<Listing[]>([]); // New state for original listings
  const [loading, setLoading] = useState<boolean>(true);
  const [listings, setListings] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [amenityFilters, setAmenityFilters] = useState<string[]>([]);

  // Fetch listings from Supabase
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('listings').select('*');
      if (!error && data) {
        setListings(data);
        const listingsWithPlaceholders = data.map(listing => ({
          id: listing.id,
          title: listing.title || 'Untitled Listing',
          description: listing.description || 'No description provided.',
          price: typeof listing.price === 'number' ? listing.price : 0,
          bedrooms: typeof listing.bedrooms === 'number' ? listing.bedrooms : 1,
          location: listing.location || 'Unknown Location',
          locality: listing.locality || 'Unknown Locality',
          images: Array.isArray(listing.images) ? listing.images : [],
          amenities: Array.isArray(listing.amenities) ? listing.amenities : [],
          owner: {
            id: listing.owner?.id || '',
            name: listing.owner?.name || 'Unknown Owner',
            avatar: listing.owner?.avatar || undefined,
          },
          views: typeof listing.views === 'number' ? listing.views : 0,
          saves: typeof listing.saves === 'number' ? listing.saves : 0,
        }));
        setOriginalListings(listingsWithPlaceholders);
      }
      setLoading(false);
      console.log('Fetched listings:', data); // Debug: check if listings are fetched
    };

    fetchListings();
  }, []);

  // Get saved listings from localStorage for the current user
  useEffect(() => {
    if (user) {
      const savedListings = localStorage.getItem(`savedListings-${user.id}`);
      if (savedListings) {
        // setSavedListingIds(JSON.parse(savedListings));
      }
    }
  }, [user]);

  // Apply filters when dependencies change
  useEffect(() => {
    let results = [...originalListings]; // Use originalListings instead of filteredListings
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(listing => 
        listing.title.toLowerCase().includes(query) || 
        listing.location.toLowerCase().includes(query) || 
        listing.locality.toLowerCase().includes(query) || 
        listing.description.toLowerCase().includes(query)
      );
    }
    
    // Apply price range filter
    if (priceRange[0] > 0 || priceRange[1] < 2000) {
      results = results.filter(listing => 
        listing.price >= priceRange[0] && listing.price <= priceRange[1]
      );
    }
    
    // Apply bedrooms filter
    if (bedrooms.length > 0) {
      results = results.filter(listing => bedrooms.includes(listing.bedrooms));
    }
    
    // Apply amenities filter
    if (selectedAmenities.length > 0) {
      results = results.filter(listing => 
        selectedAmenities.every(amenity => 
          listing.amenities?.includes(amenity)
        )
      );
    }
  }, [searchQuery, priceRange, bedrooms, selectedAmenities, originalListings]);

  // Only one declaration of filteredListings using useMemo
  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      // Search filter
      const matchesSearch =
        search === '' ||
        listing.title.toLowerCase().includes(search.toLowerCase()) ||
        listing.description.toLowerCase().includes(search.toLowerCase());
      // Location filter
      const matchesLocation =
        !selectedLocation || listing.location === selectedLocation;
      // Price filter
      const price = Number(listing.price);
      const matchesMin = !minPrice || price >= Number(minPrice);
      const matchesMax = !maxPrice || price <= Number(maxPrice);
      // Amenities filter
      const matchesAmenities =
        amenityFilters.length === 0 ||
        amenityFilters.every(a => listing.amenities?.includes(a));
      return matchesSearch && matchesLocation && matchesMin && matchesMax && matchesAmenities;
    });
  }, [listings, search, selectedLocation, minPrice, maxPrice, amenityFilters]);

  // Split filtered listings
  const featuredListings = filteredListings.filter(l => l.featured);
  const normalListings = filteredListings.filter(l => !l.featured);

  // Get unique locations from listings
  const locationOptions = useMemo(() => {
    const locs = new Set(listings.map(l => l.location).filter(Boolean));
    return Array.from(locs);
  }, [listings]);

  // Amenities list (can be static or dynamic)
  const allAmenities = [
    'WiFi', 'Laundry', 'Kitchen', 'Parking', 'Gym', 'Bills Included', 'Bike Storage', 'Study Desk', 'Balcony', 'Garden', 'AC'
  ];

  const clearFilters = () => {
    setPriceRange([0, 2000]);
    setBedrooms([]);
    setSelectedAmenities([]);
    setSearchQuery('');
  };

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden md:block w-full md:w-72 shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 sticky top-8">
            <h2 className="text-lg font-bold mb-4">Filters</h2>
            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Search</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Search by title or description"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {/* Location */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Location</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
              >
                <option value="">All</option>
                {locationOptions.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Price Range (₹)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="w-1/2 border rounded px-3 py-2"
                  placeholder="Min"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  min={0}
                />
                <input
                  type="number"
                  className="w-1/2 border rounded px-3 py-2"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  min={0}
                />
              </div>
            </div>
            {/* Amenities */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Amenities</label>
              <div className="grid grid-cols-2 gap-2">
                {allAmenities.map(a => (
                  <label key={a} className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox text-blue-600 border-gray-400 focus:ring-blue-500 h-4 w-4"
                      checked={amenityFilters.includes(a)}
                      onChange={e => {
                        setAmenityFilters(prev =>
                          e.target.checked
                            ? [...prev, a]
                            : prev.filter(x => x !== a)
                        );
                      }}
                    />
                    <span className="text-gray-800 dark:text-gray-200">{a}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={clearFilters}>Clear Filters</Button>
          </div>
        </aside>
        {/* Mobile Filter Sheet */}
        <div className="md:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" /> Filters</Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 max-w-full">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Search</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Search by title or description"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Location</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={selectedLocation}
                    onChange={e => setSelectedLocation(e.target.value)}
                  >
                    <option value="">All</option>
                    {locationOptions.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Price Range (₹)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="w-1/2 border rounded px-3 py-2"
                      placeholder="Min"
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      min={0}
                    />
                    <input
                      type="number"
                      className="w-1/2 border rounded px-3 py-2"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      min={0}
                    />
                  </div>
                </div>
                {/* Amenities */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Amenities</label>
                  <div className="grid grid-cols-2 gap-2">
                    {allAmenities.map(a => (
                      <label key={a} className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          className="form-checkbox text-blue-600 border-gray-400 focus:ring-blue-500 h-4 w-4"
                          checked={amenityFilters.includes(a)}
                          onChange={e => {
                            setAmenityFilters(prev =>
                              e.target.checked
                                ? [...prev, a]
                                : prev.filter(x => x !== a)
                            );
                          }}
                        />
                        <span className="text-gray-800 dark:text-gray-200">{a}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="outline" className="w-full mt-4" onClick={clearFilters}>Clear Filters</Button>
                  </SheetClose>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {/* Listings Content */}
        <main className="flex-1">
          {/* Featured Listings Section */}
          {featuredListings.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-yellow-500">⭐</span> Featured Listings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredListings.map(listing => (
                  <div key={listing.id} className="relative">
                    <Badge className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 font-bold z-10">Featured</Badge>
                    <PropertyCard listing={listing} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Normal Listings Section */}
          <h2 className="text-2xl font-bold mb-4">All Listings</h2>
          {loading ? (
            <div>Loading listings...</div>
          ) : normalListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {normalListings.map(listing => (
                <PropertyCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No Listings Found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any listings matching your search criteria.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
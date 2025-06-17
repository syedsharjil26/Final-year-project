import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Listing } from '@/types';
import { Button } from '@/components/ui/button';
import { Star, Map, Grid, List } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StudentSavedListingsProps {
  savedListings: Listing[];
  onSave: (listingId: string) => void;
}

export default function StudentSavedListings({ savedListings, onSave }: StudentSavedListingsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  
  // Sort listings
  const sortedListings = [...savedListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'bedrooms':
        return b.bedrooms - a.bedrooms;
      case 'popularity':
        return b.views - a.views;
      case 'recent':
      default:
        return 0; // Use original order for 'recent'
    }
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Saved Listings</h1>
        <Button asChild>
          <Link to="/listings">Browse More Listings</Link>
        </Button>
      </div>
      
      {/* Control bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <span className="text-muted-foreground mr-2">{savedListings.length} listings saved</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Saved</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="bedrooms">Most Bedrooms</SelectItem>
              <SelectItem value="popularity">Most Popular</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-r-none"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Listings */}
      {savedListings.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedListings.map(listing => (
              <PropertyCard
                key={listing.id}
                listing={listing}
                isSaved={true}
                onSave={onSave}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedListings.map(listing => (
              <div key={listing.id} className="flex flex-col md:flex-row gap-4 border rounded-lg overflow-hidden bg-card">
                <div className="md:w-1/3 h-52 md:h-auto relative">
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                    ${listing.price}/mo
                  </div>
                </div>
                <div className="flex-1 p-4 flex flex-col">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{listing.title}</h3>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => onSave(listing.id)}
                      aria-label="Remove from saved"
                    >
                      <Star className="h-4 w-4 fill-primary text-primary" />
                    </Button>
                  </div>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <Map className="h-4 w-4 mr-1" />
                    <span className="text-sm">{listing.location}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-auto">
                    {listing.description}
                  </p>
                  <div className="mt-4">
                    <Button asChild>
                      <Link to={`/listings/${listing.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-xl font-semibold mb-2">No Saved Listings</h3>
          <p className="text-muted-foreground mb-6">
            You haven't saved any listings yet. Browse our listings and save the ones you like.
          </p>
          <Button asChild>
            <Link to="/listings">Browse Listings</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
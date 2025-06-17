import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Listing } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  Bed, 
  MapPin, 
  Eye, 
  Star, 
  StarOff,
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PropertyCardProps {
  listing: Listing;
  isSaved?: boolean;
  onSave?: (listingId: string) => void;
  className?: string;
}

export function PropertyCard({ listing, isSaved = false, onSave, className }: PropertyCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('You must be logged in to save listings');
      navigate('/login');
      return;
    }
    
    if (onSave) {
      onSave(listing.id);
      toast.success(isSaved ? 'Removed from saved listings' : 'Added to saved listings');
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  return (
    <Card 
      className={cn("overflow-hidden transition-all duration-300 h-full", 
        isHovered ? "shadow-lg" : "shadow-md",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/property/${listing.id}`} className="block h-full">
        <div className="relative aspect-video">
          {/* Image gallery */}
          <img
            src={listing.images[currentImageIndex] || '/placeholder-image.png'}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-300"
            onError={e => (e.currentTarget.src = '/placeholder-image.png')}
          />
          
          {/* Image navigation controls (only show on hover) */}
          {isHovered && listing.images.length > 1 && (
            <>
              <Button 
                size="icon"
                variant="ghost" 
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 hover:bg-background/90"
                onClick={prevImage}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                size="icon"
                variant="ghost" 
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 hover:bg-background/90"
                onClick={nextImage}
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {listing.images.map((_, idx) => (
                  <span 
                    key={idx} 
                    className={cn(
                      "h-1.5 rounded-full",
                      idx === currentImageIndex 
                        ? "w-6 bg-primary" 
                        : "w-1.5 bg-primary/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Price tag */}
          <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
            ${listing.price}/mo
          </div>
          
          {/* Save button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/70 hover:bg-background/90"
            onClick={handleSave}
            aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
          >
            {isSaved ? (
              <Star className="h-4 w-4 fill-primary text-primary" />
            ) : (
              <StarOff className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="p-4">
          <div className="mb-2 flex justify-between items-start">
            <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
          </div>
          
          <div className="flex items-center text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm line-clamp-1">{listing.location}</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm mb-3">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1.5" />
              <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1.5" />
              <span>{listing.views} views</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {listing.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{listing.amenities.length - 3} more
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {listing.description}
          </p>
          
          {/* Contact Landlord Button */}
          <Button
            className="w-full mt-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!user || !user.role) {
                toast.error('Please log in to contact the landlord');
                navigate('/login');
                return;
              }

              const redirectPath = '/message-center';
              navigate(redirectPath);
            }}
          >
            Contact Landlord
          </Button>
        </div>
      </Link>
    </Card>
  );
}
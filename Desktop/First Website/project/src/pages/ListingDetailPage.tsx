import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Check, 
  Star,
  StarOff,
  ArrowLeft 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) {
        toast.error('Listing not found');
        navigate('/listings');
        return;
      }
      setListing(data);
      setLoading(false);
      document.title = `${data.title} | HomesAway`;
    };
    fetchListing();
    return () => {
      document.title = 'HomesAway Student Accommodation Platform';
    };
  }, [id, navigate]);

  useEffect(() => {
    if (!listing) return;

    // Check if listing is saved
    if (user) {
      const savedListings = localStorage.getItem(`savedListings-${user.id}`);
      if (savedListings) {
        const savedIds = JSON.parse(savedListings);
        setIsSaved(savedIds.includes(id));
      }
    }
    
    // Update views (in a real app, this would be an API call)
    const updatedListing = { ...listing, views: listing.views + 1 };
    setListing(updatedListing);
  }, [listing, id, user]);

  const handleSaveToggle = () => {
    if (!user) {
      toast.error('You must be logged in to save listings');
      navigate('/login');
      return;
    }
    
    const savedListings = localStorage.getItem(`savedListings-${user.id}`);
    let savedIds = savedListings ? JSON.parse(savedListings) : [];
    
    if (isSaved) {
      savedIds = savedIds.filter((savedId: string) => savedId !== id);
      toast.success('Removed from saved listings');
    } else {
      savedIds.push(id);
      toast.success('Added to saved listings');
    }
    
    localStorage.setItem(`savedListings-${user.id}`, JSON.stringify(savedIds));
    setIsSaved(!isSaved);
  };
  
  const nextImage = () => {
    if (!listing) return;
    setCurrentImageIndex((prev) => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevImage = () => {
    if (!listing) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!listing) {
    return null; // Will navigate away in useEffect
  }
  
  const handleInquiry = () => {
    if (!user) {
      toast.error('You must be logged in to contact homeowners');
      navigate('/login');
      return;
    }
    
    toast.success('Your inquiry has been sent to the homeowner');
  };
  
  return (
    <div className="container px-4 md:px-6 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="pl-0">
          <Link to="/listings" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Listings
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Title and Save Button */}
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{listing.title}</h1>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={handleSaveToggle}
              aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
            >
              {isSaved ? (
                <Star className="h-5 w-5 fill-primary text-primary" />
              ) : (
                <StarOff className="h-5 w-5" />
              )}
            </Button>
          </div>
          
          {/* Location */}
          <div className="flex items-center text-lg text-muted-foreground mb-6">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{listing.location}</span>
          </div>
          
          {/* Image Gallery */}
          <div className="relative rounded-lg overflow-hidden mb-8">
            <div className="aspect-[16/9] bg-muted">
              <img
                src={listing.images[currentImageIndex]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image navigation controls */}
            <Button 
              size="icon"
              variant="ghost" 
              className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 hover:bg-background/90"
              onClick={prevImage}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button 
              size="icon"
              variant="ghost" 
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 hover:bg-background/90"
              onClick={nextImage}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            
            {/* Image counter */}
            <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {listing.images.length}
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-2 mb-8">
            {Array.isArray(listing.images) && listing.images.map((image: string, index: number) => (
              <button
                key={index}
                className={`aspect-[4/3] rounded-md overflow-hidden border-2 ${
                  index === currentImageIndex ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          
          {/* Key Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <div className="text-2xl font-semibold mb-1">${listing.price}</div>
              <div className="text-sm text-muted-foreground">per month</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <div className="text-2xl font-semibold mb-1">{listing.bedrooms}</div>
              <div className="text-sm text-muted-foreground">
                {listing.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <div className="text-2xl font-semibold mb-1">{listing.views}</div>
              <div className="text-sm text-muted-foreground">Views</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <div className="text-2xl font-semibold mb-1">{listing.saves}</div>
              <div className="text-sm text-muted-foreground">Saves</div>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-muted-foreground whitespace-pre-line">
              {listing.description}
            </p>
          </div>
          
          {/* Amenities */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.isArray(listing.amenities) && listing.amenities.map((amenity: string, index: number) => (
                <div key={index} className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-primary" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Contact Homeowner</h2>
            
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                <img 
                  src={listing.owner.avatar || "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150"} 
                  alt={listing.owner.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-semibold">{listing.owner.name}</div>
                <div className="text-sm text-muted-foreground">Homeowner</div>
              </div>
            </div>
            
            <Button className="w-full mb-4" onClick={handleInquiry}>
              Send Message
            </Button>
            
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Phone number will be shared after booking</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Email will be shared after booking</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Typically responds within 24 hours</span>
              </div>
            </div>
          </div>
          
          {/* Locality Aura Card */}
          {/* {localityAura && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Locality Insights</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/localities/${listing.locality}`} className="flex items-center gap-1">
                    <ExternalLink className="h-4 w-4" />
                    <span className="text-sm">Details</span>
                  </Link>
                </Button>
              </div>
              <LocalityAuraCard aura={localityAura} />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
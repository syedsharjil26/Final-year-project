import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  MapPin,
  Bed,
  Home,
  Phone,
  Mail,
  User,
  Plus,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { usePropertyContext } from '@/contexts/PropertyContext';
import { mockListings } from '@/lib/mockData';

interface PropertyData {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  images: string[];
  amenities: string[];
  owner_id: string;
  owner?: {
    name: string;
    email: string;
    phone: string;
  };
}

function isValidUUID(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setSelectedProperty } = usePropertyContext();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      // If id is not a valid UUID, treat as mock
      if (!isValidUUID(id)) {
        const mock = mockListings.find(l => l.id === id);
        if (!mock) {
          setError('Mock property not found');
          setProperty(null);
        } else {
          setProperty(mock as any);
        }
        setLoading(false);
        return;
      }

      // Real listing from Supabase
      try {
        const { data, error: propertyError } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();
        if (propertyError) throw propertyError;
        if (!data) throw new Error('Property not found');

        // Try to fill missing fields from mockListings (by title)
        const mock = mockListings.find(l => l.title === data.title);
        const merged = { ...mock, ...data };
        setProperty(merged as any);
        setSelectedProperty({
          id: merged.id,
          ownerId: merged.owner_id || merged.owner?.id || '',
          ownerName: merged.owner?.name || '',
          title: merged.title,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load property details');
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyDetails();
  }, [id]);

  const handleContactClick = async () => {
    if (!user) {
      toast.error('Please log in to contact the landlord');
      navigate('/login');
      return;
    }

    if (!property) return;

    try {
      // Check if a conversation already exists
      const { data: existingConversation, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_id', user.id)
        .eq('receiver_id', property.owner_id)
        .eq('property_id', property.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      // Create a new conversation if it doesn't exist
      if (!existingConversation) {
        const { error: insertError } = await supabase.from('messages').insert({
          sender_id: user.id,
          receiver_id: property.owner_id,
          property_id: property.id,
          content: `Hi, I'm interested in your property: ${property.title}`,
          status: 'unread',
        });

        if (insertError) throw insertError;
      }

      // Determine user role and redirect accordingly
      const userRole = user.role; // Assuming role is available in the user object
      const redirectPath =
        userRole === 'homeowner'
          ? '/dashboard/homeowner/messages'
          : '/dashboard/student/messages';

      navigate(redirectPath);
    } catch (err) {
      console.error('Error initiating conversation:', err);
      toast.error('Failed to start conversation. Please try again.');
    }
  };

  const handleMessageOwner = () => {
    if (!user || user.role !== 'student' || !property) return;
    setSelectedProperty({
      id: property.id,
      ownerId: property.owner_id,
      ownerName: property.owner?.name || '',
      title: property.title,
    });
    navigate('/message-center');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || 'Failed to load property details'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Image */}
      <div className="mb-8">
        <img
          src={property.images?.[0] || '/placeholder.png'}
          alt={property.title}
          className="w-full max-h-[500px] object-cover rounded-lg"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.location}</span>
            </div>
          </div>

          <Separator />

          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms} Bedrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Student Housing</span>
            </div>
          </div>

          {/* Price */}
          <div>
            <h2 className="text-2xl font-bold">₹{property.price}/month</h2>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold mb-2">About this property</h3>
            <p className="text-muted-foreground">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Contact Landlord</h3>
            {property?.owner && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{property.owner.name}</p>
                    <p className="text-sm text-muted-foreground">Property Owner</p>
                  </div>
                </div>
                {property.owner.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <p>{property.owner.phone}</p>
                  </div>
                )}
                {property.owner.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <p>{property.owner.email}</p>
                  </div>
                )}
                <Button className="w-full" onClick={handleContactClick}>
                  Message Landlord
                </Button>
              </div>
            )}
          </Card>
          {user?.role === 'student' && (
            <Button onClick={handleMessageOwner} className="mt-4 w-full bg-green-600 text-white">
              Message Owner
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Listing } from '@/types';
import { Card } from '@/components/ui/card';

export default function MyListingsPage() {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchMyListings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', user.id);
      if (error) {
        setMyListings([]);
      } else {
        setMyListings(data || []);
      }
      setLoading(false);
    };
    fetchMyListings();
  }, [user]);

  if (!user) return <div>Please log in to view your listings.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Listings</h1>
      {loading ? (
        <div>Loading...</div>
      ) : myListings.length === 0 ? (
        <Card className="p-8 text-center">You have not added any listings yet.</Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {myListings.map(listing => (
            <PropertyCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

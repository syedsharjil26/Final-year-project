import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProfileCard } from '@/components/ui/ProfileCard';
import { supabase } from '@/lib/supabaseClient';

export default function ProfilePage() {
  const { user } = useAuth();
  const [listingCount, setListingCount] = useState<number>(0);
  const [savedCount, setSavedCount] = useState<number>(0);

  useEffect(() => {
    if (!user) return;
    if (user.role === 'homeowner') {
      // Fetch listing count for homeowner
      supabase
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', user.id)
        .then(({ count }) => setListingCount(count || 0));
    } else if (user.role === 'student') {
      // Get saved properties count from localStorage
      const saved = localStorage.getItem(`savedListings-${user.id}`);
      setSavedCount(saved ? JSON.parse(saved).length : 0);
    }
  }, [user]);
  
  // Redirect to the appropriate dashboard based on user role
  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'student':
        return '/student-dashboard';
      case 'homeowner':
        return '/homeowner-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/login';
    }
  };

  if (!user) {
    return (
      <div className="container py-12 px-4 md:px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>Please log in to view your profile.</p>
        <Button asChild className="mt-4">
          <Link to="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" size="sm" asChild className="pl-0 mb-6">
          <Link to={getDashboardLink()} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </Button>
        <ProfileCard user={user} listingCount={listingCount} savedCount={savedCount} />
      </div>
    </div>
  );
}
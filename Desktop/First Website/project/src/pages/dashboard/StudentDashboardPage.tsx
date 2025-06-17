import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockListings, mockLocalityAura } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { PropertyCard } from '@/components/property/PropertyCard';
import { LocalityAuraCard } from '@/components/property/LocalityAuraCard';
import {
  Home,
  Star,
  Settings,
  MessageSquare,
  Bell,
  PlusCircle,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

// Student Dashboard Components
import StudentSavedListings from './student/StudentSavedListings';
import StudentMessages from './student/StudentMessages';
import StudentNotifications from './student/StudentNotifications';
import StudentSettings from './student/StudentSettings';

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get saved listings from localStorage
  const [savedListingIds, setSavedListingIds] = useState<string[]>([]);
  const [savedListings, setSavedListings] = useState<any[]>([]);
  
  // Mock messages and notifications count
  const [messagesCount] = useState(3);
  const [notificationsCount] = useState(2);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Get saved listings from localStorage
    const saved = localStorage.getItem(`savedListings-${user.id}`);
    const savedIds = saved ? JSON.parse(saved) : [];
    setSavedListingIds(savedIds);
    
    // Get the actual listings
    const listings = savedIds.map((id: string) => mockListings.find(l => l.id === id)).filter(Boolean);
    setSavedListings(listings);
    
    // Set document title
    document.title = 'Student Dashboard | HomesAway';
    
    return () => {
      document.title = 'HomesAway Student Accommodation Platform';
    };
  }, [user, navigate]);
  
  const handleSaveListing = (listingId: string) => {
    if (!user) return;

    setSavedListingIds(prev => {
      const isAlreadySaved = prev.includes(listingId);
      const newSavedListings = isAlreadySaved
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId];
      
      // Save to localStorage
      localStorage.setItem(`savedListings-${user.id}`, JSON.stringify(newSavedListings));
      
      // Update saved listings
      const listings = newSavedListings
        .map(id => mockListings.find(l => l.id === id))
        .filter(Boolean);
      setSavedListings(listings);
      
      return newSavedListings;
    });
  };
  
  // Get recommended localities (sample data)
  const recommendedLocalities = mockLocalityAura
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
  
  // Get newest listings (sample data)
  const newestListings = [...mockListings]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  
  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-lg">{user?.name}</h2>
              <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <Button 
              variant={activeTab === 'overview' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('overview')}
            >
              <Home className="h-5 w-5 mr-2" />
              Dashboard
            </Button>
            <Button 
              variant={activeTab === 'saved' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('saved')}
            >
              <Star className="h-5 w-5 mr-2" />
              Saved Listings
              {savedListingIds.length > 0 && (
                <span className="ml-auto bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">
                  {savedListingIds.length}
                </span>
              )}
            </Button>
            <Button 
              variant={activeTab === 'messages' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('messages')}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Messages
              {messagesCount > 0 && (
                <span className="ml-auto bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">
                  {messagesCount}
                </span>
              )}
            </Button>
            <Button 
              variant={activeTab === 'notifications' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="h-5 w-5 mr-2" />
              Notifications
              {notificationsCount > 0 && (
                <span className="ml-auto bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">
                  {notificationsCount}
                </span>
              )}
            </Button>
            <Button 
              variant={activeTab === 'settings' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </Button>
            
            <Separator className="my-4" />
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={logout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </nav>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="space-y-6">
            {/* Overview */}
            {activeTab === 'overview' && (
              <>
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Student Dashboard</h1>
                  <Button asChild>
                    <Link to="/listings">Browse Listings</Link>
                  </Button>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Saved Listings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{savedListingIds.length}</div>
                      <p className="text-xs text-muted-foreground">
                        Properties you're interested in
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{messagesCount}</div>
                      <p className="text-xs text-muted-foreground">
                        From property owners
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Search History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">
                        Recent searches and filters
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Saved Listings Preview */}
                <h2 className="text-xl font-semibold mt-8">Your Saved Listings</h2>
                {savedListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedListings.slice(0, 3).map(listing => (
                      <PropertyCard
                        key={listing.id}
                        listing={listing}
                        isSaved={true}
                        onSave={handleSaveListing}
                      />
                    ))}
                    {savedListings.length > 3 && (
                      <Card className="flex flex-col items-center justify-center p-6 text-center h-full border-dashed cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => setActiveTab('saved')}
                      >
                        <PlusCircle className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="font-medium">View All Saved Listings</p>
                        <p className="text-sm text-muted-foreground">
                          You have {savedListings.length} saved properties
                        </p>
                      </Card>
                    )}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <Star className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Saved Listings Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start browsing and save properties you're interested in to see them here.
                    </p>
                    <Button asChild>
                      <Link to="/listings">Browse Listings</Link>
                    </Button>
                  </Card>
                )}
                
                {/* Recommended Localities */}
                <h2 className="text-xl font-semibold mt-8">Recommended Localities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendedLocalities.map(locality => (
                    <Link key={locality.locality} to={`/localities/${locality.locality}`}>
                      <LocalityAuraCard 
                        aura={locality} 
                        className="h-full transition-transform hover:scale-[1.02]" 
                      />
                    </Link>
                  ))}
                </div>
                
                {/* Recent Listings */}
                <h2 className="text-xl font-semibold mt-8">New Listings You Might Like</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newestListings.map(listing => (
                    <PropertyCard
                      key={listing.id}
                      listing={listing}
                      isSaved={savedListingIds.includes(listing.id)}
                      onSave={handleSaveListing}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Saved Listings */}
            {activeTab === 'saved' && (
              <StudentSavedListings 
                savedListings={savedListings} 
                onSave={handleSaveListing} 
              />
            )}
            
            {/* Messages */}
            {activeTab === 'messages' && (
              <StudentMessages />
            )}
            
            {/* Notifications */}
            {activeTab === 'notifications' && (
              <StudentNotifications />
            )}
            
            {/* Settings */}
            {activeTab === 'settings' && (
              <StudentSettings user={user} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
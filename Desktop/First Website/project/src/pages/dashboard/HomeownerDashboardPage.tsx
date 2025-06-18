import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  Building,
  Settings,
  MessageSquare,
  PlusCircle,
  Eye,
  Star,
  BarChart,
  LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

export default function HomeownerDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Filtered listings owned by the current user
  const [myListings, setMyListings] = useState<any[]>([]);
  
  // Mock stats
  const [statsData] = useState({
    totalListings: 0,
    totalViews: 0,
    totalSaves: 0,
    totalInquiries: 12,
    recentInquiries: 3,
  });
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch listings from Supabase for the current user
    const fetchMyListings = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', user.id);
      if (error) {
        toast.error('Failed to fetch your listings: ' + error.message);
        setMyListings([]);
        return;
      }
      setMyListings(data || []);
      // Optionally update stats here
    };
    fetchMyListings();

    document.title = 'Homeowner Dashboard | HomesAway';
    return () => {
      document.title = 'HomesAway Student Accommodation Platform';
    };
  }, [user, navigate]);
  
  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
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
            <Button variant={activeTab === 'my-listings' ? 'default' : 'ghost'} className="w-full justify-start" onClick={() => navigate('/my-listings')}>
              My Listings
            </Button>
            <Button 
              variant={activeTab === 'messages' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('messages')}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Messages
              <span className="ml-auto bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">
                3
              </span>
            </Button>
            <Button 
              variant={activeTab === 'analytics' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart className="h-5 w-5 mr-2" />
              Analytics
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
                  <h1 className="text-2xl font-bold">Homeowner Dashboard</h1>
                  <Button onClick={() => navigate('/add-listing')} className="flex items-center">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Listing
                  </Button>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{statsData.totalListings}</div>
                      <p className="text-xs text-muted-foreground">
                        Properties you've listed
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{statsData.totalViews}</div>
                      <p className="text-xs text-muted-foreground">
                        Across all listings
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Saves</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{statsData.totalSaves}</div>
                      <p className="text-xs text-muted-foreground">
                        Students interested in your properties
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{statsData.totalInquiries}</div>
                      <p className="text-xs text-muted-foreground">
                        {statsData.recentInquiries} new in the last 7 days
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* My Listings Preview */}
                <h2 className="text-xl font-semibold mt-8">My Listings</h2>
                {myListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myListings.map(listing => (
                      <div key={listing.id} className="border rounded-lg overflow-hidden bg-card">
                        <div className="aspect-video relative">
                          <img 
                            src={listing.images[0]} 
                            alt={listing.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                            ₹{listing.price}/mo
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                          <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{listing.views} views</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{listing.saves} saves</span>
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>4 inquiries</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => navigate(`/listing/${listing.id}`)} className="flex-1">
                              <Link to={`/listings/${listing.id}`}>View</Link>
                            </Button>
                            <Button size="sm" className="flex-1">Edit</Button>
                            <Button size="sm" variant="destructive" className="flex-1" onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this listing?')) {
                                // Delete images from Supabase Storage
                                if (Array.isArray(listing.images) && listing.images.length > 0) {
                                  for (const url of listing.images) {
                                    // Extract the path after the bucket name
                                    const match = url.match(/listing-images\/(.*)$/);
                                    if (match && match[1]) {
                                      await supabase.storage.from('listing-images').remove([match[1]]);
                                    }
                                  }
                                }
                                // Delete listing from DB
                                const { error } = await supabase.from('listings').delete().eq('id', listing.id);
                                if (error) {
                                  toast.error('Failed to delete listing: ' + error.message);
                                } else {
                                  toast.success('Listing and images deleted successfully!');
                                  setMyListings(myListings.filter(l => l.id !== listing.id));
                                }
                              }
                            }}>
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Card className="flex flex-col items-center justify-center p-6 text-center h-full border-dashed cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => navigate('/add-listing')}
                    >
                      <PlusCircle className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="font-medium">Add New Listing</p>
                      <p className="text-sm text-muted-foreground">
                        List a new property for student accommodation
                      </p>
                    </Card>
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <Building className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Listings Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't added any property listings yet. Add your first listing to start connecting with students.
                    </p>
                    <Button onClick={() => navigate('/add-listing')} className="flex items-center">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Listing
                    </Button>

                  </Card>
                )}
                
                {/* Recent Activity */}
                <h2 className="text-xl font-semibold mt-8">Recent Activity</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Eye className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">New views on your listings</p>
                          <p className="text-sm text-muted-foreground">Your listings received 28 new views in the last 7 days</p>
                          <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-start gap-4">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">New message from Alex Student</p>
                          <p className="text-sm text-muted-foreground">Regarding "Modern Studio Near University"</p>
                          <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-start gap-4">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Star className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">New saves on your listings</p>
                          <p className="text-sm text-muted-foreground">5 students saved your listings in the last 7 days</p>
                          <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            
            {/* Listings */}
            {activeTab === 'listings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">My Listings</h1>
                  <Button onClick={() => navigate('/add-listing')} className="flex items-center">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Listing
                  </Button>
                </div>
                
                {myListings.length > 0 ? (
                  <div className="space-y-6">
                    {myListings.map(listing => (
                      <div key={listing.id} className="border rounded-lg overflow-hidden bg-card">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 h-48 md:h-auto">
                            <img 
                              src={listing.images[0]} 
                              alt={listing.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-6 flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                              <div className="text-xl font-bold">₹{listing.price}/mo</div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {listing.description}
                            </p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">VIEWS</p>
                                <div className="flex items-center">
                                  <Eye className="h-4 w-4 mr-1.5 text-primary" />
                                  <span className="font-semibold">{listing.views}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">SAVES</p>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 mr-1.5 text-primary" />
                                  <span className="font-semibold">{listing.saves}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">INQUIRIES</p>
                                <div className="flex items-center">
                                  <MessageSquare className="h-4 w-4 mr-1.5 text-primary" />
                                  <span className="font-semibold">4</span>
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">STATUS</p>
                                <div className="flex items-center">
                                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                                  <span className="font-semibold">Active</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <Button size="sm" variant="outline" onClick={() => navigate(`/listing/${listing.id}`)} className="flex-1">
                                <Link to={`/listings/${listing.id}`}>View</Link>
                              </Button>
                              <Button size="sm">Edit Listing</Button>
                              <Button size="sm" variant="outline">Manage Inquiries</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <Building className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Listings Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't added any property listings yet. Add your first listing to start connecting with students.
                    </p>
                    <Button onClick={() => navigate('/add-listing')} className="flex items-center">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add First Listing
                    </Button>
                  </Card>
                )}
              </div>
            )}
            
            {/* Messages */}
            {activeTab === 'messages' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Messages</h1>
                
                <Card className="p-6">
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-xl font-semibold mb-2">Message Center</h3>
                    <p className="text-muted-foreground mb-4">
                      This feature is coming soon. You'll be able to communicate with students interested in your properties.
                    </p>
                    <Button onClick={() => setActiveTab('overview')}>
                      Return to Dashboard
                    </Button>
                  </div>
                </Card>
              </div>
            )}
            
            {/* Analytics */}
            {activeTab === 'analytics' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Analytics</h1>
                
                <Card className="p-6">
                  <div className="text-center py-12">
                    <BarChart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                    <p className="text-muted-foreground mb-4">
                      This feature is coming soon. You'll be able to view detailed analytics about your property listings.
                    </p>
                    <Button onClick={() => setActiveTab('overview')}>
                      Return to Dashboard
                    </Button>
                  </div>
                </Card>
              </div>
            )}
            
            {/* Settings */}
            {activeTab === 'settings' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Settings</h1>
                
                <Card className="p-6">
                  <div className="text-center py-12">
                    <Settings className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-xl font-semibold mb-2">Account Settings</h3>
                    <p className="text-muted-foreground mb-4">
                      This feature is coming soon. You'll be able to update your account settings and preferences.
                    </p>
                    <Button onClick={() => setActiveTab('overview')}>
                      Return to Dashboard
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
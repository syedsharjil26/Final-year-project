import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { mockLocalityAura } from '@/lib/mockData';
import { Shield, Building, Map, BarChart } from 'lucide-react';

export default function DashboardOverviewPage() {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Real data state
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      const { data: listingData } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      setUsers(userData || []);
      setListings(listingData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={() => window.location.reload()}>Refresh Data</Button>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-chart-1"></span>
                <span>Students: {users.filter(u => u.role === 'student').length}</span>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-chart-2"></span>
                <span>Homeowners: {users.filter(u => u.role === 'homeowner').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listings.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {users.filter(u => u.role === 'homeowner').length} homeowners
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Localities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLocalityAura.length}</div>
            <p className="text-xs text-muted-foreground">
              With Aura scores
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
              Healthy
            </div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>New user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div>Loading users...</div>
              ) : users.length === 0 ? (
                <div>No recent users found.</div>
              ) : (
                users.map(user => (
                  <div key={user.id} className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                    <div className="text-sm capitalize bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {user.role}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm">View All Users</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Listings</CardTitle>
            <CardDescription>Newly added properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div>Loading listings...</div>
              ) : listings.length === 0 ? (
                <div>No recent listings found.</div>
              ) : (
                listings.map(listing => (
                  <div key={listing.id} className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-md overflow-hidden">
                      <img 
                        src={listing.images && listing.images[0] ? listing.images[0] : '/placeholder.png'} 
                        alt={listing.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{listing.title}</div>
                      <div className="text-sm text-muted-foreground">{listing.location}</div>
                    </div>
                    <div className="text-sm font-semibold">₹{listing.price}/mo</div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm">View All Listings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>All systems operational</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="font-medium">User Authentication</span>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-sm">Operational</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-green-500" />
                <span className="font-medium">Listings Database</span>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-sm">Operational</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Map className="h-5 w-5 text-green-500" />
                <span className="font-medium">Locality Aura AI</span>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-sm">Operational</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-green-500" />
                <span className="font-medium">Analytics Engine</span>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-sm">Operational</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
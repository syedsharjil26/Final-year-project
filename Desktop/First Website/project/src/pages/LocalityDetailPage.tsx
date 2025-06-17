import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockLocalityAura, mockListings } from '@/lib/mockData';
import { PropertyCard } from '@/components/property/PropertyCard';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  ArrowLeft, 
  Award, 
  Glasses, 
  Utensils, 
  Shield, 
  Bus, 
  Moon,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function LocalityDetailPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [locality] = useState(
    mockLocalityAura.find(l => l.locality === name)
  );
  const [localityListings] = useState(
    mockListings.filter(l => l.locality === name)
  );
  const [savedListingIds, setSavedListingIds] = useState<string[]>([]);
  
  // For pie chart data
  const [accommodationTypes] = useState([
    { name: 'Studio', value: 35 },
    { name: '1 Bedroom', value: 30 },
    { name: '2 Bedroom', value: 20 },
    { name: '3+ Bedroom', value: 15 },
  ]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  useEffect(() => {
    // Check if locality exists
    if (!locality) {
      toast.error('Locality not found');
      navigate('/localities');
      return;
    }
    
    // Get saved listings from localStorage for the current user
    if (user) {
      const savedListings = localStorage.getItem(`savedListings-${user.id}`);
      if (savedListings) {
        setSavedListingIds(JSON.parse(savedListings));
      }
    }
    
    // Set document title
    document.title = `${name} | HomesAway Localities`;
    
    return () => {
      document.title = 'HomesAway Student Accommodation Platform';
    };
  }, [name, locality, navigate, user]);
  
  const handleSaveListing = (listingId: string) => {
    if (!user) return;

    setSavedListingIds(prev => {
      const isAlreadySaved = prev.includes(listingId);
      const newSavedListings = isAlreadySaved
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId];
      
      // Save to localStorage
      localStorage.setItem(`savedListings-${user.id}`, JSON.stringify(newSavedListings));
      return newSavedListings;
    });
  };
  
  // Prepare data for radar chart
  const radarData = [
    { subject: 'Safety', A: locality?.parameters.safety || 0, fullMark: 10 },
    { subject: 'Food Cost', A: locality?.parameters.food_cost || 0, fullMark: 10 },
    { subject: 'Student Friendly', A: locality?.parameters.student_friendly || 0, fullMark: 10 },
    { subject: 'Public Transport', A: locality?.parameters.public_transport || 0, fullMark: 10 },
    { subject: 'Evening Life', A: locality?.parameters.evening_atmosphere || 0, fullMark: 10 },
  ];
  
  if (!locality) {
    return null; // Will navigate away in useEffect
  }
  
  // Function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-500 dark:text-green-400';
    if (score >= 7) return 'text-amber-500 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  };
  
  const getParameterIcon = (param: string) => {
    switch (param) {
      case 'Safety':
        return <Shield className="h-5 w-5 mr-2 text-primary" />;
      case 'Food Cost':
        return <Utensils className="h-5 w-5 mr-2 text-primary" />;
      case 'Student Friendly':
        return <Glasses className="h-5 w-5 mr-2 text-primary" />;
      case 'Public Transport':
        return <Bus className="h-5 w-5 mr-2 text-primary" />;
      case 'Evening Life':
        return <Moon className="h-5 w-5 mr-2 text-primary" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="container px-4 md:px-6 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="pl-0">
          <Link to="/localities" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Localities
          </Link>
        </Button>
      </div>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{locality.locality}</h1>
          <div className="flex items-center text-lg">
            <span className="text-muted-foreground mr-2">Locality Aura Score:</span>
            <div className="flex items-center">
              <Award className="h-5 w-5 mr-1 text-primary" />
              <span className={`text-2xl font-bold ${getScoreColor(locality.score)}`}>
                {locality.score.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground ml-2">/ 10</span>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">
          Last updated: {format(new Date(locality.lastUpdated), 'PP')}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Locality Aura Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <Radar
                      name={locality.locality}
                      dataKey="A"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Parameter Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {radarData.map((param) => (
                  <div key={param.subject}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {getParameterIcon(param.subject)}
                        <span className="font-medium">{param.subject}</span>
                      </div>
                      <span className={`font-bold ${getScoreColor(param.A)}`}>
                        {param.A}/10
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${(param.A / 10) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {(() => {
                        switch(param.subject) {
                          case 'Safety':
                            return `This area has a ${param.A >= 7 ? 'good' : 'moderate'} safety rating. ${param.A >= 8 ? 'Very safe for students at all hours.' : param.A >= 6 ? 'Generally safe, but normal urban precautions advised.' : 'Take extra precautions, especially at night.'}`;
                          case 'Food Cost':
                            return `${param.A >= 7 ? 'Affordable' : 'Relatively expensive'} food options. ${param.A >= 8 ? 'Many budget-friendly eateries and grocery stores available.' : param.A >= 6 ? 'Mix of affordable and pricier options.' : 'Limited budget food options.'}`;
                          case 'Student Friendly':
                            return `This area is ${param.A >= 8 ? 'highly popular with students' : param.A >= 6 ? 'moderately popular with students' : 'not particularly popular with students'}. ${param.A >= 8 ? 'Strong student community and amenities.' : param.A >= 6 ? 'Some student-oriented services available.' : 'Few student-specific amenities.'}`;
                          case 'Public Transport':
                            return `${param.A >= 8 ? 'Excellent' : param.A >= 6 ? 'Good' : 'Limited'} public transportation. ${param.A >= 8 ? 'Multiple options with frequent service to campus and city center.' : param.A >= 6 ? 'Regular service during peak hours.' : 'May require additional travel planning.'}`;
                          case 'Evening Life':
                            return `${param.A >= 8 ? 'Vibrant' : param.A >= 6 ? 'Moderate' : 'Quiet'} evening atmosphere. ${param.A >= 8 ? 'Many entertainment options and nightlife.' : param.A >= 6 ? 'Some entertainment venues and restaurants open later.' : 'Limited evening activity options.'}`;
                          default:
                            return '';
                        }
                      })()}
                    </p>
                    {param.subject !== radarData[radarData.length - 1].subject && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-8">
          {/* Accommodation Types */}
          <Card>
            <CardHeader>
              <CardTitle>Accommodation Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={accommodationTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {accommodationTypes.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Facts */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Facts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="inline-block bg-primary/10 rounded-full p-1 mr-2">
                    <Home className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-sm">{localityListings.length} available listings</span>
                </li>
                <li className="flex items-center">
                  <span className="inline-block bg-primary/10 rounded-full p-1 mr-2">
                    <Bus className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-sm">15 minutes to downtown</span>
                </li>
                <li className="flex items-center">
                  <span className="inline-block bg-primary/10 rounded-full p-1 mr-2">
                    <Utensils className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-sm">12 restaurants within walking distance</span>
                </li>
                <li className="flex items-center">
                  <span className="inline-block bg-primary/10 rounded-full p-1 mr-2">
                    <Glasses className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-sm">5 minutes to nearest university</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Listings in this Locality */}
      {localityListings.length > 0 && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Listings in {locality.locality}</h2>
            <Button variant="outline" asChild>
              <Link to="/listings">View All Listings</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localityListings.map(listing => (
              <PropertyCard
                key={listing.id}
                listing={listing}
                isSaved={savedListingIds.includes(listing.id)}
                onSave={handleSaveListing}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockLocalityAura } from '@/lib/mockData';
import { LocalityAuraCard } from '@/components/property/LocalityAuraCard';
import { Search, Award, Map, Lightbulb, MapPinned } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { LocalityAura } from '@/types';

export default function LocalitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocalities, setFilteredLocalities] = useState<LocalityAura[]>(mockLocalityAura);
  
  useEffect(() => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredLocalities(
        mockLocalityAura.filter(
          locality => locality.locality.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredLocalities(mockLocalityAura);
    }
  }, [searchQuery]);
  
  // Sort localities by score (highest first)
  const sortedLocalities = [...filteredLocalities].sort((a, b) => b.score - a.score);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already filtered in the useEffect
  };
  
  return (
    <div className="container px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Explore Student-Friendly Localities</h1>
        <p className="text-muted-foreground text-lg mb-6">
          Discover the perfect neighborhood for your student life with our Locality Aura scores.
          Find safe, affordable, and vibrant areas to live during your studies.
        </p>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search localities..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">
            Search
          </Button>
        </form>
      </div>
      
      {/* Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-primary/5">
          <CardContent className="p-6 space-y-4">
            <Award className="h-10 w-10 text-primary mb-2" />
            <h3 className="text-xl font-semibold">Locality Aura Score</h3>
            <p className="text-muted-foreground">
              Our proprietary score (1-10) combines multiple factors to help you find the best student-friendly neighborhoods.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5">
          <CardContent className="p-6 space-y-4">
            <Map className="h-10 w-10 text-primary mb-2" />
            <h3 className="text-xl font-semibold">5 Key Parameters</h3>
            <p className="text-muted-foreground">
              Safety, food costs, student atmosphere, public transit access, and evening social scene. All measured on a scale of 1-10.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5">
          <CardContent className="p-6 space-y-4">
            <Lightbulb className="h-10 w-10 text-primary mb-2" />
            <h3 className="text-xl font-semibold">Updated Regularly</h3>
            <p className="text-muted-foreground">
              Our data is refreshed regularly to ensure you have the most accurate insights when choosing where to live.
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Localities Grid */}
      {filteredLocalities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedLocalities.map(locality => (
            <Link key={locality.locality} to={`/localities/${locality.locality}`}>
              <LocalityAuraCard 
                aura={locality} 
                className="h-full transition-transform hover:scale-[1.02]" 
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <MapPinned className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-xl font-semibold mb-2">No Localities Found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any localities matching your search criteria.
          </p>
          <Button onClick={() => setSearchQuery('')}>
            View All Localities
          </Button>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabaseClient';
import { LocalityAuraCard } from '@/components/property/LocalityAuraCard';
import { mockLocalityAura } from '@/lib/mockData';
import { Dumbbell, Coffee, Users, Music, BookOpen, Star, MapPin } from 'lucide-react';

// Fix for default marker icons in Leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map center changes
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// Map component
const Map: React.FC<{
  center: [number, number];
  zoom: number;
  universities: any[];
  searchResults: any[];
}> = ({ center, zoom, universities, searchResults }) => {
  // Find selected university
  const selected = searchResults.length > 0 && searchResults[0] && searchResults[0].id
    ? universities.find((u) => u.id === searchResults[0].id)
    : null;

  // Ref map for all markers
  const markerRefs = useRef<{ [id: string]: L.Marker | null }>({});

  useEffect(() => {
    if (selected && markerRefs.current[selected.id]) {
      markerRefs.current[selected.id]?.openPopup();
    }
  }, [selected]);

  // Replace amenityIcons with evening hotspots
  const hotspotMarkers = [
    {
      icon: <Dumbbell className="text-purple-600" />, label: 'Best Gym',
      position: [22.4805, 88.4155] as [number, number],
      description: '24x7 Fitness Club - Top-rated gym with student discounts.'
    },
    {
      icon: <Coffee className="text-amber-700" />, label: 'Underrated Cafe',
      position: [22.4772, 88.4138] as [number, number],
      description: 'Bean Scene Cafe - Cozy, quiet, and great for late-night study.'
    },
    {
      icon: <Users className="text-blue-500" />, label: 'Hangout Spot',
      position: [22.4791, 88.4172] as [number, number],
      description: 'Garia Lake Park - Popular for evening walks and group meetups.'
    },
    {
      icon: <Music className="text-pink-500" />, label: 'Live Music',
      position: [22.4780, 88.4125] as [number, number],
      description: 'Rhythm Lounge - Local bands every Friday night.'
    },
    {
      icon: <BookOpen className="text-green-700" />, label: 'Study Nook',
      position: [22.4769, 88.4163] as [number, number],
      description: 'PageTurner Library - Open till 10pm, free WiFi.'
    },
    {
      icon: <Star className="text-yellow-500" />, label: 'Night Food',
      position: [22.4812, 88.4140] as [number, number],
      description: 'Midnight Bites - Best street food after 9pm.'
    },
    {
      icon: <MapPin className="text-red-500" />, label: 'Secret Viewpoint',
      position: [22.4778, 88.4185] as [number, number],
      description: 'Skyline Terrace - Hidden rooftop with city views.'
    },
  ];
  const centerLat = 22.478748;
  const centerLng = 88.414894;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
      attributionControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeView center={center} zoom={zoom} />
      {/* University Markers */}
      {universities.map((university) => {
        const lat = university.latitude;
        const lng = university.longitude;
        if (
          typeof lat === 'number' &&
          typeof lng === 'number' &&
          !isNaN(lat) &&
          !isNaN(lng)
        ) {
          return (
            <Marker
              key={university.id}
              position={[lat, lng]}
              icon={icon}
              ref={(ref) => {
                markerRefs.current[university.id] = ref;
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg">{university.name}</h3>
                  <p className="text-gray-600">{university.location}</p>
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        }
        return null;
      })}
      <Marker position={[centerLat, centerLng]} icon={icon} eventHandlers={{
        mouseover: (e) => e.target.openPopup(),
        mouseout: (e) => e.target.closePopup(),
      }}>
        <Popup closeButton={false} className="bg-transparent shadow-none p-0">
          <div className="w-80 max-w-xs min-w-[300px] p-2">
            <LocalityAuraCard aura={mockLocalityAura.find(l => l.locality.toLowerCase() === 'garia') || mockLocalityAura[0]} heading="Garia" className="shadow-none" />
          </div>
        </Popup>
      </Marker>
      {hotspotMarkers.map((h) => (
        <Marker
          key={h.label}
          position={h.position}
          icon={L.divIcon({
            html: `<div title='${h.label}' style='background:rgba(255,255,255,0.95);border-radius:50%;padding:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);font-size:22px;display:flex;align-items:center;justify-content:center;transition:transform 0.2s;transform:scale(1.1);'>${h.icon.props.children || ''}</div>`,
            className: '',
            iconSize: [38, 38],
            iconAnchor: [19, 19],
          })}
        >
          <Popup>
            <div className="font-semibold mb-1">{h.label}</div>
            <div className="text-sm text-muted-foreground">{h.description}</div>
          </Popup>
        </Marker>
      ))}
      <Circle center={[22.478748, 88.414894]} radius={1000} pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }} />
    </MapContainer>
  );
};

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Map Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-900">
          <div className="text-center p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Error loading map
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please try refreshing the page
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const MapExplorerPage: React.FC = () => {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUniversity, setSelectedUniversity] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([22.478748, 88.414894]);
  const [mapZoom, setMapZoom] = useState(15);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('universities').select('*');
        if (error) {
          console.error('Error fetching universities:', error);
          setMapError('Failed to load universities');
        } else {
          setUniversities(data || []);
          setFilteredUniversities(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
        setMapError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  // Filter universities based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUniversities(universities);
    } else {
      setFilteredUniversities(
        universities.filter((u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (u.location && u.location.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    }
  }, [searchQuery, universities]);

  // Function to handle search result selection
  const handleSearchResultSelect = (university: any) => {
    if (university.latitude && university.longitude) {
      setMapCenter([university.latitude, university.longitude]);
      setMapZoom(15);
      setSelectedUniversity(university);
      setSearchQuery(university.name);
    }
  };

  if (mapError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {mapError}
          </h3>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col pt-16">
      {/* Search and Filters Bar */}
      <div className="bg-white shadow dark:bg-gray-800 sticky top-16 z-50">
        <div className="container-custom py-4">
          <div className="mb-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search universities by name or location..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {/* Search Results Dropdown */}
            {searchQuery.trim() && filteredUniversities.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredUniversities.map((university) => (
                  <div
                    key={university.id}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleSearchResultSelect(university)}
                  >
                    <p className="text-sm text-gray-900 dark:text-white">{university.name} <span className="text-xs text-gray-500">{university.location}</span></p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Universities List and Map */}
      <div className="relative flex flex-1 overflow-hidden">
        <div className="w-full max-w-md flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Universities</h3>
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading...</div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {universities.map((university) => (
                <div 
                  key={university.id} 
                  className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => {
                    setSelectedUniversity(university);
                    if (university.latitude && university.longitude) {
                      setMapCenter([university.latitude, university.longitude]);
                      setMapZoom(14);
                    }
                  }}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white">{university.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{university.location}</p>
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline dark:text-primary-400"
                  >
                    Visit Website
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Map */}
        <div className="flex-1">
          <ErrorBoundary>
            <Map
              center={mapCenter}
              zoom={mapZoom}
              universities={universities}
              searchResults={selectedUniversity ? [selectedUniversity] : []}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default MapExplorerPage;
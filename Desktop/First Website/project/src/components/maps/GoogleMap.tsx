import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface GoogleMapProps {
  onMapClick?: (e: google.maps.MapMouseEvent) => void;
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  marker?: google.maps.LatLngLiteral;
}

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

export default function GoogleMap({ onMapClick, center, zoom = 12, marker }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerInstanceRef = useRef<google.maps.Marker | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMap = () => {
      try {
        if (!mapRef.current) return;

        const map = new google.maps.Map(mapRef.current, {
          center: center || { lat: 0, lng: 0 },
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        mapInstanceRef.current = map;

        if (onMapClick) {
          map.addListener('click', onMapClick);
        }

        // Add a default marker at the center
        if (center) {
          markerInstanceRef.current = new google.maps.Marker({
            position: center,
            map,
          });
        }

        console.log('Map initialized successfully');
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map');
        toast.error('Failed to load map. Please try again.');
      }
    };

    // Load Google Maps script if not already loaded
    if (!window.google) {
      console.log('Loading Google Maps script...');
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = () => {
        console.log('Google Maps script loaded');
        initializeMap();
      };

      script.onerror = () => {
        console.error('Failed to load Google Maps script');
        setError('Failed to load Google Maps');
        toast.error('Failed to load map. Please check your internet connection.');
      };

      document.head.appendChild(script);
    } else {
      console.log('Google Maps already loaded, initializing map...');
      initializeMap();
    }

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        google.maps.event.clearInstanceListeners(mapInstanceRef.current);
      }
    };
  }, [onMapClick, center, zoom]);

  // Update marker when marker prop changes
  useEffect(() => {
    if (marker && mapInstanceRef.current) {
      try {
        if (markerInstanceRef.current) {
          markerInstanceRef.current.setPosition(marker);
        } else {
          markerInstanceRef.current = new google.maps.Marker({
            position: marker,
            map: mapInstanceRef.current,
          });
        }
      } catch (err) {
        console.error('Error updating marker:', err);
        toast.error('Failed to update marker');
      }
    } else if (markerInstanceRef.current) {
      markerInstanceRef.current.setMap(null);
      markerInstanceRef.current = null;
    }
  }, [marker]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full" />;
} 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

const AMENITIES = [
  { id: 'wifi', name: 'WiFi' },
  { id: 'laundry', name: 'Laundry' },
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'parking', name: 'Parking' },
  { id: 'gym', name: 'Gym' },
  { id: 'bills_included', name: 'Bills Included' },
  { id: 'bike_storage', name: 'Bike Storage' },
  { id: 'study_desk', name: 'Study Desk' },
  { id: 'balcony', name: 'Balcony' },
  { id: 'garden', name: 'Garden' },
];

export default function AddListingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [bedrooms, setBedrooms] = useState<number | ''>(1);
  const [location, setLocation] = useState('');
  const [locality, setLocality] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files));
    }
  };

  const handleAmenityChange = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Submitting listing:', { title, description, price, images, bedrooms, location, locality, user, selectedAmenities });

    if (!title || !description || !price || images.length === 0 || !bedrooms || !location || !locality) {
      toast.error('Please fill in all fields and upload at least one image.');
      window.alert('Please fill in all fields and upload at least one image.');
      return;
    }

    // 1. Upload images to Supabase Storage
    const imageUrls: string[] = [];
    for (const file of images) {
      const filePath = `${user?.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('listing-images').upload(filePath, file);
      if (uploadError) {
        toast.error(`Failed to upload image: ${file.name}`);
        window.alert(`Failed to upload image: ${file.name} - ${uploadError.message}`);
        return;
      }
      // Get public URL
      const { data } = supabase.storage.from('listing-images').getPublicUrl(filePath);
      imageUrls.push(data.publicUrl);
    }

    // 2. Insert into Supabase
    const { error } = await supabase.from('listings').insert([
      {
        title,
        description,
        price: parseFloat(price),
        images: imageUrls,
        bedrooms: Number(bedrooms),
        location,
        locality,
        amenities: selectedAmenities, // Save as array of amenity IDs
        owner_id: user?.id || null,
      }
    ]);

    if (error) {
      toast.error('Failed to add listing: ' + error.message);
      window.alert('Failed to add listing: ' + error.message);
      return;
    }

    toast.success('Listing added successfully!');
    window.alert('Listing added successfully!');
    navigate('/dashboard/homeowner'); // Redirect to My Listings
  };

  return (
    <div className="container px-4 md:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Listing</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create a new property listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
            />
            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bedrooms
              </label>
              <div className="mt-1">
                <Input
                  type="number"
                  min={1}
                  placeholder="Number of bedrooms"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.valueAsNumber)}
                />
              </div>
            </div>
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="mt-1">
                <Input
                  placeholder="Location (e.g. City, Area)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            {/* Locality */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Locality
              </label>
              <div className="mt-1">
                <Input
                  placeholder="Locality (e.g. Neighborhood)"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                />
              </div>
            </div>
            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 gap-2">
                {AMENITIES.map((amenity) => (
                  <label key={amenity.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity.id)}
                      onChange={() => handleAmenityChange(amenity.id)}
                    />
                    {amenity.name}
                  </label>
                ))}
              </div>
            </div>
            <Button type="submit">Add Listing</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
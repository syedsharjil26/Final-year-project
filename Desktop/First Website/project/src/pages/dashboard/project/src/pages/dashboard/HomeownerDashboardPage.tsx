import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AddListingPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!title || !description || !price || images.length === 0) {
      toast.error('Please fill in all fields and upload at least one image.');
      return;
    }

    // Here you would typically send the data to your API
    const newListing = {
      title,
      description,
      price: parseFloat(price),
      images,
    };

    console.log('New Listing:', newListing);
    toast.success('Listing added successfully!');
    navigate('/dashboard'); // Redirect to the dashboard after submission
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
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
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border rounded-md p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border rounded-md p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price ($/mo)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border rounded-md p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Images</label>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="border rounded-md p-2 w-full"
                accept="image/*"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Add Listing
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
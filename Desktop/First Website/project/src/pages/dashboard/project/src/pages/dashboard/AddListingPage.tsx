import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function AddListingPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<File[]>([]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

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
            <Button type="submit">Add Listing</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
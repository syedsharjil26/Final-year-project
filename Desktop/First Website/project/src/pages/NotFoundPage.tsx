import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="container flex flex-col items-center justify-center py-20 px-4 text-center">
      <AlertTriangle className="h-24 w-24 text-muted-foreground mb-8" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" asChild>
          <Link to="/">Go to Homepage</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/listings">Browse Listings</Link>
        </Button>
      </div>
    </div>
  );
}
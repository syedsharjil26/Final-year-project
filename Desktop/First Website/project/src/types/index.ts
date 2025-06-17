export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'homeowner' | 'admin';
  avatar?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  location: string;
  locality: string;
  images: string[];
  amenities: string[];
  owner: {
    id: string;
    name: string;
    avatar?: string;
  };
  views: number;
  saves: number;
  featured?: boolean;
}

export interface LocalityAura {
  locality: string;
  score: number;
  parameters: {
    safety: number;
    food_cost: number;
    student_friendly: number;
    public_transport: number;
    evening_atmosphere: number;
  };
  lastUpdated: string;
}

export interface SavedListing {
  id: string;
  listingId: string;
  userId: string;
  savedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'student' | 'homeowner' | 'admin') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}
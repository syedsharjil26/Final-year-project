import { Listing, LocalityAura, User } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Student',
    email: 'alex@student.edu',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '2',
    name: 'Taylor Homeowner',
    email: 'taylor@homeowner.com',
    role: 'homeowner',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@homesaway.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

// Mock Listings
export const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Modern Studio Near University',
    description: 'A bright and airy studio apartment perfect for students. Just a 5-minute walk to campus with all amenities included.',
    price: 750,
    bedrooms: 1,
    location: '123 University Ave, College Town',
    locality: 'Downtown',
    images: [
      'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    amenities: ['WiFi', 'Laundry', 'Kitchen', 'Study Desk', 'Bike Storage'],
    owner: {
      id: '2',
      name: 'Taylor Homeowner',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    views: 128,
    saves: 24,
  },
  {
    id: '2',
    title: '2 Bedroom Apartment with Balcony',
    description: 'Spacious 2 bedroom apartment perfect for sharing with a roommate. Features a balcony with city views and is located in a quiet neighborhood.',
    price: 1200,
    bedrooms: 2,
    location: '456 College Blvd, Study Heights',
    locality: 'Study Heights',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    amenities: ['WiFi', 'Laundry', 'Kitchen', 'Balcony', 'Parking', 'Dishwasher'],
    owner: {
      id: '2',
      name: 'Taylor Homeowner',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    views: 97,
    saves: 18,
  },
  {
    id: '3',
    title: 'Cozy Room in Shared House',
    description: 'Private bedroom in a shared 4-bedroom house with other students. Common living room, kitchen, and garden. Great community atmosphere.',
    price: 500,
    bedrooms: 1,
    location: '789 Student Lane, College Grove',
    locality: 'College Grove',
    images: [
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    amenities: ['WiFi', 'Laundry', 'Shared Kitchen', 'Garden', 'Bills Included'],
    owner: {
      id: '2',
      name: 'Taylor Homeowner',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    views: 156,
    saves: 32,
  },
  {
    id: '4',
    title: 'Luxury Studio with Gym Access',
    description: 'Modern studio apartment in a new building with access to gym, study rooms, and communal lounge. Perfect for students who want comfort and amenities.',
    price: 950,
    bedrooms: 1,
    location: '101 Academia Road, University Park',
    locality: 'University Park',
    images: [
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1457841/pexels-photo-1457841.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    amenities: ['WiFi', 'Gym', 'Study Rooms', 'Laundry', 'Bike Storage', 'Security'],
    owner: {
      id: '2',
      name: 'Taylor Homeowner',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    views: 203,
    saves: 45,
  },
  {
    id: '5',
    title: '3 Bedroom House for Group',
    description: 'Entire house perfect for a group of 3-4 students. Includes garden, driveway parking, and is a 10-minute bus ride to campus.',
    price: 1800,
    bedrooms: 3,
    location: '202 Group Living St, Study Town',
    locality: 'Study Town',
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    amenities: ['WiFi', 'Garden', 'Parking', 'Washer/Dryer', 'Dishwasher', 'Full Kitchen'],
    owner: {
      id: '2',
      name: 'Taylor Homeowner',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    views: 178,
    saves: 36,
  },
  {
    id: '6',
    title: 'Budget Friendly Room Near Campus',
    description: 'Affordable single room in a quiet neighborhood. Shared bathroom and kitchen facilities. Great for students on a budget.',
    price: 400,
    bedrooms: 1,
    location: '303 Economy Street, Affordable Quarter',
    locality: 'Affordable Quarter',
    images: [
      'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/271742/pexels-photo-271742.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/271741/pexels-photo-271741.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    amenities: ['WiFi', 'Bills Included', 'Shared Kitchen', 'Close to Campus'],
    owner: {
      id: '2',
      name: 'Taylor Homeowner',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    views: 245,
    saves: 67,
  },
];

// Mock Locality Aura Data
export const mockLocalityAura: LocalityAura[] = [
  {
    locality: 'Jadavpur',
    score: 8.5,
    parameters: {
      safety: 8,
      food_cost: 9,
      student_friendly: 9,
      public_transport: 9,
      evening_atmosphere: 10,
    },
    lastUpdated: '2025-02-15T14:30:00Z',
  },
  {
    locality: 'Sealdah',
    score: 7.8,
    parameters: {
      safety: 9,
      food_cost: 5,
      student_friendly: 8,
      public_transport: 10,
      evening_atmosphere: 8,
    },
    lastUpdated: '2025-02-12T10:15:00Z',
  },
  {
    locality: 'College Street',
    score: 9.0,
    parameters: {
      safety: 8,
      food_cost: 8,
      student_friendly: 10,
      public_transport: 9,
      evening_atmosphere: 9,
    },
    lastUpdated: '2025-02-14T16:45:00Z',
  },
  {
    locality: 'Jodhpur Park',
    score: 8.2,
    parameters: {
      safety: 9,
      food_cost: 5,
      student_friendly: 10,
      public_transport: 8,
      evening_atmosphere: 9,
    },
    lastUpdated: '2025-02-13T12:20:00Z',
  },
  {
    locality: 'Newtown',
    score: 7.5,
    parameters: {
      safety: 7,
      food_cost: 8,
      student_friendly: 7,
      public_transport: 7,
      evening_atmosphere: 8,
    },
    lastUpdated: '2025-02-10T09:30:00Z',
  },
  {
    locality: 'Park Circus',
    score: 7.0,
    parameters: {
      safety: 6,
      food_cost: 9,
      student_friendly: 8,
      public_transport: 7,
      evening_atmosphere: 5,
    },
    lastUpdated: '2025-02-11T14:00:00Z',
  },
];

// Mock Saved Listings
export const mockSavedListings = [
  {
    id: '1',
    listingId: '3',
    userId: '1',
    savedAt: '2025-02-20T10:30:00Z',
  },
  {
    id: '2',
    listingId: '6',
    userId: '1',
    savedAt: '2025-02-18T15:45:00Z',
  },
];

// Mock Universities
export const mockUniversities = [
  {
    id: '1',
    name: 'University of College Town',
    location: '123 University Ave, College Town',
    logo: 'https://via.placeholder.com/150', // Replace with actual logo URL
    description: 'A prestigious university known for its excellent academic programs and vibrant student life.',
    website: 'https://www.universityofcollegetown.edu',
  },
  {
    id: '2',
    name: 'Study Heights University',
    location: '456 College Blvd, Study Heights',
    logo: 'https://via.placeholder.com/150', // Replace with actual logo URL
    description: 'A modern university offering a wide range of courses and state-of-the-art facilities.',
    website: 'https://www.studyheightsuniversity.edu',
  },
  {
    id: '3',
    name: 'College Grove Institute',
    location: '789 Student Lane, College Grove',
    logo: 'https://via.placeholder.com/150', // Replace with actual logo URL
    description: 'An institute focused on research and innovation, with strong ties to the local community.',
    website: 'https://www.collegegroveinstitute.edu',
  },
  {
    id: '4',
    name: 'University Park Academy',
    location: '101 Academia Road, University Park',
    logo: 'https://via.placeholder.com/150', // Replace with actual logo URL
    description: 'A top-ranked academy providing world-class education and extracurricular opportunities.',
    website: 'https://www.universityparkacademy.edu',
  },
  {
    id: '5',
    name: 'Affordable Quarter University',
    location: '303 Economy Street, Affordable Quarter',
    logo: 'https://via.placeholder.com/150', // Replace with actual logo URL
    description: 'A budget-friendly university offering quality education for students from diverse backgrounds.',
    website: 'https://www.affordablequarteruniversity.edu',
  },
];
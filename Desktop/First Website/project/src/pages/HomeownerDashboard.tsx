import { useEffect, useState } from 'react';

export default function HomeownerDashboard() {
  const [listings, setListings] = useState([]);

  const fetchListings = async () => {
    // Replace with your real API call
    const res = await fetch('/api/my-listings');
    const data = await res.json();
    setListings(data);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div>
      <h2>Total Listings: {listings.length}</h2>
      {/* ...rest of dashboard... */}
    </div>
  );
}
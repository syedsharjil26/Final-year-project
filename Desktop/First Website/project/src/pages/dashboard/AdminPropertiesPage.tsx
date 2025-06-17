import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

export default function AdminPropertiesPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('listings').select('*');
    if (!error && data) setListings(data);
    setLoading(false);
  };

  const handleToggleFeatured = async (listing: any) => {
    await supabase.from('listings').update({ featured: !listing.featured }).eq('id', listing.id);
    fetchListings();
  };

  const filteredListings = listings.filter(p =>
    (statusFilter === 'all' || p.status === statusFilter) &&
    (locationFilter === '' || (p.location || '').includes(locationFilter))
  );

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-0">Listings Management</h1>
          <div className="flex gap-2 flex-wrap">
            <Button variant={statusFilter === 'all' ? 'default' : 'outline'} onClick={() => setStatusFilter('all')}>All</Button>
            <Button variant={statusFilter === 'active' ? 'default' : 'outline'} onClick={() => setStatusFilter('active')}>Active</Button>
            <Button variant={statusFilter === 'inactive' ? 'default' : 'outline'} onClick={() => setStatusFilter('inactive')}>Inactive</Button>
            <input type="text" placeholder="Location" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="border rounded px-2 py-1 ml-2 text-sm" />
          </div>
        </div>
        {loading ? (
          <div className="text-gray-700 dark:text-gray-200">Loading listings...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow text-gray-700 dark:text-gray-200 text-sm font-medium">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Owner</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Featured</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map(listing => (
                  <tr key={listing.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="p-3">{listing.title}</td>
                    <td className="p-3">{listing.owner_id || '-'}</td>
                    <td className="p-3 capitalize">{listing.status || 'active'}</td>
                    <td className="p-3">{listing.location || '-'}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${listing.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'}`}>
                        {listing.featured ? 'Featured ✅' : '❌'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleToggleFeatured(listing)}>
                          {listing.featured ? 'Unmark' : 'Mark as Featured'}
                        </Button>
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="destructive">Delete</Button>
                        <Button size="sm" variant="secondary">{listing.status === 'active' ? 'Deactivate' : 'Activate'}</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 
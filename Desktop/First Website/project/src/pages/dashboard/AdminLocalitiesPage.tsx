import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

export default function AdminLocalitiesPage() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editUniversity, setEditUniversity] = useState<any | null>(null);

  // University form state
  const [univForm, setUnivForm] = useState({
    name: '',
    location: '',
    description: '',
    website: '',
    logo: '',
    latitude: '',
    longitude: '',
  });
  const [addingUniv, setAddingUniv] = useState(false);
  const [univError, setUnivError] = useState('');

  // Add Location modal state
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [locationForm, setLocationForm] = useState({
    name: '',
    lat: '',
    lng: '',
  });
  const [addingLocation, setAddingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('universities').select('*');
    if (!error && data) setUniversities(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('universities').delete().eq('id', id);
    fetchUniversities();
  };

  // Add University handler
  const handleAddUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingUniv(true);
    setUnivError('');
    if (!univForm.name || !univForm.location) {
      setUnivError('Name and location are required.');
      setAddingUniv(false);
      return;
    }
    const { error } = await supabase.from('universities').insert([
      {
        name: univForm.name,
        location: univForm.location,
        description: univForm.description,
        website: univForm.website,
        logo: univForm.logo,
      },
    ]);
    if (error) {
      setUnivError(error.message);
      setAddingUniv(false);
      return;
    }
    setUnivForm({ name: '', location: '', description: '', website: '', logo: '', latitude: '', longitude: '' });
    setShowAdd(false);
    setAddingUniv(false);
  };

  // Add Location handler
  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingLocation(true);
    setLocationError('');
    if (!locationForm.name || !locationForm.lat || !locationForm.lng) {
      setLocationError('All fields are required.');
      setAddingLocation(false);
      return;
    }
    const lat = parseFloat(locationForm.lat);
    const lng = parseFloat(locationForm.lng);
    if (isNaN(lat) || isNaN(lng)) {
      setLocationError('Latitude and longitude must be valid numbers.');
      setAddingLocation(false);
      return;
    }
    const { error } = await supabase.from('universities').insert([
      {
        name: locationForm.name,
        lat,
        lng,
      },
    ]);
    if (error) {
      setLocationError(error.message);
      setAddingLocation(false);
      return;
    }
    setLocationForm({ name: '', lat: '', lng: '' });
    setShowAddLocation(false);
    setAddingLocation(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-0">University Management</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowAdd(true)}>Add University</Button>
          </div>
        </div>
        {loading ? (
          <div className="text-gray-700 dark:text-gray-200">Loading universities...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow text-gray-700 dark:text-gray-200 text-sm font-medium">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Website</th>
                  <th className="p-3 text-left">Latitude</th>
                  <th className="p-3 text-left">Longitude</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {universities.map(u => (
                  <tr key={u.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.location}</td>
                    <td className="p-3"><a href={u.website} target="_blank" rel="noopener noreferrer" className="text-primary underline">{u.website}</a></td>
                    <td className="p-3">{u.latitude}</td>
                    <td className="p-3">{u.longitude}</td>
                    <td className="p-3 space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setEditUniversity(u)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(u.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Add University Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Add University</h2>
              <form className="space-y-4" onSubmit={handleAddUniversity}>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Name<span className="text-red-500">*</span></label>
                  <input type="text" className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200" value={univForm.name} onChange={e => setUnivForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Location (auto-filled)<span className="text-red-500">*</span></label>
                  <input type="text" className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200" value={univForm.location} readOnly disabled placeholder="Location will be auto-filled" />
                  <Button variant="outline" type="button" className="mt-2" onClick={async () => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(async (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        // Optionally, reverse geocode here to get address
                        // For now, just store lat/lng in the form
                        setUnivForm(f => ({ ...f, latitude: lat.toString(), longitude: lng.toString(), location: `Lat: ${lat}, Lng: ${lng}` }));
                      });
                    } else {
                      alert('Geolocation is not supported by this browser.');
                    }
                  }}>Add Location</Button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Description</label>
                  <textarea className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200" value={univForm.description} onChange={e => setUnivForm(f => ({ ...f, description: e.target.value }))} rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Website</label>
                  <input type="url" className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200" value={univForm.website} onChange={e => setUnivForm(f => ({ ...f, website: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Logo URL</label>
                  <input type="url" className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200" value={univForm.logo} onChange={e => setUnivForm(f => ({ ...f, logo: e.target.value }))} />
                </div>
                {univError && <div className="text-red-500 text-sm">{univError}</div>}
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={addingUniv || !univForm.latitude || !univForm.longitude}>{addingUniv ? 'Adding...' : 'Add University'}</Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={() => { setShowAdd(false); setUnivError(''); }}>Cancel</Button>
                </div>
              </form>
              {/* Add Location Modal moved inside Add University Modal */}
              {showAddLocation && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg w-full max-w-md">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Add Location</h2>
                    <form className="space-y-4" onSubmit={handleAddLocation}>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Name<span className="text-red-500">*</span></label>
                        <input type="text" className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200" value={locationForm.name} onChange={e => setLocationForm(f => ({ ...f, name: e.target.value }))} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Latitude<span className="text-red-500">*</span></label>
                        <input type="number" step="any" className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200" value={locationForm.lat} onChange={e => setLocationForm(f => ({ ...f, lat: e.target.value }))} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Longitude<span className="text-red-500">*</span></label>
                        <input type="number" step="any" className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200" value={locationForm.lng} onChange={e => setLocationForm(f => ({ ...f, lng: e.target.value }))} required />
                      </div>
                      {locationError && <div className="text-red-500 text-sm">{locationError}</div>}
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1" disabled={addingLocation}>{addingLocation ? 'Adding...' : 'Add Location'}</Button>
                        <Button type="button" variant="outline" className="flex-1" onClick={() => { setShowAddLocation(false); setLocationError(''); }}>Cancel</Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Add/Edit University Modal */}
        {editUniversity && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Edit University</h2>
              <form className="space-y-4" onSubmit={handleAddUniversity}>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Name<span className="text-red-500">*</span></label>
                  <input type="text" className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200" value={univForm.name} onChange={e => setUnivForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Location (auto-filled)<span className="text-red-500">*</span></label>
                  <input type="text" className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200" value={univForm.location} readOnly disabled placeholder="Location will be auto-filled" />
                  <Button variant="outline" type="button" className="mt-2" onClick={async () => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(async (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        // Optionally, reverse geocode here to get address
                        // For now, just store lat/lng in the form
                        setUnivForm(f => ({ ...f, latitude: lat.toString(), longitude: lng.toString(), location: `Lat: ${lat}, Lng: ${lng}` }));
                      });
                    } else {
                      alert('Geolocation is not supported by this browser.');
                    }
                  }}>Add Location</Button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Description</label>
                  <textarea className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200" value={univForm.description} onChange={e => setUnivForm(f => ({ ...f, description: e.target.value }))} rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Website</label>
                  <input type="url" className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200" value={univForm.website} onChange={e => setUnivForm(f => ({ ...f, website: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Logo URL</label>
                  <input type="url" className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200" value={univForm.logo} onChange={e => setUnivForm(f => ({ ...f, logo: e.target.value }))} />
                </div>
                {univError && <div className="text-red-500 text-sm">{univError}</div>}
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={addingUniv || !univForm.latitude || !univForm.longitude}>{addingUniv ? 'Updating...' : 'Update University'}</Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={() => { setEditUniversity(null); }}>Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
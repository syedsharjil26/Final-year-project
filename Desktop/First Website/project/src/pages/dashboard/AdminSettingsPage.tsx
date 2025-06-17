import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AdminSettingsPage() {
  // Example state for settings
  const [maxListings, setMaxListings] = useState(100);
  const [auraWeight, setAuraWeight] = useState(1.0);
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Admin Settings</h1>
        <form className="space-y-6">
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">Change Admin Password</label>
            <input type="password" className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200" placeholder="New password" />
            <Button className="mt-2">Update Password</Button>
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">Max Listing Limit</label>
            <input type="number" className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200" value={maxListings} onChange={e => setMaxListings(Number(e.target.value))} />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">Default Aura Weightage</label>
            <input type="number" step="0.01" className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200" value={auraWeight} onChange={e => setAuraWeight(Number(e.target.value))} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={maintenance} onChange={e => setMaintenance(e.target.checked)} />
            <span className="text-gray-700 dark:text-gray-200">Maintenance Mode</span>
          </div>
          <Button className="w-full">Save Settings</Button>
        </form>
      </div>
    </div>
  );
} 
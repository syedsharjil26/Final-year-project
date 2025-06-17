import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

export default function AdminUsersPage() {
  const [filter, setFilter] = useState<'all' | 'student' | 'homeowner'>('all');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('users').select('*');
      if (!error && data) setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => filter === 'all' || u.role === filter);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-0">Users Management</h1>
          <div className="flex gap-2">
            <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
            <Button variant={filter === 'student' ? 'default' : 'outline'} onClick={() => setFilter('student')}>Students</Button>
            <Button variant={filter === 'homeowner' ? 'default' : 'outline'} onClick={() => setFilter('homeowner')}>Owners</Button>
          </div>
        </div>
        {loading ? (
          <div className="text-gray-700 dark:text-gray-200">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow text-gray-700 dark:text-gray-200 text-sm font-medium">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.phone || '-'}</td>
                    <td className="p-3 capitalize">{user.role}</td>
                    <td className="p-3 capitalize">{user.status || 'active'}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Deactivate</Button>
                        <Button size="sm" variant="destructive">Delete</Button>
                        <Button size="sm" variant="secondary">View Properties</Button>
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
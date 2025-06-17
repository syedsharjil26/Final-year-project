import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AdminAnalyticsPage() {
  const [userStats, setUserStats] = useState({ students: 0, owners: 0 });

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('users').select('role');
      const students = data?.filter((u: any) => u.role === 'student').length || 0;
      const owners = data?.filter((u: any) => u.role === 'homeowner').length || 0;
      setUserStats({ students, owners });
    };
    fetchUsers();
    const channel = supabase
      .channel('realtime:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchUsers)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users PieChart */}
        <section className="col-span-1">
          <Card className="rounded-2xl shadow-lg bg-white dark:bg-gray-900 p-6">
            <CardHeader className="mb-2 p-0">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Total Users</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ name: 'Students', value: userStats.students }, { name: 'Owners', value: userStats.owners }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      <Cell key="students" fill="#2563eb" />
                      <Cell key="owners" fill="#f59e42" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
} 
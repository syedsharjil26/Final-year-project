import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom';
import { toast } from 'sonner';
import AdminSidebar from './AdminSidebar';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      toast.error('You do not have permission to access this page');
      navigate('/');
      return;
    }
    document.title = 'Admin Dashboard | HomesAway';
    return () => {
      document.title = 'HomesAway Student Accommodation Platform';
    };
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
import { Link, useLocation } from 'react-router-dom';
import { Users, Home, Building2, BarChart, Settings, GraduationCap } from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
  { to: '/admin/users', label: 'User Management', icon: <Users className="h-5 w-5" /> },
  { to: '/admin/listings', label: 'Listing Management', icon: <Building2 className="h-5 w-5" /> },
  { to: '/admin/localities', label: 'University Management', icon: <GraduationCap className="h-5 w-5" /> },
  { to: '/admin/analytics', label: 'Analytics', icon: <BarChart className="h-5 w-5" /> },
  { to: '/admin/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

export default function AdminSidebar() {
  const location = useLocation();
  return (
    <aside className="w-64 p-6 bg-white dark:bg-gray-900 border-r min-h-screen">
      <nav className="space-y-2">
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-primary/10 transition-colors ${
              location.pathname === item.to ? 'bg-primary/10 font-bold' : ''
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
} 
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { PropertyProvider } from '@/contexts/PropertyContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from '@/pages/HomePage';
import ListingsPage from '@/pages/ListingsPage';
import ListingDetailPage from '@/pages/ListingDetailPage';
import LocalitiesPage from '@/pages/LocalitiesPage';
import LocalityDetailPage from '@/pages/LocalityDetailPage';
import AboutPage from '@/pages/AboutPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import StudentDashboardPage from '@/pages/dashboard/StudentDashboardPage';
import HomeownerDashboardPage from '@/pages/dashboard/HomeownerDashboardPage';
import AdminDashboardPage from '@/pages/dashboard/AdminDashboardPage';
import ProfilePage from '@/pages/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';
import AddListingPage from './pages/dashboard/AddListingPage';
import MapExplorerPage from './pages/MapExplorerPage';
import MyListingsPage from '@/pages/dashboard/MyListingsPage';
import StudentMessages from '@/pages/dashboard/student/StudentMessages';
import PropertyDetailPage from './pages/PropertyDetailPage';
import MessageCenterPage from '@/pages/MessageCenterPage';
import HomeownerMessages from '@/pages/dashboard/homeowner/HomeownerMessages';
import AdminUsersPage from '@/pages/dashboard/AdminUsersPage';
import AdminPropertiesPage from '@/pages/dashboard/AdminPropertiesPage';
import AdminLocalitiesPage from '@/pages/dashboard/AdminLocalitiesPage';
import AdminAnalyticsPage from '@/pages/dashboard/AdminAnalyticsPage';
import AdminSettingsPage from '@/pages/dashboard/AdminSettingsPage';
import DashboardOverviewPage from '@/pages/dashboard/DashboardOverviewPage';

import ProtectedRoute from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="homesaway-theme">
      <AuthProvider>
        <PropertyProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow pt-16">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/listings" element={<ListingsPage />} />
                  <Route path="/listings/:id" element={<ListingDetailPage />} />
                  <Route path="/localities" element={<LocalitiesPage />} />
                  <Route path="/localities/:name" element={<LocalityDetailPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/message-center" element={<MessageCenterPage />} />
                  <Route path="/dashboard/student" element={<StudentDashboardPage />} />
                  <Route path="/dashboard/homeowner" element={<HomeownerDashboardPage />} />
                  <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
                  <Route path="/dashboard/student/messages" element={<StudentMessages />} />
                  <Route path="/dashboard/homeowner/messages" element={<HomeownerMessages />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/add-listing" element={<AddListingPage />} />
                  <Route path="/map-explorer" element={<MapExplorerPage />} />
                  <Route path="/my-listings" element={<MyListingsPage />} />
                  <Route path="/property/:id" element={<PropertyDetailPage />} />
                  {/* Admin management routes */}
                  <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboardPage /></ProtectedRoute>}>
                    <Route path="dashboard" element={<DashboardOverviewPage />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="listings" element={<AdminPropertiesPage />} />
                    <Route path="localities" element={<AdminLocalitiesPage />} />
                    <Route path="analytics" element={<AdminAnalyticsPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                  </Route>
                  {/* Protected routes */}
                  <Route
                    path="/student-dashboard/*"
                    element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <StudentDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/homeowner-dashboard/*"
                    element={
                      <ProtectedRoute allowedRoles={['homeowner']}>
                        <HomeownerDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin-dashboard/*"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute allowedRoles={['student', 'homeowner', 'admin']}>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  {/* 404 - Not Found */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </PropertyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
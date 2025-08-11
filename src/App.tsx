import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OTPPage from './pages/OTPPage';
import UserDashboard from './pages/user/UserDashboard';
import VenuesPage from './pages/user/VenuesPage';
import VenueDetailsPage from './pages/user/VenueDetailsPage';
import BookingPage from './pages/user/BookingPage';
import UserProfilePage from './pages/user/UserProfilePage';
import MyBookingsPage from './pages/user/MyBookingsPage';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import FacilityManagement from './pages/owner/FacilityManagement';
import CourtManagement from './pages/owner/CourtManagement';
import TimeSlotManagement from './pages/owner/TimeSlotManagement';
import BookingOverview from './pages/owner/BookingOverview';
import OwnerProfilePage from './pages/owner/OwnerProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import FacilityApproval from './pages/admin/FacilityApproval';
import UserManagement from './pages/admin/UserManagement';
import AdminProfilePage from './pages/admin/AdminProfilePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/otp'];

  // If not authenticated, only show public routes
  if (!isAuthenticated || !user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const getDashboardRoute = () => {
    switch (user?.role) {
      case 'user': return '/user/dashboard';
      case 'owner': return '/owner/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/login';
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={getDashboardRoute()} replace />} />
      
      {/* Public routes (accessible even when authenticated) */}
      <Route path="/login" element={<Navigate to={getDashboardRoute()} replace />} />
      <Route path="/signup" element={<Navigate to={getDashboardRoute()} replace />} />
      <Route path="/otp" element={<Navigate to={getDashboardRoute()} replace />} />
      
      {/* User Routes */}
      <Route path="/user/dashboard" element={
        <ProtectedRoute allowedRoles={['user']}>
          <UserDashboard />
        </ProtectedRoute>
      } />
      <Route path="/user/venues" element={
        <ProtectedRoute allowedRoles={['user']}>
          <VenuesPage />
        </ProtectedRoute>
      } />
      <Route path="/user/venues/:id" element={
        <ProtectedRoute allowedRoles={['user']}>
          <VenueDetailsPage />
        </ProtectedRoute>
      } />
      <Route path="/user/booking/:venueId" element={
        <ProtectedRoute allowedRoles={['user']}>
          <BookingPage />
        </ProtectedRoute>
      } />
      <Route path="/user/profile" element={
        <ProtectedRoute allowedRoles={['user']}>
          <UserProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/user/bookings" element={
        <ProtectedRoute allowedRoles={['user']}>
          <MyBookingsPage />
        </ProtectedRoute>
      } />

      {/* Owner Routes */}
      <Route path="/owner/dashboard" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <OwnerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/owner/facilities" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <FacilityManagement />
        </ProtectedRoute>
      } />
      <Route path="/owner/courts" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <CourtManagement />
        </ProtectedRoute>
      } />
      <Route path="/owner/timeslots" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <TimeSlotManagement />
        </ProtectedRoute>
      } />
      <Route path="/owner/bookings" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <BookingOverview />
        </ProtectedRoute>
      } />
      <Route path="/owner/profile" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <OwnerProfilePage />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/facilities" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <FacilityApproval />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <UserManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/profile" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminProfilePage />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to={getDashboardRoute()} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <div className="min-h-screen bg-gray-50">
            <AppRoutes />
          </div>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
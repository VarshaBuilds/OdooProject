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
import UserProfilePage from './pages/user/UserProfilePage';
import CourtBookingPage from './pages/user/CourtBookingPage';
import BookingConfirmationPage from './pages/user/BookingConfirmationPage';
import FavoritesPage from './pages/user/FavoritesPage';
import BookingPage from './pages/user/BookingPage';
import MyBookingsPage from './pages/user/MyBookingsPage';
import UserProfilePageOwner from './pages/owner/UserProfilePage';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfilePage from './pages/admin/UserProfilePage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'owner') {
      return <Navigate to="/owner/dashboard" replace />;
    } else {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

// Public Route Component
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'owner') {
      return <Navigate to="/owner/dashboard" replace />;
    } else {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <PublicRoute>
                <Navigate to="/login" replace />
              </PublicRoute>
            } />
            
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            
            <Route path="/signup" element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            } />
            
            <Route path="/otp" element={
              <PublicRoute>
                <OTPPage />
              </PublicRoute>
            } />

            {/* User Routes */}
            <Route path="/user/dashboard" element={
              <ProtectedRoute allowedRoles={['user', 'owner', 'admin']}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/user/venues" element={
              <ProtectedRoute allowedRoles={['user', 'owner', 'admin']}>
                <VenuesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/user/venue/:id" element={
              <ProtectedRoute allowedRoles={['user', 'owner', 'admin']}>
                <VenueDetailsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/user/profile" element={
              <ProtectedRoute allowedRoles={['user', 'owner', 'admin']}>
                <UserProfilePage />
              </ProtectedRoute>
            } />
            
            <Route path="/user/court-booking" element={
              <ProtectedRoute allowedRoles={['user', 'owner', 'admin']}>
                <CourtBookingPage />
              </ProtectedRoute>
            } />
            
            <Route path="/user/booking-confirmation" element={
              <ProtectedRoute allowedRoles={['user', 'owner', 'admin']}>
                <BookingConfirmationPage />
              </ProtectedRoute>
            } />
            
            <Route path="/user/booking" element={
              <ProtectedRoute allowedRoles={['user', 'owner', 'admin']}>
                <BookingPage />
              </ProtectedRoute>
            } />
            
            <Route path="/user/my-bookings" element={
              <ProtectedRoute allowedRoles={['user', 'owner', 'admin']}>
                <MyBookingsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/user/favorites" element={
              <ProtectedRoute allowedRoles={['user', 'owner', 'admin']}>
                <FavoritesPage />
              </ProtectedRoute>
            } />

            {/* Owner Routes */}
            <Route path="/owner/dashboard" element={
              <ProtectedRoute allowedRoles={['owner', 'admin']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/owner/profile" element={
              <ProtectedRoute allowedRoles={['owner', 'admin']}>
                <UserProfilePageOwner />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/profile" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminProfilePage />
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
};

export default App;
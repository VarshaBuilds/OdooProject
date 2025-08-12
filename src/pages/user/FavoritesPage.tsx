import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import Navbar from '../../components/Layout/Navbar';
import { MockAPI, Favorite } from '../../services/MockAPI';
import { Star, MapPin, Heart, Calendar, Clock } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const { venues } = useBooking();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getVenueById = useCallback(
    (venueId: string) => {
      return venues.find((venue) => venue.id === venueId);
    },
    [venues]
  );

  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        try {
          setLoading(true);
          const userFavorites = await MockAPI.getUserFavorites(user.id);
          setFavorites(userFavorites);
        } catch (error) {
          console.error('Error loading favorites:', error);
          setError('Failed to load favorites. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadFavorites();
  }, [user]);

  const removeFromFavorites = async (venueId: string, venueName: string) => {
    if (!user) return;

    const confirm = window.confirm(`Are you sure you want to remove ${venueName} from favorites?`);
    if (!confirm) return;

    try {
      await MockAPI.removeFromFavorites(user.id, venueId);
      setFavorites((prev) => prev.filter((fav) => fav.venueId !== venueId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
      setError('Failed to remove from favorites. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-full xs:max-w-md sm:max-w-4xl lg:max-w-6xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-full xs:max-w-md sm:max-w-4xl lg:max-w-6xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">My Favorites</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg text-sm animate-fade-in">
            {error}
          </div>
        )}

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Start exploring venues and add them to your favorites!</p>
            <Link
              to="/user/venues"
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Browse venues"
            >
              Browse Venues
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {favorites.map((favorite) => {
              const venue = getVenueById(favorite.venueId);
              if (!venue) return null;

              return (
                <div
                  key={favorite.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:scale-105 transition-all duration-200"
                >
                  {/* Venue Image */}
                  <div className="relative" style={{padding:'2%'}}>
                    <img
                      src={venue.image || '/fallback-image.jpg'}
                      alt={`${venue.name} venue`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => removeFromFavorites(venue.id, venue.name)}
                        className="p-2.5 sm:p-3 bg-white border border-gray-200 rounded-full hover:bg-red-100 hover:border-red-200 hover:scale-110 transition-all duration-200"
                        aria-label={`Remove ${venue.name} from favorites`}
                      >
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 fill-current hover:fill-none" />
                      </button>
                    </div>
                    <div className="absolute top-3 left-3">
                      <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                        <span className="text-xs sm:text-sm font-medium text-gray-900">{venue.rating ?? 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Venue Details */}
                  <div className="p-4 sm:p-6" style={{padding:'5%'}}>
                    <div className="mb-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                        <Link
                          to={`/user/venue/${venue.id}`}
                          className="hover:text-emerald-600 transition-colors"
                        >
                          {venue.name}
                        </Link>
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        <span className="text-xs sm:text-sm">{venue.location || 'Location not available'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg sm:text-xl font-bold text-emerald-600">₹{venue.price ?? 'N/A'}</span>
                        <span className="text-xs sm:text-sm text-gray-500">per hour</span>
                      </div>
                    </div>

                    {/* Sports Available */}
                    <div className="mb-4" >
                      <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Sports Available</h4>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {venue.sports?.slice(0, 3).map((sport, index) => (
                          <span
                            key={index}
                            className="px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium hover:bg-emerald-200 transition-colors"
                          >
                            {sport}
                          </span>
                        ))}
                        {venue.sports && venue.sports.length > 3 && (
                          <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{venue.sports.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-6" >
                      <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Key Amenities</h4>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {venue.amenities?.slice(0, 4).map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
                          >
                            {amenity}
                          </span>
                        ))}
                        {venue.amenities && venue.amenities.length > 4 && (
                          <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{venue.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3" style={{padding:'2%'}}>
                      <Link
                        to={`/user/venue/${venue.id}`}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-sm hover:shadow-md text-center"  style={{padding:'2%'}}
                        aria-label={`View details for ${venue.name}`}
                      >
                        View Details
                      </Link>
                      <Link 
                        to={`/user/venue/${venue.id}`}
                        className="flex-1 bg-white text-emerald-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium border border-emerald-600 hover:bg-emerald-50 hover:border-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md text-center"style={{padding:'2%'}}
                        aria-label={`Book ${venue.name} now`}
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        {favorites.length > 0 && (
          <div className="mt-8 bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm" style={{margin:'2%',padding:'3%'}}>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4" style={{marginBottom:'2%'}}>Quick Actions</h3>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <Link
                to="/user/venues"
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="Browse all venues"
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Browse All Venues
              </Link>
              <Link
                to="/user/dashboard"
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="View my bookings"
              >
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                View My Bookings
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
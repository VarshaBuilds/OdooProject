import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import Navbar from '../../components/Layout/Navbar';
import { MockAPI, Favorite } from '../../services/MockAPI';
import { Star, MapPin, Heart, Trash2, Calendar, Clock } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const { venues } = useBooking();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        try {
          setLoading(true);
          const userFavorites = await MockAPI.getUserFavorites(user.id);
          setFavorites(userFavorites);
        } catch (error) {
          console.error('Error loading favorites:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadFavorites();
  }, [user]);

  const removeFromFavorites = async (venueId: string) => {
    if (!user) return;
    
    try {
      await MockAPI.removeFromFavorites(user.id, venueId);
      setFavorites(prev => prev.filter(fav => fav.venueId !== venueId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const getVenueById = (venueId: string) => {
    return venues.find(venue => venue.id === venueId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600">
            {favorites.length === 0 
              ? "You haven't added any venues to your favorites yet."
              : `You have ${favorites.length} favorite venue${favorites.length === 1 ? '' : 's'}.`
            }
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">Start exploring venues and add them to your favorites!</p>
            <Link
              to="/user/venues"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Browse Venues
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => {
              const venue = getVenueById(favorite.venueId);
              if (!venue) return null;

              return (
                <div key={favorite.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200">
                  {/* Venue Image */}
                  <div className="relative">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => removeFromFavorites(venue.id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute top-3 left-3">
                      <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">{venue.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Venue Details */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        <Link 
                          to={`/user/venue/${venue.id}`}
                          className="hover:text-emerald-600 transition-colors"
                        >
                          {venue.name}
                        </Link>
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{venue.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-emerald-600">₹{venue.price}</span>
                        <span className="text-sm text-gray-500">per hour</span>
                      </div>
                    </div>

                    {/* Sports Available */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Sports Available</h4>
                      <div className="flex flex-wrap gap-2">
                        {venue.sports?.slice(0, 3).map((sport, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium"
                          >
                            {sport}
                          </span>
                        ))}
                        {venue.sports && venue.sports.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{venue.sports.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Key Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {venue.amenities?.slice(0, 4).map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                        {venue.amenities && venue.amenities.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{venue.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Link
                        to={`/user/venue/${venue.id}`}
                        className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors text-center"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/user/venue/${venue.id}`}
                        className="flex-1 bg-white text-emerald-600 py-2 px-4 rounded-lg text-sm font-medium border border-emerald-600 hover:bg-emerald-50 transition-colors text-center"
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
          <div className="mt-12 bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/user/venues"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Browse All Venues
              </Link>
              <Link
                to="/user/dashboard"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Clock className="w-4 h-4 mr-2" />
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

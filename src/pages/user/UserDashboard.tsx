import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { Booking } from '../../services/MockAPI';
import Navbar from '../../components/Layout/Navbar';
import { Calendar, MapPin, Trophy, Star, TrendingUp, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { venues, getUserBookings } = useBooking();
  const [userBookings, setUserBookings] = React.useState<Booking[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchLocation, setSearchLocation] = React.useState('Ahmedabad');

  React.useEffect(() => {
    const loadUserBookings = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const bookings = await getUserBookings(user.id);
          setUserBookings(bookings || []);
        } catch (error) {
          console.error('Error loading user bookings:', error);
          setUserBookings([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadUserBookings();
  }, [user, getUserBookings]);

  const upcomingBookings = userBookings.filter(b => b.status === 'confirmed');
  const availableVenues = venues; // All venues are available in mock data
  const popularVenues = availableVenues.slice(0, 4);

  const sportCategories = [
    { name: 'Badminton', icon: '🏸', color: 'bg-emerald-100 text-emerald-800' },
    { name: 'Football', icon: '⚽', color: 'bg-blue-100 text-blue-800' },
    { name: 'Cricket', icon: '🏏', color: 'bg-orange-100 text-orange-800' },
    { name: 'Swimming', icon: '🏊', color: 'bg-cyan-100 text-cyan-800' },
    { name: 'Tennis', icon: '🎾', color: 'bg-green-100 text-green-800' },
    { name: 'Table Tennis', icon: '🏓', color: 'bg-purple-100 text-purple-800' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Large Image */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white">
            {/* Top Row: Location Search */}
            <div className="mb-6">
              <div className="bg-white rounded-xl p-4 max-w-md">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Search for locations in India"
                    className="flex-1 text-gray-900 placeholder-gray-500 focus:outline-none"
                  />
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Allow user to search for the locations in India. Allow autocomplete or suggestions for cities.</p>
              </div>
            </div>

            {/* Main Hero Content with Image */}
            <div className="flex items-center justify-between">
              {/* Left Side: Text Content */}
              <div className="flex-1 pr-8">
                <h1 className="text-4xl font-bold mb-4">FIND PLAYERS & VENUES NEARBY</h1>
                <p className="text-emerald-100 text-lg mb-6">Seamlessly explore sports venues and play with sports enthusiasts just like you!</p>
                
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/user/venues"
                    className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors flex items-center space-x-2"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>Browse Venues</span>
                  </Link>
                  <Link
                    to="/user/bookings"
                    className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-400 transition-colors flex items-center space-x-2"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>My Bookings</span>
                  </Link>
                </div>
              </div>

              {/* Right Side: Large Image */}
              <div className="hidden lg:block w-96 h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-2">🖼️</div>
                  <p className="text-lg font-medium">IMAGE</p>
                  <p className="text-xs mt-1">In mobile view, hide the image section;<br/>all other elements and layout should remain unchanged.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Upcoming Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Available Venues</p>
                <p className="text-2xl font-bold text-gray-900">{availableVenues.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{userBookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Book Venues Section with Horizontal Carousel */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">Book Venues</h2>
              <Link
              to="/user/venues"
              className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center space-x-1"
            >
              <span>Book Venues</span>
            </Link>
            </div>
            <Link
              to="/user/venues"
              className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center space-x-1"
            >
              <span>See all venues</span>
            </Link>
          </div>
          
          
          {/* Horizontal Scrollable Venue Carousel */}
          <div className="relative">
            <div className="flex space-x-16 overflow-x-auto pb-4 scrollbar-hide">
              {availableVenues.slice(0, 8).map((venue) => (
                <div
                  key={venue.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200 min-w-[300px] flex-shrink-0"
                >
                  {/* Image Section - 60% of card height */}
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Details Section - 40% of card height */}
                  <div className="p-4">
                    {/* Venue Name and Rating - Same Row */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {venue.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{venue.rating} ({Math.floor(Math.random() * 20) + 5})</span>
                      </div>
                    </div>
                    
                    {/* Location - Below name and rating */}
                    <div className="flex items-center space-x-1 text-sm text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span>{venue.location}</span>
                    </div>
                    
                    {/* First Row of Tags */}
                    <div className="flex space-x-2 mb-2">
                      {/* Sport tag */}
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-md font-medium flex items-center space-x-1">
                        <Search className="w-3 h-3" />
                        <span>{venue.amenities?.find(a => ['Badminton', 'Football', 'Cricket', 'Swimming', 'Tennis', 'Table Tennis'].includes(a)) || 'Sport'}</span>
                      </span>
                      {/* Indoor/Outdoor tag */}
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-md font-medium flex items-center space-x-1">
                        <span>☀️</span>
                        <span>{venue.amenities?.includes('Indoor') ? 'Indoor' : 'Outdoor'}</span>
                      </span>
                    </div>
                    
                    {/* Second Row of Tags */}
                    <div className="flex space-x-2">
                      {/* Top Rated tag - only show if rating >= 4.5 */}
                      {venue.rating >= 4.5 && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>Top Rated</span>
                        </span>
                      )}
                      {/* Price tag - show exact amount */}
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium flex items-center space-x-1">
                        <span>₹</span>
                        <span>{venue.price}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <div className="flex justify-center mt-4 space-x-4">
              <button className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Popular Sports Section - Horizontal Scrollable */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Sports</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {sportCategories.map((sport) => (
              <div
                key={sport.name}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-center min-w-[140px] flex-shrink-0"
              >
                <div className="text-4xl mb-3">{sport.icon}</div>
                <h3 className="font-semibold text-gray-900">
                  {sport.name}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        {upcomingBookings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Bookings</h2>
              <Link
                to="/user/bookings"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View All
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {upcomingBookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="p-6 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {booking.venue?.name || 'Venue Name'}
                      </h3>
                      <p className="text-gray-600">
                        {booking.timeSlot} • {booking.date}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {booking.notes || 'No additional notes'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">Booking #{booking.id.slice(-4)}</p>
                      <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
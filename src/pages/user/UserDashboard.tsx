import React from 'react';
import { useRef } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { Booking, Favorite } from '../../services/MockAPI';
import { MockAPI } from '../../services/MockAPI';
import Navbar from '../../components/Layout/Navbar';
import { Calendar, MapPin, Trophy, Star, TrendingUp, Search, Filter, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

// Import your Chatbot component
import Chatbot from '../../components/Common/chatbot';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { venues, getUserBookings } = useBooking();
  const [userBookings, setUserBookings] = React.useState<Booking[]>([]);
  const [favorites, setFavorites] = React.useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchLocation, setSearchLocation] = React.useState('Ahmedabad');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Chatbot toggle state
  const [showChatbot, setShowChatbot] = React.useState(false);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const [bookings, userFavorites] = await Promise.all([
            getUserBookings(user.id),
            MockAPI.getUserFavorites(user.id)
          ]);
          setUserBookings(bookings || []);
          setFavorites(userFavorites);
        } catch (error) {
          console.error('Error loading user data:', error);
          setUserBookings([]);
          setFavorites([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadUserData();
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
      
      {/* Chatbot Toggle Button */}
      <button
      onClick={() => setShowChatbot((prev) => !prev)}
      className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-emerald-700 transition-all duration-200 flex items-center space-x-2"
      >
      {showChatbot ? 'x' : 'chatBot'}
      </button>
      {/* Chatbot Component (toggle) */}
      {showChatbot && (
      <div className="fixed bottom-20 right-6 z-50">
        <div className="rounded-xl shadow-lg border border-emerald-500 bg-gradient-to-br from-emerald-50 via-blue-50 to-white p-2">
        <Chatbot />
        </div>
      </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        {/* Hero Section with Large Image */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-6 text-white">
           
            {/* Main Hero Content with Image */}
            <div className="flex items-center justify-between">
              {/* Left Side: Text Content */}
              <div className="flex-1 pr-6">
                <div className="mt-12 mb-6 p-6 bg-white rounded-xl max-w-md">
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
              </div>
                <h1 className="text-4xl font-bold mb-4">FIND PLAYERS & VENUES NEARBY</h1>
                <p className="text-emerald-100 text-lg mb-6">Seamlessly explore sports venues and play with sports enthusiasts just like you!</p>
                
              <div className="flex flex-wrap gap-6 justify-start">
              <Link
                to="/user/venues"
                className="bg-white text-emerald-500 px-8 py-4 w-43 rounded-lg font-semibold hover:bg-emerald-50 transition-all shadow-md flex items-center space-x-4 hover:shadow-lg"
              >
                <MapPin className="w-6 h-10" style={{marginLeft:"15px"}}/>
                <span className="text-lg">Browse Venues</span>
              </Link>
              <Link
                to="/user/bookings"
                className="bg-emerald-500 text-white px-8 py-4 w-43 rounded-lg font-semibold hover:bg-emerald-400 transition-all shadow-md flex items-center space-x-4 hover:shadow-lg"
              >
                <Calendar className="w-6 h-10" style={{marginLeft:"15px"}} />
                <span className="text-lg" style={{padding:"6px"}}>My Bookings</span>
              </Link>
            </div>


              </div>

              {/* Right Side: Large Image */}
              <div className="hidden lg:block w-146 h-95 rounded-xl overflow-hidden">
              <img
                src="https://png.pngtree.com/background/20230412/original/pngtree-soccer-field-sports-hall-football-photography-advertising-background-picture-image_2402020.jpg"
                alt="Sports Venue"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            </div>
          </div>
        </div>

         {/* Quick Stats */}
        <div className="pb-4" style={{ padding: '5%'}}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-6 mb-8">
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

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 " style={{margin:'3%'}}>
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
           <Link
              to="/user/venues"
              className="text-emerald-600 hover:text-emerald-700 font-medium flex items-right space-x-1"
            >
              <span>See all venues</span>
            </Link>
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
        <div className="mb-8" style={{ marginTop: '2%' }}>
          <div className="flex items-center justify-between mb-6 px-4 sm:px-0 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900">Book Venues</h2>
          </div>
       
          
      {/* Horizontal Scrollable Venue Carousel */}
          <div className="relative">
            <div ref={scrollRef} className="flex space-x-16 overflow-x-auto pb-2 scrollbar-hide">
              {availableVenues.slice(0, 8).map((venue) => (
                <div
                  key={venue.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200 min-w-[300px] flex-shrink-0"  style={{margin: '3%'}}
                >
                  {/* Image Section - 60% of card height */}
                  <div className="h-48 bg-gray-200 relative overflow-hidden" >
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Details Section - 40% of card height */}
                  <div className="p-6">
                    {/* Venue Name and Rating - Same Row */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg" >
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
                    <div className="flex space-x-2 mb-2"  >
                      {/* Sport tag */}
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-md font-medium flex items-center space-x-1" style={{margin:'1%'}}>
                        <Search className="w-3 h-3" />
                        <span >{venue.amenities?.find(a => ['Badminton', 'Football', 'Cricket', 'Swimming', 'Tennis', 'Table Tennis'].includes(a)) || 'Sport'}</span>
                      </span>
                      {/* Indoor/Outdoor tag */}
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-md font-medium flex items-center space-x-1" >
                        <span>☀️</span>
                        <span >{venue.amenities?.includes('Indoor') ? 'Indoor' : 'Outdoor'}</span>
                      </span>
                    </div>
                    
                    {/* Second Row of Tags */}
                    <div className="flex space-x-2" >
                      {/* Top Rated tag - only show if rating >= 4.5 */}
                      {venue.rating >= 4.5 && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium flex items-center space-x-1" style={{padding:'2%',margin:'5px'}}>
                          <Star className="w-3 h-3 text-yellow-500 fill-current"  />
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
           </div>
            
            {/* Navigation Arrows */}
            <div className="flex justify-center space-x-4">
              <button onClick={scrollLeft}  className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={scrollRight}  className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>

            </div>
          </div>
        </div>

         {/* Popular Sports Section - Horizontal Scrollable */}
        <div className="relative">
          <div className="relative mb-8 max-w-full xs:max-w-md sm:max-w-1xl lg:max-w-6xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 px-4 sm:px-0 text-center">Popular Sports</h2>
            {/* Centered horizontal scroll container */}
            <div className="flex justify-center space-x-4 sm:space-x-6 overflow-x-auto pb-4 scrollbar-hide px-4 sm:px-0">
              {sportCategories.map((sport) => (
          <div
            key={sport.name}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-center flex-shrink-0 min-w-[120px] sm:min-w-[140px]"
            style={{ margin: '1.5rem' }}
          >
            <div className="text-4xl mb-3" style={{ margin: '1.5rem' }}>{sport.icon}</div>
            <h3 className="font-semibold text-gray-900">{sport.name}</h3>
          </div>
              ))}
            </div>  
        </div>

{/* Favorites Section */}
        <div className="relative mb-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {favorites.length > 0 ? (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Favorites</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {favorites.slice(0, 3).map((favorite) => {
                  const venue = venues.find((v) => v.id === favorite.venueId);
                  if (!venue) return null;

                  return (
                    <div
                      key={favorite.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"  style={{padding:'10px'}}
                    >
                      <div className="relative">
                        <img
                          src={venue.image || '/fallback-image.jpg'} // Fallback image
                          alt={`${venue.name} venue`} // More descriptive alt text
                          className="w-full h-48 object-cover"
                        />
                        <button
                          onClick={async () => {
                            try {
                              await MockAPI.removeFromFavorites(user!.id, venue.id);
                              setFavorites((prev) =>
                                prev.filter((f) => f.id !== favorite.id)
                              );
                            } catch (error) {
                              console.error('Error removing from favorites:', error);
                              // Optionally show user feedback (e.g., toast notification)
                            }
                          }}
                          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
                          aria-label={`Remove ${venue.name} from favorites`} // Accessibility improvement
                        >
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                        </button>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg truncate">
                            {venue.name}
                          </h3>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium text-gray-900">
                              {venue.rating ?? 'N/A'} {/* Fallback for undefined rating */}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-600 text-sm mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{venue.location || 'Location not available'}</span> {/* Fallback */}
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-semibold text-emerald-600">
                            ₹{venue.price ?? 'N/A'} {/* Fallback for undefined price */}
                          </span>
                          <span className="text-sm text-gray-500">
                            {venue.sports?.[0] || 'Sport'} {/* Fallback for undefined sports */}
                          </span>
                        </div>

                        <div className="flex gap-3 mt-2">
                          <Link
                          to={`/user/venue/${venue.id}`}
                          className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold hover:bg-gray-100 hover:border-emerald-400 transition-all shadow-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          aria-label={`View details for ${venue.name}`}
                          >
                          View Details
                          </Link>
                          <Link
                          to={`/user/venue/${venue.id}`}
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all shadow-md text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p>No favorites added yet. Start exploring venues to add some!</p>
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="relative mb-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" style={{marginTop: '2%',marginBottom: '2%'}}>
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
    </div>
  );
};

export default UserDashboard;
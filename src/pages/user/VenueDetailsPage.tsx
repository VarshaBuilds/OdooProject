import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import Navbar from '../../components/Layout/Navbar';
import { MockAPI, Review } from '../../services/MockAPI';
import { Star, MapPin, Calendar, Clock, Users, CheckCircle, Heart, Share2, Phone, Mail, Globe, Clock as ClockIcon, Plus, CreditCard, Lock } from 'lucide-react';

const VenueDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { venues } = useBooking();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);


  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  // Find the venue by ID
  const venue = venues.find(v => v.id === id);

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Venue not found</h1>
            <p className="text-gray-600 mt-2">The venue you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  // Load user favorites and check if current venue is favorited
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        try {
          const userFavorites = await MockAPI.getUserFavorites(user.id);
          const favoriteVenueIds = userFavorites.map(fav => fav.venueId);
          setFavorites(favoriteVenueIds);
          setIsFavorite(favoriteVenueIds.includes(venue.id));
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      }
    };

    loadFavorites();
  }, [user, venue.id]);

  const toggleFavorite = async () => {
    if (!user) return;
    
    try {
      if (isFavorite) {
        await MockAPI.removeFromFavorites(user.id, venue.id);
        setFavorites(prev => prev.filter(id => id !== venue.id));
        setIsFavorite(false);
      } else {
        await MockAPI.addToFavorites(user.id, venue.id);
        setFavorites(prev => [...prev, venue.id]);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Mock data for available slots and reviews
  const [availableSlots] = useState([
    { id: '1', time: '09:00 AM - 10:00 AM', available: true, price: venue.price },
    { id: '2', time: '10:00 AM - 11:00 AM', available: true, price: venue.price },
    { id: '3', time: '11:00 AM - 12:00 PM', available: false, price: venue.price },
    { id: '4', time: '12:00 PM - 01:00 PM', available: true, price: venue.price },
    { id: '5', time: '02:00 PM - 03:00 PM', available: true, price: venue.price },
    { id: '6', time: '03:00 PM - 04:00 PM', available: true, price: venue.price },
    { id: '7', time: '04:00 PM - 05:00 PM', available: false, price: venue.price },
    { id: '8', time: '05:00 PM - 06:00 PM', available: true, price: venue.price },
  ]);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      venueId: '1',
      userId: '3',
      userName: 'John Doe',
      rating: 5,
      comment: 'Excellent facility! The courts are well-maintained and the staff is very helpful.',
      date: '2024-01-10',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '2',
      venueId: '1',
      userId: '4',
      userName: 'Sarah Wilson',
      rating: 4,
      comment: 'Great venue for badminton. Good lighting and ventilation. Highly recommended!',
      date: '2024-01-08',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '3',
      venueId: '1',
      userId: '5',
      userName: 'Mike Johnson',
      rating: 5,
      comment: 'Best badminton court in the area. Clean facilities and reasonable pricing.',
      date: '2024-01-05',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '4',
      venueId: '1',
      userId: '6',
      userName: 'Emily Chen',
      rating: 4,
      comment: 'Love the atmosphere here! The courts are always clean and well-maintained.',
      date: '2024-01-03',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ]);

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  const handleBookNow = () => {
    if (selectedDate && selectedTimeSlot) {
      setShowPaymentModal(true);
    }
  };

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setShowPaymentModal(false);
      navigate('/user/booking-confirmation', {
        state: {
          venueName: venue.name,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          price: venue.price
        }
      });
    }, 2000);
  };

  const handleAddReview = async () => {
    if (newReview.comment.trim() && user) {
      try {
        const reviewData = {
          venueId: venue.id,
          userId: user.id,
          userName: user.fullName,
          rating: newReview.rating,
          comment: newReview.comment,
          date: new Date().toISOString().split('T')[0],
          userAvatar: user.avatar || 'https://images.unsplash.com/icon-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        };
        
        const newReviewData = await MockAPI.addReview(reviewData);
        setReviews([newReviewData, ...reviews]);
        setNewReview({ rating: 5, comment: '' });
        setShowReviewForm(false);
      } catch (error) {
        console.error('Error adding review:', error);
      }
    }
  };

  const getSportIcon = (sport: string) => {
    // Return appropriate icon based on sport
    return <CheckCircle className="w-5 h-5 text-emerald-600" />;
  };

  const getVenueType = () => {
    if (venue.amenities?.includes('Indoor')) return 'Indoor';
    if (venue.amenities?.includes('Outdoor')) return 'Outdoor';
    return 'Indoor/Outdoor';
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === (venue.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? (venue.images?.length || 1) - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Complete Payment</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Booking Summary</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Venue: {venue.name}</div>
                  <div>Date: {selectedDate}</div>
                  <div>Time: {selectedTimeSlot}</div>
                  <div className="font-medium text-emerald-600">Total: ₹{venue.price}</div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="netbanking">Net Banking</option>
                </select>
              </div>
              
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}
              
              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    placeholder="username@upi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
              
              {paymentMethod === 'netbanking' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Bank
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Select your bank</option>
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}
            </div>
            
            <button
              onClick={handlePayment}
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Pay ₹{venue.price}</span>
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Photo Gallery */}
        <div className="mb-8">
          <div className="relative">
            <img
              src={venue.images?.[selectedImageIndex] || venue.image}
              alt={venue.name}
              className="w-full h-96 object-cover rounded-xl"
            />
            
            {/* Image Navigation */}
            {venue.images && venue.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {venue.images?.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={toggleFavorite}
                className={`p-3 rounded-full shadow-lg transition-colors ${
                  isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-3 bg-white text-gray-600 rounded-full shadow-lg hover:text-emerald-600 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          {venue.images && venue.images.length > 1 && (
            <div className="mt-4 flex space-x-2 overflow-x-auto">
              {venue.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedImageIndex ? 'border-emerald-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${venue.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Venue Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Venue Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{venue.name}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">{venue.rating}</span>
                      <span className="text-gray-600">({reviews.length})</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{venue.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-600">₹{venue.price}</div>
                  <div className="text-sm text-gray-600">per hour</div>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                {venue.description || 'Experience world-class sports facilities in a premium location. Our venue offers state-of-the-art equipment, professional coaching, and a welcoming environment for sports enthusiasts of all skill levels.'}
              </p>

              {/* Address */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-700">{venue.address}</p>
                </div>
              </div>
            </div>

            {/* Sports Available */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sports Available</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {venue.sports?.map((sport, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    {getSportIcon(sport)}
                    <span className="text-emerald-800 font-medium">{sport}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* About Venue */}
            {venue.aboutVenue && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Venue</h2>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{venue.aboutVenue}</p>
                </div>
              </div>
            )}

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities & Facilities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {venue.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Slots */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Time Slots</h2>
              <div className="space-y-3">
                {availableSlots.map(slot => (
                  <div
                    key={slot.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      slot.available
                        ? 'border-emerald-200 bg-emerald-50 hover:border-emerald-300'
                        : 'border-gray-200 bg-gray-50 opacity-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-emerald-600" />
                      <span className="font-medium text-gray-900">{slot.time}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-emerald-600">₹{slot.price}</span>
                      {slot.available ? (
                        <button
                          onClick={() => {
                            setSelectedTimeSlot(slot.time);
                            setSelectedDate(selectedDate);
                          }}
                          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                        >
                          Select
                        </button>
                      ) : (
                        <span className="text-gray-500 text-sm">Booked</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Reviews Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Customer Reviews</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">{venue.rating}</span>
                    </div>
                    <span className="text-gray-600">• {reviews.length} reviews</span>
                  </div>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Review</span>
                  </button>
                </div>
              </div>
              
              {/* Add Review Form */}
              {showReviewForm && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setNewReview({...newReview, rating: star})}
                            className={`text-2xl ${
                              star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review
                      </label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        placeholder="Share your experience with this venue..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleAddReview}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                      >
                        Submit Review
                      </button>
                      <button
                        onClick={() => setShowReviewForm(false)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-start space-x-4">
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{review.userName}</span>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2 leading-relaxed">{review.comment}</p>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book This Venue</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time Slot
                  </label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Choose a time slot</option>
                    {availableSlots
                      .filter(slot => slot.available)
                      .map(slot => (
                        <option key={slot.id} value={slot.time}>
                          {slot.time} - ₹{slot.price}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Players
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    defaultValue="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <button
                  onClick={handleBookNow}
                  disabled={!selectedDate || !selectedTimeSlot}
                  className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Book Now</span>
                </button>
              </div>

              {/* Quick Info */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Venue Type:</span>
                  <span className="font-medium text-gray-900">{getVenueType()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-medium text-gray-900">{venue.rating}/5</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-emerald-600">₹{venue.price}/hour</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Sports:</span>
                  <span className="font-medium text-gray-900">{venue.sports?.length || 0} available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailsPage;
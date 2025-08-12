import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import Navbar from '../../components/Layout/Navbar';
import { Calendar, Clock, MapPin, Trophy, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const BookingPage = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBooking } = useBooking();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [venue, setVenue] = useState<any>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    const fetchVenue = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Mock API call - replace with actual API endpoint
        const response = await new Promise(resolve => {
          setTimeout(() => resolve({
            id: venueId,
            name: 'Premium Sports Complex',
            location: 'Downtown Area',
            rating: 4.5,
            price: 50,
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
          }), 500);
        });
        setVenue(response);
        
        // Mock time slots API call - replace with actual API endpoint
        const timeSlots = await new Promise<string[]>(resolve => {
          setTimeout(() => resolve([
            '09:00 AM - 10:00 AM',
            '10:00 AM - 11:00 AM',
            '11:00 AM - 12:00 PM',
            '02:00 PM - 03:00 PM',
            '03:00 PM - 04:00 PM',
            '04:00 PM - 05:00 PM'
          ]), 500);
        });
        setAvailableTimeSlots(timeSlots);
      } catch (err) {
        setError('Failed to load venue details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenue();
  }, [venueId]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert('Please select both date and time slot');
      return;
    }

    setIsLoading(true);
    try {
      await createBooking({
        venueId: venueId!,
        userId: user!.id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        totalAmount: 0,
        createdAt: ''
      });
      
      alert('Booking created successfully!');
      navigate('/user/my-bookings');
    } catch (error) {
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-full xs:max-w-md sm:max-w-4xl mx-auto px-2 xs:px-3 sm:px-6 py-6 xs:py-8">
          <div className="bg-red-100 text-red-800 p-4 rounded-lg text-xs xs:text-sm">
            {error || 'Venue not found. Please try again later.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-full xs:max-w-md sm:max-w-4xl lg:max-w-6xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-6 xs:py-8">
        <div className="mb-4 xs:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors duration-200 text-xs xs:text-sm"
          >
            <ArrowLeft className="w-4 h-4 xs:w-5 xs:h-5 mr-2" />
            Back to Venue
          </button>
          
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mt-2 xs:mt-4">Book Venue</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6 sm:gap-8">
          {/* Venue Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 xs:p-5 sm:p-6 animate-fade-in">
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900 mb-3 xs:mb-4">Venue Details</h2>
            
            <div className="mb-3 xs:mb-4">
              <img
                src={venue.image}
                alt={venue.name}
                className="w-full h-40 xs:h-48 sm:h-56 object-cover rounded-lg"
              />
            </div>
            
            <div className="space-y-2 xs:space-y-3">
              <div className="flex items-center">
                <Trophy className="w-4 h-4 xs:w-5 xs:h-5 text-yellow-500 mr-2" />
                <span className="font-medium text-xs xs:text-sm sm:text-base">{venue.name}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-4 h-4 xs:w-5 xs:h-5 text-gray-500 mr-2" />
                <span className="text-gray-600 text-xs xs:text-sm">{venue.location}</span>
              </div>
              
              <div className="flex items-center xs:hidden sm:flex">
                <span className="text-gray-600 text-xs xs:text-sm">Rating: </span>
                <span className="ml-2 text-yellow-500 text-xs xs:text-sm">★ {venue.rating}</span>
              </div>
              
              <div className="text-lg xs:text-xl sm:text-2xl font-bold text-emerald-600">
                ${venue.price}/hour
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 xs:p-5 sm:p-6 animate-fade-in">
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900 mb-3 xs:mb-4">Booking Details</h2>
            
            <div className="space-y-3 xs:space-y-4">
              <div>
                <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-2 xs:px-3 py-1.5 xs:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 text-xs xs:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
                  Select Time Slot
                </label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full px-2 xs:px-3 py-1.5 xs:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 text-xs xs:text-sm"
                >
                  <option value="">Choose a time slot</option>
                  {availableTimeSlots.map((slot, index) => (
                    <option key={index} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 xs:pt-4">
                <button
                  onClick={handleBooking}
                  disabled={isLoading || !selectedDate || !selectedTimeSlot}
                  className="w-full bg-emerald-600 text-white py-2 xs:py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 hover:scale-105 text-xs xs:text-sm"
                >
                  {isLoading ? <LoadingSpinner /> : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Confirm Booking</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
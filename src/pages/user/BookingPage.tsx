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
  const [isLoading, setIsLoading] = useState(false);
  const [venue, setVenue] = useState<any>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    // Mock venue data - in real app, fetch from API
    setVenue({
      id: venueId,
      name: 'Premium Sports Complex',
      location: 'Downtown Area',
      rating: 4.5,
      price: 50,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
    });
    
    // Mock time slots
    setAvailableTimeSlots([
      '09:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM',
      '11:00 AM - 12:00 PM',
      '02:00 PM - 03:00 PM',
      '03:00 PM - 04:00 PM',
      '04:00 PM - 05:00 PM'
    ]);
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
        status: 'pending'
      });
      
      alert('Booking created successfully!');
      navigate('/user/bookings');
    } catch (error) {
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!venue) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Venue
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Book Venue</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Venue Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Venue Details</h2>
            
            <div className="mb-4">
              <img
                src={venue.image}
                alt={venue.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="font-medium">{venue.name}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-gray-600">{venue.location}</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-gray-600">Rating: </span>
                <span className="ml-2 text-yellow-500">★ {venue.rating}</span>
              </div>
              
              <div className="text-2xl font-bold text-green-600">
                ${venue.price}/hour
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time Slot
                </label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a time slot</option>
                  {availableTimeSlots.map((slot, index) => (
                    <option key={index} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleBooking}
                  disabled={isLoading || !selectedDate || !selectedTimeSlot}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? <LoadingSpinner /> : 'Confirm Booking'}
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

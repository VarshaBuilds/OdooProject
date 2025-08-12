import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import Navbar from '../../components/Layout/Navbar';
import { Calendar, Clock, MapPin, Users, FileText, Check } from 'lucide-react';

const CourtBookingPage: React.FC = () => {
  const { user } = useAuth();
  const { venues } = useBooking();
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [formData, setFormData] = useState({
    venueName: '',
    sport: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: '',
    numberOfPlayers: 1
  });

  const [availableSlots] = useState([
    { id: '1', time: '09:00 AM - 10:00 AM', available: true },
    { id: '2', time: '10:00 AM - 11:00 AM', available: true },
    { id: '3', time: '11:00 AM - 12:00 PM', available: false },
    { id: '4', time: '12:00 PM - 01:00 PM', available: true },
    { id: '5', time: '02:00 PM - 03:00 PM', available: true },
    { id: '6', time: '03:00 PM - 04:00 PM', available: true },
    { id: '7', time: '04:00 PM - 05:00 PM', available: false },
    { id: '8', time: '05:00 PM - 06:00 PM', available: true },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckAvailability = () => {
    // Check availability logic would go here
    console.log('Checking availability for:', formData);
  };

  const handleBookSlot = (slotId: string) => {
    setSelectedSlot(slotId);
    setShowModal(true);
  };

  const handleConfirmBooking = () => {
    // Booking confirmation logic would go here
    console.log('Confirming booking:', { ...formData, selectedSlot });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"  style={{padding:'3%'}}>
          <h1 className="flex justify-center items-center text-3xl font-bold text-gray-900 mb-6" style={{padding:'1.5%'}} >Court Booking</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12"  >
            {/* Left Side - Booking Form */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6" >Booking Details</h2>
              
              <div className="space-y-6" >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{padding:'1.2%'}}>
                    Venue Name
                  </label>
                  <select style={{padding:'2%'}}
                    name="venueName"
                    value={formData.venueName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="" >Select a venue</option>
                    {venues.map(venue => (
                      <option key={venue.id} value={venue.name}>
                        {venue.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 p-4"  style={{padding:'1.2%'}}>
                    Sport
                  </label>
                  <select  style={{padding:'2%'}}
                    name="sport"
                    value={formData.sport}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select a sport</option>
                    <option value="badminton">Badminton</option>
                    <option value="football">Football</option>
                    <option value="cricket">Cricket</option>
                    <option value="swimming">Swimming</option>
                    <option value="tennis">Tennis</option>
                    <option value="table-tennis">Table Tennis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"  style={{padding:'1.2%'}}>
                    Date
                  </label>
                  <input  style={{padding:'2%'}}
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4"  style={{padding:'1.2%'}}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input  style={{padding:'2%'}}
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"  style={{padding:'1.2%'}}>
                      End Time
                    </label>
                    <input  style={{padding:'2%'}}
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCheckAvailability}
                  className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Check className="w-5 h-5"  style={{margin:'2%'}} />
                  <span>Check Availability</span>
                </button>
              </div>
            </div>

            {/* Right Side - Available Slots */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6" >Available Slots</h2>
              
              <div className="space-y-3">
                {availableSlots.map(slot => (
                  <div
                    key={slot.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      slot.available
                        ? 'border-emerald-200 bg-emerald-50 hover:border-emerald-300'
                        : 'border-gray-200 bg-gray-50 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between" >
                      <div className="flex items-center space-x-3" style={{padding:'2%'}}>
                        <Clock className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium text-gray-900">{slot.time}</span>
                      </div>
                      {slot.available ? (
                        <button
                          onClick={() => handleBookSlot(slot.id)}
                          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors" style={{padding:'3%'}}
                        >
                          Book Now
                        </button>
                      ) : (
                        <span className=" text-gray-500 text-sm " style={{padding:'3%'}}>Booked</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" >
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Any special requirements or notes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" >
                  Number of Players
                </label>
                <input
                  type="number"
                  name="numberOfPlayers"
                  value={formData.numberOfPlayers}
                  onChange={(e) => setFormData({ ...formData, numberOfPlayers: parseInt(e.target.value) })}
                  min="1"
                  max="20"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              > 
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourtBookingPage;

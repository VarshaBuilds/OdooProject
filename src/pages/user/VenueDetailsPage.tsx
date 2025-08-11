import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBooking } from '../../contexts/BookingContext';
import Navbar from '../../components/Layout/Navbar';
import { 
  MapPin, 
  Star, 
  Clock, 
  Wifi, 
  Car, 
  Coffee, 
  Shield, 
  Snowflake,
  ArrowLeft,
  Calendar,
  Trophy
} from 'lucide-react';

const VenueDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getVenueById, getCourtsForVenue } = useBooking();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const venue = id ? getVenueById(id) : null;
  const courts = id ? getCourtsForVenue(id) : [];

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Venue not found</h3>
            <p className="text-gray-600 mb-4">The venue you're looking for doesn't exist.</p>
            <Link
              to="/user/venues"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Back to Venues
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const amenityIcons: { [key: string]: React.ComponentType<any> } = {
    'Parking': Car,
    'Wifi': Wifi,
    'Cafeteria': Coffee,
    'Air Conditioning': Snowflake,
    'Security': Shield,
    'Locker Rooms': Shield,
    'Changing Rooms': Shield,
    'Water Station': Coffee,
    'First Aid': Shield,
    'Pro Shop': Coffee,
    'Equipment Rental': Trophy,
    'Coaching Available': Trophy
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/user/venues"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Venues</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              <div className="aspect-video bg-gray-200 relative">
                <img
                  src={venue.images[selectedImageIndex]}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
                {venue.images.length > 1 && (
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    {venue.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {venue.images.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {venue.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === selectedImageIndex ? 'border-emerald-500' : 'border-gray-200'
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

            {/* Venue Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{venue.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{venue.address}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{venue.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{venue.description}</p>

              {/* Sports Available */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sports Available</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.sports.map((sport) => (
                    <span
                      key={sport}
                      className="px-3 py-2 bg-emerald-100 text-emerald-800 rounded-lg font-medium"
                    >
                      {sport}
                    </span>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {venue.amenities.map((amenity) => {
                    const IconComponent = amenityIcons[amenity] || Trophy;
                    return (
                      <div key={amenity} className="flex items-center space-x-2 text-gray-700">
                        <IconComponent className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Courts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Courts</h3>
              {courts.length === 0 ? (
                <p className="text-gray-600">No courts available at this venue.</p>
              ) : (
                <div className="space-y-4">
                  {courts.map((court) => (
                    <div key={court.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{court.name}</h4>
                          <p className="text-gray-600">{court.sport}</p>
                          <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                            <Clock className="w-4 h-4" />
                            <span>{court.operatingHours.start} - {court.operatingHours.end}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">₹{court.pricePerHour}/hr</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            court.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {court.isActive ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Starting from</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{venue.rating}</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">₹{venue.priceRange.min}</p>
                <p className="text-gray-600">per hour</p>
              </div>

              <Link
                to={`/user/booking/${venue.id}`}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Now</span>
              </Link>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="text-gray-900">{venue.location.city}, {venue.location.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sports</span>
                    <span className="text-gray-900">{venue.sports.length} available</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price Range</span>
                    <span className="text-gray-900">₹{venue.priceRange.min} - ₹{venue.priceRange.max}</span>
                  </div>
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
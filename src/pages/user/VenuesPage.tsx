import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useBooking } from '../../contexts/BookingContext';
import Navbar from '../../components/Layout/Navbar';
import { Search, Filter, MapPin, Star, Trophy, Calendar } from 'lucide-react';

const VenuesPage: React.FC = () => {
  const { venues } = useBooking();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedSport, setSelectedSport] = useState(searchParams.get('sport') || '');
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || '');
  const [venueType, setVenueType] = useState(searchParams.get('type') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'rating');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Get unique sports and amenities options
  const sportOptions = useMemo(() => {
    const sports = new Set<string>();
    venues.forEach(venue => {
      if (venue.sports) {
        venue.sports.forEach(sport => {
          sports.add(sport);
        });
      }
    });
    return Array.from(sports).sort();
  }, [venues]);

  // Filter and sort venues
  const filteredVenues = useMemo(() => {
    let filtered = venues; // All venues are available in mock data

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (venue.sports && venue.sports.some(sport => 
          sport.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (venue.amenities && venue.amenities.some(amenity => 
          amenity.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
    }

    // Sport filter
    if (selectedSport) {
      filtered = filtered.filter(venue =>
        venue.sports && venue.sports.includes(selectedSport)
      );
    }

    // Price filter
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(venue => {
        if (max === 999) {
          return venue.price >= min;
        }
        return venue.price >= min && venue.price <= max;
      });
    }

    // Venue type filter
    if (venueType) {
      filtered = filtered.filter(venue => {
        if (venueType === 'indoor') {
          return venue.amenities && venue.amenities.includes('Indoor');
        } else if (venueType === 'outdoor') {
          return venue.amenities && !venue.amenities.includes('Indoor');
        }
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [venues, searchQuery, selectedSport, priceRange, venueType, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredVenues.length / itemsPerPage);
  const paginatedVenues = filteredVenues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updateSearchParams = (key: string, value: string) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sports Venues</h1>
          <p className="text-gray-600" style={{marginBottom:'2%'}}>Find and book the perfect sports facility for your needs</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2  transform -translate-x-7/4 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search venues, locations..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  updateSearchParams('search', e.target.value);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Sport Filter */}
            <select
              value={selectedSport}
              onChange={(e) => {
                setSelectedSport(e.target.value);
                updateSearchParams('sport', e.target.value);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Sports</option>
              {sportOptions.map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>

            {/* Price Filter */}
            <select
              value={priceRange}
              onChange={(e) => {
                setPriceRange(e.target.value);
                updateSearchParams('price', e.target.value);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Prices</option>
              <option value="0-200">₹0 - ₹200</option>
              <option value="200-400">₹200 - ₹400</option>
              <option value="400-600">₹400 - ₹600</option>
              <option value="600-999">₹600+</option>
            </select>

            {/* Venue Type Filter */}
            <select
              value={venueType}
              onChange={(e) => {
                setVenueType(e.target.value);
                updateSearchParams('type', e.target.value);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Types</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                updateSearchParams('sort', e.target.value);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="rating">Sort by Rating</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            
            {(searchQuery || selectedSport || priceRange || venueType) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSport('');
                  setPriceRange('');
                  setVenueType('');
                  setSearchParams(new URLSearchParams());
                  setCurrentPage(1);
                }}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Venues Grid */}
        {paginatedVenues.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No venues found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-8" style={{margin:'5%'}}>
            {paginatedVenues.map((venue) => (
              <Link
                key={venue.id}
                to={`/user/venue/${venue.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer" 
              >
                {/* Image Section - 60% of card height */}
                <div className="h-48 bg-gray-110 relative overflow-hidden" style={{padding:'4%'}}>
                  <img className="w-full h-full object-cover rounded-lg"
                    src={venue.image}
                    alt={venue.name}
                    
                  />
                </div>
                
                {/* Details Section - 40% of card height */}
                <div className="p-4" style={{padding:'5px'}}>
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
                      <span>{venue.sports?.[0] || 'Sport'}</span>
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
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium flex items-center space-x-1" >
                      <span>₹</span>
                      <span>{venue.price}</span>
                    </span>
                  </div>
                  
                  {/* Book Now Button */}
                  <div className="mt-3" style={{padding:'8%'}} >
                    <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors" style={{padding:'3%'}} >
                      Book Now
                    </button>
                  </div>
                </div>
              </Link>
              ))}
            </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                  currentPage === page
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenuesPage;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Layout/Navbar';
import { 
  MapPin, 
  Users, 
  Calendar, 
  DollarSign, 
  Plus, 
  Settings, 
  BarChart3, 
  TrendingUp,
  Clock,
  Building2,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import MockAPI, { Venue, Booking } from '../../services/MockAPI';

interface Court {
  id: string;
  name: string;
  sportType: string;
  pricePerHour: number;
  operatingHours: {
    open: string;
    close: string;
  };
  isActive: boolean;
}

interface TimeSlot {
  id: string;
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBlocked: boolean;
  reason?: string;
}

const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'facilities' | 'courts' | 'bookings' | 'profile'>('dashboard');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddVenue, setShowAddVenue] = useState(false);
  const [showAddCourt, setShowAddCourt] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [showTimeSlotManager, setShowTimeSlotManager] = useState(false);
  const [showEditVenue, setShowEditVenue] = useState(false);
  const [showEditCourt, setShowEditCourt] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [newVenueData, setNewVenueData] = useState({
    name: '',
    location: '',
    description: '',
    price: 0,
    amenities: [] as string[]
  });
  const [newCourtData, setNewCourtData] = useState({
    name: '',
    sportType: '',
    pricePerHour: 0,
    operatingHours: { open: '06:00', close: '22:00' }
  });

  // Mock data for owner-specific stats
  const ownerStats = {
    totalBookings: 24,
    activeCourts: 8,
    earnings: 12450,
    pendingBookings: 3
  };

  useEffect(() => {
    loadOwnerData();
  }, []);

  const loadOwnerData = async () => {
    setIsLoading(true);
    try {
      // Load owner's venues and related data
      const ownerVenues = await MockAPI.getVenues();
      const ownerBookings = await MockAPI.getUserBookings(user?.id || '');
      
      setVenues(ownerVenues);
      
      // Generate mock bookings for owner if none exist
      if (ownerBookings.length === 0) {
        const mockBookings: Booking[] = [
          {
            id: '1',
            venueId: '1',
            userId: 'user1',
            date: '2024-01-15',
            timeSlot: '10:00 - 11:00',
            status: 'confirmed',
            notes: 'Regular booking',
            totalAmount: 500,
            createdAt: '2024-01-10T10:00:00Z',
            venue: ownerVenues[0]
          },
          {
            id: '2',
            venueId: '2',
            userId: 'user2',
            date: '2024-01-16',
            timeSlot: '14:00 - 15:00',
            status: 'pending',
            notes: 'New customer',
            totalAmount: 800,
            createdAt: '2024-01-11T14:00:00Z',
            venue: ownerVenues[1]
          },
          {
            id: '3',
            venueId: '3',
            userId: 'user3',
            date: '2024-01-17',
            timeSlot: '16:00 - 17:00',
            status: 'confirmed',
            notes: 'Weekly booking',
            totalAmount: 600,
            createdAt: '2024-01-12T16:00:00Z',
            venue: ownerVenues[2]
          }
        ];
        setBookings(mockBookings);
      } else {
        setBookings(ownerBookings);
      }
      
      // Generate mock courts and time slots
      generateMockCourts();
      generateMockTimeSlots();
    } catch (error) {
      console.error('Error loading owner data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockCourts = () => {
    const mockCourts: Court[] = [
      {
        id: '1',
        name: 'Court A',
        sportType: 'Badminton',
        pricePerHour: 500,
        operatingHours: { open: '06:00', close: '22:00' },
        isActive: true
      },
      {
        id: '2',
        name: 'Court B',
        sportType: 'Tennis',
        pricePerHour: 800,
        operatingHours: { open: '06:00', close: '22:00' },
        isActive: true
      },
      {
        id: '3',
        name: 'Court C',
        sportType: 'Basketball',
        pricePerHour: 600,
        operatingHours: { open: '06:00', close: '22:00' },
        isActive: true
      }
    ];
    setCourts(mockCourts);
  };

  const generateMockTimeSlots = () => {
    const mockTimeSlots: TimeSlot[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      for (let hour = 6; hour < 22; hour++) {
        mockTimeSlots.push({
          id: `${i}-${hour}`,
          courtId: '1',
          date: date.toISOString().split('T')[0],
          startTime: `${hour.toString().padStart(2, '0')}:00`,
          endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
          isAvailable: Math.random() > 0.3,
          isBlocked: false
        });
      }
    }
    setTimeSlots(mockTimeSlots);
  };

  const handleTimeSlotManagement = (court: Court) => {
    setSelectedCourt(court);
    setShowTimeSlotManager(true);
  };

  const toggleTimeSlotAvailability = (timeSlotId: string) => {
    setTimeSlots(prev => prev.map(slot => 
      slot.id === timeSlotId 
        ? { ...slot, isAvailable: !slot.isAvailable }
        : slot
    ));
  };

  const blockTimeSlot = (timeSlotId: string, reason: string) => {
    setTimeSlots(prev => prev.map(slot => 
      slot.id === timeSlotId 
        ? { ...slot, isBlocked: true, reason }
        : slot
    ));
  };

  const handleAddVenue = () => {
    setShowAddVenue(true);
    setNewVenueData({
      name: '',
      location: '',
      description: '',
      price: 0,
      amenities: []
    });
  };

  const handleEditVenue = (venue: Venue) => {
    setEditingVenue(venue);
    setNewVenueData({
      name: venue.name,
      location: venue.location,
      description: venue.description || '',
      price: venue.price,
      amenities: venue.amenities || []
    });
    setShowEditVenue(true);
  };

  const handleDeleteVenue = (venueId: string) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      setVenues(prev => prev.filter(v => v.id !== venueId));
    }
  };

  const handleSaveVenue = () => {
    if (newVenueData.name && newVenueData.location && newVenueData.price > 0) {
      const newVenue: Venue = {
        id: Date.now().toString(),
        name: newVenueData.name,
        location: newVenueData.location,
        description: newVenueData.description,
        price: newVenueData.price,
        rating: 0,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        amenities: newVenueData.amenities,
        ownerId: user?.id || '',
        status: 'approved',
        submittedAt: new Date().toISOString(),
        approvedAt: new Date().toISOString()
      };
      setVenues(prev => [...prev, newVenue]);
      setShowAddVenue(false);
      setNewVenueData({
        name: '',
        location: '',
        description: '',
        price: 0,
        amenities: []
      });
    }
  };

  const handleUpdateVenue = () => {
    if (editingVenue && newVenueData.name && newVenueData.location && newVenueData.price > 0) {
      setVenues(prev => prev.map(v => 
        v.id === editingVenue.id 
          ? { ...v, ...newVenueData }
          : v
      ));
      setShowEditVenue(false);
      setEditingVenue(null);
      setNewVenueData({
        name: '',
        location: '',
        description: '',
        price: 0,
        amenities: []
      });
    }
  };

  const handleAddCourt = () => {
    setShowAddCourt(true);
    setNewCourtData({
      name: '',
      sportType: '',
      pricePerHour: 0,
      operatingHours: { open: '06:00', close: '22:00' }
    });
  };

  const handleEditCourt = (court: Court) => {
    setEditingCourt(court);
    setNewCourtData({
      name: court.name,
      sportType: court.sportType,
      pricePerHour: court.pricePerHour,
      operatingHours: court.operatingHours
    });
    setShowEditCourt(true);
  };

  const handleSaveCourt = () => {
    if (newCourtData.name && newCourtData.sportType && newCourtData.pricePerHour > 0) {
      const newCourt: Court = {
        id: Date.now().toString(),
        name: newCourtData.name,
        sportType: newCourtData.sportType,
        pricePerHour: newCourtData.pricePerHour,
        operatingHours: newCourtData.operatingHours,
        isActive: true
      };
      setCourts(prev => [...prev, newCourt]);
      setShowAddCourt(false);
      setNewCourtData({
        name: '',
        sportType: '',
        pricePerHour: 0,
        operatingHours: { open: '06:00', close: '22:00' }
      });
    }
  };

  const handleUpdateCourt = () => {
    if (editingCourt && newCourtData.name && newCourtData.sportType && newCourtData.pricePerHour > 0) {
      setCourts(prev => prev.map(c => 
        c.id === editingCourt.id 
          ? { ...c, ...newCourtData }
          : c
      ));
      setShowEditCourt(false);
      setEditingCourt(null);
      setNewCourtData({
        name: '',
        sportType: '',
        pricePerHour: 0,
        operatingHours: { open: '06:00', close: '22:00' }
      });
    }
  };

  const renderDashboardTab = () => (
    <div className="space-y-8">
      {/* Welcome Message and KPIs */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome, {user?.fullName}! 👋</h2>
        <p className="text-emerald-100 text-lg">Here's what's happening with your facilities today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{ownerStats.totalBookings}</p>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Active Courts</p>
              <p className="text-3xl font-bold text-gray-900">{ownerStats.activeCourts}</p>
            </div>
            <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Earnings</p>
              <p className="text-3xl font-bold text-gray-900">₹{ownerStats.earnings.toLocaleString()}</p>
            </div>
            <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Pending</p>
              <p className="text-3xl font-bold text-gray-900">{ownerStats.pendingBookings}</p>
            </div>
            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily/Weekly/Monthly Booking Trends */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Booking Trends</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Chart coming soon...</p>
            </div>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Earnings Summary</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Chart coming soon...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => setActiveTab('facilities')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-center"
          >
            <div className="flex flex-col items-center space-y-3">
              <Plus className="w-10 h-10 text-emerald-600" />
              <span className="font-medium text-gray-700 text-lg">Add New Venue</span>
              <span className="text-sm text-gray-500">Create and manage venues</span>
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('courts')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <div className="flex flex-col items-center space-y-3">
              <Building2 className="w-10 h-10 text-blue-600" />
              <span className="font-medium text-gray-700 text-lg">Manage Courts</span>
              <span className="text-sm text-gray-500">Set up and configure courts</span>
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('bookings')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
          >
            <div className="flex flex-col items-center space-y-3">
              <Calendar className="w-10 h-10 text-purple-600" />
              <span className="font-medium text-gray-700 text-lg">View Bookings</span>
              <span className="text-sm text-gray-500">Monitor all reservations</span>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Bookings</h3>
        <div className="space-y-4">
          {bookings.slice(0, 5).map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{booking.venue?.name}</p>
                  <p className="text-sm text-gray-600">{booking.date} at {booking.timeSlot}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFacilitiesTab = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Facility Management</h2>
        <button
          onClick={handleAddVenue}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Facility</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {venues.map((venue) => (
          <div key={venue.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <img 
              src={venue.image} 
              alt={venue.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{venue.name}</h3>
            <p className="text-gray-600 mb-4">{venue.description}</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{venue.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">₹{venue.price}/hour</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {venue.amenities?.slice(0, 3).map((amenity, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {amenity}
                </span>
              ))}
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => handleEditVenue(venue)}
                className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button 
                onClick={() => handleDeleteVenue(venue.id)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCourtsTab = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Court Management</h2>
        <button
          onClick={handleAddCourt}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Court</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courts.map((court) => (
          <div key={court.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{court.name}</h3>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                court.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {court.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Sport Type:</span>
                <span className="font-medium text-gray-900">{court.sportType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price/Hour:</span>
                <span className="font-medium text-gray-900">₹{court.pricePerHour}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Hours:</span>
                <span className="font-medium text-gray-900">{court.operatingHours.open} - {court.operatingHours.close}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => handleTimeSlotManagement(court)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Time Slots</span>
              </button>
              <button 
                onClick={() => handleEditCourt(court)}
                className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBookingsTab = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Booking Overview</h2>
        <div className="flex space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Upcoming
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Past
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Court
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">User #{booking.userId.slice(-4)}</div>
                        <div className="text-sm text-gray-500">{booking.venue?.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-900">
                    Court A
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.date}</div>
                    <div className="text-sm text-gray-500">{booking.timeSlot}</div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{booking.totalAmount}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                    <button className="text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50 px-3 py-1 rounded transition-colors">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">Profile</h2>
      
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{user?.fullName}</h3>
            <p className="text-gray-600 text-lg">{user?.email}</p>
            <p className="text-gray-500">Facility Owner</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={user?.fullName}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue={user?.email}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              defaultValue={user?.phone || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              defaultValue={user?.location || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Sidebar */}
            <div className="w-full lg:w-64 bg-gray-50 border-r border-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Owner Panel</h2>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'dashboard'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>Dashboard</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('facilities')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'facilities'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span>Facilities</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('courts')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'courts'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                    <span>Courts</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'bookings'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Bookings</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span>Profile</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
              ) : (
                <>
                  {activeTab === 'dashboard' && renderDashboardTab()}
                  {activeTab === 'facilities' && renderFacilitiesTab()}
                  {activeTab === 'courts' && renderCourtsTab()}
                  {activeTab === 'bookings' && renderBookingsTab()}
                  {activeTab === 'profile' && renderProfileTab()}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Venue Modal */}
      {(showAddVenue || showEditVenue) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  {showAddVenue ? 'Add New Facility' : 'Edit Facility'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddVenue(false);
                    setShowEditVenue(false);
                    setEditingVenue(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facility Name</label>
                  <input
                    type="text"
                    value={newVenueData.name}
                    onChange={(e) => setNewVenueData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter facility name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={newVenueData.location}
                    onChange={(e) => setNewVenueData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter location"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newVenueData.description}
                    onChange={(e) => setNewVenueData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Hour (₹)</label>
                  <input
                    type="number"
                    value={newVenueData.price}
                    onChange={(e) => setNewVenueData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <input
                    type="text"
                    value={newVenueData.amenities.join(', ')}
                    onChange={(e) => setNewVenueData(prev => ({ 
                      ...prev, 
                      amenities: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Badminton, Tennis, Indoor"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowAddVenue(false);
                    setShowEditVenue(false);
                    setEditingVenue(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={showAddVenue ? handleSaveVenue : handleUpdateVenue}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  {showAddVenue ? 'Add Facility' : 'Update Facility'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Court Modal */}
      {(showAddCourt || showEditCourt) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  {showAddCourt ? 'Add New Court' : 'Edit Court'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddCourt(false);
                    setShowEditCourt(false);
                    setEditingCourt(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Court Name</label>
                  <input
                    type="text"
                    value={newCourtData.name}
                    onChange={(e) => setNewCourtData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter court name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sport Type</label>
                  <select
                    value={newCourtData.sportType}
                    onChange={(e) => setNewCourtData(prev => ({ ...prev, sportType: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select sport type</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Football">Football</option>
                    <option value="Cricket">Cricket</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Hour (₹)</label>
                  <input
                    type="number"
                    value={newCourtData.pricePerHour}
                    onChange={(e) => setNewCourtData(prev => ({ ...prev, pricePerHour: Number(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opening Time</label>
                  <input
                    type="time"
                    value={newCourtData.operatingHours.open}
                    onChange={(e) => setNewCourtData(prev => ({ 
                      ...prev, 
                      operatingHours: { ...prev.operatingHours, open: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Closing Time</label>
                  <input
                    type="time"
                    value={newCourtData.operatingHours.close}
                    onChange={(e) => setNewCourtData(prev => ({ 
                      ...prev, 
                      operatingHours: { ...prev.operatingHours, close: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowAddCourt(false);
                    setShowEditCourt(false);
                    setEditingCourt(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={showAddCourt ? handleSaveCourt : handleUpdateCourt}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  {showAddCourt ? 'Add Court' : 'Update Court'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Slot Management Modal */}
      {showTimeSlotManager && selectedCourt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  Time Slot Management - {selectedCourt.name}
                </h3>
                <button
                  onClick={() => setShowTimeSlotManager(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">{selectedCourt.sportType} • ₹{selectedCourt.pricePerHour}/hour</p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Set Availability & Block Time Slots</h4>
                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                   <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                     <option>Next 7 days</option>
                     <option>Next 14 days</option>
                     <option>Next 30 days</option>
                   </select>
                 </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {timeSlots.slice(0, 20).map((slot) => (
                      <tr key={slot.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(slot.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {slot.startTime} - {slot.endTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                            slot.isBlocked ? 'bg-red-100 text-red-800' :
                            slot.isAvailable ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {slot.isBlocked ? 'Blocked' : slot.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleTimeSlotAvailability(slot.id)}
                              className={`px-3 py-1 rounded text-xs font-medium ${
                                slot.isAvailable 
                                  ? 'text-red-600 hover:text-red-900 hover:bg-red-50' 
                                  : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                              } transition-colors`}
                            >
                              {slot.isAvailable ? 'Disable' : 'Enable'}
                            </button>
                            {!slot.isBlocked && (
                              <button
                                onClick={() => {
                                  const reason = prompt('Enter reason for blocking:');
                                  if (reason) blockTimeSlot(slot.id, reason);
                                }}
                                className="text-orange-600 hover:text-orange-900 hover:bg-orange-50 px-3 py-1 rounded text-xs font-medium transition-colors"
                              >
                                Block
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;

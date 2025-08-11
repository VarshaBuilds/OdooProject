import React, { createContext, useContext, useState, useEffect } from 'react';
import { MockAPI, Venue, Booking } from '../services/MockAPI';

export interface Court {
  id: string;
  venueId: string;
  name: string;
  sport: string;
  pricePerHour: number;
  operatingHours: {
    start: string;
    end: string;
  };
  isActive: boolean;
}

export interface TimeSlot {
  id: string;
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBlocked: boolean;
  price: number;
}

interface BookingContextType {
  venues: Venue[];
  courts: Court[];
  bookings: Booking[];
  getVenueById: (id: string) => Venue | undefined;
  getCourtsForVenue: (venueId: string) => Court[];
  getAvailableTimeSlots: (courtId: string, date: string) => TimeSlot[];
  createBooking: (bookingData: Omit<Booking, 'id' | 'status'>) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  getUserBookings: (userId: string) => Promise<Booking[]>;
  getOwnerBookings: (ownerId: string) => Booking[];
  addVenue: (venue: Omit<Venue, 'id'>) => void;
  updateVenue: (venueId: string, updates: Partial<Venue>) => void;
  addCourt: (court: Omit<Court, 'id'>) => void;
  updateCourt: (courtId: string, updates: Partial<Court>) => void;
  approveVenue: (venueId: string) => void;
  rejectVenue: (venueId: string) => void;
  isLoading: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock courts data (since MockAPI doesn't have courts yet)
  const mockCourts: Court[] = [
    {
      id: '1',
      venueId: '1',
      name: 'Court A1',
      sport: 'Badminton',
      pricePerHour: 50,
      operatingHours: { start: '06:00', end: '22:00' },
      isActive: true
    },
    {
      id: '2',
      venueId: '1',
      name: 'Court A2',
      sport: 'Badminton',
      pricePerHour: 50,
      operatingHours: { start: '06:00', end: '22:00' },
      isActive: true
    },
    {
      id: '3',
      venueId: '2',
      name: 'Tennis Court 1',
      sport: 'Tennis',
      pricePerHour: 80,
      operatingHours: { start: '07:00', end: '21:00' },
      isActive: true
    },
    {
      id: '4',
      venueId: '3',
      name: 'Basketball Court',
      sport: 'Basketball',
      pricePerHour: 60,
      operatingHours: { start: '08:00', end: '20:00' },
      isActive: true
    }
  ];

  // Load venues from MockAPI
  useEffect(() => {
    const loadVenues = async () => {
      setIsLoading(true);
      try {
        const venuesData = await MockAPI.getVenues();
        setVenues(venuesData);
        setCourts(mockCourts);
      } catch (error) {
        console.error('Error loading venues:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVenues();
  }, []);

  const getVenueById = (id: string): Venue | undefined => {
    return venues.find(venue => venue.id === id);
  };

  const getCourtsForVenue = (venueId: string): Court[] => {
    return courts.filter(court => court.venueId === venueId);
  };

  const getAvailableTimeSlots = (courtId: string, date: string): TimeSlot[] => {
    // Mock time slot generation
    const court = courts.find(c => c.id === courtId);
    if (!court) return [];

    const slots: TimeSlot[] = [];
    const startHour = parseInt(court.operatingHours.start.split(':')[0]);
    const endHour = parseInt(court.operatingHours.end.split(':')[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      // Check if slot is already booked
      const isBooked = bookings.some(booking => 
        booking.venueId === court.venueId && 
        booking.date === date && 
        booking.timeSlot === startTime &&
        booking.status !== 'cancelled'
      );

      slots.push({
        id: `${courtId}-${date}-${hour}`,
        courtId,
        date,
        startTime,
        endTime,
        isAvailable: !isBooked,
        isBlocked: false,
        price: court.pricePerHour
      });
    }

    return slots;
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'status'>): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Use MockAPI for creating booking
      const newBooking = await MockAPI.createBooking(bookingData);
      
      if (newBooking) {
        setBookings(prev => [...prev, newBooking]);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error creating booking:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Use MockAPI for cancelling booking
      const success = await MockAPI.cancelBooking(bookingId);
      
      if (success) {
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: 'cancelled' as const }
              : booking
          )
        );
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserBookings = async (userId: string): Promise<Booking[]> => {
    try {
      // Use MockAPI for getting user bookings
      const userBookings = await MockAPI.getUserBookings(userId);
      return userBookings;
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return [];
    }
  };

  const getOwnerBookings = (ownerId: string): Booking[] => {
    const ownerVenueIds = venues
      .filter(venue => venue.id === ownerId) // Assuming ownerId matches venue.id for simplicity
      .map(venue => venue.id);
    
    return bookings.filter(booking => ownerVenueIds.includes(booking.venueId));
  };

  const addVenue = (venueData: Omit<Venue, 'id'>) => {
    const newVenue: Venue = {
      ...venueData,
      id: Date.now().toString()
    };
    setVenues(prev => [...prev, newVenue]);
  };

  const updateVenue = (venueId: string, updates: Partial<Venue>) => {
    setVenues(prev => 
      prev.map(venue => 
        venue.id === venueId ? { ...venue, ...updates } : venue
      )
    );
  };

  const addCourt = (courtData: Omit<Court, 'id'>) => {
    const newCourt: Court = {
      ...courtData,
      id: Date.now().toString()
    };
    setCourts(prev => [...prev, newCourt]);
  };

  const updateCourt = (courtId: string, updates: Partial<Court>) => {
    setCourts(prev => 
      prev.map(court => 
        court.id === courtId ? { ...court, ...updates } : court
      )
    );
  };

  const approveVenue = (venueId: string) => {
    updateVenue(venueId, { isApproved: true });
  };

  const rejectVenue = (venueId: string) => {
    setVenues(prev => prev.filter(venue => venue.id !== venueId));
  };

  const value: BookingContextType = {
    venues,
    courts,
    bookings,
    getVenueById,
    getCourtsForVenue,
    getAvailableTimeSlots,
    createBooking,
    cancelBooking,
    getUserBookings,
    getOwnerBookings,
    addVenue,
    updateVenue,
    addCourt,
    updateCourt,
    approveVenue,
    rejectVenue,
    isLoading
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
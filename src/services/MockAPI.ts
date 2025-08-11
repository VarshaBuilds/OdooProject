// MockAPI Service - Simulates real API calls for hackathon demo

// Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: 'user' | 'owner' | 'admin';
  phone?: string;
  location?: string;
  isActive: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  role: 'user' | 'owner' | 'admin';
  phone?: string;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  description?: string;
  amenities?: string[];
}

export interface Booking {
  id: string;
  venueId: string;
  userId: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  venue?: Venue;
}

// Mock Data Storage (simulates database)
class MockDatabase {
  private users: User[] = [
    {
      id: '1',
      email: 'admin@quickcourt.com',
      fullName: 'System Admin',
      role: 'admin',
      isActive: true
    },
    {
      id: '2',
      email: 'owner@quickcourt.com',
      fullName: 'Sports Center Owner',
      phone: '+1234567890',
      location: 'New York, NY',
      role: 'owner',
      isActive: true
    },
    {
      id: '3',
      email: 'user@quickcourt.com',
      fullName: 'John Doe',
      phone: '+1234567890',
      location: 'New York, NY',
      role: 'user',
      isActive: true
    }
  ];

  private venues: Venue[] = [
    {
      id: '1',
      name: 'Premium Sports Complex',
      location: 'Downtown Area',
      rating: 4.5,
      price: 50,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      description: 'State-of-the-art sports facility with multiple courts',
      amenities: ['Badminton', 'Indoor', 'Parking', 'Shower', 'Equipment Rental', 'Café']
    },
    {
      id: '2',
      name: 'Elite Tennis Center',
      location: 'Uptown District',
      rating: 4.8,
      price: 75,
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
      description: 'Professional tennis courts with coaching services',
      amenities: ['Tennis', 'Outdoor', 'Pro Shop', 'Tennis Lessons', 'Locker Rooms', 'Viewing Area']
    },
    {
      id: '3',
      name: 'Community Basketball Arena',
      location: 'Suburban Area',
      rating: 4.2,
      price: 30,
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
      description: 'Multi-court basketball facility for all skill levels',
      amenities: ['Basketball', 'Indoor', 'Parking', 'Concession Stand', 'Scoreboards', 'Seating']
    },
    {
      id: '4',
      name: 'SBR Badminton Court',
      location: 'Vaishnodevi Circle',
      rating: 4.7,
      price: 250,
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
      description: 'Professional badminton courts with coaching',
      amenities: ['Badminton', 'Indoor', 'Air Conditioning', 'Equipment Rental', 'Parking']
    },
    {
      id: '5',
      name: 'Football Ground Plus',
      location: 'Sports Complex Area',
      rating: 4.6,
      price: 400,
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      description: 'Full-size football ground with floodlights',
      amenities: ['Football', 'Outdoor', 'Floodlights', 'Parking', 'Changing Rooms', 'Water Dispenser']
    },
    {
      id: '6',
      name: 'Swimming Excellence',
      location: 'Aquatic Center',
      rating: 4.9,
      price: 600,
      image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800',
      description: 'Olympic-size swimming pool with professional coaching',
      amenities: ['Swimming', 'Indoor', 'Heated Pool', 'Locker Rooms', 'Shower', 'Equipment Rental']
    },
    {
      id: '7',
      name: 'Table Tennis Pro',
      location: 'Recreation Center',
      rating: 4.4,
      price: 150,
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800',
      description: 'Multiple table tennis tables with professional equipment',
      amenities: ['Table Tennis', 'Indoor', 'Professional Tables', 'Equipment Rental', 'Parking']
    },
    {
      id: '8',
      name: 'Cricket Stadium',
      location: 'Sports Complex',
      rating: 4.8,
      price: 800,
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
      description: 'Professional cricket ground with practice nets',
      amenities: ['Cricket', 'Outdoor', 'Practice Nets', 'Pavilion', 'Parking', 'Equipment Rental']
    },
    {
      id: '9',
      name: 'Multi-Sport Arena',
      location: 'Central Sports Hub',
      rating: 4.3,
      price: 350,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      description: 'Versatile sports facility for multiple activities',
      amenities: ['Badminton', 'Basketball', 'Indoor', 'Parking', 'Equipment Rental', 'Café']
    },
    {
      id: '10',
      name: 'Elite Fitness Center',
      location: 'Wellness District',
      rating: 4.7,
      price: 500,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      description: 'Comprehensive fitness and sports facility',
      amenities: ['Gym', 'Indoor', 'Personal Training', 'Equipment Rental', 'Parking', 'Shower']
    }
  ];

  private bookings: Booking[] = [];

  // User Management
  async createUser(userData: SignupData): Promise<User> {
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role,
      phone: userData.phone,
      isActive: true
    };
    
    this.users.push(newUser);
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex === -1) return null;
    
    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    return this.users[userIndex];
  }

  // Venue Management
  async getVenues(): Promise<Venue[]> {
    return [...this.venues];
  }

  async getVenueById(id: string): Promise<Venue | null> {
    return this.venues.find(venue => venue.id === id) || null;
  }

  // Booking Management
  async createBooking(bookingData: Omit<Booking, 'id'>): Promise<Booking> {
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString()
    };
    
    this.bookings.push(newBooking);
    return newBooking;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return this.bookings
      .filter(booking => booking.userId === userId)
      .map(booking => ({
        ...booking,
        venue: this.venues.find(v => v.id === booking.venueId)
      }));
  }

  async cancelBooking(bookingId: string): Promise<boolean> {
    const bookingIndex = this.bookings.findIndex(booking => booking.id === bookingId);
    if (bookingIndex === -1) return false;
    
    this.bookings[bookingIndex].status = 'cancelled';
    return true;
  }

  // Password Reset
  async sendPasswordResetEmail(email: string): Promise<boolean> {
    const user = this.users.find(u => u.email === email);
    if (!user) return false;
    
    // Simulate sending email
    console.log(`Password reset email sent to ${email}`);
    return true;
  }


}

// Create singleton instance
const mockDB = new MockDatabase();

// API Functions
export const MockAPI = {
  // Authentication
  login: async (email: string, password: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    const user = await mockDB.getUserByEmail(email);
    
    // For demo purposes, accept any password for existing users
    // In production, this would validate against hashed passwords
    if (user && password === 'password') {
      return user;
    }
    
    return null;
  },

  signup: async (userData: SignupData): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await mockDB.createUser(userData);
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return await mockDB.updateUser(userId, updates);
  },

  // Venues
  getVenues: async (): Promise<Venue[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return await mockDB.getVenues();
  },

  getVenueById: async (id: string): Promise<Venue | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return await mockDB.getVenueById(id);
  },

  // Bookings
  createBooking: async (bookingData: Omit<Booking, 'id'>): Promise<Booking> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await mockDB.createBooking(bookingData);
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return await mockDB.getUserBookings(userId);
  },

  cancelBooking: async (bookingId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return await mockDB.cancelBooking(bookingId);
  },

  // Password Reset
  forgotPassword: async (email: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await mockDB.sendPasswordResetEmail(email);
  },

  // Get user by email
  getUserByEmail: async (email: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return await mockDB.getUserByEmail(email);
  }
};

export default MockAPI;

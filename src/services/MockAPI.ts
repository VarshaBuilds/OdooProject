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
  createdAt: string;
  lastLogin?: string;
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
  address: string;
  rating: number;
  price: number;
  image: string;
  images: string[];
  description?: string;
  aboutVenue?: string;
  sports: string[];
  amenities?: string[];
  ownerId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedAt?: string;
  rejectionReason?: string;
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
  totalAmount: number;
  createdAt: string;
}

export interface FacilityRegistration {
  id: string;
  venueName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  location: string;
  description: string;
  amenities: string[];
  images: string[];
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminComments?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedType: 'venue' | 'user' | 'booking';
  reportedId: string;
  reason: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  submittedAt: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export interface Review {
  id: string;
  venueId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  userAvatar?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: 'card' | 'upi' | 'netbanking';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  venueId: string;
  addedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalOwners: number;
  totalVenues: number;
  totalBookings: number;
  pendingApprovals: number;
  totalRevenue: number;
  activeReports: number;
}

// Mock Data Storage (simulates database)
class MockDatabase {
  private users: User[] = [
    {
      id: '1',
      email: 'admin@quickcourt.com',
      fullName: 'System Admin',
      role: 'admin',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      email: 'owner@quickcourt.com',
      fullName: 'Sports Center Owner',
      phone: '+1234567890',
      location: 'New York, NY',
      role: 'owner',
      isActive: true,
      createdAt: '2024-01-02T00:00:00Z'
    },
    {
      id: '3',
      email: 'user@quickcourt.com',
      fullName: 'John Doe',
      phone: '+1234567890',
      location: 'New York, NY',
      role: 'user',
      isActive: true,
      createdAt: '2024-01-03T00:00:00Z'
    },
    {
      id: '4',
      email: 'jane@example.com',
      fullName: 'Jane Smith',
      phone: '+1234567891',
      location: 'Los Angeles, CA',
      role: 'user',
      isActive: true,
      createdAt: '2024-01-04T00:00:00Z'
    },
    {
      id: '5',
      email: 'mike@example.com',
      fullName: 'Mike Johnson',
      phone: '+1234567892',
      location: 'Chicago, IL',
      role: 'user',
      isActive: false,
      createdAt: '2024-01-05T00:00:00Z'
    },
    {
      id: '6',
      email: 'sarah@example.com',
      fullName: 'Sarah Wilson',
      phone: '+1234567893',
      location: 'Miami, FL',
      role: 'owner',
      isActive: true,
      createdAt: '2024-01-06T00:00:00Z'
    }
  ];

  private venues: Venue[] = [
    {
      id: '1',
      name: 'Premium Sports Complex',
      location: 'Downtown Area',
      address: '123 Sports Avenue, Downtown Area, City - 123456',
      rating: 4.5,
      price: 50,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800'
      ],
      description: 'State-of-the-art sports facility with multiple courts',
      aboutVenue: 'Premium Sports Complex is a world-class facility designed for athletes and sports enthusiasts. Our venue features state-of-the-art equipment, professional coaching staff, and a welcoming environment for all skill levels. With multiple courts, modern amenities, and convenient location, we provide the perfect setting for your sports activities.',
      sports: ['Badminton', 'Tennis', 'Basketball', 'Table Tennis'],
      amenities: ['Indoor', 'Parking', 'Shower', 'Equipment Rental', 'Café', 'Locker Rooms', 'Pro Shop'],
      ownerId: '2',
      status: 'approved',
      submittedAt: '2024-01-02T00:00:00Z',
      approvedAt: '2024-01-03T00:00:00Z'
    },
    {
      id: '2',
      name: 'Elite Tennis Center',
      location: 'Uptown District',
      address: '456 Tennis Boulevard, Uptown District, City - 123456',
      rating: 4.8,
      price: 75,
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
      images: [
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'
      ],
      description: 'Professional tennis courts with coaching services',
      aboutVenue: 'Elite Tennis Center offers world-class tennis facilities with professional coaching staff. Our outdoor courts are designed to international standards, featuring premium playing surfaces and excellent lighting for evening sessions. We cater to players of all levels, from beginners to advanced competitors.',
      sports: ['Tennis'],
      amenities: ['Outdoor', 'Pro Shop', 'Tennis Lessons', 'Locker Rooms', 'Viewing Area', 'Equipment Rental', 'Parking'],
      ownerId: '2',
      status: 'approved',
      submittedAt: '2024-01-02T00:00:00Z',
      approvedAt: '2024-01-03T00:00:00Z'
    },
    {
      id: '3',
      name: 'Community Basketball Arena',
      location: 'Suburban Area',
      address: '789 Basketball Street, Suburban Area, City - 123456',
      rating: 4.2,
      price: 30,
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
      images: [
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800'
      ],
      description: 'Multi-court basketball facility for all skill levels',
      aboutVenue: 'Community Basketball Arena is a family-friendly facility designed for basketball enthusiasts of all ages and skill levels. Our multiple courts provide ample space for games, practice sessions, and tournaments. We offer a welcoming environment with modern amenities and professional coaching.',
      sports: ['Basketball'],
      amenities: ['Indoor', 'Parking', 'Concession Stand', 'Scoreboards', 'Seating', 'Locker Rooms', 'Equipment Rental'],
      ownerId: '6',
      status: 'approved',
      submittedAt: '2024-01-06T00:00:00Z',
      approvedAt: '2024-01-07T00:00:00Z'
    },
    {
      id: '4',
      name: 'SBR Badminton Court',
      location: 'Vaishnodevi Circle',
      address: '321 Badminton Lane, Vaishnodevi Circle, City - 123456',
      rating: 4.7,
      price: 250,
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
      images: [
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'
      ],
      description: 'Professional badminton courts with coaching',
      aboutVenue: 'SBR Badminton Court is a premier facility dedicated to badminton excellence. Our indoor courts feature professional-grade surfaces, excellent lighting, and air conditioning for comfortable play. We offer coaching services for players looking to improve their skills.',
      sports: ['Badminton'],
      amenities: ['Indoor', 'Air Conditioning', 'Equipment Rental', 'Parking', 'Locker Rooms', 'Pro Shop', 'Coaching Services'],
      ownerId: '2',
      status: 'approved',
      submittedAt: '2024-01-02T00:00:00Z',
      approvedAt: '2024-01-03T00:00:00Z'
    },
    {
      id: '5',
      name: 'Football Ground Plus',
      location: 'Sports Complex Area',
      address: '654 Football Road, Sports Complex Area, City - 123456',
      rating: 4.6,
      price: 400,
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      images: [
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'
      ],
      description: 'Full-size football ground with floodlights',
      aboutVenue: 'Football Ground Plus offers a full-size professional football field with premium grass surface and floodlighting for evening matches. Our facility is perfect for both casual games and competitive tournaments, with changing rooms and ample parking.',
      sports: ['Football'],
      amenities: ['Outdoor', 'Floodlights', 'Parking', 'Changing Rooms', 'Water Dispenser', 'Equipment Rental', 'Scoreboards'],
      ownerId: '6',
      status: 'approved',
      submittedAt: '2024-01-06T00:00:00Z',
      approvedAt: '2024-01-07T00:00:00Z'
    },
    {
      id: '6',
      name: 'Swimming Excellence',
      location: 'Aquatic Center',
      address: '987 Swimming Pool Drive, Aquatic Center, City - 123456',
      rating: 4.9,
      price: 600,
      image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800',
      images: [
        'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800'
      ],
      description: 'Olympic-size swimming pool with professional coaching',
      aboutVenue: 'Swimming Excellence features an Olympic-size swimming pool with heated water and professional coaching staff. Our facility is designed for swimmers of all levels, from beginners learning to swim to competitive athletes training for competitions.',
      sports: ['Swimming'],
      amenities: ['Indoor', 'Heated Pool', 'Locker Rooms', 'Shower', 'Equipment Rental', 'Coaching Services', 'Parking'],
      ownerId: '2',
      status: 'approved',
      submittedAt: '2024-01-02T00:00:00Z',
      approvedAt: '2024-01-03T00:00:00Z'
    },
    {
      id: '7',
      name: 'Table Tennis Pro',
      location: 'Recreation Center',
      address: '147 Table Tennis Way, Recreation Center, City - 123456',
      rating: 4.4,
      price: 150,
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800',
      images: [
        'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'
      ],
      description: 'Multiple table tennis tables with professional equipment',
      aboutVenue: 'Table Tennis Pro is a dedicated facility for table tennis enthusiasts. We offer multiple professional-grade tables with excellent lighting and ventilation. Our facility is perfect for both recreational play and competitive training.',
      sports: ['Table Tennis'],
      amenities: ['Indoor', 'Professional Tables', 'Equipment Rental', 'Parking', 'Locker Rooms', 'Coaching Services'],
      ownerId: '6',
      status: 'approved',
      submittedAt: '2024-01-06T00:00:00Z',
      approvedAt: '2024-01-07T00:00:00Z'
    },
    {
      id: '8',
      name: 'Cricket Stadium',
      location: 'Sports Complex',
      address: '258 Cricket Avenue, Sports Complex, City - 123456',
      rating: 4.8,
      price: 800,
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
      images: [
        'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800'
      ],
      description: 'Professional cricket ground with practice nets',
      aboutVenue: 'Cricket Stadium is a world-class facility designed for professional cricket matches and training. Our ground features a premium pitch, practice nets, and a modern pavilion. We host both domestic and international matches.',
      sports: ['Cricket'],
      amenities: ['Outdoor', 'Practice Nets', 'Pavilion', 'Parking', 'Equipment Rental', 'Locker Rooms', 'Viewing Stands'],
      ownerId: '2',
      status: 'approved',
      submittedAt: '2024-01-02T00:00:00Z',
      approvedAt: '2024-01-03T00:00:00Z'
    },
    {
      id: '9',
      name: 'Multi-Sport Arena',
      location: 'Central Sports Hub',
      address: '369 Multi-Sport Road, Central Sports Hub, City - 123456',
      rating: 4.3,
      price: 350,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'
      ],
      description: 'Versatile sports facility for multiple activities',
      aboutVenue: 'Multi-Sport Arena is a versatile facility designed to accommodate various sports activities. Our venue features convertible courts that can be adapted for badminton, basketball, and other indoor sports, making it perfect for multi-sport events.',
      sports: ['Badminton', 'Basketball', 'Volleyball', 'Table Tennis'],
      amenities: ['Indoor', 'Parking', 'Equipment Rental', 'Café', 'Locker Rooms', 'Convertible Courts', 'Equipment Storage'],
      ownerId: '6',
      status: 'approved',
      submittedAt: '2024-01-06T00:00:00Z',
      approvedAt: '2024-01-07T00:00:00Z'
    },
    {
      id: '10',
      name: 'Elite Fitness Center',
      location: 'Wellness District',
      address: '741 Fitness Boulevard, Wellness District, City - 123456',
      rating: 4.7,
      price: 500,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'
      ],
      description: 'Comprehensive fitness and sports facility',
      aboutVenue: 'Elite Fitness Center offers a comprehensive approach to health and fitness. Our facility combines traditional gym equipment with sports facilities, providing a complete solution for fitness enthusiasts and athletes alike.',
      sports: ['Gym', 'Yoga', 'Pilates', 'CrossFit'],
      amenities: ['Indoor', 'Personal Training', 'Equipment Rental', 'Parking', 'Shower', 'Locker Rooms', 'Fitness Classes'],
      ownerId: '2',
      status: 'approved',
      submittedAt: '2024-01-02T00:00:00Z',
      approvedAt: '2024-01-03T00:00:00Z'
    }
  ];

  private pendingFacilities: FacilityRegistration[] = [
    {
      id: 'PF001',
      venueName: 'New Badminton Court',
      ownerName: 'Alex Chen',
      ownerEmail: 'alex@newcourt.com',
      ownerPhone: '+1234567894',
      location: 'Downtown East',
      description: 'New indoor badminton facility with 4 courts',
      amenities: ['Badminton', 'Indoor', 'Air Conditioning', 'Parking'],
      images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800'],
      submittedAt: '2024-01-15T10:00:00Z',
      status: 'pending'
    },
    {
      id: 'PF002',
      venueName: 'Soccer Training Center',
      ownerName: 'Maria Garcia',
      ownerEmail: 'maria@soccerpro.com',
      ownerPhone: '+1234567895',
      location: 'Sports District',
      description: 'Professional soccer training facility with multiple fields',
      amenities: ['Football', 'Outdoor', 'Training Equipment', 'Parking', 'Changing Rooms'],
      images: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'],
      submittedAt: '2024-01-16T14:30:00Z',
      status: 'pending'
    }
  ];

  private bookings: Booking[] = [
    {
      id: 'BK001',
      venueId: '1',
      userId: '3',
      date: '2024-01-15',
      timeSlot: '10:00 AM - 12:00 PM',
      status: 'confirmed',
      totalAmount: 100,
      createdAt: '2024-01-10T09:00:00Z'
    },
    {
      id: 'BK002',
      venueId: '2',
      userId: '4',
      date: '2024-01-16',
      timeSlot: '2:00 PM - 4:00 PM',
      status: 'pending',
      totalAmount: 150,
      createdAt: '2024-01-11T10:00:00Z'
    },
    {
      id: 'BK003',
      venueId: '3',
      userId: '5',
      date: '2024-01-17',
      timeSlot: '3:00 PM - 5:00 PM',
      status: 'cancelled',
      totalAmount: 60,
      createdAt: '2024-01-12T11:00:00Z'
    }
  ];

  private reports: Report[] = [
    {
      id: 'RPT001',
      reporterId: '3',
      reporterName: 'John Doe',
      reportedType: 'venue',
      reportedId: '1',
      reason: 'Inappropriate behavior',
      description: 'Staff was rude to customers',
      status: 'open',
      submittedAt: '2024-01-14T15:00:00Z'
    },
    {
      id: 'RPT002',
      reporterId: '4',
      reporterName: 'Jane Smith',
      reportedType: 'user',
      reportedId: '5',
      reason: 'Spam',
      description: 'User is sending unwanted messages',
      status: 'investigating',
      submittedAt: '2024-01-13T12:00:00Z',
      adminNotes: 'Under investigation'
    }
  ];

  private reviews: Review[] = [
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
      venueId: '2',
      userId: '5',
      userName: 'Mike Johnson',
      rating: 5,
      comment: 'Best tennis court in the area. Clean facilities and reasonable pricing.',
      date: '2024-01-05',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '4',
      venueId: '3',
      userId: '6',
      userName: 'Emily Chen',
      rating: 4,
      comment: 'Love the basketball courts! Great atmosphere and well-maintained facilities.',
      date: '2024-01-03',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  private payments: Payment[] = [
    {
      id: 'PAY001',
      bookingId: 'BK001',
      amount: 100,
      method: 'card',
      status: 'completed',
      transactionId: 'TXN123456789',
      createdAt: '2024-01-10T09:00:00Z'
    },
    {
      id: 'PAY002',
      bookingId: 'BK002',
      amount: 150,
      method: 'upi',
      status: 'pending',
      createdAt: '2024-01-11T10:00:00Z'
    }
  ];

  private favorites: Favorite[] = [
    {
      id: 'FAV001',
      userId: '3',
      venueId: '1',
      addedAt: '2024-01-10T09:00:00Z'
    },
    {
      id: 'FAV002',
      userId: '3',
      venueId: '2',
      addedAt: '2024-01-11T10:00:00Z'
    },
    {
      id: 'FAV003',
      userId: '4',
      venueId: '1',
      addedAt: '2024-01-12T11:00:00Z'
    }
  ];

  // User Management
  async createUser(userData: SignupData): Promise<User> {
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role,
      phone: userData.phone,
      isActive: true,
      createdAt: new Date().toISOString()
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

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  async toggleUserStatus(userId: string): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex === -1) return false;
    
    this.users[userIndex].isActive = !this.users[userIndex].isActive;
    return true;
  }

  // Venue Management
  async getVenues(): Promise<Venue[]> {
    return [...this.venues];
  }

  async getVenueById(id: string): Promise<Venue | null> {
    return this.venues.find(venue => venue.id === id) || null;
  }

  // Facility Approval
  async getPendingFacilities(): Promise<FacilityRegistration[]> {
    return this.pendingFacilities.filter(facility => facility.status === 'pending');
  }

  async approveFacility(facilityId: string, adminId: string, comments?: string): Promise<boolean> {
    const facilityIndex = this.pendingFacilities.findIndex(f => f.id === facilityId);
    if (facilityIndex === -1) return false;
    
    this.pendingFacilities[facilityIndex].status = 'approved';
    this.pendingFacilities[facilityIndex].reviewedAt = new Date().toISOString();
    this.pendingFacilities[facilityIndex].reviewedBy = adminId;
    this.pendingFacilities[facilityIndex].adminComments = comments;
    
    return true;
  }

  async rejectFacility(facilityId: string, adminId: string, reason: string): Promise<boolean> {
    const facilityIndex = this.pendingFacilities.findIndex(f => f.id === facilityId);
    if (facilityIndex === -1) return false;
    
    this.pendingFacilities[facilityIndex].status = 'rejected';
    this.pendingFacilities[facilityIndex].reviewedAt = new Date().toISOString();
    this.pendingFacilities[facilityIndex].reviewedBy = adminId;
    this.pendingFacilities[facilityIndex].adminComments = reason;
    
    return true;
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

  async getAllBookings(): Promise<Booking[]> {
    return this.bookings.map(booking => ({
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

  // Reports Management
  async getAllReports(): Promise<Report[]> {
    return [...this.reports];
  }

  async updateReportStatus(reportId: string, status: Report['status'], adminNotes?: string): Promise<boolean> {
    const reportIndex = this.reports.findIndex(r => r.id === reportId);
    if (reportIndex === -1) return false;
    
    this.reports[reportIndex].status = status;
    if (status === 'resolved') {
      this.reports[reportIndex].resolvedAt = new Date().toISOString();
    }
    if (adminNotes) {
      this.reports[reportIndex].adminNotes = adminNotes;
    }
    
    return true;
  }

  // Admin Statistics
  async getAdminStats(): Promise<AdminStats> {
    const totalUsers = this.users.filter(u => u.role === 'user').length;
    const totalOwners = this.users.filter(u => u.role === 'owner').length;
    const totalVenues = this.venues.length;
    const totalBookings = this.bookings.length;
    const pendingApprovals = this.pendingFacilities.filter(f => f.status === 'pending').length;
    const totalRevenue = this.bookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    const activeReports = this.reports.filter(r => r.status === 'open' || r.status === 'investigating').length;

    return {
      totalUsers,
      totalOwners,
      totalVenues,
      totalBookings,
      pendingApprovals,
      totalRevenue,
      activeReports
    };
  }

  // Password Reset
  async sendPasswordResetEmail(email: string): Promise<boolean> {
    const user = this.users.find(u => u.email === email);
    if (!user) return false;
    
    // Simulate sending email
    console.log(`Password reset email sent to ${email}`);
    return true;
  }

  // Reviews Management
  async getVenueReviews(venueId: string): Promise<Review[]> {
    return this.reviews.filter(review => review.venueId === venueId);
  }

  async addReview(reviewData: Omit<Review, 'id'>): Promise<Review> {
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString()
    };
    this.reviews.push(newReview);
    return newReview;
  }

  // Payment Management
  async createPayment(paymentData: Omit<Payment, 'id'>): Promise<Payment> {
    const newPayment: Payment = {
      ...paymentData,
      id: `PAY${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.payments.push(newPayment);
    return newPayment;
  }

  async getPaymentByBookingId(bookingId: string): Promise<Payment | null> {
    return this.payments.find(payment => payment.bookingId === bookingId) || null;
  }

  async updatePaymentStatus(paymentId: string, status: Payment['status'], transactionId?: string): Promise<boolean> {
    const paymentIndex = this.payments.findIndex(p => p.id === paymentId);
    if (paymentIndex === -1) return false;
    
    this.payments[paymentIndex].status = status;
    if (transactionId) {
      this.payments[paymentIndex].transactionId = transactionId;
    }
    return true;
  }

  // Favorites Management
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return this.favorites.filter(fav => fav.userId === userId);
  }

  async addToFavorites(userId: string, venueId: string): Promise<Favorite> {
    const existingFavorite = this.favorites.find(fav => fav.userId === userId && fav.venueId === venueId);
    if (existingFavorite) {
      return existingFavorite;
    }

    const newFavorite: Favorite = {
      id: `FAV${Date.now()}`,
      userId,
      venueId,
      addedAt: new Date().toISOString()
    };
    this.favorites.push(newFavorite);
    return newFavorite;
  }

  async removeFromFavorites(userId: string, venueId: string): Promise<boolean> {
    const favoriteIndex = this.favorites.findIndex(fav => fav.userId === userId && fav.venueId === venueId);
    if (favoriteIndex === -1) return false;
    
    this.favorites.splice(favoriteIndex, 1);
    return true;
  }

  async isVenueFavorited(userId: string, venueId: string): Promise<boolean> {
    return this.favorites.some(fav => fav.userId === userId && fav.venueId === venueId);
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

  getAllBookings: async (): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return await mockDB.getAllBookings();
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
  },

  // Admin Functions
  getAllUsers: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return await mockDB.getAllUsers();
  },

  toggleUserStatus: async (userId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return await mockDB.toggleUserStatus(userId);
  },

  getPendingFacilities: async (): Promise<FacilityRegistration[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return await mockDB.getPendingFacilities();
  },

  approveFacility: async (facilityId: string, adminId: string, comments?: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await mockDB.approveFacility(facilityId, adminId, comments);
  },

  rejectFacility: async (facilityId: string, adminId: string, reason: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await mockDB.rejectFacility(facilityId, adminId, reason);
  },

  getAllReports: async (): Promise<Report[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return await mockDB.getAllReports();
  },

  updateReportStatus: async (reportId: string, status: Report['status'], adminNotes?: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return await mockDB.updateReportStatus(reportId, status, adminNotes);
  },

  getAdminStats: async (): Promise<AdminStats> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return await mockDB.getAdminStats();
  },

  // Reviews
  getVenueReviews: async (venueId: string): Promise<Review[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return await mockDB.getVenueReviews(venueId);
  },

  addReview: async (reviewData: Omit<Review, 'id'>): Promise<Review> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return await mockDB.addReview(reviewData);
  },

  // Payments
  createPayment: async (paymentData: Omit<Payment, 'id'>): Promise<Payment> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await mockDB.createPayment(paymentData);
  },

  getPaymentByBookingId: async (bookingId: string): Promise<Payment | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return await mockDB.getPaymentByBookingId(bookingId);
  },

  updatePaymentStatus: async (paymentId: string, status: Payment['status'], transactionId?: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return await mockDB.updatePaymentStatus(paymentId, status, transactionId);
  },

  // Favorites
  getUserFavorites: async (userId: string): Promise<Favorite[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return await mockDB.getUserFavorites(userId);
  },

  addToFavorites: async (userId: string, venueId: string): Promise<Favorite> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return await mockDB.addToFavorites(userId, venueId);
  },

  removeFromFavorites: async (userId: string, venueId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return await mockDB.removeFromFavorites(userId, venueId);
  },

  isVenueFavorited: async (userId: string, venueId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return await mockDB.isVenueFavorited(userId, venueId);
  }
};

export default MockAPI;

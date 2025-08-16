import { BusType, PaymentMethod, TicketStatus, TripStatus, UserRole } from '../types/enums';

// Mock data for global state store
export const mockStore = {
  user: {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'cashier@viptransport.com',
    name: 'Kwame Asante',
    role: UserRole.CASHIER as const,
    companyId: 'comp-001',
    stationLocation: 'Accra Central Station',
    isActive: true
  },
  selectedCompany: {
    id: 'comp-001',
    name: 'VIP Transport',
    licenseNumber: 'VIP-2024-001',
    phone: '+233244123456',
    email: 'info@viptransport.com',
    address: 'Accra Central, Greater Accra',
    logoUrl: 'https://images.unsplash.com/photo-1634745646763-1f1183bb91c1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw3fHxidXMlMjB0cmFuc3BvcnQlMjBsb2dvfGVufDB8Mnx8Ymx1ZXwxNzU1MzYxNjU0fDA&ixlib=rb-4.1.0&q=85',
    isActive: true
  }
};

// Mock data for API queries
export const mockQuery = {
  companies: [
    {
      id: 'comp-001',
      name: 'VIP Transport',
      licenseNumber: 'VIP-2024-001',
      phone: '+233244123456',
      email: 'info@viptransport.com',
      address: 'Accra Central, Greater Accra',
      logoUrl: 'https://images.unsplash.com/photo-1634745646763-1f1183bb91c1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw3fHxidXMlMjB0cmFuc3BvcnQlMjBsb2dvfGVufDB8Mnx8Ymx1ZXwxNzU1MzYxNjU0fDA&ixlib=rb-4.1.0&q=85',
      isActive: true,
      createdAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'comp-002', 
      name: 'STC Transport',
      licenseNumber: 'STC-2024-002',
      phone: '+233244789012',
      email: 'info@stctransport.com',
      address: 'Kumasi Central, Ashanti',
      logoUrl: 'https://images.unsplash.com/photo-1565192845671-ca5d751a49f9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHx0cmFuc3BvcnQlMjBnb3Zlcm5tZW50JTIwbG9nb3xlbnwwfDJ8fHJlZHwxNzU1MzYxNjU0fDA&ixlib=rb-4.1.0&q=85',
      isActive: true,
      createdAt: '2024-01-20T09:00:00Z'
    }
  ],
  routes: [
    {
      id: 'route-001',
      companyId: 'comp-001',
      origin: 'Accra',
      destination: 'Kumasi',
      distanceKm: 250,
      baseFare: 45.00,
      estimatedDurationMinutes: 240,
      isActive: true
    },
    {
      id: 'route-002',
      companyId: 'comp-001', 
      origin: 'Kumasi',
      destination: 'Tamale',
      distanceKm: 350,
      baseFare: 65.00,
      estimatedDurationMinutes: 300,
      isActive: true
    },
    {
      id: 'route-003',
      companyId: 'comp-002',
      origin: 'Accra',
      destination: 'Takoradi',
      distanceKm: 230,
      baseFare: 40.00,
      estimatedDurationMinutes: 210,
      isActive: true
    }
  ],
  buses: [
    {
      id: 'bus-001',
      companyId: 'comp-001',
      registrationNumber: 'GR-2024-VIP',
      capacity: 45,
      passengerCapacity: 43,
      reservedSeats: ['1A', '1B'],
      busType: BusType.VIP as const,
      isActive: true
    },
    {
      id: 'bus-002',
      companyId: 'comp-001',
      registrationNumber: 'GR-2024-STD',
      capacity: 50,
      passengerCapacity: 48,
      reservedSeats: ['1A', '1B'],
      busType: BusType.STANDARD as const,
      isActive: true
    }
  ],
  trips: [
    {
      id: 'trip-001',
      routeId: 'route-001',
      busId: 'bus-001',
      departureDate: new Date().toISOString().split('T')[0], // Today's date
      departureTime: '08:00',
      passengerSeatsAvailable: 35,
      status: TripStatus.SCHEDULED as const,
      route: {
        origin: 'Accra',
        destination: 'Kumasi',
        baseFare: 45.00
      },
      bus: {
        registrationNumber: 'GR-2024-VIP',
        busType: BusType.VIP as const
      }
    },
    {
      id: 'trip-002',
      routeId: 'route-002',
      busId: 'bus-002', 
      departureDate: new Date().toISOString().split('T')[0], // Today's date
      departureTime: '14:00',
      passengerSeatsAvailable: 42,
      status: TripStatus.SCHEDULED as const,
      route: {
        origin: 'Kumasi',
        destination: 'Tamale',
        baseFare: 65.00
      },
      bus: {
        registrationNumber: 'GR-2024-STD',
        busType: BusType.STANDARD as const
      }
    },
    {
      id: 'trip-003',
      routeId: 'route-001',
      busId: 'bus-001',
      departureDate: new Date().toISOString().split('T')[0], // Today's date
      departureTime: '16:00',
      passengerSeatsAvailable: 40,
      status: TripStatus.SCHEDULED as const,
      route: {
        origin: 'Accra',
        destination: 'Kumasi',
        baseFare: 45.00
      },
      bus: {
        registrationNumber: 'GR-2024-VIP',
        busType: BusType.VIP as const
      }
    },
    {
      id: 'trip-004',
      routeId: 'route-003',
      busId: 'bus-002',
      departureDate: new Date().toISOString().split('T')[0], // Today's date
      departureTime: '10:00',
      passengerSeatsAvailable: 38,
      status: TripStatus.SCHEDULED as const,
      route: {
        origin: 'Accra',
        destination: 'Takoradi',
        baseFare: 40.00
      },
      bus: {
        registrationNumber: 'GR-2024-STD',
        busType: BusType.STANDARD as const
      }
    }
  ],
  tickets: [
    {
      id: 'ticket-001',
      ticketCode: '12345678',
      tripId: 'trip-001',
      passengerPhone: '+233244567890',
      passengerName: 'Akosua Mensah',
      seatNumber: '12A',
      farePaid: 45.00,
      paymentMethod: PaymentMethod.CASH as const,
      status: TicketStatus.BOOKED as const,
      smsSent: true,
      createdAt: '2024-12-19T10:30:00Z'
    },
    {
      id: 'ticket-002',
      ticketCode: '87654321',
      tripId: 'trip-001',
      passengerPhone: '+233244111222',
      passengerName: 'Kofi Asante',
      seatNumber: '15B',
      farePaid: 45.00,
      paymentMethod: PaymentMethod.MOMO_MTN as const,
      status: TicketStatus.BOOKED as const,
      smsSent: true,
      createdAt: '2024-12-19T11:15:00Z'
    }
  ],
  analytics: {
    todayRevenue: 1250.00,
    todayBookings: 28,
    weeklyRevenue: 8750.00,
    monthlyRevenue: 35000.00,
    popularRoutes: [
      { route: 'Accra → Kumasi', bookings: 156, revenue: 7020.00 },
      { route: 'Kumasi → Tamale', bookings: 89, revenue: 5785.00 },
      { route: 'Accra → Takoradi', bookings: 67, revenue: 2680.00 }
    ],
    dailyStats: [
      { date: '2024-12-15', bookings: 45, revenue: 2025.00 },
      { date: '2024-12-16', bookings: 52, revenue: 2340.00 },
      { date: '2024-12-17', bookings: 38, revenue: 1710.00 },
      { date: '2024-12-18', bookings: 61, revenue: 2745.00 },
      { date: '2024-12-19', bookings: 28, revenue: 1260.00 }
    ]
  }
};

// Mock data for root component props
export const mockRootProps = {
  initialRoute: '/dashboard',
  userRole: UserRole.CASHIER as const
};
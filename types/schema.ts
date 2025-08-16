import { BusType, PaymentMethod, TicketStatus, TripStatus, UserRole } from './enums';

// Props types (data passed to components)
export interface AuthFormProps {
  onLogin: (email: string, password: string) => void;
  loading?: boolean;
  error?: string;
}

export interface BookingFormProps {
  routes: Route[];
  onBookTicket: (booking: BookingData) => void;
  loading?: boolean;
}

export interface SeatMapProps {
  bus: Bus;
  occupiedSeats: string[];
  selectedSeat?: string;
  onSeatSelect: (seatNumber: string) => void;
}

export interface TicketPreviewProps {
  ticket: Ticket;
  trip: Trip;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface AnalyticsChartProps {
  data: AnalyticsData;
  chartType: 'revenue' | 'bookings' | 'routes';
}

// Store types (global state data)
export interface UserState {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string;
  stationLocation?: string;
  isActive: boolean;
}

export interface AppState {
  user: UserState | null;
  selectedCompany: Company | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Query types (API response data)
export interface Company {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
  address: string;
  logoUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface Route {
  id: string;
  companyId: string;
  origin: string;
  destination: string;
  distanceKm: number;
  baseFare: number;
  estimatedDurationMinutes: number;
  isActive: boolean;
}

export interface Bus {
  id: string;
  companyId: string;
  registrationNumber: string;
  capacity: number;
  passengerCapacity: number;
  reservedSeats: string[];
  busType: BusType;
  isActive: boolean;
}

export interface Trip {
  id: string;
  routeId: string;
  busId: string;
  departureDate: string;
  departureTime: string;
  passengerSeatsAvailable: number;
  status: TripStatus;
  route?: {
    origin: string;
    destination: string;
    baseFare: number;
  };
  bus?: {
    registrationNumber: string;
    busType: BusType;
  };
}

export interface Ticket {
  id: string;
  ticketCode: string;
  tripId: string;
  passengerPhone: string;
  passengerName: string;
  seatNumber: string;
  farePaid: number;
  paymentMethod: PaymentMethod;
  status: TicketStatus;
  smsSent: boolean;
  createdAt: string;
}

export interface BookingData {
  tripId: string;
  passengerName: string;
  passengerPhone: string;
  seatNumber?: string; // Optional - will be auto-assigned if not provided
  paymentMethod: PaymentMethod;
  paymentReference?: string;
}

export interface AnalyticsData {
  todayRevenue: number;
  todayBookings: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  popularRoutes: Array<{
    route: string;
    bookings: number;
    revenue: number;
  }>;
  dailyStats: Array<{
    date: string;
    bookings: number;
    revenue: number;
  }>;
}
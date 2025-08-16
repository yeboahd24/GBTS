// User roles in the system
export enum UserRole {
  ADMIN = 'admin',
  COMPANY_ADMIN = 'company_admin', 
  CASHIER = 'cashier'
}

// Bus types available
export enum BusType {
  STANDARD = 'standard',
  VIP = 'vip',
  EXECUTIVE = 'executive'
}

// Payment methods supported
export enum PaymentMethod {
  CASH = 'cash',
  MOMO_MTN = 'momo_mtn',
  MOMO_VODAFONE = 'momo_vodafone', 
  MOMO_AIRTELTIGO = 'momo_airteltigo',
  CARD = 'card'
}

// Ticket status types
export enum TicketStatus {
  BOOKED = 'booked',
  CHECKED_IN = 'checked_in',
  USED = 'used',
  CANCELLED = 'cancelled'
}

// Trip status types
export enum TripStatus {
  SCHEDULED = 'scheduled',
  BOARDING = 'boarding',
  DEPARTED = 'departed',
  ARRIVED = 'arrived',
  CANCELLED = 'cancelled'
}
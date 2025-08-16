import { BusType, PaymentMethod, TicketStatus, TripStatus, UserRole } from '../types/enums';

export const formatCurrency = (amount: number): string => {
  return `GH₵ ${amount.toFixed(2)}`;
};

export const formatPhoneNumber = (phone: string): string => {
  // Format Ghana phone numbers
  if (phone.startsWith('233')) {
    return `+${phone}`;
  }
  if (phone.startsWith('0')) {
    return `+233${phone.slice(1)}`;
  }
  return phone;
};

export const formatTicketCode = (code: string): string => {
  // Format 8-digit ticket code with dashes
  return code.replace(/(\d{4})(\d{4})/, '$1-$2');
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const formatDistance = (km: number): string => {
  return `${km} km`;
};

export const formatBusType = (type: BusType): string => {
  switch (type) {
    case BusType.STANDARD:
      return 'Standard';
    case BusType.VIP:
      return 'VIP';
    case BusType.EXECUTIVE:
      return 'Executive';
    default:
      return type;
  }
};

export const formatPaymentMethod = (method: PaymentMethod): string => {
  switch (method) {
    case PaymentMethod.CASH:
      return 'Cash';
    case PaymentMethod.MOMO_MTN:
      return 'MTN Mobile Money';
    case PaymentMethod.MOMO_VODAFONE:
      return 'Vodafone Cash';
    case PaymentMethod.MOMO_AIRTELTIGO:
      return 'AirtelTigo Money';
    case PaymentMethod.CARD:
      return 'Card';
    default:
      return method;
  }
};

export const formatUserRole = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return 'System Admin';
    case UserRole.COMPANY_ADMIN:
      return 'Company Admin';
    case UserRole.CASHIER:
      return 'Cashier';
    default:
      return role;
  }
};

export const formatTicketStatus = (status: TicketStatus): string => {
  switch (status) {
    case TicketStatus.BOOKED:
      return 'Booked';
    case TicketStatus.CHECKED_IN:
      return 'Checked In';
    case TicketStatus.USED:
      return 'Used';
    case TicketStatus.CANCELLED:
      return 'Cancelled';
    default:
      return status;
  }
};

export const formatTripStatus = (status: TripStatus): string => {
  switch (status) {
    case TripStatus.SCHEDULED:
      return 'Scheduled';
    case TripStatus.BOARDING:
      return 'Boarding';
    case TripStatus.DEPARTED:
      return 'Departed';
    case TripStatus.ARRIVED:
      return 'Arrived';
    case TripStatus.CANCELLED:
      return 'Cancelled';
    default:
      return status;
  }
};